import { Hero } from '../entities/Hero.js';
import { Companion } from '../entities/Companion.js';
import { GridSystem } from '../combat/GridSystem.js';
import { TargetSelector } from '../combat/TargetSelector.js';
import { StatusEngine } from '../combat/StatusEngine.js';
import { SECTS } from '../data/SectsData.js';
import { COMPANIONS } from '../data/CompanionsData.js';

/** An isolated test board. No recruitment, inventory or saved formation is modified. */
export function mountTacticsUI({ engine }) {
  const el = id => document.getElementById(id);
  const heroSelect = el('tactics-sect'), ally1 = el('tactics-ally-1'), ally2 = el('tactics-ally-2');
  const actorSelect = el('tactics-unit'), cellSelect = el('tactics-cell'), strategy = el('tactics-strategy');
  const message = el('tactics-message'), info = el('tactics-info');
  function option(select, value, text) {
    const node = document.createElement('option'); node.value = value; node.textContent = text; select.append(node);
  }
  Object.values(SECTS).forEach(sect => option(heroSelect, sect.id, sect.name));
  for (const unit of COMPANIONS) { option(ally1, unit.id, unit.name); option(ally2, unit.id, unit.name); }
  heroSelect.value = 'VoDang'; ally1.value = 'companion_01'; ally2.value = 'companion_03';
  for (let y = 0; y < 3; y++) for (let x = 0; x < 6; x++) option(cellSelect, `${x},${y}`, `(${x}, ${y}) · ${x < 3 ? 'Sân nhà' : 'Sân địch'}`);
  cellSelect.value = '1,1'; strategy.value = 'role';
  let grid, units, selectedId = 'hero', orders = new Map(), infoTime = 0;
  const statuses = new StatusEngine();
  const say = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
  const actor = () => units.find(unit => unit.id === selectedId);
  const target = unit => TargetSelector.select(unit, units, grid, strategy.value);
  const position = () => { const [x, y] = cellSelect.value.split(',').map(Number); return { x, y }; };
  function refreshInfo() {
    const unit = actor(), selected = target(unit);
    const status = unit.statusEffects.map(e => `${({ poison: 'Độc', bleed: 'Xuất huyết', stun: 'Choáng', shield: 'Khiên', taunt: 'Khiêu khích' })[e.type]} ${e.remaining.toFixed(1)}s${e.stacks ? ` ×${e.stacks}` : ''}`).join(', ') || 'Không có';
    info.textContent = `${unit.name} · ${unit.alive ? `Ô (${unit.gridPosition.x}, ${unit.gridPosition.y})` : 'Đã bị hạ'} · HP ${Math.ceil(unit.stats.hp)}/${unit.stats.maxHp} · Khiên ${Math.ceil(unit.shield)} · Nộ ${unit.stats.energy.toFixed(1)} · ${status}. Mục tiêu: ${selected?.name ?? 'Không có'}.`;
  }
  function reset() {
    if (ally1.value === ally2.value) throw new Error('Hãy chọn hai đồng đội khác nhau.');
    // Build off to the side so a failed configuration leaves the existing board intact.
    const nextGrid = new GridSystem();
    const nextUnits = [new Hero(heroSelect.value), new Companion(ally1.value), new Companion(ally2.value),
      new Companion('companion_05', { id: 'enemy_01', team: 'enemy' }),
      new Companion('companion_04', { id: 'enemy_02', team: 'enemy' }),
      new Companion('companion_08', { id: 'enemy_03', team: 'enemy' })];
    nextUnits[3].name = 'Địch đỡ đòn'; nextUnits[4].name = 'Địch hậu tuyến'; nextUnits[5].name = 'Địch ít máu';
    nextUnits[3].stats.hp *= .8; nextUnits[5].stats.hp *= .25;
    const positions = [{ x: 1, y: 1 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 1 }, { x: 5, y: 0 }, { x: 4, y: 2 }];
    nextUnits.forEach((unit, i) => nextGrid.place(unit, positions[i]));
    grid = nextGrid; units = nextUnits; orders = new Map(); selectedId = 'hero';
    actorSelect.replaceChildren(); units.forEach(unit => option(actorSelect, unit.id, unit.name)); actorSelect.value = selectedId;
    refreshInfo(); say('Bàn thử đã sẵn sàng. Chọn nhân vật rồi thử xếp ô, tìm mục tiêu hoặc hiệu ứng.');
  }
  function safely(action) { return () => { try { action(); refreshInfo(); } catch (error) { say(error.message, true); } }; }
  el('btn-tactics-reset').addEventListener('click', safely(reset));
  actorSelect.addEventListener('change', safely(() => { selectedId = actorSelect.value; }));
  strategy.addEventListener('change', safely(() => {}));
  el('btn-tactics-place').addEventListener('click', safely(() => {
    const unit = actor(); if (unit.stunned) throw new Error('Nhân vật đang choáng. Hãy chờ hết choáng hoặc giải hiệu ứng.');
    grid.place(unit, position()); orders.delete(unit.id); say('Đã đặt nhân vật vào ô trống của phe mình.');
  }));
  el('btn-tactics-move').addEventListener('click', safely(() => {
    const unit = actor(); if (!unit.alive) throw new Error('Nhân vật đã bị hạ. Hãy dựng lại bàn thử.');
    if (!grid.findPath(unit, position())) throw new Error('Không tìm thấy đường đến ô này.');
    orders.set(unit.id, { destination: position(), credit: 0 });
    say(engine.paused ? 'Đã nhận lệnh. Bấm Tiếp tục để di chuyển.' : 'Đang di chuyển theo từng ô.');
  }));
  el('btn-tactics-approach').addEventListener('click', safely(() => {
    const unit = actor(), selected = target(unit);
    if (!selected) throw new Error('Không có mục tiêu phù hợp.');
    if (unit.team === selected.team) throw new Error('Mục tiêu là đồng đội; hãy thử nhân vật tấn công hoặc đổi cách chọn mục tiêu.');
    const path = grid.pathToRange(unit, selected);
    if (path === null) throw new Error('Không tìm thấy đường tiếp cận mục tiêu.');
    orders.set(unit.id, { follow: true, strategy: strategy.value, credit: 0 });
    say(path.length ? 'Đang tiếp cận; sẽ dừng khi vào tầm đánh.' : 'Mục tiêu đã nằm trong tầm đánh.');
  }));
  const actions = {
    'btn-status-poison': () => statuses.apply(actor(), { type: 'poison', duration: 5, damagePerStack: 20 }),
    'btn-status-bleed': () => statuses.apply(actor(), { type: 'bleed', duration: 4, damagePerStack: 15 }),
    'btn-status-stun': () => statuses.apply(actor(), { type: 'stun', duration: 3 }),
    'btn-status-shield': () => statuses.apply(actor(), { type: 'shield', duration: 5, amount: 200 }),
    'btn-status-cleanse': () => statuses.cleanse(actor()),
    'btn-status-damage': () => { actor().takeDamage(100); grid.removeDead(); }
  };
  for (const [id, action] of Object.entries(actions)) el(id).addEventListener('click', safely(() => {
    if (!actor().alive) throw new Error('Nhân vật đã bị hạ. Hãy dựng lại bàn thử.');
    action(); say('Đã áp dụng thử nghiệm lên nhân vật đang chọn.');
  }));
  engine.addUpdater(dt => {
    units.forEach(unit => statuses.update(unit, dt)); grid.removeDead();
    for (const [id, order] of orders) {
      const unit = units.find(u => u.id === id);
      if (!unit.alive) { orders.delete(id); continue; }
      if (unit.stunned) { order.credit = 0; continue; }
      const selected = order.follow ? TargetSelector.select(unit, units, grid, order.strategy) : null;
      const path = order.follow ? grid.pathToRange(unit, selected) : grid.findPath(unit, order.destination);
      if (!path?.length) {
        orders.delete(id); unit.state = 'IDLE';
        if (id === selectedId) say(path === null ? 'Không có đường hoặc mục tiêu; đã dừng di chuyển.' : 'Đã tới ô hoặc vào tầm đánh.');
        continue;
      }
      unit.state = 'MOVE'; order.credit += dt * unit.stats.moveSpeed;
      if (order.credit >= 1 - 1e-9) {
        order.credit = Math.max(0, order.credit - 1);
        grid.move(unit, path[0]);
      }
    }
  });
  engine.addRenderer((_alpha, frameDt) => { infoTime += frameDt; if (infoTime >= .1) { infoTime = 0; refreshInfo(); } });
  reset();
  return {
    // Expose an inspection API for console checks; gameplay state is kept separate.
    get grid() { return grid; }, get units() { return units; },
    draw(ctx, { x, y, cellW, cellH }) {
      const chosen = actor(), selected = target(chosen);
      for (const unit of units.filter(u => u.alive)) {
        const p = unit.gridPosition, cx = x + (p.x + .5) * cellW, cy = y + (p.y + .5) * cellH;
        ctx.fillStyle = unit.team === 'home' ? '#6fb59b' : '#e17a69';
        ctx.beginPath(); ctx.arc(cx, cy - 10, Math.min(cellW, cellH) * .2, 0, Math.PI * 2); ctx.fill();
        if (unit === chosen || unit === selected) {
          ctx.strokeStyle = unit === chosen ? '#d4af37' : '#e2e8f0'; ctx.lineWidth = 3;
          ctx.strokeRect(x + p.x * cellW + 6, y + p.y * cellH + 6, cellW - 12, cellH - 12);
        }
        ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#0f172a';
        ctx.fillText(unit.id === 'hero' ? 'Ta' : unit.name.slice(0, 2), cx, cy - 10);
        ctx.fillStyle = '#e2e8f0'; ctx.fillText(unit.name, cx, cy + 23, cellW - 12);
        const barW = cellW - 24;
        ctx.fillStyle = '#334155'; ctx.fillRect(cx - barW / 2, cy + 33, barW, 6);
        ctx.fillStyle = '#6fb59b'; ctx.fillRect(cx - barW / 2, cy + 33, barW * unit.hpRatio, 6);
        ctx.fillStyle = '#d4af37'; ctx.fillRect(cx - barW / 2, cy + 42, barW * unit.stats.energy / unit.stats.maxEnergy, 3);
      }
      ctx.textAlign = 'left'; ctx.lineWidth = 1;
    }
  };
}
