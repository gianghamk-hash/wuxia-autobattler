import {deepFreeze} from './DataUtils.js';
const make=(type,power,target,effects)=>({type,targetType:target,dmgMultiplier:power,effects});
const kit=(type,basic,power,target,effects)=>({autoAttack:{...make(type,basic,'nearest_enemy',[]),energyGain:15},ultimate:{...make(type,power,target,effects),energyCost:100}});
export const NPC_KITS7=deepFreeze({
 quan_chu:kit('physical',1,1.6,'enemy_area',[{type:'area_damage',width:3,height:3},{type:'stun',duration:.5},{type:'shield',recipient:'caster',maxHpRatio:.12,duration:4}]),
 doi_truong:kit('physical',1.05,1.8,'front_enemy',[{type:'row_damage'},{type:'physical_defense_down',ratio:.15,duration:4}]),
 doc_le:kit('physical',1.1,2.2,'enemy_area',[{type:'area_damage',width:3,height:3},{type:'burn',duration:4},{type:'taunt',duration:1}]),
 kha_van:kit('physical',1,1.3,'lowest_hp_enemy',[{type:'blink'},{type:'multi_hit',hits:2}]),
 do_mau:kit('magical',1,1.5,'front_enemy',[{type:'root',duration:1.2},{type:'shield',recipient:'caster',maxHpRatio:.15,duration:4}]),
 trinh_nghiem:kit('magical',1,1.6,'enemy_area',[{type:'area_damage',width:3,height:3},{type:'internal_injury',ratio:.3,duration:4},{type:'poison',stacks:1,duration:3}]),
 tay_sai:kit('physical',1,1.1,'nearest_enemy',[{type:'multi_hit',hits:2},{type:'knockback'}])
});
