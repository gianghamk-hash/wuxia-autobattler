import { CONFIG } from '../config.js';
export function modifier(unit, type) {
  return unit.statusEffects.filter(e => e.type === type && e.remaining > 0).reduce((sum, e) => sum + e.ratio, 0);
}
export function attackInterval(unit) {
  const agility = unit.attributes?.thanPhap ?? 0;
  return CONFIG.COMBAT.BASE_ATTACK_INTERVAL / 1000 / (1 + agility * .015) / unit.stats.attackSpeed;
}
export function calculateDamage(attacker, defender, skill, random) {
  const missed = random() < Math.min(.95, defender.stats.dodgeRate + modifier(defender, 'dodge_up') + modifier(attacker, 'accuracy_down'));
  if (missed) return { amount: 0, missed: true, crit: false, blocked: false };
  const crit = random() < Math.min(.75, attacker.stats.critRate + (attacker.attributes?.ngoTinh ?? 0) * .005);
  const blocked = random() < defender.stats.blockRate;
  const physical = skill.type === 'physical';
  const attack = attacker.stats[physical ? 'physicalAtk' : 'magicalAtk'] * (1 + modifier(attacker, 'attack_up'));
  const defense = defender.stats[physical ? 'physicalDef' : 'magicalDef'] *
    (physical ? Math.max(0, 1 - modifier(defender, 'physical_defense_down')) : 1);
  const critMultiplier = attacker.stats.critDmg + (attacker.attributes?.kinhLuc ?? 0) * .004;
  const amount = attack * skill.dmgMultiplier * (attacker.damageMultiplier ?? 1) *
    (1000 / (1000 + defense * CONFIG.MATH.ARMOR_CONSTANT)) * (crit ? critMultiplier : 1) * (blocked ? .5 : 1);
  return { amount, missed: false, crit, blocked };
}
export function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6D2B79F5) >>> 0;
    let mixed = Math.imul(value ^ value >>> 15, value | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}
