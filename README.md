# Võ Lâm Hài Hiệp Truyện

Auto-battler kiếm hiệp hài hước, thuần web (vanilla JavaScript ES modules, Canvas 2D, Web Audio), không dùng game engine hay dependency runtime.

**Bản 1.0 — tích hợp Sprint 1–10:** [Chơi trên GitHub Pages](https://gianghamk-hash.github.io/wuxia-autobattler/).

## Bắt đầu chơi

1. Nhập tên, chọn một trong năm môn phái rồi **Khởi hành**.
2. Vào **Chính truyện** ở doanh trại, vượt trận hướng dẫn tại quán trọ.
3. Mở **Đồng đội & Xếp trận**, hoàn thành thử thách rồi mời Lão Tam và Tiểu Muội. Chọn nhân vật rồi chạm ô, hoặc kéo thả để xếp một Main và tối đa hai đồng đội. Thả vào ô có người sẽ đổi chỗ.
4. Vào **Nhân vật** để cộng chỉ số, học cây kỹ năng bốn tầng và thay trang bị đã sở hữu. XP, bạc và vật phẩm đến từ nhiệm vụ hoặc luyện tập; các nút cấp miễn phí của bản thử đã được bỏ khỏi luồng chơi.
5. Tiếp tục chính truyện qua ba hồi. Có thể luyện tập, mua vật dụng, tặng trà tăng duyên nợ và hoàn thành các nhiệm vụ chiêu mộ khác.

Trận tự đánh, có HP/nộ/khiên, số sát thương ngoại công đỏ, nội công tím, bạo kích vàng và hồi máu xanh. **Space** tạm dừng; **1 / 2 / 3** đổi tốc độ. Khi ẩn tab, mô phỏng và nhạc dừng. Kết quả ghi thống kê từng nhân vật và thưởng một lần; rút lui hoặc thua không mất vật phẩm hay XP.

## Sprint 7–10 đã tích hợp

- **Sprint 7:** `BattleRenderer` vẽ trận thật lên Canvas HiDPI, chuyển động, HP/nộ, khiên, báo tuyệt kỹ và số sát thương. `FormationUI` hỗ trợ kéo thả, thao tác chạm và đổi chỗ; chỉ dùng các đồng đội đã chiêu mộ.
- **Sprint 8:** 12 nhiệm vụ chính chia ba hồi, 20 tình huống chiêu mộ, đối thoại có lựa chọn và hai bước ngoặt cốt truyện. Thử thách gồm giao chiến, câu đố tình huống và vật phẩm cần tìm/tiêu hao. Cờ nhiệm vụ, nghiệp và duyên nợ tác động tiến trình, không thể lặp thưởng bằng chọn lại đối thoại.
- **Sprint 9:** Nhạc ngũ cung tổng hợp riêng cho tiêu đề, doanh trại, chiến đấu và kết cục; hiệu ứng tương tác, đánh thường, nội công, hồi máu, tuyệt kỹ, hạ gục và thắng/thua. Nhấn **Bật âm thanh** để cho phép Web Audio; chỉnh âm lượng hoặc tắt trong Thiết lập. Không cần tải file nhạc ngoài. Trình duyệt thiếu Web Audio vẫn chơi được.
- **Sprint 10:** `App` và `main.js` nối tiêu đề → doanh trại → đối thoại/xếp trận → chiến đấu → kết cục; tích hợp cây kỹ năng, trang bị, kỳ phổ và lưu/tải. Giao diện thích ứng điện thoại, không cần build.

| Kết cục | Điều kiện tại nhiệm vụ cuối |
| --- | --- |
| Minh Chủ Liêm Khiết | Nghiệp từ 2, đã phát hiện cuốn sổ nợ |
| Trùm Tài Phiệt Giang Hồ | Có và chi 100 bạc |
| Quy Ẩn Bán Bún Đậu | Hai đồng đội xuất chiến đều có duyên nợ từ 30 |
| Diễn Viên Đóng Thế | Luôn có thể chọn |

Mỗi hành trình chốt một kết cục. Lưu vào ô thủ công trước lựa chọn cuối để thử nhánh khác.

## Lưu và tương thích bản cũ

- Một ô tự lưu và năm ô thủ công; xuất/nhập `.wuxia` có kiểm tra SHA-256. Dữ liệu gắn với trình duyệt và địa chỉ website; xuất file để chuyển máy hoặc dự phòng.
- Tự lưu theo mốc nhiệm vụ, thay đổi đội hình/nhân vật và định kỳ 15 giây. File lỗi bị từ chối trước khi thay tiến trình. Nếu kho trình duyệt không khả dụng, có thể tiếp tục chơi và xuất file.
- Trước mỗi trận, game lưu nhiệm vụ và seed. Tải lại giữa trận cho phép **đánh lại từ đầu với cùng seed**, không khôi phục HP/từng tick giữa trận. Thưởng chỉ nhận khi kết quả được chốt.
- Bản lưu Sprint 2–6 giữ nhân vật, trang bị, vật phẩm và đồng đội hợp lệ; phần chiến dịch mới bắt đầu từ nhiệm vụ đầu. Cờ tiến trình thử nghiệm cũ được giữ trong `legacyProgress`; bộ vật dụng khởi đầu chỉ được bổ sung một lần khi chuyển đổi.
- Khởi hành mới chỉ thay ô tự lưu, giữ năm ô thủ công. Nên xuất bản cũ trước khi bắt đầu hành trình mới.

## Chạy và kiểm tra

Yêu cầu Node.js 22+ cho kiểm thử; game chạy trực tiếp trên trình duyệt có ES modules, Canvas 2D, IndexedDB hoặc LocalStorage.

```sh
npm ci
npm test
python3 -m http.server 8000
```

Truy cập `http://localhost:8000`; không mở `index.html` bằng `file://`. GitHub Actions chạy bộ kiểm thử và Pages triển khai nhánh `main`.

Bộ kiểm thử hiện có **68 bài**: engine, lưu trữ/nhập file, dữ liệu, lưới, combat, cây kỹ năng, âm thanh, chuyển đổi bản lưu và chiến dịch. Kiểm thử tích hợp dùng combat thật để đi hết ba hồi, chiêu mộ đủ 20 nhân vật và kiểm tra cả bốn kết cục; đồng thời kiểm tra checkpoint, chặn thưởng lặp, tiêu hao vật phẩm và đội hình hợp lệ.

Đã kiểm tra trên Chromium: khởi hành, chiến đấu, cộng kỹ năng, hai nhiệm vụ chiêu mộ đầu, chọn sai câu đố, kéo thả/chạm đội hình, lưu/xuất/nhập, tải lại giữa trận, toàn bộ chính truyện và bốn màn hình kết cục, bật/tắt/âm lượng Web Audio, bố cục rộng 360px. Không có lỗi console trong luồng này.

**Phạm vi bản 1.0:** nhân vật trên sân được vẽ hình khối đơn giản, chân dung dùng ký tự; các thử thách cờ vây/đấu vật/bắn bia/đuổi mái nhà là câu đố lựa chọn tình huống, chưa phải mini-game điều khiển riêng. Nhạc được tổng hợp bằng Web Audio. Mốc 20 giờ chơi trong GDD và 60 FPS trên Chrome/Firefox/Safari chưa được đo/xác nhận; cần chơi thử và cân bằng thêm trước khi coi là bản thương mại.

## Nhật ký Sprint 1–6

Các mục dưới đây ghi lại từng bản thử trước khi tích hợp 1.0. Giao diện thử nghiệm và nút cấp tài nguyên nêu ở đây không còn nằm trong luồng chiến dịch hiện tại; hướng dẫn hiện tại ở phía trên.

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

## Sprint 5 — chiến đấu tự động

Bấm **Khai chiến** trong Bàn thử chiến thuật. Trận dùng vị trí đang xếp, hồi đầy
HP, xóa hiệu ứng thử và đưa nộ về 0. Mỗi phe tối đa ba nhân vật. Trong trận,
các nút sửa vị trí/HP/hiệu ứng bị khóa; vẫn có thể xem nhân vật, tạm dừng hoặc
đổi ×1/×2/×3. **Dựng lại bàn thử** hủy trận hiện tại, khôi phục bố cục mẫu và
cho chọn đội mới. Kết quả có thắng/thua/hòa, thời gian và thống kê từng người.
Giới hạn trận là 120 giây mô phỏng; hết thời gian xử hòa, không suy diễn thắng
bằng lượng HP còn lại. Nhật ký giữ 80 dòng, số sát thương/hồi máu nổi trên bàn.

- `AIBehavior.js`: FSM Idle → Move → Attack/Ultimate; Stunned và Dead chặn
  hành động. Đòn thường có windup 0.2s, tuyệt kỹ 0.35s; sát thương xảy ra ở
  impact. Nộ được trừ lúc chiêu chạm, không trừ khi mục tiêu chết giữa windup.
  Khi mục tiêu chết/hết hợp lệ, tìm lại ở tick tiếp theo. Nếu hậu tuyến bị
  chắn, AI thử mục tiêu địch có đường tiếp cận, không bỏ qua khiêu khích hợp lệ.
- `CombatEngine.js`: bước cố định 1/60s, RNG có seed riêng. Với cùng đội hình,
  vị trí, chỉ số ban đầu và mã trận, mọi tốc độ cho cùng kết quả và chuỗi sự
  kiện. Thứ tự hành động theo tốc đánh rồi ID để xử lý cùng thời điểm ổn định.
  Không dùng thời gian thực, `Math.random`, `setTimeout` cho logic chiến đấu.
- `CombatMath.js`: giảm sát thương theo giáp GDD; crit tối đa 75%, hệ số crit
  theo Kình Lực; nhịp đánh dùng BaseInterval/(1+Thân Pháp×0.015)/attackSpeed.
  Đỡ đòn giảm 50% sát thương; mù và né tránh kết hợp, tối đa 95% tránh/hụt.
  Đánh thường trúng/hồi phục nhận 15 nộ, sát thương HP nhận theo tỷ lệ ×40,
  hạ gục nhận 25 nộ. Khiên không được tính là HP mất để tích nộ phòng thủ.
- Thực thi hiệu ứng của đủ 20 đồng đội: heal/HoT, taunt/stun, buff/cleanse,
  mù, ba tia xuyên thấu, năm nhát liên hoàn, dịch chuyển, độc, phản sát thương,
  mê hoặc, tiếp nộ, đẩy lùi, kết liễu và bình rượu ngẫu nhiên.
- Năm phái có bộ kỹ năng khởi đầu trong `HeroSkillsData.js` dùng cơ chế đã có
  của đồng đội cùng phái. Đây là nền trước cây kỹ năng Sprint 6.
- Áp bốn kích duyên và nội tại: khiên vào trận, tăng nộ/tăng sát thương,
  giảm giáp, đòn thứ tư Cái Bang, độc Đường Môn nổ ở năm tầng, Nga Mi giải
  khống chế khi tung tuyệt kỹ, hộ thể Thiếu Lâm và nội lực/phản kích Võ Đang.

Các thông số chưa có trong GDD hiện là dữ liệu cân bằng thử: hộ thể Thiếu Lâm
kích một lần/trận, kéo dài 6s; nội lực Võ Đang ban đầu bằng 3×nội công, tiêu
hao để đỡ 40%, phản kích bằng 30% nội công (qua nội phòng, không lặp phản ứng).
Độc cơ bản Đường Môn là 15% ngoại công/tầng/giây, nổ bằng 150% ngoại công.
Ba tia ưu tiên mục tiêu cùng hàng rồi các hàng kế; vùng 3×3 là Chebyshev một ô
quanh tâm. Khi chưa có ô trống, đẩy lùi không đổi vị trí. Mê hoặc đảo mục tiêu
công kích sang đồng đội cũ, không biến hồi máu thành hồi cho đối phương.
Các giá trị này cần tiếp tục cân bằng qua chơi thử.

Bản Sprint 5 vẫn là trận thử độc lập: không cộng XP/vật phẩm/cờ nhiệm vụ và
không lưu trận đang đánh; save tiến trình Sprint 2–4 vẫn tương thích. Sprint
6 thêm cây kỹ năng/trang bị; Sprint 7 hoàn thiện giao diện và xếp trận.

Kiểm thử mới bao gồm: mô phỏng đủ 20 vai trò, tác dụng từng tuyệt kỹ, thay
mục tiêu giữa windup, rage, stun, các kết quả trận, giới hạn nhật ký và so
sánh chính xác kết quả/sự kiện ở ×1/×2/×3 qua GameEngine thật.

## Sprint 6 — cây kỹ năng, thuộc tính và trang bị có lưu trữ

Mở **Tu luyện & Trang bị**, chọn môn phái rồi áp dụng. Mỗi phái có tám nút
(40 nút cho năm phái), chia hai nhánh Công pháp/Hộ thân và bốn tầng. Tầng
1/2/3/4 yêu cầu cấp 1/3/5/8, tốn 1/1/2/3 điểm và cần nút trước của cùng
nhánh. Hai tuyệt kỹ tầng 4 loại trừ nhau. Học nút cộng chỉ số thật; tầng 4
đổi kỹ năng thật được `CombatEngine` sử dụng, không chỉ đổi nhãn giao diện.

- `SkillTreeData.js` chứa node, điều kiện, chi phí, chỉ số và mười biến thể
  tuyệt kỹ. Đây là bộ cây kỹ năng/cân bằng ban đầu vì GDD chưa liệt kê từng nút.
- `HeroBuild.js` quản lý XP, điểm, phái, học/tẩy kỹ năng, thuộc tính, trang bị
  và kiểm tra ngân sách. Có `buildVersion: 1` bên trong `hero`; envelope save
  vẫn dùng schema 1. Mọi sửa đổi tạo bản mới và kiểm tra xong trước khi áp dụng.
- `Hero` nhận `profile` và `inventory`, tính lại từ chỉ số phái + tăng trưởng
  cấp + thuộc tính + nút kỹ năng + trang bị + thưởng bộ. Không cộng thêm vào
  các chỉ số đã được tăng trước đó. Các API `learnSkill`, `allocateAttribute`,
  `equip` từ chối sửa thực thể đang trong trận.
- Ba ô: vũ khí/áo giáp/phụ kiện. Chỉ lắp món đã sở hữu, đúng ô, đúng phái
  (đồ dùng chung không khóa phái). Đồ vẫn nằm trong kho khi đang lắp; một nhân
  vật chính dùng một món mỗi ô. Đủ ba món cùng bộ mới cộng thưởng một lần.
- Mỗi cấp có một điểm kỹ năng (cấp 1 có sẵn một điểm); mỗi lần lên cấp nhận
  hai điểm thuộc tính, giới hạn bản thử cấp 20. XP cần lên cấp = cấp hiện tại
  ×100, XP dư chuyển sang cấp sau; ở cấp tối đa không tích lũy thêm XP.
- Thuộc tính theo số điểm đã cộng: Căn Cốt +25 HP; Khí Hải +4 nội công/+1 nội
  phòng; Kình Lực +4 ngoại công và hệ số crit có sẵn trong CombatMath; Ngộ
  Tính tăng crit theo công thức GDD; Thân Pháp tăng nhịp đánh theo GDD và
  +0.2% né/điểm; Cơ Duyên +0.2% crit/điểm. Các hệ số chưa có trong GDD là
  thông số thử, có thể điều chỉnh khi cân bằng.

**Tu luyện thử: +1 cấp** cấp đúng lượng XP còn thiếu tới cấp kế; **Nhận bộ
trang bị thử** thêm ba món của phái đang chọn một lần, không nhân bản khi
bấm lại. New game có ba món nhập môn; save cũ không bị tự thêm vật phẩm.
Các nút này là công cụ thử xây nhân vật trước hệ thống nhiệm vụ Sprint 8,
không phải phần thưởng trận đấu. Tẩy điểm không tốn phí trong bản thử.
Đổi phái hoàn điểm kỹ năng và tháo đồ riêng phái cũ, giữ nguyên kho và
thuộc tính; quay lại phái cũ có thể lắp đồ đã sở hữu.

Hồ sơ tự lưu khi đổi phái, học/tẩy điểm hoặc lắp đồ. Lưu thủ công/xuất nhập
`.wuxia` chứa cả cấp, XP, điểm, kỹ năng, kho và trang bị. Save mặc định được tạo
bởi Sprint 2–5 được chuẩn hóa (thuộc tính thiếu = 0, điểm được tính từ cấp),
giữ nguyên tên, kho, đội hình và cờ nhiệm vụ. Hồ sơ phiên bản mới có điểm giả,
node trùng/khác phái, sai tiền đề hay món đồ chưa sở hữu bị từ chối trước ghi.
Bản legacy tự sửa với ID kỹ năng/trang bị lạ hoặc vượt giới hạn bản thử sẽ báo
lỗi khi áp dụng, không âm thầm xóa dữ liệu hay ghi đè bản cũ.

Nhân vật chính trên bàn thử dùng đúng hồ sơ đã chọn; ô phái ở bàn thử được
khóa theo hồ sơ. Thay hồ sơ hoặc tải một save dựng lại bàn thử, không thay
đổi đồng đội/cờ nhiệm vụ trong chiến dịch. Trong lúc đánh, bảng tu luyện được
khóa; sau trận có thể sửa rồi khai chiến lại. Trận đang đánh vẫn không được
lưu giữa chừng. Phần xếp trận/giao diện chiến đấu sẽ hoàn thiện ở Sprint 7.
