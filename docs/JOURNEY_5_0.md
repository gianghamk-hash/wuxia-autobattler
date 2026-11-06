# Đại Việt 5.0 — Âm nhạc, hình ảnh và lối chơi dọc

## Những thay đổi người chơi nhìn thấy

- Sáu MP3 người dùng cung cấp được sao chép nguyên vẹn vào `assets/audio`. Playlist phát tuần tự, hết bài thứ sáu quay về bài đầu. Chuyển giữa truyện, đội hình, bí cảnh, trận đấu và kết cục giữ bài/tiến độ; trong trận hạ nền để nghe kỹ năng. Tắt loa hoặc rời tab tạm dừng, bật lại tiếp tục. Vị trí nhạc được nhớ riêng trên thiết bị, không viết vào ô lưu chiến dịch.
- Hiệu ứng đánh có lớp trầm giảm tần, tiếng va chạm nhiễu ngắn đã lọc và âm sắc riêng của động tác. Tuyệt kỹ có lực trầm mạnh hơn, giữ giới hạn số tiếng phát đồng thời và quyền tắt âm.
- Sửa ảnh chính ở cả ô xếp trận và hình lớn hành trình. Mười ngoại hình có mười atlas chuyển động 3×2 riêng: đứng, chạy, đánh thường, tuyệt kỹ, trúng đòn, ngã. Bản xem lại dùng giai đoạn của hồi, không lấy ngoại hình cuối hành trình.
- 36 hình trang bị theo ba bộ × ba ô × bốn phẩm chất; toàn bộ 54 món, kể cả đồ cũ, có ánh xạ hình phù hợp ô/vai trò. Đồ cũ dùng lại tranh của nhóm phù hợp, không có 54 bức riêng. Xuất sắc và Trác việt có khung, ánh sáng cầu kỳ hơn. Hào quang trên nhân vật chính và ô xếp trận lấy phẩm chất cao nhất đang mặc; hiệu ứng mang tính trình bày, không cộng ngầm chỉ số.
- Giao diện dọc có hành động chính rõ, nút chạm tối thiểu 48 px, hình đồ ở hồ sơ và kho, ba nút chọn hướng võ công, mô tả tác dụng từng điểm thuộc tính. Đội hình và trận đấu có bảng các buff đang kích hoạt; màn hình hành trình hiện bối cảnh đang tới thay cho tên quán cố định.

## Truyện và thời gian

Giữ 20 chương × 20 hồi, 105 trận và 43 mục tiêu chính có sẵn. Bổ sung 400 đoạn nối/chốt cảnh và 19 đoạn chuyển chương có nguyên nhân rõ; bản xuất hiện khoảng 50.000 từ. Đoạn sau trận chỉ thêm vào phần hậu chiến, không kể thắng trước khi người chơi đánh. Các phần nhân vật bổ sung vẫn giữ đủ trước/sau trận.

Mỗi chương có trục mười bước: sự việc → nguyên nhân → tác động → mục tiêu → leo thang → mâu thuẫn → xử lý → kết quả ngắn hạn → hệ quả dài hạn → trạng thái mới. Các hồi triển khai từng bước của cùng vấn đề; không ép mỗi hồi thành một vụ án khép kín rồi mở lại từ đầu. 400 hồi có mốc thời gian/địa điểm theo chặng, và mục “Việc đang theo đuổi và những gì đã rõ” chỉ hiện dữ kiện đã tới nguồn. Mốc mở dữ kiện được đặt riêng từng chương để tránh lộ kết quả trận và lời khai sớm.

Vụ thóc và án Lục Thư được giữ là đầu mối còn mở qua các chương, tách khỏi phần trả thóc/gỡ tội đã xử lý. Chuyến Hải Vân đi qua nhiều tuần, hội võ sau sang mùa khác; dựng quân và tập bắn mất nhiều tuần; hậu chiến có nhiều tháng trước lựa chọn về/ở. Nhánh về hiện đại giữ các cảnh riêng và mốc gần ba tháng mất tích ở hiện đại; không gắn lịch chỉ huy Đại Việt vào cảnh hiện đại.

