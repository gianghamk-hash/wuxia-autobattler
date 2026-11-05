# Hành trình 3.1

## Cách dùng

- Mở chính truyện/chiêu mộ/Truyện ký: câu đang đọc được nhớ theo từng hồi, tách riêng lần xem lại. Đổi cỡ chữ 16/18/20/22px và mở Lịch sử lời thoại ngay dưới hộp thoại. Chỉ 60 dòng gần nhất được giữ để bản lưu nhỏ. Đọc không nhận thưởng hay thay quyết định.
- Đồng đội → Đội hình của ta: đặt tên rồi lưu tối đa ba đội. Lưu người đang xuất chiến, vị trí, ưu tiên mục tiêu, khí công và tự động/thủ công. Không chuyển tiền, thức ăn, trang bị hoặc việc gia nhập môn phái đã trả phí. Khi có trận chờ/bí cảnh đang đi, kết thúc trước khi đổi/lưu.
- Quán → Đồng hành: năm người đầu có ba truyện ở 30/60/100 thân tình, chương 2/6/10, cần lần lượt hoàn thành. Tặng trà và cùng chiến đấu tăng thân tình theo luật cũ. Mỗi lựa chọn có đoạn kết riêng. Mốc cuối mở danh hiệu và chiêu thay thế; chọn Chiêu gốc hoặc biến thể, không cộng hai chiêu. Xem lại giữ lựa chọn cũ và không phát thưởng lần hai.
- Trong trận, chọn Tập trung mục tiêu ở thẻ địch. Khiêu khích và mê hoặc vẫn áp dụng. Nếu mục tiêu bị chắn, AI có thể đánh mục tiêu tới được; đây là ưu tiên, không phải bảo đảm mọi đòn trúng cùng một người.
- Sau trận, xem người bị hạ đầu, sát thương, thời gian bị chặn và lượt hụt. Đây là mô tả số đo; gợi ý không đảm bảo thắng.

## Boss

Chỉ nhân vật phản diện có danh tính trong chính truyện kích hoạt cơ chế; đấu đội chia sẻ và bộ đo 6v6 không tự mang boss.

| Nhân vật | Cơ chế | Cách đối phó |
| --- | --- | --- |
| Đội trưởng | 65% HP, ba giây gọi hai viện binh yếu; một lần | Choáng trong lúc chuẩn bị hủy lệnh. Không quá sáu địch sống. Không có ô/người trống thì không gọi thêm. |
| Đốc Lệ | 70% HP rồi mỗi 18 giây, chuẩn bị ba giây, giữ chân hai người tuyến trước 2,5 giây | Choáng ngắt đòn; giữ chân vẫn cho đánh, tích nội lực và dùng chiêu. Có thể thanh tẩy. |
| Đỗ Mậu | 70% HP, chuẩn bị ba giây, dựng Ấn có 18% HP tối đa của boss, giảm 65% sát thương boss nhận | Ngắt lúc chuẩn bị hoặc tập trung đánh Ấn. Nếu sân đủ sáu địch, chờ có chỗ để đặt Ấn. Ấn không đánh và biến mất khi chủ bị hạ. |
| Trịnh Nghiêm | 70% HP: đánh dấu hai người ít máu, ba giây sau gây nội thương và giảm chính xác. 35% HP: pha quạt thêm sát thương | Choáng ngắt, bảo vệ hai mục tiêu đã đánh dấu. Hai pha cách tối thiểu 18 giây. |

Cảnh báo và viền đánh dấu vẫn hiện khi tắt hiệu ứng/giảm chuyển động. Mọi thời gian dùng giây mô phỏng, giữ seed và trật tự cố định khi đổi tốc độ.

## Hình và âm thanh

Bảy bối cảnh mới: bến Liễu, U Minh, Bình Định, Hoa Lư, Yên Tử, Phong Nha, Sơn Đoòng; dùng bên nền làng cũ. Chính truyện chọn theo vùng/chương, quán dùng làng, Đại hội dùng sân hội võ, hộ tống dùng bến, bí cảnh có nền tương ứng. Chiêu mộ ngoài chính truyện dùng nền làng khi chưa có địa điểm riêng.

Sáu người có 12 biểu cảm: Bé Na lo/vui, Bà Tư giận/nhẹ lòng, Trịnh Nghiêm cười kín/giận, Đỗ Mậu lo/buông xuôi, Lão Tam nghiêm/ngượng, Tiểu Muội lo/nhẹ lòng. Biểu cảm là lựa chọn đạo diễn theo mốc hồi, không có suy đoán tự động từ từ khóa.

Tám mẫu chuyển động: main năm môn phái, Lão Tam, Tiểu Muội, Trịnh Nghiêm. Mỗi tấm 1536×1024 RGBA, sáu ô vuông theo thứ tự đứng, bước, đánh, vận chiêu, trúng đòn, ngã. Đây là hoạt họa sáu tư thế kèm dịch chuyển nhẹ, không phải hoạt hình nhiều khung mượt cho đủ 50 người. Người khác giữ hình cũ. Hit pause chỉ dừng hình chiếu; không dừng mô phỏng. Giảm chuyển động/tắt hiệu ứng dùng tư thế đứng, giữ số HP/nội lực và thông tin mục tiêu.

Âm thanh được tổng hợp Web Audio, dùng đường đi/màu âm và cao độ ổn định theo chiêu. Không phải bản thu nhạc cụ hay lời thoại lồng tiếng. Chỉ phát sau đồng ý bật tiếng; giới hạn 24 tiếng đồng thời và dừng khi ẩn tab.

Nguồn raster: built-in image_gen. 27 tài sản gồm bảy nền, 12 biểu cảm, tám tấm động tác; prompt, kích thước, dung lượng và SHA-256 trong [manifest](../assets/images/polish-manifest.json). Biểu cảm được chỉnh từ chân dung đã có; giữ nhận dạng/trang phục. Chuyển đổi WebP chỉ đổi kích thước/định dạng. Ấn là SVG hình học viết trong repo. Không lấy hình Robot Taisen/Yu-Gi-Oh làm tài sản.

## Lưu và kiểm chứng

`journey.version=1` bổ sung vào bản lưu, không đổi schema kho lưu. Bản cũ thêm mục trống; bản mới kiểm tra dấu đọc, ba đội, người đã sở hữu, mốc thân tình/chương, thứ tự truyện và biến thể. Biến thể nằm trong bản chụp đội bí cảnh/đội chia sẻ; nhập đối thủ không cấp chiêu hay tài nguyên cho người chơi. Lỗi dữ liệu bị từ chối trước khi thay trạng thái. Cơ chế chống tab cũ ghi đè giữ nguyên.

Đã chạy 127 bài Node và 17 luồng Chromium. Node kiểm tra migration, xuất/nhập, khóa trong thử thách, ba đội, 15 truyện và năm hiệu ứng thực; boss, tập trung/taunt, giữ chân, thêm người/giới hạn, replay tốc độ, thống kê và âm thanh. Chromium kiểm tra lưu/tải dấu đọc, điều khiển đội hình/truyện, tải 27 tài sản/alpha sáu tư thế, 139 cấu hình hiệu ứng với 72 họa tiết tuyệt kỹ khác nhau, cảnh báo boss trên mobile, giảm chuyển động và clip trận 6v6. Bộ Node cũng chạy trọn 240 hồi cùng các kết cục, không chỉ các fixture giao diện.
