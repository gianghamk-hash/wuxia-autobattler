import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {FIGHTERS,fighterKey,fighterURL,fighterUsesPortrait} from '../src/data/PresentationData.js';
import {NPCS,NPCS_BY_ID,applyStoryIdentity} from '../src/data/NPCData.js';
import {COMPANIONS} from '../src/data/CompanionsData.js';
import {DAI_VIET_CAST} from '../src/data/DaiVietCast.js';
import {Companion} from '../src/entities/Companion.js';
import {Hero} from '../src/entities/Hero.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {getSkillVisual} from '../src/data/SkillVisualsData.js';
import {fighterMotion} from '../src/ui/FighterMotion.js';

test('every classic NPC and canonical actor resolves a real asset; all have six-pose atlases',()=>{
 for(const p of [...NPCS,...DAI_VIET_CAST]){const unit={id:p.id,characterId:p.id};assert.ok(fighterKey(unit),p.id);assert.ok(existsSync(new URL(fighterURL(fighterKey(unit)))),p.id);}
 for(const id of FIGHTERS)assert.ok(existsSync(new URL(fighterURL(id))),id);
 assert.deepEqual(FIGHTERS.filter(fighterUsesPortrait),[]);
 assert.equal(fighterKey(new Hero(null)),'hero_traveler');
 assert.match(fighterURL('doi_truong'),/npc_son_quan/);
 assert.match(fighterURL('truong_xom'),/npc_dao_tinh/);
});

test('actual cast events for all companions, hero schools and NPC signatures resolve image effects',()=>{
 const units=[...COMPANIONS.map(c=>new Companion(c.id)),...[null,'ThieuLam','VoDang','CaiBang','NgaMi','DuongMon'].map(s=>new Hero(s))];
 for(const id of ['quan_chu','doi_truong','doc_le','kha_van','do_mau','trinh_nghiem','tay_sai']){const u=new Companion('companion_05');applyStoryIdentity(u,NPCS_BY_ID[id]);units.push(u);}
 for(const actor of units)for(const [key,skill]of Object.entries(actor.skills)){
  const grid=new GridSystem(),enemy=new Companion('companion_05',{id:'target',team:'enemy'});grid.place(actor,{x:2,y:1}, { formation: false });grid.place(enemy,{x:3,y:1}, { formation: false });enemy.stats.maxHp=enemy.stats.hp=100000;actor.stats.hp*=.5;
  const ally=new Hero('VoDang',{id:'ally'});grid.place(ally,{x:1,y:1}, { formation: false });ally.stats.hp*=.5;
  const events=[];const battle=new CombatEngine({units:[actor,ally,enemy],grid,seed:72,onEvent:e=>events.push(e)});battle.start();if(skill.targetType==='stunned_ally')battle.statuses.apply(ally,{type:'stun',duration:3,sourceId:enemy.id});const target=battle.chooseTarget(actor,skill,false);assert.ok(target,skill.id);battle.resolveSkill(actor,target,skill,key==='ultimate');
  const cast=events.find(e=>e.type==='skill:cast'&&e.actorId===actor.id);assert.ok(cast,skill.id);const profile=getSkillVisual(cast);assert.ok(profile?.image,skill.id);assert.ok(existsSync(profile.image),skill.id);
 }
});

test('live poses move over time, fallen stays still, and reduced motion suppresses every transform',()=>{
 for(let frame=0;frame<5;frame++){assert.notDeepEqual(fighterMotion(frame,.01),fighterMotion(frame,.17),String(frame));}
 assert.deepEqual(fighterMotion(5,0),fighterMotion(5,10));
 for(let frame=0;frame<6;frame++)assert.deepEqual(fighterMotion(frame,10,2,true),{x:0,y:0,rotation:0,scaleX:1,scaleY:1});
});
