import { newAffinityLedger, grantAffinity } from './AffinityEconomy.js';

// Preserve the public numeric companionsAffinity field and all legacy 100/100
// unlocks. Ledger is optional for old saves and initialized lazily.
export function awardCampaignAffinity(session, id, source, eventId, now) {
  session.affinityLedgers ??= {};
  const current = session.companionsAffinity[id] ?? 15;
  let ledger = session.affinityLedgers[id];
  if (!ledger) ledger = newAffinityLedger(current);
  // Existing story rewards can change the legacy affinity value directly.
  // Reconcile upward only; never erase legitimately earned progress.
  if (Math.round(current * 100) > ledger.points100)
    ledger = { ...ledger, points100: Math.round(current * 100) };
  const outcome = grantAffinity(ledger, { source, eventId, timestamp: now });
  session.affinityLedgers[id] = outcome.ledger;
  session.companionsAffinity[id] = outcome.ledger.points100 / 100;
  return outcome.gained100;
}
export function validateAffinityLedgers(session) {
  if (session.affinityLedgers === undefined) return;
  const ledgers = session.affinityLedgers;
  if (!ledgers || Array.isArray(ledgers) || typeof ledgers !== 'object') throw Error('Invalid affinity ledgers');
  for (const [id, ledger] of Object.entries(ledgers)) {
    if (!session.party.unlocked.includes(id) || !ledger || !Number.isInteger(ledger.points100)
      || ledger.points100 < 0 || ledger.points100 > 10000
      || Math.abs(session.companionsAffinity[id] * 100 - ledger.points100) > 0.001
      || !ledger.daily || typeof ledger.daily.day !== 'string'
      || !Number.isInteger(ledger.daily.battle) || !Number.isInteger(ledger.daily.gift)
      || ledger.daily.battle < 0 || ledger.daily.battle > 300
      || ledger.daily.gift < 0 || ledger.daily.gift > 200
      || !Array.isArray(ledger.seenEventIds)
      || ledger.seenEventIds.some(event => typeof event !== 'string')
      || new Set(ledger.seenEventIds).size !== ledger.seenEventIds.length)
      throw Error('Invalid affinity ledger');
  }
}
