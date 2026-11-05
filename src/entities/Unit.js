/** Mutable battle instance. Static definitions are never changed. */
export class Unit {
  constructor(definition, { id = definition?.id, team = 'home', level = 1 } = {}) {
    if (!definition || typeof id !== 'string' || !id || !['home', 'enemy'].includes(team) ||
        !Number.isSafeInteger(level) || level < 1) throw new Error('Thông tin thực thể không hợp lệ.');
    const stats = structuredClone(definition.baseStats);
    if (!stats || !Object.values(stats).every(n => Number.isFinite(n) && n >= 0) ||
        !(stats.maxHp > 0 && stats.maxEnergy > 0 && stats.moveSpeed > 0 && stats.attackRange >= 1)) {
      throw new Error('Chỉ số thực thể không hợp lệ.');
    }
    this.id = id; this.templateId = definition.id; this.name = definition.name;
    this.team = team; this.sect = definition.sect; this.role = definition.role; this.level = level;
    this.growthPerLevel = structuredClone(definition.growthPerLevel ?? {});
    for (const [key, growth] of Object.entries(this.growthPerLevel)) {
      if (!Number.isFinite(growth) || growth < 0 || !(key in stats)) throw new Error('Tăng trưởng không hợp lệ.');
      stats[key] += growth * (level - 1);
      if (!Number.isFinite(stats[key])) throw new Error('Cấp độ vượt giới hạn chỉ số.');
    }
    stats.hp = stats.maxHp; stats.energy = 0;
    this.stats = stats; this.skills = structuredClone(definition.skills ?? {});
    this.energyGainMultiplier = 1; this.damageMultiplier = 1;
    this.gridPosition = null; this.statusEffects = []; this.state = 'IDLE';
  }
  get alive() { return this.stats.hp > 0; }
  get hpRatio() { return this.stats.hp / this.stats.maxHp; }
  get shield() { return this.statusEffects.filter(e => e.type === 'shield' && e.remaining > 0).reduce((sum, e) => sum + e.amount, 0); }
  get stunned() { return this.statusEffects.some(e => e.type === 'stun' && e.remaining > 0); }
  gainEnergy(amount) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Nộ khí không hợp lệ.');
    if (!this.alive || this.stunned) return 0;
    const before = this.stats.energy;
    this.stats.energy = Math.min(this.stats.maxEnergy, before + amount * this.energyGainMultiplier * Math.max(.2, 1 - this.statusEffects.filter(e => e.type === 'internal_injury' && e.remaining > 0).reduce((n,e)=>n+e.ratio,0)));
    return this.stats.energy - before;
  }
  heal(amount) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Lượng hồi máu không hợp lệ.');
    if (!this.alive) return 0; // Only an explicit future resurrection skill can revive.
    const before = this.stats.hp; this.stats.hp = Math.min(this.stats.maxHp, before + amount);
    return this.stats.hp - before;
  }
  /** Receives effective damage; defense/crit/dodge math belongs to Sprint 5. */
  takeDamage(amount, { ignoreShield = false, gainEnergy = true } = {}) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Sát thương không hợp lệ.');
    if (!this.alive) return { hpDamage: 0, absorbed: 0, killed: false };
    let remaining = amount;
    if (!ignoreShield) {
      for (const effect of this.statusEffects) {
        if (effect.type !== 'shield' || effect.remaining <= 0) continue;
        const absorbed = Math.min(effect.amount, remaining); effect.amount -= absorbed; remaining -= absorbed;
      }
    }
    const hpDamage = Math.min(this.stats.hp, remaining);
    this.stats.hp -= hpDamage;
    if (gainEnergy) this.gainEnergy(hpDamage / this.stats.maxHp * 40);
    this.statusEffects = this.statusEffects.filter(e => e.type !== 'shield' || e.amount > 0);
    if (!this.alive) { this.state = 'DEAD'; this.stats.energy = 0; this.statusEffects = []; }
    return { hpDamage, absorbed: amount - remaining, killed: !this.alive };
  }
}
