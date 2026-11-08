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
 const base=structuredClone(SECTS[build.sect]?.baseStats??hero.stats);
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

const STAT_ORDER=['maxHp','physicalAtk','magicalAtk','physicalDef','magicalDef','attackSpeed',
 'critRate','critDmg','dodgeRate','blockRate','maxEnergy','moveSpeed','attackRange'];
const BREAKDOWN_LABELS=[['base','Gốc + tăng trưởng cấp'],['attributes','Điểm thuộc tính'],
 ['skills','Võ công đã học'],['gear','Trang bị'],['set','Hiệu quả bộ trang bị'],['passive','Nội tại môn phái']];

export function renderHeroStats(root,hero,build){
 // Hero header is rendered after every profile update; the numbers must come from the live Hero.
 const wasOpen=new Set([...root.querySelectorAll('.hero-top-stat[open]')].map(e=>e.dataset.statKey));
 const heading=n('div',undefined,'hero-top-stat-heading');
 heading.append(n('strong','CHỈ SỐ CHIẾN ĐẤU'),n('span','Chạm vào chỉ số để xem nguồn cộng'));
 const grid=n('div',undefined,'hero-top-stat-grid');grid.dataset.heroStats='full';
 const rows=heroStatBreakdown(hero,build).sort((a,b)=>
  (STAT_ORDER.indexOf(a.key)<0?99:STAT_ORDER.indexOf(a.key))-
  (STAT_ORDER.indexOf(b.key)<0?99:STAT_ORDER.indexOf(b.key)));
 for(const row of rows){
  const details=n('details',undefined,'hero-top-stat');details.dataset.statKey=row.key;
  if(wasOpen.has(row.key))details.open=true;
  const summary=n('summary');
  summary.append(n('span',row.label,'hero-top-stat-name'),
   n('strong',formatHeroStat(row.key,row.total),'hero-top-stat-value'));
  details.append(summary);
  const sources=n('div',undefined,'hero-top-stat-sources');
  for(const [key,label] of BREAKDOWN_LABELS){
   const amount=row[key];
   if(key!=='base'&&Math.abs(amount)<1e-9)continue;
   const line=n('div',undefined,'hero-top-stat-source');
   line.append(n('span',label),n('strong',(amount>0?'+':'')+formatHeroStat(row.key,amount)));
   sources.append(line);
  }
  details.append(sources);
  grid.append(details);
 }
 root.replaceChildren(heading,grid);
}
const skillImg=path=>{
 if(typeof path!=='string'||!/^assets\/images\/skills7\/[a-zA-Z0-9_-]+\.webp$/.test(path))return null;
 const img=n('img');img.className='hero-skill-icon';img.alt='';
 img.loading='lazy';img.decoding='async';img.src=new URL('../../'+path,import.meta.url).href;
 return img;
};
function skillTile(root,{title,kicker,description,iconPath,details=[],active=true,id}){
 const card=n('details',undefined,'hero-skill-tile');
 if(id)card.dataset.skillId=id;
 card.dataset.active=String(active);
 const summary=n('summary',undefined,'hero-skill-tile-heading');
 const image=skillImg(iconPath);
 if(image)summary.append(image);
 else summary.append(n('span','✦','hero-skill-monogram'));
 const text=n('span',undefined,'hero-skill-title');
 text.append(n('small',kicker),n('strong',title));
 summary.append(text,n('span','⌄','hero-skill-chevron'));
 const body=n('div',undefined,'hero-skill-tile-body');
 if(description)body.append(n('p',description));
 for(const value of details.filter(Boolean))body.append(n('p',value,'hero-skill-meta'));
 card.append(summary,body);root.append(card);
 return card;
}
function skillDetails(skill){
 return [
  skill.dmgMultiplier
   ? 'Sát thương: '+number(skill.dmgMultiplier*100)+'% '+(skill.type==='magical'?'nội công':'ngoại công')
   : 'Không gây sát thương trực tiếp',
  skill.energyGain!==undefined?'Nhận nộ: '+number(skill.energyGain):'',
  skill.energyCost!==undefined?'Tiêu hao nộ: '+number(skill.energyCost):'',
  (skill.effects??[]).length?'Hiệu ứng: '+skill.effects.map(effectDescription).join('; '):''
 ];
}
export function renderHeroReadout({hero,build,setsRoot,skillsRoot}){
 // Display-only: preserve save schema, combat calculations, images and animation.
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
 skillsRoot.replaceChildren();
 const equippedHeading=n('div',undefined,'hero-skill-section-heading');
 equippedHeading.append(n('h3','Võ công đang dùng'),n('p','Chạm vào hình hoặc tên để đọc chi tiết.'));
 const equippedGrid=n('div',undefined,'hero-compact-skill-grid');
 for(const [key,kind] of [['autoAttack','Đánh thường'],['ultimate','Tuyệt kỹ']]){
  const skill=hero.skills?.[key];if(!skill)continue;
  skillTile(equippedGrid,{id:key,title:skill.name,kicker:kind,iconPath:skill.icon,
   description:skill.description,details:skillDetails(skill)});
 }
 skillsRoot.append(equippedHeading,equippedGrid);
 const passiveHeading=n('h3','Nội tại môn phái');
 const passiveGrid=n('div',undefined,'hero-compact-skill-grid hero-passive-grid');
 const innate=SECTS[build.sect]?.passive;
 if(innate)skillTile(passiveGrid,{id:innate.id,title:innate.name,kicker:'Nội tại đặc trưng',
  description:innate.description,details:['Tự động phát động theo cơ chế môn phái.']});
 for(const passive of SECT_PASSIVES[build.sect]??[]){
  const active=build.level>=passive.level;
  skillTile(passiveGrid,{id:'passive-'+passive.level,title:passive.name,
   kicker:(active?'✓ Đã mở':'○ Cấp '+passive.level+' · Chưa mở'),
   description:passive.description,details:[active?'Đã cộng vào chỉ số chiến đấu.':'Mở ở cấp '+passive.level+'.'],
   active});
 }
 if(passiveGrid.childElementCount)skillsRoot.append(passiveHeading,passiveGrid);
 const learned=build.allocatedSkills??[];
 const drawer=n('details',undefined,'hero-learned-drawer');
 drawer.dataset.learnedSkills=String(learned.length);
 drawer.append(n('summary','Võ công đã học · '+learned.length+' chiêu (chạm để xem)'));
 const grid=n('div',undefined,'hero-compact-skill-grid hero-learned-grid');
 if(!learned.length)grid.append(n('p','Chưa học nút võ công nào.','hint'));
 for(const id of learned){
  const node=SKILLS_BY_ID[id];if(!node)continue;
  const meta=[Object.keys(node.stats??{}).length?'Chỉ số: '+statList(node.stats):'',
   node.ultimate?'Tuyệt kỹ đã học: '+node.ultimate.name+'. Tuyệt kỹ học sau cùng được sử dụng.':''];
  skillTile(grid,{id:node.id,title:node.name,kicker:'Tầng '+node.tier+' · '+({attack:'Sát lực',guard:'Phòng thủ',balanced:'Cân bằng'})[node.branch],
   iconPath:node.icon,description:node.description,details:meta});
 }
 drawer.append(grid);skillsRoot.append(drawer);
}
