export default {
  title: 'Khói không che được người',
  place: 'Hậu đài Yên Tử',
  goal: 'Giải cứu người diễn và tìm cách công bố bằng chứng mà không biến họ thành vật tế.',
  summary:
    'Các phép biểu diễn của minh chủ là giả, nhưng đoàn hộ vệ và những khoản nợ là thật. Nhóm phải chứng minh trò dàn dựng mà vẫn giữ người từng bị ép tham gia được sống để làm chứng.',
  bridge:
    'Cẩm Tú cùng sổ nhận tiền xác nhận Trịnh Nghiêm đã dựng cả tai họa lẫn cuộc cứu trợ. Nhóm chuẩn bị một buổi đối chứng để các phái có lý do rút khỏi lời thề.',
  battles: [4, 7, 11, 15, 18, 20],
  decision: {
    at: 12,
    a: 'Đưa người diễn ra khỏi nguy hiểm trước khi công bố.',
    b: 'Giữ họ tại hậu đài để có thể vạch trò giả ngay trong lễ.',
    good: 'Người diễn chịu đứng tên làm chứng vì đã được chọn cách bảo vệ mình.',
    bad: 'Bằng chứng tới sân khấu nhanh hơn, nhưng người diễn biết mình vẫn đang bị dùng để đổi lấy kết quả.'
  },
  scenes: `
Cánh cửa không dành cho khán giả|Theo tín hiệu sáo, nhóm vào hậu đài bằng đường giao dây. Trên tường là lịch tập các phép chưởng phong, có người phải tập thay cho một người chưa từng xuất hiện.|Bạn: Chúng ta tới để hỏi người làm việc, không phải đập sân khấu trước khi họ kịp bước xuống.|Tìm Cẩm Tú và người giữ lịch diễn.
Nút dây của người anh|Cẩm Tú nhận ra nút buộc anh mình gửi. Cô tin có đường về nhưng không chịu đi nếu hai người diễn bị thương còn mắc dưới khung nâng.|Cẩm Tú: Ta biết treo mình bằng dây là nghề nguy hiểm. Không ai ký nhận bị bỏ lại khi dây đứt.|Lập kế hoạch đưa cả nhóm diễn ra, không chỉ người giữ bí mật.
Cơ cấu của một chưởng phong|Đường Thập Nhị tìm bộ kéo đẩy luồng gió qua bột khói. Nó có thể tạo tiếng nổ trên đài nhưng không đủ sức che một đội hộ vệ thật phía dưới.|Đường Thập Nhị: Dụng cụ không lừa ai. Người bắt khán giả tin nó là trời mới cần giải thích.|Ghi lại cơ cấu trước khi tháo những phần đang giữ người.
Người giữ khung nâng|Đội canh muốn hạ khung để dọa người diễn im lặng. Nhóm giữ họ khỏi dây chịu lực, còn Cẩm Tú hướng dẫn đường xuống cho người đang mắc phía trên.|Bạn: Đánh người gác không được biến người trên khung thành người chịu đòn thay.|Bảo vệ khung nâng và mở lối xuống an toàn.
Tai họa cũng có lịch tập|Trong lịch diễn có một buổi cứu người khỏi sập mái đã xảy ra ở làng bên. Tên người bị thương và tiền bồi dưỡng được ghi từ trước ngày mái sập.|Tiểu Muội: Nếu vết thương là thật mà tai họa được đặt trước, chuyện này không còn là một trò diễn nói quá.|Giữ lịch cùng danh sách người nhận tiền, xác định ai đã bị làm hại thật.
Nghề của người đứng trong khói|Cẩm Tú kể mình nhận diễn lễ cầu an, sau đó bị giữ giấy nợ để phải đóng cả cảnh cứu nạn. Người diễn không phải chủ mưu, nhưng vẫn phải kể phần mình đã biết.|Cẩm Tú: Tôi muốn được gọi đúng tên nghề. Cũng muốn có can đảm nhận lúc nghề ấy đã bị dùng làm điều sai.|Tách việc biểu diễn hợp pháp khỏi những cảnh gây hại cho dân.
Đội áp giải người diễn|Những người bị thương vừa được đưa xuống đã bị đội canh ép chuyển sang lán khác. Nhóm giữ họ trong tầm mắt nhân chứng, không cho lịch diễn biến thành danh sách người mất tích.|Lão Tam: Mấy tờ giấy này đã chuyển đủ người từ kho sang lán rồi. Tới đây nên hết chuyến.|Giữ người và bản nhận công không bị tách riêng.
Sổ bồi dưỡng hai cột|Một cột ghi công diễn, cột kia ghi công giữ người xem không được hỏi. Người trả cả hai khoản là người giữ ấn thương hội dưới tên Trịnh Nghiêm.|Bạn: Chúng ta cần tên người trả tiền và việc tiền ấy đã mua. Không chỉ cần một màn khiến khán giả kinh ngạc.|Đối chiếu chữ ký với thư từ kho Hoa Lư.
Vết thương dưới lớp áo|Tiểu Muội nhận ra người diễn từng được cha mình cứu sau vụ cháy kho. Hai tuyến người bị giấu gặp nhau: vụ cháy vừa xóa sổ cũ vừa tạo dịp minh chủ tới cứu trợ.|Tiểu Muội: Một lần cứu người không xóa được việc đã để người ấy mắc nạn.|Ghi lời xác nhận của người được cứu và người chữa thương.
Bột khói không chữa bệnh|Lý Độc Thủ xác định bột chỉ gây cay mắt, không trừ độc như lời rao. Nhóm phải giữ mẫu để người khác kiểm, không tự trộn thử lên người rồi gọi đó là chứng minh.|Lý Độc Thủ: Muốn vạch một trò dùng người bệnh làm phép thử, đừng bắt đầu bằng việc làm giống họ.|Niêm mẫu và chuẩn bị cách trình bày không gây thêm nạn nhân.
Lối ra sau sân khấu|Đội chặn hậu đài muốn gom người diễn vào lễ để họ không thể nói ngoài kịch bản. Nhóm mở lối ra dưới mái thấp, nơi người bị thương có thể đi mà không leo dây.|Cẩm Tú: Xin giữ lối dưới đất. Những người trên khung hôm nay không còn cần chứng minh họ biết bay.|Đưa người yếu tới chỗ có đoàn phu nhận chăm sóc.
Thời điểm công bố|Buổi lễ sắp bắt đầu. Đưa người diễn đi trước giúp họ an toàn hơn; giữ họ ở gần sân khấu giúp bằng chứng được chứng minh ngay nhưng tăng nguy cơ bị bắt.|Bạn: Nói thật về một người không cho ta quyền quyết định thay người ấy được mạo hiểm tới đâu.|Chọn kế hoạch bảo vệ người làm chứng và chấp nhận hệ quả.
Một danh tiếng sắp rơi|Vài chưởng môn biết có phép diễn nhưng vẫn tin Trịnh Nghiêm bảo vệ đường buôn. Nếu chỉ công bố chuyện khói giả, họ có thể bỏ qua toàn bộ vụ chiếm ruộng.|Lão Tam: Họ bỏ được một lời nói khoác rồi vẫn giữ túi bạc thì chuyện mình chưa tới đích.|Kết nối màn diễn với sổ quân lương và những người bị ép nhận nợ.
Ba phần của bản chứng|Nhóm sắp bằng chứng thành ba phần: ai bị hại, cách giấy bị sửa, tiền nuôi lực lượng nào. Cơ cấu chưởng phong chỉ là phần giúp người nghe hiểu cách danh tiếng được dựng lên.|Bạn: Không cần kể điều to nhất trước. Cần kể sao cho người nghe kiểm được điều tiếp theo.|Chuẩn bị một trình tự công bố không phụ thuộc người diễn phải chịu nguy hiểm.
Cuộc cướp mẫu khói|Đội giữ ấn muốn phá cơ cấu và mang đi mẫu bột. Nhóm giữ các vật đã được người ngoài đối chứng, chấp nhận để vài món không cần thiết bị tháo bỏ cho người diễn thoát.|Đường Thập Nhị: Giữ chứng không phải giữ mọi con ốc. Giữ đúng thứ khiến câu chuyện không bị vặn lại.|Bảo vệ mẫu chính và đường thoát của nhân chứng.
Lá thư minh chủ tự tay sửa|Cẩm Tú giữ bản kịch có nét sửa của Trịnh Nghiêm. Ông ta yêu cầu thêm cảnh dân quỳ xin cứu trợ để việc thu tiền bảo hộ trông như ý muốn tự nguyện.|Cẩm Tú: Câu họ phải nói trên đài được viết trước cả lúc họ biết mình sẽ lên đài.|Giữ bản sửa để chứng minh ai đặt lời vào miệng dân.
Lời hẹn với các phái|Người đưa tin từ Bình Định xác nhận một số phái chịu nghe bản chứng nếu có đủ người không cùng phe. Nhóm mời cả người từng đối đầu để buổi nghe không thành cuộc tự kể tự tin.|Bạn: Nếu chỉ mời người đã tin mình, ta không cần mang theo nhiều chứng cứ đến thế.|Đặt điều kiện đối chất và bảo đảm lối ra cho người tới nghe.
Đội đóng thế có vũ khí thật|Những người được gọi là đội diễn cuối cùng lại mang vũ khí và lệnh giữ nhân chứng. Nhóm phải phân biệt họ với người làm nghề đang tháo áo diễn để rời đi.|Tiểu Muội: Áo giống nhau không đủ để nhận phe. Nhìn ai đang mở đường cho người khác, ai đang khóa lại.|Hạ nhóm được thuê bắt người và giữ người không tham chiến an toàn.
Không cần đốt sân khấu|Nhóm để lại phần sàn và đạo cụ không gây hại. Cẩm Tú muốn đoàn có thể làm nghề thật sau khi vụ án qua, thay vì mất luôn kế sinh nhai cùng danh tiếng của chủ thuê.|Bạn: Chúng ta đang gỡ một lời gian, không phải xóa mọi thứ từng bị lời gian chạm vào.|Giữ quyền trở lại làm nghề của những người đã chịu làm chứng.
Chưởng phong còn lại mùi pháo|Đội hộ vệ cuối ngăn nhóm rời hậu đài. Khi thắng, bạn chọn bảo vệ người diễn và công khai trò lừa hay giữ bí mật để tự xoay chuyển thế cờ.|Cẩm Tú: Xin nhớ người đứng trong khói cũng có tên. Lúc kể lại, đừng gọi chúng tôi chỉ là một mẹo.|Mang người, mẫu và bản kịch tới cuộc đối chứng trên đỉnh núi.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