## Quy tắc lượt

Mỗi bí cảnh có **2 lượt/ngày**. Lượt thường và tuần của cùng bí cảnh dùng chung số lượt. Mỗi boss chương ôn trận có hạn mức riêng **2 lượt/ngày**. Sau khi dùng hết hai lượt, được mua **đúng 1 lượt thêm với 60 bạc** cho từng nơi, mỗi ngày; phí vào bí cảnh vẫn tính riêng. Trận chính truyện và nhiệm vụ mời bạn không bị giới hạn này.

Lượt tính khi nhận hành trình, kể cả thua/rút lui. Tải lại hoặc tiếp tục trận đang lưu không trừ thêm; lượt mua không được hoàn lại bằng cách rút. Đặt lại lúc 00:00 giờ Việt Nam. Đổi ngày không bỏ hành trình đang đi. Mua, trừ bạc, trừ lượt và tạo trận nằm trong cùng thao tác lưu để thất bại không trừ dở dang. Bản lưu cũ thiếu bảng lượt mặc định chưa dùng lượt của ngày hiện tại.

## Cấp và hướng build

Giữ cấp tối đa 20, hai điểm thuộc tính mỗi lần lên cấp và một điểm kỹ năng mỗi cấp. Cấp đã có và điểm đã nhận trong bản lưu cũ không giảm. XP mỗi cấp vẫn là cấp × 100 tới cấp 7; từ cấp 8 nhân thêm `1 + (cấp − 7) × 0,08`, làm tròn. Không giảm thưởng XP/bạc theo mã hồi.

- **Sát lực:** nhánh công kích đã có, giữ các mã đã học.
- **Cân bằng:** bốn nút mới mỗi phái, vừa công vừa HP/phòng, tuyệt kỹ vùng 160% công chủ đạo và khiên bản thân 20% HP trong 5 giây. Khiên tạo một lần cho người dùng, không cấp cho địch bị đánh.
- **Phòng thủ:** nhánh hộ thân đã có, giữ các mã đã học.

Có thể phối nút; chỉ học một tuyệt kỹ tầng 4. Hoàn điểm để đổi hướng. Tính bộ trang bị và buff đội hình theo quy tắc cũ, hiển thị rõ số người/mốc đang kích hoạt. Không có nội dung truyện trả phí mới.

## Đo lường và giới hạn

`scripts/balance-journey.mjs` đo 1.080 trận ghép cặp có seed: 5 phái × 3 hướng × 2 mức đồ × 6 trận chính × 3 seed × 2 luật địch. Cấp lấy từ toàn bộ XP chính truyện trước điểm đo theo đường cấp mới. Chỉ phần tăng HP/công 5.0 của địch được tháo ra ở đối chứng; đây không phải chạy nguyên bản checkout 4.3. Cùng một đội năm đồng hành, không đồ ăn, luyện công, rèn hoặc điều khiển tuyệt kỹ thủ công. Không đại diện mọi đội, trận hoặc boss.

Từ chương 8, mỗi chương thêm 0,9% HP và 0,6% công lên hệ số 4.3 của trận chính thuộc nhóm đã điều chỉnh; không tăng các bài đối luyện và trận Lôi. Trong mẫu cuối game: bộ Hiếm thắng 79/90 ở luật địch cũ và 62/90 ở luật mới; bộ Xuất sắc hợp hướng thắng 81/90 và 69/90. Mở đầu mẫu giữ 90/90. XP tự nhiên đưa mẫu chương 15 từ cấp 20 xuống tiến độ cấp 17 cho người chơi mới; chương 18 cấp 19. Các tỉ lệ này là số đo mẫu, không là mục tiêu thắng bắt buộc của mọi người chơi.

Ảnh dùng công cụ image_gen tích hợp; prompt, nguồn và hash nằm trong manifest ảnh. Các MP3 có manifest hash bản gốc do người dùng cung cấp. Không thay nội dung tệp gốc trên máy.
