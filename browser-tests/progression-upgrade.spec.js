import { test, expect } from '@playwright/test';
import { developed } from '../scripts/balance-campaign7.mjs';
import { createHeroBuild } from '../src/entities/HeroBuild.js';

async function ready(page){
  await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#hero-name').fill('Thử sức mạnh mới');await page.locator('#btn-new-game').click();
  const s=developed().snapshot();
  s.hero=createHeroBuild({name:'Thử sức mạnh mới',sect:'VoDang',level:30});
  s.party.ranks=Object.fromEntries(s.party.active.map(id=>[id,6]));
  await page.evaluate(s=>{const a=window.__game;a.model.load(s);a.setView('camp');},s);
}

for(const width of [320,390,1280]){
  test('loot, advancement, ready screen and auras at '+width+'px',async({page},info)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setViewportSize({width,height:900});await ready(page);
    await page.evaluate(()=>window.__game.setView('profile'));await page.locator('#tab-attributes').click();
    await expect(page.locator('#attribute-grid')).toContainText('HP +100');
    await page.getByLabel('Cộng 1 Căn Cốt',{exact:true}).click();
    await expect(page.locator('#attribute-grid')).toContainText('Căn Cốt: 1');
    await page.locator('#tab-skills').click();await expect(page.locator('.sect-passive')).toHaveCount(2);
    for(let i=1;i<=8;i++)await page.locator(`[data-skill-id="VoDang_t${i}_attack"]`).click();
    await page.locator('[data-build-branch="guard"]').click();
    for(let i=1;i<=4;i++)await page.locator(`[data-skill-id="VoDang_t${i}_guard"]`).click();
    await expect(page.locator('[data-skill-id="VoDang_t4_guard"]')).toHaveText('Đã học');
    await page.evaluate(()=>window.__game.setView('roster'));await page.locator('#roster-tab-companions').click();
    await expect(page.locator('#roster-list [data-tier="6"]').first()).toBeVisible();
    await page.evaluate(()=>window.__game.setView('roster'));
    await page.locator('#roster-tab-formation').click();
    await expect(page.locator('.formation-cell[data-tier="6"]')).toHaveCount(5);
    await expect(page.locator('.formation-cell[data-level-aura="30"]')).toHaveCount(6);
    await page.evaluate(()=>{const a=window.__game;a.model.practice();a.enterBattle();});
    const dialog=page.locator('#prebattle-dialog');await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading',{name:'Trinh sát và xếp trận',exact:true})).toBeInViewport();
    expect(await dialog.evaluate(e=>e.scrollTop)).toBe(0);
    await expect(dialog).toContainText('khắc (+75% sát thương)');
    const avatar=dialog.locator('.prebattle-card .portrait').first();
    expect(await avatar.evaluate(e=>{const r=e.getBoundingClientRect();return r.width>=64&&r.height>=64;})).toBe(true);
    await expect.poll(()=>avatar.evaluate(async e=>{const url=getComputedStyle(e).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];if(!url)return false;const im=new Image();im.src=url;try{await im.decode();return im.naturalWidth>0;}catch{return false;}})).toBe(true);
    await expect(dialog.locator('.prebattle-card[data-team="enemy"]')).not.toHaveCount(0);
    const before=await page.evaluate(()=>window.__game.model.battle.elapsed);
    // Real animation frames run while readiness prevents simulation updates.
    await expect.poll(()=>page.evaluate(()=>window.__game.awaitingBattle)).toBe(true);
    await page.waitForTimeout(350);
    expect(await page.evaluate(()=>window.__game.model.battle.elapsed)).toBe(before);
    const position=dialog.getByLabel('Vị trí Thử sức mạnh mới',{exact:true});await position.selectOption('0,0');
    await page.screenshot({path:info.outputPath('ready-'+width+'.png'),fullPage:true,animations:'disabled'});
    await dialog.getByRole('button',{name:'Bắt đầu giao chiến',exact:true}).click();
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate(()=>window.__game.model.session.party.formation.hero)).toEqual({x:0,y:0});
    await expect.poll(()=>page.evaluate(()=>window.__game.model.battle.elapsed)).toBeGreaterThan(before);
    await page.evaluate(()=>{const a=window.__game;a.engine.stop();a.renderer.render(.1);a.model.retreat();a.clearBattle();a.setView('tavern');});
    await page.locator('#world-tabs').getByRole('button',{name:'Câu cá',exact:true}).click();
    await expect(page.locator('.fishing-rates tr')).toHaveCount(7);
    await page.getByRole('button',{name:'Buông cần · 2 bạc',exact:true}).click();
    await expect(page.locator('.fishing-result')).toContainText('Câu cá: 1 cá bảo đảm +');
    await page.evaluate(()=>window.__game.setView('dungeons'));
    await page.locator('#bau-stake').fill('1');
    for(let i=0;i<5;i++)await page.locator('[data-bau-play]').click();
    expect(await page.evaluate(()=>window.__game.model.session.adventure.daily.bauCua)).toBe(5);
    await expect(page.locator('[data-bau-play]')).toBeEnabled();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('mission carts and locks decode as actual battlefield assets',async({page})=>{
  await ready(page);
  const report=await page.evaluate(async()=>{
    const {BattleRenderer}=await import('/src/ui/BattleRenderer.js');
    const {Hero}=await import('/src/entities/Hero.js');
    const {Companion}=await import('/src/entities/Companion.js');
    const {CombatEngine}=await import('/src/combat/CombatEngine.js');
    const {GridSystem}=await import('/src/combat/GridSystem.js');
    const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const renderer=new BattleRenderer(canvas);
    const reports=[];for(const type of ['protect','breach']){
    const home=new Hero('VoDang'),enemy=new Companion('companion_01',{team:'enemy'}),grid=new GridSystem();grid.place(home,{x:1,y:1});grid.place(enemy,{x:4,y:1});
    const {MISSIONS}=await import('/src/data/MissionsData.js');const missionId=Object.keys(MISSIONS).find(id=>MISSIONS[id].type===type);
    const battle=new CombatEngine({units:[home,enemy],grid,seed:15,missionId});battle.start();
    renderer.setBattle(battle);renderer.render(.1);
    const cart=battle.units.find(u=>u.missionAsset);const image=renderer.companionImages.get(cart.characterId);await image.decode();
    let objectDraws=0;const draw=renderer.ctx.drawImage.bind(renderer.ctx);renderer.ctx.drawImage=(im,...args)=>{if(im===image)objectDraws++;return draw(im,...args);};renderer.render(.1);
    reports.push({src:image.src,width:image.naturalWidth,objectDraws});
    }return reports;
  });
  expect(report[0].src).toContain('mission-cart.svg');expect(report[1].src).toContain('mission-lock.svg');for(const r of report){expect(r.width).toBeGreaterThan(0);expect(r.objectDraws).toBeGreaterThan(0);}
});
