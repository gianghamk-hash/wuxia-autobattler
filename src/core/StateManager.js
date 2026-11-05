/**
 * StateManager.js — Máy trạng thái cấp game: TITLE, ROSTER, BATTLE, DIALOGUE, CAMP.
 * (Bổ sung ngoài lộ trình gốc vì nhiều module cần dùng chung.)
 */
import { bus, EVT } from './EventBus.js';

export const GAME_STATE = Object.freeze({
  BOOT: 'BOOT', TITLE: 'TITLE', ROSTER: 'ROSTER', BATTLE: 'BATTLE', DIALOGUE: 'DIALOGUE', CAMP: 'CAMP', ENDING: 'ENDING',
});

/** Cho phép chuyển cảnh nào -> cảnh nào. */
const TRANSITIONS = {
  BOOT: ['TITLE'],
  TITLE: ['CAMP', 'DIALOGUE'],
  CAMP: ['ROSTER', 'DIALOGUE', 'BATTLE', 'TITLE', 'ENDING'],
  ROSTER: ['CAMP', 'BATTLE'],
  DIALOGUE: ['CAMP', 'BATTLE', 'TITLE', 'ENDING'],
  BATTLE: ['CAMP', 'DIALOGUE', 'TITLE'],
  ENDING: ['CAMP', 'TITLE'],
};

export class StateManager {
  constructor({ eventBus = bus, initial = GAME_STATE.BOOT } = {}) {
    this.bus = eventBus;
    this.current = initial;
    this.previous = null;
    this._enter = new Map(); // state -> Set<fn(data)>
    this._exit = new Map();
  }

  onEnter(state, fn) { return this._add(this._enter, state, fn); }
  onExit(state, fn) { return this._add(this._exit, state, fn); }

  _add(map, state, fn) {
    if (!map.has(state)) map.set(state, new Set());
    map.get(state).add(fn);
    return () => map.get(state).delete(fn);
  }

  is(state) { return this.current === state; }

  go(next, data = {}) {
    if (!Object.hasOwn(GAME_STATE, next)) throw new Error(`[StateManager] Trạng thái không tồn tại: ${next}`);
    if (!TRANSITIONS[this.current]?.includes(next)) {
      console.warn(`[StateManager] Không thể chuyển ${this.current} -> ${next}`);
      return false;
    }
    const from = this.current;
    this._run(this._exit, from, data);
    this.previous = from;
    this.current = next;
    this._run(this._enter, next, data);
    this.bus.emit(EVT.STATE_CHANGED, { from, to: next, data });
    return true;
  }

  _run(map, state, data) {
    for (const fn of map.get(state) ?? []) {
      try { fn(data); } catch (e) { console.error(`[StateManager] Lỗi hook ${state}:`, e); }
    }
  }
}
