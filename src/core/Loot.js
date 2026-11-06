import {GEAR_RARITIES,GEAR_DRAW,NEW_GEAR,STORY_GEAR} from '../data/GearCatalog.js';
import {sectReady} from '../data/HeroIdentity.js';
import {pay,give} from './WorldProgress.js';
import {useEntry} from './DungeonEntries.js';
import {seededRandom} from '../combat/CombatMath.js';
const fail=t=>{throw Error(t);},integer=n=>Number.isSafeInteger(n)&&n>=0;
export const freshLoot=()=>({version:1,total:0,sinceExcellent:0,sinceExceptional:0,history:[],bossWins:{}});
export function validateLoot(l){
 if(!l||l.version!==1||![l.total,l.sinceExcellent,l.sinceExceptional].every(integer)||l.sinceExcellent>=10||l.sinceExceptional>=50||l.sinceExcellent>l.sinceExceptional||l.sinceExceptional>l.total||!Array.isArray(l.history)||l.history.length!==Math.min(l.total,40)||!l.bossWins||Object.getPrototypeOf(l.bossWins)!==Object.prototype)fail('Tiến trình trang bị không hợp lệ.');
 for(const[k,n]of Object.entries(l.bossWins))if(!/^([1-9]|1[0-9]|20)$/.test(k)||!integer(n)||n<1)fail('Lượt boss không hợp lệ.');
 l.history.forEach((r,i)=>{const item=NEW_GEAR.find(e=>e.id===r?.id);if(!r||r.pull!==l.total-l.history.length+i+1||!item||!integer(r.time)||!['none','excellent','exceptional'].includes(r.guarantee)||r.guarantee==='excellent'&&item.tier<3||r.guarantee==='exceptional'&&item.tier!==4)fail('Lịch sử vòng quay trang bị không hợp lệ.');});
}
const secureRandom=()=>{if(!globalThis.crypto?.getRandomValues)fail('Thiết bị chưa hỗ trợ quay an toàn.');return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;};
export function drawEquipment(session,count,{random=secureRandom,now=Date.now()}={}){
 if(![1,5].includes(count)||!sectReady(session))fail('Nhập môn trước khi quay trang bị; chọn 1 hoặc 5 lượt.');
 if(session.storyProgress.pendingEncounter)fail('Kết thúc trận đang chờ trước khi quay trang bị.');
 const s=structuredClone(session);s.loot??=freshLoot();validateLoot(s.loot);const price=count===5?GEAR_DRAW.tenCost:GEAR_DRAW.singleCost;pay(s,'silver',price);
 const roll=()=>{const n=random();if(!Number.isFinite(n)||n<0||n>=1)fail('Kết quả quay không hợp lệ.');return n;},results=[];
 for(let i=0;i<count;i++){
  const l=s.loot;let n=roll()*100,rank=4;
  for(const r of GEAR_RARITIES){n-=r.rate;if(n<0){rank=r.rank;break;}}
  const guarantee=l.sinceExceptional===49?'exceptional':l.sinceExcellent===9?'excellent':'none';
  if(guarantee==='exceptional')rank=4;else if(guarantee==='excellent')rank=Math.max(3,rank);
  const pool=NEW_GEAR.filter(e=>e.tier===rank),item=pool[Math.floor(roll()*pool.length)];give(s,item.id,1);l.total++;l.sinceExcellent=rank>=3?0:l.sinceExcellent+1;l.sinceExceptional=rank===4?0:l.sinceExceptional+1;
  const row={pull:l.total,id:item.id,time:Math.max(0,Math.floor(now)),guarantee};l.history.push(row);if(l.history.length>40)l.history.shift();results.push(row);
 }
 validateLoot(s.loot);return{session:s,results,price};
}
export const chapterBossAvailable=(s,c)=>s.storyProgress.storyRevision===4&&sectReady(s)&&Number.isInteger(c)&&c>=1&&c<=20&&s.storyProgress.completedQuests.includes(`D${String(c).padStart(2,'0')}H20`);
export function chapterBossRewards(s,c){const factor=Math.max(.1,1-Math.max(0,s.hero.level-Math.min(20,c+1)-2)*.1);return{xp:Math.max(1,Math.round((20+c*8)*factor)),silver:Math.max(1,Math.round((12+c*3)*factor))};}
export function bossLoot(s,chapter,seed,{story=false}={}){
 s.loot??=freshLoot();const random=seededRandom((seed^0x78a91b3)>>>0),first=!s.loot.bossWins[chapter];s.loot.bossWins[chapter]=(s.loot.bossWins[chapter]??0)+1;
 const drops=[];
 if(first||story||random()<.35){const floor=chapter>=15?2:1,ceiling=chapter<=4?2:chapter<=10?3:4,rank=first?Math.min(4,Math.max(2,Math.ceil(chapter/6))):Math.min(ceiling,random()<.03?4:random()<.20?3:random()<.55?2:floor),pool=NEW_GEAR.filter(e=>e.tier===rank),item=pool[Math.floor(random()*pool.length)];give(s,item.id,1);drops.push(item.id);}
 return drops;
}
export function storyEquipment(s,q,seed){
 const drops=[];if(q.canon!=='dai-viet')return drops;
 if(STORY_GEAR[q.id]){give(s,STORY_GEAR[q.id],1);drops.push(STORY_GEAR[q.id]);}
 if(q.boss&&q.encounter)drops.push(...bossLoot(s,q.chapter,seed,{story:true}));
 return drops;
}
export const lootMethods={
 drawEquipment(count){this._guard();const r=drawEquipment(this.snapshot(),count,{now:this.now()});this._commit(r.session,'gear-draw');return r;},
 startChapterBoss(chapter){this._guard();if(!chapterBossAvailable(this.session,chapter))fail('Hoàn thành chương này trước khi nhận thử thách boss.');this._mutate(s=>{if(s.storyProgress.pendingEncounter||s.adventure.dungeon)fail('Hãy kết thúc hành trình đang chờ.');useEntry(s,'boss_'+chapter);this._pending(s,'chapterBoss',String(chapter));},'encounter');return this.retryEncounter();}
};
