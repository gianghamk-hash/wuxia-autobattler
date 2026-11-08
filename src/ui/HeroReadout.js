import { EQUIPMENT_BY_ID, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import { SECTS } from '../data/SectsData.js';
import { ATTRIBUTE_BONUSES, SECT_PASSIVES } from '../data/ProgressionBalance.js';
import { SKILLS_BY_ID } from '../data/SkillTreeData.js';
import { effectDescription } from '../data/CharacterKits7.js';

export const HERO_STAT_LABELS = Object.freeze({
 maxHp:'Sinh lực tối đa',hp:'Sinh lực hiện tại',maxEnergy:'Nộ khí tối đa',energy:'Nộ khí hiện tại',
 physicalAtk:'Ngoại công',magicalAtk:'Nội công',physicalDef:'Ngoại phòng',magicalDef:'Nội phòng',
 attackSpeed:'Tốc độ đánh',critRate:'Tỷ lệ bạo kích',critDmg:'Sát thương bạo kích',
 dodgeRate:'Tỷ lệ né tránh',blockRate:'Tỷ lệ đỡ đòn',moveSpeed:'Tốc độ di chuyển',attackRange:'Tầm đánh'
});
const PERCENT = new Set(['critRate','critDmg','dodgeRate','blockRate']);
const number = v => new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(Number.isFinite(v)?v:0);
export function formatHeroStat(key,value){
 if(PERCENT.has(key))return number(value*100)+'%';
 if(key==='attackSpeed')return number(value)+' đòn/giây';
 if(key==='moveSpeed')return number(value)+' ô/giây';
 if(key==='attackRange')return number(value)+' ô';
 return number(value);
}
const add = (target,values,mul=1) => {for(const [key,value] of Object.entries(values??{}))target[key]=(target[key]??0)+value*mul;return target;};
export function equipmentSetProgress(build){
 const equipped=Object.values(build.equippedGear??{}).filter(Boolean).map(id=>EQUIPMENT_BY_ID[id]).filter(Boolean);
 const counts={};for(const item of equipped)if(item.setId)counts[item.setId]=(counts[item.setId]??0)+1;
 return Object.entries(counts).map(([setId,pieces])=>({
  setId,pieces,items:equipped.filter(item=>item.setId===setId),
  milestones:EQUIPMENT_SETS.filter(set=>(set.setId??set.id)===setId).sort((a,b)=>a.requiredPieces-b.requiredPieces)
    .map(set=>({...set,active:pieces>=set.requiredPieces}))
 }));
}
export function heroStatBreakdown(hero,build){
 const base=structuredClone(SECTS[build.sect]?.baseStats??{});
 const growth=SECTS[build.sect]?.growthPerLevel??{};
 const baseline={...base};add(baseline,growth,build.level-1);
 const attributes={};for(const [key,points] of Object.entries(build.attributes??{}))add(attributes,ATTRIBUTE_BONUSES[key],points);
 const skills={};for(const id of build.allocatedSkills??[])add(skills,SKILLS_BY_ID[id]?.stats);
 const gear={};for(const id of Object.values(build.equippedGear??{}))if(id)add(gear,EQUIPMENT_BY_ID[id]?.stats);
 const sets={};for(const group of equipmentSetProgress(build))for(const milestone of group.milestones)if(milestone.active)add(sets,milestone.stats);
 const all=new Set([...Object.keys(hero.stats),...Object.keys(baseline),...Object.keys(attributes),...Object.keys(skills),...Object.keys(gear),...Object.keys(sets)]);
 return [...all].filter(key=>key!=='hp'&&key!=='energy').map(key=>{
  const original=baseline[key]??0,attr=attributes[key]??0,skill=skills[key]??0,equipment=gear[key]??0,set=sets[key]??0;
  const passive=(hero.stats[key]??0)-original-attr-skill-equipment-set;
  return {key,label:HERO_STAT_LABELS[key]??key,base:original,attributes:attr,skills:skill,gear:equipment,set,passive,total:hero.stats[key]??0};
 });
}
const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
function statList(stats){return Object.entries(stats??{}).map(([key,value])=>(HERO_STAT_LABELS[key]??key)+' +'+formatHeroStat(key,value)).join(' · ')||'Không cộng chỉ số trực tiếp';}
function appendReadoutCard(root,title,body,status){
 const card=n('article',undefined,'hero-readout-card');
 if(status)card.dataset.active=String(status==='active');
 card.append(n('h4',title),n('p',body,'hero-readout-description'));root.append(card);return card;
}
export function renderHeroReadout({hero,build,statsRoot,setsRoot,skillsRoot}){
 // Display-only: no profile writes, mutations or combat changes.
 const groups=equipmentSetProgress(build);
 setsRoot.replaceChildren(n('h3','Hiệu quả bộ trang bị'));
 if(!groups.length)setsRoot.append(n('p','Chưa mặc trang bị thuộc bộ nào. Hãy mặc các món cùng bộ để mở mốc cộng dồn.','hint'));
 for(const group of groups){
  const panel=n('section',undefined,'hero-set-group');
  panel.append(n('h4',group.items[0]?.name?.replace(/^(Binh khí|Áo giáp|Ngọc bội|Mũ) /,'').replace(/ · (Thường|Hiếm|Xuất sắc|Trác việt)$/,'')??group.setId));
  panel.append(n('p',group.pieces+' món đang mặc · '+group.items.map(item=>item.name).join(' · '),'hint'));
  for(const milestone of group.milestones){
   const card=appendReadoutCard(panel,
    (milestone.active?'✓ Đã kích hoạt':'○ Chưa kích hoạt')+' · '+milestone.requiredPieces+' món',
    statList(milestone.stats),milestone.active?'active':'inactive');
   card.dataset.setMilestone=milestone.id;
   if(!milestone.active)card.append(n('small','Cần thêm '+(milestone.requiredPieces-group.pieces)+' món cùng bộ để mở mốc này.','hint'));
  }
  setsRoot.append(panel);
 }
 statsRoot.replaceChildren(n('h3','Toàn bộ chỉ số chiến đấu'),n('p','Chỉ số tổng lấy từ nhân vật chiến đấu. Mở từng chỉ số để xem các nguồn cộng trước và sau nội tại môn phái.','hint'));
 const list=n('div',undefined,'hero-stat-details');list.dataset.heroStats='full';
 for(const row of heroStatBreakdown(hero,build)){
  const details=n('details',undefined,'hero-stat-row');
  const summary=n('summary',row.label+' · '+formatHeroStat(row.key,row.total));details.append(summary);
  for(const [label,value] of [['Gốc + tăng trưởng cấp',row.base],['Điểm thuộc tính',row.attributes],['Võ công đã học',row.skills],['Từng món trang bị',row.gear],['Mốc bộ trang bị',row.set],['Nội tại môn phái',row.passive]]){
   details.append(n('p',label+': '+(value>=0?'+':'')+formatHeroStat(row.key,value),'hero-stat-source'));
  }
  if(Math.abs(row.passive)>1e-7)details.append(n('small','Nội tại phần trăm tính sau các nguồn cộng; số hiển thị đã làm tròn.','hint'));
  list.append(details);
 }
 const resource=n('p','Đầu trận: HP '+formatHeroStat('maxHp',hero.stats.maxHp)+'/'+formatHeroStat('maxHp',hero.stats.maxHp)+' · Nộ '+formatHeroStat('maxEnergy',0)+'/'+formatHeroStat('maxEnergy',hero.stats.maxEnergy),'hint');
 statsRoot.append(resource,list);
 skillsRoot.replaceChildren(n('h3','Kỹ năng chủ động'));
 for(const [key,kind] of [['autoAttack','Đánh thường'],['ultimate','Tuyệt kỹ']]){
  const skill=hero.skills?.[key];if(!skill)continue;
  const card=appendReadoutCard(skillsRoot,kind+' · '+skill.name,skill.description??'');
  card.dataset.heroSkill=key;
  const lines=[
   skill.dmgMultiplier?('Hệ số sát thương: '+number(skill.dmgMultiplier*100)+'% '+(skill.type==='magical'?'nội công':'ngoại công')):'Không có hệ số sát thương trực tiếp',
   skill.energyGain!==undefined?'Nhận nộ: '+number(skill.energyGain):'',
   skill.energyCost!==undefined?'Tiêu hao nộ: '+number(skill.energyCost):'',
   skill.targetType?'Mục tiêu (mã engine): '+skill.targetType:'',
   (skill.effects??[]).length?'Hiệu ứng: '+skill.effects.map(effectDescription).join(' · '):'Không có hiệu ứng phụ'
  ];for(const line of lines.filter(Boolean))card.append(n('p',line,'hero-skill-meta'));
 }
 skillsRoot.append(n('h3','Nội tại và võ công đã học'));
 const inherent=SECTS[build.sect]?.passive;
 if(inherent)appendReadoutCard(skillsRoot,'Nội tại môn phái · '+inherent.name,inherent.description,'active');
 for(const passive of SECT_PASSIVES[build.sect]??[]){
  const active=build.level>=passive.level;
  appendReadoutCard(skillsRoot,(active?'✓ Đã mở':'○ Chưa mở')+' · Cấp '+passive.level+' · '+passive.name,passive.description,active?'active':'inactive');
 }
 if(!(build.allocatedSkills??[]).length)skillsRoot.append(n('p','Chưa học nút võ công nào.','hint'));
 for(const id of build.allocatedSkills??[]){
  const skill=SKILLS_BY_ID[id];if(!skill)continue;
  const card=appendReadoutCard(skillsRoot,'Tầng '+skill.tier+' · '+skill.name,skill.description??'','active');
  if(Object.keys(skill.stats??{}).length)card.append(n('p','Chỉ số: '+statList(skill.stats),'hero-skill-meta'));
  if(skill.ultimate)card.append(n('p','Tuyệt kỹ được học: '+skill.ultimate.name+' (chỉ tuyệt kỹ học gần nhất được trang bị).','hero-skill-meta'));
 }
}
