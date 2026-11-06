import { COMPANIONS } from './CompanionsData.js';
import { HERO_SKILLS } from './HeroSkillsData.js';
import { SKILL_TREES } from './SkillTreeData.js';
import { deepFreeze } from './DataUtils.js';
import { NPC_MOVES } from './NPCData.js';
import { BOND_VARIANTS } from './BondsData.js';

// Each entry is an authored silhouette, palette, travel path and tempo, not a color hash.
const companionArt = [
  ['staffSweep', '#bde087', '#ead1a0', 'sweep', 1.05],
  ['yinYang', '#aee4ef', '#f6efc8', 'ward', 1.4],
  ['lotusStream', '#9ff6c5', '#e8c6ef', 'petals', 1.5],
  ['dartFan', '#c5aeff', '#d8edff', 'projectile', .95],
  ['bellShock', '#efc365', '#fff2c9', 'wave', 1.3],
  ['poisonFog', '#93cf58', '#bf91d7', 'mist', 1.5],
  ['brushBeam', '#d3e9f2', '#7bafc3', 'beam', 1.1],
  ['shadowDash', '#f0839d', '#532b67', 'dash', .9],
  ['woodfishPulse', '#b7c99a', '#dcbf78', 'wave', 1.3],
  ['fireArrow', '#ff9a51', '#ffdc86', 'projectile', 1.1],
  ['teaSteam', '#a5e6bb', '#f5e0ab', 'petals', 1.4],
  ['twinSlash', '#c3e5ff', '#f4e7c7', 'sweep', 1.1],
  ['turtleShell', '#8ebea5', '#e6cf85', 'ward', 1.5],
  ['toadBurst', '#b9d95f', '#8a60b1', 'lob', 1.35],
  ['featherVeil', '#c4dfd7', '#a2adef', 'ward', 1.15],
  ['silkCharm', '#e9a2d1', '#ffe2d7', 'ribbon', 1.45],
  ['pillOrbit', '#f0d37a', '#a2e8bb', 'lob', 1.2],
  ['ironCharge', '#a7c1d0', '#edb78c', 'dash', .95],
  ['executionCross', '#df6174', '#e7e6dc', 'beam', .85],
  ['wineSplash', '#e9ba77', '#e9f1dd', 'lob', 1.35],
  ['bridgeArc', '#d6ac72', '#b0e5d8', 'wave', 1.1],
  ['herbBud', '#b4dd76', '#ffdaa5', 'petals', 1.5],
  ['bambooBroom', '#a7cb77', '#e0c08a', 'sweep', 1.2],
  ['woodenBlade', '#dfc18b', '#a2cedb', 'sweep', 1.0],
  ['courierWave', '#e8deae', '#92c9d8', 'projectile', 1.1],
  ['hollowChime', '#d6ac7e', '#e9cead', 'wave', 1.3],
  ['anchorChain', '#aecfd7', '#d7b075', 'projectile', 1.2],
  ['rollingStones', '#cbba9c', '#d8dcad', 'lob', 1.25],
  ['gatePillars', '#d2c099', '#a1c5a8', 'ward', 1.4],
  ['needleWeave', '#f5d9c6', '#c9c4ed', 'ribbon', 1.4],
  ['bronzePalm', '#e5b65d', '#b7d6b2', 'wave', 1.1],
  ['willowBlade', '#afdb91', '#d2f0df', 'sweep', 1.2],
  ['bambooPulse', '#8ed7b0', '#eef0bd', 'petals', 1.45],
  ['basketNet', '#d3ae7e', '#b7d08b', 'ribbon', 1.3],
  ['sixCups', '#efc379', '#f1e8c7', 'lob', 1.25],
  ['craneGuard', '#e5e8db', '#a4c9c2', 'ward', 1.5],
  ['lotusNeedles', '#efcbeb', '#b9eae0', 'petals', 1.35],
  ['gullFlights', '#d2ecf7', '#91b5de', 'projectile', 1.1],
  ['skyCalligraphy', '#b1c8e6', '#f2e1c1', 'beam', 1.2],
  ['mountainGate', '#98b4a5', '#dfca8c', 'ward', 1.45],
  ['peachPetals', '#f3b1c7', '#f1d599', 'dash', 1.2],
  ['nightCuckoo', '#bfa5dc', '#b9d483', 'mist', 1.35],
  ['moonStrings', '#d8dcfa', '#e0b8cf', 'beam', 1.45],
  ['thunderBell', '#f4d27f', '#c2cafa', 'wave', 1.25],
  ['puppetThreads', '#d4a8db', '#e5c0a0', 'ribbon', 1.4],
  ['rainSword', '#afdbf3', '#e6eff6', 'dash', 1.1],
  ['lotusLanterns', '#ffdea0', '#f0c7e9', 'petals', 1.5],
  ['dragonFist', '#e5bf63', '#80d3bc', 'wave', 1.35],
  ['phoenixWings', '#f7a675', '#efc9de', 'petals', 1.6],
  ['infinityCut', '#d7e8ee', '#a9b6ed', 'sweep', 1.35],
  ['courierKnot','#f2d58f','#8bc9d2','projectile',1.05],
  ['ferryRope','#91d5d8','#d9bb83','ribbon',1.3],
  ['timberBrace','#d6ac73','#b9d3a0','ward',1.45],
  ['watchGate','#a6d6e9','#e1bc7b','wave',1.2],
  ['medicThread','#a9e9bb','#f3dab7','petals',1.5],
  ['trailMarks','#a8c693','#ded4a7','projectile',1.1],
  ['witnessPages','#ded3ef','#d6ba8b','beam',1.35],
  ['caravanGuard','#dcac71','#a8c8b1','sweep',1.25],
  ['swordPause','#e6d5a4','#b2dfd1','ward',1.5],
  ['harborBeacon','#a7dce3','#f2d18d','wave',1.4]
];
const profiles = [], table = {};
function add(ownerId, skill, art, ultimate, crest = '') {
  const [motif, primary, secondary, path, duration] = art;
  const profile = { id: `${ownerId}:${skill.id ?? skill.name}`, ownerId, skillId: skill.id ?? skill.name, name: skill.name, motif, primary, secondary, path, duration: ultimate ? duration : .34, ultimate, crest };
  table[profile.id] = profile; profiles.push(profile);
}
COMPANIONS.forEach((c, i) => {
  add(c.id, c.skills.ultimate, companionArt[i], true);
  add(c.id, c.skills.autoAttack, companionArt[i], false);
});
const starterArt = { ThieuLam: companionArt[4], VoDang: companionArt[1], CaiBang: companionArt[0], NgaMi: companionArt[2], DuongMon: companionArt[3] };
for (const [sect, skills] of Object.entries(HERO_SKILLS)) {
  add(sect, skills.autoAttack, starterArt[sect], false, sect);
  add(sect, skills.ultimate, starterArt[sect], true, sect);
}
const advanced = {
  'Kim Cang Trấn Sơn': ['goldenPeak', '#edc46c', '#fff1b8', 'wave', 1.5],
  'Bất Hoại Kim Thân': ['diamondWall', '#e0b664', '#f5eac2', 'ward', 1.5],
  'Lưỡng Nghi Kiếm Trận': ['dualTaiji', '#b5e9ef', '#f7eed6', 'sweep', 1.5],
  'Thái Cực Vô Cực': ['voidTaiji', '#e1f3eb', '#a5bddf', 'ward', 1.55],
  'Đả Cẩu Trấn Giang Hồ': ['dragonStaff', '#c1df8b', '#edd9ab', 'sweep', 1.4],
  'Túy Bộ Hộ Thân': ['drunkFootsteps', '#dfb581', '#b9dfb4', 'ward', 1.4],
  'Cửu Âm Liên Châm': ['nineNeedles', '#e5bff0', '#d2f4e1', 'projectile', 1.35],
  'Liên Hoa Phổ Độ': ['lotusSanctuary', '#bbeacb', '#f9d7f0', 'petals', 1.65],
  'Vạn Tiễn Bách Độc': ['hundredVenoms', '#b2d56d', '#c4a7f0', 'projectile', 1.5],
  'Ảnh Bộ Tàng Phong': ['phantomStep', '#bfa9e7', '#d5e9e2', 'dash', 1.3]
};
for (const tree of Object.values(SKILL_TREES)) for (const n of tree) if (n.ultimate) add(n.sect, n.ultimate, advanced[n.ultimate.name], true, n.sect);
const npcArt = {
  quan_chu: ['ladleGuard', '#deb986', '#f6e9c9', 'sweep', 1.2],
  doi_truong: ['commandFlag', '#e49a85', '#e9c580', 'wave', 1.25],
  doc_le: ['cageVines', '#7db9a3', '#ccaa70', 'ward', 1.4],
  kha_van: ['duelBlade', '#ed9f96', '#d3ede9', 'sweep', 1.2],
  do_mau: ['taxSeal', '#a7bfdc', '#e8cb8a', 'wave', 1.4],
  trinh_nghiem: ['blackFan', '#d9a6c8', '#e1c77f', 'ribbon', 1.55],
  tay_sai: ['guardSpear', '#d1b99a', '#c0d9d4', 'sweep', 1.0]
};
for (const [id, art] of Object.entries(npcArt)) for (const ultimate of [false, true])
  add(id, { id: `npc_${id}_${ultimate ? 'ult' : 'basic'}`, name: NPC_MOVES[id][ultimate ? 1 : 0] }, art, ultimate);
for (const [id, skill] of Object.entries(BOND_VARIANTS)) {
  const art = { companion_01: ['roadGuard', '#b5dd91', '#f5dcad', 'ward', 1.3], companion_03: ['pulseLotus', '#a7f4cb', '#efc6ef', 'petals', 1.4], companion_02: ['sharedTaiji', '#badfea', '#f0e4bf', 'ward', 1.4], companion_04: ['singleMeridian', '#c4b0ef', '#e7edd4', 'projectile', 1.1], companion_08: ['returnRibbon', '#e9a8b1', '#bddbe5', 'wave', 1.2] }[id];
  add(id, skill, art, true);
}
export const SKILL_VISUALS = deepFreeze(profiles);
export function getSkillVisual(event) {
  return table[`${event.ownerId}:${event.skillId}`] ?? profiles.find(p => p.skillId === event.skillId) ?? null;
}
