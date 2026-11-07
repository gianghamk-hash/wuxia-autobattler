// Phase 1: deterministic, save-safe affinity accounting. Integration with Campaign
// is deliberately separate so existing saves/encounters cannot silently change.
export const AFFINITY_SCALE = 100;
export const AFFINITY_MAX = 100 * AFFINITY_SCALE;
export const AFFINITY_DAILY_CAPS = Object.freeze({ battle: 300, gift: 200 });
export const AFFINITY_BASE_REWARDS = Object.freeze({ battle: 100, gift: 100, favoriteGift: 200, quest: 400, story: 200 });
const repeatable = new Set(['battle', 'gift', 'favoriteGift']);
const capKind = (source) => source === 'battle' ? 'battle' : 'gift';

export function vietnamDay(timestamp) {
  if (!Number.isFinite(timestamp)) throw new RangeError('Invalid timestamp');
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(timestamp));
}
export function affinityRate(points100) {
  if (points100 >= 7500) return 25;
  if (points100 >= 5000) return 50;
  if (points100 >= 2500) return 75;
  return 100;
}
export function newAffinityLedger(points = 0) {
  if (!Number.isFinite(points) || points < 0 || points > 100) throw new RangeError('Invalid affinity');
  return {
    points100: Math.round(points * AFFINITY_SCALE),
    daily: { day: '', battle: 0, gift: 0 },
    seenEventIds: []
  };
}
export function grantAffinity(ledger, { source, eventId, timestamp, amount100 } = {}) {
  if (!ledger || !Number.isInteger(ledger.points100) || ledger.points100 < 0 || ledger.points100 > AFFINITY_MAX)
    throw new TypeError('Invalid affinity ledger');
  if (!['battle','gift','favoriteGift','quest','story'].includes(source))
    throw new RangeError('Invalid affinity source');
  if (typeof eventId !== 'string' || !eventId.trim()) throw new TypeError('Event ID required');
  if (!Array.isArray(ledger.seenEventIds) || !ledger.daily) throw new TypeError('Invalid ledger state');
  if (ledger.seenEventIds.includes(eventId)) return { ledger, gained100: 0, duplicate: true };
  const day = vietnamDay(timestamp);
  const daily = ledger.daily.day === day ? { ...ledger.daily } : { day, battle: 0, gift: 0 };
  const base = amount100 ?? AFFINITY_BASE_REWARDS[source];
  if (!Number.isInteger(base) || base < 0 || base > 500) throw new RangeError('Invalid reward');
  const kind = capKind(source);
  const permitted = repeatable.has(source)
    ? Math.min(base, Math.max(0, AFFINITY_DAILY_CAPS[kind] - daily[kind])) : base;
  if (repeatable.has(source)) daily[kind] += permitted;
  // Split at thresholds to avoid accidentally granting points at the old rate
  // after crossing a milestone. Keep every fractional point in fixed-point.
  let remaining = permitted, gained100 = 0;
  while (remaining > 0 && ledger.points100 + gained100 < AFFINITY_MAX) {
    const current = ledger.points100 + gained100;
    const rate = repeatable.has(source) ? affinityRate(current) : 100;
    const boundary = [2500, 5000, 7500, AFFINITY_MAX].find(x => x > current) ?? AFFINITY_MAX;
    const toBoundary = boundary - current;
    const consumed = Math.min(remaining, Math.ceil(toBoundary * 100 / rate));
    const added = Math.min(toBoundary, Math.floor(consumed * rate / 100));
    gained100 += added;
    remaining -= consumed;
    if (added === 0) break;
  }
  const next = {
    ...ledger, points100: Math.min(AFFINITY_MAX, ledger.points100 + gained100),
    daily, seenEventIds: [...ledger.seenEventIds, eventId]
  };
  return { ledger: next, gained100, duplicate: false };
}
