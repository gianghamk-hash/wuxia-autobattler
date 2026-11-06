import { mountGachaUI } from '../ui/GachaUI.js';
import { storyLines } from '../data/StoryChaptersData.js';
import { rarityLabel } from '../data/GachaData.js';
import { mountWorldUI } from '../ui/WorldUI.js';
import { STATUS_LABELS } from '../data/StrategyData.js';
import { CONFIG } from '../config.js';
import { GameEngine } from './GameEngine.js';
import { StateManager, GAME_STATE } from './StateManager.js';
import { bus, EVT } from './EventBus.js';
import { Campaign, itemCount } from './Campaign.js';
import { MAIN_QUESTS, RECRUIT_QUESTS, ENDINGS } from '../data/QuestsData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { getSectName, SECTS } from '../data/SectsData.js';
import { getActiveSynergies } from '../data/SynergiesData.js';
import { changeSect, expToNextLevel } from '../entities/HeroBuild.js';
import { Hero } from '../entities/Hero.js';
import {
  portrait,
  decorateRarity,
  stylePortrait,
  icon,
  decorateIcons,
  SECT_ART
} from '../ui/Visuals.js';
import { BattleRenderer } from '../ui/BattleRenderer.js';
import { DialogueUI, speakerPortrait } from '../ui/DialogueUI.js';
import { mountFormationUI } from '../ui/FormationUI.js';
import { mountSkillTreeUI } from '../ui/SkillTreeUI.js';
import { mountCodexUI } from '../ui/CodexUI.js';
import { mountSaveUI } from '../ui/SaveUI.js';
import { SoundManager } from '../audio/SoundManager.js';
import { renderJourneyRoster, renderBattleAdvice } from '../ui/JourneyUI.js';
import { battleScene } from '../data/PresentationData.js';
import { battleIntent } from '../combat/BattleIntent.js';
import { storyPerson, isDaiViet, PLOT_UNLOCKS } from '../data/DaiVietCast.js';
import { resolveDaiVietQuest } from '../data/DaiVietStoryData.js';
import {ENROLLMENT_QUEST,sectReady,storyHeroBuild,heroAppearance,heroSectLabel,heroLines} from '../data/HeroIdentity.js';
import { renderMissionStatus } from '../ui/MissionUI.js';
import { mountUsability } from '../ui/UsabilityUI.js';
const el = (id) => document.getElementById(id);
function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
}
const STATES = {
  title: 'TITLE',
  camp: 'CAMP',
  roster: 'ROSTER',
  profile: 'CAMP',
  codex: 'CAMP',
  saves: 'CAMP',
  settings: 'CAMP',
  tavern: 'CAMP',
  dungeons: 'CAMP',
  dialogue: 'DIALOGUE',
  battle: 'BATTLE',
  ending: 'ENDING'
};
export class App {
  constructor() {
    this.engine = new GameEngine();
    this.states = new StateManager();
    this.sound = new SoundManager();
    this.view = 'title';
    this.cinematicRemaining = 0;
    this.effectTimer = null;
    this.impactTimer = null;
    this.lastImpact = 0;
    this.recruitFilter = 'all';
    this.toastTimer = null;
    this.ready = false;
    this.hasLoaded = false;
    this.frameTime = 0;
    this.unitNodes = new Map();
    this.intentNodes = new Map();
    this.lastSfx = 0;
    this.renderer = new BattleRenderer(el('game-canvas'));
    this.dialogue = new DialogueUI(el('dialogue-root'));
    this.model = new Campaign({
      onChange: (reason) => this.changed(reason),
      onBattleEvent: (event) => this.battleEvent(event)
    });
  }
  toast(message, error = false) {
    const status = el('app-message');
    status.textContent = message;
    status.dataset.error = String(error);
    status.dataset.visible = 'true';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(
      () => {
        status.dataset.visible = 'false';
      },
      error ? 8000 : 4500
    );
  }
  run(action) {
    try {
      return action();
    } catch (error) {
      this.toast(error.message, true);
      return null;
    }
  }
  async init() {
    this.states.go(GAME_STATE.TITLE);
    this.progress = mountSkillTreeUI({
      getState: () => ({...this.model.session,hero:storyHeroBuild(this.model.session)}),
      allowTraining: false,
      canEdit: () =>
        !this.model.running && sectReady(this.model.session),
      onChange: (hero, inventory) => this.model.updateProfile(hero, inventory)
    });
    this.formation = mountFormationUI({
      root: el('formation-root'),
      getState: () => this.model.session,
      canEdit: () => !this.model.running,
      onMove: (formation) => this.model.setFormation(formation),
      onError: (text) => this.toast(text, true)
    });
    this.codex=mountCodexUI({getState:()=>this.model.session});
    decorateIcons();
    this.bind();
    for (const id of ['companion-search', 'companion-tier'])
      el(id).addEventListener(
        id === 'companion-search' ? 'input' : 'change',
        () => this.renderRoster()
      );
    this.world = mountWorldUI(this);
    const caseButton = node('button', 'Sổ đầu mối vụ án');
    caseButton.type = 'button';
    caseButton.id = 'btn-casebook';
    caseButton.addEventListener('click', () =>
      this.run(() => this.world.openCasebook())
    );
    el('btn-main-quest').after(caseButton);
    this.gacha = mountGachaUI(this);
    this.usability = mountUsability(this);
    this.ready = true;
    this.storage = await mountSaveUI({
      getSnapshot: () => this.snapshot(),
      restoreSnapshot: (data) => this.restore(data),
      resetSession: () => {
        this.model.newGame({story:new URLSearchParams(location.search).get('story')==='legacy'?'legacy':'dai-viet'});
        this.hasLoaded = false;
        this.setView('title');
      },
      engine: this.engine,
      onRename: (name) => this.model.rename(name)
    });
    this.engine.addUpdater((dt) =>
      this.model.update(dt * (this.cinematicRemaining > 0 ? 0.35 : 1))
    );
    this.engine.addRenderer((_alpha, dt) => {
      if (!this.engine.paused)
        this.cinematicRemaining = Math.max(0, this.cinematicRemaining - dt);
      if (this.view === 'battle') this.renderer.render(dt);
      this.frameTime += dt;
      if (this.frameTime >= 0.2) {
        this.frameTime = 0;
        this.updateBattleStatus();
      }
    });
    bus.on(EVT.FRAME, ({ frameDt }) => {
      if (this.view !== 'title' && !this.engine.paused && !document.hidden)
        this.model.session.playtimeSeconds += frameDt;
    });
    bus.on(EVT.TIMESCALE_CHANGED, () => this.syncSpeed());
    this.engine.start();
    this.refresh();
    this.setView('title');
    el('boot-status').hidden = true;
    if (!this.storage.backend)
      this.toast(
        'Trình duyệt chưa cho lưu tự động. Bạn vẫn có thể chơi và xuất file ở mục Lưu / Tải.',
        true
      );
    window.__game = this; // inspection only; no hidden campaign shortcuts
    window.addEventListener('resize', () => this.renderer.resize());
    document.addEventListener('visibilitychange', () =>
      this.sound.visibilityChanged()
    );
    window.addEventListener('pagehide', () => {
      this.sound.setMuted(true);
      this.engine.stop();
    });
    window.addEventListener('pageshow', () => {
      this.sound.setMuted(this.model.session.settings.muted);
      this.engine.start();
    });
  }
  bind() {
    const picker = el('sect-picker');
    for (const sect of ['ThieuLam', 'VoDang', 'CaiBang', 'NgaMi', 'DuongMon']) {
      const button = node('button', undefined, 'sect-option');
      button.type = 'button';
      button.dataset.sectPick = sect;
      button.setAttribute('aria-label', `Chọn ${getSectName(sect)}`);
      button.append(
        portrait(sect),
        node('span', getSectName(sect), 'sect-name')
      );
      button.addEventListener('click', () => {
        el('hero-sect').value = sect;
        this.syncSectPicker();
        this.sound.sfx('click');
      });
      picker.append(button);
    }
    el('hero-sect').addEventListener('change', () => this.syncSectPicker());
    el('hero-name').addEventListener('input',()=>{if(!this.hasLoaded)this.renderPlayer();});
    this.syncSectPicker();
    document
      .querySelectorAll('[data-profile-tab]')
      .forEach((button) =>
        button.addEventListener('click', () =>
          this.selectProfileTab(button.dataset.profileTab)
        )
      );
    // Follow the WAI-ARIA tabs pattern with roving focus and arrow navigation.
    el('tab-skills').parentElement.addEventListener('keydown', (event) => {
      const tabs = [...document.querySelectorAll('[data-profile-tab]')],
        current = tabs.indexOf(document.activeElement);
      if (
        current < 0 ||
        !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
      )
        return;
      event.preventDefault();
      const index =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) %
              tabs.length;
      tabs[index].focus();
      this.selectProfileTab(tabs[index].dataset.profileTab);
    });
    this.selectProfileTab('skills');
    document.querySelectorAll('[data-recruit-filter]').forEach((button) =>
      button.addEventListener('click', () => {
        this.recruitFilter = button.dataset.recruitFilter;
        document
          .querySelectorAll('[data-recruit-filter]')
          .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        this.renderRoster();
      })
    );
    document
      .querySelectorAll('[data-view]')
      .forEach((button) =>
        button.addEventListener('click', () =>
          this.run(() => this.setView(button.dataset.view))
        )
      );
    el('brand-home').addEventListener('click', (event) => {
      event.preventDefault();
      this.run(() =>
        this.setView(this.hasLoaded ? 'camp' : 'title')
      );
    });
    el('new-game-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.run(() => {
        if (
          this.model.session.storyProgress.completedQuests.length &&
          !window.confirm(
            'Khởi hành mới sẽ thay ô tự lưu. Năm ô thủ công được giữ nguyên. Tiếp tục?'
          )
        )
          return;
        this.model.newGame({
          story:new URLSearchParams(location.search).get('story')==='legacy'?'legacy':'dai-viet',
          name: el('hero-name').value.trim().normalize('NFC'),
          sect: new URLSearchParams(location.search).get('story')==='legacy'?el('hero-sect').value:null
        });
        this.hasLoaded = true;
        this.refresh();
        this.setView('camp');
        this.toast('Mở chính truyện để bắt đầu '+this.model.catalog.title+'.');
        this.unlockIfEnabled();
      });
    });
    el('btn-continue').addEventListener('click', () =>
      this.run(() => {
        if (!isDaiViet(this.model.session)&&!this.model.session.hero.sect)
          this.model.updateProfile(
            changeSect(
              this.model.session.hero,
              el('hero-sect').value,
              this.model.session.inventory
            ),
            this.model.session.inventory
          );
        this.setView(
          this.model.session.storyProgress.endingId ? 'ending' : 'camp'
        );
        this.unlockIfEnabled();
      })
    );
    for (const id of ['btn-title-saves'])
      el(id).addEventListener('click', () =>
        this.run(() => this.setView('saves'))
      );
    for (const id of [
      'btn-saves-title',
      'btn-settings-title',
      'btn-ending-title'
    ])
      el(id).addEventListener('click', () =>
        this.run(() => this.setView('title'))
      );
    el('btn-camp-roster').addEventListener('click', () =>
      this.run(() => {this.usability?.openRoster('formation');this.setView('roster');})
    );
    el('btn-main-quest').addEventListener('click', () =>
      this.run(() => this.showMain())
    );
    el('btn-resume-battle').addEventListener('click', () =>
      this.run(() => {
        this.clearBattle();
        this.model.retryEncounter();
        this.enterBattle();
      })
    );
    el('btn-practice').addEventListener('click', () =>
      this.run(() => {
        this.clearBattle();
        this.model.practice();
        this.enterBattle();
      })
    );
    document.querySelectorAll('[data-buy]').forEach((button) =>
      button.addEventListener('click', () =>
        this.run(() => {
          this.model.buy(button.dataset.buy);
          this.toast('Đã mua vật phẩm.');
          this.sound.sfx('click');
        })
      )
    );
    el('btn-pause').addEventListener('click', () => this.engine.togglePause());
    document
      .querySelectorAll('[data-scale]')
      .forEach((button) =>
        button.addEventListener('click', () =>
          this.engine.setTimeScale(Number(button.dataset.scale))
        )
      );
    window.addEventListener('keydown', (event) => {
      if (
        this.view !== 'battle' ||
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.target.closest(
          'input, select, textarea, button, summary, [contenteditable]'
        )
      )
        return;
      if (event.code === 'Space') {
        event.preventDefault();
        this.engine.togglePause();
      }
      if (['Digit1', 'Digit2', 'Digit3'].includes(event.code))
        this.engine.setTimeScale(Number(event.code.slice(-1)));
    });
    el('btn-retreat').addEventListener('click', () =>
      this.run(() => this.model.retreat())
    );
    el('btn-battle-camp').addEventListener('click', () =>
      this.run(() => this.setView('camp'))
    );
    el('btn-story-next').addEventListener('click',()=>this.run(()=>{
      if(this.view==='battle'&&this.model.lastResult?.winner==='home'&&this.model.lastResult.kind==='main')this.showMain();
    }));
    el('btn-ending-camp').addEventListener('click', () =>
      this.run(() => this.setView('camp'))
    );
    el('btn-audio').addEventListener('click', async () => {
      try {
        const muted = !this.model.session.settings.muted;
        if (!muted) await this.sound.unlock();
        this.model.setSettings({ muted });
        this.applyAudio();
      } catch (error) {
        this.toast(error.message, true);
      }
    });
    el('audio-volume').addEventListener('input', () =>
      this.run(() =>
        this.model.setSettings({
          volume: Number(el('audio-volume').value) / 100
        })
      )
    );
    el('version-label').textContent =
      `Phiên bản ${CONFIG.VERSION} · Chiến dịch ba hồi · Lưu ngoại tuyến trên thiết bị`;
  }
  unlockIfEnabled() {
    if (!this.model.session.settings.muted)
      this.sound.unlock().catch((error) => this.toast(error.message, true));
  }
  applyAudio() {
    const { muted, volume } = this.model.session.settings;
    this.sound.setMuted(muted);
    this.sound.setVolume(volume);
    el('audio-volume').value = String(Math.round(volume * 100));
    el('btn-audio').replaceChildren(icon('sound'));
    el('btn-audio').setAttribute(
      'aria-label',
      muted ? 'Bật âm thanh' : 'Tắt âm thanh'
    );
    el('btn-audio').title = muted ? 'Bật âm thanh' : 'Tắt âm thanh';
    el('btn-audio').setAttribute('aria-pressed', String(!muted));
    el('audio-status').textContent =
      `${muted ? 'Đang tắt' : 'Đã bật'} · Âm lượng ${Math.round(volume * 100)}%`;
  }
  setView(view) {
    if (!Object.hasOwn(STATES, view))
      throw new Error('Màn hình không tồn tại.');
    if (this.model.running && view !== 'battle')
      throw new Error('Hãy kết thúc hoặc rút lui trước khi rời trận.');
    const target = STATES[view];
    if (this.states.current !== target) {
      const current = this.states.current;
      if (
        (current === 'TITLE' && !['CAMP', 'DIALOGUE'].includes(target)) ||
        (current === 'ROSTER' && target !== 'BATTLE') ||
        (current === 'BATTLE' && target !== 'DIALOGUE') ||
        (current === 'DIALOGUE' && target === 'ROSTER') ||
        (current === 'ENDING' && target !== 'TITLE')
      )
        this.states.go('CAMP');
      if (this.states.current !== target && !this.states.go(target))
        throw new Error('Không thể chuyển màn hình lúc này.');
    }
    this.usability?.beforeView(this.view,view);
    this.view = view;
    document.body.dataset.scene = view;
    for (const id of Object.keys(STATES)) el(`view-${id}`).hidden = id !== view;
    el('main-nav').hidden =
      view === 'battle' ||
      view === 'title' ||
      (!this.model.session.hero.sect && view === 'saves');
    document.querySelectorAll('[data-view]').forEach((button) => {
      button.setAttribute(
        'aria-current',
        button.dataset.view === view ? 'page' : 'false'
      );
      button.disabled = this.model.running;
    });
    this.sound.setTrack(
      view === 'battle' && this.model.running
        ? 'battle'
        : view === 'title'
          ? 'title'
          : view === 'ending'
            ? 'ending'
            : 'camp'
    );
    if (view === 'battle') this.renderer.resize();
    if(view==='codex')this.codex?.render();
    if (view === 'profile'&&!this.usability) this.selectProfileTab('gear');
    if (view === 'ending') this.renderEnding();
    if (['tavern', 'dungeons'].includes(view)) this.world?.refreshCalendar();
    const section = el(`view-${view}`);
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
    if(this.usability)this.usability.afterView(view);
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }
  snapshot() {
    const data = this.model.snapshot();
    data.version = CONFIG.VERSION;
    data.timestamp = Date.now();
    data.engineDemo = {
      x: 0,
      dir: 1,
      simTime: this.engine.simTime,
      tickCount: this.engine.tickCount,
      timeScale: this.engine.timeScale,
      resumeScale: this.engine.resumeScale
    };
    return data;
  }
  restore(data) {
    this.model.load(data);
    this.hasLoaded = true;
    this.engine.restoreClock(
      data.engineDemo?.simTime ?? 0,
      data.engineDemo?.tickCount ?? 0
    );
    this.engine.setTimeScale(data.engineDemo?.resumeScale ?? 1);
    this.engine.setTimeScale(data.engineDemo?.timeScale ?? 1);
    el('hero-name').value = this.model.session.hero.name;
    el('hero-sect').value = this.model.session.hero.sect ?? 'VoDang';
    this.renderer.setBattle(null);
    this.clearBattle();
    this.refresh();
    this.setView(isDaiViet(this.model.session)||this.model.session.hero.sect ? 'camp' : 'title');
    if (this.model.session.legacyProgress)
      this.toast(
        'Hồ sơ từ bản thử được giữ để tiếp tục truyện quán Rồng Lửa. Khởi hành mới để đọc Đại Việt Kỳ Hiệp Truyện.'
      );
  }
  changed(reason) {
    if (!this.ready) return;
    if (reason === 'reader') {
      bus.emit(EVT.SAVE_REQUESTED);
      return;
    }
    if (reason === 'settings') {
      this.applyAudio();
      bus.emit(EVT.SAVE_REQUESTED);
      return;
    }
    if (['new', 'restore'].includes(reason))
      el('save-name').value = this.model.session.hero.name;
    if (reason === 'new') {
      el('hero-name').value = this.model.session.hero.name;
      this.clearBattle();
    }
    this.refresh();
    if (reason === 'battle-result') {
      this.renderResult();
      bus.emit(EVT.BATTLE_STATE_CHANGED, { running: false });
    }
    if (reason !== 'restore') bus.emit(EVT.SAVE_REQUESTED);
  }
  refresh() {
    const session = this.model.session,
      quest = this.model.mainQuest(),
      pending = session.storyProgress.pendingEncounter;
    this.renderPlayer();
    this.syncSectPicker();
    el('act-label').textContent =
      `CHƯƠNG ${session.storyProgress.currentChapter} · HỒI ${session.storyProgress.currentEpisode}/20`;
    el('campaign-label').textContent=this.model.catalog.title+(isDaiViet(session)?(session.storyProgress.decisions.D19H18==='home'?' · Nhánh trở về; hoạt động ngoài truyện là hồi ức.':''):' · Tiếp tục bản lưu truyện cũ.');
    el('main-quest-title').textContent =
      quest?.title ?? 'Một đoạn đường đã khép lại';
    el('main-quest-note').textContent = quest
      ? `${quest.location}${quest.objective ? ' · Cần chiêu mộ Lão Tam và Tiểu Muội.' : ''}`
      : 'Bạn có thể xem lại kết cục, tiếp tục luyện võ hoặc khởi hành một hành trình khác.';
    if (quest?.boss)
      el('main-quest-note').textContent +=
        ' · Boss: cộng điểm võ công/thuộc tính, xếp đủ đội.';
    el('btn-main-quest').textContent = quest
      ? quest.ending
        ? 'Chọn con đường cuối'
        : 'Tiếp tục câu chuyện'
      : 'Xem kết cục';
    el('btn-main-quest').disabled = (!isDaiViet(session)&&!session.hero.sect) || Boolean(pending);
    el('btn-resume-battle').hidden = !pending;
    el('btn-practice').disabled = !sectReady(session) || Boolean(pending);
    el('shop-inventory').textContent =
      `Bạc ${itemCount(session, 'silver')} · Dây ${itemCount(session, 'rope')} · Cá ${itemCount(session, 'food_fish')} · Trà ${itemCount(session, 'tea')}`;
    el('btn-continue').disabled = !this.hasLoaded;
    const party = el('party-summary');
    party.replaceChildren();
    const members = [
      {
        id: 'hero',
        ...(isDaiViet(session)?heroAppearance(session):{}),
        name: session.hero.name,
        sect: session.hero.sect,
        detail: `Cấp ${session.hero.level}`,
        role: 'HIỆP KHÁCH'
      },
      ...session.party.active.map((id) => ({
        id,
        ...storyPerson(session,COMPANIONS_BY_ID[id]),
        detail: `Duyên nợ ${session.companionsAffinity[id] ?? 0}/100`,
        role: getSectName(COMPANIONS_BY_ID[id].sect)
      }))
    ];
    for (const member of members) {
      const card = node('article', undefined, 'party-member'),
        info = node('div', undefined, 'party-member-info');
      info.append(
        node('span', member.role, 'member-role'),
        node('strong', member.name),
        node('small', member.detail)
      );
      card.append(portrait(member), info);
      party.append(card);
    }
    for (let i = members.length; i < 6; i++) {
      const empty = node('article', undefined, 'party-member empty');
      empty.append(
        node('span', '+', 'empty-slot'),
        node('span', 'Chờ người kết nghĩa')
      );
      party.append(empty);
    }
    const sects = [
      storyHeroBuild(session).sect,
      ...session.party.active.map(
        (id) =>
          session.adventure.tactics.affiliations[id] ??
          COMPANIONS_BY_ID[id].sect
      )
    ].filter(Boolean);
    el('active-synergies').textContent = `Kích duyên: ${
      getActiveSynergies(sects)
        .map((s) => s.name)
        .join(' · ') || 'Chưa có'
    }`;
    document.body.dataset.cardEffects = String(
      this.model.session.settings.effects ?? true
    );
    this.renderRoster();
    this.gacha?.render();
    this.formation?.render();
    this.progress?.refresh();
    this.world?.render();
    this.applyAudio();
    this.syncSpeed();
    document.querySelectorAll('[data-view]').forEach((button) => {
      button.disabled = this.model.running;
    });
  }
  syncSectPicker() {
    const legacy=new URLSearchParams(location.search).get('story')==='legacy';
    el('sect-picker').hidden=!legacy;el('start-sect-field').hidden=!legacy;
    el('hero-origin-preview').hidden=legacy;
    el('start-story-hint').textContent=legacy?'Chọn môn phái cho tuyến truyện cũ.':'Bạn chưa thuộc môn phái nào. Lời mời nhập môn đến ở chương 2, sau khi tìm hiểu năm viện.';
    stylePortrait(el('hero-origin-preview').querySelector('.portrait'),{id:'hero',portrait:'assets/images/hero/modern.webp'});
    document
      .querySelectorAll('[data-sect-pick]')
      .forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.sectPick === el('hero-sect').value)
        )
      );
  }
  selectProfileTab(tab) {
    for (const button of document.querySelectorAll('[data-profile-tab]')) {
      const selected = button.dataset.profileTab === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      el(`profile-${button.dataset.profileTab}`).hidden = !selected;
    }
  }
  renderPlayer() {
    const newIdentity=!this.hasLoaded&&new URLSearchParams(location.search).get('story')!=='legacy';
    const { hero, inventory, storyProgress, party } = this.model.session,
      artSect = hero.sect ?? 'VoDang',art=newIdentity?{id:'hero',portrait:'assets/images/hero/modern.webp'}:heroAppearance(this.model.session),sectLabel=newIdentity?'Chưa nhập môn':isDaiViet(this.model.session)?heroSectLabel(this.model.session):getSectName(artSect);
    const hud = el('hero-hud'),
      info = node('div', undefined, 'hud-info');
    hud.replaceChildren(portrait(art, 'hud-portrait'));
    info.append(
      node('strong', newIdentity?el('hero-name').value.trim()||'Nhân vật của bạn':hero.name, 'hud-name'),
      node('span', `Cấp ${hero.level} · ${sectLabel}`, 'hud-level')
    );
    const meter = node('span', undefined, 'xp-meter'),
      fill = node('i');
    fill.style.width = `${hero.level >= 20 ? 100 : Math.min(100, (hero.exp / expToNextLevel(hero.level)) * 100)}%`;
    meter.append(fill);
    info.append(meter);
    hud.append(info);
    const silver = el('silver-hud'),
      amount = itemCount(this.model.session, 'silver');
    silver.replaceChildren(
      icon('coin'),
      node(
        'span',
        new Intl.NumberFormat('vi-VN', {
          notation: amount >= 10000 ? 'compact' : 'standard',
          maximumFractionDigits: 1
        }).format(amount)
      )
    );
    silver.title = `${amount.toLocaleString('vi-VN')} bạc`;
    silver.setAttribute(
      'aria-label',
      `${itemCount(this.model.session, 'silver')} bạc`
    );
    stylePortrait(el('camp-hero-art'), artSect);
    const completed = storyProgress.completedQuests.filter((id) =>
      this.model.catalog.quests.some((q) => q.id === id)
    ).length;
    el('chapter-progress').textContent = `${completed}/${this.model.catalog.quests.length} hồi`;
    el('roster-count').textContent = `${party.unlocked.length}/50 đã kết nghĩa`;
    const root = el('profile-hero');
    root.replaceChildren(portrait(art));
    const profile = node('div', undefined, 'profile-info');
    profile.append(
      node('span', 'HỒ SƠ HIỆP KHÁCH', 'eyebrow'),
      node('h1', hero.name),
      node(
        'p',
        isDaiViet(this.model.session)?sectLabel:`${getSectName(artSect)} · ${SECT_ART[artSect]?.sigil ?? 'Hiệp'} tâm bất diệt`
      )
    );
    if (hero.sect||isDaiViet(this.model.session)) {
      const build=storyHeroBuild(this.model.session),unit = new Hero(build.sect, { profile: build, inventory }),
        stats = node('div', undefined, 'profile-mini-stats');
      for (const [label, value] of [
        ['Sinh lực', unit.stats.maxHp],
        ['Ngoại công', unit.stats.physicalAtk],
        ['Nội công', unit.stats.magicalAtk]
      ]) {
        const stat = node('span', label);
        stat.append(node('strong', Math.round(value).toLocaleString('vi-VN')));
        stats.append(stat);
      }
      profile.append(stats);
    }
    const level = node('span', 'Cấp ', 'hero-level');
    level.append(node('strong', hero.level));
    root.append(profile, level);
  }
  renderRoster() {
    renderJourneyRoster(this);
    const session = this.model.session,
      root = el('roster-list');
    root.replaceChildren();
    for (const id of session.party.unlocked) {
      const unit = {
          ...storyPerson(this.model.session,COMPANIONS_BY_ID[id]),
          sect:
            session.adventure.tactics.affiliations[id] ??
            COMPANIONS_BY_ID[id].sect
        },
        card = node('article', undefined, 'roster-card'),
        active = session.party.active.includes(id),
        body = node('div', undefined, 'card-body');
      card.dataset.owned = 'true';
      decorateRarity(card, unit);
      card.dataset.companionId = unit.id;
      card.append(
        portrait(COMPANIONS_BY_ID[unit.templateId] ?? unit, 'card-portrait')
      );
      const info = node('button', 'Xem tướng', 'inspect-companion');
      info.type = 'button';
      info.addEventListener('click', () => this.world.inspect(unit));
      card.append(info);
      const badge = node(
        'span',
        active ? 'Xuất chiến' : 'Đã kết nghĩa',
        'card-badge'
      );
      card.append(badge);
      const meta = node('div', undefined, 'card-meta');
      meta.append(
        node('span', getSectName(unit.sect)),
        node(
          'span',
          `${rarityLabel(unit.tier)} · ♥ ${session.companionsAffinity[id] ?? 0}`
        )
      );
      body.append(
        meta,
        node('h3', unit.name),
        node('p', unit.skills.ultimate.description, 'card-description')
      );
      const meter = node('div', undefined, 'affinity-meter'),
        fill = node('i');
      fill.style.width = `${session.companionsAffinity[id] ?? 0}%`;
      meter.append(fill);
      body.append(meter);
      const controls = node('div', undefined, 'controls'),
        toggle = node(
          'button',
          active ? 'Rời đội xuất chiến' : 'Chọn xuất chiến'
        );
      toggle.type = 'button';
      toggle.dataset.partyId = id;
      toggle.disabled =
        this.model.running || (!active && session.party.active.length >= 5);
      toggle.addEventListener('click', () =>
        this.run(() =>
          this.model.setParty(
            active
              ? session.party.active.filter((key) => key !== id)
              : [...session.party.active, id]
          )
        )
      );
      const gift = node('button', 'Tặng trà · +5 duyên');
      gift.type = 'button';
      gift.disabled =
        this.model.running ||
        itemCount(session, 'tea') < 1 ||
        session.companionsAffinity[id] >= 100;
      gift.addEventListener('click', () =>
        this.run(() => {
          this.model.gift(id);
          this.toast('Duyên nợ đã tăng.');
        })
      );
      controls.append(toggle, gift);
      body.append(controls);
      card.append(body);
      root.append(card);
    }
    if (!session.party.unlocked.length)
      root.append(
        node(
          'p',
          'Chưa có đồng đội. Vượt trận mở đầu để bắt đầu kết nghĩa.',
          'hint'
        )
      );
    const recruits = el('recruit-list');
    recruits.replaceChildren();
    const search = (el('companion-search')?.value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLowerCase();
    const rarity = el('companion-tier')?.value ?? '';
    const matches = (u) =>
      (!rarity || u.tier === Number(rarity)) &&
      (!search ||
        storyPerson(session,u).name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .toLowerCase()
          .includes(search));
    for (const card of root.children)
      if (card.dataset.companionId)
        card.hidden = !matches(COMPANIONS_BY_ID[card.dataset.companionId]);
    const available = this.model.availableRecruitQuests();
    for (const quest of RECRUIT_QUESTS) {
      if (!matches(COMPANIONS_BY_ID[quest.companionId])) continue;
      const open = available.includes(quest),
        owned = session.party.unlocked.includes(quest.companionId);
      if (this.recruitFilter === 'open' && !open) continue;
      if (
        ['1', '2', '3'].includes(this.recruitFilter) &&
        quest.act !== Number(this.recruitFilter)
      )
        continue;
      const unit = storyPerson(session,COMPANIONS_BY_ID[quest.companionId]),
        card = node('article', undefined, 'roster-card'),
        body = node('div', undefined, 'card-body');
      const unlockChapter=isDaiViet(session)&&PLOT_UNLOCKS[unit.id]?Number(PLOT_UNLOCKS[unit.id].slice(1,3)):quest.chapter;
      decorateRarity(card, unit);
      card.dataset.companionId = unit.id;
      card.dataset.locked = String(!open && !owned);
      card.dataset.owned = String(owned);
      card.append(
        portrait(COMPANIONS_BY_ID[unit.templateId] ?? unit, 'card-portrait')
      );
      const info = node('button', 'Xem tướng', 'inspect-companion');
      info.type = 'button';
      info.addEventListener('click', () => this.world.inspect(unit));
      card.append(info);
      const badge = node('span', undefined, 'card-badge');
      if (!open && !owned) badge.append(icon('lock'));
      badge.append(
        node('span', owned ? 'Đã kết nghĩa' : `Chương ${unlockChapter}`)
      );
      card.append(badge);
      const meta = node('div', undefined, 'card-meta');
      meta.append(
        node('span', getSectName(unit.sect)),
        node('span', rarityLabel(unit.tier))
      );
      body.append(
        meta,
        node('h3', unit.name),
        node('p', isDaiViet(session)?unit.recruitment.description:quest.description, 'card-description')
      );
      const button = node(
        'button',
        owned
          ? 'Đã đồng hành'
          : open
            ? `Gặp gỡ · ${this.model.recruitFee(quest)} bạc nhập đội`
            : `Chưa mở · Chương ${unlockChapter}`
      );
      button.type = 'button';
      button.dataset.recruitId = quest.id;
      button.disabled =
        owned ||
        !open ||
        this.model.running ||
        Boolean(session.storyProgress.pendingEncounter);
      button.addEventListener('click', () =>
        this.run(() => this.showRecruit(quest))
      );
      const controls = node('div', undefined, 'controls');
      controls.append(button);
      body.append(controls);
      card.append(body);
      recruits.append(card);
    }
    if (!recruits.children.length)
      recruits.append(
        node(
          'p',
          'Chưa có cuộc gặp nào trong nhóm này. Hãy tiếp tục chính truyện.',
          'hint'
        )
      );
  }
  showMain({skipAftermath=false}={}) {
    const s=this.model.session,canonical=isDaiViet(s),pageToken=Symbol('story-page');
    this.storyPageToken=pageToken;
    if(canonical&&!skipAftermath&&!s.storyProgress.pendingEncounter){
      const last=this.model.catalog.quests.filter(q=>s.storyProgress.completedQuests.includes(q.id)).at(-1);
      const key='aftermath:'+last?.id,position=s.journey.reader.positions[key];
      if(last?.aftermath&&(position===undefined||position<last.aftermath.length-1)){
        this.dialogue.show({
          ...this.readerOptions(key),title:`Chương ${last.chapter} · Hồi ${last.episode}/20 · Sau trận`,
          quest:last,hero:s.hero,lines:last.aftermath,continuous:true,
          choices:[{id:'continue',text:'Đọc tiếp ▸'}],onBack:()=>this.setView('camp'),
          onChoice:()=>this.run(()=>{if(this.storyPageToken===pageToken&&this.view==='dialogue')this.showMain({skipAftermath:true});})
        });
        if(this.view!=='dialogue')this.setView('dialogue');
        else el('dialogue-advance')?.focus({preventScroll:true});
        return;
      }
    }
    const quest = this.model.mainQuest();
    if (!quest) {
      this.setView('ending');
      return;
    }
    const selected = this.model.session.storyProgress.decisions[quest.id];
    const choices = quest.ending
      ? this.model.endingOptions().map((e) => ({
          id: e.id,
          text: `${e.name} — ${e.requirement}`,
          disabled: !e.available
        }))
      : canonical&&quest.id===ENROLLMENT_QUEST?Object.values(SECTS).map(sect=>({id:sect.id,text:`${({ThieuLam:'Hoa Lư',VoDang:'Trúc Lâm',CaiBang:'Tản Viên',NgaMi:'Thất Sơn',DuongMon:'Vân Đồn'})[sect.id]} · ${sect.name} · ${sect.role}`,portrait:{id:'hero',portrait:`assets/images/hero/${sect.id}.webp`}}))
      : quest.choices
          .filter((c) => !selected || selected === c.id)
          .map((c) => ({
            id: c.id,
            text:
              c.text +
              (c.karma
                ? ` · Nhân nghĩa ${c.karma > 0 ? '+' : ''}${c.karma}`
                : '')
          }));
    this.dialogue.show({
      brief: this.model.scoutMain(),
      ...this.readerOptions((canonical?'flow:':'main:') + quest.id),
      title: `Chương ${quest.chapter} · Hồi ${quest.episode}/20 · ${quest.title}`,
      quest,
      hero: this.model.session.hero,
      continuous:canonical,
      lines: canonical?storyLines(quest,this.model.session,this.model.catalog.quests,COMPANIONS_BY_ID):[
        ['Trước đó', quest.previous],
        ...storyLines(quest, this.model.session, this.model.catalog.quests, COMPANIONS_BY_ID)
      ],
      choices:canonical&&!quest.ending?choices.map(c=>({...c,text:choices.length===1?(quest.encounter?'Vào trận ▸':'Đọc tiếp ▸'):c.text})):choices,
      note: quest.objective
        ? 'Mở mục Đồng đội ở doanh trại để giúp Lão Tam và Tiểu Muội trước khi tiếp tục.'
        : canonical?'':quest.objectiveText,
      onBack: () => this.setView('camp'),
      onChoice: (id) =>
        this.run(() => {
          if(this.view!=='dialogue'||this.storyPageToken!==pageToken||this.model.mainQuest()?.id!==quest.id)return;
          this.sound.sfx('click');
          if(canonical&&quest.id===ENROLLMENT_QUEST){this.model.joinSect(id);this.clearBattle();this.showMain({skipAftermath:true});return;}
          if (quest.ending) {
            this.model.chooseEnding(id);
            this.setView('ending');
            return;
          }
          this.clearBattle();
          const battle = this.model.chooseMain(id);
          if (battle) this.enterBattle();
          else if(canonical)this.showMain({skipAftermath:true});
          else {
            this.setView('camp');
            this.toast('Nhiệm vụ hoàn tất. Đã nhận phần thưởng.');
          }
        })
    });
    if(this.view!=='dialogue')this.setView('dialogue');
    else el('dialogue-advance')?.focus({preventScroll:true});
  }
  showRecruit(quest) {
    const ready =
      this.model.session.storyProgress.questFlags[`challenge_${quest.id}`];
    const previous = this.model.session.storyProgress.decisions[quest.id];
    let choices = ready
      ? [
          {
            id: 'invite',
            text: `Mời đồng hành${this.model.recruitFee(quest) ? ' · ' + this.model.recruitFee(quest) + ' bạc hành trang' : ' · không phí'}`
          }
        ]
      : quest.puzzle
        ? quest.puzzle.options.map((text, index) => ({
            id: String(index),
            text
          }))
        : [
            { id: 'help', text: 'Giúp đỡ rồi cùng vượt thử thách' },
            { id: 'demand', text: 'Đòi một lời hứa trả công trước' }
          ].filter((c) => !previous || previous === c.id);
    this.dialogue.show({
      ...this.readerOptions('recruit:' + quest.id),
      title: quest.title,
      hero: this.model.session.hero,
      lines: [
        ...quest.lines,
        ...(ready
          ? [
              [
                quest.title,
                'Chuyện đã giải quyết. Nếu không chê, ta xin đi cùng.'
              ]
            ]
          : quest.puzzle
            ? [['Tình huống', quest.puzzle.prompt]]
            : [
                [
                  'Người kể',
                  'Một nhóm cản đường xuất hiện. Hãy giúp người bạn mới vượt qua.'
                ]
              ])
      ],
      choices,
      note:
        quest.cost && !ready
          ? `Cần ${quest.cost.quantity} ${quest.cost.itemId === 'silver' ? 'bạc' : quest.cost.itemId === 'rope' ? 'dây thừng' : 'cá'}. Có thể mua ở doanh trại.`
          : quest.objectiveText,
      onBack: () => this.setView('camp'),
      onChoice: (id) =>
        this.run(() => {
          if (id === 'invite') {
            this.model.recruit(quest.id);
            this.usability?.openRoster('companions');
            this.setView('roster');
            this.toast(
              `${quest.title} đã đồng hành. Nhận XP và bạc của nhiệm vụ.`
            );
          } else if (quest.puzzle) {
            this.model.solveRecruit(quest.id, Number(id));
            this.showRecruit(quest);
            this.toast('Thử thách đã hoàn tất. Có thể mời đồng hành.');
          } else {
            this.clearBattle();
            this.model.challengeRecruit(quest.id, id);
            this.enterBattle();
          }
        })
    });
    this.setView('dialogue');
  }
  clearBattle() {
    el('battle-log').replaceChildren();
    el('battle-stats').replaceChildren();
    el('battle-result-panel').hidden = true;
    el('unit-inspect').textContent = '';
    this.unitNodes.clear();
    this.cinematicRemaining = 0;
    el('ultimate-banner').classList.remove('show');
  }
  readerOptions(key) {
    return {
      identitySession:this.model.session,
      readerKey: key,
      getReader: () => this.model.session.journey.reader,
      onRead: (...args) => this.run(() => this.model.rememberDialogue(...args)),
      onFont: (size) => this.run(() => this.model.setReaderFont(size))
    };
  }
  openCaseSource(id) {
    const s = this.model.session,
      q = resolveDaiVietQuest(this.model.catalog.quests.find((q) => q.id === id),s);
    if (!q || !s.storyProgress.completedQuests.includes(id)) {
      this.toast('Nguồn này chưa được mở.', true);
      return;
    }
    this.dialogue.show({
      ...this.readerOptions('archive:' + id),
      title:
        'Nguồn đầu mối · Chương ' +
        q.chapter +
        ' · Hồi ' +
        q.episode +
        ' · ' +
        q.title,
      quest: q,
      hero: s.hero,
      lines: [...storyLines(q, s, this.model.catalog.quests, COMPANIONS_BY_ID),...(q.aftermath??[])],
      note: 'Xem lại nguồn đã hoàn thành; giữ nguyên lựa chọn và phần thưởng.',
      onBack: () => this.world.openCasebook()
    });
    this.setView('dialogue');
  }
  enterBattle() {
    const battle = this.model.battle;
    battle.scene = battleScene(
      this.model.session.storyProgress.pendingEncounter,
      this.model.mainQuest(),
      this.model.session.adventure.dungeon?.id
    );
    this.renderer.setBattle(battle);
    el('battle-title').textContent = battle.encounterName;
    this.renderBattleCards();
    bus.emit(EVT.BATTLE_STATE_CHANGED, { running: true });
    this.setView('battle');
    this.updateBattleStatus();
    if (this.engine.paused)
      this.toast('Trận đã sẵn sàng. Bấm Tiếp tục để giao chiến.');
  }
  renderBattleCards() {
    const battle = this.model.battle;
    const root = el('battle-unit-list');
    root.replaceChildren();
    this.unitNodes.clear();
    this.intentNodes.clear();
    for (const unit of battle.units) {
      const card = node('article', undefined, 'battle-unit-card');
      card.dataset.team = unit.team;
      const status = node('p'),
        inspect = node(
          'button',
          unit.missionAsset ? 'Xem mục tiêu' : 'Thông tin'
        );
      inspect.type = 'button';
      inspect.dataset.uiIcon=unit.missionAsset?'focus':'help';
      inspect.addEventListener('click', () => {
        this.world.inspect(unit);
      });
      card.append(
        portrait(
          unit.characterId ? unit : (COMPANIONS_BY_ID[unit.templateId] ?? unit)
        ),
        node('strong', unit.name),
        status,
        inspect
      );
      const intent = node('p', undefined, 'unit-intent');
      intent.dataset.intent = unit.id;
      card.append(intent);
      this.intentNodes.set(unit.id, intent);
      if(unit.team==='home'&&!unit.isObject){
        const cast=node('button','Tung tuyệt kỹ');cast.type='button';cast.dataset.manualUltimate=unit.id;cast.dataset.uiIcon='sword';cast.hidden=battle.autoUltimate;
        cast.addEventListener('click',()=>{if(battle.orderUltimate(unit.id))this.toast('Đã chọn tuyệt kỹ của '+unit.name+' khi có mục tiêu hợp lệ.');this.updateBattleStatus();});card.append(cast);
      }
      if (unit.team === 'enemy') {
        const focus = node('button', 'Tập trung mục tiêu');
        focus.type = 'button';
        focus.dataset.focus = unit.id;
        focus.disabled = !unit.alive || !this.model.running;
        focus.addEventListener('click', () => {
          if (battle.orderFocus(unit.id)) {
            this.updateBattleStatus();
            this.toast(
              'Đã chọn ' + unit.name + '. Khiêu khích vẫn được ưu tiên.'
            );
          }
        });
        card.append(focus);
      }
      root.append(card);
      this.unitNodes.set(unit.id, status);
    }
  }
  updateBattleStatus() {
    const battle = this.model.battle;
    if (!battle || this.view !== 'battle') return;
    this.usability?.updateBattle();
    for(const button of document.querySelectorAll('[data-manual-ultimate]')){
      const u=battle.units.find(u=>u.id===button.dataset.manualUltimate);button.hidden=battle.autoUltimate;button.disabled=!this.model.running||!u?.alive||u.stats.energy<(u.skills.ultimate.energyCost??100);
    }
    renderMissionStatus(this);
    for (const unit of battle.units)
      if (this.intentNodes.has(unit.id)) {
        const text = battleIntent(battle, unit).text,
          e = this.intentNodes.get(unit.id);
        if (e.textContent !== text) e.textContent = text;
      }
    el('battle-clock').textContent =
      `${this.engine.paused ? 'Tạm dừng · ' : ''}${battle.elapsed.toFixed(1)} / 120 giây`;
    let warnings = el('battle-warnings');
    if (!warnings) {
      warnings = node('div', undefined, 'battle-warnings');
      warnings.id = 'battle-warnings';
      warnings.setAttribute('role', 'status');
      el('battle-clock').after(warnings);
    }
    const tells =
      battle.state === 'running'
        ? battle.director.bosses
            .filter((b) => b.tell)
            .map(
              (b) =>
                b.unit.name +
                ' · ' +
                b.tell.name +
                ' · ' +
                Math.max(0, b.tell.until - battle.elapsed).toFixed(1) +
                's · ' +
                b.tell.counter
            )
        : [];
    if (
      battle.state === 'running' &&
      battle.director.bosses.some(
        (b) => b.unit.alive && battle.director.protection(b.unit) < 1
      )
    )
      tells.push(
        'Ấn đang giảm 65% sát thương nhận vào của Đỗ Mậu. Chọn tập trung đánh Ấn để phá bảo hộ.'
      );
    if (battle.overtime && battle.elapsed >= 85)
      tells.push(
        battle.elapsed < 90
          ? 'Sau 90 giây: Quyết đấu tăng sát thương và giảm hồi máu cho cả hai phe.'
          : 'Quyết đấu: sát thương ×' +
              battle.pressure().damage.toFixed(2) +
              ' · hồi máu ×' +
              battle.pressure().healing.toFixed(2) +
              ' · áp dụng cả hai phe.'
      );
    warnings.textContent = tells.join(' | ');
    warnings.hidden = !tells.length;
    for (const b of document.querySelectorAll('[data-focus]')) {
      const u = battle.units.find((u) => u.id === b.dataset.focus);
      b.disabled = !this.model.running || !u?.alive;
      b.setAttribute('aria-pressed', String(battle.focusId === u?.id));
    }
    el('btn-retreat').disabled = !this.model.running;
    el('btn-battle-mode').textContent = battle.autoUltimate
      ? 'Tự động'
      : 'Thủ công';
    el('btn-battle-mode').setAttribute(
      'aria-pressed',
      String(battle.autoUltimate)
    );
    el('btn-battle-mode').disabled = !this.model.running;
    for (const unit of battle.units)
      if (this.unitNodes.has(unit.id))
        this.unitNodes.get(unit.id).textContent =
          `${unit.alive ? `${Math.ceil(unit.stats.hp)}/${Math.ceil(unit.stats.maxHp)} HP · ${Math.floor(unit.stats.energy)} nội lực` : 'Đã bị hạ'}${unit.statusEffects
            .filter((e) => STATUS_LABELS[e.type])
            .map(
              (e) =>
                ' · ' +
                STATUS_LABELS[e.type] +
                (e.stacks > 1 ? ' ×' + e.stacks : '')
            )
            .join(
              ''
            )}${unit.shield > 0 ? ` · Khiên ${Math.ceil(unit.shield)}` : ''}`;
    this.world?.syncBattleSheet();
    for (const u of battle.units.filter((u) => u.missionAsset))
      if (this.unitNodes.has(u.id))
        this.unitNodes.get(u.id).textContent = u.alive
          ? Math.ceil(u.stats.hp) +
            '/' +
            Math.ceil(u.stats.maxHp) +
            ' HP' +
            (u.shield ? ' · Khiên ' + Math.ceil(u.shield) : '')
          : 'Đã bị phá / bị hạ';
  }
  battleEvent(event) {
    this.renderer.event(event);
    if (event.type === 'boss:summon' && this.view === 'battle')
      this.renderBattleCards();
    if (event.type.startsWith('mission:')) this.toast(event.name);
    const effects =
      (this.model.session.settings.effects ?? true) &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (event.type === 'ultimate' && effects) {
      this.cinematicRemaining = 0.32;
      const banner = el('ultimate-banner');
      banner.textContent = event.name;
      banner.classList.remove('show');
      void banner.offsetWidth;
      banner.classList.add('show');
      clearTimeout(this.effectTimer);
      this.effectTimer = setTimeout(() => banner.classList.remove('show'), 850);
    }
    if (
      event.type === 'damage' &&
      effects &&
      performance.now() - this.lastImpact > 250
    ) {
      const target = this.model.battle?.units.find(
        (u) => u.id === event.targetId
      );
      if (event.crit || (target && event.amount > target.stats.maxHp * 0.18)) {
        this.lastImpact = performance.now();
        const arena = el('battle-arena');
        arena.classList.add('impact');
        clearTimeout(this.impactTimer);
        this.impactTimer = setTimeout(
          () => arena.classList.remove('impact'),
          150
        );
        if (this.model.session.settings.haptics ?? true)
          try {
            navigator.vibrate?.(16);
          } catch {}
      }
    }
    const name = (id) =>
      this.model.battle?.units.find((u) => u.id === id)?.name ?? 'Hiệu ứng';
    let text = '';
    if (event.type.startsWith('boss:'))
      text =
        event.type === 'boss:interrupt'
          ? 'Đã ngắt ' + event.name
          : event.type === 'boss:tell'
            ? name(event.actorId) + ' chuẩn bị ' + event.name
            : event.type === 'boss:phase'
              ? name(event.actorId) + ' thi triển ' + event.name
              : event.type === 'boss:summon'
                ? 'Xuất hiện ' + event.name
                : 'Đòn chuẩn bị đã hủy';
    if (event.type === 'damage')
      text = `${name(event.targetId)} nhận ${Math.ceil(event.amount)} sát thương${event.crit ? ' bạo kích' : ''}${event.absorbed ? `; khiên đỡ ${Math.ceil(event.absorbed)}` : ''}`;
    if (event.type === 'heal')
      text = `${name(event.targetId)} hồi ${Math.ceil(event.amount)} HP`;
    if (event.type === 'ultimate')
      text = `${name(event.actorId)} tung ${event.name}`;
    if (event.type === 'death') text = `${name(event.targetId)} bị hạ`;
    if (event.type === 'synergy')
      text = `${event.team === 'home' ? 'Đội nhà' : 'Đội địch'} kích duyên ${event.name}`;
    if (text) {
      const row = node('li', `${event.time.toFixed(1)}s · ${text}`),
        log = el('battle-log');
      log.prepend(row);
      while (log.children.length > 100) log.lastChild.remove();
    }
    if (
      event.type === 'death' ||
      (performance.now() - this.lastSfx > 100 &&
        ['damage', 'heal', 'skill:cast'].includes(event.type))
    ) {
      if (event.type === 'skill:cast') this.sound.skill(event);
      else
        this.sound.sfx(
          event.type === 'damage'
            ? event.damageType === 'magical'
              ? 'magic'
              : 'hit'
            : event.type
        );
      this.lastSfx = performance.now();
    }
  }
  renderResult() {
    if (el('unit-sheet').open) el('unit-sheet').close();
    const result = this.model.lastResult;
    if (!result) return;
    el('btn-story-next').hidden=!(isDaiViet(this.model.session)&&result.kind==='main'&&result.winner==='home');
    el('battle-result-panel').hidden = false;
    el('battle-result-panel').dataset.won = String(result.winner === 'home');
    const label =
      result.reason === 'aborted'
        ? 'Đã rút lui'
        : result.reason === 'objective_timeout'
          ? 'Thất bại — hết giờ nhiệm vụ'
          : result.reason === 'timeout'
            ? 'Hòa — hết thời gian'
            : result.winner === 'home'
              ? 'Chiến thắng!'
              : result.winner === 'enemy'
                ? 'Thất bại'
                : 'Hòa';
    el('battle-result').textContent =
      `${label} · ${result.duration.toFixed(1)} giây`;
    el('battle-rewards').textContent =
      result.winner !== 'home'
        ? 'Không mất XP. Món chuẩn bị, tiền cọc/phí vào vẫn tiêu hao; lượt bí cảnh kết thúc khi thua hoặc rút lui.'
        : result.kind === 'dungeon'
          ? `Vượt tầng, nhận ${result.rewards.silver} bạc và lưu HP. Xem hành trình ở Bí cảnh.`
          : ['arena', 'escort'].includes(result.kind)
            ? `Nhận ${result.rewards.silver} bạc. Vật liệu (nếu có) đã vào túi; giới hạn thưởng được ghi theo ngày/tuần.`
            : result.kind === 'recruit'
              ? 'Thử thách đã hoàn tất. Quay lại gặp nhân vật để mời đồng hành và nhận thưởng.'
              : `Nhận ${result.rewards.xp} XP và ${result.rewards.silver} bạc.`;
    const table = node('table'),
      head = node('thead'),
      header = node('tr');
    for (const title of [
      'Nhân vật',
      'Sát thương',
      'Hồi máu',
      'Hạ gục',
      'Tuyệt kỹ'
    ])
      header.append(node('th', title));
    head.append(header);
    table.append(head);
    const body = node('tbody');
    for (const stat of result.statistics) {
      const row = node('tr');
      for (const value of [
        stat.name,
        Math.ceil(stat.damage),
        Math.ceil(stat.healing),
        stat.kills,
        stat.ultimates
      ])
        row.append(node('td', String(value)));
      body.append(row);
    }
    table.append(body);
    el('battle-stats').replaceChildren(table);
    if (result.objective) {
      const p = node(
        'p',
        (result.winner === 'home'
          ? 'Đã hoàn thành: '
          : 'Mục tiêu chưa hoàn thành: ') +
          result.objective.title +
          ' · ' +
          result.objective.status,
        'mission-result'
      );
      el('battle-stats').prepend(p);
    }
    renderBattleAdvice(this, result);
    this.sound.setTrack(result.winner === 'home' ? 'ending' : 'camp');
    this.sound.sfx(result.winner === 'home' ? 'victory' : 'defeat');
    this.updateBattleStatus();
    if (this.view === 'battle')
      el('battle-result-panel').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }
  renderEnding() {
    const ending = this.model.catalog.endings.find(
      (e) => e.id === this.model.session.storyProgress.endingId
    );
    if (!ending) {
      this.toast('Câu chuyện chưa đến kết cục.', true);
      return;
    }
    el('ending-title').textContent =
      this.model.session.legacyEnding?.name ?? ending.name;
    const root = el('ending-story');
    root.replaceChildren();
    for (const [speaker, text, actor] of heroLines(this.model.session.legacyEnding
      ? [['Người kể', this.model.session.legacyEnding.text]]
      : ending.lines,this.model.session)) {
      if (speaker === 'Người kể'&&actor!=='hero') root.append(node('p', text));
      else {
        const row = node('article', undefined, 'ending-dialogue-line');
        const copy = node('div');
        copy.append(node('strong', speaker), node('p', text));
        row.append(speakerPortrait(speaker, this.model.session.hero,{canon:isDaiViet(this.model.session)?'dai-viet':undefined,chapter:this.model.catalog.chapters.length,episode:20},actor,this.model.session), copy);
        root.append(row);
      }
    }
    el('ending-summary').textContent =
      `${this.model.session.hero.name} · Cấp ${this.model.session.hero.level} · ${this.model.session.party.unlocked.length}/50 người đồng hành · ${Math.floor(this.model.session.playtimeSeconds / 60)} phút phiêu lưu`;
  }
  syncSpeed() {
    el('btn-pause').textContent = this.engine.paused ? 'Tiếp tục' : 'Tạm dừng';
    el('btn-pause').setAttribute('aria-pressed', String(this.engine.paused));
    document
      .querySelectorAll('[data-scale]')
      .forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(Number(button.dataset.scale) === this.engine.timeScale)
        )
      );
  }
}
