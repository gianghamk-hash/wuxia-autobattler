/**
 * EventBus.js — Pub/Sub độc lập. Các module chỉ nói chuyện qua sự kiện, không import chéo nhau.
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._handlers = new Map();
  }

  /** Đăng ký lắng nghe. Trả về hàm huỷ đăng ký. */
  on(event, handler) {
    if (typeof handler !== 'function') throw new TypeError(`EventBus.on("${event}"): handler phải là function`);
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());
    this._handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  /** Lắng nghe đúng 1 lần. */
  once(event, handler) {
    const off = this.on(event, (...args) => { off(); handler(...args); });
    return off;
  }

  off(event, handler) {
    const set = this._handlers.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this._handlers.delete(event);
  }

  /** Phát sự kiện. Lỗi trong 1 handler không làm hỏng các handler còn lại. */
  emit(event, payload) {
    const set = this._handlers.get(event);
    if (!set) return 0;
    let count = 0;
    for (const handler of [...set]) { // copy: handler có thể tự off() khi đang chạy
      try { handler(payload); count++; }
      catch (err) { console.error(`[EventBus] Lỗi tại handler của "${event}":`, err); }
    }
    return count;
  }

  clear(event) {
    if (event) this._handlers.delete(event); else this._handlers.clear();
  }
}

/** Bus dùng chung toàn game. */
export const bus = new EventBus();

/** Tên sự kiện chuẩn — dùng hằng số thay vì chuỗi tự do để tránh gõ sai. */
export const EVT = Object.freeze({
  SAVE_REQUESTED: 'save:requested', // checkpoint: chiến thắng, hội thoại, đổi trang bị
  ENGINE_START: 'engine:start',
  ENGINE_STOP: 'engine:stop',
  TIMESCALE_CHANGED: 'engine:timescale',
  TICK: 'engine:tick',           // { dt, simTime, timeScale }  (mỗi bước mô phỏng cố định)
  FRAME: 'engine:frame',         // { frameDt, alpha, fps }     (mỗi frame vẽ)
  STATE_CHANGED: 'state:changed',// { from, to, data }
});
