# Balance 8.0 — sàng lọc 60 đồng hành (5 cặp / nhân vật)

**Nguồn:** [GitHub Actions run #42376204289](https://github.com/gianghamk-hash/wuxia-autobattler/actions/runs/42376204289), job 128414176528; hoàn thành ngày 07/11/2026. Bộ chạy **thành công** và sinh artifact `balance-8-matched-42376204289`.

**Phương pháp:** 60 nhân vật × 5 cặp fixture × 4 lượt chiến đấu (ứng viên/đối chứng, mỗi bên sân) = **1.200 trận chiến mô phỏng**. Scenario `level8`. Dùng engine combat thật, seed cố định và một đồng hành đối chứng cùng nhóm vai trò. Delta là chênh lệch **điểm kết quả trận khi thay một đồng hành** — không phải tỷ lệ thắng độc lập của cá nhân.

**QUAN TRỌNG:** Chỉ có 5 fixture/nhân vật. CI bootstrap cực thô, giá trị 0…0 không có nghĩa sức mạnh hoàn toàn cân bằng. Việc lựa chọn đối chứng cũng có thể khác phẩm chất. Tuyệt đối không buff/nerf tự động từ bảng này. Cần chạy 100–200 fixture cho nhân vật ưu tiên, nhiều cấp, đội hình và đối chứng cùng phẩm chất. Đặc biệt không được thay model, asset, animation, VFX hoặc định nghĩa hiệu ứng hiển thị.

## Nhân vật cần đo lại trước

- `companion_10`: -30 pp; bootstrap CI -70 pp đến 0 pp.
- `companion_01`: -20 pp; bootstrap CI -40 pp đến 0 pp.
- `companion_15`: -20 pp; bootstrap CI -40 pp đến 0 pp.
- `companion_32`: -20 pp; bootstrap CI -50 pp đến +20 pp.
- `companion_35`: -20 pp; bootstrap CI -40 pp đến 0 pp.
- `companion_40`: -20 pp; bootstrap CI -40 pp đến 0 pp.
- `companion_50`: +40 pp; bootstrap CI 0 pp đến +80 pp.
- `companion_06`: +30 pp; bootstrap CI 0 pp đến +70 pp.
- `companion_05`: +30 pp; bootstrap CI 0 pp đến +70 pp.
- `companion_46`: +20 pp; bootstrap CI 0 pp đến +40 pp.
- `companion_11`: +20 pp; bootstrap CI 0 pp đến +60 pp.
- `companion_59`: +10 pp; bootstrap CI 0 pp đến +30 pp.

Các giá trị lớn đều có CI chạm hoặc gần 0, **không có bằng chứng đủ vững để quyết định nerf/buff**.

## Toàn bộ 60 kết quả

| ID | Chênh lệch điểm thắng | CI bootstrap 95% | Xử lý |
| --- | ---: | --- | --- |
| 01 | -20 pp | -40 pp … 0 pp | Theo dõi |
| 02 | 0 pp | -30 pp … +30 pp | Chưa đủ tín hiệu |
| 03 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 04 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 05 | +30 pp | 0 pp … +70 pp | Theo dõi |
| 06 | +30 pp | 0 pp … +70 pp | Theo dõi |
| 07 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 08 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 09 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 10 | -30 pp | -70 pp … 0 pp | Theo dõi |
| 11 | +20 pp | 0 pp … +60 pp | Theo dõi |
| 12 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 13 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 14 | 0 pp | -40 pp … +50 pp | Chưa đủ tín hiệu |
| 15 | -20 pp | -40 pp … 0 pp | Theo dõi |
| 16 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 17 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 18 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 19 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 20 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 21 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 22 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 23 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 24 | 0 pp | -30 pp … +20 pp | Chưa đủ tín hiệu |
| 25 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 26 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 27 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 28 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 29 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 30 | +10 pp | -20 pp … +40 pp | Chưa đủ tín hiệu |
| 31 | +10 pp | -20 pp … +40 pp | Chưa đủ tín hiệu |
| 32 | -20 pp | -50 pp … +20 pp | Theo dõi |
| 33 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 34 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 35 | -20 pp | -40 pp … 0 pp | Theo dõi |
| 36 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 37 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 38 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 39 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 40 | -20 pp | -40 pp … 0 pp | Theo dõi |
| 41 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 42 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 43 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 44 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 45 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 46 | +20 pp | 0 pp … +40 pp | Theo dõi |
| 47 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 48 | +10 pp | -30 pp … +60 pp | Chưa đủ tín hiệu |
| 49 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 50 | +40 pp | 0 pp … +80 pp | Theo dõi |
| 51 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 52 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 53 | +10 pp | -40 pp … +60 pp | Chưa đủ tín hiệu |
| 54 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 55 | +10 pp | -20 pp … +40 pp | Chưa đủ tín hiệu |
| 56 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 57 | 0 pp | 0 pp … 0 pp | Chưa đủ tín hiệu |
| 58 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |
| 59 | +10 pp | 0 pp … +30 pp | Chưa đủ tín hiệu |
| 60 | -10 pp | -30 pp … 0 pp | Chưa đủ tín hiệu |

## Tiêu chí cho đợt xác minh

1. Chạy lại ít nhất 100 fixture cho các nhân vật có độ lệch lớn; 200 fixture trước khi thông qua thay đổi lớn.
2. Chỉ so sánh cùng nhóm vai trò và ưu tiên cùng phẩm chất. Nếu khác phẩm chất, đánh dấu không đủ điều kiện kết luận.
3. So sánh cấp 8 và 20; đánh giá thêm ít nhất một scenario có trang bị.
4. Mỗi fixture giữ nguyên đội hình khác, đối thủ, vị trí và seed, đảo cả hai phía sân.
5. Khi CI không chứa 0, vẫn phải xác minh các matchup bất lợi, người chơi không gacha, nhánh kỹ năng và tương tác hồi phục/khống chế.
6. Các thay đổi cân bằng sau này phải nằm trong PR riêng với Visual Integrity Guard còn hoạt động.
