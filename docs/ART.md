# Chân dung đồng hành

Bản 3.0 có **50 ảnh độc lập**, không dùng ảnh môn phái rồi đổi màu để giả thành nhân vật mới. 20 người cũ cũng được vẽ riêng. Mỗi ảnh có gương mặt, tuổi, kiểu tóc, phục trang, đạo cụ và bối cảnh nhận diện riêng. Khung thẻ do CSS và SVG dựng bên ngoài ảnh; thay bậc hoặc nhập phái không thay chân dung.

- Ảnh dùng trong game: `assets/images/companions/companion_01.webp` đến `companion_50.webp`, 480 × 720 px.
- Tạo bằng công cụ image generation tích hợp, mỗi người một lần tạo riêng; chỉ chuyển kích thước và định dạng WebP sau khi tạo. Không dùng CLI hay ảnh chân dung kho có sẵn.
- Bộ prompt đầy đủ, tên người và SHA-256 nằm trong [manifest](../assets/images/companions/manifest.json). Prompt gồm phong cách chung và mô tả riêng từng người. Lão Tam dùng cùng hướng mỹ thuật với biến thể câu chữ ở lượt đầu.
- Phong cách chung: tranh nhân vật kiếm hiệp Việt Nam, nét mực rõ, màu gouache có chất liệu, bóng xanh ngọc và ánh sáng ấm; một người nửa thân, mặt dễ nhận, khung đứng 2:3; không chữ, không viền, không watermark.
- `long-phuong-frame.svg` là họa tiết rồng/phượng dùng chung của **khung bậc 5**, không phải chân dung. Bậc 3 có hoa văn góc; bậc 4 chạy dải sáng trên viền; bậc 5 có cánh hoa và aura. Tắt hiệu ứng hoặc reduced motion dừng chuyển động này.

Đã xem đủ 50 ảnh sau chuyển WebP, kiểm tra đường dẫn và mã băm riêng. Ảnh phái cũ vẫn dành cho main và màn chọn phái. Khung xám không glow; ánh sáng không thay thế nhãn phẩm bậc bằng chữ.
