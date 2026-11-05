export default {
  title: 'Tiếng trống Bình Định',
  place: 'Hội võ Bình Định',
  goal: 'Giành quyền điều trần trong hội võ và tìm người tuyển hộ vệ cho Vạn Lợi.',
  summary:
    'Hội võ không tự nhiên liên quan tới ruộng đất: người thắng được đưa đi giữ kho, người thua mang khoản nợ thi đấu. Nhóm phải bước vào luật ấy để mở một diễn đàn cho nhân chứng.',
  bridge:
    'Tấm thẻ thắng hội mở cửa kho sổ Hoa Lư. Danh sách người được tuyển cho thấy một đội quân đang hình thành dưới tên hộ vệ thương lộ.',
  battles: [3, 6, 10, 14, 17, 20],
  decision: {
    at: 12,
    a: 'Giữ luật công khai dù phải đấu thêm trận.',
    b: 'Nhận đường tắt kín để tới được kho sổ sớm.',
    good: 'Võ sinh từng đối đầu chịu xác nhận kết quả; quyền vào kho của nhóm có người bảo vệ.',
    bad: 'Nhóm đi nhanh hơn nhưng món nợ với người mở cửa hộ bắt đầu xuất hiện trong mọi cuộc hỏi chuyện.'
  },
  scenes: `
Vé vào hội đã trả trước|Vé tìm trong kho U Minh mang đúng số chuyến thóc. Ban hội không phủ nhận, chỉ nói nhà tài trợ có quyền dùng hàng ứng để trả chi phí.|Bạn: Nếu tiền ấy là tô của dân, dân có được coi là nhà tài trợ không?|Xin đăng ký dự hội bằng chứng từ thu thập được.
Cái giá của một trận|Võ sinh Kha Vân chỉ bảng nợ áo, thuốc và chỗ nghỉ mà người đăng ký phải ký. Cô vào hội để chuộc em, rồi phát hiện mỗi lần thua lại nợ thêm.|Kha Vân: Ở đây thắng được kiếm, thua được giấy nợ. Họ bảo ai cũng có phần.|Tìm điều khoản tuyển hộ vệ trước khi đặt bút nhận luật.
Roi qua ba nhịp|Vòng đầu dùng roi và giới hạn sân nhỏ, buộc nhóm giữ đội hình thay vì chỉ dồn lên. Bạn đấu để được nghe quy định, không để biến võ sinh thành kẻ thù.|Đại Lực: Người giỏi biết thu roi trước khi làm gãy tay người đang học.|Vượt vòng đầu và giữ quyền chất vấn ban hội.
Người thu chữ ký|Thư lại của thương hội chờ người thắng ký sẵn lệnh nhận việc. Những chỗ ghi nơi đến còn bỏ trống, giống khoảng trống từng bị sửa trong sổ thu tô.|Bạn: Ta đã thấy một nét mực điền sau lấy mất ruộng. Không muốn nó lấy thêm đời người.|Yêu cầu được đọc mẫu lệnh đầy đủ.
Đùi gà của Lão Tam|Lão Tam trả thức ăn vay từ bếp rồi đem chuyện nợ ra hỏi người ghi sổ. Người ấy vô tình tiết lộ tiền ăn bị tính cả vào lương hộ vệ trước khi họ đi làm.|Lão Tam: Ăn một đùi gà không nên phải trả bằng một cánh tay cầm kiếm suốt năm.|Giữ hai bản tính chi phí để so sánh.
Trận của người mang nợ|Đội Kha Vân bị ép đấu tiếp dù đã có người chấn thương. Nhóm nhận phần thi hợp lệ thay họ, chặn cách ban hội dùng trận đấu để tăng nợ thuốc.|Tiểu Muội: Người còn đứng được không có nghĩa là vết thương đã đồng ý cho họ đánh.|Giữ an toàn cho võ sinh và khiến người coi hội phải ghi nhận chấn thương.
Lời mời từ chỗ cao|Đại diện Vạn Lợi mời bạn uống trà, khen người trẻ có nghĩa khí. Ông ta đề nghị bỏ chuyện kho U Minh để đổi chỗ làm an ổn cho cả nhóm.|Bạn: Nếu chuyện ấy thật nhỏ, sao cần trả công cho ta quên nó?|Nghe đủ đề nghị để biết điều gì đối phương muốn giấu.
Người uống trà không ký|Mộng Cô Bán Trà không cho người của thương hội giữ sổ khách. Nàng từng thấy các võ sinh được dẫn đi nhưng người gửi thư về lại dùng cùng một nét chữ.|Mộng Cô: Trà nguội có thể hâm. Chữ người khác viết thay mình thì không nên gọi là thư nhà.|Xin đối chiếu mẫu thư và giữ nguồn tin kín đáo.
Tiếng trống gọi thiếu người|Một đội hộ vệ vừa nhận lệnh đã thiếu hai người sáng nay. Danh sách gọi tên vẫn đủ, chứng tỏ ban hội đang ghi người có mặt trước khi hỏi họ có tới hay không.|Kha Vân: Ta bắt đầu hiểu vì sao hội cần nhiều người thắng mà chẳng cần khán giả nhớ ai.|Tìm nơi đội hộ vệ tập kết trước lễ trao thưởng.
Vòng đấu che lối đi|Ban hội ghép nhóm với đội có sở trường đánh hậu, hy vọng buộc bạn bỏ cuộc trước khi ra điều kiện đọc sổ. Bạn cần giữ y sư sau hàng chắn.|Bạn: Biết họ bày trận để làm gì không thay cho việc phải bày trận tốt hơn.|Vượt trận ghép bất lợi mà không bỏ người bị thương.
Thắng để được hỏi|Sau trận, nhóm đủ quyền xin điều trần công khai về người mất tích. Ban hội nói chỉ còn thiếu chữ ký người bảo trợ, biến thắng lợi thành một cửa phụ nữa.|Lão Tam: Cửa này mở ra thì thấy cửa khác. Chắc người xây hội trước kia bán khóa.|Hỏi xem có luật nào cho nhân chứng thay người bảo trợ.
Lối chính và lối kín|Kha Vân tìm được luật võ sinh đồng bảo trợ; Mộng Cô có người mở cửa kho riêng. Lựa chọn quyết định nhóm dựa vào người công khai hay một ân tình kín.|Kha Vân: Đi đường nào cũng được, nhưng đừng bắt người khác tin ta chưa từng chọn.|Chọn cách giành quyền vào kho và ghi rõ người đã giúp.
Thư chưa gửi của người thắng|Trong chỗ nghỉ có thư người hộ vệ viết cho mẹ, nói được đưa tới Hoa Lư thay vì giữ đường gần nhà. Cậu đã bỏ bản sao vì lo không được gửi thư thật.|Bạn: Người viết để lại một bản vì biết mình có thể bị cấm nói. Giống Vũ Bình ở quán trọ.|Giữ thư như lời chứng về việc đổi nơi làm sau khi ký.
Đội hộ vệ muốn rời hội|Một nhóm xin rút bị đòi tịch thu hành lý. Bạn ngăn đội cưỡng ép, còn Tiểu Muội hướng dẫn võ sinh làm chứng việc họ chưa nhận công nhưng đã bị tính nợ.|Kha Vân: Chúng ta tới để thử võ. Không ai đồng ý đem đời mình làm giải thưởng.|Giữ những người muốn rời hội và bản kê hành lý của họ.
Dấu mẻ trên tấm thẻ|Tấm thẻ nhận việc có nét mẻ trùng mẫu dấu ở bến Liễu và lời cha Tiểu Muội. Ba nơi cách xa nhau đang dùng một dấu pháp lý chung.|Bạn: Không còn là chuyện một trấn thủ tham. Có một bàn tay khiến giấy ở đâu cũng nghe lời nó.|Ghép mẫu dấu, ghi người trực tiếp cấp thẻ.
Tên Trịnh Nghiêm|Mộng Cô xác nhận người ký hợp đồng tài trợ là Trịnh Nghiêm, chủ thương hội Vạn Lợi. Người ta cũng gọi ông ta là minh chủ bảo vệ đường buôn.|Mộng Cô: Một người có thể mang hai danh. Ta chỉ muốn biết ai trả giá cho cả hai.|Tách danh tiếng của người tài trợ khỏi chứng cứ về việc ông ta làm.
Giao đấu trước người làm chứng|Đội nhà tài trợ thách đấu để phủ nhận tư cách của nhóm. Những võ sinh đã được giúp đứng quanh sân, ngăn ban hội đổi luật giữa trận.|Đại Lực: Trống đã đánh ba hồi thì đừng bảo vừa rồi chỉ là thử tiếng.|Giữ chiến thắng hợp lệ và quyền của người ngoài sân được nhìn thấy.
Dấu tay thay bảo trợ|Kha Vân cùng những người rời hội đặt dấu tay xác nhận nhóm đã thắng đúng luật. Mỗi dấu là một người thật, không phải khoảng trống chờ được điền trong nha sổ.|Bạn: Ta nhận giấy này để mở cửa cho nhân chứng, không để đi nhanh hơn rồi quên họ.|Nhận thẻ điều trần cùng danh sách người tự nguyện làm chứng.
Giấy mời tới Hoa Lư|Thư của quan trấn hẹn nhóm vào kho sổ sau lễ bế hội. Vũ Bình gửi tin từ Thanh Khê rằng tên các hộ bị sửa còn một bản gốc ở chính kho ấy.|Tiểu Muội: Hai đường cuối cùng đã gặp nhau. Cần giữ cả thẻ thắng lẫn người biết đọc phần bị sửa.|Hẹn mạng lưới nhân chứng tới Hoa Lư theo nhiều tuyến.
Vòng cuối của đại hội|Đội hộ vệ giỏi nhất ra sân, bảo vệ quyền không cho ai hỏi nhà tài trợ. Bạn chọn thi đấu công khai hoặc dùng đường đã được mở để điều tra hậu trường.|Bạn: Thắng trận không tự khiến một câu nói thành đúng. Nhưng nó có thể buộc người không muốn nghe phải ngồi lại.|Hoàn tất hội võ, mang quyền điều trần tới kho sổ Hoa Lư.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
