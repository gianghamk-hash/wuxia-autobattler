import { BOND_STORIES, BOND_VARIANTS } from '../data/BondsData.js';
import { MAIN_BY_ID, RECRUIT_BY_ID } from '../data/QuestsData.js';
import { DAI_VIET_BY_ID } from '../data/DaiVietStoryData.js';
import {bondCatalog} from '../data/DaiVietBonds.js';
import { QIGONG, QIGONG_UNLOCKS, PRIORITIES } from '../data/StrategyData.js';
export const freshJourney = () => ({
  version: 1,
  reader: { positions: {}, history: [], fontSize: 18 },
  loadouts: [null, null, null],
  bonds: { completed: [], choices: {}, modes: {} }
});
const fail = (message) => {
  throw Error(message);
};
const plain = (v) => v && Object.getPrototypeOf(v) === Object.prototype;
const integer = (v, max) => Number.isInteger(v) && v >= 0 && v <= max;
export function validReaderKey(key) {
  const [kind, id, extra] = String(key).split(':');
  return (
    !extra &&
    ((['main', 'archive'].includes(kind) && (Object.hasOwn(MAIN_BY_ID, id)||Object.hasOwn(DAI_VIET_BY_ID,id))) ||
      (kind==='flow' && Object.hasOwn(DAI_VIET_BY_ID,id)) ||
      (kind==='aftermath' && Boolean(DAI_VIET_BY_ID[id]?.aftermath)) ||
      (kind === 'recruit' && Object.hasOwn(RECRUIT_BY_ID, id)) ||
      (kind === 'bond' && BOND_STORIES.some((b) => b.id === id)))
  );
}
function checkLayout(layout, session) {
  if (
    !plain(layout) ||
    typeof layout.name !== 'string' ||
    !layout.name.trim() ||
    layout.name.length > 32 ||
    !Array.isArray(layout.active) ||
    layout.active.length > 5 ||
    new Set(layout.active).size !== layout.active.length ||
    !layout.active.every((id) => session.party.unlocked.includes(id))
  )
    fail('Đội hình lưu không hợp lệ.');
  const ids = ['hero', ...layout.active],
    seen = new Set();
  if (
    !plain(layout.formation) ||
    Object.keys(layout.formation).length !== ids.length
  )
    fail('Ô đội hình lưu không hợp lệ.');
  for (const id of ids) {
    const p = layout.formation[id];
    if (
      !plain(p) ||
      !integer(p.x, 2) ||
      !integer(p.y, 2) ||
      seen.has(`${p.x},${p.y}`)
    )
      fail('Vị trí đội hình lưu bị trùng hoặc ngoài sân.');
    seen.add(`${p.x},${p.y}`);
  }
  if (
    !plain(layout.tactics) ||
    !plain(layout.tactics.priorities) ||
    !Object.hasOwn(QIGONG, layout.tactics.qigong) ||
    typeof layout.tactics.autoUltimate !== 'boolean'
  )
    fail('Chiến thuật lưu không hợp lệ.');
  for (const [id, value] of Object.entries(layout.tactics.priorities))
    if (!ids.includes(id) || !Object.hasOwn(PRIORITIES, value))
      fail('Ưu tiên lưu không hợp lệ.');
  const unlock = QIGONG_UNLOCKS[layout.tactics.qigong];
  if (unlock && !session.adventure.clears.includes(unlock))
    fail('Khí công của đội lưu chưa mở.');
}
export function validateJourney(session) {
  const BOND_STORIES=bondCatalog(session);
  const j = session.journey;
  if (j === undefined) return;
  if (
    !plain(j) ||
    j.version !== 1 ||
    !plain(j.reader) ||
    !plain(j.reader.positions) ||
    Object.keys(j.reader.positions).length > 1600 ||
    ![16, 18, 20, 22].includes(j.reader.fontSize) ||
    !Array.isArray(j.reader.history) ||
    j.reader.history.length > 60 ||
    !Array.isArray(j.loadouts) ||
    j.loadouts.length !== 3 ||
    !plain(j.bonds) ||
    !Array.isArray(j.bonds.completed) ||
    !plain(j.bonds.choices) ||
    !plain(j.bonds.modes)
  )
    fail('Nhật ký hành trình không hợp lệ.');
  for (const [key, index] of Object.entries(j.reader.positions))
    if (!validReaderKey(key) || !integer(index, 200))
      fail('Dấu đọc không hợp lệ.');
  for (const row of j.reader.history)
    if (
      !plain(row) ||
      !validReaderKey(row.key) ||
      !integer(row.index, 200) ||
      typeof row.speaker !== 'string' ||
      row.speaker.length > 80 ||
      typeof row.text !== 'string' ||
      row.text.length > 1000
    )
      fail('Nhật ký thoại không hợp lệ.');
  for (const layout of j.loadouts)
    if (layout !== null) checkLayout(layout, session);
  if (
    new Set(j.bonds.completed).size !== j.bonds.completed.length ||
    j.bonds.completed.length > BOND_STORIES.length ||
    Object.keys(j.bonds.choices).length !== j.bonds.completed.length
  )
    fail('Truyện đồng hành bị lặp.');
  for (const id of j.bonds.completed) {
    const b = BOND_STORIES.find((b) => b.id === id);
    if (
      !b ||
      !available(session, b) ||
      !b.choices.some((c) => c.id === j.bonds.choices[id])
    )
      fail('Tiến trình đồng hành không hợp lệ.');
  }
  for (const [id, mode] of Object.entries(j.bonds.modes))
    if (
      !Object.hasOwn(BOND_VARIANTS, id) ||
      !['base', 'variant'].includes(mode) ||
      !j.bonds.completed.includes(`bond_${id}_3`)
    )
      fail('Biến thể chiêu chưa được mở.');
}
function available(session, story) {
  return (
    session.party.unlocked.includes(story.companionId) &&
    (session.companionsAffinity[story.companionId] ?? 0) >= story.affinity &&
    session.storyProgress.currentChapter >= story.chapter &&
    (story.stage === 1 ||
      session.journey.bonds.completed.includes(
        `bond_${story.companionId}_${story.stage - 1}`
      ))
  );
}
export const journeyMethods = {
  rememberDialogue(key, index, speaker, text) {
    if (!validReaderKey(key) || !integer(index, 200))
      fail('Dấu đọc không hợp lệ.');
    const previous = this.session.journey.reader;
    const last = previous.history.at(-1);
    if (
      previous.positions[key] === index &&
      last?.key === key &&
      last.index === index
    )
      return;
    const next = this.snapshot();
    next.journey.reader.positions[key] = index;
    next.journey.reader.history.push({
      key,
      index,
      speaker: String(speaker).slice(0, 80),
      text: String(text).slice(0, 1000)
    });
    if (next.journey.reader.history.length > 60)
      next.journey.reader.history.shift();
    this._commit(next, 'reader');
  },
  setReaderFont(size) {
    const next = this.snapshot();
    next.journey.reader.fontSize = size;
    this._commit(next, 'reader');
  },
  saveLoadout(index, name) {
    if (!integer(index, 2)) fail('Chỉ có ba ô đội hình.');
    this._mutate((next) => {
      if (next.storyProgress.pendingEncounter || next.adventure.dungeon)
        fail('Kết thúc thử thách trước khi lưu đội hình.');
      const ids = ['hero', ...next.party.active];
      next.journey.loadouts[index] = {
        name: name.trim(),
        active: [...next.party.active],
        formation: structuredClone(next.party.formation),
        tactics: {
          priorities: Object.fromEntries(
            Object.entries(next.adventure.tactics.priorities).filter(([id]) =>
              ids.includes(id)
            )
          ),
          qigong: next.adventure.tactics.qigong,
          autoUltimate: next.adventure.tactics.autoUltimate
        }
      };
    }, 'loadout');
  },
  applyLoadout(index) {
    if (!integer(index, 2)) fail('Ô đội hình không tồn tại.');
    this._mutate((next) => {
      if (next.storyProgress.pendingEncounter || next.adventure.dungeon)
        fail('Kết thúc thử thách trước khi đổi đội hình.');
      const layout = next.journey.loadouts[index];
      if (!layout) fail('Ô đội hình đang trống.');
      checkLayout(layout, next);
      next.party.active = [...layout.active];
      next.party.formation = structuredClone(layout.formation);
      Object.assign(next.adventure.tactics, structuredClone(layout.tactics));
    }, 'formation');
  },
  bondStories() {
    return bondCatalog(this.session).map((b) => ({
      ...b,
      done: this.session.journey.bonds.completed.includes(b.id),
      available: this.session.storyProgress.decisions.D19H18!=='home'&&available(this.session, b)
    }));
  },
  completeBond(id, choice) {
    if(this.session.storyProgress.decisions.D19H18==='home')fail('Nhánh trở về chỉ xem lại các cuộc trò chuyện đã có.');
    this._mutate((next) => {
      if (next.storyProgress.pendingEncounter || next.adventure.dungeon)
        fail('Kết thúc thử thách trước khi trò chuyện.');
      const b = bondCatalog(next).find((b) => b.id === id);
      if (
        !b ||
        !available(next, b) ||
        next.journey.bonds.completed.includes(id) ||
        !b.choices.some((c) => c.id === choice)
      )
        fail('Truyện đồng hành chưa mở hoặc đã hoàn tất.');
      next.journey.bonds.completed.push(id);
      next.journey.bonds.choices[id] = choice;
      if (b.stage === 3) next.journey.bonds.modes[b.companionId] = 'variant';
    }, 'bond');
  },
  setBondMode(id, mode) {
    this._mutate((next) => {
      if (next.storyProgress.pendingEncounter || next.adventure.dungeon)
        fail('Kết thúc thử thách trước khi đổi chiêu.');
      next.journey.bonds.modes[id] = mode;
    }, 'bond');
  }
};
