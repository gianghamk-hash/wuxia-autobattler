import { deepFreeze } from './DataUtils.js';
export const RARITIES = deepFreeze([
  {
    tier: 1,
    name: 'Mộc',
    color: 'Xám',
    rate: 50,
    refund: 12,
    frame: 'Gỗ mộc và vải cũ'
  },
  {
    tier: 2,
    name: 'Đồng',
    color: 'Xanh lá',
    rate: 28,
    refund: 18,
    frame: 'Đồng thau'
  },
  {
    tier: 3,
    name: 'Ngân',
    color: 'Xanh lam',
    rate: 15,
    refund: 24,
    frame: 'Bạc chạm góc'
  },
  {
    tier: 4,
    name: 'Tử ngọc',
    color: 'Tím',
    rate: 6,
    refund: 30,
    frame: 'Mạ vàng khảm ngọc tím'
  },
  {
    tier: 5,
    name: 'Long phượng',
    color: 'Vàng kim',
    rate: 1,
    refund: 36,
    frame: 'Rồng phượng mạ vàng'
  }
]);
export const GACHA = deepFreeze({
  singleCost: 60,
  tenCost: 540,
  epicPity: 10,
  legendaryPity: 80,
  historyLimit: 50
});
export const rarityLabel = (tier) =>
  `Bậc ${tier} · ${RARITIES[tier - 1]?.name ?? ''}`;
