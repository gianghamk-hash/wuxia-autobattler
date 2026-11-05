# Dẫn truyện bằng webtoon — cảnh thử mở đầu

**Lưu trữ lịch sử:** giao diện này đã được thay bằng [hộp thoại chân dung cổ điển](DIALOGUE.md). Quán chủ và các NPC đã có bộ chân dung mới trong `assets/images/npcs/`; trang tranh này không còn được dùng làm chân dung trong game. Giữ tài liệu để ghi nguồn/prompt của bản thử trước.

Phạm vi: **Q101, cảnh mở đầu chương 1**, gồm ba khung minh họa theo chiều dọc. Các hồi khác tiếp tục dùng hội thoại hiện có; chưa có bộ tranh cho toàn bộ 240 hồi.

Ba nhịp: quán Rồng Lửa trước biến cố → cuốn sổ bên bát cơm → đội thu tô ập vào. Khoảng nghỉ giữa khung tạo nhịp cuộn. Lời dẫn và bong bóng thoại dùng chữ HTML, hỗ trợ phóng to và trình đọc màn hình; ảnh có mô tả. Không phát chữ tự động, không ép hoạt ảnh hoặc tự cuộn. Nút **Đọc dạng chữ / Xem truyện tranh** chỉ đổi cách trình bày. Toàn bộ lời dẫn, callback và lựa chọn vẫn lấy từ dữ liệu truyện. Lựa chọn vẫn đi qua Campaign; xem lại trong Truyện ký không nhận thưởng.

Để mở rộng: thêm storyboard và tranh đúng tình huống cho từng hồi, cùng danh mục nhận diện nhân vật và bối cảnh. Không dùng một tranh mở đầu lặp cho mọi hồi. Nên chơi thử cảnh này trên điện thoại trước khi sản xuất các chương còn lại.

## Ảnh và nguồn

- Asset: `assets/images/story/chapter01-opening.webp`, 1024 × 1536, ba khung bằng nhau. UI dùng từng phần ba của cùng trang tranh.
- Tạo bằng công cụ **image_gen tích hợp**; không dùng CLI tạo ảnh. Chỉ chuyển PNG sang WebP chất lượng 85 sau khi tạo, không sửa nội dung.
- Bản PNG gốc giữ trong thư mục generated_images của phiên làm việc; game chỉ tải WebP khoảng 481 KB. Chữ không nằm trong ảnh.

Prompt dùng để tạo ảnh:

> Use case: illustration-story. Asset type: one continuous vertical webtoon opening page for a Vietnamese fictional wuxia game, three equally tall stacked horizontal panels, canvas portrait 1024x1536. Primary request: a beautifully drawn atmospheric ink and gouache webtoon page, no text anywhere, no speech balloons, no letters, no watermark. Deep jade shadows, warm amber lanterns, expressive human faces, confident hand-inked lines, rice-paper texture, readable on a phone. The three panels fill exactly the top third, middle third, bottom third; thin dark seams only, no outer border. Consistent fictional premodern Vietnamese riverside inn called Rong Lua, bamboo rafters, tiled roofs and plain cross-collar garments, no modern objects. TOP PANEL: wide cinematic exterior of a cozy timber village inn beside banyan trees and rice fields at blue dusk, warm lanterns and steam from the kitchen, peaceful before trouble. MIDDLE PANEL: tight dramatic still life of a weathered cloth-bound debt ledger lying beside a bowl of steaming rice and a spilled tea cup on a wooden inn table, an anonymous young kitchen helper's hand protectively reaching toward the book, torchlit tax collectors seen as threatening silhouettes at the doorway in the background, no readable writing on ledger. BOTTOM PANEL: low-angle dramatic view from inside the inn, two intimidating tax collectors in dark indigo clothes with red sashes burst through the doorway, an elderly innkeeper in a plain brown robe stands with an outstretched arm protecting diners, overturned bowl and scattered rice in foreground, no gore, no blood, no exaggerated caricatures. Keep the protagonist an anonymous hand only so any chosen player sect works. These three sequential panels are a single narrative comic page asset.
