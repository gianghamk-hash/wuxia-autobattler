import {test,expect} from '@playwright/test';
async function start(page,name='Phong An'){
 await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();
 await expect(page.locator('#sect-picker')).toBeHidden();await expect(page.locator('#hero-sect')).toBeHidden();
 await page.locator('#hero-name').fill(name);await page.locator('#btn-new-game').click();await page.evaluate(()=>window.__game.engine.stop());
}
async function read(page){for(let i=0;i<30&&await page.locator('#dialogue-next').isEnabled();i++)await page.locator('#dialogue-next').click();}
async function at(page,id,sect=null,route='stay'){
 await page.evaluate(async({id,sect,route})=>{
  const{createCampaign}=await import('/src/core/Campaign.js'),{DAI_VIET_QUESTS}=await import('/src/data/DaiVietStoryData.js'),{PLOT_UNLOCKS}=await import('/src/data/DaiVietCast.js'),s=createCampaign({story:'dai-viet',name:window.__game.model.session.hero.name,sect}),i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i);
  s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.filter(q=>!q.ending).map(q=>[q.id,q.id==='D19H18'?route:q.choices[0].id]));Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});
  for(const[cid,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(cid);s.companionsAffinity[cid]=15;s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
  window.__game.model.load(s);window.__game.engine.stop();window.__game.setView('camp');
 },{id,sect,route});
}
const art=async locator=>locator.evaluate(e=>getComputedStyle(e).backgroundImage);

for(const width of [320,1280])test('name-only start, own modern portrait and untrained journey at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});await start(page,'Minh An');
 await expect(page.locator('#hero-hud')).toContainText('Minh An');await expect(page.locator('#hero-hud')).toContainText('Chưa nhập môn');expect(await page.evaluate(()=>window.__game.model.session.hero.sect)).toBe(null);
 expect(await art(page.locator('#hero-hud .portrait'))).toContain('/hero/modern.webp');await expect(page.locator('#btn-practice')).toBeDisabled();
 await page.locator('#btn-main-quest').click();await page.locator('#dialogue-next').click();await expect(page.locator('#dialogue-speaker')).toHaveText('Minh An');expect(await art(page.locator('.classic-portrait'))).toContain('/hero/modern.webp');
 await expect(page.locator('#view-dialogue')).not.toContainText('Trần Phong');await read(page);await page.locator('[data-choice="continue"]').click();
 expect(await art(page.locator('#hero-hud .portrait'))).toContain('/hero/traveler.webp');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>document.getElementById('app-message').dataset.visible='false');await page.screenshot({path:info.outputPath('untrained-'+width+'.png'),animations:'disabled'});
});

test('all five enrollment choices appear in the story and unlock matching portraits and class skills',async({page},info)=>{
 await page.setViewportSize({width:390,height:900});await start(page);
 for(const sect of ['ThieuLam','VoDang','CaiBang','NgaMi','DuongMon']){
  await at(page,'D02H10');await page.locator('#btn-main-quest').click();await read(page);await expect(page.locator('.dialogue-choices button:visible')).toHaveCount(5);await expect(page.locator('#view-dialogue')).toContainText('Phong An');await expect(page.locator('#view-dialogue')).not.toContainText('Phong An An');
  if(sect==='VoDang'){
   await page.screenshot({path:info.outputPath('enrollment-mobile.png'),fullPage:true,animations:'disabled'});
   await expect.poll(()=>page.evaluate(async()=>{const{StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{const s=(await m.load(0))?.data;return[s?.hero.sect,s?.storyProgress.activeQuestId];}finally{m.db?.close();}})).toEqual([null,'D02H10']);
   await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();await page.locator('#btn-main-quest').click();await read(page);await expect(page.locator('.dialogue-choices button:visible')).toHaveCount(5);
  }
  await page.locator('[data-choice="'+sect+'"]').click();await expect(page.locator('.classic-title')).toContainText('Người mới đấu người mới');expect(await page.evaluate(()=>window.__game.model.session.hero.sect)).toBe(sect);
  expect(await art(page.locator('#hero-hud .portrait'))).toContain('/hero/'+sect+'.webp');
  await page.evaluate(()=>window.__game.setView('profile'));expect(await art(page.locator('#profile-hero .portrait'))).toContain('/hero/'+sect+'.webp');await expect(page.locator('#progress-sect')).toBeHidden();
  await page.evaluate(()=>window.__game.setView('camp'));await page.locator('#btn-main-quest').click();await read(page);await page.locator('[data-choice="continue"]').click();await page.evaluate(()=>window.__game.engine.stop());
  expect(await page.evaluate(()=>{const u=window.__game.model.battle.units[0];return[u.name,u.sect,u.skills.ultimate.energyCost===10000];})).toEqual(['Phong An',sect,false]);
  await page.evaluate(()=>window.__game.world.inspect(window.__game.model.battle.units[0]));expect(await art(page.locator('#unit-sheet .sheet-portrait'))).toContain('/hero/'+sect+'.webp');await expect(page.locator('#unit-sheet')).toContainText('Phong An');await page.locator('[data-close-sheet="unit-sheet"]').click();
  // Fixture creates the next branch; it never claims a second reward in the same journey.
 }
});

test('stage portraits update in the HUD, profile and formation, and all ten assets load',async({page},info)=>{
 await start(page,'Lâm Khải');
 const loaded=await page.evaluate(async()=>{const rows=await(await fetch('/assets/images/hero/manifest.json')).json();return Promise.all(rows.map(async row=>{const im=new Image();im.src='/'+row.asset;await im.decode();return[im.naturalWidth,im.naturalHeight];}));});expect(loaded).toEqual(Array.from({length:10},()=>[480,720]));
 for(const[id,stage,route]of [['D14H01','grief','stay'],['D16H01','commander','stay'],['D19H01','peace','stay'],['D20H01','modern','home']]){
  await at(page,id,'VoDang',route);expect(await art(page.locator('#hero-hud .portrait'))).toContain('/hero/'+stage+'.webp');await page.evaluate(()=>window.__game.setView('profile'));expect(await art(page.locator('#profile-hero .portrait'))).toContain('/hero/'+stage+'.webp');
  await page.evaluate(()=>window.__game.setView('roster'));expect(await art(page.locator('.formation-units button .portrait').first())).toContain('/hero/'+stage+'.webp');
 }
 await page.screenshot({path:info.outputPath('return-home.png'),animations:'disabled'});
});

test('a name shared with an NPC keeps the protagonist and NPC portraits separate, and survives save/reload',async({page})=>{
 await start(page,'Mai Tước');await page.locator('#btn-main-quest').click();await page.locator('#dialogue-next').click();expect(await art(page.locator('.classic-portrait'))).toContain('/hero/modern.webp');
 await expect.poll(()=>page.evaluate(async()=>{const{StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{return(await m.load(0))?.data.hero.name;}finally{m.db?.close();}})).toBe('Mai Tước');
 await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();expect(await page.evaluate(()=>window.__game.model.session.hero.sect)).toBe(null);await expect(page.locator('#hero-hud')).toContainText('Mai Tước');
 await at(page,'D05H15','VoDang');await page.locator('#btn-main-quest').click();for(let i=0;i<20&&!(await page.locator('#dialogue-speaker').textContent()==='Mai Tước'&&(await art(page.locator('.classic-portrait'))).includes('companion_08'));i++)await page.locator('#dialogue-next').click();expect(await art(page.locator('.classic-portrait'))).toContain('companions/companion_08.webp');
});
