export default {
  title: 'Ba dấu trên một lời gian',
  place: 'Kho sổ Hoa Lư',
  goal: 'Tìm bản ước gốc và chứng minh ai đã sửa nó sau khi ký.',
  summary:
    'Thắng hội mới mở được cửa ngoài. Trong kho Hoa Lư, nhóm phát hiện việc chiếm ruộng được bọc bằng giấy công và một lời gian chỉ tồn tại khi các bản sổ bị giữ xa nhau.',
  bridge:
    'Sổ gốc cho thấy mực và dấu chưa đủ: khuôn dấu cùng giấy cấp vũ khí ở chợ rèn mới chứng minh Trịnh Nghiêm kiểm soát việc sửa cả lệnh dân lẫn lệnh quân.',
  battles: [4, 8, 12, 16, 19, 20],
  decision: {
    at: 10,
    a: 'Chép cả phần bất lợi cho người đã giúp mình.',
    b: 'Chỉ lấy những trang đủ buộc tội Vạn Lợi.',
    good: 'Bản chứng giữ nguyên đầu đuôi, kể cả trách nhiệm của người cùng phe.',
    bad: 'Những trang không được lấy sẽ trở thành câu hỏi mà nhóm chưa thể trả lời công khai.'
  },
  scenes: `
Cửa mở bằng thẻ thắng|Người giữ kho kiểm thẻ hội võ, rồi chỉ cho nhóm đọc bản chép thay vì sổ gốc. Quyền điều trần chưa đồng nghĩa quyền biết toàn bộ sự việc.|Bạn: Ta đã đi đủ đường để biết bản chép có thể sạch hơn chuyện nó kể.|Yêu cầu biên bản ghi rõ những tập sổ bị từ chối cho xem.
Ba chìa ba người giữ|Kho chia chìa cho quan trấn, thương hội và người kiểm thóc. Chỉ cần một người vắng mặt, việc mở sổ sẽ bị gọi là trái phép.|Lão Tam: Khi cả ba cùng ăn cơm thì dễ đủ mặt. Đến lúc chịu trách nhiệm mới khó gọi nhau.|Tìm cách mời đủ người trước nhân chứng.
Trang bị xé đúng chỗ|Vũ Bình gửi bản ghi số trang, giúp nhận ra tập trước mặt thiếu phần cuối của từng tháng. Những trang ấy đều ghi khoản chuyển thóc thành bạc.|Tiểu Muội: Tờ giấy mất không phải khoảng trống. Nó cũng là một dấu vết, nếu ta biết đáng lẽ nó ở đâu.|Lập danh mục trang thiếu trước khi có ai bảo sổ vốn như vậy.
Lệnh bắt không ghi tội|Đội giữ kho đem lệnh tạm giữ nhóm vì làm rối công vụ. Lệnh không ghi việc sai nào, chỉ có dấu Vạn Lợi ở chỗ dành cho người làm chứng.|Bạn: Người bị hỏi không thể tự đóng dấu thay cả người chứng lẫn người xét.|Giữ lối ra, không để nhân chứng bị tách vào các phòng riêng.
Người gác kho nhớ số|Một thư lại già nhớ số bao thóc được đổi mỗi lần kiểm kê. Ông không dám chỉ tên thủ phạm nhưng đưa thẻ đếm bằng tre còn nguyên vết khắc.|Thư lại: Chữ có thể chép lại. Cây tre này giữ từng lần tay ta đếm.|Đối chiếu thẻ đếm với bảng nhận thóc từ U Minh.
Mảnh giấy trong gáy sổ|Nếp gấp từ quán Rồng Lửa khớp phần giấy người thư lại giấu. Hai mảnh không ghi võ công; chúng ghi quyền thu tô và quyền giữ người để khấu nợ.|Bạn: Từ đầu đến giờ, cả giang hồ đánh nhau để giữ quyền được ghi người khác còn nợ.|Đặt hai phần trước nhân chứng để xác nhận cùng một bản ước.
Ruộng thành vật bảo đảm|Bản ước ban đầu chỉ cho tạm ứng thóc mùa đói. Điều khoản dùng ruộng trả thay được thêm vào sau dấu quan trấn, bằng đúng loại mực xanh nhóm đã giữ.|Lão Tam: Người vay một bữa ăn không thể tự nhiên bán cả chỗ sẽ trồng bữa ăn năm sau.|Tìm người biết thời điểm điều khoản mới xuất hiện.
Cầu thang xuống hầm giấy|Đám thân tín giấu sổ gốc dưới hầm, rồi chặn cầu thang để chờ đốt. Bạn phải mở lối đủ nhanh, đồng thời giữ người thư lại khỏi bị lấy làm con tin.|Tiểu Muội: Cứu người giữ sổ trước. Người còn sống mới biết những tờ nào đã bị tráo.|Hạ đội chặn hầm, cứu thư lại cùng các hòm giấy.
Chữ ký của Đỗ Mậu|Quan trấn Đỗ Mậu có chữ ký trên bản ước gốc. Nét sửa tới sau không xóa được việc ông đã cho thương hội quyền thu trước khi hỏi dân có đồng ý hay không.|Bạn: Có thể ông không viết dòng lấy ruộng. Nhưng ông phải trả lời vì sao trao chìa cho người muốn viết.|Giữ cả trách nhiệm ban đầu, không để vụ sửa sổ che hết những việc trước đó.
Trang khó đem đi|Vài trang ghi người từng giúp nhóm cũng hưởng phần chi. Lão Tam lo công bố sẽ làm mất đồng minh; Tiểu Muội hỏi nhóm còn muốn làm chứng hay chỉ muốn thắng.|Bạn: Nếu chọn trang theo người mình thích, ta đang sửa sổ theo một cách khác.|Quyết định phạm vi bằng chứng đem ra điều trần.
Thợ giấy nhớ khuôn|Giấy ở phần sửa có sợi đay từ cùng một xưởng, nhưng dấu chìm được ép bằng khuôn đặt ở chợ rèn. Bằng chứng bắt đầu chuyển từ lời kể sang đồ vật có thể đối chiếu.|Thợ giấy: Giấy chịu được mực nào cũng phải có người làm. Đừng tưởng vật không biết nói thì không có người nhớ nó.|Tìm đơn đặt khuôn và nơi nhận hàng.
Hòm sổ lên xe khác|Đội áp tải cố chuyển những hòm còn lại ra khỏi kho dưới danh nghĩa chống cháy. Nhóm chặn xe tại sân để mọi hòm được mở trước người kiểm thóc.|Lão Tam: Chống cháy bằng cách giấu hết người biết số hòm là cách mới, ta chưa thấy trong sách.|Giữ chuỗi bàn giao, không nhận các hòm đã bị mở kín từ trước.
Không chỉ tiền cờ bạc|Những khoản mang tên vay riêng được cộng vào quân lương. Tiền nợ của võ sinh, tiền thuốc của phu và tô thuế của dân đang nuôi cùng một đội hộ vệ.|Bạn: Không có ba vụ việc riêng. Có một cách khiến người ta mắc nợ rồi dùng họ để giữ người mắc nợ khác.|Ghép ba danh sách và tìm những cái tên xuất hiện lặp lại.
Lá thư của Trịnh Nghiêm|Thư thương hội dặn giữ sổ gốc tới lễ phong minh chủ, rồi đổi sang sổ mới. Nếu việc đổi thành công, các bản chép người dân giữ sẽ bị gọi là giấy giả.|Tiểu Muội: Chúng ta cần đưa sự thật ra trước khi người ta đổi cả cách gọi nó.|Ấn định thời hạn điều trần, không tiếp tục chạy theo từng kho lẻ.
Bản sao không phải bản bỏ|Nhóm tạo ba bản có người đối chiếu ký từng trang. Một gửi Thanh Khê, một gửi võ sinh Bình Định, bản gốc đi với đoàn nhân chứng tới thành.|Bạn: Không phải đem hết giấy về một chỗ mới gọi là chắc. Chắc là mất một chỗ vẫn còn người kiểm lại được.|Phân tán bản sao mà vẫn giữ cách nhận biết chúng khớp nhau.
Lối ra bị đóng dấu|Đội giữ cửa chỉ cho người đi ra, đòi giữ mọi giấy có dấu công. Nhóm bảo vệ người mang bản đối chiếu, buộc họ mở đường mà không xé sổ để giấu.|Vũ Bình: Ngày xưa tôi mang được giấy ra bằng cách im lặng. Hôm nay cần có người nhìn thấy việc ấy.|Giữ nguyên vật chứng qua cửa kho.
Lời mời từ quan trấn|Đỗ Mậu gửi lời gặp riêng, hứa giải thích phần chữ ký của mình. Nhóm đồng ý nghe nhưng yêu cầu có người chép và người làm chứng độc lập.|Bạn: Một cuộc nói chuyện kín có thể mở đầu sự thật. Nó không được thay thế buổi nói công khai.|Chuẩn bị điều kiện gặp quan trấn, không giao sổ lấy một lời hứa.
Khuôn dấu đi trước sổ|Người thợ giấy báo khuôn dấu đang được chuyển tới xưởng vũ khí. Trịnh Nghiêm muốn khiến lệnh tuyển hộ vệ và lệnh thu tô trông như cùng từ nha quan.|Lão Tam: Chỉ đổi một cái khuôn mà đổi được cả người bị bắt lẫn người đi bắt. Nghề này ăn gian hơn trộm gà.|Gửi người theo dõi xưởng rèn trước khi lộ việc đã biết.
Người truy sổ lần cuối|Đội áp tải quay lại để lấy người thư lại, không còn quan tâm hòm giấy rỗng. Nhóm hiểu lời chứng về thứ tự đóng dấu mới là thứ chúng chưa thể làm giả.|Tiểu Muội: Họ đuổi theo người nhớ chuyện, nghĩa là những gì ông nhớ đang khiến họ sợ.|Đưa thư lại về cùng đoàn nhân chứng và giữ ông qua đợt truy bắt.
Bí kíp của những khoản nợ|Đội trưởng kho gom người cản bản gốc rời đi. Sau trận, bạn phải chọn công khai sổ để trả ruộng hay giữ nó như con bài ép cả quan lẫn thương hội.|Bạn: Cuốn này không dạy một chiêu nào. Nhưng người cầm nó có thể quyết định ai được ăn và ai phải đánh nhau.|Mang bản gốc tới chợ rèn để hoàn chỉnh chứng cứ trước buổi điều trần.
`
    .trim()
    .split('\n')
    .map((line) => line.split('|'))
};
