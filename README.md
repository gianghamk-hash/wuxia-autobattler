# Đại Việt Kỳ Hiệp Truyện

Auto-battler kiếm hiệp hài hước, thuần web (vanilla JavaScript ES modules, Canvas 2D, Web Audio), không dùng game engine hay dependency runtime.

**Bản 6.0 — chiến đấu và tháp 100 tầng:** 265 trận chính truyện, địch 4–8 người, boss ba giai đoạn và lời thoại cô đọng. [Chơi trên GitHub Pages](https://gianghamk-hash.github.io/wuxia-autobattler/).

## Bản 6.0

- 265 hồi chiến đấu trong 400 hồi; mỗi chương có một boss chốt. Hai đoạn thoại mặc định trước/sau cảnh, giữ kết quả và câu nối; bản đầy đủ có thể mở đọc. Chương hậu chiến dùng khảo trận, nhánh về nhà dùng hồi ức được ghi rõ.
- Mỗi đội địch có 4–8 người; nhiệm vụ ba chốt dành ô cho vật thể và dùng tối đa 6 chiến binh. Boss có hai lượt mini boss và lượt boss cuối với lính; không hồi máu miễn phí giữa ba giai đoạn.
- Năm Bí cảnh đều có 100 tầng, boss mỗi 10 tầng, thắng tự vào tầng tiếp theo và nút kết quả trở về Bí cảnh. Thắng tầng hồi 25% HP cho đội; mỗi mốc 10 hồi đầy. Hai lượt/ngày và mua thêm một lượt giữ nguyên.
- Gói nhân vật 540 bạc/5 kết quả, gói trang bị 720 bạc/5 kết quả; lượt đơn 60/80 bạc. Bảo đảm tính liên tục theo số kết quả, giữ lịch sử cũ.
- 120 nút kỹ năng, tám tầng cho mỗi phái; 12 bộ chuyển động lính/boss mới kèm chân dung khớp mẫu. [Quy tắc và giới hạn đo](docs/COMBAT_6_0.md).

## Bản 5.1

- Hành trình tập trung vào truyện. Sân luyện ở Bí cảnh; quầy dây/cá/trà ở Quán → Quán & Rèn, không còn hai quầy trùng. Xếp trận và đồng đội tập trung tại Đội hình.
- Mười chân dung 51–60 có bối cảnh phù hợp vai trò, giữ khuôn mặt và độ hiếm. 50 chân dung cũ giữ nguyên; người chơi quay lại nhận đúng bản ảnh mới.
- Bộ 40 WebP màu thay icon nét đơn, có hình dây, cá và tắt âm riêng. Tên nút, nhãn truy cập và quy tắc chơi vẫn giữ. [Chi tiết và nguồn ảnh](docs/UI_ART_5_1.md).

## Bản 5.0

- Sửa ảnh cũ trong ô đội hình và hình lớn hành trình; mười atlas sáu tư thế riêng cho nhân vật chính theo giai đoạn. Hình đồ và khung bốn phẩm chất; hào quang theo đồ đang mặc.
- Playlist sáu MP3 người dùng cung cấp giữ bài khi đổi màn, lặp toàn bộ danh sách và nhớ vị trí riêng trên thiết bị. Âm va chạm/tuyệt kỹ có thêm trầm và lớp tiếp xúc ngắn.
- 400 nối cảnh, 19 chuyển chương, mốc thời gian/địa điểm và sổ nhân quả có điều kiện mở dữ kiện; giữ 20 chương, 105 trận và các nhánh kết thúc.
- Ba hướng Sát lực / Cân bằng / Phòng thủ, giải thích điểm thuộc tính và buff kích hoạt ngay tại đội hình/trận. Nút và bố cục ưu tiên điện thoại dọc.
- Mỗi bí cảnh và mỗi boss ôn trận có 2 lượt/ngày, mua thêm tối đa 1 lượt/nơi với 60 bạc, đặt lại 00:00 giờ Việt Nam. Không tính thêm khi tải lại một lượt đang chơi.
- Đường cấp dài hơn từ cấp 8, địch giữa/cuối game tăng nhẹ có đo 1.080 trận ghép cặp; giữ cấp/điểm cũ. [Quy tắc, số đo và giới hạn](docs/JOURNEY_5_0.md).

## Bản 4.3

- Thêm 10 đồng hành, hai người mỗi bậc hiếm; mỗi người có ảnh, khung hiếm và vai trò lặp lại trong chính truyện. Mở quay/nhiệm vụ sau lần gặp; 10 nhiệm vụ mời có mục tiêu giữ đường, bảo vệ, giải cứu hoặc mở chốt thật và lời sau trận riêng.
- Thêm 36 món và ba bộ Vân Hành / Thiết Vệ / Thanh Tâm với mốc 2 và 3 món. Bốn phẩm chất: Thường, Hiếm, Xuất sắc, Trác việt. Đồ cũ còn nguyên, tổng 54 món.
- Nhận đồ qua mốc cốt truyện, vòng quay trang bị và boss. **Quán → Quán & Rèn** có quay 80 bạc/lượt, 720/10 lượt, tỉ lệ 60/28/10/2%, bảo đảm 10/50 độc lập với quay nhân vật. **Quán → Hoạt động** có 20 thử thách boss ôn trận mở theo chương, đánh lại để nhận XP/bạc/đồ mà không thay mạch truyện.
- Từ chương 3, tăng khoảng 8% HP / 5% công cho trận thường, 12% / 8% cho trận chốt; giữ mở đầu và các bài luyện mới. Luyện cấp và chọn bộ hợp vai trò cải thiện kết quả trong mẫu đo 240 trận. [Kết quả và giới hạn](reports/PROGRESSION_4_3.md).
- Giữ mã hồi, ngân sách XP/bạc cũ và sáu ô lưu. Thưởng trận được ghi một lần, tải lại giữ seed và đồ; không tự thưởng lại hồi đã qua. [Nhân vật, trang bị, tỉ lệ, nguồn đồ và bản lưu](docs/PROGRESSION_4_3.md).

## Bản 4.2

- Khởi hành chỉ nhập tên. Người chơi dùng quyền cơ bản tới khi đã tìm hiểu năm viện; lời mời ở chương 2, hồi 10 cho chọn một trong năm phái. Võ công và chân dung nhập môn có hiệu lực từ hồi sau.
- Tên được dùng trong lời kể, người nói, đầu mối, chuyện đồng hành, nhật ký, xem lại và kết thúc. Giữ riêng nhận diện người nói để tên trùng NPC không làm hiện nhầm ảnh.
- Mười ảnh giữ cùng một gương mặt: hiện đại, lưu lạc, năm trang phục phái, sau cuộc rút lui, chỉ huy và thường phục hậu chiến. Hình cập nhật ở khung thoại, thanh thông tin, hồ sơ, đội hình và trận đấu; xem lại dùng thời điểm của hồi ấy.
- Giữ bộ học và tài nguyên của bản lưu cũ, không ép người đã qua lời mời chọn lại hoặc nhận thêm thưởng. [Mốc ảnh, nhập môn, tên và bản lưu](docs/HERO_IDENTITY_4_2.md).

## Bản 4.1

- Đọc tiếp từ hồi này sang hồi sau ngay trong khung thoại; nhắc lại và mục tiêu chương được thu gọn. Sau trận thắng có nút tiếp tục truyện, đọc diễn biến sau trận rồi chuyển sang cảnh tiếp theo.
- Viết 67 đoạn dẫn trước trận và chuyển kết quả sang sau chiến thắng; bổ sung 38 trận/đối luyện có nguyên nhân và hậu quả riêng. Tổng 105 trận, trong đó 43 mục tiêu thật gồm thêm 12 bài luyện giữ vị trí/phá chốt.
- Thêm chân dung người kể; giữ 25 chân dung nhân vật đã ghép vai. Dùng lại nền, mô hình và hiệu ứng chiến đấu.
- Giữ mã 400 hồi, XP/bạc từng hồi, mốc chiêu mộ, lựa chọn và trận cũ đang chờ. Lưu vị trí đọc mới và phần sau trận; xem lại không nhận thêm thưởng. [Thiết kế, phạm vi và kiểm chứng](docs/STORY_FLOW_4_1.md).

## Bản 4.0

- Phát triển đề cương Word thành hơn 31.000 từ trong 400 hồi riêng: Trần Phong từ người dùng vẻ tự tin để giấu sợ thành người biết nghe, chịu kiểm và bàn giao; Mai Tước có trách nhiệm gia đình và con đường riêng; Lôi Nam học sống cùng mất mát mà không ép người khác ở lại.
- Nối chuyện thiếu thóc, án mạng, kho dự trữ và xâm lược bằng nguồn cụ thể. Vụ Lục Thư có người gây án, người ra lệnh, động cơ và chứng cứ; hậu quả được theo tới hậu chiến. Năm chưởng môn được xây trước khi mất, không dùng cái chết để tặng sức mạnh tức thì.
- 25 chân dung được ghép vai mới, không tạo hoặc ghi đè ảnh. Tên và bối cảnh thống nhất trong hội thoại, đội hình, thẻ tướng, danh mục, đầu mối và truyện đồng hành. Vai chính chỉ vào đội/quay khi đã tới mốc gặp.
- 67 trận, trong đó 31 mục tiêu giữ đường/bảo vệ/giải cứu/mở chốt thật. Mở đầu dùng quyền cơ bản và một đối thủ; chiến tranh dùng các toán 6v6 và mạch truyện, không giả lập hàng nghìn đơn vị trên bàn.
- Chọn tình bạn hoặc tìm hiểu Mai; chọn về hiện đại hoặc ở lại. Có 22 cảnh thay thế cho nhánh về, bốn kết thúc theo lựa chọn, không thu bạc để chọn kết. Mười lăm chuyện đồng hành có kịch bản của chiến dịch mới, giữ cơ chế biến thể chiêu.
- Hai danh mục truyện tách theo phiên bản lưu, không đổi hồi cũ thành cảnh mới hoặc cấp lại thưởng. Sửa bản lưu nhận đủ năm phần và việc nhường hai chỗ nối tiếp khi người giải cứu/người được cứu kẹt giữa đội hình sáu người.
- [Mạch chương, diễn biến nhân vật, phạm vi và lưu game](docs/DAI_VIET_STORY_4_0.md). Xuất bản đọc HTML/Markdown từ đúng dữ liệu game bằng `node scripts/export-dai-viet.mjs <thư-mục>`; kiểm tra bằng `npm test` và `npm run test:browser`.

## Bản 3.3

- Bổ sung chín bộ hình sáu tư thế và 12 biểu cảm: tổng 17 bộ động tác, 24 biểu cảm cho 12 nhân vật. Ưu tiên tay sai xuất hiện nhiều, nhân vật giữ đầu mối, phản diện và năm đồng hành có truyện thân tình. Người phu có hình khi được cứu; biểu cảm đoạn kết theo ngữ cảnh.
- Đồng đội chia bốn mục Xếp trận / Đồng đội / Chiêu mộ / Chiêu hiền. Thêm thao tác nhanh về trại, lưu/tải, lên đầu; nhớ mục hồ sơ, vị trí cuộn và tìm kiếm sổ đầu mối trong phiên chơi. Các nút và mục mở rộng có biểu tượng, giữ nhãn chữ, vùng bấm tối thiểu 44px và bàn phím.
- Chín mục ở Quán hiện rõ trên điện thoại; trang lưu, bộ đội hình, menu, hộp thoại, bộ lọc và màn trận được chỉnh khoảng cách. Chế độ thủ công có nút tung tuyệt kỹ ngay trên thẻ nhân vật, vẫn chờ đủ năng lượng và dùng hàng đợi lệnh thật.
- Kiểm chứng: **144 bài Node và 31 luồng Chromium**, gồm bốn cỡ màn 320/390/768/1280px, 21 ảnh mới, lưu nhiều tab và chiến dịch 240 hồi. [Phạm vi, nguồn hình và cách sử dụng](docs/UI_AND_ART_3_3.md).

## Bản 3.2

- **Sổ đầu mối:** mở từ doanh trại hoặc Quán → Sổ đầu mối. Có 34 ghi chép gắn nguồn, sáu câu hỏi và bảy quan hệ; chỉ hiện thông tin của hồi đã hoàn thành. Tìm không dấu, chạm tên để mở hồ sơ đã biết và xem lại nguồn không nhận thưởng.
- **Trinh sát và ý đồ:** đối thủ trước trận chính truyện lấy từ cùng hàm dựng đội địch thật, có vai trò, chiêu và cách đối phó boss. Trong trận, thẻ nhân vật cho biết mục tiêu hiện tại, chuẩn bị hồi máu/tuyệt kỹ, tiếp cận, choáng hoặc giữ chân; thông tin lấy từ quyết định AI thật.
- **Chín trận có mục tiêu riêng:** giữ đường rút 30 giây, bảo vệ xe/hòm 25 giây hoặc đẩy lui địch, tiếp cận–giải cứu–hộ tống người phu, phá ba chốt kho/khóa tời. Mục tiêu có HP/ô thật, điều kiện thắng/thua, nút ưu tiên cứu và thanh tiến độ.
- **Giữ bản lưu:** sổ đầu mối suy ra từ tiến trình có sẵn. Trận đang chờ từ bản cũ giữ luật hạ địch; trận mới lưu ID mục tiêu và seed. Không đổi phần thưởng chương, không thêm lượt nhận thưởng.
- Kiểm chứng: **140 bài Node, 23 luồng Chromium**, gồm chiến dịch 240 hồi, cứu sớm với sáu người, xung đột lưu/quota/reload, chống lộ thông tin tương lai và replay mẫu 6v6 cũ. [Hướng dẫn, phạm vi và luật nhiệm vụ](docs/CASEBOOK_AND_MISSIONS.md).

## Bản 3.1

- Hội thoại RPG cổ điển giữ chân dung bên lời thoại, nhớ chính xác câu đang đọc, 60 dòng lịch sử và bốn cỡ chữ. Thêm 12 biểu cảm của sáu nhân vật, bảy nền vùng/bí cảnh mới bên nền làng hiện có.
- Bốn boss truyện có cơ chế riêng, ba giây báo trước, choáng ngắt đòn và chọn mục tiêu tập trung. Ấn bảo hộ có thể đánh vỡ; viện binh không vượt sáu địch còn sống.
- Tám nhân vật mẫu có sáu tư thế đứng/di chuyển/đánh/vận chiêu/trúng đòn/ngã. Các nhân vật khác giữ chân dung. Âm thanh chiêu phân biệt đường bắn, quét, hộ thuẫn, hồi phục, lướt; giữ bật tiếng theo thao tác người chơi, tắt hiệu ứng và giảm chuyển động.
- Ba ô lưu đội hình và chiến thuật, gợi ý trước trận, nhận xét từ số liệu thật sau trận.
- Quán → Đồng hành: 15 truyện cho Lão Tam, Tiểu Muội, Huyền Đạo Trưởng, Đường Thập Nhị, Hồng Nương Tử. Mốc thân tình 30/60/100 và chương 2/6/10; mốc cuối có danh hiệu cùng biến thể tuyệt kỹ thay chiêu gốc. Tổng 139 cấu hình hình ảnh chiêu.
- Sửa nhường đường khi bị đồng đội chặn; từ giây 90 tăng dần sát thương và giảm hồi máu đồng đều cho hai phe. Cùng bộ 2.400 trận: hòa **207 → 117 (8,63% → 4,88%)**, trung bình **63,81 → 61,19 giây**. Nhóm sáu người cùng phái còn 16% hòa; đây chưa phải bằng chứng cân bằng mọi đội hình. [Báo cáo](reports/BALANCE_POLISH.md).
- Bản lưu cũ được bổ sung dữ liệu hành trình, giữ kho và tiến trình. [Phạm vi, hướng dẫn và nguồn hình](docs/JOURNEY_3_1.md). Kiểm tra bằng `npm test` và `npm run test:browser`.

## Mốc 3.0: ổn định lưu, viết lại truyện và hình ảnh nhân vật

- **Lưu nhiều tab:** kiểm tra revision trong transaction IndexedDB hoặc Web Locks cho LocalStorage; tab cũ không tự ghi đè tab đã lưu mới hơn. Lỗi ghi/xung đột có thông báo chung, cho xuất nhánh đang chơi, thử lại hoặc tải bản mới nhất. Sáu ô và bản lưu cũ được giữ. Xem [cơ chế và giới hạn](docs/SAVE_SAFETY.md).
- **Đo 6v6:** 2.400 trận, tám nhóm, mỗi bên một main + năm đồng hành; đổi bên từng cặp, kiểm tra nhiều cấp, trang bị, chuẩn bị và mốc phái 2/4/6. Chưa chỉnh chỉ số combat. [Kết quả và giới hạn](reports/BALANCE_6V6.md), [dữ liệu cùng seed/đội hình](reports/balance-6v6.json).
- **Hội thoại kiểu RPG cổ điển:** chân dung nhỏ bên trái, tên và lời thoại bên phải; chạm hoặc Enter để đọc từng câu, nút Trước/Tiếp để xem lại. Lựa chọn hiện sau câu cuối. Áp dụng cho chính truyện, chiêu mộ và Truyện ký; xem lại không nhận thưởng. [Giao diện và nguồn hình](docs/DIALOGUE.md).
- **Truyện và NPC:** viết lại lời dẫn/hội thoại của cả 240 hồi cho rõ người, việc và mục tiêu; sửa lời Bé Na, nhắc lại sự việc thay vì nhiệm vụ cũ. Có 21 chân dung riêng cho nhân vật phụ và phản diện, dùng cả trong đối thoại và trận đấu. Quán → Người đã gặp để tra lại người của hồi đã hoàn thành.
- **Chiêu thức:** 134 cấu hình hình ảnh, 67 họa tiết tuyệt kỹ, đường bay/quét/hộ thể và nhịp riêng. VFX theo đúng mục tiêu thật, có giảm chuyển động/tắt hiệu ứng. [Phạm vi, nguồn ảnh và kiểm chứng](docs/STORY_AND_EFFECTS.md).
- **Kiểm tra:** `npm test` chạy 111 bài Node; `npm run test:browser` chạy 12 luồng Chromium, gồm hai tab thật cho mỗi kho lưu, lỗi quota, checkpoint trận, NPC và hiệu ứng, bốn đoạn kết, hộp thoại tại 320/390/1280px. CI chạy cả hai bộ. Sau `npm ci`, dùng `npx playwright install chromium` trước khi chạy trình duyệt trên máy mới.

Chạy `npm run balance:6v6 -- 150 reports/balance-6v6.json` rồi `node scripts/summarize-6v6.mjs` để tái lập báo cáo mới. Các phần Sprint và nhật ký phiên bản bên dưới mô tả lịch sử; số lượng hiện tại nằm ở đầu README.

## Nâng cấp 3.0

- **12 chương × 20 hồi:** 240 cảnh viết riêng, 68 trận giao chiến, đầu mối liên tục, phản ứng theo lựa chọn trước, lời thoại đồng đội và bốn đoạn kết đầy đủ. Quán → Truyện ký cho phép xem lại hồi đã qua mà không nhận lại thưởng. Bản lưu 12 nhiệm vụ cũ được mở rộng theo mốc đã hoàn thành, giữ tiền, XP, lựa chọn và trận đang chờ; không phát lại phần thưởng.
- **50 đồng hành:** giữ 20 ID cũ, thêm `companion_21`–`companion_50`, mỗi người có chân dung riêng, tiểu sử, tuyệt kỹ và nhiệm vụ mở theo chương. Chi tiết ở [danh sách đồng hành](docs/COMPANIONS.md).
- **Chiêu hiền bằng bạc:** Đội hình → Chiêu hiền quán; mở sau trận đầu. 60 bạc/lượt hoặc 540 bạc/5 lượt. Tỉ lệ gốc bậc 1–5: **50% / 28% / 15% / 6% / 1%**; trong cùng bậc chia đều từng người. Mốc 10 chưa có bậc 4+ nâng kết quả thấp lên bậc 4 (bậc 5 vẫn 1%); mốc 80 chưa có bậc 5 bảo đảm bậc 5. Bậc 5 reset cả hai, bậc 4 reset mốc 10. Lượt trùng vẫn tính bảo đảm. Giá trừ trước toàn bộ, hoàn trùng theo bậc **12 / 18 / 24 / 30 / 36 bạc**, không tạo bản sao hay tăng sức mạnh. Cả 50 người cũng có nhiệm vụ; đã sở hữu từ quay thì không nhận lại thưởng chiêu mộ. Quay không tự đổi đội xuất chiến.
- **Năm khung thẻ:** xám gỗ mộc tối không glow; lục đồng thau; lam viền bạc chạm góc và hover nhẹ; tím mạ vàng ngọc tím với dải sáng chạy viền; kim khung rồng/phượng, hào quang và cánh hoa. Bậc luôn ghi bằng chữ, không chỉ bằng màu. Tắt hiệu ứng hoặc giảm chuyển động sẽ dừng hiệu ứng khung.
- **Lưu an toàn:** tổng lượt, hai bộ đếm và 50 kết quả gần nhất lưu cùng sáu ô hiện có; xuất/nhập giữ nguyên. Tướng quay mới có 15 duyên nợ, không phát XP hay bạc nhiệm vụ. Bản lưu cũ thêm bộ đếm bằng 0.
- **Đồ họa:** 50 ảnh WebP riêng tại `assets/images/companions/`, dùng trong thẻ, xếp trận, danh sách đội, bottom sheet và Canvas chiến đấu; ảnh môn phái chỉ còn dành cho main/chọn phái. Prompt và xuất xứ trong [ART](docs/ART.md).

Quay và tiến trình vẫn chạy **ngoại tuyến trên máy**, chưa có máy chủ xác thực hoặc đồng bộ tài khoản. Bộ đếm được lưu bền trong phạm vi bản lưu, không phải cơ chế chống sửa save phía server.

## Nâng cấp 2.0

- **Chiến thuật:** Main + tối đa 5 đồng đội trên lưới ba hàng tiền/trung/hậu; ngũ hành tương khắc ±15% sát thương và tương sinh hỗ trợ hồi nội lực/hồi máu. Mốc 2/4/6 người cùng phái kích hoạt hiệu ứng; tướng Tự do có thể nhập phái với 80 bạc để mốc 6 dùng được với roster hiện tại. Chỉnh ưu tiên gần nhất/ít máu/hậu tuyến từng tướng trước trận; khiêu khích vẫn có hiệu lực.
- **Nội lực và trạng thái:** tự tung tuyệt kỹ khi đủ nội lực, hoặc chọn chế độ Thủ công để ra lệnh từng tướng trong bottom sheet (đánh thường/di chuyển vẫn tự động). Độc, điểm huyệt, nội thương giảm hồi nội lực, bốc cháy; khí công Long mạch từ Phong Nha cho tuyệt kỹ sát thương đánh theo hàng tiền/trung/hậu (cùng tọa độ x), không phải toàn sân.
- **Kinh tế:** cá +8% HP, trà +15% nội lực, đan +10% HP cho một trận. Trừ ngay khi chốt, lưu cùng seed; thua/rút lui vẫn mất món. Luyện võ tăng thưởng theo cấp, giảm thưởng sau 3 thắng/ngày. Tu luyện 10 bậc, rèn 10 bậc, phí chiêu mộ (hai người đầu miễn phí), nguyên liệu và phí bí cảnh tạo khoản chi dài hạn.
- **Hoạt động:** điểm danh theo giờ Việt Nam, nhiệm vụ ngày/tuần nhận một lần, câu cá 3 lượt/ngày, tiêu cục 2 chuyến/ngày (an toàn/đường tắt, có cọc), luyện đan, rèn vũ khí, tửu quán nghe tin; nhật ký ghi hành động và câu trả lời bằng tiếng Việt.
- **Bí cảnh:** Phong Nha 5 tầng, U Minh 6, Yên Tử 6, Hoa Lư 7, Sơn Đoòng 8. Điều kiện cấp + ngũ hành/phái, mỗi tầng hai lối, phòng giao chiến/kho báu/sự kiện/nghỉ/boss. Giữ HP và tướng đã hạ giữa tầng; đội hình/cấp/bậc rèn được chốt lúc vào. Mỗi vùng mở một khí công riêng; thử thách tuần luân phiên, thưởng tinh hoa/80 bạc một lần mỗi tuần.
- **Cốt truyện:** Đại Việt **giả tưởng**, không tái hiện một triều đại có thật. Giữ năm lớp phái để tương thích dữ liệu cũ; thêm bến làng, Bình Định, U Minh, Hoa Lư, Yên Tử, thành ngữ và lời thoại chơi chữ. Bốn đường cuối: Chính đạo (+2 nhân nghĩa + bằng chứng), Tà đạo (−2 + 100 bạc), Ẩn dật (luôn chọn được), Xưng vương (500 bạc). Bản 1.x đã kết thúc giữ tên kết cục cũ.
- **Điện thoại:** menu dưới Chiến/Đội hình/Quán/Bí cảnh/Túi đồ; menu phụ chứa lưu, kỳ phổ, cài đặt. Nút tối thiểu 44×44 px, safe area, bottom sheet tướng, bố cục dọc và manifest `orientation: portrait`. Khóa dọc toàn màn hình được thử sau khi người chơi nhấn, có thông báo nếu trình duyệt từ chối; web không bảo đảm cưỡng chế hướng trên mọi máy. Chặn double-tap zoom bằng `touch-action`, vẫn cho phép pinch zoom hỗ trợ tiếp cận.
- **Hiệu ứng:** số sát thương, độc xanh, bạo kích vàng, hồi máu lục; chữ tên tuyệt kỹ, bụi/lá, rung nhẹ và quay chậm ngắn. Có nút tắt âm thanh, tắt hiệu ứng/rung; tôn trọng giảm chuyển động. Kiếm/trống/sáo là âm tổng hợp Web Audio, không phải bản thu nhạc cụ thật.

### Phần online: phạm vi hiện tại

**Đại hội hiện đấu AI từ mã đội hình chia sẻ**, gồm cấp/trang bị/khí công/ưu tiên của đội; không chuyển tiền, bậc tu luyện, bậc rèn hoặc món ăn. Ba đội NPC và tối đa tám đội nhập; tối đa ba thưởng thắng/tuần, mỗi đối thủ một lần. Không có PvP thời gian thực hoặc bảng xếp hạng máy chủ.

**Bang hội và điểm danh hiện lưu ngoại tuyến**, chưa có đăng nhập máy chủ, thành viên người chơi khác hay đồng bộ nhiều thiết bị. Repo đang dùng GitHub Pages tĩnh, chưa có backend dành riêng cho game; phần này cần bổ sung dịch vụ xác thực và cơ sở dữ liệu. Không dùng dữ liệu/hạ tầng DolphinApp để giả lập tính năng online.

Lưu giữ nguyên sáu ô IndexedDB và LocalStorage dự phòng có `try/catch`; không đổi kho đột ngột làm mất bản lưu. Đồng hồ nhiệm vụ dùng giờ thiết bị (UTC+7); bản ngoại tuyến không có cơ chế chống sửa đồng hồ/bản lưu ở cấp máy chủ.

### Kiểm chứng 2.0

Đã chạy 1.000 trận trước chỉnh và các vòng 1.000 trận sau chỉnh bằng cùng seed. Xem [toàn bộ 35 cấu hình và khoảng tin cậy](reports/BALANCE.md), [báo cáo gốc](reports/balance-baseline.json) và [báo cáo hiện tại](reports/balance-current.json). **Không coi một bộ mô phỏng 3v3 là bằng chứng cân bằng mọi build 6v6.**

Chạy `npm test` cho bộ kiểm thử và `npm run balance` để tái lập mô phỏng. Kiểm tra trình duyệt 2.0 bao gồm hoạt động, tài nguyên, chọn món/ưu tiên, chế độ thủ công, bottom sheet, chiến dịch thật với đội sáu người, đấu đội chia sẻ, bí cảnh năm tầng, kỹ năng mở từ bí cảnh và lưu/tải; bố cục/nút ở 320/360/390/430/768/1280 px.

## Nhật ký giao diện mobile 1.1

- Màn hình xuất sơn có chọn phái bằng chân dung; nền quán trọ sơn thủy, tông ngọc/vàng và bộ biểu tượng SVG thống nhất.
- Thanh trạng thái giữ tên, cấp, XP và bạc thật trên điện thoại. Sáu mục điều hướng nằm dưới màn hình, chừa vùng an toàn của thiết bị; trong trận menu ẩn để dành chỗ cho bàn đấu.
- Doanh trại có thẻ chính truyện nổi trên cảnh nền, đội xuất chiến ba vị trí và hai khu luyện võ/cửa hàng. Thẻ đồng đội hiển thị duyên nợ, xuất chiến và khóa theo hồi; có bộ lọc Tất cả/Đã mở/Hồi I–III.
- Hồ sơ chia tab Võ công, Thuộc tính, Trang bị; hỗ trợ phím mũi tên, Home/End cho tab. Tên, nhiệm vụ và nội dung người chơi vẫn được dựng bằng DOM an toàn.
- Bàn đấu xoay cách trình bày trên điện thoại: địch phía trên, đội nhà phía dưới; màn hình rộng giữ hai phe trái/phải. Đây chỉ là phép chiếu hiển thị, tọa độ, đội hình, tầm đánh, AI và luật chiến đấu giữ nguyên.
- Chân dung trong UI và trên sân là **năm hình đại diện môn phái**, được dùng lại cho những người cùng phái; chưa phải 20 chân dung nhân vật riêng biệt. Nền và atlas WebP tổng cộng khoảng 790 KB, lưu ngay trong repo, không cần dịch vụ ảnh ngoài. Xem [nguồn và prompt minh họa](assets/images/ART_DIRECTION.md).
- Định dạng bản lưu không thay đổi; người chơi có thể tiếp tục bản 1.0. Tùy chọn giảm chuyển động của thiết bị được tôn trọng. Đã kiểm tra thêm sáu kích thước 320/360/390/430/768/1280 px, chọn phái bằng chạm, tab hồ sơ bằng bàn phím, bộ lọc chiêu mộ và hai cách chiếu bàn đấu; không tràn ngang hoặc lỗi console.

## Bắt đầu chơi

1. Nhập tên, chọn một trong năm môn phái rồi **Khởi hành**.
2. Vào **Chính truyện** ở doanh trại, vượt trận hướng dẫn tại quán trọ.
3. Mở **Đồng đội & Xếp trận**, hoàn thành thử thách rồi mời Lão Tam và Tiểu Muội. Chọn nhân vật rồi chạm ô, hoặc kéo thả để xếp một Main và tối đa năm đồng đội. Thả vào ô có người sẽ đổi chỗ.
4. Vào **Nhân vật** để cộng chỉ số, học cây kỹ năng bốn tầng và thay trang bị đã sở hữu. XP, bạc và vật phẩm đến từ nhiệm vụ hoặc luyện tập; các nút cấp miễn phí của bản thử đã được bỏ khỏi luồng chơi.
5. Tiếp tục chính truyện qua ba hồi. Có thể luyện tập, mua vật dụng, tặng trà tăng duyên nợ và hoàn thành các nhiệm vụ chiêu mộ khác.

Trận tự đánh, có HP/nộ/khiên, số sát thương ngoại công đỏ, nội công tím, bạo kích vàng và hồi máu xanh. **Space** tạm dừng; **1 / 2 / 3** đổi tốc độ. Khi ẩn tab, mô phỏng và nhạc dừng. Kết quả ghi thống kê từng nhân vật và thưởng một lần; rút lui hoặc thua không mất vật phẩm hay XP.

## Sprint 7–10 đã tích hợp

- **Sprint 7:** `BattleRenderer` vẽ trận thật lên Canvas HiDPI, chuyển động, HP/nộ, khiên, báo tuyệt kỹ và số sát thương. `FormationUI` hỗ trợ kéo thả, thao tác chạm và đổi chỗ; chỉ dùng các đồng đội đã chiêu mộ.
- **Sprint 8:** Ban đầu 12 nhiệm vụ chính chia ba hồi và 20 tình huống chiêu mộ; bản 3.0 mở rộng thành 240 hồi và 50 tình huống chiêu mộ, đối thoại có lựa chọn và hai bước ngoặt cốt truyện. Thử thách gồm giao chiến, câu đố tình huống và vật phẩm cần tìm/tiêu hao. Cờ nhiệm vụ, nghiệp và duyên nợ tác động tiến trình, không thể lặp thưởng bằng chọn lại đối thoại.
- **Sprint 9:** Nhạc ngũ cung tổng hợp riêng cho tiêu đề, doanh trại, chiến đấu và kết cục; hiệu ứng tương tác, đánh thường, nội công, hồi máu, tuyệt kỹ, hạ gục và thắng/thua. Nhấn **Bật âm thanh** để cho phép Web Audio; chỉnh âm lượng hoặc tắt trong Thiết lập. Không cần tải file nhạc ngoài. Trình duyệt thiếu Web Audio vẫn chơi được.
- **Sprint 10:** `App` và `main.js` nối tiêu đề → doanh trại → đối thoại/xếp trận → chiến đấu → kết cục; tích hợp cây kỹ năng, trang bị, kỳ phổ và lưu/tải. Giao diện thích ứng điện thoại, không cần build.

| Kết cục | Điều kiện tại nhiệm vụ cuối |
| --- | --- |
| Chính đạo · Hiệp nghĩa Đại Việt | Nhân nghĩa từ +2, đã có bằng chứng sổ tô thuế |
| Tà đạo · Chúa đất giang hồ | Nhân nghĩa từ −2 trở xuống, chi 100 bạc |
| Ẩn dật · Bún đậu tri kỷ | Luôn có thể chọn sau trận cuối |
| Xưng vương · Ngai vàng Hoa Lư | Chi 500 bạc sau trận cuối |

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

Bộ kiểm thử hiện có **84 bài**: engine, lưu trữ/nhập file, dữ liệu, lưới, combat, cây kỹ năng, âm thanh, chuyển đổi bản lưu và chiến dịch. Kiểm thử tích hợp dùng combat thật để đi hết ba hồi, chiêu mộ đủ 20 nhân vật và kiểm tra cả bốn kết cục; đồng thời kiểm tra checkpoint, chặn thưởng lặp, tiêu hao vật phẩm và đội hình hợp lệ.

Đã kiểm tra trên Chromium: khởi hành, chiến đấu, cộng kỹ năng, hai nhiệm vụ chiêu mộ đầu, chọn sai câu đố, kéo thả/chạm đội hình, lưu/xuất/nhập, tải lại giữa trận, toàn bộ chính truyện và bốn màn hình kết cục, bật/tắt/âm lượng Web Audio, bố cục rộng 360px. Không có lỗi console trong luồng này.

**Phạm vi bản 1.0:** nhân vật trên sân và thẻ đồng đội dùng chân dung đại diện môn phái; các thử thách cờ vây/đấu vật/bắn bia/đuổi mái nhà là câu đố lựa chọn tình huống, chưa phải mini-game điều khiển riêng. Nhạc được tổng hợp bằng Web Audio. Mốc 20 giờ chơi trong GDD và 60 FPS trên Chrome/Firefox/Safari chưa được đo/xác nhận; cần chơi thử và cân bằng thêm trước khi coi là bản thương mại.

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
