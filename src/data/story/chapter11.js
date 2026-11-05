export default {
  title: 'Người đứng sau tiếng trống',
  place: 'Thiên đài Yên Tử',
  goal: 'Phá thế ép ký lời thề và giữ các nhân chứng tới lúc Trịnh Nghiêm phải trả lời.',
  summary:
    'Trò chưởng phong đã rõ, nhưng quyền lực của Trịnh Nghiêm còn nằm trong lương hộ vệ và nợ của người dự hội. Chiến thắng phải tháo được cách ông ta buộc mọi người bảo vệ lẫn nhau trong một lời gian.',
  bridge:
    'Liên minh cầm vũ khí tan rã, Trịnh Nghiêm bị giữ. Ấn và sổ rơi vào tay nhóm, nhưng dân vẫn cần ăn, người lính vẫn cần công và chính người thắng có thể trở thành người ra lệnh không chịu bị hỏi.',
  battles: [2, 5, 9, 12, 16, 20],
  decision: {
    at: 14,
    a: 'Cho người từng tham gia đường dây được nói đầy đủ.',
    b: 'Chỉ cho người không vướng tội đứng làm chứng.',
    good: 'Lời kể có thể khiến người nghe giận, nhưng đường dây không còn chỗ nấp sau người bị đẩy ra chịu tội thay.',
    bad: 'Buổi nghe dễ thuyết phục hơn trước mắt, nhưng những mắt xích bị giữ ngoài vẫn biết các phần chưa được kể.'
  },
  scenes: `
Bàn tay sắp đặt lên lời thề|Các phái đã tụ quanh đài. Trịnh Nghiêm gọi buổi đối chứng là âm mưu cướp quyền, yêu cầu ký lời thề trước rồi mới cho hỏi sau.|Bạn: Đặt tên vào lời thề trước khi biết nó bảo vệ ai cũng là một cách ký vào khoảng trống.|Giữ quyền chất vấn trước khi bất cứ ai bị buộc cam kết.
Đội giữ sân|Hộ vệ ngăn nhân chứng bước lên, còn người dự hội bị giữ như khán giả không được rời chỗ. Nhóm mở khoảng sân giữa hai bên để người ta có thể nghe mà không thành con tin.|Kha Vân: Đấu ở Bình Định để được nói. Đừng tới đây lại chỉ được đứng nhìn.|Giữ lối vào và lối ra cho buổi đối chứng.
Mảnh sổ từ Rồng Lửa|Bản chép quán chủ giữ tới nơi cùng dấu xác nhận của Bà Tư. Nó chứng minh bản đang được công bố đã tồn tại trước những lời buộc tội mới của thương hội.|Bạn: Quán nhỏ không giữ nổi một đội quân. Nhưng giữ được ngày tờ giấy này bắt đầu nói chuyện.|Đặt bản chép đầu tiên cạnh sổ gốc.
Người từ U Minh trở lại|Đoàn người biết chuyện Đốc Lệ tới chân đài. Cách bạn đã xử lý ông ta quyết định họ coi nhóm là chỗ có thể nói thật hay một phía chỉ muốn có người nhận tội.|Lão Tam: Chuyện ta làm ở rừng đi tới đây trước cả bước chân mình.|Đối diện hệ quả của việc đã chọn thay vì chỉ gọi thêm nhân chứng có lợi.
Cổng hông bị khóa|Đội thân tín nhốt người đưa thẻ kiểm thóc tại cổng hông. Nhóm giữ mặt sân bằng một đội, mở lối bằng đội khác, không kéo mọi người đang nghe vào hỗn chiến.|Bạn: Giữ được người nói không đủ. Phải giữ cả người có thể kiểm lời ấy.|Đưa thẻ kiểm thóc tới chỗ đối chiếu.
Vũ Bình đọc phần mình sai|Trước mọi người, Vũ Bình nhận đã sửa ba tên đầu. Việc ông không nhận mình trong sạch khiến Trịnh Nghiêm khó biến phần thú nhận thành lý do bỏ cả cuốn sổ.|Vũ Bình: Tôi xin được chịu phần mình làm. Xin đừng dùng nó để xóa những người đã mất ruộng vì phần người khác làm.|Giữ lời thú nhận trong cùng biên bản với bằng chứng chống thương hội.
Đại Lực giữ thẻ thắng|Võ sinh xác nhận nhóm vào kho bằng quyền thắng hội chứ không tự phá cửa. Những người từng thua nhóm bảo vệ sự hợp lệ của kết quả họ đã tận mắt thấy.|Đại Lực: Người thắng ta có thể khiến ta khó chịu. Nhưng không vì thế mà trận đã đấu được quyền đổi khác.|Để người không cùng lợi ích xác nhận những việc cụ thể.
Khuôn dấu trên đất sét|Thợ Bảy đặt khuôn lên mẫu đất có niêm cũ. Vết mẻ trùng mẫu từ bến Liễu khiến đường giải thích rằng mọi giấy đều do nhóm tự làm giả bị chặn.|Đường Thập Nhị: Có thể cãi người thợ nhớ sai. Khó bắt cả vết nứt trên thép nhớ theo ý mình.|Hoàn tất đối chứng vật và người trước khi chuyển tới dòng tiền.
Đoàn xe định rời núi|Người giữ bạc của Vạn Lợi tìm cách chuyển hòm quân lương đi, để lời hứa trả công hộ vệ không còn thực hiện được. Nhóm chặn xe và niêm trước người giữ thành.|Bạn: Giữ bạc này không phải để mua người về phe ta. Để người cầm kiếm có quyền chọn mà không phải nhịn đói.|Bảo toàn khoản công đã được kiểm, tách nó khỏi của cải riêng đang tranh chấp.
Hộ vệ được phép hạ kiếm|Nhóm đưa ra cách ghi công đã làm và lối rời đội cho người không muốn giữ nhân chứng nữa. Một phần hộ vệ hạ kiếm, khiến Trịnh Nghiêm phải dùng người thân tín thay cho đám đông.|Lão Tam: Ta từng cần một lối như vậy. Cho họ lối ấy không xóa việc họ phải kể sau này.|Chấp nhận đầu hàng có điều kiện rõ, không buộc người ta thề trung thành ngay.
Trịnh Nghiêm nói về trật tự|Ông ta nhận hệ thống có người chịu thiệt nhưng nói không có mình thì đường buôn sẽ tan. Nhóm trả lời bằng những người đã tự giữ kho, giữ bến và giữ xưởng khi được biết việc thật.|Bạn: Thứ ông gọi là trật tự chỉ đứng được khi những người giữ nó không được hỏi mình đang giữ gì.|Đối chiếu lời tự nhận với việc các cộng đồng đã tự làm được.
Đội cắt dây truyền tin|Đám thân tín tấn công người đưa biên bản xuống núi. Nhóm giữ đường truyền tin để buổi đối chứng không biến mất cùng một đám người trên đỉnh.|Tiểu Muội: Hôm nay không phải ai đứng gần đài nhất mới đang giữ sự thật.|Bảo vệ người mang bản chứng tới Hoa Lư và Thanh Khê.
Cẩm Tú bước khỏi vai diễn|Cẩm Tú trình lịch dựng cảnh cùng bản kịch Trịnh Nghiêm sửa. Nàng không diễn lại cảnh người bệnh quỳ xin, chỉ đọc lời người ấy bị buộc phải nói.|Cẩm Tú: Tôi có thể làm lại màn khói. Nhưng không muốn khán giả phải nhìn một người bị thương diễn nỗi đau thêm lần nữa.|Giữ việc chứng minh không lặp lại sự tổn hại đã xảy ra.
Ai được nhận lỗi trước đám đông?|Một số người dự hội chỉ muốn nghe người chưa dính tội. Nhóm phải chọn có cho Đốc Lệ và những người đã nhận lệnh nói hay giữ buổi kể sạch sẽ hơn.|Bạn: Nếu mọi người từng làm sai đều không được nói, ta sẽ không bao giờ biết ai đã ra lệnh.|Quyết định ai được đối chất và chịu trách nhiệm cho phần lời kể còn thiếu.
Đỗ Mậu giao ấn đối chứng|Quan trấn gửi mẫu ấn thật cùng lệnh xác nhận quyền dừng chuyển ruộng. Ông không đòi nhóm đổi phần kết luận để giữ chức, chấp nhận ngày trở về phải tiếp tục bị hỏi.|Lão Tam: Có người lần đầu giữ được chức khi biết đặt nó xuống bàn cho người khác xem.|Đối chiếu thẩm quyền thật trước khi nhóm cầm tới ấn thu được của thương hội.
Ba hàng trước Thiên Đài|Đội hộ vệ cuối chia tiền trung hậu, dùng ám khí đánh người chữa thương. Nhóm phải giữ hàng chắn, không để sự nóng giận phá cách phối hợp đã học suốt đường đi.|Tiểu Muội: Ta cứu được nhiều người hơn khi còn đứng vững, không phải khi đứng thật gần người cần đánh.|Vượt đội bảo vệ đài và giữ tầm nhìn cho toàn đội.
Người mua lời kể cuối cùng|Trịnh Nghiêm đề nghị nhận nhóm vào liên minh, giữ sổ cho nhóm và hứa bồi thường dân. Điều kiện là mọi bản chứng bên ngoài phải bị thu lại.|Bạn: Nếu việc bồi thường cần người bị hại thôi được kiểm, đó không phải cách kết thúc chuyện này.|Giữ các bản sao ở ngoài quyền kiểm soát của người đang bị hỏi.
Ấn trên bàn không tự có chủ|Ấn điều động hộ vệ rơi khỏi tay người giữ bạc. Một số người lập tức đề nghị bạn nhận, vì muốn có người ra lệnh nhanh trước lúc hỗn loạn.|Lão Tam: Người ta sợ khoảng trống nên dễ nhét người gần nhất vào. Hãy nhớ mình từng tới đây để hỏi gì.|Giữ ấn như vật cần bàn giao, chưa coi nó là phần thưởng thắng trận.
Điều không còn đổ cho khói|Các phái chấp nhận không ký lời thề. Danh tiếng giả không còn giữ được đội thân tín, nhưng Trịnh Nghiêm vẫn còn một lực lượng sẵn sàng tranh quyền bằng vũ khí.|Bạn: Ta đã khiến họ phải nghe. Việc còn lại là không để những người đã lên tiếng chết vì buổi nghe ấy.|Chuẩn bị trận cuối với người đã chọn tiếp tục dùng sức mạnh để bịt miệng.
Chân tướng trước người sống|Đội thân tín cuối cùng ra chặn biên bản và đường xuống núi. Khi hạ họ, bạn chọn trả bằng chứng về cho dân hoặc giữ quyền định đoạt trong tay mình.|Trịnh Nghiêm: Rồi các người cũng cần một người giữ mọi chìa khóa. Bạn: Cần người giữ không có nghĩa người ấy được miễn bị hỏi.|Giữ Trịnh Nghiêm để đối chất tiếp, đưa đoàn và ấn về Hoa Lư.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
