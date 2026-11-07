import {test,expect} from './fixtures.js';
async function fresh(page){await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Hải An');await page.locator('#btn-new-game').click();await page.evaluate(()=>window.__game.engine.stop());}
async function fixture(page,id='D16H01'){
 await page.evaluate(async id=>{
  const a=window.__game,{createCampaign}=await import('/src/core/Campaign.js'),{DAI_VIET_QUESTS}=await import('/src/data/DaiVietStoryData.js'),{PLOT_UNLOCKS}=await import('/src/data/DaiVietCast.js'),{createHeroBuild}=await import('/src/entities/HeroBuild.js');
  const s=createCampaign({story:'dai-viet',name:'Hải An',sect:'VoDang'}),i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i);s.hero=createHeroBuild({name:'Hải An',sect:'VoDang',level:20});s.storyProgress.completedQuests=done.map(q=>q.id);for(const past of done)if(past.aftermath)s.journey.reader.positions['aftermath:'+past.id]=past.aftermath.length-1;s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,q.id==='D19H12'?'friends':q.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});s.inventory.find(i=>i.itemId==='silver').quantity=100000;
  for(const[cid,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(cid);s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));s.companionsAffinity[cid]=15;}
  for(const slot of ['weapon','armor','accessory']){const itemId=`gear_thanh_tam_exceptional_${slot}`;s.inventory.push({itemId,quantity:1});s.hero.equippedGear[slot]=itemId;}
  a.model.load(s);a.engine.stop();a.setView('camp');
 },id);
}
test('real six-song playlist decodes, keeps position across views, advances through every recording and pauses on mute',async({page})=>{
 await fresh(page);await page.locator('#btn-audio').click();
 await expect.poll(()=>page.evaluate(()=>window.__game.sound.music?.currentTime??0)).toBeGreaterThan(0);
 const result=await page.evaluate(async()=>{
  const a=window.__game,{MUSIC_PLAYLIST}=await import('/src/audio/MusicPlaylist.js'),recording=a.sound.music;await new Promise(resolve=>{if(recording.readyState>=1)resolve();else recording.addEventListener('loadedmetadata',resolve,{once:true});});
  recording.currentTime=8;const urls=[],durations=[];for(const view of ['roster','profile','settings','camp'])a.setView(view);
  const same=recording===a.sound.music&&recording.currentTime>=7;
  for(let i=0;i<6;i++){const response=await fetch(MUSIC_PLAYLIST[i].url),buffer=await a.sound.context.decodeAudioData(await response.arrayBuffer());urls.push(MUSIC_PLAYLIST[a.sound.musicIndex].url);durations.push(buffer.duration);recording.dispatchEvent(new Event('ended'));}
  return{same,urls,durations,index:a.sound.musicIndex,error:a.sound.musicError};
 });expect(result.same).toBe(true);expect(new Set(result.urls).size).toBe(6);expect(result.durations.every(d=>d>30)).toBe(true);expect(result.index).toBe(0);expect(result.error).toBeNull();
 await page.locator('#btn-audio').click();expect(await page.evaluate(()=>window.__game.sound.music.paused)).toBe(true);
});
for(const width of [320,390])test('portrait UI, synchronized hero art, all three builds and gear auras at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:844});await fresh(page);await fixture(page);
 await expect(page.locator('.camp-scene')).toHaveAttribute('data-story-scene','u_minh');
 expect(await page.locator('.camp-scene').evaluate(e=>{const box=e.getBoundingClientRect();return [...e.querySelectorAll('.quest-actions button')].filter(b=>b.getClientRects().length).every(b=>{const r=b.getBoundingClientRect();return r.top>=box.top&&r.bottom<=box.bottom;});})).toBe(true);
 await expect(page.locator('#camp-hero-art')).toHaveAttribute('data-character-id','hero_commander');
 await page.evaluate(()=>window.__game.setView('roster'));const hero=page.locator('.formation-cell[data-selected="true"] .portrait');await expect(hero).toHaveAttribute('data-character-id','hero_commander');await expect(page.locator('.formation-cell[data-selected="true"]')).toHaveAttribute('data-equipment-aura','4');
 await expect(page.locator('.team-effects').first()).toBeVisible();
 await page.evaluate(()=>window.__game.setView('profile'));await page.locator('#tab-skills').click();
 for(const branch of ['attack','balanced','guard']){await page.locator(`[data-build-branch="${branch}"]`).click();await expect(page.locator('.skill-node:visible')).toHaveCount(8);await expect(page.locator('.skill-node:visible').first()).toHaveAttribute('data-branch',branch);}
 await page.locator('#tab-gear').click();await expect(page.locator('#gear-slots .gear-art img')).toHaveCount(3);await page.screenshot({path:info.outputPath('profile-'+width+'.png'),fullPage:true,animations:'disabled'});
 for(const view of ['camp','roster','profile','tavern','dungeons','settings','saves']){await page.evaluate(view=>window.__game.setView(view),view);const spill=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);expect(spill,view).toBe(false);}
});
test('all ten protagonist phases load six real poses with alpha; every equipment image decodes',async({page},info)=>{
 await fresh(page);const report=await page.evaluate(async()=>{
  const{fighterURL}=await import('/src/data/PresentationData.js'),{EQUIPMENT}=await import('/src/data/EquipmentData.js'),{gearArtPath}=await import('/src/ui/GearArt.js');const atlas=[];
  for(const stage of ['modern','traveler','ThieuLam','VoDang','CaiBang','NgaMi','DuongMon','grief','commander','peace']){const im=new Image();im.src=fighterURL('hero_'+stage);await im.decode();const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;const c=canvas.getContext('2d');c.drawImage(im,0,0);const occupied=[];for(let n=0;n<6;n++){const data=c.getImageData((n%3)*512,Math.floor(n/3)*512,512,512).data;let clear=0,paint=0;for(let j=3;j<data.length;j+=4){if(data[j]<10)clear++;if(data[j]>100)paint++;}occupied.push(clear>10000&&paint>1000);}atlas.push({stage,w:im.width,h:im.height,occupied});}
  const paths=[...new Set(EQUIPMENT.map(gearArtPath))];for(const path of paths){const im=new Image();im.src='/'+path;await im.decode();if(im.width!==256)throw Error(path);}return{atlas,gear:paths.length};
 });expect(report.atlas).toHaveLength(10);for(const row of report.atlas){expect(row.w).toBe(1536);expect(row.h).toBe(1024);expect(row.occupied.every(Boolean),row.stage).toBe(true);}expect(report.gear).toBe(80);
});
test('dungeon entry UI spends exactly one purchased run and persists the exhausted state',async({page})=>{
 await fresh(page);await fixture(page);await page.evaluate(()=>{const a=window.__game;for(let i=0;i<2;i++){a.model.enterDungeon('phong_nha');a.model.leaveDungeon();}a.setView('dungeons');});
 const buy=page.getByRole('button',{name:'Mua thêm 1 lượt · 60 bạc',exact:true});await expect(buy).toHaveCount(1);const before=await page.evaluate(()=>window.__game.model.session.inventory.find(i=>i.itemId==='silver').quantity);await buy.click();expect(await page.evaluate(()=>window.__game.model.session.inventory.find(i=>i.itemId==='silver').quantity)).toBe(before-60);
 await page.evaluate(()=>{const a=window.__game;a.model.enterDungeon('phong_nha');a.model.leaveDungeon();});await expect(buy).toHaveCount(0);await expect(page.locator('#dungeon-root')).toContainText('Còn 0 lượt hôm nay');
});
