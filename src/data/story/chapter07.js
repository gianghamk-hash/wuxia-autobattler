export default {
  title: 'Lửa trong lò, dấu trên thép',
  place: 'Chợ rèn ven Hoa Lư',
  goal: 'Tìm khuôn dấu và giữ người thợ có thể chứng minh nguồn gốc vũ khí giả.',
  summary:
    'Cuốn sổ cần một bằng chứng ngoài giấy. Xưởng rèn cung cấp nó, nhưng người thợ không chỉ là nhân chứng: ông từng nhận làm hàng rẻ để có cơm cho cả phường.',
  bridge:
    'Khuôn dấu, thép lỗi và lệnh nhận hàng nối được với bản ước gốc. Nhóm đã đủ căn cứ tới cửa thành, nơi quan trấn không thể tiếp tục nói mình không biết.',
  battles: [2, 5, 9, 13, 17, 20],
  decision: {
    at: 12,
    a: 'Cho phường rèn tự đứng tên bản khai.',
    b: 'Đứng tên thay họ để dễ giữ mọi lời khai thống nhất.',
    good: 'Thợ rèn tới thành với tư cách người chịu trách nhiệm, không phải người được nhóm nói hộ.',
    bad: 'Nhóm giữ được một lời khai gọn, nhưng phải trả lời vì sao người trực tiếp làm việc lại không được tự nói.'
  },
  scenes: `
Kiếm cong ở sạp đầu|Chiếc kiếm mua bằng công cả tháng cong ngay khi chạm cọc gỗ. Người bán đổ lỗi cho võ sinh, dù nhiều lưỡi khác có cùng vết nứt dưới dấu kiểm.|Bạn: Nếu kiếm nào cũng cần người mua có võ công đặc biệt mới thẳng, xưởng nên bán võ công trước.|Tìm người đóng dấu kiểm thay vì tranh cãi với người bán lẻ.
Đội thu hồi hàng lỗi|Người của Vạn Lợi kéo tới lấy mọi lưỡi kiếm nứt với cớ đổi mới. Nhóm giữ lại mẫu có số lô và ngăn họ dọa người mua xóa lời than phiền.|Thợ Bảy: Đổi hàng không cần đổi luôn trí nhớ người mua.|Bảo vệ mẫu thép và những người đã dùng nó.
Ông thợ không nhận khen|Thợ Bảy không nhận lời rằng mình bị ép hoàn toàn. Ông từng đồng ý giảm lượng thép tốt để giữ đơn hàng, rồi im lặng khi dấu quan được đóng lên hàng kém.|Thợ Bảy: Người ta trả ít không buộc ta phải làm dối. Phần ấy tôi nhận.|Ghi phần trách nhiệm của xưởng trước khi xin lời chứng chống thương hội.
Khuôn mẻ một nét|Đường Thập Nhị đối chiếu khuôn với dấu trên giấy giao hàng. Vết mẻ nằm cùng góc, chứng minh dấu kiểm hàng và dấu hợp đồng được làm từ một mẫu.|Đường Thập Nhị: Bánh răng lắp sai còn kêu. Người đóng dấu sai lại thường bắt người khác im.|Đánh dấu khuôn, giữ người có thể nhận diện nó.
Cửa lò bị canh|Đội giữ lò không cho đưa khuôn ra, vì nó thuộc tài sản thương hội. Nhóm mở cửa mà không xô người thợ tới gần bể thép đang chảy.|Bạn: Chúng ta cần cái khuôn nguội và người thợ sống. Đừng đổi cả hai lấy một trận đánh đẹp.|Giữ lò an toàn và đưa khuôn tới bàn kiểm công khai.
Lô thép bị rút ruột|Sổ xưởng cho thấy số thép tốt vẫn được nhận đủ, nhưng một nửa chuyển sang làm vũ khí riêng cho đội hộ vệ. Hàng lỗi được giao cho lính giữ đường và võ sinh mắc nợ.|Lão Tam: Người nghèo phải cầm kiếm dễ gãy để đi giữ phần kiếm tốt của người giàu.|Ghép số lô thép với tên người nhận trong sổ Hoa Lư.
Một người không biết chữ|Người thợ đóng dấu chỉ nhận ra hình khuôn, không đọc được lệnh đặt hàng. Nhóm nhờ ông chỉ trình tự công việc thay vì đọc lại lời người khác soạn sẵn.|Tiểu Muội: Không biết chữ không có nghĩa là không biết điều mình đã làm.|Để lời khai phản ánh đúng những gì người thợ thật sự biết.
Bản vẽ trong ống tre|Thợ Bảy giữ bản vẽ khuôn có ngày làm trước thời điểm sổ thu tô bị sửa. Ngày ấy khiến lời giải thích rằng dấu chỉ được thuê làm cho hội võ không còn đứng vững.|Bạn: Một ngày trên bản vẽ có thể nối cả chuyến thóc với lưỡi kiếm này.|Giữ bản vẽ cùng đơn đặt khuôn, không tách chúng thành hai món hàng rời.
Bọn đập lò giữa trưa|Một nhóm giả khách mua hàng gây gổ rồi đập xưởng để xóa mẫu. Nhóm giữ chúng ở sân, còn người phường rèn chuyển bản vẽ và khuôn qua cửa bên.|Thợ Bảy: Giữ tay họ khỏi bễ lò! Nếu lửa bùng, người trong xưởng không còn đường ra.|Ngăn phá xưởng, giữ hiện trường để người thành tới chứng kiến.
Giấy nhận của Đỗ Mậu|Lệnh nhận vũ khí có chữ quan trấn, nhưng phần chỉ định xưởng được thêm bằng mực khác. Đỗ Mậu có thể không chọn hàng lỗi, song đã ký nhận khi chưa kiểm đủ.|Bạn: Không cần bịa thêm tội để khiến việc ông ấy làm trở nên nặng. Nó đã đủ nặng với người cầm kiếm gãy.|Giữ ranh giới giữa điều đã chứng minh và điều còn phải hỏi.
Lương giữ trong hợp đồng|Người phường rèn không được nhận công nếu hàng bị xác định sai. Họ sợ đứng ra làm chứng đồng nghĩa tự cắt bữa ăn của gia đình.|Mộng Cô: Chúng ta muốn họ nói thật thì phải chừa cho họ một đời sống sau lời nói ấy.|Tìm người nhận bảo quản xưởng để thợ có thể đi điều trần.
Ai được đứng tên?|Nhóm có thể đứng tên bản khai chung hoặc để từng thợ ký phần việc của mình. Cách thứ hai nhiều chỗ khó hơn nhưng không khiến họ mất tiếng nói.|Thợ Bảy: Tôi làm ra lưỡi kiếm. Đừng để tới lúc nhận lỗi cũng chỉ được đứng phía sau người cầm nó.|Chọn cách trình bày trách nhiệm của cả phường rèn.
Chuyến xe mang khuôn|Đội hộ vệ chặn xe chở vật chứng, giả làm người kiểm an toàn đường. Nhóm giữ khuôn ngay trên xe có người dân niêm phong, không để bị đổi xe kín.|Đường Thập Nhị: Kiểm hàng mà bắt người biết hàng đứng xa thì kiểm bằng cách nào?|Giữ nguyên dấu niêm và chuỗi bàn giao vật chứng.
Cách nhận một khuôn thật|Đường Thập Nhị tạo bản in đối chứng trên đất sét, giữ cả vết mẻ lẫn vệt trượt tay. Những dấu nhỏ ấy giúp phát hiện nếu khuôn bị tráo trước buổi điều trần.|Bạn: Ta không cần bắt cả thành tin mình. Cần để ai muốn kiểm cũng có cách kiểm lại.|Chuẩn bị bản đối chứng cho người ngoài nhóm.
Thư xin rút lời khai|Người nhà một thợ mang thư xin rút vì bị dọa đốt nhà. Nhóm không ép ký tiếp, mà chuyển lời đe dọa thành việc cần bảo vệ cụ thể.|Tiểu Muội: Một chữ ký còn run không phải lời hứa để ta bắt người ấy trả bằng mạng.|Nhờ võ sinh Bình Định hộ tống người nhà trước ngày mở cửa thành.
Kẻ mua mọi mẫu thép|Đại diện Vạn Lợi đề nghị mua cả kho hàng lỗi với giá tốt. Thợ Bảy có thể trả lương ngay, nhưng số vật chứng khi ấy sẽ biến thành hàng đã bán hợp lệ.|Thợ Bảy: Tôi từng đổi chất lượng lấy đơn hàng. Không muốn đổi lời khai lấy tiền thêm lần nữa.|Giữ mẫu cần thiết, ghi rõ phần hàng thuộc quyền mưu sinh của thợ.
Cổng chợ bị phong|Đội cưỡng chế tới bắt người thợ đóng dấu, gọi ông là kẻ làm giả ấn quan. Nhóm bảo vệ người làm theo mẫu, đồng thời giữ quyền hỏi ai đã đặt mẫu đó.|Bạn: Bắt bàn tay khắc dấu không khiến người đưa bản vẽ biến mất khỏi câu chuyện.|Đưa thợ cùng đơn hàng qua vòng vây.
Giấy đi cùng người|Phường rèn chọn người kiểm hàng, người đóng dấu và người nhận thép cùng tới thành. Ba lời khai độc lập có thể sai chi tiết nhỏ nhưng gặp nhau ở việc chính.|Lão Tam: Người thật nhớ chuyện không giống nhau từng chữ. Giống quá mới nên xem ai đã chép hộ.|Giữ riêng từng bản khai để buổi đối chất có giá trị.
Một bộ đồ không mắc nợ|Thợ Bảy sửa trang bị của nhóm từ phần thép được kiểm đúng. Ông ghi đây là công bảo vệ xưởng, không buộc nhóm hứa nói nhẹ trách nhiệm cho mình.|Bạn: Ta nhận công của ông, không nhận quyền bớt đi phần sự thật ông phải kể.|Nhận trang bị, chuẩn bị lời chứng cho quan trấn.
Người mua sự im lặng|Đường dây vũ khí giả đưa đội hộ vệ tới lấy khuôn lần cuối. Sau trận, bạn chọn bảo vệ người thợ để họ làm chứng hay ép họ phục vụ riêng.|Thợ Bảy: Bảo vệ một người không nên biến người ấy thành món đồ thuộc về người bảo vệ.|Mang khuôn dấu và đoàn nhân chứng tới cửa thành Hoa Lư.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
