import {test,expect} from '@playwright/test';
import {developed} from '../scripts/balance-campaign7.mjs';

async function ready(page){
 await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Bố trận trực quan');await page.locator('#btn-new-game').click();
 const s=developed().snapshot();s.hero.name='Bố trận trực quan';
 await page.evaluate(s=>{const a=window.__game;a.model.load(s);a.setView('camp');a.model.practice();a.enterBattle();},s);
}
for(const width of [320,390,1280])test('real visual deployment and new corner persist at '+width+'px',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});await ready(page);
 const d=page.locator('#prebattle-dialog');await expect(d.locator('#ready-canvas')).toBeVisible();await expect(d.locator('[data-ready-cell]')).toHaveCount(32);
 await expect(d.locator('select')).toHaveCount(0);await expect(d.locator('.ready-details')).not.toHaveAttribute('open','');
 await expect(d.locator('.ready-cells .game-icon')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>[...window.__game.readyRenderer.fighters.values()].every(im=>im.complete&&im.naturalWidth>0))).toBe(true);
 const battle=await page.evaluate(()=>({seed:window.__game.model.battle.seed,elapsed:window.__game.model.battle.elapsed}));
 await d.locator('[data-ready-unit="hero"]').click();await d.locator('[data-ready-cell="3,3"]').click();
 expect(await page.evaluate(()=>window.__game.model.battle.units.find(u=>u.id==='hero').gridPosition)).toEqual({x:3,y:3});
 expect(await page.evaluate(()=>window.__game.model.battle.elapsed)).toBe(battle.elapsed);
 await d.locator('h2').evaluate(e=>e.scrollIntoView());await page.screenshot({path:info.outputPath('visual-ready-'+width+'.png'),animations:'disabled'});
 await d.locator('[data-start-battle]').click();expect(await page.evaluate(()=>window.__game.model.session.party.formation.hero)).toEqual({x:3,y:3});
 await page.evaluate(()=>window.__game.engine.stop());
 await expect.poll(()=>page.evaluate(async()=>{const{StorageManager}=await import('/src/core/StorageManager.js');const m=new StorageManager();try{return(await m.load(0))?.data.party.formation.hero;}finally{m.db?.close();}})).toEqual({x:3,y:3});
 await page.reload();await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#btn-continue').click();await page.locator('#btn-resume-battle').click();
 await expect(page.locator('#prebattle-dialog')).toBeVisible();expect(await page.evaluate(()=>window.__game.model.battle.seed)).toBe(battle.seed);
 expect(await page.evaluate(()=>window.__game.model.battle.units.find(u=>u.id==='hero').gridPosition)).toEqual({x:3,y:3});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);expect(errors).toEqual([]);
});

test('live canvas paints green positive and red negative numbers above real fighters, then updates on target change',async({page})=>{
 await ready(page);
 const result=await page.evaluate(async()=>{
  const {Hero}=await import('/src/entities/Hero.js'),{Companion}=await import('/src/entities/Companion.js'),{GridSystem}=await import('/src/combat/GridSystem.js'),{CombatEngine}=await import('/src/combat/CombatEngine.js'),{BattleRenderer}=await import('/src/ui/BattleRenderer.js');
  const a=new Hero('ThieuLam'),b=new Companion('companion_04',{id:'foe',team:'enemy'}),grid=new GridSystem();grid.place(a,{x:3,y:1});grid.place(b,{x:4,y:1});a.element='Kim';b.element='Moc';
  const battle=new CombatEngine({units:[a,b],grid});battle.start();const canvas=document.createElement('canvas');canvas.width=1260;canvas.height=680;const r=new BattleRenderer(canvas);r.setBattle(battle);
  await Promise.all([...r.fighters.values()].map(im=>im.decode()));const paints=[],hud=[],original=r.ctx.fillText.bind(r.ctx);r.ctx.fillText=(text,...args)=>{if(/^[▲▼]/.test(text))paints.push({text,color:r.ctx.fillStyle});if(/^[▲▼]/.test(text)||text==='Tuyệt kỹ')hud.push({text,x:args[0],y:args[1]});return original(text,...args);};r.render(.1);
  const first=[...r.damageIndicators.entries()];b.element='Hoa';r.render(.1);const after=r.damageIndicators.get(a.id);b.element='Moc';battle.brains.get(b.id).action={target:a,skill:b.skills.ultimate,ultimate:true};r.render(.1);return{paints,first,after,intent:hud.findLast(p=>p.text==='Tuyệt kỹ'),badge:hud.findLast(p=>p.text==='▼ -40%')};
 });
 expect(result.paints).toContainEqual({text:'▲ +75%',color:'#70ffa3'});expect(result.paints).toContainEqual({text:'▼ -40%',color:'#ff7585'});
 expect(result.first.find(([id])=>id==='hero')[1].targetId).toBe('foe');expect(result.after.percent).toBe(-40);expect(result.intent.x-result.badge.x).toBeGreaterThan(60);expect(result.intent.y).toBe(result.badge.y);
});
