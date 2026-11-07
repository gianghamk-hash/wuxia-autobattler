import {test,expect} from './fixtures.js';
async function start(page){await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Trần Phong');await page.locator('#btn-new-game').click();await page.evaluate(()=>window.__game.engine.stop());}
async function read(page){for(let i=0;i<30&&await page.locator('#dialogue-next').isEnabled();i++)await page.locator('#dialogue-next').click();await expect(page.locator('#dialogue-next')).toBeDisabled();}
async function at(page,id,route='stay',romance='friends'){
 await page.evaluate(async({id,route,romance})=>{
  const {createCampaign}=await import('/src/core/Campaign.js'),{DAI_VIET_QUESTS}=await import('/src/data/DaiVietStoryData.js'),{PLOT_UNLOCKS}=await import('/src/data/DaiVietCast.js'),{createHeroBuild}=await import('/src/entities/HeroBuild.js');
  const s=createCampaign({story:'dai-viet',sect:'VoDang'}),i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i);s.hero=createHeroBuild({sect:'VoDang',name:'Trần Phong',level:20});
  s.storyProgress.completedQuests=done.map(q=>q.id);for(const past of done)if(past.aftermath)s.journey.reader.positions['aftermath:'+past.id]=past.aftermath.length-1;s.storyProgress.decisions=Object.fromEntries(done.filter(q=>!q.ending).map(q=>[q.id,q.id==='D19H12'?romance:q.id==='D19H18'?route:q.choices[0].id]));
  Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});
  for(const [cid,milestone]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(milestone)){s.party.unlocked.push(cid);s.party.active.push(cid);s.companionsAffinity[cid]=100;s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
  s.party.formation=Object.fromEntries(['hero',...s.party.active].map((cid,n)=>[cid,[{x:2,y:1},{x:1,y:0},{x:0,y:2},{x:2,y:0},{x:1,y:2},{x:0,y:0}][n]]));
  const a=window.__game;a.model.load(s);a.engine.stop();a.setView('camp');
 },{id,route,romance});
}
test('continuous reading keeps the next episode open, ignores detached choices, and renders the narrator image',async({page},info)=>{
 await page.setViewportSize({width:390,height:900});await start(page);await page.locator('#btn-main-quest').click();
 await expect(page.locator('#dialogue-speaker')).toHaveText('Người kể');
 expect(await page.locator('.classic-portrait').evaluate(async e=>{const src=getComputedStyle(e).backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1];const im=new Image();im.src=src;await im.decode();return[im.naturalWidth,im.naturalHeight];})).toEqual([480,720]);
 await page.screenshot({path:info.outputPath('narrator-mobile.png'),animations:'disabled'});
 for(let i=1;i<=5;i++){
  await read(page);await page.evaluate(()=>window.__oldStoryChoice=document.querySelector('[data-choice="continue"]'));
  await page.locator('[data-choice="continue"]').click();
  if(await page.evaluate(()=>window.__game.model.running)){await page.evaluate(()=>{const a=window.__game;a.engine.stop();for(let n=0;n<22500&&a.model.running;n++)a.model.update(1/60);});await page.locator('#btn-story-next').click();await read(page);await page.locator('[data-choice="continue"]').click();}
  await expect(page.locator('#view-dialogue')).toBeVisible();
  const expected='D01H0'+(i+1);expect(await page.evaluate(()=>window.__game.model.mainQuest().id)).toBe(expected);
  await page.evaluate(()=>window.__oldStoryChoice.click());expect(await page.evaluate(()=>window.__game.model.mainQuest().id)).toBe(expected);
 }
 await expect(page.locator('.classic-title')).toContainText('Một đòn không giải quyết hết');

});

test('victory opens aftermath, reload resumes it, and continuation grants no duplicate reward',async({page})=>{
 await start(page);await at(page,'D01H06');await page.locator('#btn-main-quest').click();await read(page);await page.locator('[data-choice="continue"]').click();
 await page.evaluate(()=>{const a=window.__game;a.engine.stop();for(let i=0;i<22500&&a.model.running;i++)a.model.update(1/60);});
 await expect(page.locator('#btn-story-next')).toBeVisible();const paid=await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory));
 await page.locator('#btn-story-next').click();await expect(page.locator('.classic-title')).toContainText('Sau trận');
 await expect.poll(()=>page.evaluate(async()=>{const{StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{return(await m.load(0))?.data.journey.reader.positions['aftermath:D01H06'];}finally{m.db?.close();}})).toBe(0);
 await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();await page.locator('#btn-main-quest').click();
 await expect(page.locator('.classic-title')).toContainText('Sau trận');await expect(page.locator('#dialogue-speaker')).toHaveText('Người kể');
 await read(page);await page.locator('[data-choice="continue"]').click();await expect(page.locator('.classic-title')).toContainText('Vết bầm dưới áo');
 expect(await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory))).toBe(paid);
});

