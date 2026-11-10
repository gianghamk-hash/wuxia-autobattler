# Cân bằng dễ hơn — Toàn bộ chế độ (10/11/2026)

## Mục tiêu
Giảm độ khó đồng đều trong các chế độ người chơi, giữ nguyên cấp độ, đội hình, kỹ năng, hình ảnh, vật phẩm và save. Không thay đổi kết quả/độ khó của mô phỏng 6v6 độc lập.

## Hệ số mới

Tất cả số dưới đây là hệ số **địch**, áp lên chỉ số tại *battle instance*, không áp lên người chơi. Trước đó, từ chương 3, hệ số chiến dịch là ×2 trên mọi thuộc tính; quân thường lại bị nhân HP ×1.6 và công ×1.25. 

- Quân địch tạo từ mẫu: HP ×1.25, công ×1.10 (trước là ×1.6 và ×1.25).
- Đường cong cốt truyện: chương 1–2 ×0.78; 3–6 ×0.88; 7–10 ×0.96; 11–14 ×1.04; 15–17 ×1.10; 18–20 ×1.16. Không còn bước nhảy lên ×2 sau chương 2.
- Luyện tập: ×0.72, Đại hội: ×0.72, Vận tiêu: ×0.70.
- Bí cảnh: ×0.80 so với hệ số chương tương ứng; boss chương chơi lại: ×0.85 so với hệ số chương riêng của boss.
- 100 tầng Bí cảnh có giảm sức mạnh riêng: tầng 1–10 ×0.55; 11–20 ×0.65; 21–30 ×0.75; 31–60 ×0.85; 61–100 ×0.90, cộng dồn với các hệ số của chế độ và quy tắc hiện tại.
- Hồi phục giữa hai tầng tháp: **35% HP tối đa** thay vì 25%.
- Mini-boss có HP ×1.10 (trước ×1.25), công ×1.03 (trước ×1.08). Boss cuối pha 3: HP ×1.45 (trước ×2), công ×1.10 (trước ×1.20).
- Giữ ba pha boss, hiệu ứng, hình ảnh, các mốc nhiệm vụ và số lượng địch cơ bản. Riêng các trận boss có 4–8 quân, tổng ngân sách HP/công chuẩn hóa về tối đa tương đương **4 quân**, tránh tăng sức mạnh đột ngột do số lượng địch cao.

## Giữ an toàn
- Chỉ nhân HP, công và phòng thủ địch; **không** tác động maxEnergy, nộ, tốc đánh, tốc độ di chuyển, chí mạng hay tầm đánh. Tránh lỗi thiếu nộ không thể thi triển tuyệt kỹ khi hệ số dưới 1.
- Phía người chơi và các mục tiêu nhiệm vụ không bị suy giảm.
- Giữ đồng nhất thăm dò/bắt đầu trận/lưu và tải lại, tránh chồng hệ số qua retries.
- Kịch bản chiến đấu, hoạt cảnh, hình ảnh kỹ năng, cơ chế gacha, XP và thưởng nhiệm vụ không thay đổi.

## Kiểm thử phát hành
Chạy `npm test` và `npm run test:browser` trên GitHub Actions. Bộ test xác minh 20 chương, sáu chế độ, tái lập trận boss, các chỉ số chỉ bị scale đúng nhóm, sức mạnh ổn định qua retry, và tính hợp lệ của save.
