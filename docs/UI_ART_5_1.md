# Bản 5.1 — Sắp xếp màn hình và bộ hình màu

- Trang hành trình giữ khung truyện và bước tiếp theo. Bỏ hoàn toàn khối “Người cùng đường”, sáu ô đội và nút xếp trận trùng chức năng; việc xếp đội vẫn ở mục Đội hình.
- “Rèn luyện mỗi ngày / Sân luyện võ” nằm trong Bí cảnh. Giữ nguyên quy tắc thưởng và điều kiện nhập môn của sân luyện, không chuyển nó thành một bí cảnh tính lượt mới.
- “Quán nhỏ ven đường” nằm trong Quán → Quán & Rèn; đây là tab mặc định khi mở Quán. Gộp quầy cũ bán cùng ba món, chỉ còn một bộ nút mua dây/cá/trà. Giữ node và trình xử lý mua khi chuyển tab, không gắn lại listener mỗi lần render. Nhãn bạc/hành trang tiếp tục cập nhật ngay cả khi quầy không đang được mở.
- Thêm bối cảnh riêng cho mười chân dung 51–60, giữ mã nhân vật, khuôn mặt, trang phục và khung độ hiếm. Nền dựa trên vai trò trong truyện: đường thư, bến đò, xưởng mộc, trạm gác, y quán, đường rừng, thư phòng, kho lương, sân chùa, đình ven sông. 50 chân dung trước giữ nguyên. URL của mười hình thay đổi có khóa `art=5.1` để người đã chơi không tiếp tục thấy ảnh nền cũ từ cache; áp dụng cùng cách cho UI và chân dung dự phòng trên sân đấu.
- Thay toàn bộ bộ biểu tượng nét đơn bằng 40 ảnh WebP màu đã render, 96×96 px, giữ nền trong suốt. Các ảnh được dùng qua một hàm chung, kể cả icon ở nút động, lời thoại, dấu đội hình và chặng boss bí cảnh. Có ảnh riêng cho dây, cá và trạng thái tắt âm. Nhãn chữ và tên truy cập của nút được giữ; ảnh trang trí dùng `alt=""` và `aria-hidden="true"`.

Ảnh được tạo bằng công cụ image_gen tích hợp. File nguồn gốc được giữ riêng; chỉ cắt ô atlas, thay kích thước và nén để đưa vào game. Prompt, nguồn và hash nằm tại `assets/images/icons/manifest.json` và `assets/images/companions/expansion-backgrounds-manifest.json`. Bộ manifest chân dung mở rộng cũng cập nhật hash tương ứng.

Các thay đổi này không đổi cốt truyện, chỉ số, tiền, lượt bí cảnh hoặc cấu trúc bản lưu.
