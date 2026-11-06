import { EXPANSION_CAST } from "./ExpansionCast.js";
/** Additional scenes are local obstacles or consensual drills, never new wars in the epilogue. */
const plans = [
  `2:Đám gây rối kéo thang khỏi mái bạt, Kha giữ chân thang cho Phong thoát.|4:Nhóm ép quỳ lại khép vòng; Phong phải mở lối mà không châm lửa vào người.|5:Bốn kẻ chen vào chỗ lấy nước, Phong cùng Kha giữ lối để Na đưa người đau ra.|8:Quán chủ nhờ giữ cửa trong lúc đám gây rối đòi lấy cơm ghi nợ.|12:Kha cho nhóm xét tuyển thử giữ hàng trước khi nhận các tấm thiệp.|13:Người khuân thóc bị xô khỏi bàn cân; giữ họ đủ lâu để Vũ Bình đo lại.|15:Kẻ kích động định đánh người giữ kho; Phong ngăn trước khi đính chính.|18:Nhóm chặn lối giật tờ bảo chứng; giữ hồ sơ để tới sân xét.`,
  `6:Liên Sư cho bốn đệ tử tập ép đường; mở lối đưa người đóng vai thương binh ra.|7:Thử một lượt công thủ trước khi hỏi giới hạn của từng viện.|8:Đội trực kho yêu cầu thử bảo vệ người mang sổ dưới sức ép.|9:Bài tập giữ đồ dùng chung, không ai được mượn danh khách quý để bỏ lượt.|12:Lễ nhập môn kết thúc bằng bài thực hành giữ hàng cùng các bạn mới.|14:Kha sắp một lượt đối luyện ngắn sau khi Phong đã trả buổi công.|16:Bạn học thử đổi vị trí để Phong biết ai đang cần che sườn.|19:Bài kiểm nhịp mệt cuối buổi, dừng đúng tín hiệu rồi mới nhận lịch.`,
  `3:Thầy dùng nhóm bốn người kiểm cách đặt trọng tâm trong chuyển động.|4:Mộc An quan sát lượt đối luyện; Phong phải giữ nhịp người yếu hơn.|8:Tập tiếp nước dưới lượt ép nhẹ, không để người nhận rời vị trí an toàn.|9:Toán gây rối chặn xe lương hỏng trục; giữ xe tới khi thợ tới.|10:Tạ Yến chống trục, Phong chặn nhóm giật dây buộc hàng.|11:Phu chuyển lương bị chặn lối; giải tán toán ép người trước bữa cơm.|16:Đội canh kho bị thúc ép giao sổ; giữ người chép để đối chiếu đủ ba bản.|19:Thầy kiểm thực lực cả tổ trước khi ký điều kiện xuống núi.`,
  `2:Đọc xong đề, tổ bạn vào sân để kiểm Phong hiểu đúng mục tiêu.|5:Một lượt ép sườn buộc Phong giữ bình tĩnh giữa tiếng cười ngoài rào.|7:Nhóm khảo hạch giữ mảnh gỗ làm mục tiêu, mở lối lấy ra không đánh người ngoài.|8:Thầy giao lượt tập tự xử trí, chỉ đứng ngoài làm chứng.|10:Tổ giám khảo thử giữ khoảng cách; giấy bảo chứng không thay được bài thi.|12:Lụa hướng dẫn giữ đội qua bến giả lập trước khi nhận chuyến đường thật.|16:Bài bổ sung kiểm xem Phong có thể đổi người giữ tuyến khi mệt.|18:Đội đưa tiễn nhận lượt đối luyện cuối rồi mới bàn giao người ở lại.`,
  `2:Kẻ lấy túi có người chắn ở ngõ; mở lối đuổi mà không đánh người mua hàng.|3:Toán chặn đường không chịu tránh, Phong phải giữ khoảng trống hỏi tên.|5:Đội giữ kho khép cổng phụ, Mai chỉ đường để hai người không bị dồn góc.|7:Nhóm đòi nợ ép người khuân hàng; giữ họ trước khi hỏi món nợ của Mai.|9:Đèn vừa tắt, đội canh chặn đường rút; giữ lối nhìn rõ người ra vào.|11:Kẻ lạ cố kéo nhân chứng khỏi chỗ hỏi; Phong chặn trước khi so lời khai.|14:Toán giữ phòng án không cho lấy vải đối chiếu; mở lối dưới sự làm chứng của Vệ Bình.|16:Người bán dầu bị bám theo từ cửa kho, đẩy nhóm ấy khỏi đường tới quầy.`,
  `2:Đội bám đuôi định cướp đèn làm chứng; Phong giữ vật trước khi mang tới người khám.|3:Người chuyển giấy bị chặn giữa ngõ, giữ mực và giấy nguyên trạng.|5:Gia đình Lục Thư bị toán lạ cản đường tới nơi hỏi; bảo vệ họ mà không ép lời khai.|7:Đội đe người thợ may xuất hiện; giữ cửa hiệu để họ được nói điều đã thấy.|8:Phu đèn bị đẩy khỏi sân, Phong mở lối để từng người ra đối chiếu.|9:Kẻ mua im lặng có người chặn lối; giữ họ tới khi người ghi sổ tới.|11:Toán giữ sổ chi định chuyển hòm, chặn xe trước khi hai tên được đối chiếu.|14:Người thoát cháy còn bị bám, đẩy toán truy đi rồi mới ghi phần nhớ được.`,
  `2:Người mang bản giấy thứ hai bị cản ở đầu bến, giữ đường cho bản sao tới.|4:Đám dò tên Mai khép lối, Phong giữ khoảng cách để cuộc hỏi không thành bắt người.|6:Lôi gọi cả tổ thử giữ cầu, tách bài tập khỏi cuộc cãi giấy bắt.|7:Toán lạ định giật sổ của người đã mất; giữ sổ cho Lôi đọc đủ.|9:Người báo lửa bị chặn trên cầu gỗ; mở đường để tin tới bến.|11:Lôi quay lại bến, nhóm Phong chặn toán cắt dây neo còn sót.|13:Người giữ dấu có hộ vệ ép phải rời bến; giữ người tới lúc quan ghi nhận.|16:Toán rình đường dân trở về, Phong giữ chốt sau khi cầu đã mở.`,
  `2:Tập giữ túi tiền chung trong lượt ép, ghi người nhận thay vì ai nhanh tay hơn.|3:Đội bạn mời thử trận phối hợp trước khi đặt tên nhóm.|6:Diễn tập bảo vệ người làm chứng, để họ xem lối rút có dùng được thật.|7:Thử lại bài đếm người và đổi hàng sau sai số vừa phát hiện.|8:Nhóm canh giữ chặn cửa nhà, mở lối cho người bị giữ bước ra.|9:Đổi người dẫn trong một trận tập ngắn để bất đồng được thử bằng cách làm.|10:Toán giữ khóa ép nhân chứng, Phong giữ họ trong lúc Mai mở lối.|16:Dương Tịnh chủ trì bài phối hợp, người nhận lời thề vẫn được gọi dừng.`,
  `2:Đội bốc hàng khép lối thóc, giữ cửa cho người kiểm đếm tới.|5:Người giữ sổ bị toán đe dọa kéo đi, mở lối để họ ký đúng tên.|7:Tập giữ nhân chứng ngay cả khi lời khai bất lợi cho người quen.|8:Toán áp tải của tuyến nhà Mai cản đường, giữ nguyên hàng để đối chiếu.|10:Kẻ chuyển thùng định xóa dấu, Phong giữ cả hai giấy trước khi đếm.|11:Đào Bất Khuất dẫn đường qua đội chặn lệnh chuyển hàng.|13:Toán thương lượng mang hộ vệ khép cửa; giữ chứng từ trước khi bàn điều kiện.|16:Kẻ dò đường tới chỗ Na bị đẩy đi trước khi cha con được nói chuyện riêng.`,
  `2:Tổ thuyền tập giữ mạn trước cả hai phương án thời tiết.|3:Toán lạ ép người lên thuyền quá tải, giữ cầu bến để chia chuyến.|5:Tập giữ thuyền thử trước khi thả đồ, không đưa người vào kế hoạch chưa kiểm.|6:Thuyền thử trôi lệch vào chỗ chặn, nhóm mở đường thu nó lại.|8:Người chuyển tin bị bám trên bến, giữ điểm nhận để gửi thêm một tuyến.|10:Sương đến muộn, toán chặn áp sát; dùng phương án đã đổi để giữ thuyền.|13:Toán giữ lệnh muốn tịch thu bản còn lại, giữ cả hai nguồn để kiểm.|18:Trác Viễn đánh dấu lối rút dưới một lượt ép, bản đồ phải chịu được đường thật.`,
  `2:Toán chặn trạm ép người giữ rời vị trí, Phong mở lối vào nhận tin.|3:Đội chuyển hàng muốn khóa kho trống, giữ người ký nhận để hỏi công khai.|5:Giữ sân cho Thợ Bảy kiểm dụng cụ, đẩy toán giật vật liệu khỏi vùng làm việc.|6:Đội bạn sắp bài giữ cửa thật, không có lối bí mật để bỏ qua.|7:Kiểm dây bằng lượt đối luyện có tải nhẹ trước khi đưa người lên.|11:Tổ khảo sát bị chặn ở mốc cột, giữ nơi đo tới lúc chép xong.|13:Thợ trên tường bị toán đuổi xuống, giữ chân tường cho họ rời an toàn.|18:Bách Bộ dẫn bài phối hợp giữ trạm, người đưa bản tin có lối ra.`,
  `2:Đội giám sát mở trận thử ngoài sàn, người mang hồ sơ phải có đường qua.|5:Kha chấm một lượt ép thật, người quen không được chọn đối thủ nhẹ.|6:Giữ bàn hồ sơ khỏi toán chen lấn trước khi vào vòng cờ kế.|7:Người làm chứng nhà Mai bị cản ngoài sân, mở lối tới bàn chung.|8:Tổ hội võ thử giữ lương dưới sức ép, đặt lời Nghiêm trước một tình thế cụ thể.|11:Đỗ Mậu cho người kiểm đội bảo vệ sổ, công khai cả giới hạn giữ kho.|13:Toán bám hồ sơ Lục Thư định giật trang cuối; giữ nó tới bàn nhận.|16:Tập trận nhận cờ theo điều kiện ủy thác, Phong phải giữ cả đường dân.`,
  `2:Đoàn chạy nạn bị đội tiền trạm ép lại, Phong mở lối đưa họ vào.|3:Trinh sát Cao Lệ dò đường lương, giữ điểm hỏi tin trước khi lộ trạm.|5:Toán chặn biên cắt đường người mang bản đồ, giữ người tới bàn đối chiếu.|7:Tổ của Sơn Quân bị ép trên đường thư, giữ lượt người gửi trả về.|8:Đội áp tải thuốc bị truy, Phong che lối để Liên Sư chia thuốc.|10:Người mới theo Bạch Sơn cần vượt lượt chặn, giữ hàng thay vì đuổi riêng.|12:Người mang thư Đạo Tĩnh bị theo dấu, đẩy toán dò đi trước khi đọc.|16:Đội trinh sát phải giữ mốc quan sát, con số chỉ được sửa khi người đo về đủ.`,
  `2:Đội truy dồn tới cửa hẹp, Phong giữ lượt cáng cuối theo lệnh rút.|3:Toán cắt đường thuốc áp sát, mở lối cho người còn cứu được ra trước.|5:Người thay cờ bị ép sườn, giữ đúng hướng rút cho cả hàng.|7:Người đưa chìa bị đội chặn đuổi kịp, Phong giữ lối để họ xuống trại.|9:Toán truy bám người xác nhận tin, đẩy chúng khỏi khu nhận thương binh.|11:Một nhóm địch vòng theo sơ đồ trống, giữ trạm để người tìm tin trở lại.|14:Lượt đổi ca cần kiểm qua trận tập, Mai được chọn phần mình còn đủ sức nhận.|19:Đội bạn diễn tập giữ trại, chia đúng phần trước khi đón ngày mới.`,
  `2:Thử trận với các tổ mới phân công, Phong không thể tự giữ mọi cửa.|3:Mai sắp đội thử bảo vệ thợ, giao người có nghề quyền gọi dừng.|5:Giữ bãi thử máy trước toán cướp vật liệu, chưa dùng dụng cụ chưa kiểm.|7:Toán cướp lương dò kho giống, Phong giữ ranh để Bà Tư chia phần ăn.|8:Tổ hát và vận tải tập rút theo tín hiệu, người làm hậu cần cũng có lối ra.|10:Toán dò trại theo bản đồ kho tới gần, giữ người mang tin trước khi hỏi Nghiêm.|12:Đường Mai mang thư bị chặn, mở lối mà không thay cô nói lời trong thư.|18:Diễn tập với dụng cụ đã kiểm, người thợ được dừng lượt trước lúc quá tải.`,
  `2:Tập giữ chốt theo tầm kèn thật, điểm không nghe được có người chuyển tin.|3:Đội thay ca chịu một lượt ép ngắn để kiểm khoảng nghỉ đã đủ chưa.|5:Toán canh mới bám đường về, cắt dấu theo trước khi rút khỏi lượt thử đầu.|7:Giữ người mang bản vẽ khỏi đội dò, không kéo địch về lối làng.|8:Tổ bạn thử phương án Mai vừa sửa trước khi ra ca thật.|10:Toán giữ tù binh truy tới điểm hỏi, giữ người để kiểm từng phần lời khai.|15:Chủ kho bị địch ép giữ cửa, mở lối để hỏi đúng phần lương có chủ.|18:Ba tổ trinh sát giữ các điểm đo, khoảng mở phải có người về xác nhận.`,
  `2:Tổ giả địch thử đánh vào trạm tin, Phong phải giữ vị trí thay vì ra tuyến đầu.|3:Người báo dấu khác bị toán bám, giữ điểm tiếp nhận để kiểm lệnh.|5:Toán cắt đường xe tới lúc Lôi gọi dừng, Phong che cho đoàn đổi tuyến.|7:Đội chặn bến ép Mai nhận chuyến mạo hiểm, giữ người thay vì cố cứu hàng.|8:Giữ đường dân trước toán vòng sườn, không biến lối ấy thành đường mồi.|10:Người đưa tin muộn cần được đưa qua chốt, giữ bản tin nguyên thời điểm.|13:Toán dò tù binh tìm tới trạm, giữ người để lời khai không bị thủ tiêu.|16:Đội giữ kho cũ không chịu mở, Phong giữ cửa tới khi người có phần nhận tới.`,
  `2:Trinh sát phải giữ mốc đo trước đợt đuổi, khoảng bắn được kiểm bằng bước thật.|5:Toán sót ép vào chỗ đếm người, giữ chốt tới khi biết ai còn thiếu.|6:Tổ bạn thử ép sườn người cầm cung, Phong phải biết bỏ lượt bắn chưa đủ tầm.|7:Đội tiếp lương Cao Lệ chống giữ, mở lối mà chừa đường dân ra riêng.|8:Toán truy ép người đầu hàng, giữ khu nhận ngoài tầm giao chiến.|10:Sau mũi tên hụt, đội bên sườn phải chịu lượt ép để đổi vị trí.|11:Hộ vệ tinh nhuệ đổi hướng, Phong giữ điểm nối trong lúc chờ tin Mai.|18:Đội chặn đường rút phải chịu đợt phản kích cuối trước khi khép bộ chỉ huy.`,
  `2:Khảo trận hồi ức Chi Lăng để kiểm việc bàn giao; không phải Cao Lệ được thả đánh lại.|3:Tổ gác tập giữ sổ kho đã niêm, không coi đổi tên là hết trách nhiệm.|5:Buổi tập cuối với Thần Cung dùng bia và bạn đóng vai, không thêm người chết sau chiến tranh.|7:Lôi mời tổ bạn luyện giữ lối, lời thề không buộc ai tham gia nếu chưa muốn.|9:Diễn tập bàn giao ba tuyến để người nhận tự xử trí khi Phong vắng.|11:Phong thử trận cùng tổ mới trước khi hỏi lựa chọn đời riêng.|14:Tổ hộ đường tập giữ đoàn qua dốc trước chuyến lên núi.|17:Khảo trận bàn giao cuối, ba lượt đối luyện có giám sát trước khi nhóm tới mốc cổng.`,
  `2:Diễn tập bảo vệ ruộng và kho giống, không tạo một cuộc xâm lược mới.|4:Lôi kiểm tổ hộ đường trước chuyến về nhà người em.|6:Đội trực trại tập bảo vệ nơi trả công, người nhận việc phải tự giữ được hàng.|8:Khảo trận mở kho đúng người nhận, quyền giữ chìa không đặt hết vào một người.|10:Tập giữ nơi nhận quà và công khai sổ, không lấy đồ quý thay điều kiện đã hẹn.|12:Buổi kiểm phối hợp dùng tín hiệu dễ hiểu cho cả người mới.|16:Trận giao hữu năm mới có người giám sát, thắng thua không đổi phần xét án.|18:Khảo trận ba đợt trước bàn giao quyền; đây là diễn tập, không biến thời bình thành chiến tranh.`,
];
const byId = Object.fromEntries(
  plans.flatMap((text, c) =>
    text.split("|").map((row) => {
      const [e, setup] = row.split(":");
      return [
        `D${String(c + 1).padStart(2, "0")}H${e.padStart(2, "0")}`,
        setup,
      ];
    }),
  ),
);
export function combatFocused(q) {
  const extra = byId[q.id];
  if (extra && !q.encounter) {
    q = {
      ...q,
      kind: "battle",
      encounter: `dai_viet_${q.chapter}_${q.episode}`,
      enemyId: "tay_sai",
      combatType: q.chapter <= 4 || q.chapter >= 19 ? "drill" : "ambush",
      guide: q.chapter <= 4 ? "kha_van" : null,
      aftermath: q.lines,
      lines: [
        ["Người kể", extra],
        [
          "Trần Phong",
          q.chapter >= 19
            ? "Giữ đúng mục tiêu bài tập. Có người gọi dừng thì dừng."
            : "Giữ đội hình, mở lối trước rồi mới truy tiếp.",
        ],
      ],
      choices: [
        {
          id: "continue",
          text: q.chapter >= 19 ? "Bắt đầu khảo trận" : "Vào trận",
          karma: 0,
        },
      ],
    };
  }
  q.boss = Boolean(
    q.encounter &&
      q.episode ===
        [
          19, 19, 19, 19, 17, 18, 19, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19,
          19, 17, 18,
        ][q.chapter - 1],
  );
  q.fullLines = q.lines;
  q.fullAftermath = q.aftermath;
  const compact = (lines) => {
    if (!lines) return lines;
    const narrator = lines.find((l) => l[0] === "Người kể"),
      quote =
        lines.find((l) =>
          EXPANSION_CAST.some((p) => p.meet === q.id && p.name === l[0]),
        ) ??
        lines.find((l) => l[0] !== "Người kể" && l[0] !== "Trần Phong") ??
        lines.find((l) => l[0] === "Trần Phong");
    return [narrator, quote].filter(Boolean);
  };
  // Choices and all original authored lines remain available in the optional full reader.
  q.lines = compact(q.lines);
  q.aftermath = compact(q.aftermath);
  const ending = q.aftermath ?? q.lines;
  const narration = ending.find((l) => l[0] === "Người kể");
  if (narration && q.handoff && !narration[1].includes(q.handoff)) {
    const n = ending.indexOf(narration);
    ending[n] = [narration[0], narration[1] + " " + q.handoff];
  }
  return q;
}
