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


## Sprint 3 — dữ liệu và Giang hồ kỳ phổ

- `SectsData.js`: năm môn phái, vai trò, chỉ số cấp 1, tăng trưởng theo cấp,
  nội tại và tham số hiệu ứng. `TuDo` là nhóm đồng đội không thuộc phái,
  không phải môn phái thứ sáu để nhân vật chính gia nhập.
- `CompanionsData.js`: đủ 20 đồng đội theo thứ tự GDD; ID ổn định
  `companion_01` đến `companion_20`. Có chỉ số, kỹ năng đánh thường/tuyệt kỹ,
  điều kiện chiêu mộ có cấu trúc, mã nhiệm vụ riêng và nhãn vai trò.
- `SynergiesData.js`: bốn kích duyên đúng GDD; `getActiveSynergies(sectIds)`
  kiểm tra tối đa ba thành viên, phái trùng tính một lần, có thể kích hoạt
  nhiều tổ hợp cùng lúc. Tự Do không tự thay thế phái còn thiếu.
- `EquipmentData.js`: 18 món khởi tạo (ba món dùng chung và năm bộ ba món),
  ba ô vũ khí/áo giáp/phụ kiện, phẩm cấp và chỉ số cộng theo bộ.
- Dữ liệu tĩnh được đóng băng sâu; các hệ thống sau cần `structuredClone`
  để tạo trạng thái HP/nộ/hiệu ứng riêng cho từng thực thể.

Mở **Giang hồ kỳ phổ** dưới bàn cờ để xem bốn danh mục, lọc phái và tìm kiếm
không dấu theo tên/kỹ năng/nhiệm vụ. Phần **Thử phối hợp môn phái** cho xem
các kích duyên của một nhân vật chính và hai đồng đội, tách khỏi bản lưu.

Tên nhân vật, kịch bản chiêu mộ, cơ chế nội tại và các tỷ lệ đã ghi trong GDD
được giữ nguyên. Chỉ số tăng trưởng, thời lượng chưa đặc tả, tỷ lệ ngẫu nhiên,
tên một số tuyệt kỹ và toàn bộ trang bị là dữ liệu cân bằng ban đầu, cần thử
khi có combat. Nội tại Thiếu Lâm tạm giới hạn một lần mỗi trận; cơ chế nội lực
Võ Đang sẽ cần tài nguyên riêng, không tự dùng chung thanh nộ. ID sự kiện,
vật phẩm nhiệm vụ và kẻ địch ở điều kiện chiêu mộ là hợp đồng cho Sprint 8,
chưa phải nhiệm vụ đang thực thi.

Sprint 3 cung cấp **dữ liệu và tra cứu**; chưa triển khai áp dụng chỉ số,
phát skill, thưởng trang bị hay chiêu mộ. Không tự mở khóa đồng đội trong save.
Bản lưu Sprint 2 (schema 1) vẫn đọc được; không đổi định dạng file `.wuxia`.

## Sprint 4 — thực thể, bàn cờ và hiệu ứng

- `Unit`, `Hero`, `Companion`: tạo bản sao chiến đấu riêng từ dữ liệu Sprint 3,
  tăng chỉ số theo cấp, quản lý HP/nộ/khiên, sống/chết. Chưa có cây kỹ năng Hero.
- `GridSystem`: tọa độ toàn sân x=0..5, y=0..2. Phe nhà x=0..2, địch x=3..5
  khi xếp trận; được vượt sân trong di chuyển. Dùng khoảng cách Chebyshev
  (chéo một ô = cự ly 1) để thống nhất với tám hướng đi. BFS tìm đường ngắn
  tránh ô có người và không cắt góc giữa vật cản. `null` = không có đường,
  `[]` = đã ở đích/trong tầm. Nhân vật chết được gỡ khỏi lưới.
- `TargetSelector`: đỡ đòn chọn địch gần nhất; thích khách/kết liễu ưu tiên
  phần trăm HP thấp; Đường Môn ưu tiên hậu tuyến; y sư chọn đồng đội bị thương
  (kể cả bản thân). Khiêu khích hợp lệ ưu tiên trước chiến lược; bỏ mục tiêu
  chết và tự chọn lại ở lần quét kế tiếp. Đồng hạng phân xử theo khoảng cách/ID.
- `StatusEngine`: độc tối đa năm tầng, xuất huyết một tầng, tick một giây;
  choáng chặn di chuyển và tích nộ; khiên hấp thụ trước HP rồi hết hạn;
  khiêu khích tham chiếu nguồn. Giải hiệu ứng xấu không xóa khiên.
  Timer dùng giây mô phỏng nên tuân theo tạm dừng và ×1/×2/×3.

**Bàn thử chiến thuật** nằm dưới canvas. Dựng một nhân vật chính + hai đồng
đội và ba địch mẫu, chọn nhân vật/ô đích, xếp trận hoặc ra lệnh đi tới ô,
tiếp cận mục tiêu và thử độc/choáng/khiên/xuất huyết/sát thương. Chọn hai
đồng đội trùng nhau sẽ báo lỗi và giữ bàn hiện tại. Viền vàng là nhân vật đang
chọn, viền trắng là mục tiêu. Có thể thử bằng chuột, bàn phím hoặc cảm ứng.

Bàn thử là sandbox: không mở khóa đồng đội, không ghi đè đội hình/cốt truyện
trong save. Dựng lại hoặc tải lại trang sẽ reset bàn thử; save Sprint 2–3 vẫn
đọc bình thường. Tốc độ và các điều khiển lưu game cũ vẫn hoạt động.

Chưa có AI tự di chuyển/đánh thường/tuyệt kỹ, tính giáp/chí mạng, áp nội tại,
kích duyên hoặc kết quả trận đấu. Đó là công việc Sprint 5–6. `takeDamage`
nhận sát thương đã tính toán; độc/xuất huyết bỏ qua giáp nhưng vẫn được khiên
hấp thụ. Trong bản thử, độc là 20/tầng/giây, xuất huyết 15/giây; các giá trị
này chỉ để kiểm tra. Độc tái áp dụng làm mới thời lượng chung, giữ nhịp tick
và mức sát thương/tầng cao hơn; xuất huyết không cộng tầng. Khiên hết hạn ở
cùng thời điểm một tick sát thương sẽ được gỡ trước tick đó. Mọi hiệu ứng có
chung một timeline, không phụ thuộc thứ tự được thêm hoặc độ dài bước cập nhật.
