import {COMPANIONS_BY_ID} from '../data/CompanionsData.js';
import {storyPerson,isDaiViet} from '../data/DaiVietCast.js';
import {acquisitionText7} from '../data/Recruitment7.js';
import {Companion} from '../entities/Companion.js';
import {fighterKey,fighterURL} from '../data/PresentationData.js';
import {ELEMENTS} from '../data/StrategyData.js';
import {NPC_KITS7} from '../data/NPCKits7.js';
import {STORY_ACTORS7} from '../data/StoryActors7.js';
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
export function appendDossier7(root,unit,session){
 const base=unit.canon==='dai-viet'&&unit.storyActorId&&!unit.storyActorId.startsWith('companion_')?null:COMPANIONS_BY_ID[unit.templateId??unit.id],person=base?storyPerson(session,base):unit;
 const section=node('section',undefined,'dossier7');let preview;
 const key=fighterKey(unit)??(base?base.id:null);
 const canFight=Boolean(unit.skills||base||NPC_KITS7[unit.assetId??unit.characterId??unit.id]||STORY_ACTORS7[unit.id]?.template);
 const poses=canFight?[['Đứng',0,0],['Chạy',50,0],['Đánh thường',100,0],['Tuyệt kỹ',0,100],['Trúng đòn',50,100],['Gục',100,100]]:[['Đứng',0,0],['Bước đi',50,0],['Trò chuyện',100,0],['Giúp đỡ',0,100],['Ngạc nhiên',50,100],['Nghỉ ngơi',100,100]];
 if(key){const model=node('div',undefined,'model-preview7');model.setAttribute('role','img');model.setAttribute('aria-label','Mô hình '+unit.name);model.style.backgroundImage=`url("${fighterURL(key)}")`;const controls=node('div',undefined,'model-controls7');for(const[label,x,y]of poses){const b=node('button',label);b.type='button';b.onclick=()=>{model.style.backgroundPosition=x+'% '+y+'%';model.dataset.pose=label;};controls.append(b);}preview=node('details',undefined,'model-preview-panel7');preview.append(node('summary','Mô hình chuyển động · 6 tư thế'),model,controls);}
 if(base){section.append(node('p',person.biography,'dossier-bio7'));if(isDaiViet(session))section.append(node('p','Nguồn sở hữu: '+acquisitionText7(base.id),'hint'));}
 if(unit.id==='hero'&&isDaiViet(session))section.append(node('p','Một diễn viên đóng thế lạc đến Đại Việt sau tai nạn trường quay. Học võ để tự bảo vệ mình, rồi tìm hiểu đường lương bị chặn và tìm lối trở về.','dossier-bio7'));
 const stats=unit.stats??(base?new Companion(base.id,{level:session.hero.level}).stats:null);
 if(stats){section.append(node('h3','Chỉ số · cấp '+(unit.level??session.hero.level)),node('p',[['HP','maxHp'],['Ngoại công','physicalAtk'],['Nội công','magicalAtk'],['Ngoại phòng','physicalDef'],['Nội phòng','magicalDef'],['Tốc đánh','attackSpeed'],['Tầm đánh','attackRange']].filter(([,k])=>Number.isFinite(stats[k])).map(([label,k])=>label+' '+Number(stats[k].toFixed(2))).join(' · ')));}
 const element=unit.element??base?.element;
 if(element&&ELEMENTS[element]){const vulnerable=Object.entries(ELEMENTS).find(([,v])=>v.beats===element)?.[0];section.append(node('p',`Khắc ${ELEMENTS[ELEMENTS[element].beats].name}: +75% sát thương. Gặp ${ELEMENTS[vulnerable].name}: −40%. Mục tiêu khác, hồi máu và khiên giữ nguyên.`, 'counter-guide7'));}
 const skills=unit.skills??base?.skills;
 if(skills)for(const[key,label]of [['autoAttack','Chiêu thường'],['ultimate','Tuyệt kỹ']]){const skill=skills[key];if(!skill)continue;const card=node('article',undefined,'skill-detail7');if(skill.icon){const im=node('img');im.className='skill-art7';im.src=new URL('../../'+skill.icon,import.meta.url).href;im.alt=skill.name;im.loading='lazy';card.append(im);}card.append(node('h3',label+' · '+skill.name),node('p',skill.description??'Chiêu cơ bản của nhân vật.'));section.append(card);}
 if(preview)section.append(preview);
 if(unit.inCombat){const details=node('details',undefined,'combat-dossier7');details.append(node('summary','Tiểu sử, chỉ số và hình kỹ năng'),section);root.append(details);}else root.append(section);
}
