import {test,expect} from './fixtures.js';

test('every registered character decodes and all six poses render without leaking canvas transforms',async({page})=>{
 test.setTimeout(90000);await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();
 const report=await page.evaluate(async()=>{
  window.__game.engine.stop();
  const {FIGHTERS,fighterURL,fighterUsesPortrait}=await import('/src/data/PresentationData.js');
  const {BattleRenderer}=await import('/src/ui/BattleRenderer.js');
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=320;
  const renderer=new BattleRenderer(canvas),ctx=renderer.ctx;let count=0;
  for(const id of FIGHTERS){const im=new Image();im.src=fighterURL(id);await im.decode();
   if(!fighterUsesPortrait(id)&&(im.naturalWidth*2!==im.naturalHeight*3))throw Error('Invalid atlas '+id);
   for(let frame=0;frame<6;frame++){ctx.clearRect(0,0,320,320);renderer.visualTime=.17;renderer.drawFighter({id,characterId:id,team:'home'},{x:160,y:200},im,frame,true);
    if(!ctx.getTransform().isIdentity)throw Error('Transform '+id);
    if(!ctx.getImageData(0,0,320,320).data.some((v,i)=>i%4===3&&v>0))throw Error('Empty '+id+' '+frame);count++;
   }
  }return{characters:FIGHTERS.length,poses:count};
 });expect(report).toEqual({characters:115,poses:690});
});

test('missing legacy NPC previews animate and artisan uses her own six-pose atlas; reduced motion stops them',async({page})=>{
 await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();
 await page.evaluate(async()=>{window.__game.engine.stop();const{appendDossier7}=await import('/src/ui/Dossier7.js');const{NPCS}=await import('/src/data/NPCData.js');const root=document.createElement('main');document.body.replaceChildren(root);for(const id of ['truong_xom','doi_truong','cha_tieu_muoi','ba_cu_giu_kho','thu_lai','co_gai','tho_giay']){const row=document.createElement('article');row.dataset.person=id;root.append(row);appendDossier7(row,NPCS.find(n=>n.id===id),{hero:{level:1}});}});
 await expect(page.locator('.model-preview7')).toHaveCount(7);
 const leader=page.locator('[data-person="doi_truong"]');await leader.locator('summary').click();await leader.getByRole('button',{name:'Đánh thường',exact:true}).click();await expect(leader.locator('.model-preview7')).toHaveAttribute('data-motion','2');
 expect(await leader.locator('.model-preview7').evaluate(e=>getComputedStyle(e).animationName)).toBe('model-strike71');
 await page.emulateMedia({reducedMotion:'reduce'});expect(await leader.locator('.model-preview7').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 const artisan=page.locator('[data-person="tho_giay"]');await expect(artisan.getByRole('button',{name:'Tuyệt kỹ',exact:true})).toHaveCount(0);await expect(artisan.locator('summary')).toHaveText('Mô hình chuyển động · 6 tư thế');await artisan.locator('summary').click();await artisan.getByRole('button',{name:'Giúp đỡ',exact:true}).click();await expect(artisan.locator('.model-preview7')).toHaveAttribute('data-motion','3');
});
