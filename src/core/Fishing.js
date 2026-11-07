import { NEW_GEAR } from '../data/GearCatalog.js';
export const FISHING_LOOT = Object.freeze([
  { rate: 30, label: 'Cá ngon', itemId: 'food_fish', quantity: 2 },
  { rate: 25, label: 'Túi bạc · 30 bạc', itemId: 'silver', quantity: 30 },
  { rate: 20, label: 'Túi XP · mở ngay 100 XP', xp: 100 },
  { rate: 15, label: 'Nguyên liệu · 3 quặng và 3 thảo dược', materials: true },
  { rate: 8, label: 'Trang bị Hiếm', tier: 2 },
  { rate: 2, label: 'Trang bị Xuất sắc', tier: 3 }
]);
export function fishingReward(random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) {
  const roll = () => { const n = random(); if (!Number.isFinite(n) || n < 0 || n >= 1) throw Error('Kết quả câu không hợp lệ.'); return n; };
  let ticket = roll() * 100;
  const reward = FISHING_LOOT.find(r => (ticket -= r.rate) < 0);
  if (!reward.tier) return { ...reward };
  const pool = NEW_GEAR.filter(e => e.tier === reward.tier), item = pool[Math.floor(roll() * pool.length)];
  return { ...reward, itemId: item.id, quantity: 1, label: item.name };
}
