import {SECTS} from './SectsData.js';
export const ENROLLMENT_QUEST='D02H10';
export const currentStory=s=>s?.storyProgress?.storyRevision===4;
export const hasEnrollment=s=>!currentStory(s)||s.storyProgress.completedQuests.includes(ENROLLMENT_QUEST);
export const sectReady=s=>Boolean(s?.hero?.sect)&&hasEnrollment(s);
export function storyHeroBuild(s){
 if(!currentStory(s)||hasEnrollment(s))return s.hero;
 // Older saves may already contain a build. Preserve it on disk, but the opening remains untrained.
 return {...s.hero,sect:null,allocatedSkills:[],freeSkillPoints:s.hero.level,equippedGear:{weapon:null,armor:null,accessory:null,helmet:null}};
}
export function heroAppearance(s,quest){
 if(!currentStory(s))return s?.hero?.sect??'VoDang';
 const q=quest??{chapter:s.storyProgress.currentChapter,episode:s.storyProgress.currentEpisode};
 const c=q.chapter??1,e=q.episode??1,home=s.storyProgress.decisions.D19H18==='home';
 let stage=c===1&&e===1?'modern':c<2||(c===2&&e<=10)?'traveler':c>=19?'peace':c>=16||(c===15&&e===20)?'commander':c>=14?'grief':s.hero.sect??'traveler';
 if(home&&(c===20||c===19&&e===20))stage='modern';
 return {id:'hero',characterId:'hero_'+stage,sect:hasEnrollment(s)?s.hero.sect:null,portrait:`assets/images/hero/${stage}.webp`,storyStage:stage};
}
export function heroSectLabel(s){return sectReady(s)?SECTS[s.hero.sect]?.name??'Hiệp khách':'Chưa nhập môn';}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function heroText(text,s){
 if(!currentStory(s)||!s.hero?.name||typeof text!=='string')return text;
 const name=s.hero.name;
 // Protect a name already substituted (including a player's name containing "Phong").
 const preserved=['Truy Phong','Phong Trần Lãng Khách'];
 const aliases=[...new Set([name,...preserved,'Trần Phong','Phong'])].sort((a,b)=>b.length-a.length).map(escape).join('|');
 const pattern=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${aliases})(?![\\p{L}\\p{N}_]| Nha)`,'gu');
 return text.replace(pattern,matched=>preserved.includes(matched)?matched:name);
}
export function heroLines(lines,s){
 if(!currentStory(s)||!s.hero?.name)return lines;
 return lines.map(([speaker,text,actor])=>actor==='hero'||speaker==='Trần Phong'?[s.hero.name,heroText(text,s),'hero']:[speaker,heroText(text,s)]);
}
export function personalizeStory(value,s){
 if(typeof value==='string')return heroText(value,s);
 if(Array.isArray(value))return value[0]==='Trần Phong'||value[2]==='hero'?heroLines([value],s)[0]:value.map(v=>personalizeStory(v,s));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,personalizeStory(v,s)]));
 return value;
}