test('retreat leaves the current fight uncompleted and never exposes a victory aftermath',async({page})=>{
 await start(page);await at(page,'D01H06');await page.locator('#btn-main-quest').click();await read(page);await page.locator('[data-choice="continue"]').click();
 await page.evaluate(()=>{window.__game.engine.stop();window.__game.model.retreat();});
 await expect(page.locator('#btn-story-next')).toBeHidden();
 expect(await page.evaluate(()=>window.__game.model.mainQuest().id)).toBe('D01H06');
 await page.locator('#btn-battle-camp').click();await page.locator('#btn-main-quest').click();await expect(page.locator('.classic-title')).not.toContainText('Sau trận');
 expect(await page.evaluate(()=>window.__game.model.session.storyProgress.completedQuests.includes('D01H06'))).toBe(false);
});

test('new training uses a real twelve-second hold without enemy reinforcements',async({page})=>{
 await start(page);await at(page,'D02H02');await page.locator('#btn-main-quest').click();await read(page);await page.locator('[data-choice="continue"]').click();
 const result=await page.evaluate(()=>{const a=window.__game;a.engine.stop();const b=a.model.battle;for(let i=0;i<300&&a.model.running;i++)a.model.update(1/60);const midway={running:a.model.running,elapsed:b.elapsed,waves:b.mission.waves.size};for(let i=0;i<500&&a.model.running;i++)a.model.update(1/60);return{midway,winner:a.model.lastResult.winner,duration:a.model.lastResult.duration,waves:b.mission.waves.size,mission:b.mission.summary().title};});
 expect(result.midway.running).toBe(true);expect(result.midway.elapsed).toBeCloseTo(5,1);expect(result.midway.waves).toBe(0);expect(result.winner).toBe('home');expect(result.duration).toBeGreaterThanOrEqual(12);expect(result.waves).toBe(0);expect(result.mission).toContain('Đối luyện');
});
for(const width of [320,390,1280])test('default 400-episode story has readable classic dialogue and real player art at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
 await expect(page.locator('#chapter-progress')).toHaveText('0/400 hồi');await expect(page.locator('#campaign-label')).toContainText('Đại Việt Kỳ Hiệp');
 await page.locator('#btn-main-quest').click();await expect(page.locator('.classic-title')).toContainText('Một lần diễn nữa');
 for(let i=0;i<12&&await page.locator('#dialogue-speaker').textContent()!=='Trần Phong';i++)await page.locator('#dialogue-next').click();
 await expect(page.locator('#dialogue-speaker')).toHaveText('Trần Phong');await expect(page.locator('.classic-portrait')).toHaveClass(/portrait/);expect(await page.locator('.classic-portrait').evaluate(e=>getComputedStyle(e).backgroundImage)).toContain('url(');
 const before=await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory));await page.screenshot({path:info.outputPath('new-story-'+width+'.png'),animations:'disabled'});await read(page);
 expect(await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory))).toBe(before);await page.locator('[data-choice="continue"]').click();await expect(page.locator('#chapter-progress')).toHaveText('1/400 hồi');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('new unarmed opening battle checkpoints reload with the same seed and randomized enemy count',async({page})=>{
 await start(page);await at(page,'D01H06');await page.evaluate(()=>{const a=window.__game;a.model.chooseMain('continue');a.enterBattle();document.querySelector('#prebattle-dialog [data-start-battle]')?.click();a.engine.stop();});
 const pending=await page.evaluate(()=>window.__game.model.session.storyProgress.pendingEncounter);await expect(page.locator('#view-battle')).toBeVisible();
 const count=await page.evaluate(()=>window.__game.model.battle.units.filter(u=>u.team==='enemy').length);expect(count).toBeGreaterThanOrEqual(4);expect(count).toBeLessThanOrEqual(8);
 await expect.poll(()=>page.evaluate(async()=>{const {StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{return(await m.load(0))?.data.storyProgress.pendingEncounter?.seed;}finally{m.db?.close();}})).toBe(pending.seed);
 await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();await page.locator('#btn-resume-battle').click();await page.evaluate(()=>window.__game.engine.stop());
 expect(await page.evaluate(()=>window.__game.model.battle.seed)).toBe(pending.seed);expect(await page.evaluate(()=>window.__game.model.battle.units.filter(u=>u.team==='enemy').length)).toBe(count);expect(await page.evaluate(()=>window.__game.model.battle.units.find(u=>u.id==='hero').skills.autoAttack.name)).toBe('Quyền Cơ Bản');
});
test('canonical names agree in formation, collection, codex, unit sheet and companion conversations',async({page},info)=>{
 await start(page);await at(page,'D19H12');await page.locator('.main-nav [data-view="roster"]').click();await expect(page.locator('.formation-units')).toContainText('Mai Tước');await expect(page.locator('.formation-units')).toContainText('Lôi Nam');
 await page.locator('#roster-tab-companions').click();await page.getByLabel('Tìm tên đồng hành').fill('Mai Tuoc');await expect(page.locator('#roster-list .roster-card:visible')).toHaveCount(1);await expect(page.locator('#roster-list')).toContainText('Mai Tước');
 await page.locator('#roster-list').getByRole('button',{name:'Xem tướng',exact:true}).first().click();await expect(page.locator('#unit-sheet')).toContainText('Mai Tước');await expect(page.locator('#unit-sheet')).not.toContainText('undefined');await page.locator('[data-close-sheet="unit-sheet"]').click();
 await page.evaluate(()=>window.__game.setView('codex'));await page.locator('#catalog-search').fill('Loi Nam');await expect(page.locator('#catalog-results')).toContainText('Lôi Nam');await expect(page.locator('#catalog-results')).not.toContainText('Lão Tam');
 await page.evaluate(()=>window.__game.setView('tavern'));await page.locator('#world-tabs').getByRole('button',{name:'Đồng hành',exact:true}).click();await expect(page.locator('#world-root')).toContainText('Lôi Nam');await expect(page.locator('#world-root')).not.toContainText('Lão Tam');await page.screenshot({path:info.outputPath('canonical-companions.png'),fullPage:true,animations:'disabled'});
});
test('casebook and twenty-chapter archive expose only completed sources and replay is read-only',async({page})=>{
 await start(page);await at(page,'D07H14');await page.locator('#btn-casebook').click();await expect(page.locator('#world-root')).toContainText('Sổ đầu mối');await expect(page.locator('#world-root')).not.toContainText('Năm cửa mất người giữ');
 await page.getByLabel('Tìm trong sổ đầu mối').fill('đèn');const before=await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory));await page.locator('#world-root').getByRole('button',{name:/Xem lại nguồn/}).first().click();await read(page);expect(await page.locator('.dialogue-choices button').count()).toBe(0);expect(await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory))).toBe(before);
 await page.evaluate(()=>window.__game.setView('tavern'));await page.locator('#world-tabs').getByRole('button',{name:'Truyện ký',exact:true}).click();await expect(page.locator('.story-chapters button')).toHaveCount(20);await expect(page.locator('.story-chapters button').last()).toBeDisabled();
});
test('home choice survives reload and reads a different epilogue with only its valid ending',async({page},info)=>{
 await page.setViewportSize({width:390,height:900});await start(page);await at(page,'D19H18');await page.locator('#btn-main-quest').click();await read(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-choice="home"]').click();await expect(page.locator('#campaign-label')).toContainText('Nhánh trở về');
 for(let i=0;i<2;i++){await read(page);await page.locator('[data-choice="continue"]').click();if(await page.evaluate(()=>window.__game.model.running)){await page.evaluate(()=>{const a=window.__game;a.engine.stop();for(let n=0;n<22500&&a.model.running;n++)a.model.update(1/60);});await page.locator('#btn-story-next').click();await read(page);await page.locator('[data-choice="continue"]').click();}}
 await expect(page.locator('.classic-title')).toContainText('Tiếng gọi không phát từ chiếc máy');await read(page);await page.screenshot({path:info.outputPath('home-epilogue.png'),animations:'disabled'});
 await page.locator('[data-choice="continue"]').click();await expect.poll(()=>page.evaluate(async()=>{const{StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{return(await m.load(0))?.data.storyProgress.activeQuestId;}finally{m.db?.close();}})).toBe('D20H02');
 await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();await page.locator('#btn-main-quest').click();await expect(page.locator('.classic-title')).toContainText('Mẹ đứng ở cửa');
 await at(page,'D20H20','home');await page.locator('#btn-main-quest').click();await read(page);await expect(page.locator('[data-choice="home"]')).toBeEnabled();await expect(page.locator('[data-choice="actor"]')).toBeDisabled();await page.locator('[data-choice="home"]').click();await expect(page.locator('#ending-title')).toContainText('hai mái nhà');await expect(page.locator('#ending-story')).not.toContainText('phong hậu');
});
test('stay endings respect friendship choice and do not spend silver or assign Mai a marriage',async({page},info)=>{
 await page.setViewportSize({width:320,height:900});await start(page);await at(page,'D20H03','stay','friends');await page.locator('#btn-main-quest').click();await read(page);await expect(page.locator('#dialogue-text')).toContainText('tình bằng hữu');
 for(const id of ['actor','justice','retire']){await at(page,'D20H20','stay','friends');const silver=await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory));await page.locator('#btn-main-quest').click();await read(page);await expect(page.locator('[data-choice="home"]')).toBeDisabled();await page.locator('[data-choice="'+id+'"]').click();await expect(page.locator('#view-ending')).toBeVisible();expect(await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory))).toBe(silver);await expect(page.locator('#ending-story')).not.toContainText('phong hậu');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('stay-ending.png'),fullPage:true,animations:'disabled'});
});
