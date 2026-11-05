# Giao diện và hình ảnh 3.3

## Ưu tiên hình ảnh

`node scripts/visual-priorities.mjs reports/VISUAL_PRIORITIES.json` đếm lời nói, dòng nhắc tên và vị trí quân địch của chính truyện. Điểm = 3 × lời nói + dòng nhắc + vị trí quân địch. Đây là số liệu từ nội dung viết sẵn, không phải thời gian chơi thực tế hay số lần người chơi chọn đồng hành. Cùng người có thể được nhắc bằng tên ngắn; mỗi dòng chỉ tính một lần cho mỗi người.

- Tay sai đứng đầu với 279 vị trí quân địch, được bổ sung bộ động tác riêng.
- Lão Tam và Tiểu Muội đã có động tác, biểu cảm; đợt này hoàn thiện ba đồng hành còn lại có truyện thân tình: Huyền Đạo Trưởng, Đường Thập Nhị, Hồng Nương Tử.
- Vũ Bình, Thợ Bảy, Kha Vân, Cẩm Tú thêm hai biểu cảm/người để thể hiện các bước chuyển trong mạch đầu mối. Quán chủ và Đốc Lệ cũng thêm hai biểu cảm/người. Bé Na, Bà Tư tiếp tục dùng biểu cảm riêng đã có.
- Kha Vân, Đỗ Mậu, Đốc Lệ, Quán chủ, người phu và tay sai có sáu tư thế. Người phu được giải cứu dùng hình riêng; tư thế phòng vệ không biến người dân thành chiến binh.

Tổng mới: chín bộ động tác và 12 biểu cảm, khoảng 3,77 MB. Tổng hiện tại: 17 bộ động tác và 24 biểu cảm cho 12 người. Các nhân vật còn lại giữ chân dung riêng và hiệu ứng sẵn có; chưa có bộ động tác cho toàn bộ 50 đồng hành.

## Nguồn hình

Ảnh được tạo bằng công cụ image_gen tích hợp, tham chiếu chân dung hiện có để giữ diện mạo. Bộ động tác có nền trong suốt, lưới 3 × 2, mỗi ô 512px; biểu cảm dọc 480 × 720px. Hai bộ Đỗ Mậu và Huyền Đạo Trưởng được chỉnh lại nền trong suốt bằng image_gen. Sau tạo ảnh chỉ đổi kích thước/nén WebP; không vẽ lại bằng mã.

[Manifest](../assets/images/ui-polish-manifest.json) lưu prompt, đường dẫn chân dung tham chiếu, kích thước và SHA-256 của đủ 21 tài nguyên. Chân dung gốc và các bộ hình trước được giữ. Kiểm tra trình duyệt giải mã đủ ảnh, sáu ô có nhân vật và nền trong suốt; đồng thời đã xem trực tiếp ảnh tổng hợp.

## Thao tác

- Đồng đội mở ở Xếp trận; bốn mục có điều hướng bằng phím trái/phải/Home/End. Bộ lọc tên/bậc chỉ hiện trong mục Đồng đội. Ba ô lưu đội hình ở ngay sau bàn xếp trận và chiến thuật.
- Thanh thao tác nhanh đưa về Doanh trại, Lưu / Tải hoặc đầu trang. Các mục chính có nút dưới màn hình điện thoại; Quán dùng lưới chín mục thay cho hàng bị khuất ngang.
- Nhớ mục Hồ sơ, vị trí cuộn trang thường và bộ lọc Sổ đầu mối trong phiên; cảnh truyện và trận mở từ đầu. Không thêm dữ liệu này vào bản lưu.
- Tất cả nút và summary có biểu tượng SVG trang trí, vẫn giữ tên dễ đọc cho trình đọc màn hình. Biểu tượng được cập nhật khi nhãn động thay đổi, không nhân đôi sau mỗi lần render. Nút đóng dùng biểu tượng và nhãn truy cập.
- Các nút có vùng bấm tối thiểu 44px, ô nhập chữ 16px, viền focus rõ; tôn trọng giảm chuyển động và vùng an toàn dưới màn hình. Menu, Lưu/Tải, bộ lọc, đội hình và hội thoại được chỉnh khoảng cách.
- Trong trận có lối đến Bàn đấu, Tướng & ý đồ, Kết quả. Chế độ thủ công có nút Tung tuyệt kỹ trên thẻ đồng minh: chỉ sáng khi đang đánh, còn sống và đủ năng lượng, đưa lệnh vào cơ chế hiện có. Điều kiện thắng/thua luôn hiện; hướng dẫn dài nằm trong Cách hoàn thành.

## Kiểm chứng

`npm test`: 144 bài. `npm run test:browser`: 31 luồng Chromium, gồm các kiểm tra trước về bản lưu nhiều tab, checkpoint, 240 hồi, bốn kết thúc, 6v6, mục tiêu nhiệm vụ và chống nhận thưởng lại; thêm tám luồng về giao diện/ảnh. Kiểm tra các màn chính ở 320/390/768/1280px: không tràn ngang, nút có tên và biểu tượng, không nhân đôi biểu tượng, vùng bấm đủ lớn. Kiểm tra bàn phím, nhớ trang, lưu đội và nút tuyệt kỹ thực thi qua cơ chế thật.

Đợt này không thay chỉ số, giá chiêu hiền hay luật chiến đấu/lưu game. Phiên bản chương trình và dữ liệu phiên là 3.3.0; cơ chế migration, sáu ô lưu và kiểm tra revision được giữ.
