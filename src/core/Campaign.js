import {entryMethods} from './DungeonEntries.js';
import {bossSequence} from '../combat/BattleRules6.js';
import { freshGacha, validateGacha, gachaMethods } from './Gacha.js';
import { freshJourney, validateJourney, journeyMethods } from './Journey.js';
import { MISSIONS } from '../data/MissionsData.js';
import { enemyLineup } from './EncounterFactory.js';
import { bossGuide } from '../combat/BossDirector.js';
import { applyStoryIdentity, NPCS_BY_ID } from '../data/NPCData.js';
import { expandStoryProgress } from './StoryProgress.js';
import { STORY_REVISION } from '../data/StoryChaptersData.js';
import { storyCatalog } from '../data/StoryCatalog.js';
import { resolveDaiVietQuest } from '../data/DaiVietStoryData.js';
import {expansionAvailable} from '../data/ExpansionCast.js';
import {lootMethods,validateLoot,storyEquipment,chapterBossAvailable,bossLoot,chapterBossRewards} from './Loot.js';
import {ENROLLMENT_QUEST,hasEnrollment,sectReady,storyHeroBuild,heroAppearance} from '../data/HeroIdentity.js';
import { isDaiViet, PLOT_COMPANIONS, PLOT_UNLOCKS, DAI_VIET_CAST_BY_ID, applyDaiVietName } from '../data/DaiVietCast.js';
import {
  freshWorld,
  validateWorld,
  validatePreparation,
  log,
  resetCalendar
} from './WorldProgress.js';
import { worldMethods } from './WorldCampaign.js';
import {
  createHeroBuild,
  normalizeHeroBuild,
  gainExperience,
  changeSect
} from '../entities/HeroBuild.js';
import { Hero } from '../entities/Hero.js';
import { Companion } from '../entities/Companion.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { EQUIPMENT } from '../data/EquipmentData.js';
import {
  MAIN_QUESTS,
  MAIN_BY_ID,
  RECRUIT_QUESTS,
  RECRUIT_BY_ID,
  ENDINGS
} from '../data/QuestsData.js';
import { ENCOUNTERS } from '../data/EnemiesData.js';
import { GridSystem } from '../combat/GridSystem.js';
import { CombatEngine } from '../combat/CombatEngine.js';

const has = (object, key) => Object.hasOwn(object, key);
const fail = (text) => {
  throw new Error(text);
};
const nonnegative = (n) => Number.isSafeInteger(n) && n >= 0;
const defaults = {
  hero: { x: 2, y: 1 },
  ally1: { x: 1, y: 0 },
  ally2: { x: 0, y: 2 }
};
export const itemCount = (session, itemId) =>
  session.inventory
    .filter((i) => i.itemId === itemId)
    .reduce((sum, item) => sum + item.quantity, 0);
