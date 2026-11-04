/**
 * main.js — Bản thử Sprint 3: engine, lưu trữ và kỳ phổ giang hồ.
 * Sẽ được thay bằng bootstrap hoàn chỉnh ở Sprint 10.
 */
import { CONFIG } from './config.js';
import { bus, EVT } from './core/EventBus.js';
import { GameEngine } from './core/GameEngine.js';
import { mountCodexUI } from './ui/CodexUI.js';
import { mountSaveUI } from './ui/SaveUI.js';

const C = CONFIG.COLORS;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const W = CONFIG.VIEW.WIDTH, H = CONFIG.VIEW.HEIGHT;
// Keep logical coordinates stable; scale backing pixels for sharp HiDPI rendering.
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const scale = canvas.getBoundingClientRect().width / W * dpr;
  canvas.width = Math.max(1, Math.round(W * scale));
  canvas.height = Math.max(1, Math.round(H * scale));
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
}
if (!ctx) throw new Error('Trình duyệt không hỗ trợ Canvas 2D.');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const engine = new GameEngine();
window.__engine = engine; // tiện kiểm thử trong console: __engine.setTimeScale(3)

// ---- Trạng thái demo: 1 chấm chạy qua lại để thấy rõ TimeScale ----
const demo = { x: 0, dir: 1 };
function newSession() {
  return {
    schemaVersion: 1, version: CONFIG.VERSION, playtimeSeconds: 0,
    hero: { name: 'Tiểu Hiệp', sect: null, level: 1, exp: 0, freeAttributePoints: 0,
      attributes: {}, allocatedSkills: [], equippedGear: {} },
    party: { active: [], unlocked: [], formation: {} }, inventory: [], companionsAffinity: {},
    storyProgress: { currentAct: 1, activeQuestId: null, questFlags: {}, karmaScore: 0 }
  };
}
let session = newSession();
bus.on(EVT.FRAME, ({ frameDt }) => {
  if (!engine.paused && !document.hidden) session.playtimeSeconds += frameDt;
});
function getSnapshot() {
  return { ...structuredClone(session), version: CONFIG.VERSION, timestamp: Date.now(), engineDemo: { x: demo.x, dir: demo.dir,
    simTime: engine.simTime, tickCount: engine.tickCount, timeScale: engine.timeScale,
    resumeScale: engine.paused ? engine.resumeScale : engine.timeScale } };
}
function restoreSnapshot(data) {
  session = structuredClone(data);
  const saved = session.engineDemo; delete session.engineDemo;
  demo.x = saved?.x ?? 0; demo.dir = saved?.dir ?? 1;
  engine.restoreClock(saved?.simTime ?? 0, saved?.tickCount ?? 0);
  engine.setTimeScale(saved?.resumeScale ?? 1);
  engine.setTimeScale(saved?.timeScale ?? 1);
  logAcc = 0; logEl.replaceChildren();
}
const SPEED = 1.0; // vòng/giây mô phỏng (cả đi lẫn về = 1 chu kỳ)
engine.addUpdater((dt) => {
  demo.x += demo.dir * dt * SPEED * 2;
  if (demo.x >= 1) { demo.x = 1; demo.dir = -1; }
  if (demo.x <= 0) { demo.x = 0; demo.dir = 1; }
});

// ---- Vẽ lưới 6x3 theo config ----
const PAD = 40, GRID_W = W - PAD * 2, GRID_H = H - 170;
const cellW = GRID_W / CONFIG.GRID.COLS, cellH = GRID_H / CONFIG.GRID.ROWS;
const GRID_Y = 60;

function drawGrid() {
  for (let c = 0; c < CONFIG.GRID.COLS; c++) {
    const home = CONFIG.GRID.HOME_COLS.includes(c);
    for (let r = 0; r < CONFIG.GRID.ROWS; r++) {
      const x = PAD + c * cellW, y = GRID_Y + r * cellH;
      ctx.fillStyle = home ? 'rgba(111,181,155,0.12)' : 'rgba(194,65,47,0.12)';
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
      ctx.strokeStyle = home ? 'rgba(111,181,155,0.45)' : 'rgba(194,65,47,0.45)';
      ctx.strokeRect(x + 2.5, y + 2.5, cellW - 5, cellH - 5);
    }
  }
}

