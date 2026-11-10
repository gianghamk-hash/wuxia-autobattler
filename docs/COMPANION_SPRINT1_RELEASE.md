# Sprint 1 — Sáu mươi hành trình giang hồ độc bản

## Phạm vi
- 60 đồng hành × một nhiệm vụ cá nhân có tên, lời dẫn, điều kiện kết quả chiến đấu và ID riêng.
- 60 ngã rẽ × 2 lựa chọn = 120 hướng chiến thuật, mỗi lựa chọn có **một lợi ích và một đánh đổi thực tế**. Chỉ số tác động vào battle-unit tạm thời, không cộng vĩnh viễn trên hồ sơ, không tăng tất cả chỉ số.
- 60 hoạt cảnh 100/100 × 6 khung thoại/ký ức/kết thúc, dùng chân dung nhân vật, nền chương truyện và tên tuyệt kỹ hiện có; có nút bỏ qua, xem lại, và tương thích giảm chuyển động.
- 60 nội tại duyên phận MAX_AFFINITY7 giữ nguyên toàn bộ ID, trigger, action, cooldown và limit.

## Nhiệm vụ cá nhân mốc 50
Mỗi nội dung có một cảnh riêng, một nhiệm vụ và một tiêu chí hoàn thành. Có 10 loại bằng chứng thực chiến (sống sót, toàn đội sống, bảo vệ main, đánh ra tuyệt kỹ, gánh đòn, đóng góp kỹ năng, đúng nhịp trận, kết thúc nhanh, gây sát thương, giữ sức). Điều kiện áp dụng cho **trận thắng thật** khi nhân vật đã chiêu mộ và duyên phận >=50. Không nhận từ trận thua, bỏ trận, retry chưa settle hoặc cùng lần tính kết quả. Các mục tiêu thiết kế dễ đạt trong 1 trận phù hợp để không làm độ khó game tăng ngược sau PR #43.

Mỗi hồ sơ có mục tiêu cá nhân rõ ràng, xem được tiến độ 0/1 và có thể bấm hoàn thành khi đã đủ thành tích. Nội tại 50 tự động kích hoạt từ duyên phận như trước; nhiệm vụ chỉ mở thêm câu chuyện, không chặn thưởng hiện hữu.

## Ngã rẽ mốc 75
- Mỗi nhân vật có hai lựa chọn theo hoàn cảnh truyện, kèm đánh đổi khác nhau: HP với công, phòng với công, tốc độ tích nộ với HP, v.v.
- Tất cả hiệu quả có giới hạn nhỏ và chỉ áp dụng khi đồng hành có trong đội của người chơi, duyên phận >=75. Một khi đã chọn không được đổi trong trận/đội đang khóa. Không áp dụng ngược lên nhân vật AI đối thủ.
- Cơ chế dùng `applyCompanionCrossroad` idempotent trên battle instance; không thay đổi dữ liệu tướng gốc, tuyệt kỹ, ảnh hoặc tiến trình lịch sử.
- Các lựa chọn đã lưu ở `journey.companionJourneys.crossroads` giữ nguyên ID cũ `bond_companion_XX_mercy/truth`, vẫn có hiệu lực sau tải lại.

## Hoạt cảnh 100/100
60 storyboard với kịch bản 6 phần có nội dung riêng (bối cảnh, ký ức, tự bạch, lời đáp, cao trào và dấu ấn tuyệt kỹ). Dùng ảnh/texture hiện hữu. Nút xem lại không cấp thêm điểm, vật phẩm hay nội tại. Nút skip cho phép chuyển đến khung cuối; vẫn xem được toàn bộ lời thoại bằng nút lùi.

## Tương thích bản lưu
- Không thay version/schema, không thay trường affinity hay bảng MAX_AFFINITY7.
- Thêm `journey.companionJourneys.questEvidence` **tùy chọn** để theo dõi bằng chứng mốc 50; save cũ không có vẫn hợp lệ.
- Những nhân vật đã tích lũy 2 trận thắng theo quy tắc cũ được công nhận hoàn thành nhiệm vụ mà không phải chơi lại, kể cả khi nâng cấp save sang cách tính mới.
- Quyết định 75 và watched 100 đều lưu id cũ và tiếp tục hợp lệ.
- Các trận chiến sau update không cho phép hoàn thành một nhiệm vụ chỉ nhờ đếm số trận; phải đáp ứng tiêu chí của nhân vật.

## Quality gates
`npm test`, `npm run test:browser`, kiểm tra portrait/background, 60 ID, 120 lựa chọn, 60 cutscene, không tác động MAX_AFFINITY7, save cũ, modal/viewport mobile, kiểm tra idempotence của battle.
