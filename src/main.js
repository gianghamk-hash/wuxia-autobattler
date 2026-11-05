import { App } from './core/App.js';
function showFailure(error) {
  console.error('[Võ Lâm] Không thể khởi động:', error);
  const status = document.getElementById('boot-status');
  status.hidden = false; status.textContent = `Chưa thể mở game: ${error.message}. Hãy tải lại trang; bản lưu chưa bị xóa.`;
}
try { new App().init().catch(showFailure); } catch (error) { showFailure(error); }
