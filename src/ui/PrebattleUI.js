import { ELEMENTS, SECT_ELEMENT, elementMultiplier } from '../data/StrategyData.js';
import { SYNERGIES } from '../data/SynergiesData.js';
import { BOARD_COLS, BOARD_ROWS, HOME_WIDTH, CELL_WIDTH, CELL_HEIGHT } from '../combat/BoardGeometry.js';
import { damageIndicator } from '../combat/DamageIndicator.js';
import { BattleRenderer } from './BattleRenderer.js';
import { portrait } from './Visuals.js';
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const element=u=>u.element??SECT_ELEMENT[u.sect];
// Optional textual description for assistive tools; the default view is the real board.
export function matchupText(home,enemies){return home.map(u=>{
 const strong=enemies.filter(e=>elementMultiplier(u,e)>1).map(e=>e.name),weak=enemies.filter(e=>elementMultiplier(u,e)<1).map(e=>e.name),fed=home.filter(a=>a!==u&&element(u)&&ELEMENTS[element(a)]?.feeds===element(u)).map(a=>a.name);
 return `${u.name} · ${ELEMENTS[element(u)]?.name??'Chưa có hệ'}: khắc (+75% sát thương) ${strong.join(', ')||'không có'}; bị khắc (−40% sát thương) ${weak.join(', ')||'không có'}. Tương sinh từ ${fed.join(', ')||'không có'}${fed.length?' · +8% nộ nhận, không cộng dồn theo số người':''}.`;
});}
export function showPrebattle(app){
 document.getElementById('prebattle-dialog')?.remove();
 const battle=app.model.battle,home=battle.units.filter(u=>u.team==='home'&&!u.isObject&&u.alive),enemies=battle.units.filter(u=>u.team==='enemy'&&!u.isObject&&u.alive);
 let selected=home.find(u=>u.id==='hero')??home[0],opponent=enemies[0];
 const dialog=node('dialog');dialog.id='prebattle-dialog';dialog.setAttribute('aria-label','Trinh sát và xếp trận');
 const title=node('h2','Xếp trận · 8 × 4'),hint=node('p','Chọn tướng ta → chọn ô để đổi chỗ. Chạm tướng địch để xem khắc hệ.','ready-hint');
 dialog.append(title,hint);
 const map=node('div',undefined,'ready-map'),canvas=node('canvas');canvas.id='ready-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Đội hình thực tế hai bên trên sân 8 cột 4 hàng');
 const cells=node('div',undefined,'ready-cells');cells.setAttribute('role','group');cells.setAttribute('aria-label','Các ô xếp trận');map.append(canvas,cells);dialog.append(map);
 const selectedInfo=node('div',undefined,'ready-selection');selectedInfo.setAttribute('aria-live','polite');dialog.append(selectedInfo);
 const legend=node('div',undefined,'ready-legend');legend.append(node('span','▲ +% Tăng sát thương','damage-up'),node('span','▼ −% Giảm sát thương','damage-down'));dialog.append(legend);
 const details=node('details',undefined,'ready-details');details.append(node('summary','Chi tiết ngũ hành & tương trợ'));
 for(const line of matchupText(home,enemies))details.append(node('p',line));
 for(const s of SYNERGIES.filter(s=>(battle.teamSynergies.home??[]).includes(s.id)))details.append(node('p',s.name+' · '+s.description));dialog.append(details);
 const renderer=new BattleRenderer(canvas);renderer.setBattle(battle);app.readyRenderer=renderer;
 const editable=u=>u&&u.team==='home'&&Object.hasOwn(app.model.session.party.formation,u.id);
 const savedFormation=()=>app.model.session.adventure.dungeon?.squad.formation??app.model.session.party.formation;
 const reserved=p=>Object.entries(savedFormation()).some(([id,pos])=>pos.x===p.x&&pos.y===p.y&&!home.some(u=>u.id===id));
 const update=()=>{
  renderer.previewOpponentId=opponent?.id;renderer.previewHomeId=selected?.id;
  selectedInfo.replaceChildren();
  for(const u of [selected,opponent].filter(Boolean)){
   const chip=node('div',undefined,'ready-selected-unit');const badge=damageIndicator(battle,u,u.team==='home'?opponent?.id:selected?.id);
   chip.append(portrait(u),node('strong',u.name),node('small',ELEMENTS[element(u)]?.name??'Không hệ'));
   if(badge)chip.append(node('b',(badge.percent>0?'+':'')+badge.percent+'%',badge.kind==='up'?'damage-up':'damage-down'));selectedInfo.append(chip);
  }
  cells.replaceChildren();
  for(let y=0;y<BOARD_ROWS;y++)for(let x=0;x<BOARD_COLS;x++){
   const p={x,y},u=battle.grid.at(p),b=node('button');b.type='button';b.dataset.readyCell=`${x},${y}`;b.dataset.team=x<HOME_WIDTH?'home':'enemy';if(u)b.dataset.readyUnit=u.id;
   b.setAttribute('aria-label',`Ô ${x+1},${y+1}: ${u?.name??'trống'}`);b.setAttribute('aria-pressed',String(u===selected||u===opponent));
   b.disabled=Boolean(u?.isObject||u?.team==='home'&&!editable(u)||!u&&x>=HOME_WIDTH||x<HOME_WIDTH&&reserved(p));
   const center=renderer.project(p),w=CELL_WIDTH,h=CELL_HEIGHT;
   Object.assign(b.style,{left:(center.x-w/2)/renderer.width*100+'%',top:(center.y-h/2)/renderer.height*100+'%',width:w/renderer.width*100+'%',height:h/renderer.height*100+'%'});
   const act=()=>{
    if(u?.team==='enemy'){opponent=u;update();return;}
    if(!editable(selected))return;
    if(u===selected){map.dataset.moveMode='true';update();return;}
    // Click an ally to select; click its cell again with a selected ally to swap via drag/drop.
    if(editable(u)&&!map.dataset.moveMode){selected=u;map.dataset.moveMode='true';update();return;}
    const old={...selected.gridPosition};battle.grid.remove(selected);if(u)battle.grid.remove(u);battle.grid.place(selected,p);if(u)battle.grid.place(u,old);
    renderer.positions.clear();delete map.dataset.moveMode;update();
   };
   b.onclick=act;b.draggable=Boolean(editable(u));
   b.ondragstart=e=>{selected=u;map.dataset.moveMode='true';e.dataTransfer.setData('text/plain',u.id);};
   b.ondragover=e=>{if(x<HOME_WIDTH&&!b.disabled)e.preventDefault();};b.ondrop=e=>{e.preventDefault();if(x<HOME_WIDTH&&!b.disabled){map.dataset.moveMode='true';act();}};
   cells.append(b);
  }
 };
 const start=node('button','Bắt đầu giao chiến');start.type='button';start.dataset.startBattle='true';dialog.append(start);
 let frame=0;const observer=new ResizeObserver(()=>{renderer.resize();update();});
 const cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();};
 start.onclick=()=>{
  if(app.model.battle!==battle||!app.model.running||battle.elapsed>0){cleanup();app.awaitingBattle=false;dialog.close();dialog.remove();return;}
  const next=app.model.snapshot();for(const id of ['hero',...next.party.active]){const u=home.find(u=>u.id===id);if(u)next.party.formation[id]={...u.gridPosition};}
  if(next.adventure.dungeon)for(const id of ['hero',...next.adventure.dungeon.squad.active]){const u=home.find(u=>u.id===id);if(u)next.adventure.dungeon.squad.formation[id]={...u.gridPosition};}
  for(const u of home)battle.startingCells.set(u.id,{...u.gridPosition});app.model._commit(next,'formation');cleanup();app.awaitingBattle=false;dialog.close();dialog.remove();
 };
 dialog.addEventListener('cancel',e=>e.preventDefault());document.body.append(dialog);app.awaitingBattle=true;dialog.showModal();renderer.resize();update();observer.observe(map);
 let last=performance.now();const paint=now=>{if(!dialog.isConnected){cleanup();return;}renderer.render(Math.min(.1,(now-last)/1000));last=now;frame=requestAnimationFrame(paint);};frame=requestAnimationFrame(paint);
 title.tabIndex=-1;title.focus({preventScroll:true});dialog.scrollTop=0;
}