function give(session, itemId, quantity) {
  const item = session.inventory.find((item) => item.itemId === itemId);
  if (item) item.quantity += quantity;
  else session.inventory.push({ itemId, quantity });
}
function consume(session, itemId, quantity) {
  if (!nonnegative(quantity) || quantity < 1)
    fail('Số lượng vật phẩm không hợp lệ.');
  if (itemCount(session, itemId) < quantity)
    fail(
      `Không đủ ${itemId === 'silver' ? 'bạc' : itemId === 'rope' ? 'dây thừng' : itemId === 'food_fish' ? 'cá' : 'vật phẩm nhiệm vụ'}.`
    );
  let remaining = quantity;
  for (const item of session.inventory.filter((i) => i.itemId === itemId)) {
    const used = Math.min(item.quantity, remaining);
    item.quantity -= used;
    remaining -= used;
  }
  session.inventory = session.inventory.filter((item) => item.quantity > 0);
}
function setFormation(session) {
  const ids = ['hero', ...session.party.active],
    previous = session.party.formation,
    next = {},
    occupied = new Set();
  for (const [i, id] of ids.entries()) {
    const desired =
      previous[id] ??
      [
        defaults.hero,
        defaults.ally1,
        defaults.ally2,
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 0 }
      ][i];
    const key = `${desired.x},${desired.y}`;
    if (!occupied.has(key)) {
      next[id] = { ...desired };
      occupied.add(key);
    } else
      for (let x = 2; x >= 0 && !next[id]; x--)
        for (let y = 0; y < 3 && !next[id]; y++)
          if (!occupied.has(`${x},${y}`)) {
            next[id] = { x, y };
            occupied.add(`${x},${y}`);
          }
  }
  session.party.formation = next;
}
function freshStory(catalog=storyCatalog('legacy')) {
  return {
    campaignVersion: 1,
    storyRevision: catalog.revision,
    currentChapter: 1,
    currentEpisode: 1,
    currentAct: 1,
    activeQuestId: catalog.quests[0].id,
    questFlags: {},
    karmaScore: 0,
    completedQuests: [],
    decisions: {},
    attemptCounter: 0,
    pendingEncounter: null,
    endingId: null
  };
}
// Preserve older engine callers; the app explicitly selects dai-viet for a new journey.
export function createCampaign({ name, sect = null, story = 'legacy' } = {}) {
  if(!['legacy','dai-viet'].includes(story))fail('Câu chuyện chưa được hỗ trợ.');
  const catalog=storyCatalog(story);
  const hero = createHeroBuild({ name:name??(story==='dai-viet'?'Trần Phong':'Tiểu Hiệp'), sect });
  hero.equippedGear = {
    weapon: 'starter_weapon',
    armor: 'starter_armor',
    accessory: 'starter_accessory'
  };
  return {
    schemaVersion: 1,
    version: '4.3.0',
    playtimeSeconds: 0,
    hero,
    party: {
      active: [],
      unlocked: [],
      formation: { hero: { ...defaults.hero } }
    },
    inventory: ['starter_weapon', 'starter_armor', 'starter_accessory']
      .map((itemId) => ({ itemId, quantity: 1 }))
      .concat([
        { itemId: 'silver', quantity: 30 },
        { itemId: 'rope', quantity: 1 },
        { itemId: 'food_fish', quantity: 1 }
      ]),
    companionsAffinity: {},
    storyProgress: { ...freshStory(catalog), questFlags: { STARTER_KIT: true } },
    adventure: freshWorld(),
    gacha: freshGacha(),
    journey: freshJourney(),
    settings: { muted: true, volume: 0.35 }
  };
}
export function validateCampaign(session) {
  const catalog=storyCatalog(session),{quests:MAIN_QUESTS,byId:MAIN_BY_ID,endings:ENDINGS}=catalog;
  validateJourney(session);
  if (
    session.storyProgress?.campaignVersion === 1 &&
    ![STORY_REVISION,4].includes(session.storyProgress.storyRevision)
  )
    return validateCampaign({
      ...session,
      storyProgress: expandStoryProgress(session.storyProgress)
    });
  const story = session.storyProgress;
  if (story?.campaignVersion !== 1)
    fail('Phiên bản chiến dịch chưa được hỗ trợ.');
  if (
    !Array.isArray(session.inventory) ||
    !session.inventory.every(
      (item) =>
        item &&
        typeof item.itemId === 'string' &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 1000000000
    ) ||
    !Number.isFinite(session.playtimeSeconds) ||
    session.playtimeSeconds < 0
  )
    fail('Túi đồ hoặc thời gian chơi không hợp lệ.');
  normalizeHeroBuild(session.hero, session.inventory);
  if(session.loot!==undefined)validateLoot(session.loot);
  if(isDaiViet(session)&&hasEnrollment(session)&&!session.hero.sect)fail('Bản lưu đã nhập môn cần có môn phái.');
  validateWorld(session);
  if (session.gacha !== undefined) validateGacha(session.gacha);
  if (
    !Array.isArray(story.completedQuests) ||
    new Set(story.completedQuests).size !== story.completedQuests.length ||
    !story.completedQuests.every(
      (id) => has(MAIN_BY_ID, id) || has(RECRUIT_BY_ID, id)
    ) ||
    !story.decisions ||
    Object.getPrototypeOf(story.decisions) !== Object.prototype ||
    !nonnegative(story.attemptCounter) ||
    !Number.isSafeInteger(story.karmaScore) ||
    Math.abs(story.karmaScore) > 1000 ||
    !story.questFlags ||
    Object.values(story.questFlags).some((value) => typeof value !== 'boolean')
  )
    fail('Tiến trình nhiệm vụ không hợp lệ.');
  let gap = false;
  for (const quest of MAIN_QUESTS) {
    if (!story.completedQuests.includes(quest.id)) gap = true;
    else if (gap) fail('Tiến trình hồi truyện bị thiếu nhiệm vụ trước.');
  }
  const next = MAIN_QUESTS.find((q) => !story.completedQuests.includes(q.id));
  if (
    story.activeQuestId !== (next?.id ?? null) ||
    story.currentAct !== (next?.act ?? catalog.finalAct) ||
    story.currentChapter !== (next?.chapter ?? catalog.chapters.length) ||
    story.currentEpisode !== (next?.episode ?? 20)
  )
    fail('Nhiệm vụ đang theo dõi không khớp tiến trình.');
  for (const [id, choice] of Object.entries(story.decisions)) {
    if (has(MAIN_BY_ID, id)) {
      if(isDaiViet(session)&&!story.completedQuests.includes(id)&&id!==story.activeQuestId)fail('Lựa chọn thuộc hồi chưa mở.');
      if (!MAIN_BY_ID[id].choices.some((c) => c.id === choice))
        fail('Lựa chọn hội thoại không hợp lệ.');
    } else if (!has(RECRUIT_BY_ID, id) || !['help', 'demand'].includes(choice))
      fail('Lựa chọn nhiệm vụ không tồn tại.');
  }
  if(isDaiViet(session)&&MAIN_QUESTS.some(q=>!q.ending&&story.completedQuests.includes(q.id)&&!story.decisions[q.id]))fail('Hồi đã qua thiếu lựa chọn được lưu.');
  if (
    !Array.isArray(session.party.active) ||
    !Array.isArray(session.party.unlocked) ||
    session.party.active.length > 5 ||
    session.party.unlocked.length > Object.keys(COMPANIONS_BY_ID).length ||
    new Set(session.party.unlocked).size !== session.party.unlocked.length ||
    new Set(session.party.active).size !== session.party.active.length ||
    !session.party.unlocked.every((id) => has(COMPANIONS_BY_ID, id)) ||
    !session.party.active.every((id) => session.party.unlocked.includes(id))
  )
    fail('Đồng đội chiến dịch không hợp lệ.');
  const ids = ['hero', ...session.party.active],
    occupied = new Set();
  if (Object.keys(session.party.formation).length !== ids.length)
    fail('Đội hình còn vị trí thừa hoặc thiếu.');
  for (const id of ids) {
    const p = session.party.formation[id];
    if (
      !p ||
      !Number.isInteger(p.x) ||
      !Number.isInteger(p.y) ||
      p.x < 0 ||
      p.x > 2 ||
      p.y < 0 ||
      p.y > 2 ||
      occupied.has(`${p.x},${p.y}`)
    )
      fail('Vị trí đội hình bị trùng hoặc ngoài sân.');
    occupied.add(`${p.x},${p.y}`);
  }
  if(isDaiViet(session)&&PLOT_COMPANIONS.some(id=>session.party.unlocked.includes(id)&&!story.completedQuests.includes(PLOT_UNLOCKS[id])))fail('Đồng hành chính truyện chưa tới mốc gặp.');
  if(session.party.unlocked.some(id=>!expansionAvailable(session,id)))fail('Đồng hành mới chưa xuất hiện trong chính truyện.');
  for (const quest of RECRUIT_QUESTS)
    if (
      story.completedQuests.includes(quest.id) &&
      !session.party.unlocked.includes(quest.companionId)
    )
      fail('Nhiệm vụ chiêu mộ và danh sách đồng đội không khớp.');
  if (
    Object.entries(session.companionsAffinity).some(
      ([id, value]) =>
        !session.party.unlocked.includes(id) ||
        !nonnegative(value) ||
        value > 100
    )
  )
    fail('Duyên nợ đồng đội không hợp lệ.');
  if (
    !(
      story.endingId === null || ENDINGS.some((e) => e.id === story.endingId)
    ) ||
    Boolean(story.endingId) !== story.completedQuests.includes(catalog.finalId)
  )
    fail('Kết cục không khớp tiến trình.');
  const pending = story.pendingEncounter;
  if(isDaiViet(session)&&story.endingId&&((story.endingId==='home')!==(story.decisions.D19H18==='home')))fail('Kết cục không khớp lựa chọn cổng.');
  if (pending !== null) {
    if (
      !pending ||
      !nonnegative(pending.token) ||
      pending.token < 1 ||
      pending.token > story.attemptCounter ||
      !nonnegative(pending.seed) ||
      pending.seed > 0xffffffff ||
      !['main', 'recruit', 'practice', 'dungeon', 'arena', 'escort','chapterBoss'].includes(
        pending.kind
      )
    )
      fail('Trận chưa hoàn tất không hợp lệ.');
    if (pending.preparation !== undefined)
      validatePreparation(pending.preparation);
    if (
      pending.missionId !== undefined &&
      (!['main','recruit'].includes(pending.kind) ||
        pending.missionId !== pending.questId ||
        !Object.hasOwn(MISSIONS, pending.missionId))
    )
      fail('Mục tiêu trận đang chờ không hợp lệ.');
    if (
      pending.kind === 'dungeon' &&
      (!session.adventure?.dungeon ||
        pending.questId !== session.adventure.dungeon.id ||
        session.adventure.dungeon.selected === null)
    )
      fail('Trận bí cảnh không khớp.');
    if (
      pending.kind === 'escort' &&
      (!session.adventure?.escort ||
        pending.questId !== session.adventure.escort.route)
    )
      fail('Trận tiêu cục không khớp.');
    if (
      pending.kind === 'arena' &&
      !(
        typeof pending.questId === 'string' &&
        (/^npc_[0-2]$/.test(pending.questId) ||
          session.adventure?.arena.some((e) => e.id === pending.questId))
      )
    )
      fail('Đối thủ đại hội không tồn tại.');
    if (
      pending.kind === 'main' &&
      (!has(MAIN_BY_ID, pending.questId) ||
        story.activeQuestId !== pending.questId ||
        !MAIN_BY_ID[pending.questId].encounter)
    )
      fail('Trận chính truyện không hợp lệ.');
    if (
      pending.kind === 'recruit' &&
      (!has(RECRUIT_BY_ID, pending.questId) ||
        story.completedQuests.includes(pending.questId) ||
        RECRUIT_BY_ID[pending.questId].puzzle ||
        story.questFlags[`challenge_${pending.questId}`])
    )
      fail('Trận chiêu mộ không hợp lệ.');
    if(pending.kind==='chapterBoss'&&(!/^(?:[1-9]|1[0-9]|20)$/.test(pending.questId)||!chapterBossAvailable(session,Number(pending.questId))))fail('Boss chương chưa mở hoặc không hợp lệ.');
    if (pending.kind === 'practice' && pending.questId !== null)
      fail('Trận luyện tập không hợp lệ.');
  }
  if (
    session.legacyEnding &&
    (typeof session.legacyEnding.name !== 'string' ||
      session.legacyEnding.name.length > 80 ||
      typeof session.legacyEnding.text !== 'string' ||
      session.legacyEnding.text.length > 400)
  )
    fail('Kết cục bản cũ không hợp lệ.');
  if (
    session.settings &&
    (typeof session.settings.muted !== 'boolean' ||
      !Number.isFinite(session.settings.volume) ||
      session.settings.volume < 0 ||
      session.settings.volume > 1 ||
      (session.settings.effects !== undefined &&
        typeof session.settings.effects !== 'boolean') ||
      (session.settings.haptics !== undefined &&
        typeof session.settings.haptics !== 'boolean'))
  )
    fail('Thiết lập âm thanh không hợp lệ.');
  return session;
}
export function migrateCampaign(input) {
  const next = structuredClone(input);
  next.hero = normalizeHeroBuild(next.hero, next.inventory);
  if (next.storyProgress.campaignVersion === undefined) {
    const legacy = structuredClone(next.storyProgress);
    next.storyProgress = {
      ...freshStory(),
      questFlags: { ...legacy.questFlags },
      karmaScore: legacy.karmaScore,
      completedQuests: RECRUIT_QUESTS.filter((q) =>
        next.party.unlocked.includes(q.companionId)
      ).map((q) => q.id)
    };
    next.legacyProgress = legacy;
    next.party.unlocked = next.party.unlocked.filter((id) =>
      has(COMPANIONS_BY_ID, id)
    );
    next.party.active = next.party.active.filter((id) =>
      next.party.unlocked.includes(id)
    );
    for (const id of next.party.unlocked) next.companionsAffinity[id] ??= 15;
    if (!next.storyProgress.questFlags.STARTER_KIT) {
      for (const id of ['starter_weapon', 'starter_armor', 'starter_accessory'])
        if (!itemCount(next, id)) give(next, id, 1);
      give(next, 'silver', 30);
      give(next, 'rope', 1);
      give(next, 'food_fish', 1);
      next.storyProgress.questFlags.STARTER_KIT = true;
    }
    setFormation(next);
  }
  if (!next.adventure && next.storyProgress.endingId) {
    const names = {
      justice: 'Minh Chủ Liêm Khiết',
      wealth: 'Trùm Tài Phiệt Giang Hồ',
      retire: 'Quy Ẩn Bán Bún Đậu',
      actor: 'Diễn Viên Đóng Thế'
    };
    next.legacyEnding = {
      name: names[next.storyProgress.endingId],
      text: 'Kết cục từ phiên bản 1.x được giữ lại. Bốn hướng chính, tà, ẩn dật và xưng vương áp dụng cho các hành trình mới trong Đại Việt giả tưởng.'
    };
  }
  if(next.storyProgress.storyRevision!==4)next.storyProgress = expandStoryProgress(next.storyProgress);
  next.adventure ??= freshWorld();
  next.gacha ??= freshGacha();
  next.journey ??= freshJourney();
  next.version = '4.3.0';
  next.settings ??= { muted: true, volume: 0.35 };
  validateCampaign(next);
  return next;
}

