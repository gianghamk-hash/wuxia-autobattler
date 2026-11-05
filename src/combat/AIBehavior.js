import { attackInterval } from './CombatMath.js';

/** Fixed-step FSM. Windups resolve at impact; dead/invalid targets cancel without spending rage. */
export class AIBehavior {
  constructor(unit) {
    this.unit = unit;
    this.cooldown = 0;
    this.moveCredit = 0;
    this.action = null;
    this.targetId = null;
  }
  update(dt, combat) {
    const unit = this.unit;
    if (!unit.alive) {
      unit.state = 'DEAD';
      this.action = null;
      this.targetId = null;
      return;
    }
    if (unit.stunned) {
      unit.state = 'STUNNED';
      this.action = null;
      this.moveCredit = 0;
      return;
    }
    if(unit.isObject || unit.bossCasting) {unit.state='IDLE';return;}
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.action) {
      const { target, skill, ultimate } = this.action;
      if (
        !combat.validTarget(unit, target, skill) ||
        !combat.inRange(unit, target, skill)
      ) {
        this.action = null;
        this.targetId = null;
        unit.state = 'IDLE';
        return;
      }
      this.action.remaining -= dt;
      if (this.action.remaining <= 1e-9) {
        if (!ultimate || unit.stats.energy >= skill.energyCost) {
          if (ultimate) {
            unit.stats.energy = Math.max(
              0,
              unit.stats.energy - skill.energyCost
            );
            combat.manualOrders.delete(unit.id);
          }
          combat.resolveSkill(unit, target, skill, ultimate);
        }
        this.action = null;
        this.cooldown = attackInterval(unit);
        unit.state = unit.alive ? 'IDLE' : 'DEAD';
      }
      return;
    }
    let ultimate =
      (unit.team !== 'home' ||
        combat.autoUltimate ||
        combat.manualOrders.has(unit.id)) &&
      unit.stats.energy >= (unit.skills.ultimate?.energyCost ?? Infinity);
    let skill = ultimate ? unit.skills.ultimate : unit.skills.autoAttack;
    let target = skill && combat.chooseTarget(unit, skill, !ultimate);
    if (!target && ultimate) {
      ultimate = false;
      skill = unit.skills.autoAttack;
      target = combat.chooseTarget(unit, skill, true);
    }
    this.targetId = target?.id ?? null;
    if (!target) {
      unit.state = 'IDLE';
      this.moveCredit = 0;
      return;
    }
    if (!combat.inRange(unit, target, skill)) {
      if(unit.statusEffects.some(e=>e.type==='root'&&e.remaining>0)){unit.state='ROOTED';this.moveCredit=0;return;}
      const path = combat.grid.pathToRange(
        unit,
        target,
        combat.range(unit, skill)
      );
      if (path === null) {
        // A rear target may be screened by a tank. Reach a valid alternative instead of freezing.
        target = combat.reachableAlternative(unit, skill);
        this.targetId = target?.id ?? null;
        if (!target) {
          combat.yieldPath(unit, skill);
          combat.records.get(unit.id).blockedTime += dt;
          unit.state = 'IDLE';
          this.moveCredit = 0;
          return;
        }
      }
      const route = combat.grid.pathToRange(
        unit,
        target,
        combat.range(unit, skill)
      );
      if (route?.length) {
        unit.state = 'MOVE';
        this.moveCredit += dt * unit.stats.moveSpeed;
        if (this.moveCredit >= 1 - 1e-9) {
          this.moveCredit = Math.max(0, this.moveCredit - 1);
          combat.grid.move(unit, route[0]);
        }
        return;
      }
    }
    this.moveCredit = 0;
    if (this.cooldown > 1e-9) {
      unit.state = 'IDLE';
      return;
    }
    unit.state = ultimate ? 'ULTIMATE' : 'ATTACK';
    this.action = { skill, target, ultimate, remaining: ultimate ? 0.35 : 0.2 };
    combat.emit({
      type: 'cast',
      actorId: unit.id,
      targetId: target.id,
      skill: skill.name,
      ultimate
    });
  }
}
