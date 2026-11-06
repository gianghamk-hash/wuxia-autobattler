# Rà soát chuyển động sau bản 7.0

60 đồng hành, 20 vai truyện Đại Việt, mười giai đoạn nhân vật chính và 12 lính/boss có atlas đang được nối tới renderer. Năm mẫu phái cũ và Đốc Lệ cũ cũng được giữ. 166 cấu hình hiệu ứng có ảnh; kiểm thử mới chạy sự kiện cast thật của 60 đồng hành, nhân vật chính trước/sau nhập phái và bảy bộ chiêu NPC để đối chiếu đường dẫn ảnh.

Bảy NPC của tuyến truyện cũ chưa có khóa mô hình trước lần sửa này:

| Nhân vật | Xử lý |
|---|---|
| Trưởng xóm | Dùng atlas Đạo Tĩnh, được tạo từ cùng chân dung gốc |
| Đội trưởng | Dùng atlas Sơn Quân, cùng chân dung gốc |
| Cha Tiểu Muội | Dùng atlas Vân Khách, cùng chân dung gốc |
| Bà cụ giữ kho | Dùng atlas Bạch Sơn, cùng chân dung gốc |
| Thư lại | Dùng atlas Lục Thư, cùng chân dung gốc |
| Con gái Đỗ Mậu | Dùng atlas Liên Sư, cùng chân dung gốc |
| Thợ giấy | Chuyển động từ chân dung gốc; chưa có atlas sáu tư thế riêng |

Không đổi tên truyện, chiêu, chỉ số hay luật chiến đấu theo atlas dùng chung. Thợ giấy là vai dân sự; giao diện ghi rõ đây là chuyển động chân dung và không trình bày như mô hình sáu tư thế. Tạo atlas riêng đã bị dịch vụ image_gen từ chối do hết hạn mức; không ghi nhận ảnh mới hoặc dùng ảnh nhân vật khác thay thế.

Renderer bổ sung nhịp thở, bước chạy, đà đánh, vận công và trúng đòn theo tư thế sẵn có. Khung xem mô hình chuyển động theo tư thế được chọn; gục/nghỉ giữ tĩnh. Đây là biến đổi 2D trên các tư thế đã có, không phải các khung hình vẽ mới. Cả renderer và khung xem tuân thủ giảm chuyển động. Cast từ boss/script cũng kích hoạt tư thế ra chiêu. Hiệu ứng ảnh có vận chiêu, bay và nở khi tác động; đường ném có độ cong, hộ thuẫn ở người nhận.

Kiểm tra: `node --test tests/animation-coverage.test.js tests/ui-art.test.js`, `npm test`, `npx playwright test browser-tests/animation-coverage.spec.js browser-tests/overhaul7.spec.js`.
