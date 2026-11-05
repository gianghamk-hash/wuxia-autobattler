export default {
  title: 'Cửa thành không giữ được lời',
  place: 'Thành cổ Hoa Lư',
  goal: 'Đưa bằng chứng ra công khai và buộc quan trấn nhận trách nhiệm.',
  summary:
    'Nhóm đã có giấy, vật và người làm chứng. Vấn đề còn lại là ai được nghe, ai có quyền hỏi và ai sẽ sống thế nào nếu cả hệ thống thu tô bị dừng ngay.',
  bridge:
    'Đỗ Mậu giao bản lệnh thật, cho biết Trịnh Nghiêm đang tới Yên Tử để lập lời thề liên minh. Đường lên núi cũng là đường chặn một quyền lực mới trước khi nó thành lệ.',
  battles: [3, 7, 11, 15, 18, 20],
  decision: {
    at: 12,
    a: 'Để dân và người mang nợ cùng dự buổi đối chất.',
    b: 'Giới hạn người dự để dễ giữ trật tự và lời khai.',
    good: 'Buổi đối chất có thêm câu hỏi không ai trong nhóm nghĩ tới, và có người bảo vệ những câu trả lời.',
    bad: 'Buổi đối chất gọn hơn nhưng người ngoài cửa phải nghe kết quả qua lời những người được vào.'
  },
  scenes: `
Ấn mở cửa nhỏ|Thẻ hội võ cho phép nhóm qua cửa phụ, còn dân mang biên nhận phải chờ ngoài nắng. Bà Tư tới từ Thanh Khê không chịu gửi giấy vào nếu mình không được hỏi.|Bà Tư: Ruộng tôi ở ngoài cửa thì sao chuyện lấy ruộng lại chỉ được nói phía trong?|Yêu cầu xác định tư cách người bị thiệt, không chỉ tư cách người giữ thẻ.
Đỗ Mậu gặp trước giờ|Quan trấn nhận chữ ký nhưng đổ phần sửa cho thương hội. Ông đưa bệnh án con gái để giải thích mình đã vay bạc và nhắm mắt trước điều khoản đầu.|Bạn: Ta nghe để biết vì sao ông chọn. Không phải để những người khác phải gánh hộ lựa chọn ấy.|Ghi lời giải thích và chuẩn bị đối chiếu với sổ gốc.
Đội gác chia đoàn|Lệnh mới yêu cầu người giữ khuôn, người giữ sổ và người làm chứng vào ba cửa riêng. Nhóm giữ họ cùng tầm mắt để không ai bị buộc đổi lời trong phòng kín.|Lão Tam: Chia việc để dễ làm thì được. Chia người để chẳng ai biết bạn mình bị làm gì thì không.|Mở một lối vào có người quan sát độc lập.
Ghế của người biết chữ|Nha quan chỉ đặt ghế cho thư lại và người có danh. Tiểu Muội xin chỗ cho người phu đã bị xóa tên, vì ông là người thấy vụ cháy chứ không phải người đọc giấy.|Tiểu Muội: Việc ông ấy thấy không bớt thật chỉ vì ông ấy không chép được nó.|Sắp xếp người làm chứng theo điều họ biết, không theo địa vị.
Hòm niêm trước sân|Mẫu đất sét, khuôn dấu và bản vẽ được kiểm cùng lúc. Người của Đỗ Mậu xác nhận vết mẻ trùng nhau, khiến quan trấn không thể nói chỉ có lời nhóm chống lời thương hội.|Bạn: Từ hôm nay, ai giữ hòm cũng phải ghi ai đã mở nó.|Thiết lập cách bảo quản bằng chứng sau khi nhóm rời thành.
Người lính thiếu lương|Đội gác phản đối dừng thu vì lương đang được trả từ thương hội. Nếu chỉ đóng kho, hàng trăm người cầm vũ khí có thể bị đẩy sang phe muốn giấu sổ.|Lão Tam: Muốn họ bỏ phần tiền bẩn phải nói rõ bữa ăn sạch tiếp theo ở đâu.|Đưa quân lương thành một vấn đề phải giải quyết cùng việc trả ruộng.
Người gây rối ngoài cửa|Một nhóm giả dân đập bàn để buổi đối chất bị hủy. Nhóm giữ trật tự và ngăn đội gác dùng cớ ấy bắt cả những người thật đang xếp hàng.|Bạn: Người làm ồn không đại diện mọi người ngoài cửa. Đừng tiện tay gọi chung rồi khóa lại.|Tách kẻ phá cuộc khỏi dân đang chờ được nói.
Bản sổ thứ tư|Một viên thư lại đem sổ đã chỉnh sạch tới, gọi đó là bản mới nhất. Bản đối chiếu có ký từng trang từ kho Hoa Lư giúp chỉ ra những mục vừa bị bỏ.|Vũ Bình: Tôi từng sửa một dòng để đổi sự yên ổn. Bản này sửa cả tháng, xin đừng gọi là cập nhật.|Giữ lại cả bản mới như chứng cứ về nỗ lực tiếp tục che giấu.
Câu hỏi của Bà Tư|Bà Tư hỏi vì sao giấy bà nộp đủ có dấu thật mà vẫn vô giá trị. Câu hỏi buộc nha quan nhận lỗi không chỉ ở bản sổ mà còn ở cách từ chối người mang giấy.|Bà Tư: Tôi không đòi các ông tin người nhà tôi hơn giấy. Tôi đòi đừng chỉ tin giấy ở phía các ông.|Làm rõ người dân được dùng cách nào để đòi sửa oan sau này.
Đỗ Mậu muốn ký thay|Quan trấn đề nghị ký nhận mọi lỗi để buổi đối chất dừng trước khi nhắc Trịnh Nghiêm. Nhóm không chấp nhận dùng một người chịu tội thay cho việc làm rõ đường dây.|Bạn: Nhận phần mình là trách nhiệm. Nhận thay người khác để họ tiếp tục làm là một cách bao che khác.|Yêu cầu giữ nguyên danh sách người liên quan.
Đoàn nhân chứng bị chặn|Đội hộ vệ Vạn Lợi chặn đường những người được gọi thêm từ chợ rèn. Nhóm đưa họ qua sân trong, giữ quyền nhân chứng được xuất hiện trước khi cuộc họp bị chốt.|Thợ Bảy: Tôi đi cả quãng đường để nói điều tay mình đã làm. Không muốn kết thúc bằng người khác bảo tôi khỏi cần nói.|Đưa nhân chứng mới vào buổi đối chất.
Cửa mở tới đâu?|Sân thành đã đông; mở hết cửa có thể khó giữ trật tự, đóng lại khiến người mất ruộng không nghe được chính việc của mình. Nhóm phải chọn cách chịu trách nhiệm cho buổi đối chất.|Tiểu Muội: Trật tự để người ta được nói khác với yên lặng vì người ta bị giữ ngoài.|Chọn ai được dự và ghi rõ cách công bố kết quả.
Điều khoản bị thêm sau|Người thợ xác nhận ngày làm khuôn; Vũ Bình chỉ thứ tự chữ và dấu; người kiểm thóc chỉ số bao. Ba lời khai cùng chứng minh điều khoản lấy ruộng được thêm có chủ ý.|Bạn: Không cần một lời chứng hoàn hảo. Cần những phần khác nhau không còn chỗ để ghép thành lời dối.|Chốt chuỗi chứng cứ bằng bản ghi có người kiểm lại.
Con gái quan trấn|Con gái Đỗ Mậu tự đưa giấy vay thuốc có tên người giữ sổ Vạn Lợi. Nàng không xin tha cho cha, chỉ muốn khoản chữa bệnh không tiếp tục là cớ bịt miệng.|Cô gái: Tôi được cứu bằng tiền ấy. Đừng để người khác phải mất nhà rồi gọi đó là công cứu tôi.|Tách quyền được chữa bệnh khỏi khoản đổi chác mà cha nàng đã nhận.
Lệnh đóng cổng|Trịnh Nghiêm gửi lệnh phong tỏa thành bằng con dấu nhân danh liên minh. Đội gác phải chọn nghe lệnh thương hội hay người đang ngồi giữ ấn quan thật.|Đỗ Mậu: Hôm nay ta ký một lệnh mà không được phép bảo mình chưa đọc.|Giữ cửa thành mở cho dân, chặn đội hộ vệ muốn chiếm chỗ giữ ấn.
Bạc giữ trong kho nào?|Sổ chỉ ra phần bạc đã thu nhưng chưa chuyển đi. Nhóm đề nghị niêm khoản ấy trả công giữ thành trước, không tự lấy làm chiến phí hoặc chia để mua lòng.|Bạn: Tiền không tự hết bẩn khi đổi người giữ. Cần ghi nó sẽ được dùng cho ai và vì sao.|Lập phương án ngăn việc thiếu lương biến thành cướp bóc.
Tin từ Yên Tử|Người đưa tin báo Trịnh Nghiêm mời các phái lên Yên Tử thề bảo vệ đường buôn. Ông ta muốn lời thề mới khiến các lệnh cũ thành việc được cả giang hồ nhận.|Lão Tam: Lúc không giữ nổi một tờ giấy, ông ta muốn mượn thêm thật nhiều người giữ hộ.|Chuẩn bị chặn cuộc lập lời thề trước khi nó thay thế buổi đối chất.
Phản lệnh trong thành|Đội thân tín của Đỗ Mậu định bắt quan để đổi lấy sự bảo hộ của Vạn Lợi. Nhóm giữ ông ta tại chỗ điều trần, không để người đang chịu trách nhiệm biến thành người mất tích.|Bạn: Đưa ông ấy đi kín lúc này chỉ khiến ngày mai có thêm một người bị kể hộ câu chuyện.|Ngăn cuộc bắt người, giữ ấn cùng biên bản ở thành.
Một lệnh không giải hết oan|Đỗ Mậu chấp nhận dừng chuyển ruộng và trả người bị giữ. Những khoản đã mất vẫn phải kiểm từng hộ; nhóm hiểu không có một chữ ký đủ sửa mọi bữa đói.|Bà Tư: Biết chưa xong không làm hôm nay vô ích. Nó chỉ khiến người ký phải nhớ trở lại làm tiếp.|Giao việc tiếp tục rà soát cho dân và người giữ kho độc lập.
Người giữ ấn phải chọn|Đội hộ pháp cuối cùng bảo vệ quyền dùng lệnh liên minh. Sau khi hạ họ, bạn chọn đưa nhân chứng ra an toàn hay buộc quan trấn giao tài sản và quyền lực.|Bạn: Ta đã buộc ông trả lời. Việc tiếp theo sẽ cho biết ta muốn người khác được hỏi hay chỉ muốn mình được ra lệnh.|Giữ cửa thành, mang bản lệnh thật lên đường Yên Tử.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
