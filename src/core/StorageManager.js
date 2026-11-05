import { validateCampaign } from './Campaign.js';
import { normalizeHeroBuild } from '../entities/HeroBuild.js';
/** Six independent slots. IndexedDB first; persistent LocalStorage fallback.
 * SHA-256 detects corruption, not deliberate editing (there is no secret key).
 */
export const SAVE_VERSION = 1;
export const MAX_SAVE_BYTES = 1024 * 1024;
const PREFIX = 'wuxia:save:v1:';
const MARKER = 'wuxia:storage:v1';
const plain = value => value && Object.getPrototypeOf(value) === Object.prototype;
const finite = value => Number.isFinite(value) && value >= 0;
const fail = message => { throw new Error(message); };

export function validateSnapshot(data) {
  // Reject non-JSON values and unsafe object keys, even for internal callers.
  function visit(value, depth = 0) {
    if (depth > 40) fail('Dữ liệu lưu quá nhiều cấp.');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
    if (typeof value === 'number' && Number.isFinite(value)) return;
    if (!Array.isArray(value) && !plain(value)) fail('Dữ liệu lưu không hợp lệ.');
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('Khóa dữ liệu không hợp lệ.');
      visit(item, depth + 1);
    }
  }
  visit(data);
  if (!plain(data) || data.schemaVersion !== SAVE_VERSION) fail('Phiên bản bản lưu chưa được hỗ trợ.');
  if (typeof data.version !== 'string' || !finite(data.playtimeSeconds)) fail('Thông tin bản lưu không hợp lệ.');
  if (!plain(data.hero) || typeof data.hero.name !== 'string' || !data.hero.name.trim() || data.hero.name.length > 80 ||
      !Number.isInteger(data.hero.level) || data.hero.level < 1 || !finite(data.hero.exp)) fail('Thông tin nhân vật không hợp lệ.');
  if (!plain(data.party) || !Array.isArray(data.party.active) || data.party.active.length > 5 ||
      !Array.isArray(data.party.unlocked) || !plain(data.party.formation) ||
      ![...data.party.active, ...data.party.unlocked].every(id => typeof id === 'string') ||
      new Set(data.party.active).size !== data.party.active.length ||
      !data.party.active.every(id => data.party.unlocked.includes(id))) fail('Đội hình không hợp lệ.');
  if (![null, 'ThieuLam', 'VoDang', 'CaiBang', 'NgaMi', 'DuongMon', 'TuDo'].includes(data.hero.sect) ||
      !plain(data.hero.attributes) || !Object.values(data.hero.attributes).every(finite) ||
      !Array.isArray(data.hero.allocatedSkills) || !data.hero.allocatedSkills.every(id => typeof id === 'string') ||
      !plain(data.hero.equippedGear)) fail('Thuộc tính nhân vật không hợp lệ.');
  if (data.party.unlocked.length > 50 || new Set(data.party.unlocked).size !== data.party.unlocked.length) fail('Danh sách đồng đội không hợp lệ.');
  const occupied = new Set();
  for (const [id, position] of Object.entries(data.party.formation)) {
    if (id !== 'hero' && !data.party.active.includes(id)) fail('Vị trí của nhân vật ngoài đội hình.');
    if (!plain(position) || !Number.isInteger(position.x) || !Number.isInteger(position.y) ||
        position.x < 0 || position.x > 2 || position.y < 0 || position.y > 2) fail('Ô đội hình không hợp lệ.');
    const key = `${position.x},${position.y}`;
    if (occupied.has(key)) fail('Các nhân vật không thể đứng cùng một ô.');
    occupied.add(key);
  }
  if (!Array.isArray(data.inventory) || !plain(data.companionsAffinity) || !plain(data.storyProgress) ||
      !Number.isInteger(data.storyProgress.currentAct) || data.storyProgress.currentAct < 1 || data.storyProgress.currentAct > 3 ||
      !plain(data.storyProgress.questFlags)) fail('Tiến trình không hợp lệ.');
  if (!data.inventory.every(item => plain(item) && typeof item.itemId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0) ||
      !Object.values(data.companionsAffinity).every(n => finite(n) && n <= 100) ||
      !Number.isFinite(data.storyProgress.karmaScore) ||
      !(data.storyProgress.activeQuestId === null || typeof data.storyProgress.activeQuestId === 'string')) fail('Vật phẩm hoặc nhiệm vụ không hợp lệ.');
  if (data.hero.buildVersion !== undefined) normalizeHeroBuild(data.hero, data.inventory);
  if (data.storyProgress.campaignVersion !== undefined) validateCampaign(data);
  // Sprint 2 demo snapshot; optional so future gameplay snapshots can omit it.
  if (data.engineDemo !== undefined) {
    const d = data.engineDemo;
    if (!plain(d) || !finite(d.simTime) || !Number.isInteger(d.tickCount) || d.tickCount < 0 ||
        !finite(d.x) || d.x > 1 || ![-1, 1].includes(d.dir) || ![0, 1, 2, 3].includes(d.timeScale) ||
        ![1, 2, 3].includes(d.resumeScale)) fail('Trạng thái mô phỏng không hợp lệ.');
  }
  const json = JSON.stringify(data);
  if (new TextEncoder().encode(json).length > MAX_SAVE_BYTES) fail('Bản lưu vượt quá 1 MB.');
  return JSON.parse(json);
}

