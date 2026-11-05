import { SECT_ART } from './Visuals.js';
const COLORS = { home: '#90ddbf', enemy: '#f4a18d' };
function rounded(ctx, x, y, width, height, radius = 5) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') { ctx.roundRect(x, y, width, height, radius); return; }
  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y); ctx.lineTo(x + width - r, y); ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r); ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
/** Visual projection only: combat still uses the original six-column tactical grid. */
export class BattleRenderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    if (!this.ctx) throw new Error('Trình duyệt không hỗ trợ Canvas 2D.');
    this.battle = null; this.positions = new Map(); this.floating = []; this.effects = []; this.portrait = false; this.width = 960; this.height = 540;
    this.atlas = new Image(); this.atlas.src = new URL('../../assets/images/sect-portraits.webp', import.meta.url).href;
    this.environment = new Image(); this.environment.onload = () => { this.backdrop = null; };
    this.environment.src = new URL('../../assets/images/jianghu-village.webp', import.meta.url).href; this.backdrop = null;
  }
  setBattle(battle) { this.battle = battle; this.positions.clear(); this.floating = []; this.effects = []; }
  event(event) {
    if (['damage', 'heal', 'miss'].includes(event.type) && event.position) {
      this.floating.push({ ...event, life: .85 }); if (this.floating.length > 30) this.floating.shift();
      if (event.type !== 'miss') this.effects.push({ ...event, life: .3, duration: .3 });
    }
    if (event.type === 'ultimate') {
      const actor = this.battle?.units.find(unit => unit.id === event.actorId);
      if (actor?.gridPosition) this.effects.push({ type: 'ultimate', position: { ...actor.gridPosition }, life: .6, duration: .6 });
    }
    if (this.effects.length > 24) this.effects.shift();
  }
  resize() {
    const cssWidth = this.canvas.getBoundingClientRect().width || 960;
    this.portrait = cssWidth < 600; this.width = this.portrait ? 600 : 960; this.height = this.portrait ? 800 : 540;
    this.canvas.style.aspectRatio = `${this.width} / ${this.height}`;
    const scale = Math.min(globalThis.devicePixelRatio || 1, 3) * cssWidth / this.width;
    this.canvas.width = Math.round(this.width * scale); this.canvas.height = Math.round(this.height * scale);
    this.ctx.setTransform(this.canvas.width / this.width, 0, 0, this.canvas.height / this.height, 0, 0); this.backdrop = null;
  }
  project(position) {
    return this.portrait ? { x: 30 + (position.y + .5) * 180, y: 69 + (5 - position.x + .5) * 110 } : { x: 30 + (position.x + .5) * 150, y: 72 + (position.y + .5) * 130 };
  }
  drawBoard() {
    if (this.backdrop) return this.backdrop;
    const canvas = document.createElement('canvas'); canvas.width = this.width; canvas.height = this.height; const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height); gradient.addColorStop(0, '#4d6b5a'); gradient.addColorStop(.5, '#314e49'); gradient.addColorStop(1, '#1e3a3d');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, this.width, this.height);
    if (this.environment.complete && this.environment.naturalWidth) {
      ctx.globalAlpha = .2; const ratio = Math.max(this.width / this.environment.width, this.height / this.environment.height);
      ctx.drawImage(this.environment, (this.width - this.environment.width * ratio) / 2, (this.height - this.environment.height * ratio) / 2, this.environment.width * ratio, this.environment.height * ratio); ctx.globalAlpha = 1;
    }
    ctx.lineWidth = 1;
    for (let col = 0; col < 6; col++) for (let row = 0; row < 3; row++) {
      const center = this.project({ x: col, y: row }), w = this.portrait ? 180 : 150, h = this.portrait ? 110 : 130;
      const x = center.x - w / 2 + 3, y = center.y - h / 2 + 3;
      rounded(ctx, x, y + 3, w - 6, h - 6, 7); ctx.fillStyle = '#09292766'; ctx.fill();
      const slab = ctx.createLinearGradient(x, y, x, y + h); slab.addColorStop(0, col < 3 ? '#71948045' : '#ab91714a'); slab.addColorStop(1, col < 3 ? '#345a4b77' : '#5e504a66');
      rounded(ctx, x, y, w - 6, h - 8, 7); ctx.fillStyle = slab; ctx.fill(); ctx.strokeStyle = '#d6d5a12c'; ctx.stroke();
      ctx.fillStyle = '#dcd5ac35'; ctx.beginPath(); ctx.arc(x + 9, y + 8, 1.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#e3c88a66'; ctx.setLineDash([4, 7]); ctx.beginPath();
    if (this.portrait) { ctx.moveTo(38, 398); ctx.lineTo(562, 398); } else { ctx.moveTo(480, 82); ctx.lineTo(480, 450); }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign = 'center'; ctx.font = '600 15px Georgia, serif'; ctx.fillStyle = '#f7d0ad';
    if (this.portrait) { ctx.fillText('ĐỐI THỦ', 300, 32); ctx.fillStyle = '#c1edcf'; ctx.fillText('ĐỘI NHÀ', 300, 768); }
    else { ctx.fillStyle = '#c1edcf'; ctx.fillText('ĐỘI NHÀ', 170, 32); ctx.fillStyle = '#f7d0ad'; ctx.fillText('ĐỐI THỦ', 790, 32); }
    ctx.font = 'italic 12px Georgia, serif'; ctx.fillStyle = '#e8d3a4'; ctx.fillText('VÕ LÂM · LUẬN KIẾM', this.width / 2, this.portrait ? 54 : 32);
    this.backdrop = canvas; return canvas;
  }
  render(dt = 0) {
    const ctx = this.ctx; ctx.drawImage(this.drawBoard(), 0, 0);
    if (!this.battle) return;
    for (const unit of this.battle.units.filter(u => u.alive && u.gridPosition)) {
      const desired = this.project(unit.gridPosition), previous = this.positions.get(unit.id) ?? desired, blend = 1 - Math.exp(-dt * 14);
      const p = { x: previous.x + (desired.x - previous.x) * blend, y: previous.y + (desired.y - previous.y) * blend }; this.positions.set(unit.id, p);
      const art = SECT_ART[unit.sect] ?? SECT_ART.TuDo, w = this.portrait ? 64 : 74, h = this.portrait ? 65 : 78, top = p.y - (this.portrait ? 43 : 49);
      ctx.fillStyle = '#001c2855'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 25, w * .7, 9, 0, 0, Math.PI * 2); ctx.fill();
      if (unit.shield > 0) { ctx.strokeStyle = '#8fceffa6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y - 6, w * .7, h * .65, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.save(); rounded(ctx, p.x - w / 2, top, w, h, 9); ctx.clip();
      if (this.atlas.complete && this.atlas.naturalWidth) {
        const part = this.atlas.width / 5; ctx.drawImage(this.atlas, art.index * part, 0, part, part * h / w, p.x - w / 2, top, w, h);
      } else {
        ctx.fillStyle = art.color; ctx.fillRect(p.x - w / 2, top, w, h); ctx.fillStyle = '#122f35'; ctx.font = '25px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText(art.sigil, p.x, top + h * .65);
      }
      ctx.restore();
      rounded(ctx, p.x - w / 2, top, w, h, 9); ctx.lineWidth = unit.state === 'ULTIMATE' ? 3 : 1.5; ctx.strokeStyle = unit.state === 'ULTIMATE' ? '#ffe8a4' : COLORS[unit.team]; ctx.stroke();
      const labelY = p.y + (this.portrait ? 34 : 43); ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = '#102c31'; ctx.strokeText(unit.name, p.x, labelY, this.portrait ? 166 : 140); ctx.fillStyle = '#fff2d6'; ctx.fillText(unit.name, p.x, labelY, this.portrait ? 166 : 140);
      const barWidth = this.portrait ? 92 : 94, barX = p.x - barWidth / 2, barY = labelY + 6;
      rounded(ctx, barX, barY, barWidth, 6, 3); ctx.fillStyle = '#09252e'; ctx.fill();
      rounded(ctx, barX, barY, Math.max(2, barWidth * unit.hpRatio), 6, 3); ctx.fillStyle = '#82dab0'; ctx.fill();
      rounded(ctx, barX, barY + 9, barWidth, 3, 2); ctx.fillStyle = '#09252e'; ctx.fill();
      if (unit.stats.energy > 0) { rounded(ctx, barX, barY + 9, barWidth * unit.stats.energy / unit.stats.maxEnergy, 3, 2); ctx.fillStyle = '#e9cc7d'; ctx.fill(); }
    }
    this.effects = this.effects.map(item => ({ ...item, life: item.life - dt })).filter(item => item.life > 0);
    for (const effect of this.effects) {
      const p = this.project(effect.position), t = 1 - effect.life / effect.duration; ctx.save(); ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = effect.type === 'heal' ? '#b0ffca' : effect.type === 'ultimate' ? '#ffe0a0' : effect.damageType === 'magical' ? '#dab6ff' : '#ffdbb1'; ctx.lineWidth = effect.type === 'ultimate' ? 3 : 2;
      if (effect.type === 'damage') { ctx.beginPath(); ctx.moveTo(p.x - 30 - 8 * t, p.y + 16); ctx.lineTo(p.x + 30 + 8 * t, p.y - 40); ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(p.x, p.y - 10, 25 + t * 70, 18 + t * 40, 0, 0, Math.PI * 2); ctx.stroke(); }
      if(effect.type==='ultimate'){for(let i=0;i<12;i++){const angle=i*2.4,reach=20+t*95;ctx.fillStyle=i%2?'#c9bd7b':'#d7e0a5';ctx.beginPath();ctx.ellipse(p.x+Math.cos(angle)*reach,p.y+Math.sin(angle)*reach*.55+t*25,3,1.4,angle+t*3,0,Math.PI*2);ctx.fill();}}
      ctx.restore();
    }
    this.floating = this.floating.map(item => ({ ...item, life: item.life - dt })).filter(item => item.life > 0);
    for (const item of this.floating) {
      const p = this.project(item.position), text = item.type === 'miss' ? 'HỤT' : `${item.type === 'heal' ? '+' : '−'}${Math.ceil(item.amount)}`;
      ctx.save(); ctx.globalAlpha = Math.min(1, item.life * 4); ctx.font = `800 ${item.crit ? 29 : 24}px Georgia, serif`; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#183237';
      const textY = p.y - 37 - (1 - item.life / .85) * 40; ctx.strokeText(text, p.x, textY);
      ctx.fillStyle = item.type === 'heal' ? '#acffcc' : item.statusType === 'poison' ? '#b4e765' : item.statusType === 'burn' ? '#ffb275' : item.crit ? '#ffe18a' : item.damageType === 'magical' ? '#d9b2ff' : '#ffb1a3'; ctx.fillText(text, p.x, textY); ctx.restore();
    }
  }
}
