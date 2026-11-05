export default {
  title: 'Người chép dưới bến Liễu',
  place: 'Bến Liễu',
  goal: 'Đưa Vũ Bình ra khỏi bến và xác minh phần trách nhiệm của ông.',
  summary:
    'Người bạn tìm không chỉ là nạn nhân. Vũ Bình từng sửa sổ để cứu con, rồi giữ lại chứng cứ khi biết sự nhượng bộ ấy khiến cả làng mất ruộng.',
  bridge:
    'Vũ Bình giao bản ghi chuyến thóc cuối đi U Minh. Muốn lời khai đứng vững, nhóm phải tìm kho thực, người thực và phần sổ đang nằm trong tay trấn thủ.',
  battles: [3, 7, 11, 15, 19, 20],
  decision: {
    at: 12,
    a: 'Ghi cả lỗi của Vũ Bình vào lời chứng.',
    b: 'Giấu phần sai của ông để lời khai dễ được tin.',
    good: 'Lời chứng có chỗ khó nghe nhưng không có đoạn phải sửa lần thứ hai.',
    bad: 'Bản chép sạch sẽ hơn người chép; một câu hỏi đúng chỗ có thể làm tất cả mất lòng tin.'
  },
  scenes: `
Bến không nhận khách|Đò ở bến Liễu vẫn buộc dây nhưng không chở ai. Một tấm lệnh khám bến có dấu nha thu tô, dù bến thuộc quyền người giữ cửa thành Hoa Lư.|Người lái đò: Hai nơi cùng đóng dấu thì dân chỉ biết đóng cửa. Tiền đò chưa thu, tiền sợ đã đủ.|Tìm người ra lệnh thay vì vội dùng giấy thông hành.
Mùi thuốc trong mái lá|Tiểu Muội nhận ra mùi thuốc giảm sốt từ căn lều bỏ hoang. Vũ Bình bị thương đang trốn ở đó, nhưng không chịu ra khi thấy Lão Tam đứng ngoài.|Vũ Bình: Người kia từng mặc áo gác đường. Các cậu đưa ai tới cứu, ai tới bắt tôi?|Giải thích quan hệ với Lão Tam, để người bệnh có quyền lựa chọn người gặp.
Mũi tên vào cột đò|Đội săn người bắn vào lều trước khi nghe hết lời khai. Nhóm che lối rút qua dãy cột đò, tách người bắn khỏi người dân bị buộc chỉ đường.|Lão Tam: Chúng sợ ông ấy nói hơn sợ mình đánh. Giữ người trước, hỏi tội sau.|Đưa Vũ Bình khỏi lều và giữ một lối về bến.
Nét sửa đầu tiên|Vũ Bình thừa nhận chính tay sửa ba tên hộ dân trong sổ. Ông tưởng sửa một lần để đổi thuốc cho con sẽ chấm dứt, nhưng danh sách sau đó dài thêm mỗi tháng.|Vũ Bình: Tôi bắt đầu bằng một nét mực. Người mất ruộng không thể sống bằng lời tôi bảo mình đã hối hận.|Nghe trọn lời thú nhận, đối chiếu với giấy của Bà Tư.
Đứa trẻ và thang thuốc|Thuốc của Bé Na từng được cấp từ kho U Minh theo giấy nợ của Vũ Bình. Tiểu Muội hiểu vì sao người cha vừa sợ nha thu tô vừa không thể bỏ việc.|Tiểu Muội: Cứu con không khiến ruộng người khác bớt quý. Nhưng biết điều đó mới hiểu ông đang bị ai nắm giữ.|Tách động cơ khỏi việc đã làm để tìm đúng người ép sửa sổ.
Ba dấu không cùng ngày|Vũ Bình mô tả bản ước có dấu quan trấn, người giữ kho và thương hội Vạn Lợi. Dấu cuối được đóng sau hai dấu đầu, vào lúc số tiền đã bị đổi.|Bạn: Vậy không phải ba người cùng ký một điều. Có người đã thay điều được ký.|Tìm bằng chứng về thứ tự đóng dấu, không chỉ hình dấu.
Nhà đò bị lục|Đám truy bắt lục nhà người lái đò để tìm bản ước. Bạn chặn chúng ở sân, tạo thời gian cho ông giấu sổ chuyến đò trong hốc mái đã chuẩn bị sẵn.|Người lái đò: Sổ tôi ghi người qua bến. Nay người giữ sổ cũng phải học cách qua bến cho kín.|Bảo vệ sổ đò, giữ lại thời điểm ba người mang dấu đi qua.
Sợi dây người cha giữ|Vũ Bình vẫn giữ sợi dây buộc tóc của con để nhận tin giả từ đội săn người. Nhóm cho ông xem giấy gói bánh có chữ Bé Na, thay cho một lời trấn an không thể kiểm chứng.|Vũ Bình: Con tôi viết chữ nhỏ đi rồi. Vậy là nó vẫn còn người nhắc ngồi cho ngay.|Để ông tự xác nhận con an toàn trước khi xin thêm lời chứng.
Tấm áo gác đường|Lão Tam nói rõ mình từng áp giải chuyến thóc đầu của Vũ Bình. Ông đã nghe dân xin giãn nợ mà vẫn làm theo lệnh vì sợ mất chỗ đứng.|Lão Tam: Không đánh ai không có nghĩa là đôi tay ta sạch. Ta đã giữ cửa để người khác đánh.|Cho hai người kể đối diện cùng một sự kiện, không cắt lời để giữ hòa khí.
Chữ ký không còn trống|Hai người đồng ý ký vào bản chép nói rõ phần mình. Bản ấy khiến chứng cứ đáng tin hơn, nhưng cũng có thể được dùng bắt cả hai trước khi tới Hoa Lư.|Bạn: Kể thật không đảm bảo được tha. Nó chỉ giúp người khác khỏi phải mang tội thay.|Cất lời khai riêng với sổ gốc để không mất cả hai cùng lúc.
Chợ nổi giữa hai bờ|Nhóm đưa nhân chứng qua chợ nổi thì bị chặn bởi thuyền nhẹ. Bạn giữ khoảng cách khỏi ghe bán hàng, không để trận đuổi bắt lật thành bữa mưu sinh của người khác.|Lão Tam: Đừng nhảy lên ghe rau! Cứu người mà làm họ mất cả chợ thì mai lại phải cứu tiếp.|Vượt vòng chặn, đưa nhân chứng vào thuyền kín.
Phần khó đọc nhất|Bản lời khai còn một chỗ trống: có ghi việc Vũ Bình từng sửa sổ hay không. Tiểu Muội lo điều ấy khiến người nghe bỏ qua cả bằng chứng chống đường dây.|Vũ Bình: Xin đừng biến tôi thành người tốt bằng một nét sửa khác. Tôi đã thử cách ấy rồi.|Quyết định giữ trọn hay lược bỏ phần trách nhiệm của nhân chứng.
Bản đồ dưới đáy thuyền|Người lái đò giấu bản đồ các nhánh rạch dưới tấm ván đáy. Chuyến thóc gần nhất không tới kho chính mà đổi ghe ở một bến không ghi tên.|Bạn: Nếu sổ đò là cửa trước, bến không tên hẳn là cửa sau. Ta cần thấy cả hai.|Chọn đường tới điểm đổi ghe, tránh bỏ sót mắt xích vận chuyển.
Lời nhắn cho người ở lại|Nhóm gửi bản chép về Thanh Khê cùng dấu xác nhận của người lái đò. Quán chủ sẽ biết người chép sổ đã được tìm thấy dù nhóm không kịp về.|Tiểu Muội: Tin tới trước người không phải chuyện xui. Chỉ cần tin đừng chạy nhanh hơn sự thật.|Duy trì đường nhận tin để lời khai không phụ thuộc một đoàn người.
Dấu giày trên bãi sình|Đội truy bắt đã chờ ở điểm đổi ghe. Chúng nhận ra Vũ Bình nhưng không biết bản chép đã đi đường khác, cho thấy việc chia chứng cứ bắt đầu có tác dụng.|Bạn: Giữ thuyền này đủ lâu. Hôm nay thứ quan trọng không nằm cả trong một túi nữa.|Hạ nhóm phục kích và giữ được giấy giao hàng chúng mang theo.
Tên người nhận hàng|Giấy giao hàng ghi người nhận là Đốc Lệ, trấn thủ cửa rừng U Minh. Dưới tên ông ta có dòng thưởng do thương hội Vạn Lợi ứng trước.|Vũ Bình: Người thu tô ăn một phần, người ứng bạc lấy phần còn lại bằng đất. Tôi chỉ nhìn thấy tiền mà quên nhìn ruộng.|Xác định vai trò thương hội trước khi kết luận mọi việc do trấn thủ tự làm.
Nhân chứng xin quay về|Vũ Bình muốn về ngay với con. Nhóm không thể buộc ông đi tới tận hang ổ Đốc Lệ, cũng không thể để ông trở lại lối đang bị theo dõi.|Bạn: Chúng ta cần lời ông, không sở hữu đời ông. Ông sẽ về cùng người biết bảo vệ bến.|Giao việc đưa cha con đoàn tụ cho mạng lưới dân làng.
Giấy thông hành giả|Một người buôn đề nghị bán giấy có dấu quan trấn để nhóm đi nhanh hơn. Vũ Bình nhận ra dấu ấy được làm từ cùng một khuôn với giấy chiếm ruộng.|Lão Tam: Giả để vượt cửa thật nghe tiện. Đến lúc kiện dấu giả, mình đứng giải thích hơi lâu.|Giữ mẫu dấu để so sánh và cân nhắc cách qua trạm cuối.
Ngọn đèn ở bờ nam|Đội gác bờ nam từ chối nhận lời bảo đảm của người lái đò. Nhóm phải giữ lối xuống thuyền cho nhân chứng, không kéo ông trở lại giữa vòng vây.|Tiểu Muội: Người vừa chịu nói thật không nên phải trả giá ngay vì chúng ta nói quá lớn.|Đưa nhân chứng qua bờ an toàn trước khi đối đầu đội trưởng.
Lời vu oan bên bến|Đội trưởng tuyên bố Vũ Bình là kẻ trộm sổ và bạn là đồng phạm. Bạn chọn đứng cùng nhân chứng hoặc dùng danh môn làm vỏ bọc để vượt vòng chặn.|Bạn: Một chiếc bàn trong quán bị hất đổ đã dẫn tới cả bến này. Ta không thể coi người dưới chân mình là chuyện nhỏ nữa.|Vượt bến Liễu; mang bản đồ và giấy giao hàng tới U Minh.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
