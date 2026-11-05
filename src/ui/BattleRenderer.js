const COLORS = { home: '#6bc9b0', enemy: '#ed927c' };
export class BattleRenderer {
  constructor(canvas) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); if (!this.ctx) throw new Error('Trình duyệt không hỗ trợ Canvas 2D.'); this.battle = null; this.positions = new Map(); this.floating = []; }
  setBattle(battle) { this.battle = battle; this.positions.clear(); this.floating = []; }
  event(event) {
    if (['damage', 'heal', 'miss'].includes(event.type) && event.position) {
      this.floating.push({ ...event, life: .8 }); if (this.floating.length > 30) this.floating.shift();
    }
  }
  resize() {
    const width = this.canvas.getBoundingClientRect().width || 960, scale = Math.min(globalThis.devicePixelRatio || 1, 3) * width / 960;
    this.canvas.width = Math.round(960 * scale); this.canvas.height = Math.round(540 * scale);
    this.ctx.setTransform(this.canvas.width / 960, 0, 0, this.canvas.height / 540, 0, 0);
  }
  render(dt = 0) {
    const ctx = this.ctx, x = 30, y = 70, w = 150, h = 130;
    const background = ctx.createLinearGradient(0, 0, 960, 540); background.addColorStop(0, '#122a32'); background.addColorStop(1, '#1f2135');
    ctx.fillStyle = background; ctx.fillRect(0, 0, 960, 540);
    ctx.font = '20px serif'; ctx.textAlign = 'left'; ctx.fillStyle = COLORS.home; ctx.fillText('Đội nhà', x, 35);
    ctx.textAlign = 'right'; ctx.fillStyle = COLORS.enemy; ctx.fillText('Đối thủ', 930, 35);
    for (let col = 0; col < 6; col++) for (let row = 0; row < 3; row++) {
      ctx.fillStyle = col < 3 ? 'rgba(107,201,176,.08)' : 'rgba(237,146,124,.08)'; ctx.fillRect(x + col * w + 2, y + row * h + 2, w - 4, h - 4);
      ctx.strokeStyle = 'rgba(170,190,210,.2)'; ctx.lineWidth = 1; ctx.strokeRect(x + col * w + 2, y + row * h + 2, w - 4, h - 4);
    }
    if (!this.battle) return;
    for (const unit of this.battle.units.filter(u => u.alive && u.gridPosition)) {
      const desired = { x: x + (unit.gridPosition.x + .5) * w, y: y + (unit.gridPosition.y + .5) * h };
      const previous = this.positions.get(unit.id) ?? desired, blend = 1 - Math.exp(-dt * 14);
      const p = { x: previous.x + (desired.x - previous.x) * blend, y: previous.y + (desired.y - previous.y) * blend }; this.positions.set(unit.id, p);
      ctx.fillStyle = COLORS[unit.team]; ctx.beginPath(); ctx.moveTo(p.x, p.y - 32); ctx.lineTo(p.x + 25, p.y + 12); ctx.lineTo(p.x - 25, p.y + 12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#eedac2'; ctx.beginPath(); ctx.arc(p.x, p.y - 28, 13, 0, Math.PI * 2); ctx.fill();
      if (unit.shield > 0) { ctx.strokeStyle = '#83bfff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y - 10, 36, 0, Math.PI * 2); ctx.stroke(); }
      if (unit.state === 'ULTIMATE') { ctx.strokeStyle = '#ffd874'; ctx.lineWidth = 4; ctx.strokeRect(p.x - 42, p.y - 48, 84, 85); }
      ctx.textAlign = 'center'; ctx.font = '13px sans-serif'; ctx.fillStyle = '#eff3f4'; ctx.fillText(unit.name, p.x, p.y + 32, w - 10);
      ctx.fillStyle = '#334155'; ctx.fillRect(p.x - 55, p.y + 40, 110, 8); ctx.fillStyle = COLORS.home; ctx.fillRect(p.x - 55, p.y + 40, 110 * unit.hpRatio, 8);
      ctx.fillStyle = '#d6b763'; ctx.fillRect(p.x - 55, p.y + 52, 110 * unit.stats.energy / unit.stats.maxEnergy, 4);
    }
    this.floating = this.floating.map(item => ({ ...item, life: item.life - dt })).filter(item => item.life > 0);
    for (const item of this.floating) {
      ctx.fillStyle = item.type === 'heal' ? '#9cf0c7' : item.crit ? '#ffd570' : item.damageType === 'magical' ? '#d6a0ff' : '#ff9b94';
      ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(item.type === 'miss' ? 'Hụt' : `${item.type === 'heal' ? '+' : '-'}${Math.ceil(item.amount)}`, x + (item.position.x + .5) * w, y + item.position.y * h + 20 - (1 - item.life / .8) * 25);
    }
    ctx.textAlign = 'left'; ctx.font = '16px monospace'; ctx.fillStyle = '#c7d7df'; ctx.fillText(`${this.battle.elapsed.toFixed(1)} / 120 giây`, x, 515);
  }
}
