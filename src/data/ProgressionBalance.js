/** Shared balance values: UI and simulation read the same source. */
export const ATTRIBUTE_BONUSES = {
  canCot: { maxHp: 100, physicalDef: 2 },
  khiHai: { magicalAtk: 12, magicalDef: 4 },
  kinhLuc: { physicalAtk: 12, critDmg: .012 },
  ngoTinh: { critRate: .012, magicalAtk: 3 },
  thanPhap: { dodgeRate: .006 },
  coDuyen: { critRate: .008, maxHp: 20 }
};
export const AGILITY_TEMPO = .03;
export const SECT_PASSIVES = {
  ThieuLam: [
    { level: 5, name: 'Kim Cang Căn Cơ', description: '+18% HP và +12% ngoại phòng.', ratios: { maxHp: .18, physicalDef: .12 } },
    { level: 10, name: 'Bất Động Thiền Tâm', description: '+20% nội phòng và +8% đỡ đòn.', ratios: { magicalDef: .2 }, stats: { blockRate: .08 } }
  ],
  VoDang: [
    { level: 5, name: 'Thái Cực Tụ Khí', description: '+16% nội công.', ratios: { magicalAtk: .16 } },
    { level: 10, name: 'Lưỡng Nghi Hộ Thể', description: '+15% HP và +18% nội phòng.', ratios: { maxHp: .15, magicalDef: .18 } }
  ],
  CaiBang: [
    { level: 5, name: 'Nghĩa Khí Giang Hồ', description: '+18% ngoại công.', ratios: { physicalAtk: .18 } },
    { level: 10, name: 'Túy Bộ Liên Hoàn', description: '+15% tốc đánh và +6% né.', ratios: { attackSpeed: .15 }, stats: { dodgeRate: .06 } }
  ],
  NgaMi: [
    { level: 5, name: 'Liên Tâm Dưỡng Khí', description: '+18% nội công, tăng cả hồi phục theo nội công.', ratios: { magicalAtk: .18 } },
    { level: 10, name: 'Từ Bi Hộ Mệnh', description: '+20% HP và +20% nội phòng.', ratios: { maxHp: .2, magicalDef: .2 } }
  ],
  DuongMon: [
    { level: 5, name: 'Ảnh Tiễn Tâm Pháp', description: '+16% ngoại công và +5% bạo kích.', ratios: { physicalAtk: .16 }, stats: { critRate: .05 } },
    { level: 10, name: 'Vô Ảnh Truy Phong', description: '+18% tốc đánh và +6% né.', ratios: { attackSpeed: .18 }, stats: { dodgeRate: .06 } }
  ]
};
export const effectiveTier = (session, unit) => session?.party?.ranks?.[unit?.templateId ?? unit?.id] ?? unit?.tier;
export const milestone = level => Math.min(30, Math.floor((level ?? 1) / 5) * 5);
export const AURA_COLORS = { 0: '#b8dcd0', 5: '#75dbad', 10: '#68cfff', 15: '#bc98ff', 20: '#ffcf69', 25: '#ff91bb', 30: '#d9ffff' };
export function validateRanks(ranks, unlocked, definitions) {
  if (ranks === undefined) return;
  if (!ranks || Object.getPrototypeOf(ranks) !== Object.prototype || Object.entries(ranks).some(([id, rank]) => !unlocked.includes(id) || !definitions[id] || !Number.isInteger(rank) || rank < definitions[id].tier || rank > 6)) throw Error('Bậc đồng hành không hợp lệ.');
}

/** Apply once to a freshly cloned skill, including optional bond variants. */
export function scalePromotedSkill(skill, factor) {
  skill.dmgMultiplier *= factor;
  for (const effect of skill.effects ?? []) for (const key of ['multiplier','maxHpRatio','ratio','duration','amount']) if (typeof effect[key] === 'number') effect[key] *= factor;
  if (factor > 1) skill.description = (skill.description ?? '') + ' · Thăng bậc: sức mạnh chiêu ×' + factor.toFixed(2) + '.';
  return skill;
}
