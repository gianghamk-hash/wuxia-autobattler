import { elementMultiplier } from '../data/StrategyData.js';
import { modifier } from './CombatMath.js';
/** Damage change relative to this fighter's intrinsic neutral strike. Uses the same live modifiers as calculateDamage; no crit/dodge RNG. */
export function damageIndicator(battle, unit, opponentId) {
  if (!unit.alive || unit.isObject || !unit.gridPosition) return null;
  const action=battle.brains?.get(unit.id)?.action;
  if (!opponentId && action?.target?.team===unit.team) return null;
  if (!Object.values(unit.skills??{}).some(s=>s.dmgMultiplier>0)) return null;
  const foes=battle.units.filter(u=>u.alive&&!u.isObject&&u.team!==unit.team&&u.gridPosition);
  const target=foes.find(u=>u.id===opponentId)
    ??foes.find(u=>u===action?.target)
    ??foes.find(u=>u.id===battle.brains?.get(unit.id)?.targetId)
    ??foes.sort((a,b)=>battle.grid.distance(unit.gridPosition,a.gridPosition)-battle.grid.distance(unit.gridPosition,b.gridPosition)||a.id.localeCompare(b.id))[0];
  if (!target) return null;
  const multiplier=elementMultiplier(unit,target)*((unit.damageMultiplier??1)/(unit.intrinsicDamageMultiplier??1))*(1+modifier(unit,'attack_up'));
  const percent=Math.round((multiplier-1)*100);
  if (!percent) return null;
  return {percent,kind:percent>0?'up':'down',targetId:target.id,targetName:target.name,multiplier};
}