async function hash(bytes) {
  if (!globalThis.crypto?.subtle) fail('Cần HTTPS hoặc localhost để kiểm tra bản lưu.');
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
}
async function transform(bytes, Stream) {
  const reader = new Blob([bytes]).stream().pipeThrough(new Stream('deflate')).getReader();
  const chunks = []; let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_SAVE_BYTES) { await reader.cancel(); fail('Bản lưu giải nén vượt quá 1 MB.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const out = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
  return out;
}
function slot(id) {
  if (!Number.isInteger(id) || id < 0 || id > 5) fail('Ô lưu phải từ 0 đến 5.');
}

export class StorageManager {
  constructor({ indexedDB = globalThis.indexedDB, localStorage, dbName = 'WuxiaChroniclesDB', timeout = 2500 } = {}) {
    this.idb = indexedDB;
    this.local = localStorage; // Access global storage lazily: its getter can throw.
    this.dbName = dbName; this.timeout = timeout; this.backend = null;
    this.db = null; this._ready = null; this._queue = Promise.resolve();
  }
  init() { return this._ready ??= this._init(); }
  async _init() {
    try { this.local ??= globalThis.localStorage; } catch { /* IndexedDB may still work. */ }
    let pinned = false;
    try { pinned = this.local?.getItem(MARKER) === 'localStorage'; } catch { /* Try IDB. */ }
    if (!pinned && this.idb) {
      try {
        this.db = await new Promise((resolve, reject) => {
          let expired = false;
          const timer = setTimeout(() => { expired = true; reject(new Error('IndexedDB timeout')); }, this.timeout);
          let request;
          try { request = this.idb.open(this.dbName, 1); } catch (error) { clearTimeout(timer); reject(error); return; }
          request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains('save_slots')) request.result.createObjectStore('save_slots', { keyPath: 'slotId' });
          };
          request.onsuccess = () => { clearTimeout(timer); if (expired) request.result.close(); else resolve(request.result); };
          request.onerror = () => { clearTimeout(timer); reject(request.error); };
          request.onblocked = () => { /* Bounded by timeout; never delete an existing DB. */ };
        });
        this.db.onversionchange = () => { this.db.close(); this.db = null; };
        this.backend = 'indexedDB'; return this.backend;
      } catch { /* Select a fallback once, never silently switch after a write fails. */ }
    }
    try {
      const key = PREFIX + 'probe'; this.local.setItem(key, '1'); this.local.removeItem(key);
      this.local.setItem(MARKER, 'localStorage'); this.backend = 'localStorage'; return this.backend;
    } catch { fail('Trình duyệt chặn lưu trữ. Vẫn có thể xuất file để giữ tiến trình.'); }
  }
  async _read(id) {
    await this.init();
    if (this.backend === 'localStorage') {
      const raw = this.local.getItem(PREFIX + id); return raw === null ? null : JSON.parse(raw);
    }
    return this._transaction('readonly', store => store.get(id));
  }
  _transaction(mode, action) {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject(new Error('Kho lưu đã đóng. Hãy tải lại trang.')); return; }
      const tx = this.db.transaction('save_slots', mode);
      const request = action(tx.objectStore('save_slots'));
      tx.oncomplete = () => resolve(request.result ?? null);
      tx.onabort = tx.onerror = () => reject(tx.error || new Error('Không thể ghi/đọc bản lưu.'));
    });
  }
  save(id, data) {
    slot(id); const snapshot = validateSnapshot(data); // capture now, not when queue drains
    const work = async () => {
      await this.init();
      const record = { slotId: id, savedAt: Date.now(), data: snapshot,
        checksum: await hash(new TextEncoder().encode(JSON.stringify(snapshot))) };
      if (this.backend === 'localStorage') this.local.setItem(PREFIX + id, JSON.stringify(record));
      else await this._transaction('readwrite', store => store.put(record));
      return record;
    };
    const result = this._queue.then(work); this._queue = result.catch(() => {}); return result;
  }
  autoSave(data) { return this.save(0, data); }
  async load(id) {
    slot(id); await this._queue; const record = await this._read(id);
    if (!record) return null;
    const data = validateSnapshot(record.data);
    if (record.slotId !== id || !finite(record.savedAt) ||
        await hash(new TextEncoder().encode(JSON.stringify(data))) !== record.checksum) fail('Bản lưu bị hỏng hoặc đã bị thay đổi.');
    return { ...record, data };
  }
  async listSlots() {
    return Promise.all(Array.from({ length: 6 }, async (_, id) => {
      try { return { slotId: id, record: await this.load(id), error: null }; }
      catch (error) { return { slotId: id, record: null, error: error.message }; }
    }));
  }
  async exportSave(data) {
    const snapshot = validateSnapshot(data);
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
    const compressed = typeof CompressionStream === 'function';
    const payload = compressed ? await transform(bytes, CompressionStream) : bytes;
    let binary = ''; for (const b of payload) binary += String.fromCharCode(b);
    return JSON.stringify({ format: 'wuxia', version: SAVE_VERSION, codec: compressed ? 'deflate' : 'json',
      checksum: await hash(bytes), payload: btoa(binary) });
  }
  async decodeSave(text) {
    if (typeof text !== 'string' || text.length > MAX_SAVE_BYTES * 2) fail('File lưu quá lớn hoặc không hợp lệ.');
    try {
      const file = JSON.parse(text);
      if (file.format !== 'wuxia' || file.version !== SAVE_VERSION || !['json', 'deflate'].includes(file.codec) ||
          typeof file.payload !== 'string' || !/^[a-f0-9]{64}$/.test(file.checksum)) fail('Định dạng hoặc phiên bản file chưa được hỗ trợ.');
      let bytes = Uint8Array.from(atob(file.payload), c => c.charCodeAt(0));
      if (file.codec === 'deflate') {
        if (typeof DecompressionStream !== 'function') fail('Trình duyệt chưa hỗ trợ giải nén bản lưu.');
        bytes = await transform(bytes, DecompressionStream);
      }
      if (bytes.length > MAX_SAVE_BYTES || await hash(bytes) !== file.checksum) fail('Checksum không khớp. File có thể bị hỏng.');
      return validateSnapshot(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
    } catch (error) {
      if (error instanceof SyntaxError || error.name === 'InvalidCharacterError') fail('File .wuxia không hợp lệ.');
      throw error;
    }
  }
  async importSave(text, id) {
    slot(id); if (id === 0) fail('Hãy nhập file vào một ô lưu thủ công.');
    const data = await this.decodeSave(text); // Validate completely before any mutation.
    return this.save(id, data);
  }
}
