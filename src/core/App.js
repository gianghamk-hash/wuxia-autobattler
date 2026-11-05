import { CONFIG } from '../config.js';
import { GameEngine } from './GameEngine.js';
import { StateManager, GAME_STATE } from './StateManager.js';
import { bus, EVT } from './EventBus.js';
import { Campaign, itemCount } from './Campaign.js';
import { MAIN_QUESTS, RECRUIT_QUESTS, ENDINGS } from '../data/QuestsData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { getSectName } from '../data/SectsData.js';
import { getActiveSynergies } from '../data/SynergiesData.js';
import { changeSect } from '../entities/HeroBuild.js';
import { BattleRenderer } from '../ui/BattleRenderer.js';
import { DialogueUI } from '../ui/DialogueUI.js';
import { mountFormationUI } from '../ui/FormationUI.js';
import { mountSkillTreeUI } from '../ui/SkillTreeUI.js';
import { mountCodexUI } from '../ui/CodexUI.js';
import { mountSaveUI } from '../ui/SaveUI.js';
import { SoundManager } from '../audio/SoundManager.js';
const el = id => document.getElementById(id);
function node(tag, text, className) { const result = document.createElement(tag); if (text !== undefined) result.textContent = text; if (className) result.className = className; return result; }
const STATES = { title: 'TITLE', camp: 'CAMP', roster: 'ROSTER', profile: 'CAMP', codex: 'CAMP', saves: 'CAMP', settings: 'CAMP', dialogue: 'DIALOGUE', battle: 'BATTLE', ending: 'ENDING' };
export class App {
  constructor() {
    this.engine = new GameEngine(); this.states = new StateManager(); this.sound = new SoundManager(); this.view = 'title';
    this.ready = false; this.hasLoaded = false; this.frameTime = 0; this.unitNodes = new Map(); this.lastSfx = 0;
    this.renderer = new BattleRenderer(el('game-canvas')); this.dialogue = new DialogueUI(el('dialogue-root'));
    this.model = new Campaign({ onChange: reason => this.changed(reason), onBattleEvent: event => this.battleEvent(event) });
  }
  toast(message, error = false) { el('app-message').textContent = message; el('app-message').dataset.error = String(error); }
  run(action) { try { return action(); } catch (error) { this.toast(error.message, true); return null; } }
  async init() {
    this.states.go(GAME_STATE.TITLE);
    this.progress = mountSkillTreeUI({ getState: () => this.model.session, allowTraining: false,
      canEdit: () => !this.model.running && Boolean(this.model.session.hero.sect),
      onChange: (hero, inventory) => this.model.updateProfile(hero, inventory) });
    this.formation = mountFormationUI({ root: el('formation-root'), getState: () => this.model.session,
      canEdit: () => !this.model.running, onMove: formation => this.model.setFormation(formation), onError: text => this.toast(text, true) });
    mountCodexUI(); this.bind();
    this.ready = true;
    this.storage = await mountSaveUI({ getSnapshot: () => this.snapshot(), restoreSnapshot: data => this.restore(data),
      resetSession: () => { this.model.newGame({}); this.hasLoaded = false; this.setView('title'); }, engine: this.engine,
      onRename: name => this.model.rename(name) });
    this.engine.addUpdater(dt => this.model.update(dt));
    this.engine.addRenderer((_alpha, dt) => {
      if (this.view === 'battle') this.renderer.render(dt);
      this.frameTime += dt;
      if (this.frameTime >= .2) { this.frameTime = 0; this.updateBattleStatus(); }
    });
    bus.on(EVT.FRAME, ({ frameDt }) => { if (this.view !== 'title' && !this.engine.paused && !document.hidden) this.model.session.playtimeSeconds += frameDt; });
    bus.on(EVT.TIMESCALE_CHANGED, () => this.syncSpeed());
    this.engine.start(); this.refresh(); this.setView('title'); el('boot-status').hidden = true;
    if (!this.storage.backend) this.toast('Trình duyệt chưa cho lưu tự động. Bạn vẫn có thể chơi và xuất file ở mục Lưu / Tải.', true);
    window.__game = this; // inspection only; no hidden campaign shortcuts
    window.addEventListener('resize', () => this.renderer.resize());
    document.addEventListener('visibilitychange', () => this.sound.visibilityChanged());
    window.addEventListener('pagehide', () => { this.sound.setMuted(true); this.engine.stop(); });
    window.addEventListener('pageshow', () => { this.sound.setMuted(this.model.session.settings.muted); this.engine.start(); });
  }
  bind() {
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => this.run(() => this.setView(button.dataset.view))));
    el('brand-home').addEventListener('click', event => { event.preventDefault(); this.run(() => this.setView(this.model.session.hero.sect ? 'camp' : 'title')); });
    el('new-game-form').addEventListener('submit', event => {
      event.preventDefault(); this.run(() => {
        if (this.model.session.storyProgress.completedQuests.length && !window.confirm('Khởi hành mới sẽ thay ô tự lưu. Năm ô thủ công được giữ nguyên. Tiếp tục?')) return;
        this.model.newGame({ name: el('hero-name').value.trim(), sect: el('hero-sect').value }); this.hasLoaded = true; this.refresh();
        this.setView('camp'); this.toast('Hãy mở chính truyện để bắt đầu từ quán trọ Rồng Lửa.'); this.unlockIfEnabled();
      });
    });
    el('btn-continue').addEventListener('click', () => this.run(() => {
      if (!this.model.session.hero.sect) this.model.updateProfile(changeSect(this.model.session.hero, el('hero-sect').value, this.model.session.inventory), this.model.session.inventory);
      this.setView(this.model.session.storyProgress.endingId ? 'ending' : 'camp'); this.unlockIfEnabled();
    }));
    for (const id of ['btn-title-saves']) el(id).addEventListener('click', () => this.run(() => this.setView('saves')));
    for (const id of ['btn-saves-title', 'btn-settings-title', 'btn-ending-title']) el(id).addEventListener('click', () => this.run(() => this.setView('title')));
    el('btn-camp-roster').addEventListener('click', () => this.run(() => this.setView('roster')));
    el('btn-main-quest').addEventListener('click', () => this.run(() => this.showMain()));
    el('btn-resume-battle').addEventListener('click', () => this.run(() => { this.clearBattle(); this.model.retryEncounter(); this.enterBattle(); }));
    el('btn-practice').addEventListener('click', () => this.run(() => { this.clearBattle(); this.model.practice(); this.enterBattle(); }));
    document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => this.run(() => { this.model.buy(button.dataset.buy); this.toast('Đã mua vật phẩm.'); this.sound.sfx('click'); })));
    el('btn-pause').addEventListener('click', () => this.engine.togglePause());
    document.querySelectorAll('[data-scale]').forEach(button => button.addEventListener('click', () => this.engine.setTimeScale(Number(button.dataset.scale))));
    window.addEventListener('keydown', event => {
      if (this.view !== 'battle' || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, select, textarea, button, summary, [contenteditable]')) return;
      if (event.code === 'Space') { event.preventDefault(); this.engine.togglePause(); }
      if (['Digit1', 'Digit2', 'Digit3'].includes(event.code)) this.engine.setTimeScale(Number(event.code.slice(-1)));
    });
    el('btn-retreat').addEventListener('click', () => this.run(() => this.model.retreat()));
    el('btn-battle-camp').addEventListener('click', () => this.run(() => this.setView('camp')));
    el('btn-ending-camp').addEventListener('click', () => this.run(() => this.setView('camp')));
    el('btn-audio').addEventListener('click', async () => {
      try {
        const muted = !this.model.session.settings.muted;
        if (!muted) await this.sound.unlock();
        this.model.setSettings({ muted }); this.applyAudio();
      } catch (error) { this.toast(error.message, true); }
    });
    el('audio-volume').addEventListener('input', () => this.run(() => this.model.setSettings({ volume: Number(el('audio-volume').value) / 100 })));
    el('version-label').textContent = `Phiên bản ${CONFIG.VERSION} · Chiến dịch ba hồi · Lưu ngoại tuyến trên thiết bị`;
  }
  unlockIfEnabled() { if (!this.model.session.settings.muted) this.sound.unlock().catch(error => this.toast(error.message, true)); }
  applyAudio() {
    const { muted, volume } = this.model.session.settings;
    this.sound.setMuted(muted); this.sound.setVolume(volume); el('audio-volume').value = String(Math.round(volume * 100));
    el('btn-audio').textContent = muted ? 'Bật âm thanh' : 'Tắt âm thanh'; el('btn-audio').setAttribute('aria-pressed', String(!muted));
    el('audio-status').textContent = `${muted ? 'Đang tắt' : 'Đã bật'} · Âm lượng ${Math.round(volume * 100)}%`;
  }
  setView(view) {
    if (!Object.hasOwn(STATES, view)) throw new Error('Màn hình không tồn tại.');
    if (this.model.running && view !== 'battle') throw new Error('Hãy kết thúc hoặc rút lui trước khi rời trận.');
    const target = STATES[view];
    if (this.states.current !== target) {
      const current = this.states.current;
      if ((current === 'TITLE' && !['CAMP', 'DIALOGUE'].includes(target)) || (current === 'ROSTER' && target !== 'BATTLE') ||
          (current === 'BATTLE' && target !== 'DIALOGUE') || (current === 'DIALOGUE' && target === 'ROSTER') || (current === 'ENDING' && target !== 'TITLE')) this.states.go('CAMP');
      if (this.states.current !== target && !this.states.go(target)) throw new Error('Không thể chuyển màn hình lúc này.');
    }
    this.view = view;
    for (const id of Object.keys(STATES)) el(`view-${id}`).hidden = id !== view;
    el('main-nav').hidden = view === 'title' || (!this.model.session.hero.sect && view === 'saves');
    document.querySelectorAll('[data-view]').forEach(button => { button.setAttribute('aria-current', button.dataset.view === view ? 'page' : 'false'); button.disabled = this.model.running; });
    this.sound.setTrack(view === 'battle' && this.model.running ? 'battle' : view === 'title' ? 'title' : view === 'ending' ? 'ending' : 'camp');
    if (view === 'battle') this.renderer.resize();
    if (view === 'ending') this.renderEnding();
    const section = el(`view-${view}`); section.tabIndex = -1; section.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  snapshot() {
    const data = this.model.snapshot(); data.version = CONFIG.VERSION; data.timestamp = Date.now();
    data.engineDemo = { x: 0, dir: 1, simTime: this.engine.simTime, tickCount: this.engine.tickCount,
      timeScale: this.engine.timeScale, resumeScale: this.engine.resumeScale }; return data;
  }
  restore(data) {
    this.model.load(data); this.hasLoaded = true;
    this.engine.restoreClock(data.engineDemo?.simTime ?? 0, data.engineDemo?.tickCount ?? 0);
    this.engine.setTimeScale(data.engineDemo?.resumeScale ?? 1); this.engine.setTimeScale(data.engineDemo?.timeScale ?? 1);
    el('hero-name').value = this.model.session.hero.name; el('hero-sect').value = this.model.session.hero.sect ?? 'VoDang';
    this.renderer.setBattle(null); this.clearBattle(); this.refresh();
    this.setView(this.model.session.hero.sect ? 'camp' : 'title');
    if (this.model.session.legacyProgress) this.toast('Hồ sơ từ bản thử đã được giữ lại. Cốt truyện mới bắt đầu ở Hồi 1.');
  }
  changed(reason) {
    if (!this.ready) return;
    if (reason === 'settings') { this.applyAudio(); bus.emit(EVT.SAVE_REQUESTED); return; }
    if (['new', 'restore'].includes(reason)) el('save-name').value = this.model.session.hero.name;
    if (reason === 'new') { el('hero-name').value = this.model.session.hero.name; this.clearBattle(); }
    this.refresh();
    if (reason === 'battle-result') { this.renderResult(); bus.emit(EVT.BATTLE_STATE_CHANGED, { running: false }); }
    if (reason !== 'restore') bus.emit(EVT.SAVE_REQUESTED);
  }
  refresh() {
    const session = this.model.session, quest = this.model.mainQuest(), pending = session.storyProgress.pendingEncounter;
    el('hero-hud').textContent = `${session.hero.name} · Cấp ${session.hero.level} · ${itemCount(session, 'silver')} bạc`;
    el('act-label').textContent = `HỒI ${session.storyProgress.currentAct} · NHÂN NGHĨA ${session.storyProgress.karmaScore}`;
    el('main-quest-title').textContent = quest?.title ?? 'Một đoạn đường đã khép lại';
    el('main-quest-note').textContent = quest ? `${quest.location}${quest.objective ? ' · Cần chiêu mộ Lão Tam và Tiểu Muội.' : ''}` : 'Bạn có thể xem lại kết cục, tiếp tục luyện võ hoặc khởi hành một hành trình khác.';
    el('btn-main-quest').textContent = quest ? quest.ending ? 'Chọn con đường cuối' : 'Tiếp tục câu chuyện' : 'Xem kết cục';
    el('btn-main-quest').disabled = !session.hero.sect || Boolean(pending);
    el('btn-resume-battle').hidden = !pending; el('btn-practice').disabled = !session.hero.sect || Boolean(pending);
    el('shop-inventory').textContent = `Bạc ${itemCount(session, 'silver')} · Dây ${itemCount(session, 'rope')} · Cá ${itemCount(session, 'food_fish')} · Trà ${itemCount(session, 'tea')}`;
    el('btn-continue').disabled = !this.hasLoaded;
    const party = el('party-summary'); party.replaceChildren();
    for (const id of session.party.active) party.append(node('p', `${COMPANIONS_BY_ID[id].name} · Duyên nợ ${session.companionsAffinity[id] ?? 0}/100`));
    if (!session.party.active.length) party.append(node('p', 'Chưa có đồng đội xuất chiến. Gặp người mới sau trận mở đầu.'));
    const sects = [session.hero.sect, ...session.party.active.map(id => COMPANIONS_BY_ID[id].sect)].filter(Boolean);
    el('active-synergies').textContent = `Kích duyên: ${getActiveSynergies(sects).map(s => s.name).join(' · ') || 'Chưa có'}`;
    this.renderRoster(); this.formation?.render(); this.progress?.refresh(); this.applyAudio(); this.syncSpeed();
    document.querySelectorAll('[data-view]').forEach(button => { button.disabled = this.model.running; });
  }
  renderRoster() {
    const session = this.model.session, root = el('roster-list'); root.replaceChildren();
    for (const id of session.party.unlocked) {
      const unit = COMPANIONS_BY_ID[id], card = node('article', undefined, 'roster-card'), active = session.party.active.includes(id);
      card.append(node('span', unit.name.slice(0, 1), 'avatar-mark'), node('h3', unit.name), node('p', `${getSectName(unit.sect)} · Duyên nợ ${session.companionsAffinity[id] ?? 0}/100`), node('p', unit.skills.ultimate.description));
      const controls = node('div', undefined, 'controls'), toggle = node('button', active ? 'Rời đội xuất chiến' : 'Chọn xuất chiến'); toggle.type = 'button'; toggle.dataset.partyId = id;
      toggle.disabled = this.model.running || (!active && session.party.active.length >= 2);
      toggle.addEventListener('click', () => this.run(() => this.model.setParty(active ? session.party.active.filter(key => key !== id) : [...session.party.active, id])));
      const gift = node('button', 'Tặng trà · +5 duyên'); gift.type = 'button'; gift.disabled = this.model.running || itemCount(session, 'tea') < 1 || session.companionsAffinity[id] >= 100;
      gift.addEventListener('click', () => this.run(() => { this.model.gift(id); this.toast('Duyên nợ đã tăng.'); })); controls.append(toggle, gift); card.append(controls); root.append(card);
    }
    if (!session.party.unlocked.length) root.append(node('p', 'Chưa có đồng đội. Hoàn thành trận mở đầu để mở các cuộc gặp gỡ.'));
    const recruits = el('recruit-list'); recruits.replaceChildren(); const available = this.model.availableRecruitQuests();
    for (const quest of RECRUIT_QUESTS) {
      const owned = session.party.unlocked.includes(quest.companionId), card = node('article', undefined, 'roster-card');
      card.append(node('span', `Hồi ${quest.act}`, 'eyebrow'), node('h3', quest.title), node('p', quest.description));
      const button = node('button', owned ? 'Đã đồng hành' : 'Gặp gỡ'); button.type = 'button'; button.dataset.recruitId = quest.id;
      button.disabled = owned || !available.includes(quest) || this.model.running || Boolean(session.storyProgress.pendingEncounter);
      button.addEventListener('click', () => this.run(() => this.showRecruit(quest))); card.append(button); recruits.append(card);
    }
  }
  showMain() {
    const quest = this.model.mainQuest();
    if (!quest) { this.setView('ending'); return; }
    const selected = this.model.session.storyProgress.decisions[quest.id];
    const choices = quest.ending ? this.model.endingOptions().map(e => ({ id: e.id, text: `${e.name} — ${e.requirement}`, disabled: !e.available })) : quest.choices.filter(c => !selected || selected === c.id).map(c => ({ id: c.id, text: c.text }));
    this.dialogue.show({ title: quest.title, lines: quest.lines, choices,
      note: quest.objective ? 'Mở mục Đồng đội ở doanh trại để giúp Lão Tam và Tiểu Muội trước khi tiếp tục.' : '',
      onBack: () => this.setView('camp'), onChoice: id => this.run(() => {
        this.sound.sfx('click');
        if (quest.ending) { this.model.chooseEnding(id); this.setView('ending'); return; }
        this.clearBattle(); const battle = this.model.chooseMain(id); if (battle) this.enterBattle(); else { this.setView('camp'); this.toast('Nhiệm vụ hoàn tất. Phần thưởng đã được lưu.'); }
      }) }); this.setView('dialogue');
  }
  showRecruit(quest) {
    const ready = this.model.session.storyProgress.questFlags[`challenge_${quest.id}`];
    const previous = this.model.session.storyProgress.decisions[quest.id];
    let choices = ready ? [{ id: 'invite', text: 'Mời đồng hành' }] : quest.puzzle ? quest.puzzle.options.map((text, index) => ({ id: String(index), text })) : [
      { id: 'help', text: 'Giúp đỡ rồi cùng vượt thử thách' }, { id: 'demand', text: 'Đòi một lời hứa trả công trước' }
    ].filter(c => !previous || previous === c.id);
    this.dialogue.show({ title: quest.title, lines: [...quest.lines, ...(ready ? [[quest.title, 'Chuyện đã giải quyết. Nếu không chê, ta xin đi cùng.']] : quest.puzzle ? [['Tình huống', quest.puzzle.prompt]] : [['Người kể', 'Một nhóm cản đường xuất hiện. Hãy giúp người bạn mới vượt qua.']])], choices,
      note: quest.cost && !ready ? `Cần ${quest.cost.quantity} ${quest.cost.itemId === 'silver' ? 'bạc' : quest.cost.itemId === 'rope' ? 'dây thừng' : 'cá'}. Có thể mua ở doanh trại.` : '',
      onBack: () => this.setView('camp'), onChoice: id => this.run(() => {
        if (id === 'invite') { this.model.recruit(quest.id); this.setView('roster'); this.toast(`${quest.title} đã đồng hành. Nhận XP và bạc của nhiệm vụ.`); }
        else if (quest.puzzle) { this.model.solveRecruit(quest.id, Number(id)); this.showRecruit(quest); this.toast('Thử thách đã hoàn tất. Có thể mời đồng hành.'); }
        else { this.clearBattle(); this.model.challengeRecruit(quest.id, id); this.enterBattle(); }
      }) }); this.setView('dialogue');
  }
  clearBattle() { el('battle-log').replaceChildren(); el('battle-stats').replaceChildren(); el('battle-result-panel').hidden = true; el('unit-inspect').textContent = ''; this.unitNodes.clear(); }
  enterBattle() {
    const battle = this.model.battle; this.renderer.setBattle(battle); el('battle-title').textContent = battle.encounterName;
    const root = el('battle-unit-list'); root.replaceChildren();
    for (const unit of battle.units) {
      const card = node('article', undefined, 'battle-unit-card'); card.dataset.team = unit.team;
      const status = node('p'), inspect = node('button', 'Xem kỹ năng'); inspect.type = 'button';
      inspect.addEventListener('click', () => { el('unit-inspect').textContent = `${unit.name} · ${getSectName(unit.sect)} · ${unit.skills.ultimate.name}: ${unit.skills.ultimate.description}`; });
      card.append(node('strong', unit.name), status, inspect); root.append(card); this.unitNodes.set(unit.id, status);
    }
    bus.emit(EVT.BATTLE_STATE_CHANGED, { running: true });
    this.setView('battle'); this.updateBattleStatus();
    if (this.engine.paused) this.toast('Trận đã sẵn sàng. Bấm Tiếp tục để giao chiến.');
  }
  updateBattleStatus() {
    const battle = this.model.battle; if (!battle || this.view !== 'battle') return;
    el('battle-clock').textContent = `${this.engine.paused ? 'Tạm dừng · ' : ''}${battle.elapsed.toFixed(1)} / 120 giây`;
    el('btn-retreat').disabled = !this.model.running;
    for (const unit of battle.units) if (this.unitNodes.has(unit.id)) this.unitNodes.get(unit.id).textContent = `${unit.alive ? `${Math.ceil(unit.stats.hp)}/${unit.stats.maxHp} HP · ${Math.floor(unit.stats.energy)} nộ` : 'Đã bị hạ'}${unit.stunned ? ' · Choáng' : ''}${unit.shield > 0 ? ` · Khiên ${Math.ceil(unit.shield)}` : ''}`;
  }
  battleEvent(event) {
    this.renderer.event(event);
    const name = id => this.model.battle?.units.find(u => u.id === id)?.name ?? 'Hiệu ứng';
    let text = '';
    if (event.type === 'damage') text = `${name(event.targetId)} nhận ${Math.ceil(event.amount)} sát thương${event.crit ? ' bạo kích' : ''}${event.absorbed ? `; khiên đỡ ${Math.ceil(event.absorbed)}` : ''}`;
    if (event.type === 'heal') text = `${name(event.targetId)} hồi ${Math.ceil(event.amount)} HP`;
    if (event.type === 'ultimate') text = `${name(event.actorId)} tung ${event.name}`;
    if (event.type === 'death') text = `${name(event.targetId)} bị hạ`;
    if (event.type === 'synergy') text = `${event.team === 'home' ? 'Đội nhà' : 'Đội địch'} kích duyên ${event.name}`;
    if (text) { const row = node('li', `${event.time.toFixed(1)}s · ${text}`), log = el('battle-log'); log.prepend(row); while (log.children.length > 100) log.lastChild.remove(); }
    if (performance.now() - this.lastSfx > 100 && ['damage', 'heal', 'ultimate', 'death'].includes(event.type)) {
      this.sound.sfx(event.type === 'damage' ? (event.damageType === 'magical' ? 'magic' : 'hit') : event.type); this.lastSfx = performance.now();
    }
  }
  renderResult() {
    const result = this.model.lastResult; if (!result) return;
    el('battle-result-panel').hidden = false;
    const label = result.reason === 'aborted' ? 'Đã rút lui' : result.reason === 'timeout' ? 'Hòa — hết thời gian' : result.winner === 'home' ? 'Chiến thắng!' : result.winner === 'enemy' ? 'Thất bại' : 'Hòa';
    el('battle-result').textContent = `${label} · ${result.duration.toFixed(1)} giây`;
    el('battle-rewards').textContent = result.winner !== 'home' ? 'Không mất vật phẩm hay kinh nghiệm. Có thể đổi đội hình, nâng kỹ năng rồi thử lại.' : result.kind === 'recruit' ? 'Thử thách đã hoàn tất. Quay lại gặp nhân vật để mời đồng hành và nhận thưởng.' : `Nhận ${result.rewards.xp} XP và ${result.rewards.silver} bạc. Đã tự lưu tiến trình.`;
    const table = node('table'), head = node('thead'), header = node('tr');
    for (const title of ['Nhân vật', 'Sát thương', 'Hồi máu', 'Hạ gục', 'Tuyệt kỹ']) header.append(node('th', title)); head.append(header); table.append(head);
    const body = node('tbody'); for (const stat of result.statistics) { const row = node('tr'); for (const value of [stat.name, Math.ceil(stat.damage), Math.ceil(stat.healing), stat.kills, stat.ultimates]) row.append(node('td', String(value))); body.append(row); }
    table.append(body); el('battle-stats').replaceChildren(table);
    this.sound.setTrack(result.winner === 'home' ? 'ending' : 'camp'); this.sound.sfx(result.winner === 'home' ? 'victory' : 'defeat');
    this.updateBattleStatus();
  }
  renderEnding() {
    const ending = ENDINGS.find(e => e.id === this.model.session.storyProgress.endingId); if (!ending) { this.toast('Câu chuyện chưa đến kết cục.', true); return; }
    el('ending-title').textContent = ending.name; const root = el('ending-story'); root.replaceChildren();
    for (const [speaker, text] of ending.lines) { const p = node('p', `${speaker}: ${text}`); root.append(p); }
    el('ending-summary').textContent = `${this.model.session.hero.name} · Cấp ${this.model.session.hero.level} · ${this.model.session.party.unlocked.length}/20 người đồng hành · ${Math.floor(this.model.session.playtimeSeconds / 60)} phút phiêu lưu`;
  }
  syncSpeed() {
    el('btn-pause').textContent = this.engine.paused ? 'Tiếp tục' : 'Tạm dừng'; el('btn-pause').setAttribute('aria-pressed', String(this.engine.paused));
    document.querySelectorAll('[data-scale]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.scale) === this.engine.timeScale)));
  }
}
