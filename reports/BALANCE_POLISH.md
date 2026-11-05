# Đo lại 6v6 sau nâng cấp 3.1

Cùng seed **20261105**, tám kịch bản × 150 cặp đổi bên = **2.400 trận**, một main + năm đồng hành mỗi phe, giữ đúng đội/build/đội hình/đồ/chuẩn bị của bản đo trước. Mục tiêu là giảm hòa kéo dài, không xếp hạng nhân quả môn phái.

| Kịch bản | Hòa cũ / 300 | Hòa mới / 300 | Giây trung bình cũ → mới |
| --- | ---: | ---: | ---: |
| Cấp 1 | 13 | 7 | 57,23 → 54,57 |
| Cấp 8 | 13 | 5 | 58,85 → 57,20 |
| Cấp 20 | 18 | 9 | 64,80 → 63,29 |
| Cấp 8 + đồ | 14 | 3 | 57,27 → 54,21 |
| Cấp 20 + chuẩn bị | 29 | 19 | 67,16 → 64,86 |
| Cấp 20, hai người cùng phái main | 16 | 6 | 67,29 → 63,30 |
| Cấp 20, bốn người cùng phái main | 44 | 20 | 69,43 → 66,80 |
| Cấp 20, sáu người cùng phái main | 60 | 48 | 68,42 → 65,25 |
| Tổng | **207 (8,625%)** | **117 (4,875%)** | **63,81 → 61,19** |

Giảm 90 trận hòa, **43,5% tương đối**, tương đương 3,75 điểm phần trăm trong bộ mẫu này. Phe nhà thắng 1.120, phe địch thắng 1.163, hòa 117; tỷ lệ thắng phe nhà trong các trận phân thắng bại 49,1%. Không kết luận chắc chắn không có lợi thế bên sân.

## Chẩn đoán trước khi sửa

Trong 207 trận hòa cũ, 206 hết giờ và một cùng bị hạ. Replay cả **206** trận hết giờ với luật cũ tái lập đúng 206 kết quả. Có 1.333 người còn sống; 420 trong số đó từng bị chặn đường trên 10 giây. Trong 60 trận, hồi máu 30 giây cuối lớn hơn một nửa sát thương HP cùng kỳ. Tổng 30 giây cuối: 1.324.479 sát thương HP, 451.033 hồi HP, 189.418 khiên đỡ. Đây là dấu hiệu nhiều cơ chế cùng góp phần, không đủ quy tất cả hòa cho healer hay đường đi. [Dữ liệu chẩn đoán](draw-diagnosis.json).

## Luật đã thay

- Khi không tìm được địch tới được, một đồng đội cạnh bên có thể nhường đúng một ô hợp lệ để mở đường hoặc mở ô đi tiếp. Không xuyên địch, cắt góc bị chặn, đè ô, đẩy người đang niệm chiêu/choáng/giữ chân/đặt Ấn. Mỗi phe cách tối thiểu 1,5 giây giữa hai lần nhường.
- Giây 85 báo trước Quyết đấu; từ giây 90 đến 120, sát thương tăng tuyến tính từ ×1 lên ×2,5, hồi phục giảm ×1 xuống ×0,4 cho **cả hai phe**. Phản sát thương lấy từ sát thương đã tăng không được tăng hai lần. Không xử thắng theo phần trăm máu, không xóa hòa giả tạo, không sửa chỉ số nền từng phái. Hết 120 giây vẫn hòa nếu cả hai còn người.
- Số liệu mới ghi nhận sát thương HP nhận vào, khiên đỡ, hồi phục yêu cầu/thực nhận, lần kiểm tra trúng/hụt, thời gian không tìm được đường và thời điểm bị hạ. Boss và truyện đồng hành không xuất hiện trong bộ mẫu này.

## Giới hạn và tái lập

Nhóm sáu người cùng phái còn **16% hòa**. Chưa chứng minh cân bằng mọi đội tối ưu, mọi khí công/đồ/biến thể mới, điều khiển tay hoặc boss truyện. Các lượt đổi bên và thành viên cùng đội tương quan; không coi là 2.400 thí nghiệm độc lập, không suy diễn bảng mạnh/yếu từ tỷ lệ hiện diện. Thay đổi nhường đường cũng thay một số kết quả trước giây 90.

`node scripts/diagnose-draws.mjs` tái lập chẩn đoán cũ với `overtime:false,yielding:false`.

`node scripts/balance-6v6.mjs 150 reports/balance-polish-final.json` tái lập bộ mới bằng luật mặc định. [Bộ cũ](balance-6v6.json), [bộ mới với seed và đội](balance-polish-final.json). Mỗi dòng cặp chứa kết quả hai lượt; tệp JSON ghi đầy đủ định nghĩa kịch bản. Bộ test riêng kiểm tra tính xác định khi đổi tốc độ và các luồng chiến dịch/bí cảnh.
