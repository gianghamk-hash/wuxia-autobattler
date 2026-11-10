# Điều chỉnh độ khó vừa phải — 11/11/2026

## Bối cảnh
Sau PR #43, người chơi cảm thấy mọi chế độ hơi dễ. Lần tinh chỉnh này **tăng thử thách có kiểm soát**, không khôi phục hệ số x2 từ chương 3 như trước, không giảm chỉ số đồng hành, không sửa save/reward/gacha hay 60 hiệu ứng duyên phận độc bản.

**Đây là các thông số mục tiêu có thể kiểm thử, chưa phải tỷ lệ thắng thực tế.** Chưa có telemetry người chơi, không thể tuyên bố 50/50 cân bằng.

## Đường cong chiến dịch

| Chương | PR #43 | Đề xuất mới | Thay đổi tương đối |
|---|---:|---:|---:|
| 1–2 | ×0.78 | ×0.78 | 0% |
| 3–6 | ×0.88 | ×0.93 | +5.7% |
| 7–10 | ×0.96 | ×1.02 | +6.3% |
| 11–14 | ×1.04 | ×1.11 | +6.7% |
| 15–17 | ×1.10 | ×1.18 | +7.3% |
| 18–20 | ×1.16 | ×1.25 | +7.8% |

*Là hệ số nhân lên chỉ số HP/công/phòng của quân địch sau khi tạo trận, không trực tiếp phản ánh tỷ lệ chiến thắng.*

## Chế độ phụ
- Luyện tập: **min(0.79, hệ số chương ×0.94)** (cũ cố định ×0.72).
- Đại hội: **min(0.80, hệ số chương ×0.94)** (cũ ×0.72).
- Vận tiêu: **min(0.78, hệ số chương ×0.92)** (cũ ×0.70).
- Bí cảnh: **hệ số chương ×0.85** (cũ ×0.80).
- Đối đầu boss chương: **hệ số chương ×0.89** (cũ ×0.85).
- Tháp 100 tầng, hệ số theo tầng: **0.57 / 0.68 / 0.78 / 0.88 / 0.93** (cũ 0.55 / 0.65 / 0.75 / 0.85 / 0.90).
- Boss cuối pha 3: **HP ×1.50, công ×1.12** (cũ HP ×1.45, công ×1.10), giữ nguyên ba pha và cơ chế giới hạn tổng sức mạnh địch nhiều người.

## Giới hạn tác động
- Chỉ điều chỉnh các hệ số của kẻ địch theo từng trận; không ảnh hưởng nộ, tốc độ di chuyển, tỷ lệ chí mạng hay tầm chiêu.
- Không tăng độ khó bất ngờ ở hai chương mở đầu. Các hoạt động phụ vẫn dễ hơn cốt truyện tương ứng.
- Hồi phục Tháp 100 tầng vẫn **35% HP mỗi tầng thắng**. Không thay đổi phần thưởng và checkpoint.
- Không chỉnh danh sách nhân vật, nội tại 100/100, ngã rẽ 75/100, gacha, hình ảnh, animation hoặc dữ liệu lưu.
- Kiểm thử tất cả Node + Playwright, điều kiện PR phải xanh trước khi merge.

## Sau phát hành
Ưu tiên đánh giá người chơi mới, đội không gacha và đội mạnh ở chương 3/10/20 và tầng tháp 10/50/100. Nếu vẫn quá dễ ở cuối game, chỉ điều chỉnh giai đoạn đó, không kéo tăng đồng loạt mọi chế độ.
