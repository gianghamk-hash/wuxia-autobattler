# Đầu mối, trinh sát và mục tiêu trận — 3.2

## Sổ đầu mối

Mở ở doanh trại hoặc Quán → Sổ đầu mối. Có 34 ghi chép phân loại vật chứng/lời chứng/đối chiếu/nghi vấn/kết quả, sáu câu hỏi và bảy quan hệ. Chỉ hiện thông tin từ hồi đã hoàn thành, không dựa vào dòng vừa đọc. Câu hỏi chưa giải quyết không chứa câu trả lời ẩn trong DOM. Hồ sơ nhân vật dùng các đầu mối đã mở, không dùng tiểu sử NPC đầy đủ có thể lộ chuyện về sau.

Tìm kiếm không dấu; chạm tên để mở hồ sơ, chạm nguồn để xem lại hồi tương ứng. Xem nguồn không mở lựa chọn hoặc phát thưởng. Việc cần làm tiếp dẫn về hồi hiện tại.

Sổ suy ra từ completedQuests, không thêm kho vật phẩm/cờ thưởng. Mốc chương của bản cũ dùng theo tiến trình đã chuyển đổi trước đó. Đây là tuyển tập đầu mối chính, không chép lại đủ 240 hồi.

## Trinh sát và ý đồ

Trước trận chính truyện, mở Trinh sát trước trận trong hội thoại. Danh tính, cấp, HP, vai trò và kỹ năng dùng chung hàm dựng đội địch với trận thật. Có hướng dẫn cơ chế boss, luật thắng/thua cho trận đặc biệt. Xem trinh sát không chạy trận, không trừ món ăn, không đổi seed hay tài nguyên.

Trong mọi trận, thẻ nhân vật hiển thị quyết định AI hiện tại: tiếp cận/theo dõi/nhắm ai, chuẩn bị hồi máu/hỗ trợ/tuyệt kỹ cho ai, choáng/giữ chân/giải cứu/đã bị hạ. Boss có đếm ngược và mục tiêu đánh dấu; Canvas bổ sung nhãn ngắn cho hành động nguy hiểm.

Thông tin chỉ đọc trạng thái thực, không chọn lại mục tiêu hoặc gọi số ngẫu nhiên. Đích có thể đổi khi chết, bị khiêu khích, đổi tầm/đường đi; không bảo đảm đòn chắc chắn trúng. Trinh sát trước trận hiện áp dụng cho chính truyện; ý đồ trong trận áp dụng cả luyện võ, chiêu mộ, đại hội và bí cảnh.

## Chín trận đặc biệt

| Hồi | Mục tiêu | Điều kiện thắng |
| --- | --- | --- |
| C01H09 | Giữ đường cho Na | Có người chiến đấu sống qua 30 giây, tiếp viện ở giây 10/20. |
| C01H14 | Giữ xe và phiếu hàng | Xe sống 25 giây hoặc hết đội áp tải. |
| C04H02 | Đưa phu khỏi trại | Tiếp cận, cứu hai giây, hộ tống về mép sân nhà. |
| C04H10 | Cứu người trước lửa | Như trên; NPC đại diện nhóm phu trong dãy nhà. |
| C06H12 | Mở kho | Phá đủ ba chốt, không cần hạ hết lính. |
| C07H13 | Giữ hòm khuôn | Hòm sống 25 giây hoặc hết toán truy cướp. |
| C10H18 | Giữ đường vận hành tời | Phá đủ ba khóa tời. |
| C11H02 | Mở lối khán giả | Có người chiến đấu sống qua 30 giây, tiếp viện ở giây 10/20. |
| C12H14 | Giữ thóc trả làng | Xe sống 25 giây hoặc hết toán cướp. |

Mất hết người chiến đấu, mất đối tượng cần bảo vệ hoặc hết 120 giây chưa xong tính thất bại. Nhiệm vụ quá giờ không dùng luật hòa của trận thường. Tiếp viện chỉ vào khi có ô trống và không vượt sáu địch sống.

Xe/hòm/chốt/người phu có HP và ô thật, nhưng không chiếm suất trong sáu đồng hành, không góp cộng hưởng môn phái. Trận phá chốt có thể có sáu võ sĩ địch cộng ba chốt. Hồi máu/hộ thuẫn có thể bảo vệ mục tiêu đồng minh. Một kẻ địch tìm tới mục tiêu bảo vệ; có thể kéo hắn bằng khiêu khích hoặc chặn đường.

Ưu tiên cứu người cử main nếu còn sống, nếu không cử một đồng đội còn sống. Người đó đi tới trong một ô rồi dành hai giây cứu thay vì đánh. Choáng làm mất tiến độ; giữ chân chỉ cản bước, không cản cứu khi đã đứng cạnh. Người bị giữ chưa bị địch đánh; sau khi được thả có thể bị đuổi và bị hạ. Không chọn cứu sớm thì đội tự cứu sau khi hết địch.

NPC hộ tống tìm đường và đi từng chặng về mép sân, nhờ đồng đội nhường đường khi bị chặn, không dịch chuyển xuyên người. Thanh tiến độ gồm mở trói và đường về; chưa tới cửa thì chưa thắng.

## Lưu và kiểm chứng

Không đổi schema kho lưu, revision truyện, XP/bạc hoặc điều kiện kết cục. Chỉ trận mới tại chín hồi lưu pendingEncounter.missionId; kiểm tra ID phải khớp hồi và loại trận. Trận chờ cũ thiếu trường này tiếp tục dùng luật hạ địch. Lưu/tải vẫn là checkpoint đầu trận với seed cố định, không lưu giữa hộ tống.

Thắng nhiệm vụ dùng cơ chế hoàn thành/thưởng một lần hiện có; thất bại không đẩy hồi, không nhận thưởng. Sửa đường hộ tống chỉ áp dụng trong nhiệm vụ, không đổi nhường đường của 6v6 thông thường.

Đã chạy 140 bài Node, 23 luồng Chromium. Có kiểm tra mọi mốc mở đầu mối, nguồn thật, trinh sát giống địch thật/không tiêu tài nguyên, checkpoint mới/cũ, bốn loại thắng/thua, cứu bị ngắt, cứu sớm với sáu đồng đội chặn đường, tiếp viện và replay tốc độ, quá giờ, phần thưởng một lần. Chạy trọn chiến dịch 240 hồi và các kết cục.

16 trận đại diện từ tám nhóm 6v6 3.1 giữ đúng kết quả và thời gian; đây không phải phép đo mới 2.400 trận. Chromium kiểm tra sổ/hồ sơ/nguồn, tìm không dấu, trinh sát 320px, cứu qua điều khiển thật, chọn chốt, thắng khi lính còn sống, thua khi xe hỏng và tải lại checkpoint.

Hai hình xe/chốt là SVG hình học viết trong repo; dùng lại chân dung người phu, không thêm hình raster ngoài.
