import { portrait } from './Visuals.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
export function moveFormation(formation, id, cell) {
  if (!Object.hasOwn(formation, id) || !Number.isInteger(cell.x) || !Number.isInteger(cell.y) || cell.x < 0 || cell.x > 2 || cell.y < 0 || cell.y > 2) throw new Error('Ô xếp trận không hợp lệ.');
  const result = structuredClone(formation), occupant = Object.keys(result).find(key => result[key].x === cell.x && result[key].y === cell.y);
  if (occupant && occupant !== id) result[occupant] = { ...result[id] };
  result[id] = { ...cell }; return result;
}
export function mountFormationUI({ root, getState, onMove, canEdit, onError }) {
  let selected = 'hero';
  function render() {
    const session = getState(), ids = ['hero', ...session.party.active];
    if (!ids.includes(selected)) selected = 'hero';
    root.replaceChildren();
    const selectors = document.createElement('div'); selectors.className = 'formation-units';
    const name = id => id === 'hero' ? session.hero.name : COMPANIONS_BY_ID[id].name;
    for (const id of ids) {
      const button = document.createElement('button'); button.type = 'button'; const label = document.createElement('span'); label.textContent = name(id); button.append(portrait(id === 'hero' ? session.hero.sect : COMPANIONS_BY_ID[id].sect), label);
      button.setAttribute('aria-pressed', String(selected === id)); button.disabled = !canEdit();
      button.addEventListener('click', () => { selected = id; render(); }); selectors.append(button);
    }
    root.append(selectors);
    const grid = document.createElement('div'); grid.className = 'formation-grid'; grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Xếp trận ba cột ba hàng, tiền tuyến bên phải');
    const place = cell => { try { onMove(moveFormation(getState().party.formation, selected, cell)); render(); } catch (error) { onError(error.message); } };
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      const unit = ids.find(id => session.party.formation[id].x === x && session.party.formation[id].y === y);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'formation-cell';
      if (unit) { const label = document.createElement('span'); label.textContent = name(unit); button.append(portrait(unit === 'hero' ? session.hero.sect : COMPANIONS_BY_ID[unit].sect), label); }
      else { const label = document.createElement('span'); label.textContent = '+'; label.setAttribute('aria-hidden', 'true'); button.append(label); }
      button.dataset.occupied = String(Boolean(unit)); button.dataset.selected = String(unit === selected); button.dataset.cell = `${x},${y}`;
      button.setAttribute('aria-label', `Cột ${x}, hàng ${y}: ${unit ? name(unit) : 'trống'}`); button.disabled = !canEdit();
      button.draggable = Boolean(unit && canEdit());
      button.addEventListener('click', () => place({ x, y }));
      button.addEventListener('dragstart', event => { selected = unit; event.dataTransfer.setData('text/plain', unit); });
      button.addEventListener('dragover', event => event.preventDefault());
      button.addEventListener('drop', event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (ids.includes(id)) { selected = id; place({ x, y }); } });
      grid.append(button);
    }
    root.append(grid);
  }
  render(); return { render };
}
