import { MAX_SAVE_BYTES, StorageManager, SaveConflictError } from '../core/StorageManager.js';
import { bus, EVT } from '../core/EventBus.js';

/** Storage panel for the playable engine demo. Gameplay modules can emit SAVE_REQUESTED. */
export async function mountSaveUI({ getSnapshot, restoreSnapshot, resetSession, engine, onRename }) {
  const storage = new StorageManager();
  const select = document.getElementById('save-slot');
  const message = document.getElementById('save-message');
  const name = document.getElementById('save-name');
  const save = document.getElementById('btn-save');
  const load = document.getElementById('btn-load');
  const importButton = document.getElementById('btn-import');
  const file = document.getElementById('save-file');
  const exportButton = document.getElementById('btn-export');
  const fresh = document.getElementById('btn-new-session');
  const notice = document.getElementById('save-notice');
  const noticeText = document.getElementById('save-notice-text');
  const retry = document.getElementById('btn-retry-save');
  const latest = document.getElementById('btn-latest-save');
  const portable = document.getElementById('btn-rescue-export');
  let busy = false, autoEnabled = false, available = false, elapsed = 0;
  let conflict = false;
  let slots = [];
  let pendingAuto = false;
  const say = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
  function controls() {
    const manual = Number(select.value) > 0;
    save.disabled = busy || conflict || !available || !manual;
    importButton.disabled = busy || conflict || !available || !manual;
    load.disabled = busy || !available || !slots[Number(select.value)]?.record;
    exportButton.disabled = fresh.disabled = select.disabled = name.disabled = busy;
    fresh.disabled ||= conflict;
    retry.disabled = busy || conflict || !available || !autoEnabled;
    latest.disabled = busy || !available;
    portable.disabled = busy;
  }
  async function refresh() {
    slots = await storage.listSlots();
    const target = document.getElementById('save-slots');
    target.replaceChildren();
    for (const entry of slots) {
      const row = document.createElement('li');
      const label = entry.slotId === 0 ? 'Tự lưu' : `Ô ${entry.slotId}`;
      row.textContent = entry.error ? `${label}: ${entry.error}` : entry.record ?
        `${label}: ${entry.record.data.hero.name} · ${Math.floor(entry.record.data.playtimeSeconds)} giây · ${new Date(entry.record.savedAt).toLocaleString('vi-VN')}` : `${label}: Trống`;
      target.append(row);
    }
    controls();
  }
  async function perform(action) {
    if (busy) return;
    busy = true; controls();
    try { await action(); }
    catch (error) {
      say(error.message || 'Không thể hoàn tất thao tác.', true);
      if (error instanceof SaveConflictError) {
        conflict = true; autoEnabled = false; pendingAuto = false;
        showProblem(error.message);
      }
    }
    finally {
      busy = false; controls();
      if (pendingAuto && !conflict) { pendingAuto = false; queueMicrotask(() => { void autoSave(); }); }
    }
  }
  function snapshot() {
    const data = getSnapshot(); data.hero.name = name.value.trim() || data.hero.name; return data;
  }
  function apply(data) {
    restoreSnapshot(data); name.value = data.hero.name; conflict = false; autoEnabled = true; elapsed = 0;
    notice.hidden = true;
  }
  function showProblem(text) {
    notice.hidden = false;
    noticeText.textContent = text;
  }
  async function autoSave() {
    if (!autoEnabled || !available) return;
    if (busy) { pendingAuto = true; return; }
    await perform(async () => {
      try {
        await storage.autoSave(snapshot());
        notice.hidden = true;
        await refresh(); say('Đã tự lưu tiến trình.'); elapsed = 0;
      } catch (error) {
        showProblem(error instanceof SaveConflictError ? error.message : `Chưa lưu được tiến trình: ${error.message}. Hãy thử lưu lại hoặc xuất file để giữ bản đang chơi.`);
        throw error;
      }
    });
  }
  if (onRename) name.addEventListener('change', () => { try { onRename(name.value.trim() || getSnapshot().hero.name); } catch (error) { say(error.message, true); } });
  select.addEventListener('change', controls);
  save.addEventListener('click', () => perform(async () => {
    const id = Number(select.value);
    if ((slots[id]?.record || slots[id]?.error) && !window.confirm(`Ghi đè ô lưu ${id}?`)) return;
    await storage.save(id, snapshot()); await refresh(); say(`Đã lưu vào ô ${id}.`);
  }));
  load.addEventListener('click', () => perform(async () => {
    const id = Number(select.value);
    if (!window.confirm('Tải bản lưu sẽ thay thế tiến trình đang mở. Tiếp tục?')) return;
    const record = await storage.load(id);
    if (!record) throw new Error('Ô lưu đang trống.');
    // Loading a manual branch deliberately adopts the current autosave revision.
    if (id !== 0) await storage.adoptRevision(0);
    apply(record.data); say(`Đã tải ${id === 0 ? 'bản tự lưu' : `ô ${id}`}.`);
  }));
  exportButton.addEventListener('click', () => perform(async () => {
    const text = await storage.exportSave(snapshot());
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `vo-lam-${Date.now()}.wuxia`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say('Đã tạo file .wuxia để tải xuống.');
  }));
  portable.addEventListener('click', () => exportButton.click());
  retry.addEventListener('click', () => { void autoSave(); });
  latest.addEventListener('click', () => perform(async () => {
    if (!window.confirm('Tải bản tự lưu mới nhất sẽ thay tiến trình trong tab này. Hãy xuất file trước nếu muốn giữ cả hai.')) return;
    const record = await storage.load(0);
    if (!record) throw new Error('Chưa có bản tự lưu.');
    apply(record.data); await refresh(); say('Đã tải bản mới nhất. Có thể lưu tiếp.');
  }));
  importButton.addEventListener('click', () => { file.value = ''; file.click(); });
  file.addEventListener('change', () => {
    const selected = file.files?.[0]; if (!selected) return;
    // Capture the destination before awaiting file IO.
    const id = Number(select.value);
    void perform(async () => {
      if (selected.size > MAX_SAVE_BYTES * 2) throw new Error('File vượt quá 2 MB.');
      const text = await selected.text();
      await storage.decodeSave(text);
      if ((slots[id]?.record || slots[id]?.error) && !window.confirm(`Nhập file và ghi đè ô ${id}?`)) return;
      await storage.importSave(text, id); await refresh();
      say(`Đã nhập vào ô ${id}. Chọn Tải để tiếp tục từ bản này.`);
    });
  });
  fresh.addEventListener('click', () => perform(async () => {
    if (!window.confirm('Bắt đầu hành trình mới? Ô tự lưu sẽ được cập nhật; các ô thủ công được giữ nguyên.')) return;
    resetSession(); name.value = getSnapshot().hero.name; autoEnabled = true; elapsed = 0;
    if (available) { await storage.autoSave(snapshot()); await refresh(); }
    say('Đã bắt đầu hành trình mới.');
  }));
  controls();
  await perform(async () => {
    try {
      const backend = await storage.init(); available = true;
      document.getElementById('storage-backend').textContent = backend === 'indexedDB' ? 'Lưu trên trình duyệt này' : 'Lưu trên trình duyệt này (chế độ dự phòng)';
      await refresh();
      if (slots[0].error) {
        autoEnabled = false;
        say('Ô tự lưu bị lỗi; đã ngừng tự lưu để giữ bản cũ. Hãy tải một ô khác, nhập file hoặc bắt đầu bản thử mới.', true);
        showProblem('Bản tự lưu bị lỗi. Đã ngừng tự lưu để giữ nguyên dữ liệu; mở mục Lưu / Tải để chọn một ô khác.');
      } else {
        if (slots[0].record) apply(slots[0].record.data);
        else autoEnabled = true;
        say(slots[0].record ? 'Đã khôi phục bản tự lưu.' : 'Sẵn sàng. Tự lưu mỗi 15 giây khi mô phỏng đang chạy.');
      }
    } catch (error) {
      document.getElementById('storage-backend').textContent = 'Chưa có kho lưu khả dụng';
      say(error.message, true);
      showProblem('Chưa có kho lưu khả dụng. Hãy xuất file để giữ tiến trình trước khi đóng trang.');
    }
  });
  bus.on(EVT.FRAME, ({ frameDt }) => {
    if (engine.paused || document.hidden || !autoEnabled || !available) return;
    elapsed += frameDt;
    if (elapsed >= 15) { elapsed = 0; void autoSave(); }
  });
  bus.on(EVT.SAVE_REQUESTED, () => { void autoSave(); });
  // Flush at a lifecycle boundary as well as checkpoints; unload completion is not guaranteed.
  document.addEventListener('visibilitychange', () => { if (document.hidden) void autoSave(); });
  window.addEventListener('pagehide', () => { void autoSave(); });
  return storage;
}
