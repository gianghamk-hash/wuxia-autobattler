import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {Campaign,createCampaign} from '../src/core/Campaign.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {PLOT_UNLOCKS} from '../src/data/DaiVietCast.js';
import {createHeroBuild,allocateAttribute,allocateSkill,equipItem,gainExperience} from '../src/entities/HeroBuild.js';
import {SKILL_TREES} from '../src/data/SkillTreeData.js';
import {EQUIPMENT} from '../src/data/EquipmentData.js';
const ids=['D03H12','D06H18','D09H19','D12H14','D15H19','D18H19'],sects=['ThieuLam','VoDang','CaiBang','NgaMi','DuongMon'],branches=['attack','balanced','guard'];
const rows=[],levels=[];
for(const id of ids){
 const i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i),xp=done.reduce((n,q)=>n+q.xp,0);
 const natural=gainExperience(createHeroBuild({sect:'VoDang'}),xp,[]);let oldLevel=1,remaining=xp;while(oldLevel<20&&remaining>=oldLevel*100){remaining-=oldLevel*100;oldLevel++;}levels.push({id,xp,oldLevel,newLevel:natural.level});
 for(const sect of sects)for(const branch of branches)for(const gearMode of ['schoolRare','alignedExcellent'])for(let seed=1;seed<=3;seed++)for(const rules of ['4.3','5.0']){
  const s=createCampaign({story:'dai-viet',sect}),hLevel=natural.level;
  s.hero=createHeroBuild({sect,level:hLevel});s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,q.id==='D19H12'?'friends':q.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act,attemptCounter:seed});
  s.party.unlocked=['companion_05','companion_03','companion_04','companion_06','companion_12'];s.party.active=[...s.party.unlocked];
  for(const[cid,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(cid);s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
  s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));s.party.formation=Object.fromEntries(['hero',...s.party.active].map((id,j)=>[id,[{x:1,y:1},{x:2,y:1},{x:0,y:1},{x:0,y:0},{x:1,y:2},{x:2,y:0}][j]]));
  const magic=['VoDang','NgaMi'].includes(sect),family=branch==='guard'?'thiet_ve':magic?'thanh_tam':'phong_hanh';
  const gear=EQUIPMENT.filter(e=>gearMode==='schoolRare'?e.sect===sect:e.setId===family&&e.rarity==='excellent');for(const item of gear)s.inventory.push({itemId:item.id,quantity:1});
  let h=s.hero;while(h.freeAttributePoints)h=allocateAttribute(h,branch==='guard'?'canCot':branch==='balanced'&&h.freeAttributePoints%2===0?'canCot':magic?'khiHai':'kinhLuc',s.inventory);
  for(const node of [...SKILL_TREES[sect].filter(n=>n.branch===branch),...SKILL_TREES[sect].filter(n=>n.branch!==branch&&n.tier<4)])try{h=allocateSkill(h,node.id,s.inventory);}catch{}
  for(const item of gear)h=equipItem(h,item.slot,item.id,s.inventory);s.hero=h;
  const c=new Campaign({now:()=>1720000000000});c.load(s);c.chooseMain('continue');if(rules==='4.3')for(const u of c.battle.units.filter(u=>u.team==='enemy')){u.stats.maxHp/=1+Math.max(0,q.chapter-7)*.009;u.stats.hp=u.stats.maxHp;u.stats.physicalAtk/=1+Math.max(0,q.chapter-7)*.006;u.stats.magicalAtk/=1+Math.max(0,q.chapter-7)*.006;}
  for(let t=0;t<7500&&c.running;t++)c.update(1/60);rows.push({id,sect,branch,gearMode,seed,rules,level:hLevel,winner:c.lastResult?.winner??'unfinished',seconds:c.lastResult?.duration??c.battle.elapsed});
 }
}
const summary=[];for(const gearMode of ['schoolRare','alignedExcellent'])for(const rules of ['4.3','5.0'])for(const stage of ['early','middle','late']){
 const sample=rows.filter(r=>r.gearMode===gearMode&&r.rules===rules&&(stage==='early'?Number(r.id.slice(1,3))<=6:stage==='middle'?Number(r.id.slice(1,3))>=9&&Number(r.id.slice(1,3))<=12:Number(r.id.slice(1,3))>=15));
 summary.push({gearMode,rules,stage,matches:sample.length,wins:sample.filter(r=>r.winner==='home').length,meanSeconds:+(sample.reduce((n,r)=>n+r.seconds,0)/sample.length).toFixed(2)});
}
const out=resolve(process.argv[2]??'reports/journey-5.0.json');await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify({method:'1080 seeded paired 6v6 main-story battles: five schools, three builds, two gear preparations, six encounters, three seeds, two enemy rulesets. Levels derive from total main-story XP earned before each encounter under the new curve. Baseline only reverses added 5.0 HP/attack scaling; it is not a full 4.3 checkout. No food, training, forging, manual ultimates or boss trials. Fixed legal five-companion roster. Does not prove every encounter or roster balanced.',levels,summary,rows},null,2));console.log(JSON.stringify({levels,summary}));
