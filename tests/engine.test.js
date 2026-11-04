import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/core/GameEngine.js';
import { EventBus } from '../src/core/EventBus.js';

globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };
let scheduled = 0;
globalThis.requestAnimationFrame = () => ++scheduled;
globalThis.cancelAnimationFrame = () => {};
function create() { document.hidden = false; return new GameEngine({ eventBus: new EventBus() }); }
function advance(engine, start, frames = 60) {
  for (let i = 1; i <= frames; i++) engine._loop(start + i * 1000 / 60);
}
test('x1/x2/x3 use fixed steps and simulate proportional time', () => {
  for (const scale of [1, 2, 3]) {
    const e = create(); const deltas = [];
    e.addUpdater(dt => deltas.push(dt));
    e.setTimeScale(scale); e.start(); e._loop(0); advance(e, 0);
    assert.ok(Math.abs(e.simTime - scale) < 1 / 60 + 1e-9);
    assert.ok(deltas.every(dt => dt === 1 / 60));
    e.stop();
  }
});
test('pause freezes simulation, keeps rendering and resumes last speed', () => {
  const e = create(); let renders = 0;
  e.addRenderer(() => renders++); e.setTimeScale(3); e.start(); e._loop(0);
  advance(e, 0); e.pause(); const ticks = e.tickCount; const before = renders;
  advance(e, 1000);
  assert.equal(e.tickCount, ticks); assert.ok(renders > before);
  e.resume(); assert.equal(e.timeScale, 3); advance(e, 2000);
  assert.ok(e.tickCount > ticks); e.stop();
});
test('hidden tabs do not simulate or catch up on return', () => {
  const e = create(); e.start(); e._loop(0); advance(e, 0);
  const before = e.tickCount;
  document.hidden = true; e._onVisibility(); e._loop(5000);
  assert.equal(e.tickCount, before);
  document.hidden = false; e._onVisibility(); e._loop(60000);
  assert.equal(e.tickCount, before);
  e._loop(60000 + 1000 / 60); assert.ok(e.tickCount - before <= 1);
  e.stop();
});
test('start is idempotent; stop and restart discard elapsed wall time', () => {
  const e = create(); e.start(); const count = scheduled; e.start();
  assert.equal(scheduled, count); e._loop(0); advance(e, 0);
  e.stop(); const ticks = e.tickCount; e._loop(50000); assert.equal(e.tickCount, ticks);
  e.start(); e._loop(60000); assert.equal(e.tickCount, ticks); e.stop();
});
test('long frames are bounded; resetClock clears simulation', () => {
  const e = create(); e.start(); e.setTimeScale(3); e._loop(0); e._loop(60000);
  assert.ok(e.simTime <= .3 + 1e-9); e.resetClock();
  assert.equal(e.simTime, 0); assert.equal(e.tickCount, 0); assert.equal(e._accumulator, 0); e.stop();
});
