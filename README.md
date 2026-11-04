# Võ Lâm Hài Hiệp Truyện
Auto-battler kiếm hiệp hài hước, thuần web (vanilla JS ES6, không engine).

Chạy local: mở thư mục bằng VS Code, dùng Live Server cho `index.html`.
Chạy online: bật GitHub Pages (Settings > Pages > Deploy from a branch > main / root).

## Sprint 1 — engine nền tảng

- Canvas 2D hiển thị lưới 6×3 (hai nửa sân 3×3), tự co theo màn hình và hỗ trợ HiDPI.
- Mô phỏng dùng bước cố định 1/60 giây; chọn ×1/×2/×3 bằng nút hoặc phím 1/2/3.
- Space hoặc nút Tạm dừng / Tiếp tục giữ nguyên tốc độ trước khi dừng.
- Khi ẩn tab, mô phỏng ngừng và không bù thời gian khi quay lại.
- Chấm vàng là minh họa thời gian; Sprint 1 chưa có nhân vật hay chiến đấu.
- Mở Nhật ký mô phỏng để xem dt, số tick và thời gian mô phỏng (tối đa 40 dòng).

Chạy bằng Live Server hoặc `python3 -m http.server 8000`, rồi truy cập
`http://localhost:8000`. Không mở trực tiếp bằng `file://` vì game dùng ES modules.

Kiểm tra engine bằng Node.js 22+: `npm ci` rồi `npm test`.
Engine và cấu hình TIME dùng giây; các hằng số GAME.MAX_DELTA_TIME và
COMBAT.BASE_ATTACK_INTERVAL cũ vẫn dùng mili giây.


## Sprint 2 — lưu và tải tiến trình

Mở bảng **Lưu tiến trình** bên dưới bàn cờ:

- Ô 0: tự lưu mỗi 15 giây hoạt động, hoặc khi module phát `EVT.SAVE_REQUESTED`.
  Khi tạm dừng hoặc ẩn tab, bộ đếm tự lưu dừng. Game tự khôi phục ô 0 trước
  khi chạy engine. Nếu ô 0 hỏng, tự lưu dừng để giữ nguyên dữ liệu cho đến khi
  người chơi tải một bản hợp lệ hoặc chọn **Bản thử mới**.
- Ô 1–5: chọn ô rồi **Lưu** hoặc **Tải**; thao tác ghi đè/tải có xác nhận.
- **Xuất .wuxia** tạo file từ tiến trình đang mở. **Nhập .wuxia** kiểm tra file
  rồi lưu vào ô thủ công đang chọn; bấm **Tải** để áp dụng bản vừa nhập.
- **Bản thử mới** đặt lại demo và ô tự lưu; giữ nguyên năm ô thủ công.
- Hiện bản lưu gồm dữ liệu nhân vật/đội hình/nhiệm vụ khởi tạo, tên tiếng Việt,
  thời gian chơi thực (không nhân tốc độ), đồng hồ mô phỏng, vị trí chấm,
  tốc độ và trạng thái tạm dừng. Chưa có tiến trình chiến đấu ở Sprint 2.

`StorageManager` sử dụng IndexedDB `WuxiaChroniclesDB`, store `save_slots`.
Nếu không mở được IndexedDB, chuyển sang LocalStorage. Lựa chọn dự phòng được
nhớ cho những lần mở sau để các ô lưu vẫn hiện đầy đủ. Sau khi đã chọn kho,
lỗi ghi không tự đổi kho: giao diện báo lỗi và giữ nguyên bản đã lưu.
Dữ liệu lưu theo trình duyệt và địa chỉ website; xuất file để chuyển thiết bị.

Định dạng file: JSON envelope `{format, version, codec, checksum, payload}`.
Payload là UTF-8 JSON → deflate (nếu trình duyệt hỗ trợ) → Base64.
SHA-256 kiểm tra dữ liệu gốc trước khi nhập, phát hiện file lỗi; không phải
cơ chế chống người chơi chủ động sửa file. Cần HTTPS hoặc localhost.
Giới hạn: snapshot 1 MiB, file nhập 2 MiB; kiểm tra phiên bản, schema và giới
hạn giải nén trước khi ghi. Trình duyệt cũ có thể xuất codec `json` không nén.

Chạy kiểm tra: `npm ci` rồi `npm test` (Node.js 22+). `fake-indexeddb` chỉ dùng
trong kiểm thử; game vẫn là ES modules thuần, không có dependency runtime.
Kiểm thử bao gồm cả IndexedDB và LocalStorage, khôi phục sau tải lại, cách ly
sáu ô, Unicode, checksum sai, file quá lớn, hết dung lượng và kho bị chặn.
