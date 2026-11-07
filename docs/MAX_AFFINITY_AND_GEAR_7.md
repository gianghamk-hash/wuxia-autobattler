# Duyên phận tối đa, ảnh và trang bị

Thợ giấy đã có atlas 1536×1024 gồm sáu tư thế: đứng, bước đi, trò chuyện, giúp đỡ, ngạc nhiên và nghỉ. Cả 115 khóa nhân vật đăng ký đều trỏ tới atlas, không còn dùng chuyển động chân dung. Sáu tên NPC cũ vẫn dùng atlas được tạo từ cùng chân dung gốc như trước. Các nhân vật không chiến đấu giữ tư thế dân sự, không được gán kỹ năng đánh nhau. 166 cấu hình hiệu ứng kỹ năng hiện có vẫn được kiểm tra bằng ảnh thật.

Mỗi đồng đội có một hiệu quả riêng khi duyên phận đạt 100/100. Cả 60 hiệu quả khác nhau về điều kiện và tổ hợp tác dụng, không chỉ đổi tên hoặc con số. Giao diện hồ sơ mô tả điều kiện, tác dụng, hồi chiêu và số lần/trận. Danh sách đội hình liệt kê các hiệu quả đã mở. Nhật ký và hiệu ứng bitmap riêng của nhân vật hiển thị khi kích hoạt; hiệu ứng duyên phận không làm chậm thời gian giao chiến bằng cinematic. Chế độ tắt hiệu ứng/giảm chuyển động vẫn được tôn trọng.

Các bộ đếm là dữ liệu tạm của từng trận: không cộng lặp vào chỉ số gốc, không mất phần thưởng hay thay đổi hồ sơ khi tải lại. Trận đang chờ và đội hình bí cảnh chụp trạng thái mở khóa tại lúc bắt đầu. Đội chia sẻ chỉ được mang tối đa 5 hiệu quả tương ứng các đồng đội đang xuất chiến; mã đội cũ không có trường mới vẫn đọc được. Hiệu quả không tự kích hoạt liên hoàn từ phản ứng của hiệu quả khác. Hồi máu dùng giới hạn hồi hiện có, khiên và khống chế dùng StatusEngine, nộ có giới hạn và nhân hệ số nhận nộ hiện có. Các hiệu quả bị động vẫn có thể bảo vệ người đang bị khống chế; người đã gục không tự kích hoạt hay hồi sinh.

Quay trùng vẫn nhận bản trang bị, đồng thời hoàn 80% giá thực trả bình quân/lượt. Quay đơn 80 bạc hoàn 64 bạc. Gói 5 giá 720 bạc có giá bình quân 144 bạc/lượt; tổng hoàn được làm tròn theo tổng số bản trùng: 1/2/3/4/5 bản lần lượt hoàn 115/230/346/461/576 bạc. Vì vậy không mất phần lẻ khi cả gói trùng. Trùng được kiểm tra trước mỗi lượt, bao gồm bản đã nhận trong chính gói đó. Trả đủ giá gói trước khi quay, bảo đảm phẩm chất và bộ đếm pity vẫn hoạt động. Lịch sử cũ không nhận hoàn bạc hồi tố. Kết quả vừa bán hết không cho bấm mặc từ lịch sử.

Đồ không mặc hoặc bản dư của món đang mặc có thể bán từng món hoặc bán hết bản dư. Giá mỗi món: Thường 12, Hiếm 28, Xuất sắc 60, Trác việt 120 bạc. Luôn giữ một bản của món đang mặc; không được bán vật phẩm tiền/nguyên liệu hoặc số lượng không hợp lệ. Trận đang chờ/lượt bí cảnh đang đi khóa bán để bảo vệ trang bị chụp trong lượt. Trừ vật phẩm và cộng bạc trong cùng một lần lưu nguyên tử; thao tác cũ hoặc tải lại không tạo thêm bạc.

## 60 hiệu quả

