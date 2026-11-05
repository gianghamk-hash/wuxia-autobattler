# Lưu game và nhiều tab

Sáu ô và schema dữ liệu gameplay được giữ nguyên. Mỗi record mới có `revision` ngẫu nhiên. Record cũ chưa có revision vẫn đọc được; lần ghi tiếp theo sẽ bổ sung revision.

Mỗi StorageManager ghi nhớ phiên bản mà nó đã đọc hoặc ghi. Trước khi ghi, nó kiểm tra phiên bản trong kho còn khớp. IndexedDB thực hiện đọc/so sánh/ghi trong **cùng một transaction readwrite**. LocalStorage dùng **Web Locks** chung cho từng ô để bao quanh đoạn đọc/so sánh/ghi đồng bộ. Nếu có một tab đã lưu bản mới, tab cũ nhận SaveConflictError và không ghi đè. Làm mới danh sách ô không tự chấp nhận phiên bản của tab khác; chỉ tải bản lưu rõ ràng mới nhận phiên bản đó.

Khi xung đột, UI ngừng tự lưu và chặn lưu/nhập/bắt đầu bản mới qua bảng lưu. Người chơi có thể xuất nhánh đang chơi ra `.wuxia`, hoặc chọn tải bản tự lưu mới nhất (có xác nhận). Tải một ô thủ công cũng chủ động nhận mốc revision tự lưu hiện tại để tiếp tục từ nhánh được chọn. Revision vẫn được kiểm tra ở lần ghi kế tiếp, kể cả có tab khác ghi trong lúc tải.

Lỗi tự lưu luôn hiện trong thông báo chung ngoài màn hình Lưu/Tải. Hết dung lượng hoặc lỗi ghi giữ nguyên record cũ; nút thử lại dùng bản chơi hiện tại. Xuất file vẫn dùng được khi không có kho lưu. Thông báo nhận thưởng không còn tự khẳng định dữ liệu đã ghi xuống đĩa.

Ngoài checkpoint và chu kỳ 15 giây, UI yêu cầu lưu khi trang bị ẩn hoặc pagehide. Đây là **best effort**: trình duyệt có thể chấm dứt tác vụ bất đồng bộ khi đóng trang, nên không cam kết phục hồi từng tick. Checkpoint trận vẫn khôi phục từ đầu trận với cùng seed. SHA-256 kiểm tra hỏng dữ liệu, không chống sửa save có chủ đích.

## Giới hạn tương thích

- Các tab phải cùng dùng phiên bản game mới để có bảo vệ nhiều tab. Tab chạy mã cũ chưa được tải lại có thể ghi bằng logic cũ.
- Trình duyệt không có cả IndexedDB lẫn Web Locks không ghi LocalStorage bằng cơ chế có thể đua nhau; game báo lỗi và cho xuất file. Không âm thầm chuyển kho sau lỗi ghi.
- Không có đồng bộ máy chủ hoặc khóa liên thiết bị. Không tự gộp hai nhánh tiến trình.

## Kiểm tra

`npm test`: ghi đồng thời, tab cũ, làm mới danh sách, nâng cấp record cũ, retry sau quota, phục hồi từ ô thủ công và các kiểm tra lưu/nhập hiện có.

`npm run test:browser`: hai tab Chromium thực cho cả IndexedDB và LocalStorage; xung đột không đổi bản mới, xuất được nhánh chưa lưu, tải lại bản mới và tiếp tục lưu. Tiêm lỗi quota để kiểm tra thông báo, giữ bản cũ, xuất file và retry. Trận mở đầu thật được tải lại từ checkpoint và hoàn thành.
