import { ELEMENTS, SECT_ELEMENT, elementMultiplier } from '../data/StrategyData.js';
import { SYNERGIES } from '../data/SynergiesData.js';
import { portrait, decorateRarity } from './Visuals.js';
const node = (tag, text) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; return e; };
const element = u => u.element ?? SECT_ELEMENT[u.sect];
export function matchupText(home, enemies) {
  return home.map(u => {
    const strong = enemies.filter(e => elementMultiplier(u,e) > 1).map(e=>e.name);
    const weak = enemies.filter(e => elementMultiplier(u,e) < 1).map(e=>e.name);
    const fed = home.filter(a=>a!==u && element(u) && ELEMENTS[element(a)]?.feeds===element(u)).map(a=>a.name);
    return `${u.name} · ${ELEMENTS[element(u)]?.name ?? 'Chưa có hệ'}: khắc (+75% sát thương) ${strong.join(', ') || 'không có'}; bị khắc (−40% sát thương) ${weak.join(', ') || 'không có'}. Tương sinh từ ${fed.join(', ') || 'không có'}${fed.length?' · +8% nộ nhận, không cộng dồn theo số người':''}.`;
  });
}
export function showPrebattle(app) {
  document.getElementById('prebattle-dialog')?.remove();
  const battle=app.model.battle, home=battle.units.filter(u=>u.team==='home'&&!u.isObject&&u.alive), enemies=battle.units.filter(u=>u.team==='enemy'&&!u.isObject&&u.alive);
  const dialog=node('dialog');dialog.id='prebattle-dialog';dialog.setAttribute('aria-label','Trinh sát và xếp trận');
  dialog.append(node('h2','Trinh sát và xếp trận'),node('p','Trận chưa chạy. Xem đội địch và đổi vị trí trước khi giao chiến. Khắc hệ giúp tăng sát thương, không bảo đảm chiến thắng.'));
  const render=()=>{
    content.replaceChildren();
    const grid=node('div');grid.className='prebattle-grid';
    for(const u of [...home,...enemies]){const card=node('article');card.className='prebattle-card';card.dataset.team=u.team;decorateRarity(card,u);card.append(portrait(u),node('strong',u.name),node('small',`${u.team==='home'?'Ta':'Địch'} · ${ELEMENTS[element(u)]?.name??'Không hệ'} · ô ${u.gridPosition.x+1},${u.gridPosition.y+1} · HP ${Math.round(u.stats.maxHp)}`));grid.append(card);}
    content.append(grid);
    for(const line of matchupText(home,enemies))content.append(node('p',line));
    for(const synergy of SYNERGIES.filter(s=>(battle.teamSynergies.home??[]).includes(s.id)))content.append(node('p','Tương trợ đã kích hoạt: '+synergy.name+' · '+synergy.description));
    content.append(node('h3','Sắp vị trí đội ta'));
    for(const u of home.filter(u=>Object.hasOwn(app.model.session.party.formation,u.id))){const label=node('label',u.name+' '),select=node('select');select.setAttribute('aria-label','Vị trí '+u.name);
      for(let y=0;y<3;y++)for(let x=0;x<3;x++){const occupied=battle.grid.at({x,y});const savedFormation=app.model.session.adventure.dungeon?.squad.formation??app.model.session.party.formation;const reserved=Object.entries(savedFormation).some(([id,p])=>p.x===x&&p.y===y&&!home.some(a=>a.id===id));if(reserved)continue;if(occupied&&(occupied.isObject||!Object.hasOwn(app.model.session.party.formation,occupied.id)))continue;const o=node('option',`Cột ${x+1}, hàng ${y+1}${occupied?' · '+occupied.name:''}`);o.value=`${x},${y}`;select.append(o);}
      select.value=`${u.gridPosition.x},${u.gridPosition.y}`;
      select.onchange=()=>{const [x,y]=select.value.split(',').map(Number),other=battle.grid.at({x,y}),old={...u.gridPosition};battle.grid.remove(u);if(other)battle.grid.remove(other);battle.grid.place(u,{x,y});if(other)battle.grid.place(other,old);app.renderer.positions.clear();render();};
      label.append(select);content.append(label);
    }
  };
  const content=node('div');dialog.append(content);render();
  const start=node('button','Bắt đầu giao chiến');start.type='button';start.dataset.startBattle='true';
  start.onclick=()=>{
    if(app.model.battle!==battle || !app.model.running || battle.elapsed>0){app.awaitingBattle=false;dialog.close();dialog.remove();return;}
    const next=app.model.snapshot();
    for(const id of ['hero',...next.party.active]){const u=home.find(u=>u.id===id);if(u)next.party.formation[id]={...u.gridPosition};}
    if(next.adventure.dungeon){for(const id of ['hero',...next.adventure.dungeon.squad.active]){const u=home.find(u=>u.id===id);if(u)next.adventure.dungeon.squad.formation[id]={...u.gridPosition};}}
    for(const u of home)battle.startingCells.set(u.id,{...u.gridPosition});
    app.model._commit(next,'formation');app.awaitingBattle=false;dialog.close();dialog.remove();
  };
  dialog.addEventListener('cancel',event=>event.preventDefault());dialog.append(start);document.body.append(dialog);app.awaitingBattle=true;dialog.showModal();
}
