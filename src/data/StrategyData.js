export const ELEMENTS = {
  Kim: { color: '#e7d08c', beats: 'Moc', feeds: 'Thuy', name: 'Kim' },
  Moc: { color: '#a4d479', beats: 'Tho', feeds: 'Hoa', name: 'Mộc' },
  Thuy: { color: '#80ccef', beats: 'Hoa', feeds: 'Moc', name: 'Thủy' },
  Hoa: { color: '#ef9d77', beats: 'Kim', feeds: 'Tho', name: 'Hỏa' },
  Tho: { color: '#cfac77', beats: 'Thuy', feeds: 'Kim', name: 'Thổ' }
};
export const SECT_ELEMENT = {
  ThieuLam: 'Kim',
  VoDang: 'Tho',
  CaiBang: 'Hoa',
  NgaMi: 'Thuy',
  DuongMon: 'Moc',
  TuDo: 'Tho'
};
export const PRIORITIES = {
  nearest: 'Gần nhất',
  weakest: 'Ít máu nhất',
  rear: 'Hậu tuyến'
};
export const QIGONG = {
  balanced: { name: 'Điều tức', description: '+5% nội lực nhận được.' },
  assault: {
    name: 'Công tâm',
    description: '+8% sát thương, giảm 5% sinh lực.'
  },
  guard: { name: 'Thủ tâm', description: '+10% sinh lực, giảm 5% sát thương.' },
  ember: {
    name: 'Hỏa tâm',
    description: 'Bí kíp U Minh: đòn thường thứ tư gây cháy 3 giây.'
  },
  zen: {
    name: 'Thiền định',
    description: 'Bí kíp Yên Tử: giảm 25% thời gian điểm huyệt.'
  },
  war: {
    name: 'Binh thư',
    description: 'Bí kíp Hoa Lư: +8% ngoại/nội phòng và +4% nội lực.'
  },
  forest: {
    name: 'Mộc linh',
    description: 'Bí kíp Sơn Đoòng: giảm 25% sát thương độc.'
  },
  dragon: {
    name: 'Long mạch',
    description:
      'Bí kíp Phong Nha: tuyệt kỹ sát thương đánh cả hàng ngang tiền/trung/hậu.'
  }
};
export const LIMITS = {
  dodge: 0.4,
  crit: 0.6,
  critDamage: 2.2,
  healingPerSecond: 0.08,
  healingPerBattle: 1.2
};
export const WEAKNESSES = {
  companion_01: 'Đòn gần; dễ bị thả diều và nội thương.',
  companion_02: 'Ngoại công yếu; ngại đội hình dồn sát thương.',
  companion_03: 'Ít sát thương; cần người che chắn.',
  companion_04: 'Máu mỏng; sợ áp sát hậu tuyến.',
  companion_05: 'Di chuyển chậm; ngại độc và sát thương kéo dài.',
  companion_06: 'Thiếu dồn sát thương; cần đồng đội kết liễu.',
  companion_07: 'Máu mỏng; khống chế ngắt nhịp bắn.',
  companion_08: 'Phải áp sát; dễ bị khóa chân.',
  companion_09: 'Phụ thuộc hồi phục; ngại nội thương và áp sát.',
  companion_10: 'Cần giữ khoảng cách; sợ đánh hậu.',
  companion_11: 'Hỗ trợ tình huống; cần tướng gây sát thương.',
  companion_12: 'Ngại đối thủ dàn rộng, tách hàng.',
  companion_13: 'Sát thương thấp; dễ bị bỏ qua đánh hậu.',
  companion_14: 'Máu thấp; ngại giải độc và đánh nhanh.',
  companion_15: 'Mỏng giáp; ngại khống chế.',
  companion_16: 'Nặng về hỗ trợ; dễ thua khi thiếu sát thương.',
  companion_17: 'Cần thời gian tích nội lực; ngại nội thương.',
  companion_18: 'Tay ngắn; ngại thả diều.',
  companion_19: 'Ngại đội nhiều hàng và khiên.',
  companion_20: 'Chiêu biến thiên; thiếu ổn định.'
};
export function elementMultiplier(source, target) {
  const a = source.element ?? SECT_ELEMENT[source.sect],
    b = target.element ?? SECT_ELEMENT[target.sect];
  return ELEMENTS[a]?.beats === b ? 1.15 : ELEMENTS[b]?.beats === a ? 0.85 : 1;
}
export function sectBonuses(sects) {
  return Object.entries(
    sects.reduce((out, s) => ((out[s] = (out[s] ?? 0) + 1), out), {})
  )
    .filter(([s, n]) => s !== 'TuDo' && n >= 2)
    .map(([sect, count]) => ({
      sect,
      count,
      tier: count >= 6 ? 6 : count >= 4 ? 4 : 2
    }));
}

export const QIGONG_UNLOCKS = {
  dragon: 'phong_nha',
  ember: 'u_minh',
  zen: 'yen_tu',
  war: 'hoa_lu',
  forest: 'son_doong'
};
export function applyQigong(u, q) {
  if (q === 'assault') {
    u.stats.maxHp *= 0.95;
    u.preparedDamage = 1.08;
  }
  if (q === 'guard') {
    u.stats.maxHp *= 1.1;
    u.preparedDamage = 0.95;
  }
  if (q === 'balanced') u.preparedEnergy = 0.05;
  if (q === 'dragon') u.rowUltimate = true;
  if (q === 'ember') u.preparedBurn = true;
  if (q === 'zen') u.controlResistance = 0.25;
  if (q === 'forest') u.poisonResistance = 0.25;
  if (q === 'war') {
    u.stats.physicalDef *= 1.08;
    u.stats.magicalDef *= 1.08;
    u.preparedEnergy = 0.04;
  }
}

export const STATUS_LABELS = {
  root: 'Giữ chân',
  poison: 'Trúng độc',
  burn: 'Bốc cháy',
  internal_injury: 'Nội thương',
  stun: 'Điểm huyệt'
};
