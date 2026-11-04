import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { StorageManager, validateSnapshot } from '../src/core/StorageManager.js';

export function snapshot(name = 'Tiểu Hiệp — Giang 湖') {
  return { schemaVersion: 1, version: '0.2.0', playtimeSeconds: 123.5,
    hero: { name, sect: null, level: 1, exp: 0, attributes: {}, allocatedSkills: [], equippedGear: {} },
    party: { active: [], unlocked: [], formation: {} }, inventory: [], companionsAffinity: {},
    storyProgress: { currentAct: 1, questFlags: {}, activeQuestId: null, karmaScore: 0 },
    engineDemo: { simTime: 3, tickCount: 180, x: .25, dir: -1, timeScale: 0, resumeScale: 3 } };
}
function memory() {
  const map = new Map();
  return { getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k) };
}
for (const backend of ['indexedDB', 'localStorage']) {
  test(`${backend}: six isolated slots survive manager reload; snapshots are detached`, async () => {
    const options = { indexedDB: backend === 'indexedDB' ? new IDBFactory() : null, localStorage: memory() };
    const s = new StorageManager(options); assert.equal(await s.init(), backend);
    for (let id = 0; id < 6; id++) await s.save(id, snapshot(`Hiệp ${id}`));
    const data = snapshot('Gốc'); const pending = s.save(2, data); data.hero.name = 'Đã đổi'; await pending;
    const reload = new StorageManager(options);
    assert.equal((await reload.load(2)).data.hero.name, 'Gốc');
    for (let id of [0, 1, 3, 4, 5]) assert.equal((await reload.load(id)).data.hero.name, `Hiệp ${id}`);
    await reload.autoSave(snapshot('Mới')); assert.equal((await reload.load(1)).data.hero.name, 'Hiệp 1');
    const list = await reload.listSlots(); assert.equal(list.length, 6); assert.ok(list.every(x => x.record && !x.error));
    const loaded = await reload.load(1); loaded.data.hero.name = 'Mutation';
    assert.equal((await reload.load(1)).data.hero.name, 'Hiệp 1');
    s.db?.close(); reload.db?.close();
  });
}
test('Unicode compressed export/import round trip and rejects corruption without overwriting', async () => {
  const s = new StorageManager({ indexedDB: null, localStorage: memory() });
  const data = snapshot(); const text = await s.exportSave(data);
  assert.equal(JSON.parse(text).codec, 'deflate');
  assert.deepEqual(await s.decodeSave(text), data);
  await s.importSave(text, 5); assert.deepEqual((await s.load(5)).data, data);
  const before = await s.load(5);
  const file = JSON.parse(text); file.checksum = '0'.repeat(64);
  for (const bad of ['no json', '{}', JSON.stringify(file), JSON.stringify({ ...JSON.parse(text), version: 99 })]) {
    await assert.rejects(s.importSave(bad, 5));
    assert.deepEqual(await s.load(5), before);
  }
  await assert.rejects(s.importSave(text, 0), /thủ công/);
});
test('uncompressed exports work without CompressionStream', async () => {
  const old = globalThis.CompressionStream;
  try {
    globalThis.CompressionStream = undefined;
    const s = new StorageManager(); const data = snapshot(); const text = await s.exportSave(data);
    assert.equal(JSON.parse(text).codec, 'json'); assert.deepEqual(await s.decodeSave(text), data);
  } finally { globalThis.CompressionStream = old; }
});
test('schema checks reject unsafe keys, unsupported versions, invalid numbers and large input', async () => {
  const s = new StorageManager();
  for (const change of [x => x.schemaVersion = 99, x => x.playtimeSeconds = Infinity,
    x => x.hero = {}, x => x.party.active = ['missing'], x => x.engineDemo.x = 10,
    x => x.storyProgress.currentAct = 4]) {
    const data = snapshot(); change(data); assert.throws(() => validateSnapshot(data));
  }
  const unsafe = snapshot(); unsafe.extra = JSON.parse('{"__proto__":{}}');
  assert.throws(() => validateSnapshot(unsafe));
  const huge = snapshot(); huge.extra = 'x'.repeat(1024 * 1024); assert.throws(() => validateSnapshot(huge));
  await assert.rejects(s.decodeSave('x'.repeat(2 * 1024 * 1024 + 1)));
  assert.throws(() => s.save(6, snapshot()));
});
test('corrupt local slot is reported independently; failed writes keep old data', async () => {
  const local = memory(); const s = new StorageManager({ indexedDB: null, localStorage: local });
  await s.save(1, snapshot()); await s.save(2, snapshot('Hai'));
  local.setItem('wuxia:save:v1:1', '{bad');
  const slots = await s.listSlots(); assert.ok(slots[1].error); assert.equal(slots[2].record.data.hero.name, 'Hai');
  const oldSet = local.setItem;
  local.setItem = () => { throw new Error('QuotaExceededError'); };
  await assert.rejects(s.save(2, snapshot('Mất?')), /Quota/);
  assert.equal((await s.load(2)).data.hero.name, 'Hai');
  local.setItem = oldSet;
  await s.save(2, snapshot('Hồi phục')); assert.equal((await s.load(2)).data.hero.name, 'Hồi phục');
});
test('denied/blocked IndexedDB falls back; later sessions retain fallback slots', async () => {
  const local = memory();
  const denied = { open() { throw new Error('SecurityError'); } };
  const first = new StorageManager({ indexedDB: denied, localStorage: local });
  assert.equal(await first.init(), 'localStorage'); await first.save(1, snapshot());
  const second = new StorageManager({ indexedDB: new IDBFactory(), localStorage: local });
  assert.equal(await second.init(), 'localStorage'); assert.equal((await second.load(1)).data.hero.name, snapshot().hero.name);
  const blocked = new StorageManager({ indexedDB: { open: () => ({}) }, localStorage: memory(), timeout: 10 });
  assert.equal(await blocked.init(), 'localStorage');
});
test('both storage backends denied still permits file export', async () => {
  const s = new StorageManager({ indexedDB: null, localStorage: { setItem() { throw new Error('Denied'); }, getItem() { throw new Error('Denied'); } } });
  await assert.rejects(s.init(), /chặn lưu trữ/);
  assert.deepEqual(await s.decodeSave(await s.exportSave(snapshot())), snapshot());
});
test('decompression bomb is bounded before JSON parsing', async () => {
  const bytes = new TextEncoder().encode(' '.repeat(2 * 1024 * 1024));
  const compressed = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
  const payload = btoa(String.fromCharCode(...compressed));
  const s = new StorageManager();
  await assert.rejects(s.decodeSave(JSON.stringify({ format: 'wuxia', version: 1, codec: 'deflate', checksum: '0'.repeat(64), payload })), /vượt quá/);
});
