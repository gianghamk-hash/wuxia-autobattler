import {
  DUNGEONS,
  DAILY_TASKS,
  WEEKLY_TASKS,
  LOCAL_LORE
} from '../data/WorldData.js';
import {
  QIGONG,
  PRIORITIES,
  SECT_ELEMENT,
  ELEMENTS
} from '../data/StrategyData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { EQUIPMENT } from '../data/EquipmentData.js';
import { normalizeHeroBuild } from '../entities/HeroBuild.js';
import { seededRandom } from '../combat/CombatMath.js';
import { BOND_VARIANTS } from '../data/BondsData.js';
const fail = (text) => {
  throw new Error(text);
};
export const count = (s, id) =>
  s.inventory
    .filter((i) => i.itemId === id)
    .reduce((n, i) => n + i.quantity, 0);
export function give(s, id, n) {
  if (!Number.isSafeInteger(n) || n < 1) fail('Phần thưởng không hợp lệ.');
  const item = s.inventory.find((i) => i.itemId === id);
  if (item) item.quantity += n;
  else s.inventory.push({ itemId: id, quantity: n });
}
export function pay(s, id, n) {
  if (!Number.isSafeInteger(n) || n < 1 || count(s, id) < n)
    fail(
      `Không đủ ${id === 'silver' ? 'bạc' : id === 'ore' ? 'quặng' : id === 'herb' ? 'thảo dược' : id === 'tea' ? 'trà' : 'vật phẩm'}.`
    );
  for (const i of s.inventory.filter((i) => i.itemId === id)) {
    const used = Math.min(i.quantity, n);
    i.quantity -= used;
    n -= used;
  }
  s.inventory = s.inventory.filter((i) => i.quantity > 0);
}
export function calendar(now) {
  const day = Math.floor((now + 7 * 3600000) / 86400000);
  return { day, week: Math.floor((day + 3) / 7) };
}
export function freshWorld() {
  return {
    version: 1,
    tactics: {
      priorities: {},
      affiliations: {},
      qigong: 'balanced',
      food: null,
      autoUltimate: true
    },
    daily: {
      day: -1,
      checkIn: -1,
      streak: 0,
      wins: 0,
      crafts: 0,
      floors: 0,
      claimed: [],
      fishing: 0,
      practiceWins: 0,
      escorts: 0
    },
    weekly: { week: -1, wins: 0, clears: 0, claimed: [], arenaClaims: [] },
    training: 0,
    forging: 0,
    practiceWins: 0,
    journal: [],
    dungeon: null,
    clears: [],
    weeklyClears: [],
    escort: null,
    guild: { name: '', points: 0, contributions: 0 },
    arena: [],
    newsRead: []
  };
}
function integer(n, max = 1000000) {
  return Number.isSafeInteger(n) && n >= 0 && n <= max;
}
function safeTree(value, depth = 0) {
  if (depth > 20) fail('Mã đội hình quá nhiều cấp.');
  if (value === null || typeof value === 'boolean' || typeof value === 'string')
    return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) fail('Số không hợp lệ.');
    return;
  }
  if (
    !value ||
    typeof value !== 'object' ||
    (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype)
  )
    fail('Dữ liệu đội hình không hợp lệ.');
  for (const [key, v] of Object.entries(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key))
      fail('Khóa đội hình không an toàn.');
    safeTree(v, depth + 1);
  }
}
export function validateTeam(team) {
  safeTree(team);
  if (
    !team ||
    typeof team.name !== 'string' ||
    !team.name.trim() ||
    team.name.length > 40 ||
    !Array.isArray(team.active) ||
    team.active.length > 5 ||
    new Set(team.active).size !== team.active.length ||
    !team.active.every((id) => Object.hasOwn(COMPANIONS_BY_ID, id)) ||
    !integer(team.level, 20) ||
    team.level < 1 ||
    !Array.isArray(team.inventory) ||
    team.inventory.length > 30 ||
    !team.inventory.every(
      (i) => EQUIPMENT.some((e) => e.id === i.itemId) && i.quantity === 1
    )
  )
    fail('Mã đội hình không hợp lệ.');
  normalizeHeroBuild(team.hero, team.inventory);
  if (
    !Object.hasOwn(SECT_ELEMENT, team.hero.sect) ||
    team.hero.sect === 'TuDo' ||
    team.hero.level !== team.level
  )
    fail('Môn phái đội hình không hợp lệ.');
  const ids = ['hero', ...team.active],
    occupied = new Set();
  if (!team.formation || Object.keys(team.formation).length !== ids.length)
    fail('Đội hình thiếu ô.');
  for (const id of ids) {
    const p = team.formation[id];
    if (
      !p ||
      !integer(p.x, 2) ||
      !integer(p.y, 2) ||
      occupied.has(`${p.x},${p.y}`)
    )
      fail('Ô đội hình bị trùng hoặc ngoài sân.');
    occupied.add(`${p.x},${p.y}`);
  }
  validateTactics(team.tactics, ids);
  if (team.variants !== undefined) {
    if (!team.variants || typeof team.variants !== 'object' || Array.isArray(team.variants)) fail('Biến thể đội chia sẻ không hợp lệ.');
    for (const [id, mode] of Object.entries(team.variants)) if (!team.active.includes(id) || !Object.hasOwn(BOND_VARIANTS, id) || !['base', 'variant'].includes(mode)) fail('Biến thể đội chia sẻ không hợp lệ.');
  }
  return team;
}
function validateTactics(t, ids) {
  if (
    !t ||
    !Object.hasOwn(QIGONG, t.qigong) ||
    ![null, 'tea', 'food_fish', 'elixir'].includes(t.food) ||
    typeof t.autoUltimate !== 'boolean' ||
    !t.priorities ||
    !t.affiliations
  )
    fail('Thiết lập chiến thuật không hợp lệ.');
  for (const [id, p] of Object.entries(t.priorities))
    if (
      !['hero', ...Object.keys(COMPANIONS_BY_ID)].includes(id) ||
      !Object.hasOwn(PRIORITIES, p)
    )
      fail('Ưu tiên mục tiêu không hợp lệ.');
  for (const [id, sect] of Object.entries(t.affiliations))
    if (
      COMPANIONS_BY_ID[id]?.sect !== 'TuDo' ||
      !Object.hasOwn(SECT_ELEMENT, sect) ||
      sect === 'TuDo'
    )
      fail('Gia nhập môn phái không hợp lệ.');
}
export function validateWorld(s) {
  const w = s.adventure;
  if (w === undefined) return;
  const ids = ['hero', ...s.party.active];
  if (!w || w.version !== 1) fail('Phiên bản giang hồ không hợp lệ.');
  validateTactics(w.tactics, ids);
  if (
    !integer(w.training, 10) ||
    !integer(w.forging, 10) ||
    !integer(w.practiceWins) ||
    !Array.isArray(w.journal) ||
    w.journal.length > 200 ||
    !w.journal.every(
      (e) =>
        e &&
        typeof e.text === 'string' &&
        e.text.length <= 400 &&
        Number.isSafeInteger(e.time) &&
        e.time >= 0 &&
        e.time <= 8640000000000000
    ) ||
    !Array.isArray(w.clears) ||
    new Set(w.clears).size !== w.clears.length ||
    !w.clears.every((id) => DUNGEONS.some((d) => d.id === id))
  )
    fail('Tiến trình giang hồ không hợp lệ.');
  for (const [board, key, tasks] of [
    [w.daily, 'day', DAILY_TASKS],
    [w.weekly, 'week', WEEKLY_TASKS]
  ]) {
    if (
      !board ||
      !Number.isSafeInteger(board[key]) ||
      board[key] < -1 ||
      !integer(board.wins) ||
      !Array.isArray(board.claimed) ||
      new Set(board.claimed).size !== board.claimed.length ||
      !board.claimed.every((id) => tasks.some((t) => t.id === id))
    )
      fail('Bảng nhiệm vụ không hợp lệ.');
  }
  if (
    !integer(w.daily.practiceWins) ||
    !integer(w.daily.escorts, 2) ||
    !integer(w.daily.crafts) ||
    !integer(w.daily.floors) ||
    !integer(w.daily.streak, 365) ||
    !integer(w.daily.fishing, 3) ||
    !Number.isSafeInteger(w.daily.checkIn) ||
    w.daily.checkIn < -1 ||
    !integer(w.weekly.clears) ||
    !Array.isArray(w.weekly.arenaClaims) ||
    w.weekly.arenaClaims.length > 3 ||
    new Set(w.weekly.arenaClaims).size !== w.weekly.arenaClaims.length ||
    !w.weekly.arenaClaims.every((v) => typeof v === 'string' && v.length <= 80)
  )
    fail('Nhiệm vụ định kỳ bị lỗi.');
  if (
    !Array.isArray(w.weeklyClears) ||
    w.weeklyClears.length > 30 ||
    !w.weeklyClears.every((v) => Number.isSafeInteger(v)) ||
    new Set(w.weeklyClears).size !== w.weeklyClears.length ||
    !Array.isArray(w.newsRead) ||
    w.newsRead.length > 5 ||
    !w.newsRead.every((v) => integer(v, 4))
  )
    fail('Sổ bí cảnh không hợp lệ.');
  if (
    !w.guild ||
    typeof w.guild.name !== 'string' ||
    w.guild.name.length > 32 ||
    !integer(w.guild.points) ||
    !integer(w.guild.contributions)
  )
    fail('Bang hội không hợp lệ.');
  if (
    !Array.isArray(w.arena) ||
    w.arena.length > 8 ||
    new Set(w.arena.map((e) => e.id)).size !== w.arena.length
  )
    fail('Danh sách đối thủ không hợp lệ.');
  for (const e of w.arena) {
    if (!/^player_[0-9a-f]+$/.test(e.id)) fail('Mã đối thủ không hợp lệ.');
    validateTeam(e.team);
  }
  if (
    w.escort !== null &&
    (!w.escort ||
      !['safe', 'fast'].includes(w.escort.route) ||
      !integer(w.escort.level, 20) ||
      w.escort.level < 1)
  )
    fail('Chuyến tiêu không hợp lệ.');
  if (w.dungeon !== null) {
    const d = w.dungeon,
      definition = DUNGEONS.find((v) => v.id === d.id);
    if (
      !definition ||
      !integer(d.seed, 0xffffffff) ||
      !integer(d.floor, definition.floors - 1) ||
      !Array.isArray(d.rooms) ||
      d.rooms.length !== definition.floors ||
      !d.rooms.every(
        (r, i) =>
          Array.isArray(r) &&
          r.length === 2 &&
          r.every((t) =>
            ['battle', 'treasure', 'event', 'rest', 'boss'].includes(t)
          ) &&
          (i < definition.floors - 1
            ? !r.includes('boss')
            : r.every((t) => t === 'boss'))
      ) ||
      ![null, 0, 1].includes(d.selected) ||
      !integer(d.training, 10) ||
      !integer(d.forging, 10) ||
      typeof d.weekly !== 'boolean' ||
      !Number.isSafeInteger(d.week) ||
      !d.hp ||
      !Object.values(d.hp).every(
        (v) => Number.isFinite(v) && v >= 0 && v <= 1
      ) ||
      !Number.isFinite(d.rewardScale) ||
      d.rewardScale < 0.1 ||
      d.rewardScale > 1
    )
      fail('Bí cảnh không hợp lệ.');
    validateTeam(d.squad);
    if (
      Object.keys(d.hp).length !== d.squad.active.length + 1 ||
      !['hero', ...d.squad.active].every((id) => Object.hasOwn(d.hp, id))
    )
      fail('Sinh lực đoàn thám hiểm không hợp lệ.');
  }
}
export function resetCalendar(s, now) {
  const w = s.adventure,
    { day, week } = calendar(now);
  if (day > w.daily.day)
    w.daily = {
      ...w.daily,
      day,
      wins: 0,
      crafts: 0,
      floors: 0,
      claimed: [],
      fishing: 0,
      practiceWins: 0,
      escorts: 0
    };
  if (week > w.weekly.week)
    w.weekly = { week, wins: 0, clears: 0, claimed: [], arenaClaims: [] };
}
import {heroText,sectReady} from '../data/HeroIdentity.js';
export function log(s, text, now) {
  text=heroText(text,s);
  s.adventure.journal.push({ time: now, text });
  if (s.adventure.journal.length > 200) s.adventure.journal.shift();
}
export function teamSnapshot(s) {
  if(!sectReady(s))fail('Nhập môn trong chương 2 trước khi chia sẻ đội hình.');
  return validateTeam({
    name: s.hero.name.slice(0, 40),
    hero: structuredClone(s.hero),
    level: s.hero.level,
    active: [...s.party.active],
    formation: structuredClone(s.party.formation),
    inventory: s.inventory
      .filter((i) => EQUIPMENT.some((e) => e.id === i.itemId))
      .map((i) => ({ itemId: i.itemId, quantity: 1 })),
    tactics: structuredClone(s.adventure.tactics),
    variants: Object.fromEntries(Object.entries(s.journey?.bonds.modes ?? {}).filter(([id]) => s.party.active.includes(id)))
  });
}
export function encodeTeam(team) {
  validateTeam(team);
  const bytes = new TextEncoder().encode(
    JSON.stringify({ format: 'dai-viet-team', version: 1, team })
  );
  return 'DV1.' + btoa(String.fromCharCode(...bytes));
}
export function decodeTeam(code) {
  if (
    typeof code !== 'string' ||
    code.length > 24000 ||
    !/^DV1\.[A-Za-z0-9+/]+=*$/.test(code)
  )
    fail('Mã đội hình không đúng định dạng DV1.');
  let value;
  try {
    value = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(atob(code.slice(4)), (c) => c.charCodeAt(0))
      )
    );
  } catch {
    fail('Không đọc được mã đội hình.');
  }
  if (value.format !== 'dai-viet-team' || value.version !== 1)
    fail('Phiên bản đội hình không hỗ trợ.');
  return validateTeam(value.team);
}
export function teamId(team) {
  const text = JSON.stringify(team);
  let n = 2166136261;
  for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return 'player_' + (n >>> 0).toString(16);
}
export function worldAction(s, action, arg, now) {
  const w = s.adventure;
  resetCalendar(s, now);
  const { day } = calendar(now);
  let message = '';
  switch (action) {
    case 'checkin':
      if (w.daily.checkIn >= day)
        fail('Hôm nay đã điểm danh, hoặc đồng hồ đang lùi.');
      w.daily.streak =
        w.daily.checkIn === day - 1 ? Math.min(365, w.daily.streak + 1) : 1;
      w.daily.checkIn = day;
      give(s, 'silver', Math.min(16, 6 + w.daily.streak));
      give(s, 'herb', 1);
      message = `Điểm danh ngày ${w.daily.streak}: nhận bạc và thảo dược.`;
      break;
    case 'claim': {
      const task = [...DAILY_TASKS, ...WEEKLY_TASKS].find((t) => t.id === arg);
      if (!task) fail('Nhiệm vụ không tồn tại.');
      const board = arg.startsWith('daily') ? w.daily : w.weekly;
      if (board.claimed.includes(arg) || board[task.metric] < task.target)
        fail('Chưa đủ điều kiện hoặc đã nhận thưởng.');
      board.claimed.push(arg);
      give(s, 'silver', task.silver);
      message = `Nhận ${task.silver} bạc: ${task.label}.`;
      break;
    }
    case 'train':
      if (w.training >= 10) fail('Tu luyện đã đạt bậc 10.');
      pay(s, 'silver', 50 + w.training * 65);
      w.training++;
      message = `Tu luyện bậc ${w.training}: +2% sinh lực và +1% công cho Main mỗi bậc.`;
      break;
    case 'forge':
      if (w.forging >= 10) fail('Vũ khí đã rèn bậc 10.');
      if (!s.hero.equippedGear.weapon) fail('Cần trang bị vũ khí trước.');
      pay(s, 'silver', 70 + w.forging * 80);
      pay(s, 'ore', 2 + w.forging);
      w.forging++;
      w.daily.crafts++;
      message = `Rèn bậc ${w.forging}: +3% công cho Main mỗi bậc.`;
      break;
    case 'alchemy':
      pay(s, 'silver', 12);
      pay(s, 'herb', 2);
      give(s, 'elixir', 1);
      w.daily.crafts++;
      message = 'Luyện được Dưỡng Khí Đan: +10% sinh lực trong một trận.';
      break;
    case 'fish':
      if (w.daily.fishing >= 3) fail('Mỗi ngày chỉ câu 3 lượt.');
      pay(s, 'silver', 2);
      w.daily.fishing++;
      give(s, 'food_fish', 1);
      give(s, w.daily.fishing === 3 ? 'ore' : 'herb', 1);
      message = 'Câu được cá và vật liệu ven bờ.';
      break;
    case 'guild_create':
      if (w.guild.name) fail('Đã có bang hội bản địa.');
      if (typeof arg !== 'string' || !arg.trim() || arg.trim().length > 32)
        fail('Tên bang cần 1–32 ký tự.');
      pay(s, 'silver', 80);
      w.guild.name = arg.trim();
      message = `Lập ${w.guild.name}. Đây là bang hội ngoại tuyến với sổ công đức trên máy này.`;
      break;
    case 'guild_donate':
      if (!w.guild.name) fail('Hãy lập bang trước.');
      pay(s, 'silver', 25);
      w.guild.points += 10;
      w.guild.contributions++;
      give(s, 'ore', 1);
      if (w.guild.contributions % 3 === 0) give(s, 'herb', 2);
      message = 'Đóng góp 25 bạc: +10 công đức và quặng rèn.';
      break;
    case 'news': {
      const unread = LOCAL_LORE.findIndex((_, i) => !w.newsRead.includes(i));
      if (unread < 0) fail('Đã nghe hết tin hiện có.');
      pay(s, 'silver', 2);
      w.newsRead.push(unread);
      message = LOCAL_LORE[unread];
      break;
    }
    case 'affiliation': {
      const { id, sect } = arg ?? {};
      if (
        !s.party.unlocked.includes(id) ||
        COMPANIONS_BY_ID[id].sect !== 'TuDo' ||
        !Object.hasOwn(SECT_ELEMENT, sect) ||
        sect === 'TuDo'
      )
        fail('Chỉ tướng Tự do đã chiêu mộ mới được nhập phái.');
      if (w.tactics.affiliations[id] === sect) fail('Tướng đã thuộc phái này.');
      pay(s, 'silver', 80);
      w.tactics.affiliations[id] = sect;
      message =
        'Đã nhập phái; giữ tuyệt kỹ riêng, nhận ngũ hành và nội tại môn phái mới.';
      break;
    }
    default:
      fail('Hoạt động không tồn tại.');
  }
  log(s, message, now);
  return message;
}
export function makeDungeon(s, id, weekly, now) {
  const def = DUNGEONS.find((d) => d.id === id);
  if (!def) fail('Bí cảnh không tồn tại.');
  if (s.adventure.dungeon) fail('Hãy hoàn tất hoặc rời bí cảnh hiện tại.');
  if (s.hero.level < def.level + (weekly ? 2 : 0))
    fail(`Cần cấp ${def.level + (weekly ? 2 : 0)}.`);
  const squad = teamSnapshot(s),
    sects = [
      s.hero.sect,
      ...s.party.active.map(
        (id) =>
          s.adventure.tactics.affiliations[id] ?? COMPANIONS_BY_ID[id].sect
      )
    ];
  if (
    !sects.some(
      (sect) => sect === def.sect || SECT_ELEMENT[sect] === def.element
    )
  )
    fail('Chưa đạt điều kiện ngũ hành/môn phái.');
  const { week } = calendar(now);
  if (weekly && DUNGEONS[((week % 5) + 5) % 5].id !== id)
    fail('Bí cảnh tuần đã đổi.');
  pay(s, 'silver', def.fee);
  const seed =
      (week * 3571 +
        s.storyProgress.attemptCounter * 941 +
        s.adventure.journal.length * 17 +
        id.length) >>>
      0,
    rng = seededRandom(seed),
    bag = ['battle', 'event', 'treasure', 'rest'];
  const rooms = Array.from({ length: def.floors }, (_, i) =>
    i === def.floors - 1
      ? ['boss', 'boss']
      : [bag[i % 4], bag[(i + 1 + Math.floor(rng() * 3)) % 4]]
  );
  return {
    id,
    weekly,
    week,
    seed,
    training: s.adventure.training,
    forging: s.adventure.forging,
    floor: 0,
    rooms,
    selected: null,
    squad,
    hp: Object.fromEntries(['hero', ...s.party.active].map((id) => [id, 1])),
    rewardScale: Math.max(0.15, Math.min(1, def.level / s.hero.level))
  };
}
export function validatePreparation(p) {
  if (!p || !integer(p.training, 10) || !integer(p.forging, 10))
    fail('Khí công trước trận không hợp lệ.');
  validateTactics(p.tactics, []);
}
