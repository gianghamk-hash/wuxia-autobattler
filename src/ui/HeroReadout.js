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
 // Before enrollment, use the live untrained stats minus equipment and allocated bonuses;
 // avoid mislabeling those amounts as a sect passive.
 if(!SECTS[build.sect]){
  for(const [key,value] of Object.entries(hero.stats))
   baseline[key]=value-(attributes[key]??0)-(skills[key]??0)-(gear[key]??0)-(sets[key]??0);
 }
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

/* No dedicated passive portraits exist in the asset catalog. Draw an accurate
   sect-and-effect emblem instead of reusing the artwork of an unrelated skill. */
const PASSIVE_ART=Object.freeze({
 ThieuLam:[
  '<path d="M36 10 54 18v15q0 18-18 28Q18 51 18 33V18z"/><path d="M24 33h24M36 21v26"/>',
  '<path d="M19 53V32l5-4 4 4V19l6-3 4 3v12l4-5 5 4v19z"/><path d="M22 48h28"/>',
  '<circle cx="36" cy="35" r="18"/><path d="M36 18c11 9 11 26 0 35-11-9-11-26 0-35z"/><path d="M18 35h36"/>'
 ],
 VoDang:[
  '<circle cx="36" cy="36" r="23"/><path d="M36 13c-23 0-23 23 0 23s23 23 0 23"/><circle cx="36" cy="24" r="3"/><circle cx="36" cy="48" r="3"/>',
  '<path d="M18 47c10-20 28-27 38-18M16 36c10-17 26-20 40-10M19 54c12-7 26-3 35 4"/><circle cx="36" cy="37" r="6"/>',
  '<path d="M36 10 54 18v18q-3 15-18 25Q21 51 18 36V18z"/><path d="M25 35c8-10 14-10 22 0-8 10-14 10-22 0z"/>'
 ],
 CaiBang:[
  '<path d="M16 55 49 14M24 57l32-40M20 20l8 9M46 45l9 10"/><circle cx="34" cy="37" r="5"/>',
  '<path d="M18 48c7-15 16-20 20-12 6-8 13-5 17 8M18 48q19 14 37-4"/><path d="M26 24l8-9 8 10"/>',
  '<path d="M17 48c6-20 14-20 19-11 4-13 13-16 20-21M17 56q21-5 38-18"/><circle cx="49" cy="23" r="4"/>'
 ],
 NgaMi:[
  '<path d="M36 56q-21-11 0-32 21 21 0 32z"/><path d="M36 56q-32-2-20-23 22 0 20 23zM36 56q32-2 20-23-22 0-20 23z"/>',
  '<path d="M36 56V16M26 44l10 10 10-10"/><path d="M15 35q9-20 20 1M57 35q-9-20-20 1"/><circle cx="36" cy="22" r="7"/>',
  '<path d="M36 59 18 38q-6-13 6-17 8-2 12 8 4-10 12-8 12 4 6 17z"/><path d="M36 30v20M26 40h20"/>'
 ],
 DuongMon:[
  '<path d="M16 56 55 17M25 19l30-2-3 30M24 47l11 3 3 11"/><path d="M21 32q7 5 0 11-7-6 0-11z"/>',
  '<path d="m16 51 36-34m-20 1 20-1-1 20M18 34l29-13M27 45l29-13"/><path d="m49 13 10 1-1 10"/>',
  '<path d="M15 27q23-20 40 0-5 10-22 10-18 0-15 16 3 9 21 3M23 18q13-10 29-3"/><path d="M44 46q9-10 16-3"/>'
 ]
});
const PASSIVE_COLORS=Object.freeze({ThieuLam:'#e6bc71',VoDang:'#81cbdf',CaiBang:'#f0b777',NgaMi:'#f0a8c5',DuongMon:'#a4d597'});
function passiveEmblem(sect,level){
 const index=level===5?1:level===10?2:0;
 const drawing=PASSIVE_ART[sect]?.[index];if(!drawing)return null;
 const color=PASSIVE_COLORS[sect];
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">'
  +'<defs><radialGradient id="a"><stop stop-color="#345451"/><stop offset="1" stop-color="#0c2b2b"/></radialGradient></defs>'
  +'<rect width="72" height="72" rx="11" fill="url(#a)"/>'
  +'<circle cx="36" cy="36" r="29" fill="none" stroke="'+color+'" opacity=".3"/>'
  +'<g fill="none" stroke="'+color+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'
  +drawing+'</g></svg>';
 const img=n('img');img.className='hero-skill-icon';
 img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
 img.alt='';img.loading='lazy';img.decoding='async';
 return img;
}
function skillTile(root,{title,kicker,description,iconPath,passiveSect,passiveLevel,details=[],active=true,id}){
 const card=n('details',undefined,'hero-skill-tile');
 if(id)card.dataset.readoutSkillId=id;
 card.dataset.active=String(active);
 const summary=n('summary',undefined,'hero-skill-tile-heading');
 const image=skillImg(iconPath)??(passiveSect?passiveEmblem(passiveSect,passiveLevel):null);
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
 if(innate)skillTile(passiveGrid,{id:innate.id,title:innate.name,kicker:'Nội tại đặc trưng',passiveSect:build.sect,passiveLevel:0,
  description:innate.description,details:['Tự động phát động theo cơ chế môn phái.']});
 for(const passive of SECT_PASSIVES[build.sect]??[]){
  const active=build.level>=passive.level;
  skillTile(passiveGrid,{id:'passive-'+passive.level,title:passive.name,passiveSect:build.sect,passiveLevel:passive.level,
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
