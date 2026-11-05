export default {
  title: 'Đường núi và điều chưa nói',
  place: 'Đèo Yên Tử',
  goal: 'Đưa đoàn lên núi, giữ lời với người phu và giải quyết vết rạn trong nhóm.',
  summary:
    'Ngăn một lời thề mới không thể là cớ lặp lại cách đối xử cũ. Khi đường núi chia đoàn người, Lão Tam và Tiểu Muội buộc phải nói rõ điều họ sợ nhất về chuyến đi.',
  bridge:
    'Đoàn phu mở được đường phía sau sân khấu. Những cuộn dây cùng thuốc tạo khói dẫn nhóm tới người làm các phép biểu diễn của minh chủ.',
  battles: [2, 6, 10, 14, 18, 20],
  decision: {
    at: 12,
    a: 'Cùng người phu sửa đường rồi đi tiếp.',
    b: 'Đi đường tắt trước, giao người phu tự tổ chức cứu nhau.',
    good: 'Những người được giữ lại cùng nhóm trở thành người biết đường hậu đài.',
    bad: 'Đường tắt đưa nhóm tới sớm, nhưng lối cứu người phía sau vẫn cần một lời giải thích khi đoàn gặp lại.'
  },
  scenes: `
Bức thư chưa tới làng|Bé Na gửi thư hỏi bao giờ cha được về. Vũ Bình đã an toàn nhưng còn ở Hoa Lư làm chứng; lời hứa đoàn tụ phải đi cùng việc giải thích vì sao ông chưa thể rời.|Bạn: Hứa đưa người về không phải nói xong rồi chờ chuyện tự kết thúc.|Nhờ quán chủ giữ liên lạc và cho cha con được trao tin trực tiếp.
Cửa đèo giữ người phu|Người gánh hàng bị chặn vì lệnh liên minh đòi ưu tiên hàng của minh chủ. Nhóm phá vòng chặn để họ được tới chỗ nghỉ trước khi tối.|Tiểu Muội: Cha ta từng bị giữ như thế. Không muốn phải biết tên từng người mới thấy việc ấy là sai.|Mở đường cho đoàn phu rồi hỏi hàng đang chở đi đâu.
Dây mới trên vai cũ|Các cuộn dây có dấu xưởng khác với dây chở thóc. Người phu nói chúng dùng dựng đài biểu diễn và được tính vào tiền bảo vệ đường buôn.|Lão Tam: Đường chưa chắc được bảo vệ, đài thì có vẻ được chăm rất kỹ.|Giữ phiếu giao dây để tìm người nhận trên núi.
Lán nghỉ không còn lương|Lán có củi nhưng không có gạo vì xe tiếp tế bị giữ dưới đèo. Nhóm xin người giữ lán ghi lại phần đã mượn, không lấy danh nghĩa cứu người để tự ăn trước.|Bạn: Mình phản đối người ta thu không rõ thì lúc dùng của người khác cũng phải nói cho rõ.|Chia phần nghỉ theo sức người, giữ chứng từ để trả lại.
Tin không giống nhau|Lời đồn trên đường kể nhóm đã cướp ấn quan và định tự xưng minh chủ. Có chi tiết đúng bị ghép với kết luận khác, khiến người chưa gặp nhóm không biết tin ai.|Tiểu Muội: Đừng đòi họ nhận ra chúng ta chỉ qua một cái tên. Hãy để họ thấy cách ta làm việc.|Chuẩn bị bản tóm tắt bằng chứng cho người muốn kiểm lại.
Người giữ đường không hỏi|Đội hộ vệ chỉ nhận lệnh chặn tên trong danh sách. Nhóm mở lối bằng chiến đấu nhưng giữ lại người chịu nghe, tránh đẩy mọi người lính về một phía vì bị làm nhục.|Lão Tam: Ta đã từng là người chỉ nhìn danh sách. Đừng cho họ thêm lý do để thôi nhìn người.|Giữ người đã hạ vũ khí và trao cách đối chiếu lệnh thật.
Cái tên Lão Tam bỏ lại|Một người gác già gọi Lão Tam bằng tên nghề cũ. Tiểu Muội hiểu ông từng giữ chính tuyến đưa phu vào rừng, dù chưa biết cha mình có đi qua dưới mắt ông hay không.|Lão Tam: Ta đã kể phần dễ nhận lỗi. Phần còn lại vẫn làm ta muốn quay mặt đi.|Dành chỗ cho câu hỏi khó trước khi nhóm bước vào trận lớn.
Lời hỏi của Tiểu Muội|Nàng hỏi nếu cha mình chưa được cứu, Lão Tam có chịu nói phần ấy không. Ông không nhận mình chắc chắn sẽ làm đúng; ông chỉ nhận đã chọn im lặng quá lâu.|Tiểu Muội: Ta không cần huynh biến quá khứ thành tốt. Ta cần biết lúc người khác hỏi, huynh còn đứng đó không.|Giữ cuộc nói chuyện không biến thành cuộc ép người tha thứ ngay.
Đi cùng không phải xóa lỗi|Bạn thống nhất Lão Tam sẽ đứng làm chứng về tuyến gác cũ. Việc tiếp tục cùng đi không miễn cho ông phần phải đối diện với người từng bị giữ.|Bạn: Bạn bè có thể đỡ nhau khi nói thật. Không nên đỡ bằng cách đứng che sự thật.|Chốt lời hứa cụ thể để nhóm có thể tin qua hành động tiếp theo.
Mưa cuốn mặt đường|Mưa làm sạt một đoạn có xe thuốc và người già. Nhóm giữ đội hộ vệ đang nhân lúc rối để thu hàng, dành đường cho người sửa lối đi.|Người phu: Có thể giúp chúng tôi giữ dây trước rồi mới hỏi chuyện ai đúng ai sai không?|Đẩy lùi người cướp hàng, neo lại xe thuốc.
Một người biết hậu đài|Người phu dẫn nhóm là anh của Cẩm Tú, diễn viên bị giữ trên núi. Cô đã gửi tín hiệu bằng một nút buộc dây mà anh nhận ra trong chuyến hàng.|Bạn: Đường lên không chỉ chở người làm thuê. Nó còn chở những lời cầu cứu được giấu để sống sót.|Hỏi cách nhận nút dây và vị trí sân khấu.
Đường tắt qua khe đá|Một nhánh khe cho phép nhóm lên trước đội canh, nhưng người yếu không qua được. Đi hay ở lại sẽ quyết định ai tới sân khấu cùng nhóm và ai phải chờ giữa núi.|Lão Tam: Ta đã bỏ lại người khác một lần bằng câu mình phải tới cho kịp. Không muốn dùng lại câu ấy mà không nghĩ.|Chọn ưu tiên và ghi trách nhiệm với đoàn còn lại.
Bó thuốc gửi ngược đường|Tiểu Muội gửi thuốc xuống cho cha cùng hướng dẫn nhờ người khác chăm. Nàng không còn tin chỉ mình ở đó mới là cách giữ người thân an toàn.|Tiểu Muội: Có người chịu học cách giúp nhau thì ta mới có thể đi xa mà không bỏ ai hoàn toàn phía sau.|Củng cố người nhận việc trước khi tiếp tục lên núi.
Đêm gió ở lưng đèo|Đội săn dấu sổ tấn công lúc đoàn nghỉ. Người phu đã được giúp kéo xe tạo bức chắn, biến việc sửa đường ban ngày thành chỗ sống sót ban đêm.|Bạn: Những việc không giống chiến công đôi khi lại quyết định ai được đứng sau chiến công.|Giữ bức chắn và bảo vệ người không có vũ khí.
Thư mời viết cho ai?|Lời thề liên minh hứa bảo vệ dân nhưng danh sách ký chỉ có người đứng đầu phái và thương hội. Người phu được yêu cầu dựng đài, không được đứng nghe dưới đài.|Lão Tam: Họ gọi cả thiên hạ tới, rồi xếp chỗ cho thiên hạ ở ngoài cổng.|Tìm cách đưa bản chứng tới những người sắp đặt tay lên lời thề.
Giấy niêm thuốc khói|Trong kiện hàng có bột tạo khói cùng nhãn của xưởng pháo. Nó được ghi như dược liệu trừ độc, khiến Tiểu Muội nghi các phép chữa bệnh trong hội cũng đã được dàn cảnh.|Tiểu Muội: Khói có thể để diễn. Gọi nó là thuốc rồi bắt người bệnh tin mới là chuyện phải hỏi.|Giữ nguyên nhãn và tìm người trực tiếp dùng bột.
Tiếng sáo sau vách đá|Một tiếng sáo lặp đúng đoạn người phu chỉ. Đó là tín hiệu Cẩm Tú còn sống, không phải lời mời lao ngay qua cổng canh.|Bạn: Có tín hiệu là có người chờ. Cũng có nghĩa phải tới bằng đường khiến họ còn được chờ tiếp.|Đánh dấu điểm tiếp cận hậu đài thay vì xông thẳng.
Đội chặn khe hẹp|Người canh phát hiện lối dây và tới cắt cầu treo. Nhóm giữ họ ở khoảng rộng, không để trận đánh làm cầu đứt dưới chân người phu.|Lão Tam: Chặt cầu thì khỏi sợ người đuổi. Nhưng cũng khỏi mong người sau tới cứu.|Giữ cầu cho cả đoàn, mở đường tới nơi nhận hàng.
Cơm nóng dưới mái vách|Đoàn phu tới chỗ an toàn; dù đã chọn đường nào, nhóm phải bàn giao rõ thuốc và người. Không thể coi những người được cứu là việc hoàn tất rồi tự rời đi.|Tiểu Muội: Người được cứu vẫn còn một ngày mai. Xin đừng để ngày mai ấy không có ai nhận việc.|Chốt người ở lại chăm sóc và người tiếp tục dẫn đường.
Chọn ở cửa núi|Đội gác cuối đèo muốn lấy đoàn phu làm điều kiện đổi lối đi. Bạn chọn cứu người khuân vác hoặc đi thẳng để kịp chặn chủ mưu trước lễ thề.|Bạn: Mỗi lần nói không kịp, ta phải nhớ rõ điều gì sẽ muộn với người bị bỏ lại.|Vượt cửa núi và theo dấu dây vào sân khấu Yên Tử.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
