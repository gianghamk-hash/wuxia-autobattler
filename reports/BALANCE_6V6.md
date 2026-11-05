# Đo 6v6 — bản đo đầu tiên

Seed **20261105**, **2400 trận**; mỗi nhóm 150 cặp đối thủ, mỗi cặp đánh hai lượt đổi bên với cùng seed. Tổng **207 trận hòa (8.6%)**. Không thay chỉ số combat trong đợt này.

## Phương pháp

Mỗi bên đúng một main và năm đồng hành khác nhau trong 50 người. Lấy mẫu môn phái và ba build attack/defense/mixed; phân bổ điểm thuộc tính hợp lệ, học cây kỹ năng theo giới hạn điểm và cấp. Đội hình sáu ô có hoán vị ngẫu nhiên, giữ cách xếp của mỗi đội khi đổi bên. Tuyệt kỹ tự động và mục tiêu gần nhất.

- level1/8/20: không trang bị, không tu luyện/rèn/món ăn; khí công Điều tức.
- level8-equipped: main mang ba món cùng bộ môn phái, đồng hành không có trang bị riêng.
- level20-prepared: như trên, thêm tu luyện/rèn bậc 10, đan và Long mạch cho cả hai đội; dùng chính hàm chuẩn bị trận của Campaign.
- level20-sect2/4/6: cùng mức chuẩn bị; main cùng chính xác 1/3/5 đồng hành đồng phái. Các phái khác trong đội vẫn có thể có cộng hưởng riêng. **Hai bên cùng mức mốc phái**; không phải thử nghiệm lợi ích nhân quả 6 phái so với 4 phái.

## Kết quả

| Nhóm | Trận | Hòa | Trung bình (giây) | P50 / P90 (giây) | Điểm phe nhà [CI 95% theo cặp] |
| --- | ---: | ---: | ---: | ---: | --- |
| level1 | 300 | 4.3% | 57.23 | 49.7 / 99.8 | 51.5% [49.3%, 53.7%] |
| level8 | 300 | 4.3% | 58.85 | 54.0 / 96.5 | 47.2% [44.8%, 49.3%] |
| level20 | 300 | 6.0% | 64.8 | 59.2 / 106.5 | 48.3% [45.7%, 51.2%] |
| level8-equipped | 300 | 4.7% | 57.27 | 52.0 / 95.5 | 49.3% [46.8%, 51.8%] |
| level20-prepared | 300 | 9.7% | 67.16 | 60.6 / 115.8 | 48.5% [45.7%, 51.2%] |
| level20-sect2 | 300 | 5.3% | 67.29 | 62.7 / 104.8 | 48.0% [45.8%, 50.2%] |
| level20-sect4 | 300 | 14.7% | 69.43 | 63.6 / 120.0 | 50.7% [48.5%, 53.0%] |
| level20-sect6 | 300 | 20.0% | 68.42 | 66.8 / 120.0 | 50.7% [49.3%, 52.0%] |

Điểm = thắng 1, hòa 0,5, thua 0. Khoảng tin cậy điểm phe nhà dùng bootstrap 2.000 lần trên **cả cặp đổi bên**, không coi hai lượt trong cặp là độc lập. Seed bootstrap cố định. Đây là khoảng ước lượng theo bộ lấy mẫu này, không chứng minh không có thiên lệch ở mọi đội hình.

## Các tín hiệu cần theo dõi

Nhóm sáu người cùng phái hòa 20.0%; cần xem lại các seed hết 120 giây để phân biệt thiếu sát thương, chống chịu/hồi phục, kẹt đường và matchup. Không tự giảm sức mạnh tướng chỉ từ bảng này.

Các điểm có mặt cao/thấp sau đây chỉ dùng chọn matchup để đo tiếp, **không phải tier list**; đồng đội, đối thủ và lượt đổi bên có tương quan, cỡ mẫu mỗi tướng còn nhỏ:

- **level1:** thấp Tiểu Muội Nga Mi: 21.9% (48 lần có mặt); Cúc Mộc Vá Áo: 26.6% (62 lần có mặt). Cao Minh Khuê Kiếm Sử: 72.7% (64 lần có mặt); Đỗ Quyên Huyền Châm: 72.2% (54 lần có mặt).
- **level8:** thấp NgaMi:mixed: 18.4% (38 lần có mặt); Bảy Cò Giữ Bến: 23.2% (54 lần có mặt). Cao VoDang:attack: 77.3% (44 lần có mặt); ThieuLam:attack: 74.0% (48 lần có mặt).
- **level20:** thấp ThieuLam:defense: 30.9% (42 lần có mặt); VoDang:defense: 32.3% (48 lần có mặt). Cao Đỗ Quyên Huyền Châm: 77.3% (66 lần có mặt); Hải Âu Phi Tiêu: 70.3% (74 lần có mặt).
- **level8-equipped:** thấp VoDang:mixed: 21.1% (38 lần có mặt); NgaMi:defense: 25.0% (44 lần có mặt). Cao VoDang:attack: 76.7% (30 lần có mặt); Bạch Liên Châm Sư: 70.4% (54 lần có mặt).
- **level20-prepared:** thấp ThieuLam:defense: 19.7% (38 lần có mặt); NgaMi:defense: 25.0% (36 lần có mặt). Cao ThieuLam:mixed: 75.0% (26 lần có mặt); VoDang:attack: 70.0% (40 lần có mặt).
- **level20-sect2:** thấp VoDang:defense: 6.7% (30 lần có mặt); Hạc Nâu Tĩnh Tọa: 29.3% (46 lần có mặt). Cao ThieuLam:attack: 85.7% (28 lần có mặt); VoDang:attack: 81.8% (22 lần có mặt).
- **level20-sect4:** thấp NgaMi:defense: 17.6% (34 lần có mặt); ThieuLam:defense: 27.4% (42 lần có mặt). Cao Đỗ Quyên Huyền Châm: 76.5% (66 lần có mặt); VoDang:mixed: 76.2% (42 lần có mặt).
- **level20-sect6:** thấp Bạch Liên Châm Sư: 17.7% (96 lần có mặt); Luyện Đan Đồng Tử: 17.8% (90 lần có mặt). Cao Minh Khuê Kiếm Sử: 90.4% (52 lần có mặt); Lam Nhi Học Kiếm: 88.3% (60 lần có mặt).

## Tái lập và giới hạn

Chạy `npm run balance:6v6 -- 150 reports/balance-6v6.json`, rồi `node scripts/summarize-6v6.mjs`. Chạy nhanh bằng số cặp nhỏ hơn; số trận = số cặp × 2 × 8. Bốn worker chỉ chia việc tính, kết quả không phụ thuộc thứ tự worker hoàn tất. JSON giữ seed, hai đội, vị trí, build, kết quả từng lượt và thống kê tổng hợp.

Chưa bao phủ mọi khí công, mục tiêu ưu tiên, điều khiển tuyệt kỹ thủ công, món ăn, cách phân điểm hoặc đội tối ưu. Không kiểm tra tốc độ cày bạc, chi phí nâng cấp hay khả năng qua chiến dịch bằng mọi phái. Mức điểm có mặt không tách được sức mạnh riêng khỏi đồng đội; chưa dùng nó để chỉnh cân bằng.
