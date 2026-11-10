import {test,expect} from './fixtures.js';
import {developed} from '../scripts/balance-campaign7.mjs';

async function ready(page){
 await page.goto('/');
 await expect(page.locator('#boot-status')).toBeHidden();
 await page.locator('#hero-name').fill('Thử thách duyên phận');
 await page.locator('#btn-new-game').click();
 const snapshot=developed().snapshot();
 const id=snapshot.party.active[0];
 snapshot.companionsAffinity[id]=100;
 snapshot.journey.companionJourneys.questEvidence={[id]:1};
 await page.evaluate(s=>{
  const app=window.__game;
  app.engine.stop();
  app.model.load(s);
  app.hasLoaded=true;
  app.setView('tavern');
 },snapshot);
 await page.locator('#world-tabs').getByRole('button',{name:'Quán & Rèn',exact:true}).click();
 await page.getByRole('button',{name:'Đồng hành',exact:true}).click();
 await page.locator('.companion-journeys > summary').click();
 return id;
}
async function lastPage(page){
 for(let i=0;i<15&&await page.locator('#dialogue-next').isEnabled();i++)
   await page.locator('#dialogue-next').click();
}

for(const width of [390,1280])test('sixty companion dossiers, meaningful choices and personal cutscene at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const id=await ready(page),card=page.locator('[data-companion-id="'+id+'"].companion-memory-card');
 await expect(page.locator('.companion-memory-card')).toHaveCount(60);
 await card.locator('summary').click();
 await expect(card.locator('.companion-memory-stage')).toHaveCount(4);
 await expect(card.locator('[data-milestone="50"]')).toContainText('Mục tiêu hoàn thành: 1/1 lần');
 await expect(card.locator('[data-milestone="75"]')).toContainText('đánh đổi');
 await card.locator('[data-milestone="75"] button').click();
 await lastPage(page);
 const choice='bond_'+id+'_mercy';
 await page.locator('.dialogue-choices [data-choice="'+choice+'"]').click();
 expect(await page.evaluate(x=>window.__game.model.session.journey.companionJourneys.crossroads[x],id)).toBe(choice);
 const battleResult=await page.evaluate(async x=>{
  const a=window.__game,{applyAffinityMilestones}=await import('/src/data/AffinityMilestones.js'),{applyCompanionCrossroad}=await import('/src/combat/CompanionBattleBranches.js'),{Companion}=await import('/src/entities/Companion.js'),{COMPANION_JOURNEY_DESIGNS}=await import('/src/data/CompanionJourneyDesigns.js');
  const u=applyAffinityMilestones(new Companion(x),75),before=structuredClone(u.stats);
  const selection=a.model.session.journey.companionJourneys.crossroads[x],definition=COMPANION_JOURNEY_DESIGNS[x].branch.choices.find(c=>c.id===selection);
  const previous={...before,preparedEnergy:u.preparedEnergy??0,preparedDamage:u.preparedDamage??1};
  applyCompanionCrossroad(u,selection);
  const after={...u.stats,preparedEnergy:u.preparedEnergy??0,preparedDamage:u.preparedDamage??1};
  return {active:u.crossroadApplied,path:u.crossroadPath,changed:Object.keys(definition.statChanges).filter(key=>Math.abs(after[key]-previous[key])>1e-8)};
 },id);
 expect(battleResult.active).toBe(true);
 expect(battleResult.path).toBe(choice);
 expect(battleResult.changed.length).toBe(2);
 await page.getByRole('button',{name:'Đồng hành',exact:true}).click();
 await page.locator('.companion-journeys > summary').click();
 const again=page.locator('[data-companion-id="'+id+'"].companion-memory-card');
 await again.locator('summary').click();
 await again.locator('[data-milestone="100"] button').click();
 await expect(page.locator('.companion-storyboard-scene')).toBeVisible();
 await expect(page.locator('.companion-storyboard-portrait')).toHaveCount(1);
 await expect(page.locator('.companion-storyboard-skip')).toBeVisible();
 await page.locator('.companion-storyboard-skip').click();
 await expect(page.locator('.companion-storyboard-scene')).toHaveAttribute('data-story-beat','skill');
 await page.getByRole('button',{name:'Về doanh trại'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
 await page.screenshot({path:info.outputPath('companion-sprint1-'+width+'.png'),fullPage:true,animations:'disabled'});
});
