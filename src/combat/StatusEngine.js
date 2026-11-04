/** Durations and periodic damage use simulation seconds, so pause/time scale work naturally. */
export class StatusEngine {
  apply(unit, definition) {
    const { type, duration } = definition ?? {};
    if (!['poison', 'bleed', 'stun', 'shield', 'taunt'].includes(type) || !Number.isFinite(duration) || duration <= 0) throw new Error('Hiệu ứng không hợp lệ.');
    if (!unit.alive) return null;
    let effect = { type, remaining: duration };
    if (type === 'poison' || type === 'bleed') {
      const { damagePerStack, stacks = 1 } = definition;
      if (!Number.isFinite(damagePerStack) || damagePerStack < 0 || !Number.isSafeInteger(stacks) || stacks < 1) throw new Error('Sát thương hiệu ứng không hợp lệ.');
      const maxStacks = type === 'poison' ? 5 : 1;
      const existing = unit.statusEffects.find(e => e.type === type && e.remaining > 0);
      if (existing) {
        existing.stacks = Math.min(maxStacks, existing.stacks + stacks);
        existing.remaining = Math.max(existing.remaining, duration);
        existing.damagePerStack = Math.max(existing.damagePerStack, damagePerStack);
        return existing;
      }
      effect = { ...effect, stacks: Math.min(stacks, maxStacks), damagePerStack, tickAccumulator: 0 };
    } else if (type === 'shield') {
      if (!Number.isFinite(definition.amount) || definition.amount <= 0) throw new Error('Giá trị khiên không hợp lệ.');
      effect.amount = definition.amount;
    } else if (type === 'taunt') {
      if (typeof definition.sourceId !== 'string' || !definition.sourceId) throw new Error('Thiếu nguồn khiêu khích.');
      effect.sourceId = definition.sourceId;
    } else {
      const existing = unit.statusEffects.find(e => e.type === 'stun' && e.remaining > 0);
      if (existing) { existing.remaining = Math.max(existing.remaining, duration); return existing; }
      unit.state = 'STUNNED';
    }
    unit.statusEffects.push(effect); return effect;
  }
  update(unit, dt) {
    if (!Number.isFinite(dt) || dt < 0) throw new Error('Thời gian hiệu ứng không hợp lệ.');
    if (!unit.alive || dt === 0) return;
    let remaining = dt;
    // Advance all timers on one timeline. Results do not depend on effect insertion
    // order or on whether the caller advances five seconds once or in small ticks.
    while (remaining > 1e-9 && unit.alive && unit.statusEffects.length) {
      const effects = [...unit.statusEffects];
      const step = Math.min(remaining, ...effects.map(effect => Math.min(effect.remaining,
        ['poison', 'bleed'].includes(effect.type) ? 1 - effect.tickAccumulator : Infinity)));
      for (const effect of effects) {
        effect.remaining = Math.max(0, effect.remaining - step);
        if (effect.type === 'poison' || effect.type === 'bleed') effect.tickAccumulator += step;
      }
      remaining = Math.max(0, remaining - step);
      for (const effect of effects) {
        if ((effect.type === 'poison' || effect.type === 'bleed') && effect.tickAccumulator >= 1 - 1e-9 && unit.alive) {
          effect.tickAccumulator = Math.max(0, effect.tickAccumulator - 1);
          // True damage bypasses defense; shields still absorb it unless a skill says otherwise.
          unit.takeDamage(effect.damagePerStack * effect.stacks);
        }
      }
      unit.statusEffects = unit.statusEffects.filter(effect => effect.remaining > 1e-9 &&
        (effect.type !== 'shield' || effect.amount > 0));
    }
    if (unit.alive && !unit.stunned && unit.state === 'STUNNED') unit.state = 'IDLE';
  }
  cleanse(unit, types = ['poison', 'bleed', 'stun', 'taunt']) {
    unit.statusEffects = unit.statusEffects.filter(e => !types.includes(e.type));
    if (unit.alive && !unit.stunned && unit.state === 'STUNNED') unit.state = 'IDLE';
  }
}
