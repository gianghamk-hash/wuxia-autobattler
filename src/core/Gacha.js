import { COMPANIONS, COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { RARITIES, GACHA } from '../data/GachaData.js';
const integer = (n) => Number.isSafeInteger(n) && n >= 0;
export const freshGacha = () => ({
  version: 1,
  total: 0,
  sinceEpic: 0,
  sinceLegendary: 0,
  history: []
});
export function validateGacha(g) {
  if (
    !g ||
    g.version !== 1 ||
    ![g.total, g.sinceEpic, g.sinceLegendary].every(integer) ||
    g.sinceEpic >= GACHA.epicPity ||
    g.sinceLegendary >= GACHA.legendaryPity ||
    g.sinceEpic > g.sinceLegendary ||
    g.sinceLegendary > g.total ||
    !Array.isArray(g.history) ||
    g.history.length !== Math.min(g.total, GACHA.historyLimit)
  )
    throw Error('Tiến trình Chiêu hiền không hợp lệ.');
  let last = g.total - g.history.length;
  for (const r of g.history) {
    last++;
    if (
      !r ||
      r.pull !== last ||
      !Object.hasOwn(COMPANIONS_BY_ID, r.id) ||
      r.tier !== COMPANIONS_BY_ID[r.id].tier ||
      typeof r.duplicate !== 'boolean' ||
      r.refund !== (r.duplicate ? RARITIES[r.tier - 1].refund : 0) ||
      !['none', 'epic', 'legendary'].includes(r.guarantee) ||
      !integer(r.time)
    )
      throw Error('Lịch sử Chiêu hiền không hợp lệ.');
  }
}
function secureRandom() {
  if (!globalThis.crypto?.getRandomValues)
    throw Error('Thiết bị chưa hỗ trợ quay ngẫu nhiên an toàn.');
  return globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
}
/** Pure transaction. Caller commits the complete result once; invalid rolls never spend silver. */
export function rollGacha(
  session,
  count,
  { random = secureRandom, now = Date.now() } = {}
) {
  if (![1, 10].includes(count)) throw Error('Chỉ có thể mời 1 hoặc 10 lượt.');
  if (
    !session.hero.sect ||
    !session.storyProgress.completedQuests.includes('Q101')
  )
    throw Error('Vượt trận mở đầu để mở Chiêu hiền.');
  if (session.storyProgress.pendingEncounter)
    throw Error('Kết thúc thử thách đang chờ trước khi quay.');
  const next = structuredClone(session);
  next.gacha ??= freshGacha();
  validateGacha(next.gacha);
  const price = count === 10 ? GACHA.tenCost : GACHA.singleCost;
  if (
    next.inventory
      .filter((i) => i.itemId === 'silver')
      .reduce((sum, i) => sum + i.quantity, 0) < price
  )
    throw Error(`Cần ${price} bạc để mời ${count} lượt.`);
  let debt = price;
  for (const i of next.inventory.filter((i) => i.itemId === 'silver')) {
    const take = Math.min(i.quantity, debt);
    i.quantity -= take;
    debt -= take;
  }
  next.inventory = next.inventory.filter((i) => i.quantity > 0);
  const roll = () => {
    const n = random();
    if (!Number.isFinite(n) || n < 0 || n >= 1)
      throw Error('Kết quả ngẫu nhiên không hợp lệ.');
    return n;
  };
  const results = [];
  for (let i = 0; i < count; i++) {
    const g = next.gacha,
      guarantee =
        g.sinceLegendary === 79
          ? 'legendary'
          : g.sinceEpic === 9
            ? 'epic'
            : 'none';
    let ticket = roll() * 100,
      tier = 5;
    for (const r of RARITIES) {
      ticket -= r.rate;
      if (ticket < 0) {
        tier = r.tier;
        break;
      }
    }
    if (guarantee === 'legendary') tier = 5;
    else if (guarantee === 'epic') tier = Math.max(4, tier);
    const pool = COMPANIONS.filter((c) => c.tier === tier),
      unit = pool[Math.floor(roll() * pool.length)],
      duplicate = next.party.unlocked.includes(unit.id),
      refund = duplicate ? RARITIES[tier - 1].refund : 0;
    if (duplicate) {
      let silver = next.inventory.find((i) => i.itemId === 'silver');
      if (silver) silver.quantity += refund;
      else next.inventory.push({ itemId: 'silver', quantity: refund });
    } else {
      next.party.unlocked.push(unit.id);
      next.companionsAffinity[unit.id] = 15;
    }
    g.total++;
    g.sinceEpic = tier >= 4 ? 0 : g.sinceEpic + 1;
    g.sinceLegendary = tier === 5 ? 0 : g.sinceLegendary + 1;
    const result = {
      pull: g.total,
      id: unit.id,
      tier,
      duplicate,
      refund,
      guarantee,
      time: Math.max(0, Math.floor(now))
    };
    results.push(result);
    g.history.push(result);
    if (g.history.length > GACHA.historyLimit) g.history.shift();
  }
  validateGacha(next.gacha);
  return { session: next, results, price };
}
export const gachaMethods = {
  drawCompanions(count) {
    this._guard();
    const result = rollGacha(this.snapshot(), count, { now: this.now() });
    this._commit(result.session, 'gacha');
    return result;
  }
};