| Đồng đội | Hiệu quả | Cơ chế |
| --- | --- | --- |
| Lôi Nam | Côn Giữ Tình Thâm | Ra chiêu thường (mỗi 3 lần): gây sát thương chuẩn bằng 25% công cao nhất của người kích hoạt lên địch cùng hàng với mục tiêu gần nhất; tạo khiên bằng 6% HP tối đa cho bản thân trong 4s. Hồi 6s. |
| Huyền Đạo Trưởng | Thái Cực Đồng Tâm | Khi có đồng minh dưới 35% HP: tạo khiên bằng 16% HP tối đa cho đồng minh có tỉ lệ HP thấp nhất trong 4s; thanh tẩy khống chế và độc trên bản thân. Hồi 12s. |
| Thanh Lan | Lan Hương Tiếp Mạch | Khi hồi được HP cho đồng minh: tiếp 12 nộ cho mục tiêu vừa bị tác động. Hồi 5s. |
| Đường Thập Nhị | Tinh Tiêu Lưu Độc | Ra chiêu thường (mỗi 4 lần): gây độc bằng 10% công mỗi giây lên địch ở xa tuyến mình nhất trong 4s. Hồi 7s. |
| Đại Lực Kim Cang | Kim Chung Tái Khởi | Khi đòn đánh phá hết khiên bản thân: trói địch gần nhất trong 1.2s; tạo khiên bằng 10% HP tối đa cho bản thân trong 4s. Hồi 12s. |
| Lý Độc Thủ | Thanh Xà Đoạn Khí | Khi dùng tuyệt kỹ: giảm 20% ngoại phòng của địch có công cao nhất trong 5s; rút tối đa 15 nộ của địch có công cao nhất. Hồi 8s. |
| Ngô Sách | Thiên Cơ Cộng Chấn | Khi gây sát thương bạo kích: gây sát thương chuẩn bằng 35% công cao nhất của người kích hoạt lên địch cùng hàng với mục tiêu gần nhất. Hồi 6s. |
| Mai Tước | Hồng Ảnh Tái Vũ | Khi hạ địch: tăng 20% né tránh cho bản thân trong 4s; tiếp 18 nộ cho bản thân. Hồi 6s. |
| Tịnh Không Sư Thái | Tịnh Liên Sơ Trận | Vào trận: hồi 3% HP tối đa mỗi giây cho đồng minh trong 1 ô trong 4s. Tối đa 1 lần/trận. |
| Bách Bộ | Bách Bộ Đinh Phong | Ra chiêu thường (mỗi 5 lần): trói địch ở xa tuyến mình nhất trong 1.5s; gây sát thương chuẩn bằng 30% công cao nhất của người kích hoạt lên địch ở xa tuyến mình nhất. Hồi 8s. |
| Mộng Cô Bán Trà | Chén Trà Tri Kỷ | Theo thời gian giao chiến (mỗi 10s): hồi 8% HP tối đa cho đồng minh có tỉ lệ HP thấp nhất; tiếp 10 nộ cho đồng minh có tỉ lệ HP thấp nhất. |
| Bất Khắc Kiếm Khách | Song Kiếm Đồng Hành | Ra chiêu thường (mỗi 4 lần): tăng 12% công cho bản thân trong 4s; gây sát thương chuẩn bằng 30% công cao nhất của người kích hoạt lên mục tiêu vừa bị tác động. Hồi 6s. |
| Quy Tức Lão Nhân | Quy Giáp Hồi Âm | Khi nhận sát thương HP (mỗi 6 lần): cho bản thân phản 15% sát thương cận chiến trong 4s. Hồi 8s. |
| Thiềm Thừ Bà Bà | Cổ Vũ Tàn Đăng | Khi dùng tuyệt kỹ: gây độc bằng 15% công mỗi giây lên địch cùng hàng với mục tiêu gần nhất trong 5s; rút tối đa 8 nộ của địch có tỉ lệ HP thấp nhất. Hồi 9s. |
| Phi Thiên Đạo Tặc | Yến Lược Hộ Thân | Khi địch đánh trượt bản thân: tạo khiên bằng 8% HP tối đa cho bản thân trong 4s; tiếp 12 nộ cho bản thân. Hồi 7s. |
| Hoa Khôi Lầu Xanh | Lụa Khóa Chiến Ý | Khi địch ra tuyệt kỹ: mê hoặc người vừa ra chiêu trong 1.3s. Hồi 14s. |
| Luyện Đan Đồng Tử | Lò Đan Truyền Hỏa | Khi đồng đội khác ra tuyệt kỹ: tiếp 25 nộ cho đồng minh ít nộ nhất. Hồi 8s. |
| Thiết Đầu Công | Thiết Ngạch Khai Mạch | Ra chiêu thường (mỗi 3 lần): giảm 12% ngoại phòng của địch có công cao nhất trong 4s. Hồi 7s. |
| Vô Cực Kiếm Thần | Kiếm Phán Dư Âm | Khi có địch dưới 30% HP: gây sát thương chuẩn bằng 80% công cao nhất của người kích hoạt lên địch có tỉ lệ HP thấp nhất. Hồi 10s. Tối đa 3 lần/trận. |
| Tửu Tiên Vô Ảnh | Tri Kỷ Ba Chén | Khi dùng tuyệt kỹ: hồi 6% HP tối đa cho bản thân; tăng 12% né tránh cho bản thân trong 4s; tăng 10% công cho bản thân trong 4s. Hồi 10s. |
| Chú Tễu Giữ Cầu | Mái Chèo Hộ Bến | Khi nhận sát thương HP (mỗi 4 lần): trói địch gần nhất trong 1s; tạo khiên bằng 8% HP tối đa cho bản thân trong 4s. Hồi 9s. |
| Sen Non Gánh Thuốc | Lá Lành Che Bạn | Khi có đồng minh dưới 35% HP: hồi 4% HP tối đa mỗi giây cho đồng minh có tỉ lệ HP thấp nhất trong 4s; thanh tẩy khống chế và độc trên đồng minh có tỉ lệ HP thấp nhất. Hồi 12s. |
| Mộc An | Mộc Hàng Bền Chặt | Vào trận: tạo khiên bằng 10% HP tối đa cho đồng minh ở cột tiền tuyến trong 6s. Tối đa 1 lần/trận. |
| Lam Nhi Học Kiếm | Lam Kiếm Lưu Ngân | Ra chiêu thường (mỗi 3 lần): gây chảy máu bằng 14% công mỗi giây lên mục tiêu vừa bị tác động trong 4s; tiếp 8 nộ cho bản thân. Hồi 7s. |
| Tín Còi Đưa Thư | Tin Đến Trước Gió | Vào trận: tiếp 20 nộ cho nhân vật chính; giảm 12% chính xác của địch gần nhất trong 5s. Tối đa 1 lần/trận. |
| Bàu Rách Gõ Mõ | Mõ Gọi Người Còn | Khi một đồng đội khác gục: tiếp 15 nộ cho cả đội còn sống; làm choáng địch gần nhất trong 0.8s. Tối đa 1 lần/trận. |
| Bảy Cò Giữ Bến | Khép Mạn Giữ Người | Khi số quân địch còn sống nhiều hơn đội mình: tạo khiên bằng 18% HP tối đa cho bản thân trong 6s; tăng 15% công cho bản thân trong 6s. Tối đa 1 lần/trận. |
| Mận Chua Tung Đá | Sỏi Rơi Rối Hàng | Khi gây sát thương bạo kích: giảm 14% chính xác của địch cùng hàng với mục tiêu gần nhất trong 4s; gây sát thương chuẩn bằng 20% công cao nhất của người kích hoạt lên địch cùng hàng với mục tiêu gần nhất. Hồi 8s. |
| Tùng Gầy Gác Cổng | Cửa Còn Người Giữ | Khi bản thân dưới 35% HP: thanh tẩy khống chế và độc trên bản thân; tạo khiên bằng 25% HP tối đa cho bản thân trong 6s. Tối đa 1 lần/trận. |
| Cúc Mộc Vá Áo | Mũi Vá Hồi Duyên | Khi nhận hồi máu: tạo khiên bằng 7% HP tối đa cho bản thân trong 4s; tiếp 8 nộ cho đồng minh ít nộ nhất. Hồi 7s. |
| Phúc Đồng Thiết Chưởng | Nện Trụ Ngắt Thế | Khi địch ra tuyệt kỹ: giảm 25% ngoại phòng của người vừa ra chiêu trong 5s; trói người vừa ra chiêu trong 1s. Hồi 12s. |
| Liễu Thanh Kiếm Khách | Liễu Diệp Tán Hoàn | Ra chiêu thường (mỗi 5 lần): gây sát thương chuẩn bằng 20% công cao nhất của người kích hoạt lên toàn bộ địch. Hồi 9s. |
| Trúc Yên Y Sư | Trúc Yên Gột Độc | Khi hồi được HP cho đồng minh: thanh tẩy khống chế và độc trên mục tiêu vừa bị tác động; hồi 1.5% HP tối đa mỗi giây cho mục tiêu vừa bị tác động trong 4s. Hồi 8s. |
| Vân Rổ Đan Bẫy | Giỏ Đan Chặn Lối | Vào trận: trói địch ở xa tuyến mình nhất trong 2s; tăng 10% né tránh cho bản thân trong 4s. Tối đa 1 lần/trận. |
| Sáu Chén Túy Quyền | Chén Cạn Chưa Lui | Khi nhận sát thương HP (mỗi 5 lần): tiếp 20 nộ cho bản thân; gây chảy máu bằng 12% công mỗi giây lên địch gần nhất trong 4s. Hồi 8s. |
| Hạc Nâu Tĩnh Tọa | Tĩnh Hạc Che Cánh | Theo thời gian giao chiến (mỗi 12s): tạo khiên bằng 6% HP tối đa cho đồng minh trong 1 ô trong 4s; thanh tẩy khống chế và độc trên đồng minh trong 1 ô. |
| Bạch Liên Châm Sư | Liên Châm Song Hộ | Khi có đồng minh dưới 35% HP: hồi 10% HP tối đa cho đồng minh có tỉ lệ HP thấp nhất; tạo khiên bằng 6% HP tối đa cho bản thân trong 4s. Hồi 12s. Tối đa 3 lần/trận. |
| Hải Âu Phi Tiêu | Hải Âu Cắt Gió | Ra chiêu thường (mỗi 4 lần): rút tối đa 12 nộ của địch ở xa tuyến mình nhất; gây sát thương chuẩn bằng 40% công cao nhất của người kích hoạt lên địch ở xa tuyến mình nhất. Hồi 8s. |
| Minh Khuê Kiếm Sử | Minh Khuê Định Chứng | Khi dùng tuyệt kỹ: giảm 25% lượng nộ nhận vào của địch có công cao nhất trong 5s; gây sát thương chuẩn bằng 25% công cao nhất của người kích hoạt lên địch có công cao nhất. Hồi 10s. |
| Sơn Lâm Hộ Viện | Lâm Chung Hậu Hộ | Khi đòn đánh phá hết khiên bản thân: trói địch trong 1 ô trong 1.2s; hồi 3% HP tối đa mỗi giây cho bản thân trong 4s. Hồi 12s. |
| Đào Hồng Tửu Hiệp | Lạc Anh Tiếp Sức | Khi hạ địch: tiếp 15 nộ cho đồng minh có tỉ lệ HP thấp nhất; hồi 10% HP tối đa cho bản thân. Hồi 7s. |
| Đỗ Quyên Huyền Châm | Huyền Châm Song Độc | Khi độc của bản thân gây sát thương: thiêu đốt địch có tỉ lệ HP thấp nhất bằng 8% công mỗi giây trong 3s. Hồi 8s. |
| Nguyệt Cầm Chưởng Môn | Nguyệt Luân Yểm Ảnh | Khi dùng tuyệt kỹ: giảm 15% chính xác của toàn bộ địch trong 4s. Hồi 10s. |
| Lôi Chấn Thiền Sư | Thiên Chung Cộng Vệ | Vào trận: cho cả đội còn sống phản 8% sát thương cận chiến trong 6s. Tối đa 1 lần/trận. |
| Yên Vũ Thiên Cơ | Thiên Cơ Xuyên Trụ | Ra chiêu thường (mỗi 3 lần): gây sát thương chuẩn bằng 25% công cao nhất của người kích hoạt lên địch cùng cột với mục tiêu gần nhất; giảm 8% ngoại phòng của địch cùng cột với mục tiêu gần nhất trong 3s. Hồi 8s. |
| Phong Trần Lãng Khách | Lãng Ảnh Phản Bộ | Khi địch đánh trượt bản thân: làm choáng địch gần nhất trong 0.7s; gây sát thương chuẩn bằng 40% công cao nhất của người kích hoạt lên địch gần nhất. Hồi 8s. |
| Tố Tâm Liên Sứ | Vạn Liên Giữ Lời | Khi một đồng đội khác gục: hồi 2.5% HP tối đa mỗi giây cho cả đội còn sống trong 4s; thanh tẩy khống chế và độc trên cả đội còn sống. Tối đa 1 lần/trận. |
| Lạc Hồng Long Đế | Long Mạch Tĩnh Chiến | Khi dùng tuyệt kỹ: rút tối đa 10 nộ của toàn bộ địch; tạo khiên bằng 10% HP tối đa cho bản thân trong 4s. Hồi 12s. |
| Thiên Hương Thánh Nữ | Phượng Hương Hộ Mệnh | Khi có đồng minh dưới 35% HP: tạo khiên bằng 12% HP tối đa cho đồng minh có tỉ lệ HP thấp nhất trong 6s; hồi 10% HP tối đa cho đồng minh có tỉ lệ HP thấp nhất; thanh tẩy khống chế và độc trên đồng minh có tỉ lệ HP thấp nhất. Tối đa 1 lần/trận. |
| Trường Sơn Kiếm Tôn | Trường Sơn Nối Kiếm | Khi hạ địch: gây sát thương chuẩn bằng 60% công cao nhất của người kích hoạt lên địch gần nhất; tiếp 15 nộ cho bản thân. Hồi 8s. |
| Tiểu Sáo | Tiếng Sáo Dẫn Đường | Vào trận: tăng 20% né tránh cho đồng minh có tỉ lệ HP thấp nhất trong 5s. Tối đa 1 lần/trận. |
| A Lụa | Sợi Lụa Nối Mạch | Khi đồng đội khác ra tuyệt kỹ: tạo khiên bằng 10% HP tối đa cho người vừa ra chiêu trong 4s; hồi 2% HP tối đa mỗi giây cho người vừa ra chiêu trong 3s. Hồi 9s. |
| Thiết Yến | Thiết Yến Chia Lực | Khi nhận sát thương HP (mỗi 3 lần): tiếp 12 nộ cho đồng minh ít nộ nhất; tạo khiên bằng 8% HP tối đa cho bản thân trong 4s. Hồi 9s. |
| Vệ Thanh | Vệ Thanh Giữ Cửa | Khi địch ra tuyệt kỹ: tạo khiên bằng 8% HP tối đa cho đồng minh ở cột tiền tuyến trong 4s; thanh tẩy khống chế và độc trên đồng minh có tỉ lệ HP thấp nhất. Hồi 12s. |
| Thanh Tâm | Thanh Tâm Đêm Dài | Theo thời gian giao chiến (mỗi 9s): hồi 3.5% HP tối đa cho cả đội còn sống; tiếp 8 nộ cho bản thân. |
| Truy Phong | Truy Phong Khóa Đuôi | Ra chiêu thường (mỗi 5 lần): trói hai địch xa tuyến mình nhất trong 1s; gây chảy máu bằng 8% công mỗi giây lên hai địch xa tuyến mình nhất trong 3s. Hồi 10s. |
| Nguyệt Ảnh Kiếm Cơ | Minh Kính Hồi Chiếu | Khi gây sát thương bạo kích: rút tối đa 18 nộ của mục tiêu vừa bị tác động; hồi 4% HP tối đa cho bản thân. Hồi 8s. |
| Hùng Côn Đại Hiệp | Hùng Phong Bất Khuất | Khi bản thân dưới 35% HP: làm choáng địch cùng hàng với mục tiêu gần nhất trong 1s; tăng 20% công cho bản thân trong 5s. Tối đa 1 lần/trận. |
| Kim Cang Thánh Mẫu | Thánh Mẫu Giữ Đội | Khi một đồng đội khác gục: giảm 20% ngoại phòng của địch gần nhất trong 4s; tạo khiên bằng 9% HP tối đa cho cả đội còn sống trong 4s. Tối đa 1 lần/trận. |
| Thiên Âm Thánh Sứ | Liên Đăng Đồng Thanh | Khi đồng đội khác ra tuyệt kỹ: tiếp 8 nộ cho cả đội còn sống; thanh tẩy khống chế và độc trên người vừa ra chiêu. Hồi 10s. |
