# Truyện, nhân vật và hiệu ứng chiến đấu

## Truyện được kể lại

`StoryRewriteData.js` viết lại toàn bộ **12 chương × 20 hồi** bằng sự việc cụ thể và câu thoại ngắn. Mạch chính vẫn là tìm người gửi sổ, cứu người bị bắt, tìm cách dân bị tăng nợ rồi đối mặt người đứng sau. Không thêm nhiệm vụ bắt người chơi cày lại.

| Chương | Người chơi đang làm gì, vì sao đi tiếp |
| --- | --- |
| 1 | Cứu quán Rồng Lửa; biết sổ nợ bị sửa và cha Bé Na đang mất tích. |
| 2 | Gặp Lão Tam, Tiểu Muội; nối vụ cha nàng mất tích với chuyến thóc. |
| 3 | Tìm Vũ Bình tại bến Liễu; biết ông từng sửa sổ và kho U Minh giữ người làm chứng. |
| 4 | Cứu đoàn phu, cha Tiểu Muội; lấy lệnh của Đốc Lệ dẫn tới Vạn Lợi và hội võ. |
| 5 | Gặp Kha Vân; phát hiện võ sĩ bị buộc ký nợ, lấy quyền vào kho sổ. |
| 6 | So bản gốc với bản sửa; tìm đường giấy, tiền và con dấu được dùng ra sao. |
| 7 | Giữ Thợ Bảy và khuôn dấu; mang vật chứng tới hỏi quan trấn Hoa Lư. |
| 8 | Đối chất Đỗ Mậu; biết lý do ông bị khống chế và lấy lệnh nối Vạn Lợi với hộ vệ. |
| 9 | Đưa người làm chứng lên Yên Tử trước lễ liên minh của Trịnh Nghiêm. |
| 10 | Cứu Cẩm Tú và người diễn; kiểm chứng màn cứu trợ, võ công dàn dựng. |
| 11 | Bảo vệ buổi đối chứng, vạch vai trò Trịnh Nghiêm rồi hạ đội thân vệ. |
| 12 | Trả người, thóc và giấy tờ về đúng nơi; Na gặp lại cha; chọn kết cục. |

Sửa lỗi Bé Na nói về người khách như người lạ rồi ngay sau đó nhận là cha. Mỗi lượt chỉ có một người nói, không còn chèn `Bạn:` trong câu của phản diện. Phần **Trước đó** dùng sự việc đã kể ở hồi trước thay cho câu yêu cầu làm việc chưa được xác nhận. Hộp thoại hiện mục tiêu chương, vai trò người nói và phần nhắc lại có thể mở ra đọc.

Giữ ID 240 nhiệm vụ, vị trí trận, cấp độ, ngân sách XP/bạc, lựa chọn đã lưu và mốc mở đồng hành. Bốn đoạn kết cũng được viết lại rõ hậu quả của lựa chọn, tách đúng người nói và hiện chân dung bên lời thoại. Các phản ứng theo lựa chọn cũ được giữ và diễn đạt lại. Phiên bản bản lưu không đổi; xem lại không phát thưởng.

## 21 nhân vật có hình riêng

Quán chủ, Bà Tư, Bé Na, Trưởng xóm, Người đánh xe, Đội trưởng, Người lái đò, Vũ Bình, Người phu, Đốc Lệ, Cha Tiểu Muội, Bà cụ giữ kho, Kha Vân, Thư lại, Thợ giấy, Thợ Bảy, Con gái Đỗ Mậu, Đỗ Mậu, Cẩm Tú, Trịnh Nghiêm và Tay sai thu tô.

