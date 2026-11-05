import test from 'node:test';
import assert from 'node:assert/strict';
import { SoundManager } from '../src/audio/SoundManager.js';
function parameter() { return { setValueAtTime() {}, exponentialRampToValueAtTime() {} }; }
class Context {
  constructor() { this.currentTime = 0; this.state = 'suspended'; this.destination = {}; this.started = 0; }
  async resume() { this.state = 'running'; }
  createGain() { return { gain: parameter(), connect() {}, disconnect() {} }; }
  createOscillator() { const context = this; return { frequency: parameter(), connect() {}, disconnect() {}, start() { context.started++; }, stop() { this.onended?.(); } }; }
  async close() { this.state = 'closed'; }
}
test('audio remains silent until consent, schedules BGM/SFX and stops timers on mute/visibility/dispose', async () => {
  globalThis.document = { hidden: false };
  const sound = new SoundManager({ AudioContext: Context }); sound.sfx('hit'); assert.equal(sound.context, null);
  await sound.unlock(); assert.equal(sound.timer, null); sound.setMuted(false); assert.ok(sound.timer); assert.ok(sound.context.started > 0);
  sound.sfx('ultimate'); sound.sfx('magic'); sound.sfx('death'); sound.setVolume(.5); assert.throws(() => sound.setVolume(2));
  sound.setTrack('battle'); assert.ok(sound.timer); document.hidden = true; sound.visibilityChanged(); assert.equal(sound.timer, null);
  document.hidden = false; sound.visibilityChanged(); assert.ok(sound.timer);
  sound.setMuted(true); assert.equal(sound.timer, null); await sound.dispose(); assert.equal(sound.context, null);
});
test('unsupported audio rejects clearly without creating a timer', async () => {
  const sound = new SoundManager({ AudioContext: null }); await assert.rejects(sound.unlock(), /chưa hỗ trợ/); assert.equal(sound.timer, null);
});
