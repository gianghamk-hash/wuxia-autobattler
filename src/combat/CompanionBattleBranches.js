import {COMPANION_JOURNEY_DESIGNS} from '../data/CompanionJourneyDesigns.js';

/**
 * A branch is a one-time choice, with a meaningful benefit AND cost.
 * Modify only newly constructed, player-owned battle instances.
 * Never mutate canonical companion definitions or persisted save stats.
 */
const DIRECT_STATS=new Set(['maxHp','physicalAtk','magicalAtk','physicalDef','magicalDef','critRate','dodgeRate']);
const SOFT_CAPS={critRate:0.60,dodgeRate:0.40};
export function applyCompanionCrossroad(unit,choiceId) {
 if(!unit||unit.team!=='home'||unit.missionAsset||!choiceId||unit.affinityStage<75) return unit;
 if(unit.crossroadApplied) return unit;
 const profile=COMPANION_JOURNEY_DESIGNS[unit.templateId];
 const choice=profile?.branch.choices.find(c=>c.id===choiceId);
 if(!choice)throw Error('Lựa chọn ngã rẽ đồng hành không hợp lệ.');
 for(const [key,delta] of Object.entries(choice.statChanges)) {
  if(!Number.isFinite(delta)||Math.abs(delta)>.25)throw Error('Hệ số ngã rẽ không hợp lệ');
  if(DIRECT_STATS.has(key)){
   const before=unit.stats[key];
   if(!Number.isFinite(before))throw Error('Thiếu chỉ số ngã rẽ: '+key);
   if(key==='critRate'||key==='dodgeRate')
     unit.stats[key]=Math.min(SOFT_CAPS[key],Math.max(0,before+delta));
   else unit.stats[key]=Math.max(0.01,before*(1+delta));
  } else if(key==='preparedEnergy') {
   unit.preparedEnergy=(unit.preparedEnergy??0)+delta;
  } else if(key==='preparedDamage') {
   unit.preparedDamage=(unit.preparedDamage??1)*(1+delta);
  } else throw Error('Loại chỉ số ngã rẽ không hợp lệ: '+key);
 }
 if('maxHp' in choice.statChanges)unit.stats.hp=unit.stats.maxHp;
 unit.crossroadApplied=true;
 unit.crossroadPath=choiceId;
 return unit;
}