Mỗi người có ID, tên/biệt danh, vai trò, lời giới thiệu và một ảnh WebP riêng, không lấy ảnh đồng hành khác thay thế. 21 ảnh tổng khoảng **1,40 MB**, tải khi cần. Chân dung được dùng trong hội thoại, sân đấu và bảng thông tin. Các đối thủ chính có danh tính truyện; chỉ thay tên/hình/nhãn chiêu, giữ các thông số và hiệu ứng chiến đấu gốc. Quán chủ hỗ trợ trận mở đầu có hình và chiêu muôi gỗ riêng; hỗ trợ những trận sau không còn gọi nhầm thành Quán chủ đang ở làng.

**Quán → Người đã gặp** ghi các NPC của hồi đã hoàn thành, giúp tra lại tên và vai trò mà không hé lộ người ở chương sau. Danh sách được suy ra từ tiến trình hiện có, không cấp thưởng hay mở tướng.

Ảnh dùng công cụ **image_gen tích hợp**, mỗi nhân vật một yêu cầu tạo ảnh độc lập; chỉ đổi kích thước/định dạng sang WebP sau khi tạo. Prompt đầy đủ, kích thước, số byte và SHA-256 trong `assets/images/npcs/manifest.json`. Đã xem bảng toàn bộ 21 ảnh để kiểm tra mặt, tuổi, trang phục và nhận diện.

## Dấu ấn chiêu thức

`SkillVisualsData.js` có **134 cấu hình**: đòn thường và tuyệt kỹ 50 đồng hành; đòn thường/tuyệt kỹ cơ bản của năm phái; mười tuyệt kỹ nâng cao; đòn và tuyệt kỹ của bảy nhân vật giao chiến trong truyện. Có **67 hình dấu riêng** của tuyệt kỹ; chiêu cơ bản mà main học lại từ cùng môn phái giữ họa tiết liên quan.

Ví dụ: Đả Cẩu Bổng quét bổng, Tam Tuyến Ám Khí phóng ba mũi, Thiềm Thừ Độc Bạo có hình cóc và độc, Mê Hồn Vũ dùng lụa, Nguyệt Cầm dùng trăng/dây đàn, Long Quyền có long hình, Phượng Vũ có cánh phượng. Phản diện có cờ lệnh, trận giam, quan ấn hoặc quạt đen/dây khống chế. Đây là hiệu ứng Canvas vẽ bằng mã và hoạt ảnh, không phải video nhân vật hay sprite phim dựng sẵn.

Mỗi cấu hình quy định họa tiết, bảng màu, đường bay/quét/khói/hộ thể và thời lượng. Sự kiện `skill:cast` giữ vị trí xuất chiêu và danh sách mục tiêu thật sau khi chọn vùng/hàng/nhiều tia. Không dùng RNG chiến đấu cho hình ảnh. Giới hạn 18 hiệu ứng chiêu cùng lúc, tối đa tám đòn thường đang hiện, ưu tiên giữ tuyệt kỹ. Tắt hiệu ứng xóa hàng đợi; giảm chuyển động dùng dấu tĩnh, không bay/quét. Số HP vẫn đọc được.

## Kiểm chứng

- **111 bài Node:** đi hết 240 hồi, đủ 50 đồng hành và bốn kết cục, tương thích save; độ phủ người nói/chân dung; chiêu có cấu hình; nguồn và mục tiêu VFX không bị đổi sau sự kiện.
- **12 luồng Chromium:** lưu hai tab/quota, thoại 320/390/1280px, Người đã gặp không lộ Trịnh Nghiêm ngay đầu game, 21 ảnh tải được, 134 cấu hình vẽ được bằng Canvas thật, không rò biến đổi tọa độ, tắt hiệu ứng và giảm chuyển động; checkpoint trận và xem lại không nhận thưởng; cả bốn màn hình kết cục có chân dung và thống kê 50 đồng hành.
- Phát lại **16 trận mẫu 6v6** từ báo cáo cũ, khớp kết quả; không đổi chỉ số cân bằng.
- Có ảnh bảng NPC, bảng họa tiết và video mẫu chuyển động tạo trực tiếp bằng cùng bộ vẽ. Chưa đo FPS trên điện thoại thật hoặc xác nhận Firefox/Safari.
