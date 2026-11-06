# Khung hội thoại và bản đọc gọn

Ba mục “Việc đang theo đuổi và những gì đã rõ”, “Bản thoại đầy đủ · tùy chọn” và “Nhắc lại câu chuyện” được đặt trong phần cuối khung hội thoại, sau lời thoại, nút đọc, lựa chọn, lịch sử và nút về doanh trại. Mốc thời gian/địa điểm và mục tiêu trận cần thiết vẫn ở đầu. Phím đọc, lựa chọn và vị trí câu đang đọc giữ nguyên.

Đã biên tập lại 400 câu nối cảnh, 131 đoạn dẫn dài và hai câu lệnh lặp trong bản đọc mặc định. Cốt truyện vẫn có đủ 400 hồi/20 chương; tên người, bằng chứng án Lục Thư, trách nhiệm Nghiêm/Hà Lập, mốc nhập phái, sự không chắc chắn về cổng và các lựa chọn tình cảm/kết thúc được giữ. 22 cảnh nhánh trở về hiện đại có bản dẫn rút gọn riêng, không dùng nhầm diễn biến ở lại Đại Việt. Trận hồi ức ở nhánh về vẫn ghi rõ là hồi ức.

So với commit `c9f910e70675cd1e21950ba23122b558740feaa8`, tổng số từ cách nhau bằng khoảng trắng trong lời thoại mặc định trước/sau trận giảm từ **39.851 xuống 32.337 (18,86%)**. Độ giảm khác nhau theo chương để không ép cắt chi tiết quan trọng. Phần nhánh về sau cổng giảm từ 1.395 xuống 1.064 từ (23,73%). Không tính bản thoại đầy đủ trong số đo này; bản gốc dài của các đoạn dẫn vẫn nằm trong phần đọc thêm. Số liệu từng chương: `reports/dialogue-shortening7.json`.

Không đổi mã hồi, số trang đọc mặc định, lựa chọn, nhiệm vụ, phần thưởng, điều kiện mở nhân vật hay dữ liệu lưu. `src/data/ConciseNarration7.js` ghi bản biên tập cụ thể, không cắt câu theo số ký tự hoặc bỏ ngẫu nhiên lời kể.

Rà soát ảnh: bộ sáu tư thế riêng của Thợ giấy vẫn là phần còn thiếu. Lần thử tạo ảnh trong đợt sửa này tiếp tục nhận HTTP 429 `usage_limit_reached`; vì vậy không ghi nhận có ảnh mới, không thay chân dung hiện có bằng nhân vật khác.

Kiểm tra: `npm test`; `npx playwright test browser-tests/dialogue-layout7.spec.js browser-tests/dai-viet.spec.js browser-tests/combat6.spec.js`.

Xuất bản: quy trình gói tệp runtime sạch tự chạy nếu lượt Pages mặc định thất bại, vẫn hỗ trợ chạy thủ công. Thay đổi chính cấu hình workflow trên main cũng kích hoạt một lượt để kiểm chứng. Lượt của commit đã bị main thay thế được bỏ qua, tránh bản cũ xuất bản đè bản mới.
