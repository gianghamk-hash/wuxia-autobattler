import { CONFIG } from '../config.js';

/** Global x=0..5, y=0..2. Chebyshev distance: diagonal melee reaches one cell.
 * BFS allows eight directions, with no cutting diagonally through blocked corners.
 */
export class GridSystem {
  constructor() { this.cols = CONFIG.GRID.COLS; this.rows = CONFIG.GRID.ROWS; this.units = new Map(); }
  isInside(p) { return Boolean(p && Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.x < this.cols && p.y >= 0 && p.y < this.rows); }
  distance(a, b) {
    if (!this.isInside(a) || !this.isInside(b)) throw new Error('Tọa độ ngoài bàn cờ.');
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }
  isHomeSide(team, p) { return this.isInside(p) && (team === 'home' ? p.x <= 2 : team === 'enemy' && p.x >= 3); }
  at(p) { return [...this.units.values()].find(u => u.alive && u.gridPosition?.x === p?.x && u.gridPosition?.y === p?.y) ?? null; }
  place(unit, p, { formation = true } = {}) {
    if (!this.isInside(p) || !unit?.alive || !['home', 'enemy'].includes(unit.team)) throw new Error('Không thể đặt nhân vật vào ô này.');
    if (this.units.has(unit.id) && this.units.get(unit.id) !== unit) throw new Error('ID nhân vật bị trùng.');
    if (formation && !this.isHomeSide(unit.team, p)) throw new Error('Xếp trận phải nằm trong phần sân của phe mình.');
    const occupied = this.at(p);
    if (occupied && occupied !== unit) throw new Error('Ô này đã có nhân vật.');
    unit.gridPosition = { ...p }; this.units.set(unit.id, unit); return unit.gridPosition;
  }
  remove(unit) {
    if (this.units.get(unit.id) !== unit) return;
    this.units.delete(unit.id); unit.gridPosition = null;
  }
  removeDead() { for (const unit of [...this.units.values()]) if (!unit.alive) this.remove(unit); }
  neighbors(p, unit) {
    if (!this.isInside(p)) return [];
    const free = q => this.isInside(q) && (!this.at(q) || this.at(q) === unit);
    return [[1, 0], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 1], [-1, -1], [-1, 1]]
      .map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy }))
      .filter(q => free(q) && (q.x === p.x || q.y === p.y ||
        (free({ x: q.x, y: p.y }) && free({ x: p.x, y: q.y }))));
  }
  move(unit, destination) {
    if (this.units.get(unit.id) !== unit || !unit.alive || unit.stunned || !unit.gridPosition ||
        !this.neighbors(unit.gridPosition, unit).some(p => p.x === destination?.x && p.y === destination?.y)) return false;
    this.place(unit, destination, { formation: false }); return true;
  }
  _path(unit, goal) {
    if (this.units.get(unit.id) !== unit || !unit.alive || !unit.gridPosition) return null;
    const start = { ...unit.gridPosition }, queue = [{ p: start, path: [] }], seen = new Set([`${start.x},${start.y}`]);
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i]; if (goal(node.p)) return node.path;
      for (const p of this.neighbors(node.p, unit)) {
        const key = `${p.x},${p.y}`; if (seen.has(key)) continue;
        seen.add(key); queue.push({ p, path: [...node.path, p] });
      }
    }
    return null;
  }
  findPath(unit, destination) {
    if (!this.isInside(destination) || (this.at(destination) && this.at(destination) !== unit)) return null;
    return this._path(unit, p => p.x === destination.x && p.y === destination.y);
  }
  pathToRange(unit, target, range = unit.stats.attackRange) {
    if (!target?.alive || !target.gridPosition || !Number.isFinite(range) || range < 0) return null;
    return this._path(unit, p => this.distance(p, target.gridPosition) <= range);
  }
}
