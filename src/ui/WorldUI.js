import {icon} from './Visuals.js';
import {remainingEntries,EXTRA_ENTRY_PRICE} from '../core/DungeonEntries.js';
import {storyPerson,isDaiViet,DAI_VIET_CAST_BY_ID} from '../data/DaiVietCast.js';
import {renderEquipment,renderChapterBosses} from './EquipmentUI.js';
import {sectReady,heroText,heroAppearance,heroSectLabel} from '../data/HeroIdentity.js';
import {casebook} from '../core/Casebook.js';
import { renderStoryArchive } from './StoryArchive.js';
import { renderBonds } from './JourneyUI.js';
import { renderCasebook } from './CasebookUI.js';
import { NPCS, NPCS_BY_ID, findNPC } from '../data/NPCData.js';
import { EQUIPMENT_BY_ID } from '../data/EquipmentData.js';
import {
  DUNGEONS,
  DAILY_TASKS,
  WEEKLY_TASKS,
  ROOM_NAMES,
  LOCAL_LORE
} from '../data/WorldData.js';
import {
  QIGONG,
  PRIORITIES,
  SECT_ELEMENT,
  ELEMENTS,
  WEAKNESSES,
  STATUS_LABELS,
  sectBonuses
} from '../data/StrategyData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { MAIN_QUESTS } from '../data/QuestsData.js';
import { getSectName } from '../data/SectsData.js';
import { count, calendar } from '../core/WorldProgress.js';
import { portrait, decorateRarity } from './Visuals.js';
const el = (id) => document.getElementById(id);
function n(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function button(text, action, disabled = false) {
  const b = n('button', text);
  b.type = 'button';
  b.disabled = disabled;
  b.addEventListener('click', action);
  return b;
}
function panel(title, text) {
  const p = n('article', undefined, 'panel world-card');
  p.append(n('h2', title));
  if (text) p.append(n('p', text, 'hint'));
  return p;
}
function select(options, value, callback) {
  const e = n('select');
  for (const [id, label] of Object.entries(options)) {
    const o = n('option', label);
    o.value = id;
    e.append(o);
  }
  e.value = value;
  e.addEventListener('change', () => {
    if (callback(e.value) === null) e.value = value;
  });
  return e;
}
export function mountWorldUI(app) {
  const roadsideShop=el('roadside-shop');roadsideShop.remove();
  let tab = 'shop',
    roomOption = 0,
    inspectedId = null;
  const run = (action) =>
    app.run(() => {
      const result = action();
      if (typeof result === 'string') app.toast(result);
      return result;
    });
  function action(type, arg) {
    return run(() => app.model.action(type, arg));
  }
  function fight(fn) {
    return run(() => {
      app.clearBattle();
      fn();
      app.enterBattle();
    });
  }
  function refreshCalendar() {
    const s = app.model.session,
      { day, week } = calendar(app.model.now());
    if (day > s.adventure.daily.day || week > s.adventure.weekly.week)
      app.model._mutate(() => {}, 'calendar');
  }
  function openMenu() {
    el('menu-sheet').showModal();
  }
  el('btn-more').addEventListener('click', openMenu);
  document
    .querySelectorAll('[data-close-sheet]')
    .forEach((b) =>
      b.addEventListener('click', () => el(b.dataset.closeSheet).close())
    );
  for (const id of ['menu-sheet', 'unit-sheet'])
    el(id).addEventListener('click', (e) => {
      if (e.target === el(id)) {
        const r = el(id).getBoundingClientRect();
        if (
          e.clientX < r.x ||
          e.clientX > r.right ||
          e.clientY < r.y ||
          e.clientY > r.bottom
        )
          el(id).close();
      }
    });
  el('menu-sheet')
    .querySelectorAll('[data-view]')
    .forEach((b) =>
      b.addEventListener('click', () => el('menu-sheet').close())
    );
  el('btn-battle-mode').addEventListener('click', () =>
    run(() =>
      app.model.setTactics({ autoUltimate: !app.model.battle.autoUltimate })
    )
  );
  for (const [id, key] of [
    ['effects-enable', 'effects'],
    ['haptics-enable', 'haptics']
  ])
    el(id).addEventListener('change', () =>
      run(() => app.model.setSettings({ [key]: el(id).checked }))
    );
  el('btn-portrait-mode').addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement)
        await document.documentElement.requestFullscreen();
      if (!screen.orientation?.lock)
        throw Error('Trình duyệt chưa hỗ trợ khóa hướng.');
      await screen.orientation.lock('portrait');
    } catch {
      app.toast(
        'Trình duyệt không cho khóa dọc ở chế độ này. Bạn có thể cài game hoặc xoay điện thoại để chơi dọc.'
      );
    }
  });
  function renderBag() {
    const s = app.model.session,
      root = el('world-bag');
    root.replaceChildren(n('h3', 'Vật phẩm trong túi'));
    const labels = {
      silver: 'Bạc',
      rope: 'Dây thừng',
      food_fish: 'Cá tươi',
      tea: 'Trà ngon',
      herb: 'Thảo dược',
      ore: 'Quặng rèn',
      elixir: 'Dưỡng Khí Đan',
      essence: 'Tinh hoa tuần'
    };
    for (const item of s.inventory) {
      const card = n('article', undefined, 'bag-item'),
        d = DUNGEONS.find((d) => 'secret_' + d.id === item.itemId);
      card.append(
        n(
          'strong',
          labels[item.itemId] ??
            EQUIPMENT_BY_ID[item.itemId]?.name ??
            (d ? 'Bí kíp ' + d.relic : 'Vật phẩm nhiệm vụ')
        ),
        n('span', '×' + item.quantity)
      );
      if (['tea', 'food_fish', 'elixir'].includes(item.itemId))
        card.append(
          button(
            'Chuẩn bị trận tới',
            () => run(() => app.model.setTactics({ food: item.itemId })),
            app.model.running || Boolean(s.storyProgress.pendingEncounter)
          )
        );
      root.append(card);
    }
  }
  function renderTactics() {
    const s = app.model.session,
      t = s.adventure.tactics,
      root = el('tactics-root');
    root.replaceChildren(
      n('h2', 'Chuẩn bị trước trận'),
      n(
        'p',
        'Kim khắc Mộc → Thổ → Thủy → Hỏa → Kim: sát thương +15%, bị khắc −15%. Tương sinh hỗ trợ nội lực. 2/4/6 người cùng phái tăng hiệu ứng đội. Ưu tiên mục tiêu áp dụng cho đòn đánh địch; y sư vẫn chữa người thiếu máu.',
        'hint'
      )
    );
    const row = n('div', undefined, 'codex-filters');
    const q = n('label', 'Khí công'),
      food = n('label', 'Món cho một trận');
    q.append(
      select(
        Object.fromEntries(
          Object.entries(QIGONG).map(([id, v]) => [
            id,
            `${v.name} · ${v.description}`
          ])
        ),
        t.qigong,
        (v) => run(() => app.model.setTactics({ qigong: v }))
      )
    );
    food.append(
      select(
        {
          '': 'Không dùng',
          tea: `Trà · +15% nội lực (${count(s, 'tea')})`,
          food_fish: `Cá · +8% HP (${count(s, 'food_fish')})`,
          elixir: `Dưỡng Khí Đan · +10% HP (${count(s, 'elixir')})`
        },
        t.food ?? '',
        (v) => run(() => app.model.setTactics({ food: v || null }))
      )
    );
    row.append(q, food);
    root.append(
      row,
      n(
        'p',
        'Món bị trừ ngay khi chốt trận; tải lại dùng đúng buff cũ. Thua/rút lui vẫn tiêu hao. Bí cảnh giữ đội và HP riêng từ lúc vào.',
        'hint'
      )
    );
    const list = n('div', undefined, 'priority-list');
    for (const id of ['hero', ...s.party.active]) {
      const u = id === 'hero' ? s.hero : storyPerson(s,COMPANIONS_BY_ID[id]),
        sect = t.affiliations[id] ?? u.sect,
        label = n(
          'label',
          `${u.name} · ${ELEMENTS[SECT_ELEMENT[sect] ?? 'Tho'].name}`
        );
      label.append(
        select(PRIORITIES, t.priorities[id] ?? 'nearest', (v) =>
          run(() =>
            app.model.setTactics({ priorities: { ...t.priorities, [id]: v } })
          )
        )
      );
      list.append(label);
    }
    root.append(list);
    const sects = [
      s.hero.sect,
      ...s.party.active.map(
        (id) => t.affiliations[id] ?? COMPANIONS_BY_ID[id].sect
      )
    ].filter(Boolean);
    root.append(
      n(
        'p',
        sectBonuses(sects)
          .map((v) => `${getSectName(v.sect)} ${v.count} người → mốc ${v.tier}`)
          .join(' · ') || 'Chưa đủ 2 người cùng phái.',
        'buff-summary'
      )
    );
  }
  function inspect(unit) {
    inspectedId = unit.id;
    const s = app.model.session,
      root = el('unit-sheet-content');
    root.replaceChildren();
    if(unit.missionAsset) {
      root.removeAttribute('data-tier');
      const live=n('p',Math.ceil(unit.stats.hp)+'/'+Math.ceil(unit.stats.maxHp)+' HP','hint');live.id='sheet-live-stats';
      root.append(portrait(unit,'sheet-portrait'),n('h2',unit.name),n('p',app.model.battle.mission.definition.description),n('p','Đây là mục tiêu của trận, không dùng tuyệt kỹ và không tính vào sáu người xuất chiến.','hint'),live);
      el('unit-sheet').showModal();return;
    }
    const id = unit.id ?? 'hero',
      sect = s.adventure.tactics.affiliations[id] ?? unit.sect;
    root.removeAttribute('data-tier');
    const npc = unit.id==='hero'?null:isDaiViet(s)?(DAI_VIET_CAST_BY_ID[unit.storyActorId??unit.templateId??unit.id]??(unit.characterId?{...NPCS_BY_ID[unit.characterId],name:unit.name}:null)):NPCS_BY_ID[unit.characterId];
    if (!npc) decorateRarity(root, COMPANIONS_BY_ID[unit.templateId ?? unit.id]);
    root.append(
      portrait(
        unit.id==='hero'&&isDaiViet(s)?heroAppearance(s):npc ?? COMPANIONS_BY_ID[unit.templateId ?? unit.id] ?? sect,
        'sheet-portrait'
      ),
      n('h2', unit.name),
      n(
        'p',
        unit.id==='hero'&&isDaiViet(s)?heroSectLabel(s):`${getSectName(sect)} · ${ELEMENTS[SECT_ELEMENT[sect] ?? 'Tho'].name}`
      ),
      n(
        'p',
        unit.skills?.ultimate?.description ??
          'Nâng võ công và trang bị trong Túi đồ.',
        'hint'
      ),
      n(
        'p',
        `Điểm yếu: ${unit.weakness ?? COMPANIONS_BY_ID[unit.templateId ?? id]?.weakness ?? WEAKNESSES[unit.templateId ?? id] ?? 'Bị khắc ngũ hành, khống chế và đội hình đánh vào hậu tuyến.'}`,
        'weakness'
      )
    );
    if (npc) root.append(n('p', heroText([npc.role,npc.bio].filter(Boolean).join(' · '),s), 'hint'));
    else if (COMPANIONS_BY_ID[unit.templateId ?? id])
      root.append(
        n(
          'p',
          `Bậc ${COMPANIONS_BY_ID[unit.templateId ?? id].tier} · ${COMPANIONS_BY_ID[unit.templateId ?? id].biography}`,
          'hint'
        )
      );
    if (
      !app.model.running &&
      s.party.active.includes(id) &&
      COMPANIONS_BY_ID[id].sect === 'TuDo'
    ) {
      const picker = select(
        Object.fromEntries(
          Object.keys(SECT_ELEMENT)
            .filter((k) => k !== 'TuDo')
            .map((k) => [k, getSectName(k)])
        ),
        sect === 'TuDo' ? 'VoDang' : sect,
        () => {}
      );
      root.append(
        n(
          'p',
          'Nhập phái cho tướng Tự do: 80 bạc, giữ tuyệt kỹ riêng.',
          'hint'
        ),
        picker,
        button('Gia nhập môn phái · 80 bạc', () => {
          const result = action('affiliation', { id, sect: picker.value });
          if (result) el('unit-sheet').close();
        })
      );
    }
    if (
      app.model.running &&
      unit.team === 'home' &&
      !app.model.battle.autoUltimate
    )
      root.append(
        button(
          'Tung tuyệt kỹ',
          () => {
            if (app.model.battle.orderUltimate(id)) {
              el('unit-sheet').close();
              app.toast('Đã chọn tung tuyệt kỹ khi mục tiêu hợp lệ.');
            } else app.toast('Chưa đủ nội lực hoặc tướng đã bị hạ.', true);
          },
          unit.stats.energy < unit.stats.maxEnergy
        )
      );
    if (
      app.model.running &&
      unit.team === 'home' &&
      !app.model.battle.autoUltimate
    )
      root.lastElementChild.id = 'sheet-ultimate';
    const live = n(
      'p',
      unit.stats
        ? `${Math.ceil(unit.stats.hp)}/${Math.ceil(unit.stats.maxHp)} HP · ${Math.floor(unit.stats.energy)} nội lực`
        : '',
      'hint'
    );
    live.id = 'sheet-live-stats';
    root.append(live);
    el('unit-sheet').showModal();
  }
  function renderWorld() {
    const s = app.model.session,
      w = s.adventure,
      root = el('world-root'),
      tabs = el('world-tabs');
    root.replaceChildren();
    tabs.replaceChildren();
    for (const [id, label] of Object.entries({
      activities: 'Hoạt động',
      shop: 'Quán & Rèn',
      arena: 'Đại hội',
      guild: 'Bang hội',
      story: 'Truyện ký',
      casebook: 'Sổ đầu mối',
      bonds: 'Đồng hành',
      characters: 'Người đã gặp',
      journal: 'Nhật ký'
    })) {
      const b = button(label, () => {
        tab = id;
        refreshCalendar();
        renderWorld();
      });
      b.setAttribute('aria-pressed', String(tab === id));
      b.dataset.uiIcon=({activities:'flag',shop:'tea',arena:'sword',guild:'roster',story:'scroll',casebook:'codex',bonds:'heart',characters:'profile',journal:'scroll'})[id];
      tabs.append(b);
    }
    const activeTab=tabs.querySelector('[aria-pressed="true"]');
    if(isDaiViet(s)&&!sectReady(s)&&['activities','arena','guild'].includes(tab)){
      root.append(panel('Hành trình của người chưa nhập môn','Tiếp tục chính truyện để tìm hiểu năm viện. Sau khi chọn phái ở chương 2, bạn có thể tham gia các thử thách ngoài truyện.'));
      return;
    }
    if(activeTab&&tabs.clientWidth)tabs.scrollLeft+=activeTab.getBoundingClientRect().left-tabs.getBoundingClientRect().left-(tabs.clientWidth-activeTab.clientWidth)/2;
    if (tab === 'bonds') renderBonds(app, root);
    if (tab === 'casebook') renderCasebook(app,root);
    if (tab === 'activities') {
      renderChapterBosses(app,root);
      const daily = panel(
        'Điểm danh & nhiệm vụ',
        'Ngày/tuần theo giờ Việt Nam. Điểm danh trên máy này, chưa có tài khoản đăng nhập máy chủ.'
      );
      daily.append(
        button(
          `Điểm danh · chuỗi ${w.daily.streak} ngày`,
          () => action('checkin'),
          w.daily.checkIn >= calendar(app.model.now()).day
        )
      );
      for (const task of [...DAILY_TASKS, ...WEEKLY_TASKS]) {
        const board = task.id.startsWith('daily') ? w.daily : w.weekly;
        daily.append(
          button(
            `${task.label}: ${board[task.metric]}/${task.target} · ${task.silver} bạc${board.claimed.includes(task.id) ? ' · Đã nhận' : ''}`,
            () => action('claim', task.id),
            board.claimed.includes(task.id) || board[task.metric] < task.target
          )
        );
      }
      root.append(daily);
      const fish = panel(
        'Thả câu bên bến',
        `2 bạc/lượt: 1 cá và vật liệu. Còn ${3 - w.daily.fishing}/3 lượt hôm nay.`
      );
      fish.append(
        button('Buông cần · 2 bạc', () => action('fish'), w.daily.fishing >= 3)
      );
      root.append(fish);
      const escort = panel(
        'Tiêu cục Thanh Khê',
        `Còn ${2 - w.daily.escorts}/2 chuyến/ngày. Cọc mất nếu thua/rút lui. Đường quan yếu hơn; đường tắt đánh đội ngang cấp.`
      );
      escort.append(
        button(
          'Đường quan · cọc 10 → thắng nhận 24 bạc',
          () => fight(() => app.model.startEscort('safe')),
          w.daily.escorts >= 2
        ),
        button(
          'Đường tắt · cọc 20 → thắng nhận 55 bạc',
          () => fight(() => app.model.startEscort('fast')),
          w.daily.escorts >= 2
        )
      );
      root.append(escort);
    }
    if (tab === 'shop') {
      root.append(roadsideShop);
      renderEquipment(app,root);
      for (const [id, title, text, cost, disabled] of [
        [
          'train',
          `Tu luyện · bậc ${w.training}/10`,
          'Mỗi bậc: Main +2% HP và +1% công, lâu dài.',
          `${50 + w.training * 65} bạc`,
          w.training >= 10
        ],
        [
          'forge',
          `Rèn vũ khí · bậc ${w.forging}/10`,
          'Mỗi bậc: Main +3% công. Cần đang trang bị vũ khí.',
          `${70 + w.forging * 80} bạc + ${2 + w.forging} quặng`,
          w.forging >= 10
        ],
        [
          'alchemy',
          'Luyện Dưỡng Khí Đan',
          'Mỗi viên +10% HP trong một trận.',
          '12 bạc + 2 thảo dược',
          false
        ]
      ]) {
        const p = panel(title, text);
        p.append(button(`Thực hiện · ${cost}`, () => action(id), disabled));
        root.append(p);
      }
      const news = panel(
        'Tửu quán nghe tin',
        '2 bạc/mẩu tin, mỗi mẩu chỉ mua một lần. Tin đã nghe có trong Nhật ký.'
      );
      news.append(
        button(
          `Nghe tin · ${w.newsRead.length}/5`,
          () => action('news'),
          w.newsRead.length === LOCAL_LORE.length
        )
      );
      root.append(news);
    }
    if (tab === 'arena') {
      const arena = panel(
        'Võ lâm đại hội',
        'AI điều khiển đội hình bản chụp. Ba đội bản địa + đội nhập bằng mã từ bạn bè. Không phải PvP trực tiếp hay bảng xếp hạng toàn cầu. Đội mã dùng cấp, trang bị và khí công; không mang bậc rèn/tu luyện hay món ăn của chủ đội. Tối đa 3 thưởng thắng/tuần, mỗi đối thủ chỉ một lần.'
      );
      for (let i = 0; i < 3; i++)
        arena.append(
          button(
            `Đấu đội AI bản địa ${i + 1}${w.weekly.arenaClaims.includes('npc_' + i) ? ' · đã nhận thưởng' : ''}`,
            () => fight(() => app.model.startArena('npc_' + i))
          )
        );
      for (const entry of w.arena) {
        const p = n('div', undefined, 'opponent-row');
        p.append(
          n(
            'strong',
            `${entry.team.name} · cấp ${entry.team.level} · ${entry.team.active.length + 1} người`
          ),
          button('Thi đấu', () => fight(() => app.model.startArena(entry.id))),
          button('Xóa', () => run(() => app.model.removeOpponent(entry.id)))
        );
        arena.append(p);
      }
      root.append(arena);
      const codes = panel(
        'Chia sẻ đội hình',
        'Gửi mã DV1 cho người khác; họ nhập để AI đấu đúng đội của bạn tại thời điểm xuất mã. Mã chỉ chứa đội hình/trang bị, không chuyển tiền hay tiến trình.'
      );
      const output = n('textarea');
      output.readOnly = true;
      output.rows = 3;
      output.setAttribute('aria-label', 'Mã đội hình của bạn');
      codes.append(
        button('Tạo mã đội hình', () =>
          run(() => {
            output.value = app.model.exportTeam();
            output.focus();
            output.select();
            app.toast('Đã tạo mã. Sao chép để gửi cho bạn bè.');
          })
        ),
        output
      );
      const input = n('textarea');
      input.maxLength = 24000;
      input.rows = 3;
      input.placeholder = 'Dán mã DV1…';
      input.setAttribute('aria-label', 'Mã đội hình đối thủ');
      codes.append(
        input,
        button('Nhập đối thủ', () =>
          run(() => app.model.importTeam(input.value))
        )
      );
      root.append(codes);
    }
    if (tab === 'guild') {
      const guild = panel(
        w.guild.name || 'Lập bang giữ nghĩa',
        'Bang hội ngoại tuyến, lưu trên máy này. Chưa có thành viên người chơi khác, chat hay đồng bộ máy chủ.'
      );
      if (!w.guild.name) {
        const input = n('input');
        input.maxLength = 32;
        input.placeholder = 'Tên bang';
        input.setAttribute('aria-label', 'Tên bang');
        guild.append(
          input,
          button('Lập bang · 80 bạc', () => action('guild_create', input.value))
        );
      } else
        guild.append(
          n(
            'p',
            `Công đức ${w.guild.points} · ${w.guild.contributions} lần góp`
          ),
          button('Góp 25 bạc → công đức + quặng', () => action('guild_donate'))
        );
      root.append(guild);
    }
    if (tab === 'characters') {
      const cast = panel('Người đã gặp', 'Hoàn thành hồi truyện để ghi thêm nhân vật. Chọn Truyện ký để đọc lại những việc đã xảy ra.');
      const met = new Set();
      if(isDaiViet(s)){const grid=n('div');grid.className='story-cast-grid';for(const p of casebook(s).people){const card=n('article');card.className='story-cast-card';card.dataset.character=p.id;card.append(portrait(p,'story-cast-portrait'),n('h3',p.name),...p.facts.slice(-3).map(f=>n('p',f.text)));grid.append(card);}cast.append(grid.children.length?grid:n('p','Hoàn thành hồi truyện để ghi lại người đã gặp.'));root.append(cast);}
      else {
      for (const quest of app.model.catalog.quests.filter(q => s.storyProgress.completedQuests.includes(q.id))) {
        for (const [speaker] of quest.lines) { const npc = findNPC(speaker); if (npc) met.add(npc.id); }
        if (quest.encounter) met.add('tay_sai');
      }
      const grid = n('div'); grid.className = 'story-cast-grid';
      for (const npc of NPCS.filter(npc => met.has(npc.id))) {
        const card = n('article'); card.className = 'story-cast-card'; card.dataset.character = npc.id;
        card.append(portrait(npc, 'story-cast-portrait'), n('h3', npc.name), n('p', npc.role, 'tiny-label'), n('p', npc.bio));
        grid.append(card);
      }
      cast.append(grid.children.length ? grid : n('p', 'Bạn chưa hoàn thành hồi truyện nào. Người đầu tiên sẽ được ghi lại sau khi vượt chuyện ở quán Rồng Lửa.'));
      root.append(cast);}
    }
    if (tab === 'story') {
      const archive = panel('Truyện ký');
      renderStoryArchive(app, archive);
      root.append(archive);
    }
    if (tab === 'journal') {
      const journal = panel(
        'Nhật ký giang hồ',
        isDaiViet(s)?'Đại Việt giả tưởng. Hai hướng về hiện đại hoặc ở lại được giữ từ chương 19; ở lại có thể nhận quyền, trao cho hội hoặc về đời sống riêng. Tình cảm với Mai Tước do hai người tự chọn. Không thu bạc để chọn kết thúc.':`Đại Việt giả tưởng; giữ giọng hài hiệp, không tái hiện một triều đại lịch sử. Nhân nghĩa hiện tại ${s.storyProgress.karmaScore}. Bốn hướng: chính (+2), tà (−2 và 100 bạc), ẩn dật, xưng vương (500 bạc).`
      );
      const decisions = panel(
        'Lựa chọn chính truyện đã lưu',
        'Luôn giữ riêng, kể cả khi nhật ký hoạt động gần đây vượt 200 dòng.'
      );
      for (const quest of app.model.catalog.quests) {
        const chosen = s.storyProgress.decisions[quest.id];
        if (chosen && quest.choices.length > 1)
          decisions.append(
            n(
              'p',
              heroText(`${quest.title}: ${quest.choices.find((c) => c.id === chosen)?.text ?? chosen}`,s),
              'journal-choice'
            )
          );
      }
      journal.append(decisions);
      for (const e of [...w.journal].reverse()) {
        const row = n('article', undefined, 'journal-entry');
        row.append(
          n(
            'time',
            new Intl.DateTimeFormat('vi-VN', {
              dateStyle: 'short',
              timeStyle: 'short',
              timeZone: 'Asia/Ho_Chi_Minh'
            }).format(e.time)
          ),
          n('p', heroText(e.text,s))
        );
        journal.append(row);
      }
      if (!w.journal.length)
        journal.append(
          n('p', 'Những quyết định tiếp theo sẽ được ghi ở đây.', 'hint')
        );
      root.append(journal);
    }
  }
  function renderDungeon() {
    const s = app.model.session,
      w = s.adventure,
      root = el('dungeon-root');
    root.replaceChildren();
    if(isDaiViet(s)&&!sectReady(s)){root.append(panel('Chưa nhận nhiệm vụ bí cảnh','Hãy tiếp tục hành trình và chọn nơi nhập môn trong chương 2 trước khi nhận nhiệm vụ này.'));return;}
    const d = w.dungeon;
    if (d) {
      const def = DUNGEONS.find((v) => v.id === d.id),
        p = panel(
          `${def.name} · tầng ${d.floor+1}/${d.mode==='tower'?100:def.floors}`,
          d.mode==='tower'?'Đội và cấp đã chốt lúc vào. Thắng tầng hồi 25% HP cho cả người bị hạ; mốc 10 hồi đầy toàn đội. Trong ba phase boss không hồi miễn phí. Thua/rút lui kết thúc lượt.':'Đội và cấp đã chốt lúc vào. HP giữ qua tầng; tướng bị hạ không được hồi sinh tại quán nghỉ. Thua/rút lui kết thúc lượt.'
        );
      const path = n('div', undefined, 'dungeon-path');
      d.rooms.forEach((_, i) => {
        if(d.mode==='tower'&&(i<d.floor-2||i>d.floor+3&&i!==99))return;
        const e = n('span', i === d.rooms.length - 1 ? undefined : String(i + 1));
        if(i===d.rooms.length-1)e.append(icon('flag'));
        e.dataset.status =
          i < d.floor ? 'done' : i === d.floor ? 'current' : 'future';
        path.append(e);
      });
      p.append(path);
      for (const [id, hp] of Object.entries(d.hp))
        p.append(
          n(
            'p',
            `${id === 'hero' ? d.squad.hero.name : COMPANIONS_BY_ID[id].name}: ${Math.round(hp * 100)}% HP`,
            'hint'
          )
        );
      if (s.storyProgress.pendingEncounter?.kind === 'dungeon')
        p.append(
          button('Tiếp tục trận đang chờ', () =>
            fight(() => app.model.retryEncounter())
          )
        );
      else if(d.mode==='tower'){p.append(n('p','Tháp 100 tầng · hồi 25% HP khi thắng, hồi toàn đội mỗi 10 tầng: địch mạnh dần, boss ba phase mỗi 10 tầng. Thắng tự chuyển tầng; giữ HP và đội đã chốt. Thua/rút lui kết thúc lượt.'));p.append(button('Tiếp tục tầng '+(d.floor+1),()=>fight(()=>app.model.chooseRoom(0))));p.append(button('Rời tháp',()=>run(()=>app.model.leaveDungeon())));}
      else {
        const choice = select(
          {
            0: 'Thận trọng: nghỉ +25% HP/10 bạc; sự kiện đổi 5 bạc lấy dược',
            1: 'Tiết kiệm/mạo hiểm: nghỉ +8% HP; sự kiện −12% HP lấy quặng'
          },
          String(roomOption),
          (v) => {
            roomOption = Number(v);
          }
        );
        p.append(choice);
        d.rooms[d.floor].forEach((room, index) =>
          p.append(
            button(
              `${index === 0 ? 'Lối trái' : 'Lối phải'} · ${ROOM_NAMES[room]}`,
              () =>
                run(() => {
                  const battle = app.model.chooseRoom(index, roomOption);
                  if (battle) {
                    app.clearBattle();
                    app.enterBattle();
                  }
                })
            )
          )
        );
        p.append(
          button('Rời bí cảnh', () => run(() => app.model.leaveDungeon()))
        );
      }
      root.append(p);
      return;
    }
    const week = calendar(app.model.now()).week,
      featured = DUNGEONS[((week % 5) + 5) % 5];
    root.append(
      n(
        'p',
        `Thử thách tuần: ${featured.name}, cấp ${featured.level + 2}. Thưởng tinh hoa và 80 bạc chỉ một lần/tuần. Điều kiện ngũ hành/phái vẫn áp dụng.`,
        'hint'
      )
    );
    root.append(n('p','Mỗi bí cảnh có 2 lượt/ngày. Thường và tuần dùng chung lượt. Mua thêm tối đa 1 lượt/bí cảnh với 60 bạc; đặt lại lúc 00:00 giờ Việt Nam. Phí vào cửa vẫn áp dụng. Thua/rút lui vẫn tính lượt.','hint'));
    for (const def of DUNGEONS) {
      const remaining=remainingEntries(s,def.id);
      const p = panel(
        def.name,
        `100 tầng · hồi 25% HP khi thắng, hồi toàn đội mỗi 10 tầng · kỷ lục ${w.towerBest?.[def.id]??0}/100 · cấp mở ${def.level} · phí ${def.fee} bạc. ${def.description} Lần đầu: bí kíp ${def.relic} + vật liệu/trang bị hiếm.`
      );
      p.append(n('p',`Còn ${remaining} lượt hôm nay`));
      if(remaining===0&&!w.daily.entryPurchases?.[def.id])p.append(button('Mua thêm 1 lượt · 60 bạc',()=>run(()=>app.model.buyDungeonEntry(def.id)),count(s,'silver')<EXTRA_ENTRY_PRICE));
      p.append(
        button(
          w.clears.includes(def.id) ? 'Khám phá lại' : 'Vào bí cảnh',
          () => fight(() => {app.model.enterDungeon(def.id);app.model.chooseRoom(0);}),
          s.hero.level < def.level || remaining<=0
        )
      );
      if (def.id === featured.id)
        p.append(
          button(
            'Thử thách tuần · quái +2 cấp',
            () => fight(() => {app.model.enterDungeon(def.id,true);app.model.chooseRoom(0);}),
            s.hero.level < def.level + 2 || remaining<=0
          )
        );
      root.append(p);
    }
  }
  return {
    openCasebook() {app.setView('tavern');tab='casebook';renderWorld();},
    inspect,
    syncBattleSheet() {
      if (!el('unit-sheet').open) return;
      const unit = app.model.battle?.units.find((u) => u.id === inspectedId);
      if (!unit) return;
      const live = el('sheet-live-stats');
      if (live)
        live.textContent = `${Math.ceil(unit.stats.hp)}/${Math.ceil(unit.stats.maxHp)} HP · ${Math.floor(unit.stats.energy)} nội lực · ${unit.statusEffects
          .filter((e) => STATUS_LABELS[e.type])
          .map((e) => STATUS_LABELS[e.type])
          .join(', ')}`;
      const button = el('sheet-ultimate');
      if (button)
        button.disabled =
          !app.model.running ||
          app.model.battle.autoUltimate ||
          !unit.alive ||
          unit.stats.energy < unit.skills.ultimate.energyCost;
    },
    render() {
      renderBag();
      renderTactics();
      renderWorld();
      renderDungeon();
      el('effects-enable').checked = app.model.session.settings.effects ?? true;
      el('haptics-enable').checked = app.model.session.settings.haptics ?? true;
    },
    refreshCalendar
  };
}
