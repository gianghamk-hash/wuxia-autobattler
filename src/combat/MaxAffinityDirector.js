import {MAX_AFFINITY7} from '../data/MaxAffinity7.js';
import {MID_AFFINITY75} from '../data/AffinityMilestones.js';
/** Battle-local progress. Perk reactions do not recursively trigger other perks. */
export class MaxAffinityDirector {
 constructor(combat){this.c=combat;this.busy=false;this.entries=combat.units.filter(u=>(u.maxAffinity||u.midAffinity)&&MAX_AFFINITY7[u.templateId]&&!u.missionAsset).map(unit=>{const perk=unit.maxAffinity?MAX_AFFINITY7[unit.templateId]:MID_AFFINITY75[unit.templateId];return{unit,perk,seen:0,used:0,ready:0,next:perk.interval};});}
 allies(u){return this.c.units.filter(v=>v.team===u.team&&v.alive&&!v.missionAsset&&!v.isObject);}
 enemies(u){return this.c.units.filter(v=>v.team!==u.team&&v.alive&&!v.missionAsset&&!v.isObject);}
 matches(r,e){const u=r.unit,other=this.c.units.find(v=>v.id===e.actorId),victim=this.c.units.find(v=>v.id===e.targetId);switch(r.perk.trigger){
  case 'start':return e.type==='start';
  case 'attack':return e.type==='skill:cast'&&e.actorId===u.id&&!e.ultimate;
  case 'ultimate':return e.type==='ultimate'&&e.actorId===u.id;
  case 'crit':return e.type==='damage'&&e.actorId===u.id&&e.crit&&e.amount>0;
  case 'hurt':return e.type==='damage'&&e.targetId===u.id&&e.amount>0;
  case 'heal':return e.type==='heal'&&e.actorId===u.id&&e.amount>0;
  case 'receive_heal':return e.type==='heal'&&e.targetId===u.id&&e.amount>0;
  case 'kill':return e.type==='death'&&e.actorId===u.id&&victim&&victim.team!==u.team&&!victim.missionAsset&&!victim.isObject;
  case 'ally_death':return e.type==='death'&&e.targetId!==u.id&&victim&&victim.team===u.team&&!victim.missionAsset&&!victim.isObject;
  case 'dodge':return e.type==='miss'&&e.targetId===u.id;
  case 'shield_break':return e.type==='damage'&&e.targetId===u.id&&e.absorbed>0&&u.shield<=0;
  case 'enemy_ultimate':return e.type==='ultimate'&&other&&other.team!==u.team;
  case 'ally_ultimate':return e.type==='ultimate'&&other&&other.id!==u.id&&other.team===u.team&&!other.missionAsset;
  case 'poison_damage':return e.type==='damage'&&e.actorId===u.id&&e.statusType==='poison'&&e.amount>0;
  default:return false;
 }}
 event(e){if(this.busy||this.c.state!=='running'||e.affinityProc)return;for(const r of this.entries)if(r.unit.alive&&this.matches(r,e)){r.seen++;if(r.seen%r.perk.every===0)this.fire(r,e);}}
 tick(){if(this.busy||this.c.state!=='running')return;for(const r of this.entries){const u=r.unit,p=r.perk;if(!u.alive)continue;let ok=false;
  if(p.trigger==='interval'&&this.c.elapsed+1e-9>=r.next){r.next+=p.interval;ok=true;}
  if(p.trigger==='ally_low')ok=this.allies(u).some(v=>v.hpRatio<.35);
  if(p.trigger==='self_low')ok=u.hpRatio<.35;
  if(p.trigger==='enemy_low')ok=this.enemies(u).some(v=>v.hpRatio<.3);
  if(p.trigger==='outnumbered')ok=this.enemies(u).length>this.allies(u).length;
  if(ok)this.fire(r,{});
 }}
 targets(u,key,e){const allies=this.allies(u),enemies=this.enemies(u),stable=(a,b)=>a.id.localeCompare(b.id),near=[...enemies].sort((a,b)=>this.c.grid.distance(u.gridPosition,a.gridPosition)-this.c.grid.distance(u.gridPosition,b.gridPosition)||stable(a,b)),rear=[...enemies].sort((a,b)=>(u.team==='home'?b.gridPosition.x-a.gridPosition.x:a.gridPosition.x-b.gridPosition.x)||stable(a,b)),anchor=near[0];
  switch(key){
   case 'self':return[u];case 'all_allies':return allies;case 'all_enemies':return enemies;
   case 'weakest_ally':return allies.sort((a,b)=>a.hpRatio-b.hpRatio||stable(a,b)).slice(0,1);
   case 'lowest_energy_ally':return allies.sort((a,b)=>a.stats.energy-b.stats.energy||stable(a,b)).slice(0,1);
   case 'hero':return allies.filter(v=>v.templateId==='hero');
   case 'front_allies':{const x=u.team==='home'?Math.max(...allies.map(v=>v.gridPosition.x)):Math.min(...allies.map(v=>v.gridPosition.x));return allies.filter(v=>v.gridPosition.x===x);}
   case 'adjacent_allies':return allies.filter(v=>this.c.grid.distance(u.gridPosition,v.gridPosition)<=1);
   case 'adjacent_enemies':return enemies.filter(v=>this.c.grid.distance(u.gridPosition,v.gridPosition)<=1);
   case 'nearest_enemy':return near.slice(0,1);case 'back_enemy':return rear.slice(0,1);case 'rear_pair':return rear.slice(0,2);
   case 'strongest_enemy':return enemies.sort((a,b)=>Math.max(b.stats.physicalAtk,b.stats.magicalAtk)-Math.max(a.stats.physicalAtk,a.stats.magicalAtk)||stable(a,b)).slice(0,1);
   case 'weakest_enemy':return enemies.sort((a,b)=>a.hpRatio-b.hpRatio||stable(a,b)).slice(0,1);
   case 'row_enemies':return anchor?enemies.filter(v=>v.gridPosition.y===anchor.gridPosition.y):[];
   case 'column_enemies':return anchor?enemies.filter(v=>v.gridPosition.x===anchor.gridPosition.x):[];
   case 'event_actor':case 'event_target':{const id=key==='event_actor'?e.actorId:e.targetId??e.targets?.[0]?.id;return this.c.units.filter(v=>v.id===id&&v.alive&&!v.missionAsset&&!v.isObject);}
   default:return[];
  }
 }
 fire(r,e){const c=this.c,u=r.unit,p=r.perk;if(c.elapsed+1e-9<r.ready||p.limit!==null&&r.used>=p.limit)return false;
  // Resolve every action's targets together so earlier healing cannot retarget later actions.
  const actions=p.actions.map(a=>({a,targets:this.targets(u,a.target,e)}));if(!actions.some(a=>a.targets.length))return false;
  r.used++;r.ready=c.elapsed+p.cd;this.busy=true;
  try{const power=Math.max(u.stats.physicalAtk,u.stats.magicalAtk),visual=new Map();
   for(const{a,targets}of actions)for(const target of targets){if(!target.alive)continue;visual.set(target.id,target);const duration=a.duration;
    if(a.type==='damage')c.dealDamage(u,target,power*a.value,{damageType:'true',affinityProc:true});
    else if(a.type==='heal')c.heal(u,target,target.stats.maxHp*a.value);
    else if(a.type==='energy')target.gainEnergy(a.value);
    else if(a.type==='drain')target.stats.energy=Math.max(0,target.stats.energy-a.value);
    else if(a.type==='cleanse')c.statuses.cleanse(target);
    else if(a.type==='shield')c.statuses.apply(target,{type:'shield',duration,amount:target.stats.maxHp*a.value,sourceId:u.id});
    else if(['poison','burn','bleed','regen'].includes(a.type))c.statuses.apply(target,{type:a.type,duration,damagePerStack:a.type==='regen'?target.stats.maxHp*a.value:power*a.value,sourceId:u.id});
    else c.statuses.apply(target,{type:a.type,duration,ratio:a.value,sourceId:u.id});
   }
   c.emit({type:'affinity:proc',actorId:u.id,name:p.name,perkId:p.id,affinityProc:true});
   c.emit({type:'skill:cast',actorId:u.id,ownerId:u.characterId??u.templateId,skillId:u.skills.ultimate.id,name:p.name,ultimate:true,affinityProc:true,origin:{...u.gridPosition},targets:[...visual.values()].filter(v=>v.gridPosition).map(v=>({id:v.id,position:{...v.gridPosition}}))});
  }finally{this.busy=false;}
  return true;
 }
}