function render() {
  ctx.fillStyle = C.mist; ctx.fillRect(0, 0, W, H);
  ctx.font = '20px serif'; ctx.textBaseline = 'middle';
  ctx.fillStyle = C.jade; ctx.fillText('Đội nhà', PAD, 30);
  ctx.fillStyle = C.seal; ctx.textAlign = 'right'; ctx.fillText('Địch', W - PAD, 30); ctx.textAlign = 'left';

  drawGrid();

  // Thanh chạy: chấm di chuyển theo thời gian mô phỏng
  const barY = GRID_Y + GRID_H + 40, barX = PAD, barW = GRID_W;
  ctx.strokeStyle = C.slate; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(barX, barY); ctx.lineTo(barX + barW, barY); ctx.stroke();
  ctx.fillStyle = engine.paused ? C.seal : C.gold;
  ctx.beginPath(); ctx.arc(barX + demo.x * barW, barY, 12, 0, Math.PI * 2); ctx.fill();

  // Thông số
  ctx.font = '15px ui-monospace, Menlo, Consolas, monospace'; ctx.fillStyle = C.paper;
  ctx.fillText(`FPS ${engine.fps.toFixed(0)}   Tick ${engine.tickCount}   Sim ${engine.simTime.toFixed(1)}s   Tốc độ ${engine.paused ? 'TẠM DỪNG' : 'x' + engine.timeScale}`, PAD, H - 30);
}
engine.addRenderer(render);

// ---- Điều khiển ----
const btnPause = document.getElementById('btn-pause');
const speedBtns = [...document.querySelectorAll('[data-scale]')];

function syncButtons() {
  document.getElementById('engine-status').textContent = engine.paused ? 'Đã tạm dừng' : `Đang chạy ×${engine.timeScale}`;
  btnPause.setAttribute('aria-pressed', String(engine.paused));
  btnPause.textContent = engine.paused ? 'Tiếp tục' : 'Tạm dừng';
  speedBtns.forEach((b) => b.setAttribute('aria-pressed', String(!engine.paused && Number(b.dataset.scale) === engine.timeScale)));
}
bus.on(EVT.TIMESCALE_CHANGED, syncButtons);

btnPause.addEventListener('click', () => engine.togglePause());
speedBtns.forEach((b) => b.addEventListener('click', () => engine.setTimeScale(Number(b.dataset.scale))));
window.addEventListener('keydown', (e) => {
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.target.closest('button, input, textarea, select, summary, [contenteditable]')) return;
  if (e.code === 'Space') { e.preventDefault(); engine.togglePause(); }
  else if (['Digit1', 'Digit2', 'Digit3'].includes(e.code)) engine.setTimeScale(Number(e.code.slice(-1)));
});

// ---- Nhật ký tick hiển thị trên trang (mỗi 1 giây mô phỏng) ----
const logEl = document.getElementById('tick-log');
let logAcc = 0;
bus.on(EVT.TICK, ({ dt, simTime, timeScale }) => {
  logAcc += dt;
  if (logAcc < CONFIG.TIME.TICK_LOG_INTERVAL) return;
  logAcc -= CONFIG.TIME.TICK_LOG_INTERVAL;
  const li = document.createElement('li');
  li.textContent = `#${engine.tickCount}  sim=${simTime.toFixed(2)}s  dt=${dt.toFixed(4)}  x${timeScale}`;
  logEl.prepend(li);
  while (logEl.children.length > 40) logEl.lastChild.remove();
});

syncButtons();
mountCodexUI();
// Restore the auto-save before starting the clock, so startup cannot overwrite it.
window.__storage = await mountSaveUI({ getSnapshot, restoreSnapshot, engine,
  resetSession() { restoreSnapshot(newSession()); } });
engine.start();
document.getElementById('loading-screen').hidden = true;
console.info(`[Võ Lâm Hài Hiệp Truyện] v${CONFIG.VERSION} — Sprint 3 sẵn sàng. Thử: __engine.setTimeScale(3)`);
