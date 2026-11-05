export default {
  title: 'Sau tiếng trống là đời người',
  place: 'Hoa Lư và Thanh Khê',
  goal: 'Giải quyết hậu quả của chiến thắng trước khi chọn cách sống cùng quyền lực.',
  summary:
    'Trịnh Nghiêm đã bị giữ nhưng thóc chưa tự về ruộng, công chưa tự tới người lính. Chương cuối trả lời các lời hứa đầu game và buộc bạn nhìn cách mình dùng chiếc ấn vừa giành được.',
  bridge:
    'Bát cơm được giữ từ đêm đầu đã có người trở lại ngồi cùng. Phần cuối không hỏi bạn đã thắng ai, mà hỏi những người quanh bạn sẽ sống dưới lựa chọn của bạn thế nào.',
  battles: [4, 9, 14, 18],
  decision: {
    at: 10,
    a: 'Để người chịu thiệt cùng kiểm việc trả lại tài sản.',
    b: 'Giữ quyền kiểm và chia trong một nhóm nhỏ do mình chọn.',
    good: 'Việc sửa oan chậm và nhiều tranh cãi, nhưng người bị hại còn quyền hỏi ngày mai.',
    bad: 'Việc chia trả nhanh hơn, nhưng người ngoài nhóm phải bắt đầu xin lại chính quyền được hỏi.'
  },
  scenes: `
Người xuống núi sau cùng|Nhóm kiểm đủ người trước khi đưa ấn về thành. Những người mất tích được ghi riêng để còn tìm, không gộp vào câu đã cứu được tất cả.|Tiểu Muội: Thắng trận làm ta dễ muốn nói một câu thật đẹp. Người còn thiếu tên cần câu chính xác hơn.|Bàn giao danh sách người sống, người bị thương và người vẫn phải tìm.
Bản tin tới trước ấn|Những bản chứng gửi sớm giúp dân thành biết chuyện trước khi đoàn về. Không ai có thể nhận chiến thắng riêng bằng cách cầm ấn bước vào cửa đầu tiên.|Bạn: Tới được đây là nhờ nhiều người giữ từng phần. Kể lại cũng phải giữ được điều ấy.|Xác nhận người đang chịu trách nhiệm tạm thời ở các kho và cửa thành.
Công của người cầm gậy|Lính giữ thành xin nhận công còn thiếu. Có người từng áp giải phu; khoản công hợp lệ không xóa phần họ phải đối chất, nhưng không trả cũng khiến họ tìm người mua lòng mới.|Lão Tam: Nợ công và nợ trách nhiệm là hai cuốn sổ. Đừng xé một cuốn để khỏi phải mở cuốn kia.|Tách chi trả đã kiểm khỏi việc xét sai phạm của từng người.
Nhóm cướp kho sau lễ|Một nhóm nhân lúc đổi người giữ ấn xông vào kho gọi là lấy lại của dân. Nhóm ngăn cướp, vì bao thóc không thể tự biết ai đã mất phần nào.|Bạn: Người hô thay dân không được tự nhận mình là mọi người dân.|Giữ kho chung, chặn việc thắng lợi biến thành cớ lấy của không cần giải thích.
Đỗ Mậu trước chiếc ghế trống|Quan trấn bỏ ghế chủ tọa để người kiểm sổ tiếp tục hỏi. Nhóm không tuyên ông đã trở thành người tốt chỉ vì một lần hợp tác sau khi hết đường chối.|Đỗ Mậu: Ta không xin việc giúp các người hôm nay xóa điều đã ký hôm trước.|Ghi quá trình xử lý tiếp, không coi lời nhận lỗi là kết thúc tất cả.
Ngày trả ruộng đầu tiên|Bà Tư nhận lại giấy tạm dừng chuyển ruộng, chưa nhận ngay mùa lúa đã mất. Bà xin giống cho vụ sau thay vì tấm biển ca ngợi người đã cứu làng.|Bà Tư: Tên người giúp tôi nhớ được. Hạt giống thì đất mới nhớ hộ được.|Đưa nhu cầu làm lại cuộc sống vào kế hoạch trả tài sản.
Người thợ nhận phần việc còn lại|Thợ Bảy sửa vũ khí lỗi theo danh sách đã kiểm, nhận trả công đúng cho người làm. Nhóm không ép xưởng làm miễn phí vô hạn dưới danh nghĩa chuộc lỗi.|Thợ Bảy: Tôi chịu sửa điều đã làm sai. Cũng cần người trẻ trong xưởng có phần công để còn làm đúng lâu dài.|Đặt giới hạn trách nhiệm cụ thể để việc bồi hoàn có thể hoàn tất.
Lời mời giữ ấn|Một nhóm thương nhân đề nghị bạn đứng đầu để quyết định nhanh. Điều họ xin đổi lại là quyền ưu tiên nhận các hợp đồng mới mà không cần công bố.|Bạn: Cách cũ trở lại nhanh hơn ta tưởng. Nó chỉ thay tên người nhận lời đề nghị.|Giữ lời mời làm một phần cần được công khai trước buổi bàn giao.
Đội đòi lại giấy nợ|Thân tín cũ của Vạn Lợi tấn công nơi giữ giấy vay, hy vọng còn khống chế được võ sinh và người phu. Nhóm giữ người đến nhận bản sao, không đốt hồ sơ để giải quyết cho nhanh.|Kha Vân: Cần biết món nào phải trả, món nào được dựng lên. Đốt hết chỉ khiến người giữ bản kín mạnh hơn.|Bảo vệ hồ sơ và quyền của người mang nợ được kiểm lại.
Ai kiểm người chia trả?|Các hộ muốn được tự xem danh mục trả ruộng; một nhóm nhỏ muốn gộp quyền kiểm để tránh tranh cãi. Bạn phải chọn việc người khác có được hỏi mình hay không.|Tiểu Muội: Chúng ta đã đi từ cửa bị đóng tới đây. Xin đừng chỉ đổi người được đứng phía trong.|Chọn cách giám sát việc sửa oan sau chiến thắng.
Cha trở về bến nước|Cha Tiểu Muội nhận lại tên trong sổ người sống, có người làm chứng việc từng bị ghi chết. Nàng có thể đi tiếp mà không phải giữ cả lời chứng ấy bằng một mình trí nhớ.|Cha Tiểu Muội: Con đi đâu cũng được. Đừng để việc ta còn sống trở thành gánh con phải mang mỗi ngày.|Khép đầu mối người cha mất tích bằng một việc được ghi nhận rõ ràng.
Bé Na giữ chỗ trong quán|Vũ Bình trở về Rồng Lửa. Bé Na đặt bát phía trong như đã dặn từ đêm đầu; ông nói với con cả phần mình làm sai thay vì chỉ kể ai đã cứu cha.|Vũ Bình: Cha có lỗi phải trả. Có nơi trở về giúp cha không cần trốn phần lỗi ấy nữa.|Giữ lời hứa đầu tiên và để gia đình tự có cuộc nói chuyện của họ.
Lão Tam trước cửa làng|Lão Tam đứng nhận câu hỏi của các hộ từng bị ông áp giải. Có người chưa chịu tha thứ; nhóm không ép họ chấp nhận vì ông đã giúp nhiều việc về sau.|Lão Tam: Ta không tới xin mọi người nói đỡ. Ta tới để lần này không phải hỏi một cánh cửa đóng.|Cho việc sửa sai tiếp tục mà không đòi nạn nhân kết thúc đúng lúc mình muốn.
Chuyến cứu người còn thiếu|Một toán áp giải cuối tìm đường bán người phu chưa được ghi trong danh sách cứu. Nhóm mở lối đưa họ về, chứng minh danh mục bỏ sót ở đầu chương là việc phải làm chứ không phải câu ghi cho đủ.|Tiểu Muội: Người tới muộn vẫn cần được cứu như người đã có tên từ đầu.|Đưa những người bị bỏ sót tới trạm nhận người của thành.
Một quán nhỏ có thể đủ|Quán chủ mời nhóm nghỉ, không đòi họ ở lại để quán mang tiếng có đại hiệp. Lão Tam đã tính chỗ bán bún đậu; Tiểu Muội muốn một gian chữa bệnh có cửa ai cũng được gõ.|Bạn: Rời giang hồ không nhất thiết là quay lưng. Có khi là chọn đúng một chỗ để giữ lời lâu hơn.|Cân nhắc con đường ẩn dật như một lựa chọn sống, không phải phần thưởng hạng thấp.
Người tù còn muốn ra giá|Trịnh Nghiêm xin đổi mạng lưới thương lộ lấy quyền giữ tài sản. Bạn nhận ra giữ ông ta sống không buộc phải tiếp nhận cách ông ta điều khiển mọi người.|Trịnh Nghiêm: Không có ta, ai biết đường tiền đi? Bạn: Những người từng phải làm ra nó biết nhiều hơn ông tưởng.|Giữ phần lời khai cần thiết, không coi việc sử dụng mạng lưới là lý do miễn trách nhiệm.
Bốn chiếc ghế trong sân|Buổi bàn giao đặt bốn phương án rõ: hội nghĩa hiệp được dân kiểm, quyền chúa đất giữ sổ nợ, một đời sống rời quyền lực hoặc chính quyền mới nhận ấn cùng trách nhiệm.|Lão Tam: Có ghế cao, có ghế thấp. Ngồi ghế nào cũng đừng kê chân lên người khác.|Đọc lại những lựa chọn đã lưu trước khi quyết định đời sống tiếp theo.
Đêm kẻ cướp ấn trở lại|Đội thân tín còn sót muốn cướp ấn để dựng một người khác thay Trịnh Nghiêm. Nhóm giữ ấn trước nhân chứng, không dùng hiểm nguy làm cớ tuyên mình được nắm quyền mãi.|Bạn: Bảo vệ một chiếc ấn qua đêm không khiến nó tự trở thành đồ của người cầm kiếm giỏi nhất.|Đánh bại đội cướp ấn và giữ buổi bàn giao có thể diễn ra.
Buổi sáng không còn người nói hộ|Mỗi người được nghe dự định của bạn, kể cả người không muốn ở lại cùng. Không con đường nào được kể như thể mọi người đều đồng ý; những gì đã chọn vẫn có trong nhật ký.|Tiểu Muội: Quyết định có thể là của huynh. Đời sống sau nó còn có phần của những người khác.|Chuẩn bị lựa chọn cuối với điều kiện và cái giá được nói rõ.
Bữa cơm sau tiếng trống|Cuốn sổ, chiếc ấn và bát cơm của đêm đầu cùng nằm trong ký ức nhóm. Bạn chọn chính đạo, tà đạo, ẩn dật hay xưng vương sau khi đã thấy người thật sống ra sao dưới từng cách giữ quyền.|Bạn: Đi hết đường mới hiểu kết cục không phải danh xưng mình nhận. Là ngày mai người khác có thể sống thế nào bên lựa chọn ấy.|Chọn một trong bốn kết cục và khép hành trình đã đi cùng nhau.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
