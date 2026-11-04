/**
 * GameEngine.js — Vòng lặp chính.
 *
 * - requestAnimationFrame + DeltaTime thực.
 * - Mô phỏng chạy theo bước CỐ ĐỊNH (FIXED_STEP) với thời gian đã nhân TimeScale:
 *   x1/x2/x3 chỉ làm chạy nhiều bước hơn mỗi frame -> kết quả trận đánh y hệt nhau ở mọi tốc độ.
 * - Pause = TimeScale 0: ngừng mô phỏng nhưng vẫn vẽ lại (UI còn phản hồi).
 * - Tab bị ẩn: bỏ mốc thời gian cũ, quay lại không bị "nhảy" thời gian.
 */
import { CONFIG } from '../config.js';
import { bus, EVT } from './EventBus.js';

export class GameEngine {
  constructor({ eventBus = bus } = {}) {
    this.bus = eventBus;
    this.running = false;
    this.timeScale = CONFIG.TIME.DEFAULT_SCALE;
    this._lastScale = this.timeScale > 0 ? this.timeScale : 1; // để resume sau pause

    this.simTime = 0;          // Tổng giây mô phỏng (đã tính TimeScale)
    this.realTime = 0;         // Tổng giây thực
    this.frameCount = 0;
    this.tickCount = 0;
    this.fps = 0;

    this._rafId = 0;
    this._lastTs = null;
    this._accumulator = 0;
    this._fpsAcc = 0;
    this._fpsFrames = 0;
    this._logAcc = 0;

    this._updaters = new Set(); // fn(dt, simTime)  — logic, bước cố định
    this._renderers = new Set();// fn(alpha, frameDt) — vẽ mỗi frame

    this._loop = this._loop.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
  }

  /** Đăng ký hệ thống logic. Trả về hàm huỷ. */
  addUpdater(fn) { this._updaters.add(fn); return () => this._updaters.delete(fn); }
  /** Đăng ký hàm vẽ. Trả về hàm huỷ. */
  addRenderer(fn) { this._renderers.add(fn); return () => this._renderers.delete(fn); }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastTs = null; // frame đầu tiên chỉ lấy mốc
    document.addEventListener('visibilitychange', this._onVisibility);
    this._rafId = requestAnimationFrame(this._loop);
    this.bus.emit(EVT.ENGINE_START, { timeScale: this.timeScale });
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this._rafId);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.bus.emit(EVT.ENGINE_STOP, { simTime: this.simTime });
  }

  get resumeScale() { return this._lastScale; }

  restoreClock(simTime, tickCount) {
    if (!Number.isFinite(simTime) || simTime < 0 || !Number.isInteger(tickCount) || tickCount < 0) {
      throw new Error('Đồng hồ bản lưu không hợp lệ.');
    }
    this.resetClock(); this.simTime = simTime; this.tickCount = tickCount;
    this._lastTs = null;
  }

  get paused() { return this.timeScale === 0; }

  /** Đặt hệ số thời gian: 0 (pause), 1, 2, 3. */
  setTimeScale(scale) {
    if (!CONFIG.TIME.SCALES.includes(scale)) {
      console.warn(`[GameEngine] TimeScale ${scale} không hợp lệ. Cho phép: ${CONFIG.TIME.SCALES.join(', ')}`);
      return;
    }
    if (scale === this.timeScale) return;
    if (scale > 0) this._lastScale = scale;
    const prev = this.timeScale;
    this.timeScale = scale;
    this.bus.emit(EVT.TIMESCALE_CHANGED, { from: prev, to: scale });
  }

  pause() { this.setTimeScale(0); }
  resume() { this.setTimeScale(this._lastScale); }
  togglePause() { this.paused ? this.resume() : this.pause(); }

  /** Đặt lại đồng hồ (dùng khi vào trận mới). */
  resetClock() { this.simTime = 0; this.tickCount = 0; this._accumulator = 0; this._logAcc = 0; }

  _onVisibility() {
    this._lastTs = null; // tránh dt khổng lồ khi quay lại tab
  }

  _loop(ts) {
    if (!this.running) return;
    this._rafId = requestAnimationFrame(this._loop);

    if (document.hidden) { this._lastTs = null; return; }
    if (this._lastTs === null) { this._lastTs = ts; return; }
    const T = CONFIG.TIME;
    const frameDt = Math.max(0, Math.min((ts - this._lastTs) / 1000, T.MAX_FRAME_DELTA)); // giây thực, đã chặn trần
    this._lastTs = ts;
    this.realTime += frameDt;
    this.frameCount++;

    // FPS trung bình mỗi 0.5s
    this._fpsAcc += frameDt; this._fpsFrames++;
    if (this._fpsAcc >= 0.5) { this.fps = this._fpsFrames / this._fpsAcc; this._fpsAcc = 0; this._fpsFrames = 0; }

    // --- Mô phỏng (fixed step, đã nhân TimeScale) ---
    this._accumulator += frameDt * this.timeScale;
    let steps = 0;
    while (this._accumulator >= T.FIXED_STEP && steps < T.MAX_STEPS_PER_FRAME) {
      this._step(T.FIXED_STEP);
      this._accumulator -= T.FIXED_STEP;
      steps++;
    }
    if (steps === T.MAX_STEPS_PER_FRAME) this._accumulator = 0; // bỏ phần dư, tránh dồn nợ

    // --- Vẽ (mỗi frame, kể cả khi pause) ---
    const alpha = this._accumulator / T.FIXED_STEP; // 0..1 để nội suy hình ảnh
    for (const render of this._renderers) {
      try { render(alpha, frameDt); } catch (e) { console.error('[GameEngine] Lỗi renderer:', e); }
    }
    this.bus.emit(EVT.FRAME, { frameDt, alpha, fps: this.fps });
  }

  _step(dt) {
    this.simTime += dt;
    this.tickCount++;
    for (const update of this._updaters) {
      try { update(dt, this.simTime); } catch (e) { console.error('[GameEngine] Lỗi updater:', e); }
    }
    this.bus.emit(EVT.TICK, { dt, simTime: this.simTime, timeScale: this.timeScale });

    if (CONFIG.DEBUG) {
      this._logAcc += dt;
      if (this._logAcc >= CONFIG.TIME.TICK_LOG_INTERVAL) {
        this._logAcc -= CONFIG.TIME.TICK_LOG_INTERVAL;
        console.log(
          `[tick #${this.tickCount}] sim=${this.simTime.toFixed(2)}s  dt=${dt.toFixed(4)}  ` +
          `x${this.timeScale}  real=${this.realTime.toFixed(2)}s  fps=${this.fps.toFixed(0)}`
        );
      }
    }
  }
}
