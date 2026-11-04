const STRATEGIES = ['role', 'nearest', 'lowest_hp', 'backline', 'lowest_hp_ally'];
export class TargetSelector {
  static select(actor, units, grid, strategy = 'role') {
    if (!STRATEGIES.includes(strategy)) throw new Error('Cách chọn mục tiêu không hợp lệ.');
    if (!actor?.alive || !actor.gridPosition) return null;
    const alive = units.filter(u => u.alive && u.gridPosition);
    const enemies = alive.filter(u => u.team !== actor.team);
    const allies = alive.filter(u => u.team === actor.team);
    const byDistance = (a, b) => grid.distance(actor.gridPosition, a.gridPosition) - grid.distance(actor.gridPosition, b.gridPosition) || a.id.localeCompare(b.id);
    const byHp = (a, b) => a.hpRatio - b.hpRatio || byDistance(a, b);
    // The most recently applied valid taunt wins; dead/missing sources cannot lock a unit.
    for (const taunt of [...actor.statusEffects].reverse()) {
      if (taunt.type !== 'taunt' || taunt.remaining <= 0) continue;
      const source = enemies.find(u => u.id === taunt.sourceId);
      if (source) return source;
    }
    if (strategy === 'role') {
      if (['Healer', 'Support'].includes(actor.role)) strategy = 'lowest_hp_ally';
      else if (actor.role === 'Battery') return allies.find(u => u.templateId === 'hero') ?? null;
      else if (['Assassin', 'Finisher'].includes(actor.role)) strategy = 'lowest_hp';
      else if (actor.sect === 'DuongMon') strategy = 'backline';
      else strategy = 'nearest';
    }
    if (strategy === 'lowest_hp_ally') return allies.filter(u => u.hpRatio < 1).sort(byHp)[0] ?? null;
    if (strategy === 'lowest_hp') return enemies.sort(byHp)[0] ?? null;
    if (strategy === 'backline') {
      return enemies.sort((a, b) => (actor.team === 'home' ? b.gridPosition.x - a.gridPosition.x : a.gridPosition.x - b.gridPosition.x) || byHp(a, b))[0] ?? null;
    }
    return enemies.sort(byDistance)[0] ?? null;
  }
}
