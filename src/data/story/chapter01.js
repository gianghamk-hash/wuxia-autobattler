export default {
  title: 'Lửa dưới mái quán',
  place: 'Thanh Khê',
  goal: 'Giữ cuốn sổ và tìm người đã gửi nó vào quán trọ.',
  summary:
    'Một cuốn sổ bị bỏ lại khiến quán trọ Rồng Lửa thành mục tiêu của đội thu tô. Bạn chưa phải đại hiệp; người cần giữ trước tiên là những người vẫn ăn cơm cùng mình.',
  bridge:
    'Tên Vũ Bình cùng dấu mực xanh dẫn về bến nước. Muốn đưa bằng chứng ra khỏi làng, bạn cần người biết đường và người biết cứu thương.',
  battles: [1, 5, 9, 14, 18, 20],
  decision: {
    at: 6,
    a: 'Nhờ dân làng cùng giữ bản chép.',
    b: 'Giấu cả bản chép, chỉ tin vào mình.',
    good: 'Bà Tư giữ lời: một nhà bị lục thì cả xóm vẫn còn bản khác.',
    bad: 'Không ai biết bạn giữ gì; sự im lặng giúp giấu sổ nhưng làm lời cầu cứu khó được tin.'
  },
  scenes: `
Bàn cơm bị hất đổ|Đội thu tô xông vào Rồng Lửa lúc nồi cơm vừa chín. Quán chủ bị đẩy ngã vì che cho một khách lạ; cuốn sổ người ấy gửi đang nằm dưới tay bạn.|Quán chủ: Đánh thì đánh ngoài sân. Trong này còn người già và trẻ nhỏ.|Chặn nhóm tay sai, đưa người trong quán ra cửa sau.
Người khách không trở lại|Sau cuộc xô xát, người gửi sổ đã biến mất. Trên chiếc ghế còn ướt có một mảnh giấy ghi tên Vũ Bình và hình con thuyền ba mái.|Bạn: Khách đi quên tiền thì ta quen rồi. Đi quên cả mạng người sau lưng thì chưa.|Giữ mảnh giấy, hỏi những người đã thấy khách vào quán.
Bát cơm của Bà Tư|Bà Tư nhận ra nét chữ của người chép tô thuế. Bà đã nộp đủ thóc nhưng vẫn bị ghi thiếu; chiếc bát bà cầm là món cuối chưa đem cầm cố.|Bà Tư: Nếu sổ nói ta còn nợ, sao chẳng ai chịu đọc tờ biên nhận ta giữ?|Đặt biên nhận cạnh cuốn sổ để đối chiếu.
Hai nét mực khác màu|Trong sổ, số thóc viết bằng mực đen đã bị sửa bằng mực xanh. Bạn chưa thể kết luận ai sửa; chỉ biết dấu sửa trùng chỗ tên những hộ mất ruộng.|Bạn: Chữ xấu có thể do run tay. Sửa đúng phần người nghèo thì khó đổ cho tay được.|Tìm người bán loại mực xanh, không vội công bố điều chưa chắc.
Ngõ sau bị khóa|Kẻ thu tô quay lại chặn ngõ, đòi bắt quán chủ thay cho khách. Bạn phải mở một lối qua đống xe kéo trước khi họ lục được bếp giấu sổ.|Quán chủ: Ta giữ mái quán, con giữ người. Đừng đổi thứ tự ấy.|Đẩy lui đội chặn ngõ, đưa Bà Tư tới nhà hàng xóm.
Ai giữ bản chép?|Bà Tư xin chép tên các hộ bị sửa số. Quán chủ sợ liên lụy cả xóm; nếu chỉ một người giữ, người ấy bị bắt thì mọi lời nói cũng biến mất.|Bà Tư: Một cây chẳng nên non. Nhưng ba cây chụm lại thì quan cũng dễ nhìn thấy hơn.|Quyết định có chia việc giữ bằng chứng cho dân làng hay không.
Dấu chân bên chum nước|Một vết giày dính mực xuất hiện cạnh chum nơi khách đã rửa tay. Bé Na, đứa trẻ phụ bếp, nhớ người ấy hỏi đường đến bến có cây gạo.|Bé Na: Chú ấy bảo nếu không về, nhớ cho cha cháu biết cháu vẫn ăn đủ bữa.|Tìm hiểu vì sao đứa trẻ lại biết người khách.
Tên cha trên giấy gói|Bé Na đưa giấy gói bánh có dòng chữ Vũ Bình. Người khách là cha em, người vừa chạy khỏi nha thu tô sau khi bị buộc sửa sổ lần nữa.|Bạn: Vậy thứ chúng đòi không chỉ là giấy. Chúng còn muốn không ai được kể việc đã xảy ra.|Giữ kín nơi Bé Na trú, hỏi lối cha em đã đi.
Qua sân đình|Một đội lính rẽ vào sân đình để tìm đứa trẻ. Bạn dẫn chúng ra khỏi chỗ trú, dùng khoảng sân rộng thay cho con ngõ có dân đang mắc kẹt.|Lão Tam: Đánh nhau cũng phải chọn chỗ. Đổ vỡ ít thì lát nữa đỡ phải đền.|Giữ chân đội truy bắt để quán chủ chuyển Bé Na đi.
Người ăn mày nhớ đường|Lão Tam từng theo các chuyến thóc qua bến Liễu. Ông nhận ra ký hiệu ba mái trên giấy, nhưng đổi giọng khi bạn nhắc tới nha thu tô.|Lão Tam: Đường ấy ta biết. Có những chuyện biết quá rõ lại khó mở miệng.|Nhận sự chỉ đường, chưa ép ông kể chuyện cũ.
Cánh cửa đóng trước gió|Nhà trưởng xóm đóng cửa khi nghe bạn giữ sổ. Bên trong, tiếng trẻ ho và biên nhận thu tô cho biết họ cũng đang bị ép, không phải vô cớ thờ ơ.|Bạn: Ta cần một chỗ nói chuyện, không cần thêm một người để đổ tội.|Hỏi điều gì khiến trưởng xóm sợ phải đứng ra làm chứng.
Tờ giấy mua ruộng|Trưởng xóm đưa giấy chuyển nhượng có chữ ký của những người không biết chữ. Ông đã xác nhận dấu tay vì nghĩ đó chỉ là giấy giãn nợ.|Trưởng xóm: Ta tưởng giúp họ chậm đóng thóc. Hóa ra giúp người khác lấy ruộng họ nhanh hơn.|Giữ lời khai cùng giấy gốc, để ông tự nói rõ phần trách nhiệm.
Kho thóc không có khóa cũ|Ổ khóa kho chung đã bị thay từ ba hôm trước, đúng ngày sổ bị sửa. Người giữ kho còn chiếc chìa cũ nhưng bị dọa bắt con nếu mở miệng.|Bạn: Chìa không mở nổi khóa mới, nhưng ngày thay khóa vẫn mở được một chuyện cũ.|Ghi lại thời điểm và tìm người mang khóa tới.
Xe thóc giữa đêm|Đoàn xe định rời làng trước sáng, mang theo thóc đã thu lần hai. Bạn chặn đoàn ở cầu nhỏ để người đánh xe có cơ hội rời khỏi tay đội áp tải.|Người đánh xe: Chúng tôi chở thuê. Xin đừng coi cả người cầm roi lẫn người kéo xe là một.|Hạ đội áp tải, giữ nguyên người và niêm phong xe làm chứng.
Một người chứng không đủ|Trên xe có phiếu xuất kho, nhưng chữ ký người giữ kho chưa đủ chứng minh ai ra lệnh. Quán chủ đề nghị gom lời kể thay vì chỉ giữ một vật rồi trông chờ phép màu.|Quán chủ: Sổ có thể bị đốt. Ba người kể trùng một việc thì khó đốt cùng một lúc.|Nối phiếu xuất kho, ngày đổi khóa và hai bản biên nhận.
Đường dây qua ba bến|Phiếu xe ghi thóc đi qua bến Liễu, rừng U Minh rồi tới hội võ Bình Định. Lão Tam nói đây không phải đường nộp tô thường dùng.|Lão Tam: Quan có thể đi đường vòng. Thóc thì không tự rẽ vào hội võ để xem đánh nhau.|Đánh dấu ba chặng trên bản đồ để lần theo từng bước.
Lời hứa với Bé Na|Bé Na không xin bạn giết ai, chỉ muốn cha trở về ăn bữa cơm đã nguội. Bạn nhận ra mang sổ đi cũng có nghĩa phải đưa người chép sổ về.|Bé Na: Bát cha cháu để phía trong nhé. Ngoài hiên gió tạt, cha hay nhường chỗ ấy cho khách.|Hứa tìm Vũ Bình, giao việc bảo vệ đứa trẻ cho quán chủ.
Lửa ở mái rơm|Đội thu tô đốt đống rơm cạnh quán để ép mọi người chạy ra. Bạn vừa chống đám cầm đuốc vừa mở đường cho dân chuyền nước, không đuổi theo người đã bỏ vũ khí.|Bà Tư: Cứu mái trước! Mái còn thì người đi xa mới có chỗ quay về.|Dập mối đe dọa, cứu kho giấy khỏi ngọn lửa.
Phần sổ phải mang theo|Quán chủ giữ lại các bản chép và một nửa phiếu xe, giao bạn giấy gốc cùng lời chứng. Nếu bị bắt dọc đường, ở Thanh Khê vẫn còn người biết sự thật.|Bạn: Con không đi tìm danh đại hiệp. Con đi để bữa cơm này không phải bữa cuối mọi người được ngồi yên.|Chuẩn bị rời làng, báo trước cho người ở lại cách nhận tin.
Cửa làng lúc bình minh|Đội trưởng truy thu chặn cổng, đòi sổ để đổi lấy lời hứa tha quán. Sau những lần thất hứa trong đêm, dân làng đứng phía sau bạn thay cho một tờ cam kết.|Đội trưởng: Ra khỏi đây, các người sẽ không còn ai che chở. Bạn: Vậy chúng tôi phải học cách che chở nhau.|Vượt cửa làng, đi tới bến nước tìm người cùng đường.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
