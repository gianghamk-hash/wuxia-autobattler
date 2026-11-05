export default {
  title: 'Đất giữ người trong U Minh',
  place: 'Rừng U Minh',
  goal: 'Tìm đoàn phu, kho thóc thật và giấy nhận lệnh của Đốc Lệ.',
  summary:
    'Bến không tên đưa nhóm vào rừng. Ở đây có người nộp thóc mà vẫn đói, lính giữ kho mà vẫn nợ và một trấn thủ vin vào cả hai để giữ quyền.',
  bridge:
    'Kho U Minh chứng minh thóc bị chuyển sang nuôi lực lượng riêng. Vé hội võ Bình Định cùng dấu Vạn Lợi chỉ ra nơi đường dây tìm người đánh thuê và hợp thức hóa giấy tờ.',
  battles: [2, 6, 10, 14, 18, 20],
  decision: {
    at: 12,
    a: 'Đưa người bệnh ra trước, chấp nhận mất dấu đoàn xe.',
    b: 'Bám đoàn xe trước, giao người bệnh cho trạm rừng.',
    good: 'Đoàn phu tự nguyện làm chứng; chậm một chuyến xe đổi lấy nhiều người chịu đứng cùng nhóm.',
    bad: 'Nhóm giữ được dấu xe nhưng phải trở lại giải thích với những người từng chờ mình giữa rừng.'
  },
  scenes: `
Nước đen không che dấu|Dưới bến rạch, vỏ bao thóc có ký hiệu Thanh Khê mắc trong rễ cây. Nhóm đã tới đúng đường đổi hàng, nhưng dấu bánh xe mới cho biết kho vừa chuyển chỗ.|Lão Tam: Rừng giấu người được, bao rách thì hơi khó giữ bí mật. Nhất là bao của người đói.|Lần theo bao rách tới trạm gác trong rừng.
Trạm thu phí thở|Lính trạm đòi cả thuốc của Tiểu Muội vì gọi đó là hàng có giá. Bạn mở lối cho người bệnh đang nằm chờ, không để túi thuốc trở thành tiền qua cửa.|Tiểu Muội: Nếu thở cũng phải nộp phí, các anh thu trước hay đợi người ta ngừng rồi mới tính?|Đẩy lùi đội thu phí và giữ trạm làm chỗ chữa thương.
Người biết dùng độc|Lý Độc Thủ tới trạm tìm dấu thuốc trộn trong nước uống của phu. Ông nhận ra chất làm chân tay tê chậm, khiến người bệnh bị ghi thành kẻ lười trả nợ.|Lý Độc Thủ: Độc tốt hay xấu không nằm ở tên chai. Nằm ở người bị giấu mất quyền biết mình uống gì.|Giữ mẫu nước và hỏi nguồn dược liệu dùng trong trạm.
Chiếc vòng của cha|Một người phu giữ vòng tay cha Tiểu Muội gửi lại. Ông được chuyển đi chữa thương sau khi phản đối việc đốt kho, chưa có ai xác nhận đã chết.|Tiểu Muội: Chưa biết không phải hy vọng chắc chắn. Nhưng nó là lý do để ta hỏi đúng người tiếp theo.|Tìm sổ chuyển người thay vì chạy theo lời đồn.
Bản lệnh của người gác cũ|Lão Tam nhận ra mẫu giấy ông từng thi hành. Dòng giãn nợ đã bị đè bằng lệnh áp giải, dưới cùng còn ô ký nhận mà ông nhớ mình chưa từng thấy.|Lão Tam: Hồi ấy ta chỉ nhìn chỗ có dấu đỏ. Hóa ra những chỗ không nhìn cũng có người phải chịu.|Giữ bản lệnh để xác định lúc nào chữ và dấu bị thay.
Cầu gỗ trong sương|Đốc Lệ cho đốt cầu phụ để cắt đường đưa người bệnh ra. Nhóm giữ đầu cầu còn lại, ngăn đội cầm dầu làm cả khu trạm mắc kẹt giữa lửa và nước.|Bạn: Đừng đuổi kẻ chạy vào rừng. Đằng sau ta còn người không thể tự chạy.|Bảo vệ đường rút và chuyển nhóm bệnh nặng qua trước.
Người bán mực xanh|Người bán dược thừa nhận đã chở nguyên liệu pha mực cho kho. Ông không biết chữ bị dùng sửa sổ, nhưng nhớ giao hàng cùng những tấm vé hội võ.|Lý Độc Thủ: Mực không gây tê tay. Nó khiến người có quyền giả vờ không biết tay mình đã làm gì.|Nối nguồn mực với tuyến vận chuyển người và thóc.
Bệnh không phải lười|Tiểu Muội ghi lại triệu chứng từng người, cùng thời điểm họ bắt đầu bị phạt vì chậm việc. Bản chữa bệnh trở thành bằng chứng rằng món nợ đã được tạo ra có chủ đích.|Người phu: Lần đầu có ai hỏi tôi đau ở đâu trước khi hỏi còn nợ bao nhiêu.|Lập danh sách người cần đưa khỏi rừng và người đủ sức làm chứng.
Tên cha trong sổ chuyển|Cha Tiểu Muội được ghi là đã chết, nhưng phiếu thuốc sau ngày ấy vẫn cấp cho cùng số người. Có người đang dùng tên người chết để giấu người còn sống.|Tiểu Muội: Ta không xé dòng này. Phải giữ nó cạnh phiếu thuốc để người viết không thể bảo ta nhớ nhầm.|Tìm lán riêng phía sau kho, nơi nhận những người đã bị xóa tên.
Kho không có thóc làng|Đội giữ lán cản nhóm khám kho trống. Bên trong không có thóc nhưng có người bị giấu, gồm cha Tiểu Muội và hai người từng làm chứng vụ cháy.|Bạn: Hôm nay chúng ta không tìm kho thóc. Chúng ta tìm người đã bị coi như đồ có thể chuyển kho.|Giải cứu người bị giam, giữ nguyên phiếu chuyển lán.
Cuộc gặp không thể vội|Cha Tiểu Muội còn mê sốt, chỉ kịp nhận tay con. Nàng muốn ở lại chăm nhưng cũng biết kho thóc sắp chuyển; nhóm không được biến nỗi riêng của nàng thành mệnh lệnh.|Tiểu Muội: Ta đi cứu người khác không phải để chứng minh mình ít thương cha. Xin đừng bắt ta chọn bằng câu ấy.|Sắp xếp người chăm sóc rồi cùng quyết định ưu tiên của cả đoàn.
Hai việc cùng cấp bách|Đoàn xe của Đốc Lệ chuẩn bị rời rừng đúng lúc nhóm bệnh nặng cần hộ tống. Lựa chọn nào cũng để lại một việc phải quay lại chịu trách nhiệm.|Lão Tam: Đi nhanh không tự thành đúng. Đi chậm cũng không tự thành tốt. Quan trọng là đừng quên mình bỏ lại ai.|Chọn cách phân bổ người và chấp nhận hệ quả trên chặng kế.
Khoản nợ của lính gác|Một lính trẻ đưa giấy vay bạc mua thuốc cho mẹ. Đốc Lệ giữ cả tiền công để khấu nợ, khiến những người cầm gậy cũng không dễ bỏ khỏi đường dây.|Bạn: Có người bị ép cầm gậy. Việc của ta là cho họ đường hạ gậy, không gọi mọi cú đánh là vô tội.|Mời người chịu hạ vũ khí giao giấy nợ làm bằng chứng.
Đêm mở kho chính|Đám thân tín không chịu hạ vũ khí canh kho thật. Nhóm phải mở cửa mà không đốt bao thóc; thứ bên trong vừa là vật chứng vừa là bữa ăn của những người đang chờ.|Lão Tam: Đốt kho thắng trận thì dễ. Ngày mai lấy gì thắng cơn đói mới khó.|Giữ nguyên kho, hạ đội giữ cửa và kiểm đếm trước nhân chứng.
Thóc nuôi người nào?|Trong kho có bảng chia phần cho hội võ Bình Định. Thóc bị lấy ở làng không chỉ để bán; một phần nuôi đội người được tuyển làm hộ vệ riêng cho Vạn Lợi.|Bạn: Tiền mua người cầm kiếm được trả bằng cơm người không có kiếm. Vậy ai đứng sau cần cả hai cùng sợ nhau.|Ghi tuyến chia thóc và giữ vé tuyển hộ vệ đi kèm.
Đốc Lệ xin thương lượng|Trấn thủ nhận mình làm sai nhưng đòi đổi giấy nhận lệnh lấy quyền mang gia đình đi. Bạn chưa thể nhận lời khi người bị giam còn chưa biết ai chịu trách nhiệm.|Đốc Lệ: Ta không phải người viết kế hoạch. Bạn: Nhưng ông đã chọn cách khiến nó chạy được.|Yêu cầu giao người và giấy trước khi nói chuyện xử lý ông ta.
Lời kể của người phu|Cha Tiểu Muội tỉnh lại, xác nhận thấy người của Vạn Lợi giám sát vụ cháy. Ông không biết tên chủ mưu nhưng nhớ con dấu có chữ Lợi bị mẻ một nét.|Cha Tiểu Muội: Đừng chỉ đem ta về. Hãy đem cả chuyện này ra khỏi rừng.|Gắn lời chứng với mẫu dấu giả đã giữ từ bến Liễu.
Đường rút của thân tín|Nhóm thân tín cướp giấy của Đốc Lệ để xóa liên hệ với Vạn Lợi. Nhóm chặn chúng ở lối gỗ, còn những lính đã đầu hàng giữ người bệnh phía sau.|Bạn: Ai đã hạ gậy thì hôm nay có thể dùng chính đôi tay ấy mở đường cho người khác.|Giữ lại giấy nhận lệnh, ngăn việc thủ tiêu cả trấn thủ lẫn nhân chứng.
Người ở lại giữ kho|Người phu bầu người trông kho tạm, ghi rõ thóc đã phát cứu đói và thóc giữ làm chứng. Nhóm để lại bản chép thay vì tự nhận quyền chia mọi thứ.|Bà cụ giữ kho: Các cậu cứu được cửa. Chìa nên để người sẽ ở lại mở mỗi sáng.|Giao trách nhiệm cho cộng đồng trước khi rời U Minh.
Món nợ của Đốc Lệ|Đốc Lệ cùng đội hộ vệ cuối chặn lối, vì biết giấy thật đã khiến đường mua chuộc không còn kín. Thắng ông ta không thay cho quyết định sẽ làm gì với người bị bắt.|Bạn: Ta cần ông sống để trả lời những người trong kho. Nhưng tha mạng không đồng nghĩa trả lại chức.|Hạ trấn thủ, chọn xử lý người bị ép theo hắn và lên đường tới hội võ.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