export class Campaign {
  constructor({
    onChange = () => {},
    onBattleEvent = () => {},
    now = () => Date.now()
  } = {}) {
    this.now = now;
    this.onChange = onChange;
    this.onBattleEvent = onBattleEvent;
    this.session = createCampaign();
    this.battle = null;
    this.lastResult = null;
    this.battleToken = null;
  }
  get running() {
    return this.battle?.state === 'running';
  }
  get catalog(){return storyCatalog(this.session);}
  snapshot() {
    validateCampaign(this.session);
    return structuredClone(this.session);
  }
  _guard() {
    if (this.running) fail('Hãy kết thúc hoặc rút lui khỏi trận trước.');
  }
  _commit(next, reason) {
    validateCampaign(next);
    this.session = next;
    this.onChange(reason);
  }
  _mutate(fn, reason) {
    this._guard();
    const next = this.snapshot();
    resetCalendar(next, this.now());
    fn(next);
    this._commit(next, reason);
  }
  load(input) {
    const next = migrateCampaign(input); // Validate completely before aborting the current game.
    this.battle?.abort();
    this.battle = null;
    this.battleToken = null;
    this.lastResult = null;
    this._commit(next, 'restore');
  }
  newGame(options) {
    this._guard();
    this.battle = null;
    this.lastResult = null;
    this._commit(createCampaign(options), 'new');
  }
  mainQuest() {
    return resolveDaiVietQuest(this.catalog.byId[this.session.storyProgress.activeQuestId] ?? null,this.session);
  }
  availableRecruitQuests() {
    return RECRUIT_QUESTS.filter(
      (q) =>
        (q.chapter ?? (q.act - 1) * 4 + 1) <=
          this.session.storyProgress.currentChapter &&
        (this.session.storyProgress.completedQuests.includes('Q101')||this.session.storyProgress.completedQuests.includes('D01H06'))&&
        (!isDaiViet(this.session)||!PLOT_COMPANIONS.includes(q.companionId))&&expansionAvailable(this.session,q.companionId)
    );
  }
  updateProfile(hero, inventory) {
    this._mutate((next) => {
      if(isDaiViet(next)&&(hero.sect!==next.hero.sect||!hasEnrollment(next)))fail('Việc nhập môn diễn ra trong chính truyện ở chương 2, hồi 10.');
      next.hero = normalizeHeroBuild(hero, inventory);
      next.inventory = structuredClone(inventory);
    }, 'profile');
  }
  joinSect(sect) {
    this._guard();
    if(!isDaiViet(this.session)||this.mainQuest()?.id!==ENROLLMENT_QUEST||hasEnrollment(this.session))fail('Chưa tới lời mời nhập môn, hoặc đã chọn phái.');
    this._mutate(next=>{
      if(next.storyProgress.pendingEncounter)fail('Hãy kết thúc trận đang chờ.');
      next.hero=changeSect(next.hero,sect,next.inventory);
      this._decision(next,ENROLLMENT_QUEST,'continue',0);
      this._completeMain(next,this.catalog.byId[ENROLLMENT_QUEST]);
    },'main');
  }
  rename(name) {
    this._mutate((next) => {
      next.hero.name = name.trim().normalize('NFC');
    }, 'profile');
  }
  setSettings(settings) {
    const next = this.snapshot();
    next.settings = { ...next.settings, ...settings };
    this._commit(next, 'settings');
  }
  setParty(ids) {
    this._mutate((next) => {
      next.party.active = [...ids];
      setFormation(next);
    }, 'formation');
  }
  setFormation(formation) {
    this._mutate((next) => {
      next.party.formation = structuredClone(formation);
    }, 'formation');
  }
  buy(itemId) {
    const prices = { rope: 5, food_fish: 5, tea: 8 };
    const price = has(prices, itemId) ? prices[itemId] : null;
    if (!price) fail('Mặt hàng không tồn tại.');
    this._mutate((next) => {
      consume(next, 'silver', price);
      give(next, itemId, 1);
    }, 'shop');
  }
  gift(id) {
    this._mutate((next) => {
      if (!next.party.unlocked.includes(id))
        fail('Đồng đội chưa được chiêu mộ.');
      if ((next.companionsAffinity[id] ?? 0) >= 100)
        fail('Duyên nợ đã đạt tối đa.');
      consume(next, 'tea', 1);
      next.companionsAffinity[id] = Math.min(
        100,
        (next.companionsAffinity[id] ?? 0) + 5
      );
    }, 'gift');
  }
  _decision(next, questId, choiceId, karma) {
    const MAIN_BY_ID=storyCatalog(next).byId;
    const previous = next.storyProgress.decisions[questId];
    if (previous && previous !== choiceId)
      fail(
        'Lựa chọn này đã được ghi nhận. Hãy tiếp tục lựa chọn trước đó hoặc tải bản lưu khác.'
      );
    if (!previous) {
      next.storyProgress.decisions[questId] = choiceId;
      next.storyProgress.karmaScore += karma;
      log(
        next,
        `${MAIN_BY_ID[questId]?.title ?? RECRUIT_BY_ID[questId]?.title ?? 'Nhân duyên'}: ${MAIN_BY_ID[questId]?.choices.find((c) => c.id === choiceId)?.text ?? (choiceId === 'help' ? 'Giúp đỡ không điều kiện.' : 'Đòi lời hứa trả công trước.')} (${karma >= 0 ? '+' : ''}${karma} nhân nghĩa).`,
        this.now()
      );
    }
  }
  _completeMain(next, quest,seed=next.storyProgress.attemptCounter) {
    const catalog=storyCatalog(next),MAIN_QUESTS=catalog.quests;
    if (next.storyProgress.completedQuests.includes(quest.id))
      fail('Nhiệm vụ đã nhận thưởng.');
    next.storyProgress.completedQuests.push(quest.id);
    if(quest.recruitCompanion){
      const id=quest.recruitCompanion,recruit=RECRUIT_QUESTS.find(q=>q.companionId===id);
      if(!next.party.unlocked.includes(id)){next.party.unlocked.push(id);next.companionsAffinity[id]=15;if(next.party.active.length<5)next.party.active.push(id);setFormation(next);}
      if(!next.storyProgress.completedQuests.includes(recruit.id))next.storyProgress.completedQuests.push(recruit.id);
    }
    Object.assign(next.storyProgress.questFlags, quest.flags ?? {});
    next.hero = gainExperience(next.hero, quest.xp, next.inventory);
    if (quest.silver) give(next, 'silver', quest.silver);
    if (quest.gearReward)
      for (const item of EQUIPMENT.filter(
        (item) => item.sect === next.hero.sect
      ))
        if (!itemCount(next, item.id)) give(next, item.id, 1);
    const gear=storyEquipment(next,quest,seed);
    const following = MAIN_QUESTS.find(
      (q) => !next.storyProgress.completedQuests.includes(q.id)
    );
    next.storyProgress.activeQuestId = following?.id ?? null;
    next.storyProgress.currentAct = following?.act ?? catalog.finalAct;
    next.storyProgress.currentChapter = following?.chapter ?? catalog.chapters.length;
    next.storyProgress.currentEpisode = following?.episode ?? 20;
    for (const s of quest.spotlights ?? [])
      if (next.party.unlocked.includes(s.id))
        next.companionsAffinity[s.id] = Math.min(
          100,
          (next.companionsAffinity[s.id] ?? 0) + 1
        );
    return gear;
  }
  chooseMain(choiceId) {
    this._guard();
    if (!this.session.hero.sect&&(!isDaiViet(this.session)||hasEnrollment(this.session)||this.session.storyProgress.activeQuestId===ENROLLMENT_QUEST)) fail('Hãy chọn môn phái trong lời mời nhập môn ở chương 2, hồi 10.');
    if (this.session.storyProgress.pendingEncounter)
      fail('Hãy tiếp tục trận đang chờ trước.');
    const quest = this.mainQuest();
    if (!quest || quest.ending) fail('Hãy chọn kết cục ở cuối câu chuyện.');
    const choice = quest.choices.find((c) => c.id === choiceId);
    if (!choice) fail('Lựa chọn không tồn tại.');
    if (
      quest.objective?.some((id) => !this.session.party.unlocked.includes(id))
    )
      fail('Hãy chiêu mộ Lão Tam và Tiểu Muội ở mục Đồng đội trước.');
    this._mutate(
      (next) => {
        this._decision(next, quest.id, choice.id, choice.karma);
        if (quest.encounter) this._pending(next, 'main', quest.id);
        else this._completeMain(next, quest);
      },
      quest.encounter ? 'encounter' : 'quest'
    );
    if (quest.encounter) return this.retryEncounter();
    return null;
  }
  _recruitQuest(id) {
    const quest = has(RECRUIT_BY_ID, id) && RECRUIT_BY_ID[id];
    if (!quest || !this.availableRecruitQuests().includes(quest))
      fail('Nhiệm vụ chiêu mộ chưa mở.');
    if (this.session.party.unlocked.includes(quest.companionId))
      fail('Đồng đội đã được chiêu mộ.');
    return quest;
  }
  scoutMain() {
    const quest = this.mainQuest();
    if (!quest?.encounter) return null;
    const encounter = ENCOUNTERS[quest.encounter],
      pending = this.session.storyProgress.pendingEncounter;
    const enemies = enemyLineup({
      rules:isDaiViet(this.session)?6:null,
      quest,
      encounter,
      count: isDaiViet(this.session)&&quest.boss?4:Math.min(MISSIONS[quest.id]?.type==='breach'?6:8,encounter.count??encounter.templates.length),
      main: true
    });
    if(isDaiViet(this.session)&&quest.boss)bossSequence(enemies,quest.chapter);
    const missionId = pending
      ? pending.kind === 'main'
        ? pending.missionId
        : null
      : MISSIONS[quest.id]?.id;
    if (['protect', 'rescue'].includes(MISSIONS[missionId]?.type) && enemies[0])
      enemies[0].targetPriority = 'objective';
    return {
      name: encounter.name,
      enemies,
      guides: enemies.map((u) => bossGuide(u.characterId,quest.canon)).filter(Boolean),
      objective: MISSIONS[missionId] ?? null
    };
  }
  challengeRecruit(id, approach = 'help') {
    this._guard();
    const quest = this._recruitQuest(id);
    if (quest.puzzle) fail('Nhiệm vụ này cần giải tình huống trong hội thoại.');
    if (
      this.session.storyProgress.pendingEncounter ||
      this.session.storyProgress.questFlags[`challenge_${id}`]
    )
      fail('Thử thách đã hoàn tất hoặc đang chờ xử lý.');
    if (!['help', 'demand'].includes(approach)) fail('Lựa chọn không hợp lệ.');
    this._mutate((next) => {
      this._decision(next, id, approach, approach === 'help' ? 1 : -1);
      this._pending(next, 'recruit', id);
    }, 'encounter');
    return this.retryEncounter();
  }
  solveRecruit(id, answer) {
    this._guard();
    const quest = this._recruitQuest(id);
    if (
      !quest.puzzle ||
      this.session.storyProgress.questFlags[`challenge_${id}`]
    )
      fail('Thử thách này không còn khả dụng.');
    if (!Number.isInteger(answer) || answer !== quest.puzzle.correct)
      fail(
        'Cách này chưa an toàn hoặc chưa đúng. Hãy đọc tình huống và thử lại.'
      );
    this._mutate((next) => {
      if (quest.cost) consume(next, quest.cost.itemId, quest.cost.quantity);
      this._decision(next, id, 'help', 1);
      this._markChallenge(next, quest);
    }, 'quest');
  }
  _markChallenge(next, quest) {
    const condition = quest.condition;
    next.storyProgress.questFlags[`challenge_${quest.id}`] = true;
    if (['collect', 'deliver', 'recover_item'].includes(condition.type))
      give(next, condition.itemId, condition.quantity ?? 1);
    else
      next.storyProgress.questFlags[
        `${condition.type}:${condition.gameId ?? condition.eventId ?? condition.enemyId}`
      ] = true;
  }
  recruit(id) {
    this._guard();
    const quest = this._recruitQuest(id),
      condition = quest.condition;
    this._mutate((next) => {
      if (!next.storyProgress.questFlags[`challenge_${id}`])
        fail('Hãy hoàn tất thử thách trước khi mời đồng hành.');
      if (['collect', 'deliver', 'recover_item'].includes(condition.type))
        consume(next, condition.itemId, condition.quantity ?? 1);
      else if (
        !next.storyProgress.questFlags[
          `${condition.type}:${condition.gameId ?? condition.eventId ?? condition.enemyId}`
        ]
      )
        fail('Chưa hoàn thành điều kiện chiêu mộ.');
      const fee = this.recruitFee(quest);
      if (fee) consume(next, 'silver', fee);
      next.party.unlocked.push(quest.companionId);
      next.companionsAffinity[quest.companionId] = 15;
      if (next.party.active.length < 5)
        next.party.active.push(quest.companionId);
      setFormation(next);
      next.storyProgress.completedQuests.push(id);
      next.hero = gainExperience(next.hero, quest.xp, next.inventory);
      give(next, 'silver', quest.silver);
    }, 'recruit');
  }
  _pending(next, kind, questId) {
    if(kind!=='main'&&!sectReady(next))fail('Hoàn thành việc nhập môn trong chương 2 trước khi nhận thử thách ngoài truyện.');
    next.storyProgress.attemptCounter++;
    next.storyProgress.pendingEncounter = {
      token: next.storyProgress.attemptCounter,
      kind,
      questId,
      seed: (20261105 + next.storyProgress.attemptCounter * 2654435761) >>> 0,
      preparation: {
        tactics: structuredClone(next.adventure.tactics),
        training: next.adventure.training,
        forging: next.adventure.forging
      }
    };
    if (['main','recruit'].includes(kind) && Object.hasOwn(MISSIONS, questId))
      next.storyProgress.pendingEncounter.missionId = questId;
    if (kind === 'dungeon') {
      const d = next.adventure.dungeon;
      next.storyProgress.pendingEncounter.preparation = {
        tactics: {
          ...structuredClone(d.squad.tactics),
          food: next.adventure.tactics.food,
          autoUltimate: next.adventure.tactics.autoUltimate
        },
        training: d.training,
        forging: d.forging
      };
    }
    if (next.adventure.tactics.food)
      consume(next, next.adventure.tactics.food, 1);
    next.adventure.tactics.food = null;
  }
  practice() {
    if (!this.session.hero.sect) fail('Hãy chọn môn phái trước.');
    this._mutate((next) => {
      if (next.storyProgress.pendingEncounter)
        fail('Hãy tiếp tục trận đang chờ trước.');
      this._pending(next, 'practice', null);
    }, 'encounter');
    return this.retryEncounter();
  }
  retryEncounter() {
    const MAIN_BY_ID=this.catalog.byId;
    this._guard();
    const pending = this.session.storyProgress.pendingEncounter;
    if (!pending || !this.session.hero.sect&&!(isDaiViet(this.session)&&!hasEnrollment(this.session)&&pending.kind==='main')) fail('Không có trận đang chờ.');
    if (['dungeon', 'arena', 'escort','chapterBoss'].includes(pending.kind))
      return this._worldBattle(pending);
    const quest =
      pending.kind === 'main'
        ? MAIN_BY_ID[pending.questId]
        : pending.kind === 'recruit'
          ? RECRUIT_BY_ID[pending.questId]
          : null;
    const encounter =
      pending.kind === 'main'
        ? ENCOUNTERS[quest.encounter]
        : {
            name:
              pending.kind === 'practice'
                ? 'Luyện võ ở sân quán trọ'
                : `Giúp ${quest.title}`,
            level:
              pending.kind === 'practice'
                ? Math.max(1, this.session.hero.level - 1)
                : quest.level,
            templates:
              pending.kind === 'practice'
                ? ['companion_01', 'companion_06']
                : ['companion_05', 'companion_06'],
            hpScale: 0.7,
            attackScale: 0.65
          };
    const combatBuild=storyHeroBuild(this.session);
    const grid = new GridSystem(),
      level = this.session.hero.level;
    const units = [
      new Hero(combatBuild.sect, {
        profile: combatBuild,
        inventory: this.session.inventory
      }),
      ...this.session.party.active.map((id) => new Companion(id, { level }))
    ];
    if(quest?.canon==='dai-viet'&&quest.chapter===1){
      const hero=units[0];hero.passive=null;hero.stats.attackRange=1;hero.stats.physicalAtk=Math.max(hero.stats.physicalAtk,hero.stats.magicalAtk*.8);
      hero.skills.autoAttack={id:'dai_viet_unarmed',name:'Quyền Cơ Bản',type:'physical',targetType:'nearest_enemy',dmgMultiplier:1,energyGain:15,effects:[]};
      hero.skills.ultimate={id:'dai_viet_unarmed_guard',name:'Chưa học tuyệt kỹ',type:'physical',targetType:'self',dmgMultiplier:0,energyCost:10000,effects:[]};
    }
    units.forEach((u) => grid.place(u, this.session.party.formation[u.id]));
    const helper =
      pending.kind === 'recruit'
        ? quest.companionId
        : quest?.guide??(encounter.guide ||
            units.every((u) => u.skills.autoAttack.dmgMultiplier === 0)
          ? 'companion_01'
          : null);
    if (
      helper &&
      units.length < 3 &&
      !units.some((u) => u.templateId === helper)
    ) {
      const guide = new Companion(COMPANIONS_BY_ID[helper]?helper:'companion_01', { id: 'guide', level });
      guide.name =
        pending.kind === 'recruit'
          ? `${COMPANIONS_BY_ID[helper].name} (hỗ trợ)`
          : 'Lão Tam (hỗ trợ)';
      if (pending.kind === 'main' && quest.id === 'Q101') {
        applyStoryIdentity(guide, NPCS_BY_ID.quan_chu);
        guide.name = 'Quán chủ (hỗ trợ)';
      }
      if(isDaiViet(this.session)){
        const lockedPlot=PLOT_COMPANIONS.includes(helper)&&!this.session.party.unlocked.includes(helper)&&!quest?.guide;
        const person=lockedPlot?DAI_VIET_CAST_BY_ID.kha_van:DAI_VIET_CAST_BY_ID[helper]??COMPANIONS_BY_ID[helper]??DAI_VIET_CAST_BY_ID.kha_van;
        applyStoryIdentity(guide,{...person,id:person.assetId??person.id});
        if(person.kind==='companion')applyDaiVietName(guide);
        guide.name=person.name+' (hỗ trợ)';
      }
      const cell = [
        { x: 1, y: 0 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
        { x: 0, y: 0 }
      ].find((p) => !grid.at(p));
      grid.place(guide, cell);
      units.push(guide);
    }
    const enemyCount =
      pending.kind === 'main'
        ? (encounter.count ?? encounter.templates.length)
        : pending.kind === 'practice'
          ? units.length
          : Math.min(3, (quest.act ?? 1) + 1);
    units.push(
      ...enemyLineup({
        rules:isDaiViet(this.session)?6:null,
        quest,
        encounter,
        count: isDaiViet(this.session)&&quest?.boss&&pending.kind==='main'?4:Math.min(MISSIONS[pending.missionId]?.type==='breach'?6:8,enemyCount),
        grid,
        main: pending.kind === 'main'
      })
    );
    this.prepareUnits(units, pending);
    if(isDaiViet(this.session))Object.assign(units[0],heroAppearance(this.session,pending.kind==='main'?quest:undefined));
    this.lastResult = null;
    this.battleToken = pending.token;
    const boss=Boolean(isDaiViet(this.session)&&quest?.boss&&pending.kind==='main');
    const nextBossWave=boss?bossSequence(units.filter(u=>u.team==='enemy'),quest.chapter):null;
    this.battle = new CombatEngine({
      enemyLimit:8,nextBossWave,maxDuration:boss?360:150,
      units,
      grid,
      seed: pending.seed,
      missionId: pending.missionId ?? null,
      onEvent: this.onBattleEvent
    });
    this.battle.encounterName = encounter.name;
    this.battle.autoUltimate =
      pending.preparation?.tactics.autoUltimate ?? true;
    this.battle.start();
    return this.battle;
  }
  update(dt) {
    if (!this.running) return;
    this.battle.update(dt);
    if (this.battle.state === 'finished') this.settleBattle();
  }
  settleBattle() {
    const MAIN_BY_ID=this.catalog.byId;
    const pending = this.session.storyProgress.pendingEncounter;
    if (!this.battle?.result || !pending || pending.token !== this.battleToken)
      fail('Trận này đã được xử lý hoặc không thuộc chiến dịch.');
    const result = structuredClone(this.battle.result),
      next = this.snapshot();
    resetCalendar(next, this.now());
    next.storyProgress.pendingEncounter = null;
    const rewards = { xp: 0, silver: 0 };
    if (result.winner === 'home') {
      next.adventure.daily.wins++;
      next.adventure.weekly.wins++;
      for (const id of next.party.active)
        next.companionsAffinity[id] = Math.min(
          100,
          (next.companionsAffinity[id] ?? 0) +
            (pending.kind === 'practice' ? 1 : 5)
        );
      if (pending.kind === 'main') {
        const q = MAIN_BY_ID[pending.questId];
        rewards.xp = q.xp;
        rewards.silver = q.silver;
        rewards.gear=this._completeMain(next, q,pending.seed);
      } else if (pending.kind === 'recruit')
        this._markChallenge(next, RECRUIT_BY_ID[pending.questId]);
      else if (pending.kind === 'practice') {
        rewards.xp = Math.min(300, 50 + next.hero.level * 10);
        rewards.silver = Math.max(
          1,
          Math.round(
            (3 + next.hero.level * 0.7) *
              (next.adventure.daily.practiceWins < 3 ? 1 : 0.2)
          )
        );
        if (next.adventure.daily.practiceWins >= 3)
          rewards.xp = Math.round(rewards.xp * 0.35);
        next.adventure.daily.practiceWins++;
        next.adventure.practiceWins++;
        next.hero = gainExperience(next.hero, rewards.xp, next.inventory);
        give(next, 'silver', rewards.silver);
      }
    }
    if(pending.kind==='chapterBoss'&&result.winner==='home'){
      const chapter=Number(pending.questId);Object.assign(rewards,chapterBossRewards(next,chapter));rewards.gear=bossLoot(next,chapter,pending.seed);next.hero=gainExperience(next.hero,rewards.xp,next.inventory);give(next,'silver',rewards.silver);
    }
    if (['dungeon', 'arena', 'escort'].includes(pending.kind))
      this.settleWorld(next, pending, result, rewards);
    log(
      next,
      `${this.battle.encounterName}: ${result.winner === 'home' ? 'thắng' : result.reason === 'aborted' ? 'rút lui' : 'thua/hòa'}, ${rewards.silver} bạc.`,
      this.now()
    );
    this.lastResult = {
      ...result,
      rewards,
      kind: pending.kind,
      questId: pending.questId
    };
    this.battleToken = null;
    this._commit(next, 'battle-result');
    return this.lastResult;
  }
  retreat() {
    this._guardRunning();
    this.battle.abort();
    return this.settleBattle();
  }
  _guardRunning() {
    if (!this.running) fail('Không có trận đang diễn ra.');
  }
  endingOptions() {
    const next = this.session;
    if(isDaiViet(next))return this.catalog.endings.map(e=>({...e,available:(next.storyProgress.decisions.D19H18==='home')===(e.id==='home')}));
    return ENDINGS.map((ending) => ({
      ...ending,
      available:
        ending.id === 'retire' ||
        (ending.id === 'justice' &&
          next.storyProgress.karmaScore >= 2 &&
          next.storyProgress.questFlags.DISCOVERED_DEBT_BOOK === true) ||
        (ending.id === 'wealth' &&
          next.storyProgress.karmaScore <= -2 &&
          itemCount(next, 'silver') >= 100) ||
        (ending.id === 'actor' && itemCount(next, 'silver') >= 500)
    }));
  }
  chooseEnding(id) {
    this._mutate((next) => {
      const catalog=storyCatalog(next);
      if (
        next.storyProgress.activeQuestId !== catalog.finalId ||
        next.storyProgress.endingId
      )
        fail('Chưa đến lúc chọn kết cục.');
      const choice = this.endingOptions().find(
        (e) => e.id === id && e.available
      );
      if (!choice) fail('Chưa đủ điều kiện kết cục này.');
      if (id === 'wealth') consume(next, 'silver', 100);
      if (id === 'actor'&&!isDaiViet(next)) consume(next, 'silver', 500);
      log(next, `Kết cục: ${choice.name}`, this.now());
      next.storyProgress.endingId = id;
      this._completeMain(next, catalog.byId[catalog.finalId]);
    }, 'ending');
  }
}

Object.assign(Campaign.prototype, worldMethods);

Object.assign(Campaign.prototype, gachaMethods);
Object.assign(Campaign.prototype, journeyMethods);
Object.assign(Campaign.prototype, lootMethods);
Object.assign(Campaign.prototype, entryMethods);
