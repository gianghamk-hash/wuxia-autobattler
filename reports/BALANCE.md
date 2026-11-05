# Cân bằng 2.0 — trước/sau cùng 1.000 trận

Hai báo cáo dùng cùng seed `20261105`, 3v3, cấp 8, không trang bị/món ăn: 20 đồng đội + 5 phái × 3 build hợp lệ (công, thủ, hỗn hợp). Tổng cộng 35 cấu hình. Vị trí được cố định theo thứ tự bốc đội, chưa tối ưu theo vai trò; số liệu thắng khi hiện diện trong đội, không phải sức mạnh nhân quả riêng của tướng. Chưa bao phủ hết các build hoặc meta 6v6.

- Trước: 78/1000 hòa; trung bình 52.07 giây mô phỏng.
- Sau: 74/1000 hòa; trung bình 58.09 giây mô phỏng.
- Đường Môn thiên công: 82,0% → 67,4%. Đây là cải thiện trong bộ thử này, chưa phải chứng minh mọi đội hình đã cân bằng.
- Một số hỗ trợ/build thủ vẫn dưới 30%; cần thêm phân tích đội hình theo vai trò và dữ liệu người chơi. Không tăng chỉ số chỉ để ép mọi tướng về 50%.

## Chạy lại

```sh
npm ci
npm run balance
```

Báo cáo gốc `balance-baseline.json` được ghi trước khi thay engine 1.1; `balance-current.json` là bản mới. Mỗi file chứa số trận, thắng/hòa, sát thương, hồi máu và khoảng tin cậy Wilson 95% cho từng cấu hình. Khoảng tin cậy chỉ mô tả lấy mẫu; không loại bỏ thiên lệch từ cách xếp đội.

## Kết quả từng tướng/build

| Cấu hình | Số trận sau | Thắng trước | Thắng sau | Khoảng 95% sau | Hòa sau |
| --- | ---: | ---: | ---: | ---: | ---: |
| Lão Tam Ăn Mày | 167 | 44.9% | 59.3% | 51.7–66.4% | 1.2% |
| Huyền Đạo Trưởng | 158 | 35.4% | 32.3% | 25.5–39.9% | 15.2% |
| Tiểu Muội Nga Mi | 163 | 36.8% | 36.2% | 29.2–43.8% | 9.8% |
| Đường Thập Nhị | 158 | 61.4% | 58.2% | 50.4–65.6% | 1.9% |
| Đại Lực Kim Cang | 162 | 32.7% | 37.0% | 30.0–44.7% | 9.3% |
| Lý Độc Thủ | 147 | 27.9% | 38.1% | 30.6–46.2% | 5.4% |
| Thôi Mệnh Thư Sinh | 173 | 38.7% | 41.0% | 34.0–48.5% | 5.8% |
| Hồng Nương Tử | 162 | 49.4% | 61.1% | 53.4–68.3% | 3.1% |
| Tịnh Không Sư Thái | 183 | 35.5% | 29.0% | 22.9–35.9% | 12.6% |
| Bách Bộ Thần Thương | 153 | 43.1% | 42.5% | 34.9–50.4% | 6.5% |
| Mộng Cô Bán Trà | 174 | 25.9% | 28.7% | 22.5–35.9% | 14.4% |
| Bất Khắc Kiếm Khách | 162 | 54.3% | 63.0% | 55.3–70.0% | 3.7% |
| Quy Tức Lão Nhân | 174 | 36.2% | 43.1% | 36.0–50.5% | 12.6% |
| Thiềm Thừ Bà Bà | 197 | 70.6% | 66.5% | 59.6–72.7% | 1.5% |
| Phi Thiên Đạo Tặc | 184 | 39.1% | 38.6% | 31.9–45.8% | 6.5% |
| Hoa Khôi Lầu Xanh | 190 | 36.3% | 31.1% | 24.9–38.0% | 7.4% |
| Luyện Đan Đồng Tử | 171 | 32.2% | 28.1% | 21.9–35.2% | 12.3% |
| Thiết Đầu Công | 185 | 38.4% | 40.0% | 33.2–47.2% | 13.0% |
| Vô Danh Kiếm Nô | 165 | 39.4% | 41.2% | 34.0–48.8% | 5.5% |
| Tửu Tiên Bất Tỉnh | 189 | 52.9% | 41.3% | 34.5–48.4% | 6.3% |
| ThieuLam / attack | 196 | 53.6% | 68.9% | 62.1–74.9% | 2.5% |
| ThieuLam / defense | 180 | 30.6% | 33.9% | 27.4–41.1% | 12.8% |
| ThieuLam / mixed | 175 | 35.4% | 42.9% | 35.8–50.3% | 10.9% |
| VoDang / attack | 148 | 58.1% | 70.3% | 62.5–77.0% | 2.7% |
| VoDang / defense | 163 | 32.5% | 33.1% | 26.4–40.7% | 8.6% |
| VoDang / mixed | 175 | 34.3% | 34.3% | 27.7–41.6% | 16.0% |
| CaiBang / attack | 170 | 77.1% | 62.4% | 54.9–69.3% | 1.2% |
| CaiBang / defense | 177 | 44.6% | 53.1% | 45.8–60.3% | 4.0% |
| CaiBang / mixed | 171 | 67.2% | 69.6% | 62.3–76.0% | 2.9% |
| NgaMi / attack | 158 | 50.0% | 48.1% | 40.4–55.8% | 9.5% |
| NgaMi / defense | 172 | 28.5% | 27.9% | 21.7–35.0% | 12.8% |
| NgaMi / mixed | 174 | 45.4% | 43.7% | 36.5–51.1% | 14.4% |
| DuongMon / attack | 178 | 82.0% | 67.4% | 60.2–73.9% | 1.1% |
| DuongMon / defense | 192 | 63.0% | 51.0% | 44.0–58.0% | 2.6% |
| DuongMon / mixed | 154 | 77.3% | 59.1% | 51.2–66.5% | 2.6% |

## Thay đổi dựa vào số liệu

- Hạ hệ số nhánh công bậc cao của Cái Bang/Đường Môn; giảm độc tích tầng và nổ độc; giữ cộng hưởng sát thương theo phép nhân thay vì ghi đè hệ số cân bằng.
- Tăng HP nhóm hỗ trợ; Lý Độc Thủ gây nội thương; Mộng Cô có giải trạng thái/hồi máu/nội lực toàn đội, thay cho chỉ giải choáng trong một tình huống hẹp.
- Né tối đa 40%, chí mạng 60%, hệ số chí mạng 2,2. Hồi mỗi mục tiêu tối đa 8% HP/giây và 120% HP/trận. Trận vẫn chốt ở 120 giây mô phỏng.
- Luyện võ: bạc tăng theo cấp, sau 3 lần thắng/ngày giảm 80% bạc và 65% XP; không còn cố định 20 bạc. Có chi phí nhập đội, tu luyện, rèn, luyện đan, phí bí cảnh và cọc tiêu cục.
- Chính truyện có nhịp 3/4/5/6 địch theo hồi và các boss. Số địch chính truyện không tăng ngay chỉ vì người chơi vừa chiêu mộ thêm tướng.
