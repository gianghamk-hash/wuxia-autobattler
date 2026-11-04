import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('real HTML and bootstrap connect canvas, controls, resize and bounded tick log', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const nodes = new Map();
  function element() {
    return {
      children: [], handlers: {}, attributes: {}, hidden: false,
      addEventListener(type, fn) { this.handlers[type] = fn; },
      setAttribute(key, value) { this.attributes[key] = value; },
      prepend(child) { this.children.unshift(child); child.remove = () => this.children.pop(); },
      get lastChild() { return this.children.at(-1); }
    };
  }
  for (const match of html.matchAll(/id="([^"]+)"/g)) nodes.set(match[1], element());
  const speeds = [...html.matchAll(/data-scale="(\d+)"/g)].map(m => Object.assign(element(), { dataset: { scale: m[1] } }));
  const canvas = nodes.get('game-canvas');
  let drawCalls = 0;
  const ctx = new Proxy({}, { get: () => (...args) => {
    for (const n of args.filter(x => typeof x === 'number')) assert.ok(Number.isFinite(n));
    drawCalls++;
  }, set: () => true });
  canvas.getContext = () => ctx;
  let width = 960; canvas.getBoundingClientRect = () => ({ width });
  globalThis.document = { hidden: false, getElementById: id => nodes.get(id), querySelectorAll: () => speeds,
    createElement: element, addEventListener() {}, removeEventListener() {} };
  const handlers = {};
  globalThis.window = { devicePixelRatio: 2, addEventListener: (type, fn) => handlers[type] = fn };
  globalThis.requestAnimationFrame = () => 1; globalThis.cancelAnimationFrame = () => {};
  await import('../src/main.js');
  const e = window.__engine;
  assert.ok(e.running); assert.equal(nodes.get('loading-screen').hidden, true);
  e._loop(0); e._loop(20); assert.ok(drawCalls > 0);
  assert.equal(canvas.width, 1920);
  speeds[2].handlers.click(); assert.equal(e.timeScale, 3);
  nodes.get('btn-pause').handlers.click(); assert.equal(e.paused, true);
  assert.equal(nodes.get('btn-pause').attributes['aria-pressed'], 'true');
  nodes.get('btn-pause').handlers.click(); assert.equal(e.timeScale, 3);
  handlers.keydown({ code: 'Digit2', target: { closest: () => null } }); assert.equal(e.timeScale, 2);
  for (let i = 0; i < 50; i++) e.bus.emit('engine:tick', { dt: 1, simTime: i, timeScale: 2 });
  assert.equal(nodes.get('tick-log').children.length, 40);
  width = 340; handlers.resize(); assert.equal(canvas.width, 680);
  e._loop(40); e.stop();
});
