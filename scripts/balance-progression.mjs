import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {Campaign,createCampaign} from '../src/core/Campaign.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {PLOT_UNLOCKS} from '../src/data/DaiVietCast.js';
import {createHeroBuild,equipItem,allocateAttribute,allocateSkill} from '../src/entities/HeroBuild.js';
import {EQUIPMENT} from '../src/data/EquipmentData.js';
import {NEW_GEAR} from '../src/data/GearCatalog.js';
import {SKILL_TREES} from '../src/data/SkillTreeData.js';
const out=resolve(process.argv[2]??'reports/progression-4.3.json'),cases=['D03H12','D06H18','D09H19','D12H14','D15H19','D18H19'];
function fixture(id,mode,seed){
 const s=createCampaign({story:'dai-viet',sect:'VoDang'}),i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i),level=Math.min(20,q.chapter+(mode==='trained'?1:-1));
 s.hero=createHeroBuild({sect:'VoDang',name:'Trần Phong',level});s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,'continue']));Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act,attemptCounter:seed});
 s.party.unlocked=['companion_05','companion_03','companion_04','companion_06','companion_12'];s.party.active=[...s.party.unlocked];
 for(const[cid,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(cid);s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
 s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));s.party.formation=Object.fromEntries(['hero',...s.party.active].map((id,i)=>[id,[{x:1,y:1},{x:2,y:1},{x:0,y:1},{x:0,y:0},{x:1,y:2},{x:2,y:0}][i]]));
 const gear=['equipped','aligned'].includes(mode)?NEW_GEAR.filter(e=>e.setId===(mode==='aligned'?'thanh_tam':'phong_hanh')&&e.rarity==='excellent'):EQUIPMENT.filter(e=>e.sect==='VoDang');for(const e of gear)s.inventory.push({itemId:e.id,quantity:1});let h=s.hero;
 while(h.freeAttributePoints)h=allocateAttribute(h,'khiHai',s.inventory);for(const n of SKILL_TREES.VoDang.filter(n=>n.branch==='attack')){try{h=allocateSkill(h,n.id,s.inventory);}catch{}}
 for(const item of gear)h=equipItem(h,item.slot,item.id,s.inventory);s.hero=h;return s;
}
const rows=[];
for(const id of cases)for(const build of ['underlevel','trained','equipped','aligned'])for(let seed=0;seed<5;seed++)for(const rules of ['4.2','4.3']){
 const c=new Campaign();c.load(fixture(id,build,seed));c.chooseMain('continue');
 if(rules==='4.2')for(const u of c.battle.units.filter(u=>u.team==='enemy')){const q=c.mainQuest(),hp=q.boss?1.12:1.08,atk=q.boss?1.08:1.05;u.stats.maxHp/=hp;u.stats.hp=u.stats.maxHp;u.stats.physicalAtk/=atk;u.stats.magicalAtk/=atk;}
 for(let tick=0;tick<7500&&c.running;tick++)c.update(1/60);
 rows.push({id,build,seed,rules,winner:c.lastResult?.winner??'running',seconds:c.lastResult?.duration??c.battle.elapsed});
}
const summary=[];for(const build of ['underlevel','trained','equipped','aligned'])for(const rules of ['4.2','4.3']){const sample=rows.filter(r=>r.build===build&&r.rules===rules);summary.push({build,rules,matches:sample.length,wins:sample.filter(r=>r.winner==='home').length,draws:sample.filter(r=>!['home','enemy'].includes(r.winner)).length,meanSeconds:Math.round(sample.reduce((n,r)=>n+r.seconds,0)/sample.length*100)/100});}
const result={method:'240 paired seeded fights, six selected main encounters, one six-member VoDang build. Baseline reverses only the new HP/attack multipliers after construction; it is not a checkout of the full 4.2 release. Underlevel = chapter minus one with old rare school set; trained = chapter plus one with the same set; equipped = underlevel with an excellent Van Hanh hybrid three-piece set; aligned = underlevel with an excellent Thanh Tam magic three-piece set. Party identities, positions and seed are paired. Does not establish balance for every school, roster, formation or boss trial.',summary,rows};
await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(summary));
