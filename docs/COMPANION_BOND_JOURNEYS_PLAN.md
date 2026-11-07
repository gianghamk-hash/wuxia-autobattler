# Giang Hồ Nhân Duyên — thiết kế triển khai (DRAFT)

> Phạm vi: 60 đồng hành, bốn mốc 25/50/75/100. Đây là đặc tả triển khai, CHƯA phải tính năng gameplay hoàn thành. Không merge trước khi đối chiếu dữ liệu 60 nhân vật và save schema hiện hữu.

## Mục tiêu
- Giữ nguyên 60 hiệu quả duyên phận tối đa độc quyền đã có, không thay ID hoặc công thức hiệu quả trước khi đo balance.
- Tăng thời gian từ nhận tướng đến 100/100, mục tiêu 30–45 ngày hoạt động hợp lệ cho một tướng chơi thường xuyên; đo thực tế bằng simulation trước khi chốt.
- Mỗi nhân vật có 4 hội thoại/mốc, 1 nhiệm vụ riêng, 1 kết cục và 1 hoạt cảnh tối đa riêng biệt; không được lặp kịch bản.
- Chọn lựa có hậu quả gameplay có lợi/hại, không khóa vĩnh viễn tướng hoặc kết thúc quan trọng.

## Kinh tế điểm duyên phận (đề xuất, cần đo và hiệu chỉnh)
- Chiến thắng trận hợp lệ: 1 điểm cơ sở, tối đa 3 điểm/ngày/nhân vật; chỉ tướng thực sự tham gia và có đóng góp, không thưởng replay trận dễ vô hạn.
- Quà phù hợp: 1–2 điểm cơ sở, tối đa 2 điểm/ngày/nhân vật; quà không phù hợp 0.
- Nhiệm vụ cá nhân: 3–5 điểm một lần; sự kiện truyện: 1–3 điểm một lần, chống nhận lại.
- Hệ số điểm lặp: [0,25): 1; [25,50): .75; [50,75): .5; [75,100): .25. Dùng fixed-point (đơn vị 1/100 điểm) để không mất phần lẻ.
- Giới hạn theo ngày đặt lại 00:00 Asia/Ho_Chi_Minh; dùng ngày lịch Việt Nam, không dùng UTC day.
- Không dùng tiền thật/bạc để mua thẳng điểm 100.
- Mốc 50/75/100 yêu cầu hoàn tất nhiệm vụ/mốc truyện; điểm phát sinh khi bị khóa được giữ ở pending (có giới hạn), không mất, không tự kích hoạt hiệu quả khi chưa đạt điều kiện.
- Các trận cũ, replay, trận bị bỏ dở, chiến đấu tải lại, cùng event ID không được phát thưởng lặp.

## Dữ liệu đề xuất
```js
bondState = {
  companionId: "stable-id",
  points100: 0, // 0..10000, fixed point
  pendingPoints100: 0,
  daily: { vietnamDate: "YYYY-MM-DD", battlePoints100: 0, giftPoints100: 0 },
  seenEventIds: [],
  unlockedMilestones: [],
  completedQuestIds: [],
  storyFlags: {},
  choices: {},
  viewedCutscenes: []
};
```
Không đổi hoặc ghi đè trường affinity/bond cũ trước khi viết migration một lần, idempotent. Nếu save cũ đã 100, giữ 100 và hiệu quả đang có, chỉ bổ sung nội dung ký ức mở khóa tương ứng; không tự phát thưởng trùng.

## Mốc nội dung
- 25 Sơ Giao: tiểu sử I, hội thoại cá nhân.
- 50 Tri Kỷ: tiểu sử II, nhiệm vụ riêng, lựa chọn đối thoại.
- 75 Sinh Tử Chi Giao: bí mật, lựa chọn vận mệnh, chiến thuật mới có đánh đổi.
- 100 Sinh Tử Bất Phụ: hiệu quả độc quyền đã có, danh hiệu, hoạt cảnh có Skip/Replay trong Ký Ức Giang Hồ.

## Nội dung 60 nhân vật
Không tự tạo tên/ID/tiểu sử trái canon. Trích danh sách 60 stable ID từ nguồn dữ liệu runtime trước, lập bảng cho từng nhân vật:
id | tên | phái | thân thế canon | xung đột | thoại 25 | nhiệm vụ 50 | lựa chọn 75 (lợi/hại) | kết 100 | cutscene ID | effect ID.
Chia 6 motif × 10 (hiệp nghĩa, chính tà, ân oán, tình nghĩa, thân thế, thiên mệnh), nhưng không lặp lời thoại hay kết cục. Ưu tiên 15 tướng truyện và các vai có canon rõ trước; sau đó 45 tướng gacha.

## Tích hợp gameplay
- Một bộ xử lý điểm duy nhất, deterministic, xử lý battle-complete, gift, story-choice, quest-complete.
- Tách điều kiện unlock khỏi điểm: không cho bypass nhiệm vụ bằng quà.
- Branch choice phải có chi phí, lợi ích, cờ truyện và hậu quả thật ở trận sau; tránh nhánh trội tuyệt đối.
- Cutscene tối đa ngắn, có Skip, Replay, hỗ trợ reduced motion, không chặn farm.
- UI trình bày tiến trình, hạn mức hôm nay, nhiệm vụ cần hoàn thành, và lý do điểm đang pending.

## Test acceptance
1. 60 stable IDs, 60 effect IDs riêng, 60 quest IDs và 60 cutscene IDs; không trùng.
2. Fixed-point: bốn trận +0.25 = 1 điểm ở mốc 75+, không bị làm tròn mất.
3. Battle replay / reload / duplicate eventId không tăng điểm.
4. Giới hạn trận/quà và reset 00:00 VN qua ranh giới UTC, DST không áp dụng.
5. Gate 50/75/100, pending points, không mở skill sớm.
6. Save 0/25/50/75/100 và save cũ migrate idempotent; không mất tướng, đồ, bạc, XP.
7. 60 hoạt cảnh có Skip/Replay, không phá input và không bị auto-reward khi xem lại.
8. Mô phỏng 1k+ người chơi theo các mức hoạt động, kiểm tra median 30–45 ngày, không tạo softlock.
9. CI Node và Playwright, viewport 320/390/768/1280, kiểm tra hành trình chọn nhánh và trở lại gameplay.

## Triển khai an toàn
1. Audit data/save/battle reward/story engine, xuất bảng 60 nhân vật.
2. Viết engine và migration, test.
3. Tạo nội dung 15 tướng truyện rồi 45 tướng gacha, test tính độc bản.
4. UI + hoạt cảnh + cân bằng, chạy CI và browser.
5. Review PR trước merge/deploy.
