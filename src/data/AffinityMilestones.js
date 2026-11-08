import {COMPANIONS_BY_ID} from './CompanionsData.js';
import {MAX_AFFINITY7, affinityActionText} from './MaxAffinity7.js';
import {deepFreeze} from './DataUtils.js';

// Battle benefits are derived from the current affinity number. No new save fields
// or claim counters are required. 100/100 retains the existing unique passive.
export const AFFINITY_MILESTONES = Object.freeze([25,50,75,100]);

function specialty(definition) {
  const role = String(definition.role ?? '').toLowerCase();
  const effects = definition.skills?.ultimate?.effects ?? [];
  if (/heal|medic/.test(role) || effects.some(e => ['heal','heal_over_time'].includes(e.type))) return 'healing';
  if (/tank|guard|protect|reflect/.test(role) || effects.some(e => e.type === 'shield')) return 'shield';
  if (/battery/.test(role) || effects.some(e => e.type === 'energy_restore')) return 'energy';
  return 'damage';
}
function mainStat(definition) {
  const role = String(definition.role ?? '').toLowerCase();
  if (/tank|guard|protect|reflect/.test(role)) return 'maxHp';
  if (specialty(definition) === 'healing' || definition.skills?.ultimate?.type === 'magical') return 'magicalAtk';
  return 'physicalAtk';
}
export const AFFINITY_SPECIALTIES = deepFreeze(Object.fromEntries(
  Object.values(COMPANIONS_BY_ID).map(c => [c.id, {
    id:c.id, mainStat:mainStat(c), profession:specialty(c),
    mainBonus:.05, professionBonus:.10
  }])
));
export function affinityMilestoneStage(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) throw new RangeError('Duyên phận không hợp lệ');
  return n >= 100 ? 100 : n >= 75 ? 75 : n >= 50 ? 50 : n >= 25 ? 25 : 0;
}
const statNames={maxHp:'HP tối đa',physicalAtk:'ngoại công',magicalAtk:'nội công'};
const professionNames={healing:'hiệu quả hồi phục',shield:'hiệu quả tạo khiên',energy:'lượng nộ tiếp sức',damage:'sát thương gây ra'};
export function affinityMilestoneDetails(id) {
  const d=AFFINITY_SPECIALTIES[id],p=MAX_AFFINITY7[id],mid=MID_AFFINITY75[id];
  if(!d||!p)throw new Error('Đồng hành không tồn tại');
  return [
    {at:25,title:'Ký ức đầu tiên',description:'Mở ký ức đầu tiên; tăng 5% '+statNames[d.mainStat]+'.'},
    {at:50,title:'Nhiệm vụ cá nhân',description:'Mở nhiệm vụ riêng; tăng 10% '+professionNames[d.profession]+', không cộng đồng loạt các chỉ số.'},
    {at:75,title:'Ngã rẽ định mệnh',description:'Mở ngã rẽ; '+mid.description},
    {at:100,title:'Sinh Tử Bất Phụ',description:'Mở hoạt cảnh riêng và nội tại độc bản '+p.name+': '+p.description}
  ];
}
// At 75, the companion receives a restricted, battle-local echo of ONE
// characteristic effect. At 100, the echo is REPLACED by the existing full
// unique passive rather than stacking two major passives.
const scaleAction = action => {
  const a={...action};
  if (['energy','drain'].includes(a.type)) a.value=Math.max(1,Math.round(a.value*.4));
  else if (['stun','root','charm'].includes(a.type)) a.duration=Number(Math.max(.35,a.duration*.5).toFixed(2));
  else if (a.type==='cleanse') { /* utility: limited by strict twice-per-battle cap */ }
  else a.value=Number((a.value*.4).toFixed(4));
  if (a.type==='shield'||a.type==='regen'||a.type==='poison'||a.type==='burn'||a.type==='bleed') a.duration=Math.min(a.duration,3);
  return a;
};
export const MID_AFFINITY75=deepFreeze(Object.fromEntries(Object.entries(MAX_AFFINITY7).map(([id,p])=>{
  const actions=[scaleAction(p.actions[0])];
  const interval=p.trigger==='interval'?Math.max(15,p.interval+5):0;
  const cd=Math.max(12,p.cd+5);
  const every=['attack','hurt'].includes(p.trigger)?Math.max(3,p.every):p.every;
  const name='Dư Âm · '+p.name;
  const triggerText=p.description.split(':')[0].replace(/\(mỗi \d+(?:s| lần)\)/g,'').trim();
  const cadence=interval?' (mỗi '+interval+'s)':every>1?' (mỗi '+every+' lần)':'';
  return [id,{id:id+'_75',ownerId:id,name,trigger:p.trigger,actions,cd,every,interval,limit:2,
    description:triggerText+cadence+': '+affinityActionText(actions[0])+'. Hồi '+cd+'s; tối đa 2 lần/trận.'}];
})));
export function applyAffinityMilestones(unit, affinity) {
  if(!unit||!AFFINITY_SPECIALTIES[unit.templateId])return unit;
  const stage=affinityMilestoneStage(affinity);
  const info=AFFINITY_SPECIALTIES[unit.templateId];
  unit.affinityStage=stage;
  unit.midAffinity=stage===75;
  unit.maxAffinity=stage===100;
  unit.affinityProfession=stage>=50?info.profession:null;
  if(stage>=25){
    const stat=info.mainStat;
    unit.stats[stat]*=1.05;
    if(stat==='maxHp')unit.stats.hp=unit.stats.maxHp;
  }
  return unit;
}
