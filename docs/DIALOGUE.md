# Hội thoại chân dung kiểu RPG cổ điển

Hộp thoại gồm chân dung nhỏ bên trái, tên người nói và lời thoại bên phải, trên nền cảnh giang hồ. Mỗi lần hiển thị một câu; bấm vào hộp, Enter hoặc Space để tiếp tục. Nút Trước/Tiếp và phím mũi tên hỗ trợ đọc lại. Lựa chọn được hiển thị sau câu cuối; chỉ khi chọn mới gọi hành động Campaign. Không có tự chạy chữ hoặc cuộn truyện dài.

Dùng chung cho chính truyện, chiêu mộ và Truyện ký. Đọc và quay lại các câu không ghi tiến trình hoặc phát thưởng. Các lựa chọn bị khóa vẫn bị khóa. Tên và lời thoại dùng textContent; các thay đổi lời thoại theo quyết định trước giữ nguyên.

Chân dung main lấy theo môn phái đã chọn. Đồng hành dùng 50 chân dung sẵn có, kể cả tên gọi ngắn như Lão Tam. Quán chủ lấy phần hình của ông trong tranh mở đầu đã có, hiển thị bằng khung cắt CSS. Người kể dùng biểu tượng sách; NPC chưa có chân dung dùng biểu tượng người, không gán nhầm hình một đồng hành khác. Có thể bổ sung chân dung riêng cho các NPC về sau.

Nguồn: `assets/images/sect-portraits.webp`, `assets/images/companions/`, và `assets/images/story/chapter01-opening.webp`. Tranh mở đầu trước đây là nguồn của chân dung Quán chủ; prompt và xuất xứ được lưu ở [WEBTOON.md](WEBTOON.md) như tài liệu lịch sử. Giao diện webtoon đã được thay bằng hộp thoại này; không tải trang truyện cuộn.

Kiểm tra Chromium ở 320/390/1280px, chạm/Enter/mũi tên, chân dung main và Lão Tam, NPC chưa có ảnh, lựa chọn bị khóa, giao chiến sau câu cuối, và xem lại không phát thưởng. Cơ chế lưu game và dữ liệu đo 6v6 được giữ nguyên.
