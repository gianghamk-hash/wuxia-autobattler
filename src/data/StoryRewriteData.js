// Editorial rewrite: concrete events, named actors, short spoken lines.
const scenes = text => text.trim().split('\n').map(line => line.split('|'));
export const STORY_REWRITES = {
  1: {
    summary: 'Bạn phụ bếp ở quán Rồng Lửa. Một người khách gửi lại cuốn sổ rồi biến mất. Đội thu tô kéo đến đòi sổ và dọa bắt cả quán.',
    goal: 'Cứu người trong quán, giữ cuốn sổ và tìm người khách đã gửi nó.',
    bridge: 'Phiếu chở thóc ghi bến Liễu là điểm dừng đầu tiên. Bé Na nói cha em cũng chạy về phía bến. Bạn cần tìm người dẫn đường.',
    scenes: scenes(`
Bữa cơm bị phá|Đội thu tô đạp cửa quán Rồng Lửa. Bạn giấu cuốn sổ dưới bàn; quán chủ đứng chắn trước những người đang ăn.|Quán chủ: Đưa mọi người ra cửa sau. Ta sẽ giữ cửa trước!|Đẩy lui đội thu tô để khách thoát ra ngoài.
Tên trên mảnh giấy|Người gửi sổ không trở lại. Dưới ghế của ông có mảnh giấy ghi tên Vũ Bình và ký hiệu bến Liễu.|Bạn: Muốn biết vì sao họ đòi cuốn sổ, mình phải tìm người đã gửi nó.|Giữ mảnh giấy và hỏi người trong quán.
Bà Tư đã nộp đủ|Bà Tư mang biên nhận đến. Bà đã nộp đủ thóc, nhưng tên trong cuốn sổ vẫn bị ghi là còn nợ.|Bà Tư: Tờ này có dấu người thu. Sao giờ họ còn đòi lấy ruộng tôi?|So biên nhận của Bà Tư với dòng ghi nợ.
Con số bị sửa|Số thóc cũ viết bằng mực đen. Ai đó dùng mực xanh sửa thành số lớn hơn, khiến nhiều nhà bỗng mang nợ.|Bạn: Đây không phải tính nhầm. Có người cố tình bắt dân trả thêm.|Đánh dấu các dòng bị sửa, giữ nguyên bản gốc.
Lối sau bị chặn|Đội thu tô quay lại chặn ngõ sau. Bà Tư và mấy đứa trẻ chưa kịp ra khỏi quán.|Quán chủ: Đánh mở đường thôi. Đừng đuổi theo chúng rồi bỏ người ở lại!|Mở ngõ để đưa mọi người sang nhà bên.
Một bản hay nhiều bản?|Bà Tư xin chép các dòng ghi nợ. Có nhiều bản thì khó bị xóa hết, nhưng người giữ bản chép cũng có thể bị đe dọa.|Bà Tư: Tôi sợ chứ. Nhưng mất cuốn sổ này thì lấy gì đòi lại ruộng?|Chọn có giao bản chép cho dân làng giữ hay không.
Bé Na nhận ra cha|Bé Na chỉ chiếc chum nơi người khách đã rửa tay. Em nhận ra ông dù quần áo ông dính bùn và mực.|Bé Na: Người ấy là cha cháu. Cha dặn nếu có ai tìm thì nói cha đi về phía cây gạo.|Hỏi Na xem cha em đã mang theo những gì.
Vì sao cha Na bỏ trốn?|Giấy gói bánh của Na có chữ ký Vũ Bình. Cha em chép sổ cho nha thu tô; ông bỏ trốn sau khi mang cuốn sổ đến quán.|Bạn: Vậy ta phải tìm được ông ấy trước đội truy bắt.|Nhờ quán chủ giữ Na ở nơi an toàn.
Đừng để chúng tìm thấy Na|Một toán lính rẽ vào sân đình hỏi về con gái Vũ Bình. Bạn chặn chúng để quán chủ đưa Na đi đường khác.|Lão Tam: Đánh ở sân này. Trong ngõ còn người, đừng kéo họ vào!|Giữ chân toán truy bắt ở sân đình.
Người biết bến Liễu|Lão Tam, người ăn mày thường ghé quán, nhận ra ký hiệu trên giấy. Ông từng đi theo những chuyến thóc qua bến Liễu.|Lão Tam: Đường ấy ta thuộc. Chỉ là lâu rồi ta không muốn quay lại.|Nhờ Lão Tam chỉ đường ra bến.
Cánh cửa trưởng xóm|Trưởng xóm không chịu mở cửa khi nghe tới cuốn sổ. Quán chủ nói nhà ông cũng đang bị đòi thóc lần hai.|Bạn: Ta đến hỏi chuyện giấy tờ, không đến bắt tội ông.|Hỏi trưởng xóm vì sao ông sợ đội thu tô.
Điểm chỉ nhầm giấy|Trưởng xóm đưa ra giấy bán ruộng có dấu tay của dân. Ông từng bảo họ điểm chỉ vì tưởng đó là giấy xin hoãn nợ.|Trưởng xóm: Chính tôi đã bảo họ ký. Tôi phải nói rõ việc này, dù họ có giận tôi.|Giữ giấy bán ruộng và lời kể của trưởng xóm.
Ổ khóa mới|Người giữ kho nói lính thay ổ khóa đúng hôm số nợ bị sửa. Từ đó thóc trong kho được chở đi mỗi đêm.|Bạn: Dân đã nộp thóc vào đây. Ta cần biết nó bị chở đi đâu.|Tìm phiếu xuất kho và người đánh xe.
Chặn chuyến xe đêm|Đoàn xe chở thóc chuẩn bị rời làng. Đội áp tải cầm vũ khí; những người đánh xe chỉ là người làm thuê.|Người đánh xe: Tôi sẽ giao phiếu hàng. Xin đừng đánh người kéo xe!|Hạ đội áp tải và giữ phiếu chở thóc.
Ghép những việc đã biết|Biên nhận chứng minh dân đã nộp thóc. Cuốn sổ bị sửa biến họ thành con nợ; phiếu xe cho thấy thóc đang bị mang khỏi làng.|Quán chủ: Giữ đủ ba thứ. Chỉ cầm mỗi cuốn sổ thì chúng sẽ bảo con bịa chuyện.|Gói riêng biên nhận, sổ và phiếu xe.
Con đường chở thóc|Phiếu xe ghi các chặng bến Liễu, U Minh và Bình Định. Đó không phải đường đưa thóc về kho công.|Lão Tam: Ta sẽ đưa con tới chặng đầu. Tới đó phải tìm người biết chuyến xe này.|Đánh dấu bến Liễu làm điểm đến tiếp theo.
Bát cơm chờ cha|Na xin giữ lại bát cơm cho Vũ Bình. Em không biết cha đã làm gì trong nha thu tô, chỉ sợ ông không về nữa.|Bé Na: Nếu gặp cha, bảo cha đừng trốn cháu nữa. Cháu vẫn chờ ở quán.|Hứa tìm Vũ Bình và giao Na cho quán chủ.
Chúng đốt quán|Đội thu tô châm lửa vào đống rơm để ép người trong quán chạy ra. Dân làng chuyền nước; bạn chặn những kẻ cầm đuốc.|Bà Tư: Giữ chúng xa chum nước! Để chúng tôi dập lửa!|Đẩy lui đội phóng hỏa, giữ đường lấy nước.
Chia nhau giữ chứng cứ|Quán chủ giữ bản chép và biên nhận của dân. Bạn mang sổ gốc cùng phiếu xe; một nhóm bị bắt thì nhóm kia vẫn còn chứng cứ.|Bạn: Con đi tìm người chép sổ. Bác giữ Na và những bản này giúp con.|Chuẩn bị rời Thanh Khê cùng người dẫn đường.
Qua cửa làng|Đội trưởng thu tô chặn cổng, đòi sổ rồi mới chịu tha quán. Hắn vừa cho người đốt quán nên dân không còn tin lời hứa ấy.|Đội trưởng: Để cuốn sổ lại. Đừng bắt ta lục từng nhà thêm lần nữa!|Vượt đội chặn cổng để tới bến nước.
`)
  },
  2: {
    summary: 'Bạn đang rời Thanh Khê để tìm Vũ Bình. Lão Tam biết đường đến bến Liễu. Ở bến nước, bạn gặp Tiểu Muội đang tìm người cha bị bắt đi chở thóc.',
    goal: 'Tìm đồng đội và nối hai vụ mất tích với những chuyến thóc.',
    bridge: 'Nhóm biết Vũ Bình đang trốn ở bến Liễu. Phiếu xe và danh sách của Tiểu Muội cùng chỉ về U Minh.',
    scenes: scenes(`
Dấu giày trên cây|Lão Tam treo chiếc giày lên cây gạo để chỉ lối an toàn. Lính truy bắt đã đi theo dấu chân giả về phía khác.|Lão Tam: Giày cũ của ta cuối cùng cũng giúp được việc ngoài làm người ta bịt mũi.|Chờ Lão Tam rồi cùng xuống bến.
Túi thuốc trên cành|Tiểu Muội, một thầy thuốc trẻ, trèo lên cây lấy lại túi thuốc bị giật. Nàng cần thuốc để tìm cha trong đoàn phu.|Tiểu Muội: Đỡ cái túi trước! Ta có thể bám thêm một lát, thuốc thì không biết bám.|Giúp nàng và tìm hiểu chuyện đoàn phu.
Cùng một chuyến xe|Tên cha Tiểu Muội có trong danh sách người chở chuyến thóc ghi trên phiếu của bạn. Ông bị đưa đến U Minh sau khi không trả nổi món nợ mới.|Tiểu Muội: Cha ta đã nộp thóc rồi. Vì sao lại bắt ông đi trả nợ?|Đối chiếu ngày mất tích với phiếu xe.
Nhóm giật thuốc|Đám cướp túi quay lại, đòi đưa Tiểu Muội đi để ép cha nàng. Chúng đeo cùng dấu hiệu với đội thu tô.|Bạn: Chúng không chỉ tìm cuốn sổ. Chúng đang bịt miệng cả người làm chứng.|Đánh lui nhóm bắt người.
Bữa sáng ba người|Lão Tam chia chiếc bánh cuối. Bạn kể chuyện Na; Tiểu Muội kể cha mình đã mất tích sau chuyến chở thóc.|Lão Tam: Ăn xong rồi mới cứu thiên hạ. Bụng ta đang phản đối rất có lý.|Thống nhất cùng tìm Vũ Bình và đoàn phu.
Chuyện cũ của Lão Tam|Lão Tam thú nhận từng dẫn đường cho đoàn thu thóc. Ông bỏ việc sau khi thấy người trong làng bị lấy cả phần ăn.|Lão Tam: Ta biết đường vì ta từng dẫn chúng đi. Nếu con không muốn ta theo, cứ nói.|Quyết định có tiếp tục tin người dẫn đường.
Chữa tay cho kẻ địch|Tiểu Muội băng tay một tên vừa bị hạ. Hắn nói cha nàng thấy lính đốt kho nên bị giữ lại.|Tiểu Muội: Ta chữa cho anh. Đổi lại, hãy nói thật cha ta đang ở đâu.|Hỏi rõ vị trí kho trong U Minh.
Đầu cầu có lính|Lính gác chặn cầu và đòi khám túi thuốc. Bạn giữ đầu cầu để người đi chợ kịp rời khỏi chỗ nguy hiểm.|Bạn: Đưa dân qua trước. Ta không đánh giữa đám đông.|Mở lối qua cầu.
Biên nhận của cha|Tiểu Muội cũng có biên nhận đã nộp đủ thóc. Nó giống giấy của Bà Tư, nhưng cha nàng vẫn bị ghi nợ.|Tiểu Muội: Không chỉ cha ta. Họ có thể làm việc này với bất cứ nhà nào.|Giữ thêm biên nhận để chứng minh việc thu hai lần.
Nói thật trước khi đi|Lão Tam còn giấu một phần chuyện cũ. Tiểu Muội muốn hỏi cho rõ; đuổi ông đi ngay sẽ mất người biết đường.|Bạn: Chúng ta cần biết mình đang đi cùng ai. Hãy nói hết trước khi tới bến.|Chọn cách xây dựng lòng tin trong nhóm.
Vết roi của người dẫn đường|Lão Tam kể ông từng giao người bỏ trốn cho lính gác vì sợ mất việc. Người đó có mặt trong danh sách đoàn phu.|Lão Tam: Ta không mong họ tha thứ. Ta muốn tìm người ấy còn sống hay không.|Ghi tên người cần tìm ở U Minh.
Na gửi thêm lời|Người từ quán mang tới chiếc khăn Na gửi cho cha. Quán chủ báo em vẫn an toàn, nhưng đội thu tô còn lảng vảng ngoài làng.|Bạn: Tìm được Vũ Bình, ta phải đưa ông về gặp Na. Không chỉ lấy lời khai rồi bỏ ông lại.|Giữ khăn để Vũ Bình nhận ra bạn đến từ quán.
Đội kiểm soát bến|Đội thu tô dựng trạm ngay lối xuống thuyền. Bạn dẫn chúng ra xa nơi người lái đò đang đón khách.|Tiểu Muội: Đừng để chúng lật thuyền. Trên đó có người bị thương.|Đánh mở đường xuống bến.
Lời của người chở hàng|Một người đánh xe xác nhận đã đưa Vũ Bình tới bến Liễu. Ông nhờ tìm con gái nếu mình không quay lại.|Người đánh xe: Ông ấy run đến mức cầm không nổi tiền đò. Nhưng vẫn giữ chặt cái khăn của con.|Xác định Vũ Bình đã qua trạm nào.
Hai người cùng sợ|Tiểu Muội sợ Lão Tam giấu chuyện về cha. Lão Tam sợ gặp lại những người từng bị mình hại.|Bạn: Không ai phải kể mọi thứ ngay. Nhưng đừng để cả đội đi vào bẫy vì một điều bị giấu.|Thống nhất báo trước mọi nguy hiểm đã biết.
Một chiếc thuyền trống|Có thuyền đi U Minh ngay, nhưng chưa tìm được Vũ Bình. Nhóm chọn đến bến Liễu hỏi ông trước khi vào rừng.|Tiểu Muội: Cha ta ở U Minh. Ta vẫn cần biết lính giữ ông ở chỗ nào trước khi xông vào.|Tìm chỗ trú của người chép sổ.
Người đưa tin bị đuổi|Lính đuổi người mang tin về Vũ Bình. Bạn giữ chân chúng để người ấy chạy xuống thuyền.|Lão Tam: Muốn bịt miệng người đưa tin, trước hết chúng phải qua ta.|Cứu người đưa tin và nhận chỉ dẫn.
Lối qua lau sậy|Người đưa tin chỉ căn chòi ở bến Liễu. Muốn tới đó, nhóm phải qua lối lau sậy thay vì cổng bến có lính.|Bạn: Đi vòng xa hơn, nhưng còn hơn dẫn cả trạm gác tới chỗ người đang trốn.|Theo đường kín đến căn chòi.
Mời người cùng đường|Lão Tam và Tiểu Muội đều sẵn lòng giúp, nhưng mỗi người còn việc cần bạn hỗ trợ trước khi chính thức đồng hành.|Bạn: Ta giúp xong chuyện của hai người rồi cùng đi. Không ai chỉ là người chỉ đường thuê.|Hoàn thành điều kiện mời đồng đội.
Cùng xuống thuyền|Nhóm đã có người biết đường và người cứu thương. Bạn đưa phiếu xe cho người lái đò, nhờ tới bến Liễu trước tối.|Lão Tam: Lần này ta dẫn người đi tìm sự thật, không dẫn lính đi lấy thóc nữa.|Lên thuyền tìm Vũ Bình.
`)
  },
  3: {
    summary: 'Vũ Bình đang trốn ở bến Liễu. Ông là người gửi sổ ở quán Rồng Lửa, cũng là cha Bé Na. Nhóm cần đưa ông ra khỏi vòng vây và hỏi vì sao sổ bị sửa.',
    goal: 'Cứu Vũ Bình và tìm chuyến thuyền chở đoàn phu vào U Minh.',
    bridge: 'Vũ Bình giao giấy ghi chuyến thóc đến kho của Đốc Lệ trong U Minh. Cha Tiểu Muội và những người làm chứng đang bị giữ ở đó.',
    scenes: scenes(`
Hai trạm cùng thu|Người lái đò cho biết lính bến và đội thu tô đều đòi tiền cùng một chuyến hàng. Người không trả bị giữ lại làm phu.|Người lái đò: Đi qua hai trạm, họ bắt nộp hai lần. Có nhà bán cả thuyền vẫn chưa đủ.|Tìm căn chòi Vũ Bình đang trú.
Vũ Bình không tin|Vũ Bình nhận ra Lão Tam từng dẫn lính. Ông lùi vào chòi, tưởng bạn đến bắt mình.|Vũ Bình: Na ở đâu? Nếu các người bắt con bé, ta không có gì để nói cả!|Đưa khăn của Na và báo em đang an toàn.
Chòi bị bao vây|Lính nhìn thấy chiếc thuyền của nhóm và bao vây chòi. Vũ Bình không thể tự thoát qua lối bùn.|Bạn: Tiểu Muội đưa ông ấy ra sau. Ta chặn cửa!|Giữ lối thoát cho Vũ Bình.
Chuyện Na đang chờ|Vũ Bình nhận ra khăn của con. Ông mới tin quán chủ đang che chở Na và chịu ngồi xuống nói.|Vũ Bình: Ta cứ tưởng mang sổ đi là bảo vệ được nó. Hóa ra chúng tìm đến cả quán.|Hỏi ai đã buộc ông sửa sổ.
Người đã cầm bút|Vũ Bình nhận mình viết các con số nợ mới theo lệnh. Ông sợ con gái bị bắt nếu từ chối.|Vũ Bình: Chính tay ta sửa. Ta không thể đổ hết cho người đã ra lệnh.|Ghi lời thú nhận và giữ cả phần ông làm sai.
Mực xanh từ nha kho|Vũ Bình chỉ những dòng bị sửa bằng mực xanh. Cùng một lệnh đã tăng nợ cho nhiều hộ chứ không riêng nhà Bà Tư.|Bạn: Ta cần lệnh đó và người đã nhận nó, không chỉ lời ông kể.|Hỏi bản lệnh đang được giữ ở đâu.
Giữ bờ thuyền|Đội truy bắt tới bờ sông trước khi nhóm chuyển Vũ Bình đi. Người lái đò không thể rời bến khi khách còn trên bờ.|Người lái đò: Giữ mũi thuyền cho tôi! Đừng để chúng đẩy người xuống nước.|Đẩy lui lính trên bờ.
Lão Tam bị gọi tên|Vũ Bình nói Lão Tam từng giao một người bỏ trốn cho đội áp tải. Lão Tam nhận lỗi thay vì chối.|Lão Tam: Người ấy còn ở U Minh không? Ta muốn tự tới tìm ông ấy.|Hỏi tên người phu và chuyến xe liên quan.
Cha Tiểu Muội ở trong kho|Danh sách chở hàng có tên cha Tiểu Muội. Sau chuyến xe cuối, ông bị giữ lại vì thấy kho bị đốt.|Tiểu Muội: Ta sẽ đưa cha ra. Nhưng cũng phải đưa những người còn lại ra cùng.|Xác định kho và số người bị giữ.
Phiếu xe còn thiếu nửa|Vũ Bình giữ nửa phiếu vận thóc. Nửa còn lại nằm trong trạm kiểm soát, có dấu người nhận ở U Minh.|Bạn: Ghép được hai nửa, họ sẽ khó chối chuyến hàng này hơn.|Theo dõi lúc lính đổi ca ở trạm.
Lấy lại phiếu hàng|Lính phát hiện nhóm bên trạm. Bạn phải giữ cửa trong khi Vũ Bình tìm đúng tập giấy giao nhận.|Vũ Bình: Không lấy hết! Tập buộc dây đỏ ghi chuyến thóc từ Thanh Khê!|Giữ trạm để lấy nửa phiếu còn lại.
Có ghi lỗi của Vũ Bình?|Lời khai đủ sức buộc tội đội thu tô, nhưng cũng cho thấy Vũ Bình từng giúp sửa sổ. Ông chấp nhận để nhóm quyết định có ghi phần đó.|Vũ Bình: Nếu giấu phần ta làm, người bị hại sẽ còn phải nghe thêm một lời dối nữa.|Chọn cách ghi lời khai của Vũ Bình.
Người nhận tên Đốc Lệ|Hai nửa phiếu khớp nhau. Dấu giao hàng ghi kho U Minh, dưới quyền trấn thủ Đốc Lệ.|Bạn: Từ giờ ta biết phải hỏi ai. Nhưng đừng để ông ta biết ta đang mang gì.|Chuẩn bị đường vào U Minh.
Thuyền của đoàn phu|Người lái đò chỉ chiếc thuyền lính dùng chở phu. Các vết buộc dây trên mạn khớp lời kể của người đánh xe.|Người lái đò: Nó rời đây mỗi ba ngày. Chuyến sau là sáng mai.|Chọn bám theo tuyến thuyền thay vì đường lính gác.
Toán chặn cửa sông|Đội truy bắt khóa cửa sông, đòi khám mọi thuyền. Nhóm giữ họ ở bến cạn để dân qua nhánh khác.|Lão Tam: Người đi chợ cứ qua trước. Nợ đánh nhau để ta trả.|Mở cửa sông cho thuyền rời bến.
Một bản gửi về quán|Bạn nhờ chuyến đò quay lại gửi bản chép lời khai cho quán chủ. Nếu nhóm mất tích trong rừng, dân làng vẫn biết ai giữ kho.|Bạn: Nhắn Na rằng cha em còn sống. Đừng kể chỗ ông ấy đang đi.|Gửi tin an toàn và giữ bí mật đường đi.
Vũ Bình muốn đi cùng|Vũ Bình sợ trở về làm lính lần ra Na. Ông muốn dẫn nhóm đến đúng bến giao hàng rồi mới tìm đường về.|Vũ Bình: Ta biết cửa kho họ dùng. Ít nhất hãy để ta chỉ đúng chỗ mình đã đưa người tới.|Cho ông chỉ bến giao hàng từ xa.
Bờ lau trước U Minh|Nhóm xuống thuyền trước cửa rừng để tránh trạm lớn. Tiểu Muội chia thuốc và nhắc mọi người không uống nước đọng.|Tiểu Muội: Lính chưa thấy chúng ta. Đừng để một cơn sốt báo trước hộ họ.|Chuẩn bị vào rừng từ đường sau kho.
Người canh nhánh sông|Lính tuần phát hiện nhóm đổi thuyền. Bạn phải giữ họ lại trước khi còi báo động vang tới kho.|Bạn: Chặn người thổi còi trước. Trong kho còn những người không chạy nổi.|Vượt toán lính tuần.
Qua cửa rừng|Đội gác cuối bến ngăn thuyền vào U Minh. Sau trận, nhóm giữ được phiếu hàng và tìm thấy lối mòn tới kho Đốc Lệ.|Lão Tam: Tới đây rồi. Người ta từng bỏ lại đang ở phía trong, lần này ta không quay lưng nữa.|Theo lối mòn đi cứu đoàn phu.
`)
  },
  4: {
    summary: 'Đốc Lệ giữ kho thóc trong U Minh và bắt dân làm phu trả nợ. Cha Tiểu Muội ở trong đoàn ấy. Phiếu xe của nhóm chứng minh thóc Thanh Khê đã vào kho.',
    goal: 'Cứu đoàn phu và lấy lệnh điều chuyển thóc của Đốc Lệ.',
    bridge: 'Lệnh trong kho mang dấu thương hội Vạn Lợi. Thóc bị dùng nuôi lính thuê và hội võ Bình Định; nhóm theo vé hội để tìm người trả tiền.',
    scenes: scenes(`
Dấu xe trong bùn|Vết bánh xe dẫn tới kho gỗ có lính canh. Tiểu Muội tìm thấy mảnh áo của cha mắc trên cành thấp.|Tiểu Muội: Đúng áo cha ta. Ông đã đi qua đây, chưa lâu.|Theo dấu vào khu người phu bị giữ.
Mở trại phu|Lính không cho người bị sốt nghỉ và đánh người đòi nước. Bạn mở lối để Tiểu Muội tới chỗ họ.|Bạn: Bỏ gậy xuống và tránh đường. Những người này cần thuốc!|Đánh lui toán canh trại.
Ai đang bị giữ?|Người phu nói có ba nhóm: người gánh thóc, người sửa kho và người bị bắt vì đã nhìn thấy vụ đốt giấy.|Người phu: Cha cô thầy thuốc ở dãy cuối. Ông bị giữ riêng vì đã cản lính đốt kho.|Tìm lối tới dãy người bị giữ riêng.
Kho không thiếu thóc|Nhóm nhìn thấy thóc chất đầy kho, trái hẳn lời lính nói rằng dân chưa nộp đủ. Những bao có dấu Thanh Khê vẫn còn nguyên.|Bạn: Thóc của dân ở ngay đây. Món nợ ghi trong sổ là cái cớ để bắt họ.|Ghi lại dấu bao và số chuyến giao.
Chìa khóa của bà cụ|Bà cụ từng trông kho cho dân đưa nhóm chìa cũ. Lính thay khóa nhưng cửa thoát lũ phía sau vẫn dùng chốt gỗ.|Bà cụ giữ kho: Cửa sau còn mở được. Đừng đưa người bệnh qua bậc cao ở cửa chính.|Chuẩn bị đường đưa người bệnh ra.
Chặn đội áp giải|Lính chuyển người bị giữ sang trại khác khi nghe động. Bạn chặn đoàn để họ không đưa cha Tiểu Muội đi mất.|Tiểu Muội: Cha ở trên chiếc xe sau! Đừng để xe rẽ vào rừng!|Giải cứu đoàn người đang bị chuyển đi.
Gặp lại cha|Cha Tiểu Muội còn sống nhưng yếu vì sốt. Ông nhận ra con và cố nói về tờ lệnh lính định đốt.|Cha Tiểu Muội: Cha thấy dấu trên lệnh. Không phải dấu của kho, là dấu người ở ngoài rừng.|Đưa ông tới chỗ có nước và thuốc.
Người Lão Tam từng giao|Người phu nhận ra Lão Tam. Ông đã bị bắt sau lần Lão Tam chỉ đường cho lính, nhưng vẫn cần ông mở đường cho người khác.|Người phu: Tôi nhớ ông. Chuyện cũ chưa xong, nhưng hôm nay hãy giúp chúng tôi ra trước.|Để Lão Tam dẫn người còn đi được khỏi trại.
Lệnh mang dấu Vạn Lợi|Vũ Bình nhận ra tên thương hội Vạn Lợi trên giấy giao thóc. Đốc Lệ nhận tiền từ họ để giữ kho và người làm chứng.|Vũ Bình: Tôi chép sổ cho nha thu tô. Tiền trả lính ở đây lại từ một thương hội.|Tìm bản lệnh có chữ ký Đốc Lệ.
Cứu người trước lửa|Lính đốt giấy khi kho bị vây. Một nhóm phu còn mắc trong dãy nhà sát lửa.|Bạn: Tiểu Muội đưa họ ra. Ta giữ bọn đốt nhà, đừng quay lại lấy đồ!|Mở đường cứu người khỏi dãy nhà.
Xe hàng sắp rời kho|Một đoàn xe mang lệnh và tiền chuẩn bị ra cổng. Đuổi ngay có thể lấy được giấy, nhưng sẽ bỏ người bệnh chưa chuyển xong.|Tiểu Muội: Họ không tự ra nổi. Nếu bỏ đi lúc này, ta không biết còn gặp lại họ không.|Chuẩn bị lựa chọn giữa cứu người và bám xe.
Chọn điều phải làm trước|Lão Tam có thể theo dấu xe, còn Tiểu Muội cần thêm người chuyển bệnh nhân. Nhóm không đủ người làm cả hai việc ngay.|Bạn: Ta sẽ chịu trách nhiệm về việc chọn. Đừng đẩy điều đó cho người đang nằm ở đây.|Chọn ưu tiên khi thời gian không đủ.
Giữ được một phần lệnh|Dân cứu được mảnh lệnh khỏi lửa. Nó ghi tiền nuôi lính và nơi nhận thóc tiếp theo, nhưng thiếu chữ ký cuối.|Bà cụ giữ kho: Phần còn lại ở nhà trấn thủ. Hắn chưa kịp chuyển hòm đi.|Tìm căn nhà Đốc Lệ dùng làm nơi chỉ huy.
Phá vòng lính gác|Đốc Lệ gọi lính về bảo vệ hòm lệnh. Nhóm phải vượt vòng gác trước khi hắn trốn bằng đường nước.|Lão Tam: Hắn giữ hòm chặt hơn giữ kho. Trong đó chắc có thứ hắn sợ người ta đọc.|Mở đường tới nhà chỉ huy.
Tiền lính từ đâu?|Trong hòm có phiếu nhận bạc Vạn Lợi. Lính giữ kho được trả từ những chuyến thóc lấy của dân.|Bạn: Đây là lý do thóc không về kho công. Nó đang nuôi đội lính bắt thêm người.|Giữ phiếu bạc cùng bản giao thóc.
Đốc Lệ đối mặt|Đốc Lệ nói mình chỉ nhận lệnh giữ kho. Bạn chỉ vào tên ông trên giấy bắt phu và lệnh thiêu hủy sổ.|Đốc Lệ: Ta nhận tiền để giữ kho. Chúng bảo đám người ấy là con nợ bỏ trốn.|Buộc Đốc Lệ giải thích các lệnh mình đã ký.
Lời của cha Tiểu Muội|Cha Tiểu Muội nhận ra Đốc Lệ là người cho đốt giấy. Lời khai của ông nối chữ ký với việc xảy ra trong kho.|Cha Tiểu Muội: Tôi đã xin ông dừng lại. Ông nghe thấy rồi vẫn sai lính châm lửa.|Ghi lời chứng của người sống sót.
Đường rút của trấn thủ|Đốc Lệ sai lính mở đường ra bến. Nhóm ngăn toán hộ vệ trong khi dân chuyển người bệnh khỏi cổng.|Bạn: Đừng để họ lấy đoàn phu làm lá chắn. Giữ lối dân đang đi!|Chặn đường rút của đội giữ kho.
Kho trả lại cho dân|Bà cụ tổ chức người đếm thóc và phát phần ăn. Nhóm giữ bản lệnh gốc thay vì mang cả hòm tiền đi.|Bà cụ giữ kho: Tôi giữ chìa, dân giữ danh sách. Không để một người muốn đóng kho là đóng nữa.|Bàn giao kho và tập hợp giấy cần mang theo.
Hạ trấn thủ U Minh|Đốc Lệ dồn lính còn lại giữ cửa rừng. Sau khi vượt trận, nhóm có thể quyết định cách xử lý ông và giữ lời khai về Vạn Lợi.|Đốc Lệ: Ta thua rồi. Nếu muốn hỏi người thuê ta, hãy tới hội võ Bình Định.|Chốt cách xử lý trấn thủ rồi theo đầu mối hội võ.
`)
  },
  5: {
    summary: 'Lệnh trong U Minh dẫn tới hội võ Bình Định. Thương hội Vạn Lợi trả tiền cho hội, còn võ sĩ có thể bị buộc ký nợ để dự thi. Nhóm tìm người phụ trách những khoản tiền ấy.',
    goal: 'Qua hội võ để lấy giấy vào kho sổ của Vạn Lợi.',
    bridge: 'Giấy của hội võ mở được cửa kho sổ Hoa Lư. Kha Vân chỉ ra những hợp đồng vay bị đổi nội dung sau khi võ sĩ ký.',
    scenes: scenes(`
Tiền thóc thành tiền thưởng|Cờ Vạn Lợi treo khắp hội võ. Người phát thưởng dùng đúng loại phiếu bạc mà nhóm lấy ở kho Đốc Lệ.|Bạn: Dân bị lấy thóc, lính nhận bạc, còn ở đây bạc được gọi là tiền thưởng.|Tìm người nhận tiền từ thương hội.
Võ sĩ Kha Vân|Kha Vân cho biết nàng vay tiền chữa thương và bị buộc dự hội để trả. Rút khỏi hội thì nợ sẽ tăng gấp đôi.|Kha Vân: Ta muốn đấu cho tử tế. Nhưng họ giữ cả giấy nợ của người nhà ta.|Hỏi hợp đồng của nàng được giữ ở đâu.
Một chữ ký hai việc|Giấy dự hội vừa là đăng ký thi đấu vừa là giấy nhận nợ. Nhiều võ sĩ không được đọc phần sau trước khi điểm chỉ.|Bạn: Ai đến thi võ cũng có thể bị biến thành người làm thuê cho họ.|Tìm bản giấy chưa ký để đối chiếu.
Vòng đấu mở cửa|Nhóm phải qua vòng đấu mới được gặp người quản sổ. Đối thủ cũng là võ sĩ mắc nợ, không phải lính thu tô.|Kha Vân: Đánh theo luật. Thắng họ không có nghĩa được lấy thêm của họ.|Vượt vòng đấu đầu tiên.
Người thua bị giữ lại|Một võ sĩ thua bị đưa tới khu nhận việc áp tải thóc. Con đường từ hội võ quay thẳng về các đoàn xe của Vạn Lợi.|Bạn: Họ không chỉ tuyển người giỏi võ. Họ cần người không còn quyền từ chối.|Ghi tên khu nhận việc và người quản lý.
Bảng thưởng bị sửa|Kha Vân nhận ra tiền thưởng ghi trên bảng cao hơn khoản võ sĩ thực nhận. Phần chênh bị trừ thành phí mới.|Kha Vân: Thắng cũng nợ, thua cũng nợ. Họ đã tính sẵn để ta không trả hết.|Giữ bản công bố thưởng trước khi bị gỡ.
Vé đi Hoa Lư|Người thắng vòng sau sẽ nhận vé tới kho sổ Hoa Lư làm thủ tục. Nhóm cần tấm vé để xem hợp đồng gốc.|Bạn: Ta sẽ đi bằng cửa họ đã mở. Nhưng vào đó để đọc giấy, không ký thêm nợ.|Chuẩn bị cho vòng đấu kế tiếp.
Giữ luật trên sân|Người của thương hội cố gây xô xát để loại nhóm. Bạn phải vượt trận mà không để họ lấy cớ bắt dân xem hội.|Lão Tam: Sân có luật thì dùng luật. Đừng đánh hộ đúng cái cớ họ đang cần.|Đánh hết vòng theo luật hội.
Kha Vân đưa giấy nợ|Nàng giao bản mình đang giữ. Khoản vay ban đầu nhỏ hơn nhiều số nợ thương hội đang đòi.|Kha Vân: Đây là món ta thật sự vay. Phần còn lại, ta chưa từng đồng ý.|So chữ ký và ngày ký trên hai bản.
Tên người trả thưởng|Phiếu thưởng ghi thương hội Vạn Lợi, do Trịnh Nghiêm đứng đầu. Lính trong U Minh cũng lĩnh tiền từ nơi này.|Bạn: Ta đã có tên người nối cả kho thóc lẫn hội võ.|Giữ phiếu có tên Trịnh Nghiêm.
Đừng đánh người cùng cảnh|Một võ sĩ tưởng nhóm là người thương hội vì cùng mang vé. Kha Vân giải thích mục đích của nhóm trước khi sự việc thành ẩu đả.|Kha Vân: Họ đang tìm giấy nợ gốc. Nếu có bằng chứng, cả chúng ta mới có đường thoát.|Hỏi ai còn giữ bản hợp đồng cũ.
Vòng đấu có kẻ phá|Người quản hội sai lính vào sân dưới danh võ sĩ. Nhóm nhận ra dấu thu tô trên dây buộc tay của chúng.|Bạn: Những người này không đến thi. Họ muốn lấy lại phiếu bạc của Đốc Lệ.|Giữ chứng cứ qua trận phá hội.
Vì sao vẫn có người theo?|Thương hội cho võ sĩ ăn và chữa thương ngay khi họ túng quẫn. Sau đó họ mới biết món nợ đi kèm những việc không thể bỏ.|Tiểu Muội: Muốn họ rời đi, phải giúp họ có chỗ sống. Chỉ bảo họ đừng sợ thì chưa đủ.|Tìm chỗ trú cho người muốn làm chứng.
Gửi bản sao khỏi hội|Kha Vân nhờ người quen chuyển bản chép giấy nợ ra ngoài. Nhóm giữ lại bản chính để gặp quản sổ.|Bạn: Nếu họ giữ chúng ta lại, người ngoài vẫn biết những giấy này từng tồn tại.|Gửi bản sao và hẹn chỗ gặp an toàn.
Đường về bị khóa|Người làm chứng bị chặn cửa hội. Bạn dắt họ đi lối vận hàng thay vì chờ người quản hội cho phép.|Lão Tam: Vé chỉ ghi lúc vào, chẳng ghi phải ở lại chịu bắt.|Đưa người làm chứng ra khỏi khu hội.
Chặn toán giữ vé|Lính đòi thu lại vé Hoa Lư trước vòng cuối. Nhóm đánh lui chúng và giữ được dấu nhận vé còn nguyên.|Kha Vân: Cầm chắc vé. Không có nó, cửa kho sổ sẽ không mở cho ai cả.|Bảo vệ vé và bản hợp đồng.
Trước trận cuối|Kha Vân nói sẽ đấu hết sức theo luật. Nàng không nhận tiền để giả thua và cũng không muốn nhóm mua chiến thắng.|Kha Vân: Ta muốn tự chọn một trận đấu, dù chỉ lần này. Đừng nhường ta.|Chuẩn bị đấu với Kha Vân.
Lời hứa sau hội|Nhóm hứa sẽ đem giấy nợ của võ sĩ vào kho đối chiếu. Kha Vân đồng ý dẫn người bị hại đến làm chứng sau.|Bạn: Ta sẽ không hứa xóa hết mọi khoản nợ. Nhưng phần bị thêm vào phải được chỉ ra.|Thống nhất việc cần kiểm trong kho sổ.
Người quản hội cản đường|Lính định lấy người nhà võ sĩ để giữ họ im lặng. Nhóm giữ cổng cho các gia đình rời khu hội.|Tiểu Muội: Họ không thi đấu và cũng không ký gì. Thả họ ra!|Mở lối cho gia đình võ sĩ.
Vé của người thắng|Sau vòng đấu cuối, nhóm giữ được vé vào kho Hoa Lư. Kha Vân giao thêm danh sách người có giấy nợ bị sửa.|Kha Vân: Đến đó rồi, hãy tìm bản trước ngày hội khai mạc. Ta nhớ rõ hôm mình ký.|Mang vé và giấy nợ tới Hoa Lư.
`)
  },
  6: {
    summary: 'Nhóm dùng vé hội võ vào kho sổ Hoa Lư. Cần tìm bản hợp đồng trước khi bị sửa để chứng minh dân và võ sĩ bị tăng nợ. Thư lại và thợ giấy biết bản nào là bản cũ.',
    goal: 'Lấy bản hợp đồng gốc và tìm người đã dùng dấu để sửa giấy.',
    bridge: 'Giấy gốc chứng minh nợ bị sửa, nhưng thương hội có thể đổ cho người chép. Khuôn dấu và vũ khí đặt ở xưởng Thợ Bảy sẽ chỉ ra người thực sự ra lệnh.',
    scenes: scenes(`
Cửa kho nhận vé|Vé hội võ giúp nhóm vào kho, nhưng mỗi người chỉ được xem một ngăn riêng. Cách sắp xếp khiến không ai so được các bản với nhau.|Bạn: Ta cần xem hai bản cùng lúc. Nếu chúng giống nhau, sao lại sợ đặt cạnh nhau?|Hỏi quy định giữ các bản hợp đồng.
Ba bản ba số nợ|Một giấy cho người vay, một bản ở kho và một bản của thương hội ghi ba số nợ khác nhau. Cả ba cùng mang dấu quan.|Tiểu Muội: Cha ta không thể ký ba món nợ khác nhau trong cùng một ngày.|Ghi rõ bản nào nằm ở đâu.
Người đếm bằng thẻ tre|Thư lại giữ thẻ tre đếm thóc. Số trên thẻ khớp biên nhận của dân, không khớp cuốn sổ đã sửa.|Thư lại: Tôi đếm từng bao. Cái số họ bắt chép sau đó không phải số thóc đã nhận.|Xin giữ thẻ đếm cùng lời giải thích.
Giữ ngăn sổ cũ|Lính nhận lệnh chuyển sổ cũ ra khỏi kho. Nhóm chặn cửa để thư lại tìm đúng tập trước ngày hội võ.|Bạn: Đừng giật cả giá giấy xuống. Chúng ta cần bản nguyên vẹn.|Giữ ngăn chứa hợp đồng gốc.
Thư lại chỉ chỗ sửa|Anh chỉ nét mực xanh nằm đè lên chữ cũ. Phần nợ tăng thêm được viết sau khi người vay đã ký.|Thư lại: Chữ ký ở dưới đã khô từ trước. Dòng ghi nợ mới được thêm vào sau.|Đối chiếu dấu mực trên bản người vay giữ.
Dấu của quan trấn|Các bản sửa có dấu Đỗ Mậu, quan trấn Hoa Lư. Nhóm chưa biết ông đồng ý sửa hay người khác đã dùng dấu của ông.|Bạn: Ta phải tìm cách dấu này xuất hiện ở đây, rồi mới hỏi được đúng người.|Tìm sổ nhận và trả khuôn dấu.
Phiếu giao giấy trắng|Phiếu mua giấy cho biết Vạn Lợi nhận một lô giấy đã đóng dấu nhưng chưa viết nội dung.|Lão Tam: Dấu đóng trước, khoản nợ viết sau. Người ký làm sao biết mình sắp nợ bao nhiêu?|Giữ phiếu giao giấy đã đóng dấu.
Lính lấy sổ nhận dấu|Một toán lính tới lấy quyển ghi giao khuôn. Nhóm ngăn chúng, giữ cả tên người nhận hàng.|Bạn: Nếu đây là việc đúng luật, cứ để quyển sổ ở chỗ mọi người đọc được.|Bảo vệ sổ giao nhận.
Người giúp cũng có lỗi|Thư lại nhận mình đã chép lại số nợ mới vì sợ bị mất việc. Anh muốn lời khai bỏ qua phần đó.|Thư lại: Tôi có thể chỉ hết các bản. Nhưng xin đừng ghi tên tôi vào chỗ sửa sổ.|Chuẩn bị quyết định về lời khai của người giúp.
Ghi cả phần khó nói|Nếu giấu lỗi người chép, thương hội có thể dùng chuyện ấy để phủ nhận cả tập chứng cứ. Ghi rõ thì anh phải chịu trách nhiệm.|Bạn: Ta sẽ không thêm tội cho anh. Nhưng cũng không thể viết rằng anh chưa từng cầm bút.|Chọn có ghi đầy đủ phần bất lợi cho người giúp.
Giấy kể được ngày|Thợ giấy nhận ra sợi tre và vết khuôn của từng lô. Bản gọi là hợp đồng cũ lại dùng loại giấy mới làm sau ngày ký.|Thợ giấy: Giấy này hôm ấy còn nằm trong bể ngâm. Không ai ký lên nó từ tháng trước được.|Ghi ngày giao lô giấy làm bản giả.
Mở kho niêm phong|Lính khóa phòng giữ giấy còn lại. Nhóm phải mở đường cho thợ giấy và thư lại lấy mẫu đối chiếu.|Lão Tam: Đưa người biết giấy vào trước. Ta có vào thì cũng chỉ biết giấy cháy dễ thôi.|Giữ cửa phòng chứa mẫu giấy.
Mẫu gửi tới xưởng rèn|Sổ nhận hàng ghi một phần giấy đóng dấu được giao cùng vũ khí tới xưởng Thợ Bảy. Cùng một người đến nhận cả hai.|Bạn: Người này không chỉ sửa nợ dân. Hắn còn dùng giấy quan để lấy vũ khí.|Tìm tên xưởng và ngày nhận hàng.
Bản vay ban đầu|Nhóm tìm được hợp đồng đầu tiên: dân chỉ xin hoãn thời hạn nộp, không đồng ý bán ruộng hay làm phu.|Tiểu Muội: Vậy cha ta không vay khoản này. Họ đã biến giấy xin hoãn thành giấy nhận nợ.|Giữ bản gốc làm căn cứ trả ruộng.
Tên thương hội ở mặt sau|Phiếu chuyển quyền thu nợ ghi Vạn Lợi. Nhóm hiểu thương hội đã mua quyền thu rồi tự tăng số phải trả.|Bạn: Tới lúc này, ta mới có thể nói rõ ruộng bị lấy bằng cách nào.|Ghép hợp đồng, phiếu chuyển nợ và sổ sửa.
Người đốt kho quay lại|Lính mang dầu tới ngăn sổ gốc. Nhóm chặn họ trước khi ngọn lửa lan tới nơi dân đang sao giấy.|Thợ giấy: Lấy người ra trước, mẫu tôi đã mang theo rồi!|Giữ đường thoát và bảo vệ các bản gốc.
Chia ba gói chứng cứ|Thư lại giữ bảng đếm; thợ giấy giữ mẫu giấy; nhóm mang hợp đồng. Không ai phải giữ tất cả trên một đường.|Bạn: Nếu một gói bị lấy, hai gói kia vẫn còn chỗ để đối chiếu.|Giao bản sao cho người làm chứng.
Đích đến là xưởng Thợ Bảy|Dấu mẻ trên giấy cũng có trên phiếu giao vũ khí. Nhóm cần tìm khuôn thật ở xưởng để buộc người nhận hàng lộ tên.|Thư lại: Hỏi người nhận khuôn ngày mười ba. Chữ ký ấy có cả trong sổ giao thép.|Nhớ ngày giao khuôn trước khi rời kho.
Giữ đoàn mang giấy|Đội lính chắn cổng, muốn thu các gói giấy. Nhóm tạo đường cho người làm chứng rời kho cùng bản sao.|Bạn: Không ai được đi riêng với chúng. Giữ mọi người trong tầm mắt nhau.|Hộ tống người và giấy qua cổng.
Giữ hay dùng cuốn sổ?|Bản gốc đủ chứng minh dân bị tăng nợ. Nó cũng có thể dùng để ép quan và thương hội làm theo ý người giữ.|Tiểu Muội: Ta tìm giấy để đưa cha và dân về nhà. Đừng để nó thành thứ trói thêm người khác.|Chọn mục đích sử dụng cuốn sổ gốc.
`)
  },
  7: {
    summary: 'Giấy bị sửa dùng cùng con dấu trên phiếu giao vũ khí. Thợ Bảy biết ai đã đặt hàng và mang khuôn đến. Người ấy đang cho lính tới dọn sạch dấu vết trong xưởng.',
    goal: 'Giữ Thợ Bảy an toàn, lấy khuôn dấu và lệnh đặt vũ khí.',
    bridge: 'Khuôn có vết mẻ khớp giấy thu nợ. Lệnh đặt vũ khí mang dấu Đỗ Mậu và giấy nhận bạc của Vạn Lợi. Nhóm đưa cả vật chứng lẫn người biết việc tới gặp quan trấn.',
    scenes: scenes(`
Xưởng vẫn đỏ lửa|Xưởng Thợ Bảy đang làm vũ khí mang dấu quan. Một người đeo dấu Vạn Lợi tới đòi mang khuôn đi ngay.|Bạn: Ta đến hỏi về khuôn dấu, không đến mua kiếm.|Tìm chủ xưởng trước khi hàng rời đi.
Giữ cửa lò|Lính khóa cửa để thợ không ra ngoài. Bạn phá vòng canh và mở đường cho người trong xưởng.|Thợ Bảy: Đưa đám học việc ra trước! Lò còn cháy, đứng dồn ở cửa sẽ ngạt!|Giải cứu người thợ bị giữ trong xưởng.
Thợ Bảy nhận việc cũ|Ông nhận đã rèn hàng kém hơn hợp đồng để giữ phần tiền công. Ông không biết thương hội dùng chúng làm gì.|Thợ Bảy: Tôi làm sai phần thép. Nhưng con dấu và lệnh nhận hàng không phải do tôi bịa ra.|Hỏi ai mang dấu và đặt hàng.
Khuôn có vết mẻ|Thợ Bảy cho xem vết mẻ nhỏ ở cạnh khuôn. Vết ấy khớp các giấy nhận nợ nhóm đang mang.|Bạn: Cùng một khuôn đã dùng ở cả hai nơi. Ta cần giữ nó nguyên vẹn.|So khuôn với bản giấy gốc.
Xe mang thép lỗi|Lính thúc xe chở lô vũ khí đi. Nếu mất lô này, người đặt hàng có thể nói hàng Thợ Bảy làm luôn đúng chất lượng.|Thợ Bảy: Giữ một kiện có niêm phong. Đừng chỉ lấy một thanh kiếm rời ra!|Chặn xe và giữ mẫu hàng có dấu.
Đơn đặt từ Vạn Lợi|Sổ tiền ghi thương hội trả bạc, nhưng hàng lại cấp cho lính dưới lệnh quan trấn. Không có khoản chi nào từ kho công.|Bạn: Một bên bỏ tiền, một bên đưa lệnh. Họ đã cùng nhận thứ gì đổi lại?|Tìm thư kèm đơn đặt hàng.
Người thợ sợ làm chứng|Thợ Bảy sợ thương hội bắt người học việc nếu ông khai. Nhóm phải tìm chỗ trú cho họ trước khi mang khuôn đi.|Thợ Bảy: Tôi có thể chịu việc mình làm. Đừng để mấy đứa nhỏ chịu đòn thay tôi.|Đưa học việc tới nơi an toàn.
Dấu tay trên phiếu|Một học việc nhớ người nhận khuôn có nhẫn ngọc đen, giống người xuất hiện trên giấy mời của Trịnh Nghiêm.|Lão Tam: Chưa đủ để chỉ mặt ai. Nhưng có thể hỏi Thợ Bảy người ấy đã nói gì.|Ghi đặc điểm người nhận khuôn mà không vội kết luận.
Hộ vệ quay lại|Đội hộ vệ đòi lấy cả khuôn lẫn người thợ. Bạn giữ họ ngoài sân, tránh đánh gần lò than.|Bạn: Trong xưởng còn lửa. Muốn lấy người thì bước ra đây!|Bảo vệ đường rút khỏi xưởng.
Lệnh nhận vũ khí|Lệnh có dấu Đỗ Mậu cho thương hội nhận số vũ khí vượt số lính được ghi trong danh sách.|Thợ Bảy: Tôi đã hỏi vì sao cần nhiều thế. Họ bảo người rèn không có quyền hỏi.|Giữ bản lệnh có số lượng và người nhận.
Tiền công bị giữ|Người trong phường rèn vẫn chưa nhận đủ tiền công. Nếu xưởng đóng hẳn, họ mất việc lẫn khoản bị nợ.|Tiểu Muội: Ta cần bắt người thuê chịu trách nhiệm, không phải để cả phường đói theo.|Thống kê tiền công còn thiếu.
Ai đứng tên lời khai?|Phường rèn có thể tự đứng tên hoặc để nhóm mang lời khai không ghi người nói. Đứng tên đáng tin hơn nhưng cũng nguy hiểm hơn.|Thợ Bảy: Hãy để chúng tôi biết mình đang ký điều gì, rồi tự quyết định.|Chọn cách bảo vệ và công bố lời khai.
Mở đường đưa khuôn ra|Hộ vệ chặn lối chính sau khi biết khuôn còn trong xưởng. Nhóm đưa người và khuôn qua sân chứa than.|Lão Tam: Ôm khuôn cẩn thận. Vỡ nó thì ta không rèn lại được đúng cái vết mẻ ấy đâu.|Vượt toán chắn cửa xưởng.
Mẫu đất sét|Thợ Bảy ép khuôn vào đất sét để giữ một bản dấu. Mẫu này giúp đối chiếu nếu khuôn bị lấy trên đường.|Thợ Bảy: Đừng ép tay lên chỗ còn mềm. Vết mẻ cần rõ thì người ta mới kiểm được.|Đóng hộp mẫu dấu và niêm phong.
Lời xin bồi thường|Thợ Bảy đồng ý sửa phần hàng lỗi và trả phần bạc mình giữ sai. Ông không xin xóa lỗi vì đã đưa khuôn.|Bạn: Ta sẽ ghi cả việc ông sửa sai. Nó không làm việc cũ biến mất, nhưng dân cần phần sửa ấy.|Ghi cam kết trả công và sửa hàng.
Giấy nhận của lính|Một người lính mang phiếu nhận vũ khí có chữ ký người được Đỗ Mậu giao việc. Nhóm có thêm chỗ để hỏi trong phủ.|Bạn: Ta mang bản gốc tới. Người ký phải giải thích số hàng mình đã nhận.|Giữ phiếu cùng bản lệnh.
Chặn người cướp hòm|Một toán khác định cướp hòm khuôn để bán lại cho thương hội. Nhóm chặn chúng trên đường ra chợ.|Thợ Bảy: Đừng ném hòm xuống nước! Có đất mềm ở trong!|Bảo vệ hòm vật chứng.
Tin gửi tới Hoa Lư|Nhóm gửi trước bản sao các giấy và báo sẽ đến cùng Thợ Bảy. Đỗ Mậu không thể nói mình chưa biết sự việc.|Bạn: Giờ ông ấy có thời gian chuẩn bị câu trả lời. Dân cũng cần có thời gian chuẩn bị câu hỏi.|Báo thời điểm tới cửa thành.
Người thợ rời lò|Thợ Bảy giao xưởng cho người ở lại rồi theo nhóm. Ông mang mẫu thép lỗi do chính mình làm.|Thợ Bảy: Tôi sẽ không chỉ kể việc của người khác. Thanh thép này cũng là phần tôi phải trả lời.|Chuẩn bị hộ tống nhân chứng tới thành.
Lời khai thuộc về ai?|Có đủ giấy để ép Thợ Bảy làm việc riêng cho nhóm, hoặc đưa ông ra làm chứng công khai và bảo vệ phường rèn.|Bạn: Khuôn này giúp trả lại quyền cho dân, hay chỉ giúp ta có thêm người phục vụ?|Chọn cách dùng lời khai của người thợ.
`)
  },
  8: {
    summary: 'Nhóm tới Hoa Lư với hợp đồng gốc, khuôn dấu và Thợ Bảy. Đỗ Mậu là người ký các lệnh. Ông muốn đổ hết cho thương hội, nhưng những giấy có chữ ký của ông nói khác.',
    goal: 'Đưa nhân chứng vào thành và buộc Đỗ Mậu giao bản lệnh thật.',
    bridge: 'Đỗ Mậu giao bản lệnh nối thương hội với đội hộ vệ. Trịnh Nghiêm đang lên Yên Tử vận động các phái ký lời thề ủng hộ mình; nhóm phải tới trước buổi lễ.',
    scenes: scenes(`
Bà Tư ngoài cửa thành|Bà Tư đi theo chuyến đò mang biên nhận tới Hoa Lư. Lính cho người có vé hội vào, nhưng bắt dân chờ ngoài nắng.|Bà Tư: Ruộng bị lấy là của tôi. Sao lại chỉ cho người khác vào nói chuyện ấy?|Yêu cầu cho người bị hại cùng vào thành.
Đỗ Mậu trả lời trước|Đỗ Mậu thừa nhận chữ ký nhưng nói mình không biết nợ bị sửa. Ông chưa chịu cho dân vào nghe.|Bạn: Vậy xin ông đối chiếu giấy trước mặt chính những người mang nợ.|Đề nghị một buổi hỏi có nhân chứng.
Ba cửa ba nhóm|Lính muốn đưa người cầm sổ, người giữ khuôn và Thợ Bảy vào ba phòng riêng. Nhóm từ chối để họ bị ép đổi lời khi không ai nhìn thấy.|Lão Tam: Chúng ta cùng tới, cùng trả lời. Không cần ai thay bạn mình kể lại.|Giữ mọi người đi cùng qua cổng.
Ghế cho người phu|Người phu bị đuổi vì không biết chữ. Tiểu Muội chỉ ra ông là người đã thấy lính đốt kho.|Tiểu Muội: Ông ấy không đọc được lệnh, nhưng ông ấy nhìn thấy người châm lửa.|Để người làm chứng nói việc mình đã thấy.
Mở hòm trước sân|Khuôn thật và mẫu đất sét khớp vết dấu trên hợp đồng. Người trong phủ xác nhận đây là khuôn từng được giao cho Vạn Lợi.|Thợ Bảy: Tôi nhận nó từ người mang lệnh quan. Xin hỏi người giao khuôn, đừng chỉ hỏi người giữ lò.|Đối chiếu vật chứng với sổ trong phủ.
Lương lính từ thương hội|Đỗ Mậu nói lính thiếu lương nên ông nhận bạc Vạn Lợi. Đổi lại, ông cho họ nhận thóc và vũ khí.|Bạn: Lính cần lương là việc thật. Nhưng ai cho phép dùng ruộng của dân để trả thay?|Hỏi rõ điều kiện ông đã đồng ý.
Hộ vệ chặn sân|Người của thương hội chen vào định đưa nhân chứng đi. Nhóm phải giữ sân để buổi đối chất không bị dẹp bằng vũ lực.|Bạn: Không ai được lôi người khỏi đây. Hãy để họ nói hết!|Đánh lui đội cản buổi đối chất.
Món vay chữa bệnh|Đỗ Mậu kể con gái bị bệnh, ông từng vay bạc thương hội. Sau đó họ dùng khoản vay để buộc ông tiếp tục ký.|Đỗ Mậu: Lần đầu ta chỉ xin cứu con. Những lần sau, ta sợ họ công bố việc mình đã làm.|Ghi lý do nhưng không bỏ qua trách nhiệm.
Giấy của người cha khác|Bà Tư đặt biên nhận bên bệnh án con quan. Người phu nhắc cha Tiểu Muội cũng đau ốm khi bị bắt.|Bà Tư: Ông thương con mình thì chúng tôi hiểu. Con chúng tôi cũng cần người nhà trở về.|Hỏi ai đã chịu hậu quả từ những chữ ký.
Con dấu chưa rời phủ|Sổ nhận khuôn cho thấy có ngày người của Trịnh Nghiêm đem khuôn ra ngoài rồi trả lại mà không ghi nội dung giấy.|Bạn: Ông đã cho họ dùng dấu lên giấy trắng. Vì sao không dừng lại khi thấy nợ tăng?|Buộc quan trấn trả lời từng lần giao dấu.
Chặn lệnh chuyển người|Một lệnh mới yêu cầu chuyển người phu về trại cũ. Nhóm ngăn đội áp giải trước khi họ rời sân.|Tiểu Muội: Đang hỏi về việc bắt người, lại đem người đi tiếp thì hỏi để làm gì?|Giữ nhân chứng tại nơi an toàn.
Ai được nghe buổi hỏi?|Đỗ Mậu đề nghị chỉ nói với vài người để giữ trật tự. Dân ngoài cửa muốn trực tiếp nghe vì ruộng của họ đang bị quyết định.|Bạn: Mở cửa sẽ khó giữ yên hơn. Đóng cửa thì người chịu thiệt lại chỉ được nghe kể lại.|Chọn phạm vi người dự đối chất.
Khoản chia cho phủ|Trong sổ có phần bạc chia cho người trong phủ. Đỗ Mậu không thể nói tất cả tiền chỉ dùng trả lính.|Đỗ Mậu: Có khoản ta đã giữ lại. Ta sẽ không gọi nó là tiền công nữa.|Ghi khoản tiền phải hoàn trả.
Người con lên tiếng|Con gái Đỗ Mậu bước ra cùng bát thuốc. Nàng nghe mình được viện làm lý do cho những việc cha đã ký.|Con gái Đỗ Mậu: Con muốn sống. Nhưng con chưa từng xin cha lấy nhà của người khác để cứu con.|Để nàng nói với tư cách người trong cuộc.
Chặn người lấy bản lệnh|Hộ vệ thương hội định lấy hòm giấy khỏi phủ. Nhóm giữ đường tới kho để Đỗ Mậu còn có thể giao bản thật.|Bạn: Ông còn muốn nói mình không biết nữa không? Họ đang lấy giấy ngay trước mặt ông.|Giữ hòm chứa lệnh gốc.
Bản lệnh thật|Đỗ Mậu giao giấy cho phép Vạn Lợi nhận thóc nuôi hộ vệ riêng. Trịnh Nghiêm đã dùng đội quân ấy bảo vệ việc thu nợ.|Đỗ Mậu: Mang bản này đi. Tên ta ở đây, tên người nhận hàng cũng ở đây.|Giữ bản lệnh nối thương hội với hộ vệ.
Trịnh Nghiêm đang ở đâu?|Giấy mời cho biết ông chủ thương hội sắp dự lễ trên Yên Tử. Ông muốn các phái tuyên thệ đứng về phía mình.|Bạn: Nếu họ thề trước khi biết chuyện này, hắn sẽ có thêm người bảo vệ việc đã làm.|Tìm đường lên Yên Tử trước buổi lễ.
Cửa thành bị khóa lần nữa|Hộ vệ muốn giữ nhóm trong thành tới khi lễ kết thúc. Nhóm mở cổng để đưa bản lệnh và nhân chứng ra ngoài.|Lão Tam: Hỏi giấy thì họ bảo chưa đủ. Có đủ giấy thì họ lại khóa cửa. Ta nhớ đường khác rồi.|Vượt toán giữ cổng.
Giấy gửi lại cho dân|Bà Tư nhận bản xác nhận tạm ngừng lấy ruộng, chưa phải lời hứa trả hết ngay. Bà nhờ nhóm tiếp tục giữ bản gốc.|Bà Tư: Tôi cầm tờ này về ngăn họ bán ruộng trước. Việc còn lại, đừng để họ kéo dài mãi.|Giao bản bảo vệ tạm thời cho người bị hại.
Qua cửa Hoa Lư|Đỗ Mậu không còn giữ nổi đội hộ vệ. Nhóm thắng trận cổng thành và chọn cách đưa dân, nhân chứng cùng bản lệnh đi tiếp.|Bạn: Ta đã có thứ cần mang lên núi. Nhưng những người ở lại cũng phải có giấy tự bảo vệ mình.|Chốt cách xử lý quan trấn và rời thành.
`)
  },
  9: {
    summary: 'Trịnh Nghiêm sắp được các phái ủng hộ tại Yên Tử. Nhóm đang mang giấy chứng minh thương hội của ông chiếm thóc và nuôi hộ vệ. Trên đường, đoàn phu bị bắt mở lối cho buổi lễ.',
    goal: 'Đưa người làm chứng lên núi và tìm cách vào buổi lễ.',
    bridge: 'Người phu chỉ lối sau sân khấu. Nhóm phát hiện dây kéo và thuốc tạo khói dùng cho màn biểu diễn của Trịnh Nghiêm; người vận hành đang bị giữ ở hậu đài.',
    scenes: scenes(`
Đường lên Yên Tử|Lệnh Đỗ Mậu giao ghi đội hộ vệ Vạn Lợi nhận vũ khí để giữ buổi lễ trên núi. Nhóm phải tới trước lúc các phái ký lời thề.|Bạn: Ta cần cho họ xem giấy trước khi họ hứa bảo vệ ông ta.|Theo đường đoàn vận hàng lên núi.
Lối núi bị chặn|Hộ vệ bắt phu nhường đường và giữ lại người không trả phí. Nhóm đánh mở lối cho cả đoàn đi tiếp.|Người phu: Chúng tôi đã gánh hàng cho họ cả ngày. Vậy mà xuống núi còn phải mua đường về.|Đẩy lui toán chặn đèo.
Lời mời chỉ dành cho võ sĩ|Vé hội cho phép nhóm vào lễ, nhưng không cho nhân chứng đi cùng. Trịnh Nghiêm chỉ muốn nghe lời những người đã được chọn.|Bạn: Người bị lấy thóc cũng có chuyện cần nói. Ta không để họ đứng ngoài cửa lần nữa.|Tìm lối đưa người làm chứng lên cùng.
Nỗi sợ của Lão Tam|Lão Tam thấy cựu lính gác từng làm việc cùng mình. Ông sợ họ kể chuyện cũ trước đám đông để phá lời chứng.|Lão Tam: Nếu họ gọi tên ta, ta sẽ nhận. Nhưng xin đừng để họ dùng lỗi ta xóa chuyện của cả đoàn phu.|Thống nhất cách trả lời khi quá khứ bị nhắc lại.
Tiểu Muội muốn quay về|Cha nàng vẫn yếu. Tiểu Muội muốn đưa ông về, nhưng biết những người ở trại khác chưa được thả.|Tiểu Muội: Ta đã tìm được cha. Ta sợ mình sẽ dùng chuyện ấy làm cớ không cứu tiếp ai nữa.|Sắp xếp người hộ tống cha nàng xuống núi.
Giữ đoàn vận hàng|Hộ vệ chặn xe thuốc để lấy chỗ cho hàng của lễ. Nhóm bảo vệ thuốc dùng cho người phu bị thương.|Bạn: Màn lễ có thể chờ. Những người sốt trên xe thì không.|Giữ thuốc qua trạm gác.
Trịnh Nghiêm hứa điều gì?|Giấy mời nói Vạn Lợi sẽ cho các phái bạc và lương, đổi lấy lời hứa bảo vệ thương hội. Đây là cách ông có thêm quân dưới danh nghĩa liên minh.|Lão Tam: Bạc ấy từ kho nào ra, người cầm kiếm cần biết trước khi nhận.|Ghi điều khoản cần hỏi tại buổi lễ.
Bản chép từ Thanh Khê|Bà Tư gửi bản quán chủ đã giữ. Dòng nợ và ngày chép khớp cuốn sổ gốc của nhóm.|Bà Tư: Tôi đến để nói về ruộng nhà mình. Không ai có thể bảo cuốn sổ tự nghĩ ra tôi.|Giữ bản chép đầu tiên để xác nhận nguồn sổ.
Người phu cần nghỉ|Đoàn phu kiệt sức vì phải chở cả hàng lễ lẫn người bệnh. Có người chỉ còn đủ sức đi thêm một đoạn.|Tiểu Muội: Ta cần dừng và chia lại tải. Cố thêm lúc này sẽ có người gục trên dốc.|Tìm chỗ nghỉ trước khi vượt đèo.
Trạm giữ người bệnh|Hộ vệ muốn để người bệnh lại trạm và chỉ cho người khỏe đi tiếp. Nhóm không chấp nhận để họ mất người chăm.|Bạn: Người bệnh xuống cùng người đưa thuốc. Đừng tự ý tách họ khỏi gia đình.|Mở trạm để cả nhóm tự chọn đường đi.
Cầu gỗ bị hỏng|Cầu dẫn lên lối sau bị vỡ. Sửa cầu sẽ chậm buổi lễ; bỏ người phu lại thì nhóm có thể đi đường nhỏ ngay.|Người phu: Chúng tôi không đòi các vị bỏ việc của mình. Nhưng đường này người già và xe thuốc không qua nổi.|Xem có thể sửa cầu bằng gỗ vận hàng hay không.
Cùng sửa hay đi trước?|Nhóm phải chọn dành người sửa cầu hoặc chiếm đường lên đài trước. Quyết định ảnh hưởng việc nhân chứng có theo kịp.|Bạn: Ta đang mang giấy về chuyện họ bị bỏ lại. Đừng coi chuyện hôm nay là việc không liên quan.|Chọn cách vượt đoạn đường hỏng.
Lão Tam đối mặt người cũ|Một lính gác nhận ra Lão Tam. Ông thừa nhận từng dẫn đoàn thu thóc, rồi hỏi nơi còn giữ những người mình đã giao.|Lão Tam: Ta đã giúp các ngươi một lần. Hôm nay ta đến đưa người ra, không xin chỗ đứng cũ.|Hỏi đường vào trại phía sau lễ.
Toán giữ cầu|Hộ vệ kéo tới thu gỗ dân đang sửa cầu. Nhóm giữ chúng bên sườn dốc để việc chuyển người bệnh tiếp tục.|Bạn: Gỗ dùng cho cầu trước. Muốn lấy lại thì hãy nói với những người đang nằm trên xe.|Bảo vệ chỗ sửa cầu.
Một khoản công chưa trả|Người phu còn phiếu nhận công vận hàng lên núi. Thương hội chưa trả nhưng đã ghi họ nhận tiền cứu trợ.|Người phu: Tôi chỉ xin phần công mình làm. Đừng ghi tôi mang ơn một bữa ăn họ chưa từng đưa.|Giữ phiếu công để đối chiếu sổ cứu trợ.
Tiếng động sau vách|Nhóm nghe tiếng ròng rọc và thấy dây thép sau sân khấu. Màn võ công sắp diễn có người điều khiển từ phía sau.|Bạn: Trước khi nói đó là trò giả, ta phải tìm người biết dây này dùng làm gì.|Theo đường vận dụng cụ vào hậu đài.
Tên người giữ dây|Một thợ vận hàng nhắc Cẩm Tú, nghệ sĩ phụ trách dây. Nàng bị giữ lại sau khi xin ngừng biểu diễn.|Tiểu Muội: Người làm việc trong đó có thể đang bị ép. Đừng đốt sân khấu để chứng minh một chuyện.|Tìm chỗ Cẩm Tú đang bị giữ.
Hộ vệ khóa lối sau|Người canh phát hiện nhóm theo dây kéo. Nhóm đánh mở lối hẹp, tránh cắt dây khi còn người trên cao.|Lão Tam: Hạ người trước, hạ sân khấu sau. Đừng đảo thứ tự!|Vượt toán khóa hậu đài.
Chỗ trú cho nhân chứng|Người phu tìm được lán trống gần sân. Nhóm giấu bản sao tại đây và giao thuốc cho người ở lại.|Bạn: Nếu bị chia cắt, trở về lán này. Đừng tự đem giấy đi gặp ai hứa cho vào trước.|Hẹn nơi tập hợp trước khi vào hậu đài.
Qua cửa sau sân khấu|Hộ vệ chặn cửa cuối. Sau trận, nhóm tới được chỗ người biểu diễn và giữ nguyên đường thoát cho nhân chứng.|Bạn: Ta đã tới nơi. Giờ cần nghe người làm trong này nói rõ chuyện gì đang diễn ra.|Vào hậu đài tìm Cẩm Tú.
`)
  },
  10: {
    summary: 'Cẩm Tú vận hành màn biểu diễn võ công của Trịnh Nghiêm. Nhóm nghi màn cứu trợ và phép lạ là dàn dựng. Muốn vạch ra chuyện ấy, phải cứu người biểu diễn và giữ sổ trả tiền.',
    goal: 'Đưa người biểu diễn ra an toàn và lấy chứng cứ dàn dựng buổi lễ.',
    bridge: 'Cẩm Tú giao bản vẽ sân khấu và sổ nhận bạc. Cùng với giấy thu nợ và lệnh vũ khí, chúng đủ để yêu cầu các phái nghe buổi đối chứng trước khi ký lời thề.',
    scenes: scenes(`
Dây giấu sau áo|Một màn chưởng lực dùng dây kéo vật từ phía sau vách. Người điều khiển không được rời vị trí dù dây đã sờn.|Bạn: Có người đang đánh đổi mạng để ông ta được gọi là cao thủ.|Tìm người phụ trách dây và lối tháo an toàn.
Cẩm Tú bị giữ lại|Cẩm Tú nói nàng được thuê làm tiết mục sân khấu. Khi biết họ sẽ gọi đó là phép cứu dân, nàng xin nghỉ nhưng bị giữ giấy nợ.|Cẩm Tú: Ta nhận tiền diễn, không nhận biến người xem thành kẻ mắc nợ.|Hỏi ai ra lệnh đổi ý nghĩa màn diễn.
Khói làm người xem ngất|Thuốc tạo khói được pha mạnh để người xem tưởng mình mắc bệnh rồi được Trịnh Nghiêm cứu. Có người thực sự khó thở.|Tiểu Muội: Mở vách lấy gió. Ta cần biết loại thuốc, không cần thêm người thử khói.|Giữ mẫu thuốc và cứu người bị ngạt.
Cứu người treo dây|Hộ vệ không cho hạ nghệ sĩ xuống trước giờ diễn. Nhóm phải giữ chúng xa bộ tời để Cẩm Tú tháo dây.|Cẩm Tú: Đừng chém sợi bên trái! Nó đang giữ người trên cao!|Bảo vệ việc hạ nghệ sĩ xuống đất.
Tiền cứu trợ trên giấy|Sổ ghi dân đã nhận bạc và thóc sau màn cứu giúp. Nhiều người trong danh sách chưa hề được nhận.|Bạn: Họ dùng tên người nghèo để rút bạc, rồi dùng buổi lễ để xin thêm tiền.|So danh sách với người đang có mặt.
Nghệ sĩ cũng mang nợ|Tiền công của Cẩm Tú bị giữ làm khoản trừ nợ. Thương hội còn ghi tiền sửa dây lỗi là món nàng phải trả.|Cẩm Tú: Dây họ đưa hỏng, người ta suýt ngã. Vậy mà người gánh nợ lại là người đứng trên dây.|Giữ hợp đồng thuê người biểu diễn.
Toán giữ sổ bạc|Hộ vệ mang sổ thanh toán ra ngoài. Nhóm chặn họ để lấy bản có người nhận tiền và dấu thương hội.|Bạn: Ta cần quyển sổ, không cần kéo cả đống khói này vào trận.|Giữ sổ trả tiền khỏi hậu đài.
Đỗ Mậu xác nhận người nhận|Bản lệnh từ Hoa Lư có chữ ký trùng sổ trả bạc cho hộ vệ sân khấu. Đội giữ lễ cũng do tiền lấy từ dân nuôi.|Vũ Bình: Chữ ký này có ở phiếu kho U Minh. Cùng một nhóm đã đi từ kho tới đây.|Nối tên người nhận bạc ở các nơi.
Trò diễn và người làm nghề|Cẩm Tú muốn nhóm phân biệt người biểu diễn với người nói dối dân. Nàng có lỗi khi tiếp tục làm, nhưng không phải người đặt kế hoạch.|Cẩm Tú: Hãy nói đúng việc ta đã làm. Đừng gọi mọi người đứng sau màn là kẻ chủ mưu.|Ghi vai trò từng người trong màn dàn dựng.
Nhân chứng chưa thể ra|Cửa ra có lính giữ người nhà nghệ sĩ. Nếu công bố ngay, họ có thể bị dùng làm con tin trước đám đông.|Tiểu Muội: Có giấy trong tay chưa có nghĩa người làm chứng đã an toàn.|Tìm đường đưa gia đình người diễn khỏi sân.
Đường xe thuốc|Nhóm dùng lối vận thuốc để đưa người bị ngạt ra ngoài. Hộ vệ phát hiện và chặn cửa.|Bạn: Giữ lối đủ rộng cho cáng đi qua. Đừng để trận đánh dồn ngược vào trong!|Hộ tống người bệnh ra lán.
Công bố lúc nào?|Cẩm Tú sẵn lòng nói thật, nhưng đồng nghiệp còn bị giữ. Nhóm phải chọn cứu họ trước hoặc công bố ngay để phá buổi lễ.|Bạn: Nếu dùng lời cô mà bỏ mặc người cô lo, ta khác người thuê cô ở chỗ nào?|Chọn thời điểm đưa chứng cứ ra.
Mẫu khói có người kiểm|Tiểu Muội niêm phong thuốc và ghi cách nó gây khó thở. Nhóm không gọi mọi người từng được cứu chữa là giả bệnh.|Tiểu Muội: Có người bị hại thật. Điều giả là chuyện họ tự gây bệnh rồi nhận công cứu.|Ghi đúng phần dàn dựng và phần tổn hại thật.
Bản vẽ sân khấu|Cẩm Tú chỉ chỗ giấu tời, ống khói và người kéo. Ai kiểm sân cũng có thể tự nhìn thấy cách màn diễn hoạt động.|Cẩm Tú: Đừng chỉ bắt mọi người tin ta. Hãy mở vách để họ cùng kiểm.|Giữ bản vẽ làm hướng dẫn đối chứng.
Hạ toán giữ gia đình|Hộ vệ chặn người nhà nghệ sĩ ở kho đạo cụ. Nhóm đánh mở cửa trong lúc Cẩm Tú chỉ nơi an toàn để đứng.|Lão Tam: Đừng đứng dưới giàn! Ra sát vách này rồi theo ta!|Đưa gia đình nghệ sĩ khỏi kho.
Ai đã ra lệnh?|Sổ thuê ghi người của Trịnh Nghiêm sửa tiết mục thành màn chữa bệnh. Cẩm Tú nhớ chính lời họ dặn trước buổi lễ.|Cẩm Tú: Họ bảo cứ làm người xem sợ trước. Khi sợ rồi, họ sẽ ký bất cứ lời thề nào.|Ghi lệnh dàn dựng cùng tên người giao.
Mời các phái tự kiểm|Nhóm gửi bản vẽ và đề nghị đại diện từng phái vào xem tời. Không yêu cầu họ đổi phe chỉ vì nghe một lời tố.|Bạn: Hãy tự xem cách sân khấu hoạt động, rồi quyết định có ký hay không.|Đề nghị hoãn lời thề để kiểm chứng.
Chặn người phá tời|Hộ vệ định phá thiết bị trước khi đại diện các phái tới. Nhóm giữ sân khấu để dấu vết còn nguyên.|Bạn: Giữ cả người kéo dây lẫn cái tời. Mất một trong hai, họ sẽ lại đổ lỗi cho nhau.|Bảo vệ nơi kiểm chứng.
Cẩm Tú chọn đứng ra|Sau khi người nhà an toàn, Cẩm Tú đồng ý chỉ tận tay từng bộ phận và kể khoản tiền mình đã nhận.|Cẩm Tú: Ta có thể mất nghề sau việc này. Nhưng không muốn sống bằng một màn diễn bắt người khác mất nhà.|Chuẩn bị người nói và chứng cứ đi cùng.
Trước giờ mở màn|Nhóm vượt toán gác cuối và giữ được sổ thuê. Sân khấu được mở để các phái kiểm tra trước khi Trịnh Nghiêm bước lên đài.|Bạn: Tới lúc đặt giấy và người làm chứng trước mặt ông ta. Không cần dựng thêm màn nào nữa.|Chặn buổi lễ để mở đối chứng.
`)
  },
  11: {
    summary: 'Trước mặt các phái, nhóm đưa ra sổ thu nợ, lệnh vũ khí và chứng cứ dàn dựng. Trịnh Nghiêm muốn giữ liên minh bằng tiền và hộ vệ. Nhóm phải bảo vệ người làm chứng để ông không dẹp buổi hỏi.',
    goal: 'Vạch rõ vai trò Trịnh Nghiêm và ngăn hộ vệ bắt nhân chứng.',
    bridge: 'Trịnh Nghiêm bị giữ, các phái rút khỏi lời thề. Nhóm phải trả người, thóc và giấy tờ về đúng nơi; đánh thắng không tự làm dân lấy lại cuộc sống.',
    scenes: scenes(`
Ông chủ thương hội bước ra|Trịnh Nghiêm gọi nhóm là kẻ phá hội rồi yêu cầu các phái ký trước khi nghe chứng cứ. Nhóm từ chối đổi thứ tự.|Trịnh Nghiêm: Ta nuôi hội này, nuôi cả người giữ đường cho các vị. Các vị sẽ tin ai khi đứng giữa một cuốn sổ và cả một thương hội?|Yêu cầu đối chứng trước khi ký lời thề.
Hộ vệ giữ khán giả|Hộ vệ chặn lối ra, không cho người mang biên nhận lên sân. Nhóm mở lối để không ai bị biến thành con tin của buổi lễ.|Kha Vân: Muốn ai ở lại nghe thì đừng khóa cửa sau lưng họ!|Giữ đường vào và đường ra của sân.
Bản sổ từ quán trọ|Vũ Bình đặt sổ gốc cạnh bản chép quán chủ giữ. Ngày chép và các dòng nợ chứng minh giấy không được làm ra sau khi nhóm bị truy bắt.|Vũ Bình: Tôi đã sửa số theo lệnh. Tôi giữ bản này vì biết những người bị ghi nợ sẽ mất ruộng.|Để người chép sổ nhận rõ phần mình đã làm.
Người phu nói chuyện kho|Người phu kể việc bị bắt dù gia đình đã nộp thóc. Nhóm đưa phiếu giao hàng có chữ ký Đốc Lệ ra cùng lời kể.|Người phu: Tôi không biết ông chủ thương hội nghĩ gì. Tôi biết ai trả lính, ai lấy thóc và ai khóa cửa trại.|Nối lời kể với phiếu kho.
Chặn toán lấy sổ|Trịnh Nghiêm ra hiệu cho hộ vệ tiến lên lấy giấy. Nhóm giữ họ khỏi bàn đối chứng và người đang nói.|Bạn: Nếu ông có câu trả lời, hãy nói. Đừng đưa lính lên thay!|Bảo vệ bàn chứng cứ.
Lý lẽ của Trịnh Nghiêm|Ông nói mình cho dân vay khi quan không giúp, nuôi lính khi kho công hết tiền. Ông coi việc giữ ruộng và đòi người là quyền của người bỏ bạc.|Trịnh Nghiêm: Không có bạc của ta, họ đã đói từ mùa trước. Giúp người rồi chẳng lẽ ta không được lấy lại gì?|Hỏi rõ phần dân đã trả và phần bị tự ý thêm.
Tờ biên nhận của Bà Tư|Bà Tư đưa giấy đã nộp đủ. Trịnh Nghiêm không giải thích được vì sao khoản ấy vẫn bị ghi là chưa trả.|Bà Tư: Bạc vay thì tôi trả. Nhưng ông không được bắt tôi trả mãi một món đã trả xong.|Đối chiếu từng dòng nợ thay vì tranh công cứu người.
Khuôn dấu và vũ khí|Thợ Bảy đặt khuôn lên mẫu đất sét. Giấy nhận vũ khí và giấy tăng nợ cùng mang vết mẻ ấy.|Thợ Bảy: Tôi đã làm hàng lỗi. Còn ông đặt số vũ khí này để giữ kho hay để dọa người đòi lại ruộng?|Để các phái tự kiểm khuôn và giấy.
Hộ vệ phá hòm|Một toán hộ vệ định phá mẫu dấu. Nhóm giữ hòm và đưa người thợ lùi khỏi vùng đánh.|Lão Tam: Người biết việc còn phải nói. Đừng để chúng lấy một trận đánh đổi hết câu trả lời.|Chặn toán phá vật chứng.
Con dấu của Đỗ Mậu|Đỗ Mậu xác nhận đã giao dấu và nhận tiền. Ông không xin xóa tên mình khỏi giấy để được coi là người giúp nhóm.|Đỗ Mậu: Ta đã ký. Trịnh Nghiêm không làm được việc ấy nếu ta không cho hắn dùng quyền của mình.|Ghi trách nhiệm của cả quan lẫn thương hội.
Mở vách sân khấu|Cẩm Tú chỉ ròng rọc và thuốc khói. Đại diện các phái nhìn thấy màn cứu trợ đã được sắp đặt ra sao.|Cẩm Tú: Những người khó thở là thật. Việc ông ta dựng ra là nguyên nhân khiến họ cần được cứu.|Cho người xem kiểm sân thay vì chỉ nghe tố cáo.
Đội giữ tời tấn công|Hộ vệ đánh vào chỗ đại diện các phái đang kiểm tra. Nhóm giữ sân để họ có thể rút lui an toàn.|Bạn: Kha Vân, dẫn họ ra cửa mở! Ta giữ đội đang lao tới!|Bảo vệ người kiểm chứng.
Người có lỗi muốn làm chứng|Lão Tam, Vũ Bình và các nghệ sĩ từng tham gia đường dây đều muốn nói. Có người dự hội đòi gạt họ ra vì họ không vô tội.|Tiểu Muội: Chính vì đã ở trong đó, họ biết ai đã làm gì. Hãy kiểm lời họ bằng giấy, đừng bỏ qua cả câu hỏi.|Chuẩn bị chọn phạm vi người được nói.
Nghe ai trước đám đông?|Nhóm có thể cho mọi người liên quan nói đủ hoặc chỉ chọn người không vướng lỗi. Cách chọn ảnh hưởng điều các phái thực sự được biết.|Bạn: Ta muốn mọi người tin điều đã kiểm được, không phải tin vì ta chỉ cho nghe một nửa.|Chọn cách tổ chức lời chứng.
Lời thề không còn được ký|Sau khi kiểm giấy và sân khấu, các phái dừng ký. Họ không chấp nhận dùng tên mình bảo vệ những khoản nợ bị sửa.|Kha Vân: Ta có thể thua một trận. Ta không ký để người khác nhân danh ta đi bắt dân.|Yêu cầu hộ vệ rời người xem.
Trịnh Nghiêm dùng vũ lực|Ông bỏ buổi hỏi và lệnh hộ vệ bắt Vũ Bình. Nhóm chặn trước bàn nhân chứng.|Trịnh Nghiêm: Ta đã cho các người đường lui. Đừng tưởng cầm vài tờ giấy là giữ nổi người bên cạnh.|Đánh lui hộ vệ bắt nhân chứng.
Giữ người bỏ vũ khí|Một số hộ vệ dừng đánh khi biết lương của mình đến từ thóc chiếm. Nhóm cho họ lối rời sân để không bị ép đánh tiếp.|Lão Tam: Bỏ gậy xuống, bước sang bên. Việc đã làm vẫn phải trả lời, nhưng không cần làm thêm lúc này.|Tách người đầu hàng khỏi đội còn tấn công.
Đề nghị mua im lặng|Trịnh Nghiêm hứa chia tiền và quyền thu nợ nếu nhóm dừng lại. Ông vẫn coi chuyện lấy ruộng là món hàng có thể chia.|Bạn: Ta đi từ một bát cơm bị hất đổ tới đây. Không đi để nhận phần từ những người đã làm đổ nó.|Từ chối việc đổi chứng cứ lấy quyền riêng.
Trước trận cuối|Đường thoát cho dân đã mở. Trịnh Nghiêm chỉ còn đội thân vệ giữ đài, nơi ông cất ấn và bản danh sách người nhận tiền.|Tiểu Muội: Người làm chứng đã an toàn. Giờ chúng ta có thể kết thúc trận này.|Chuẩn bị hạ đội thân vệ.
Hạ người đứng sau|Nhóm thắng đội bảo vệ đài và giữ được Trịnh Nghiêm. Bạn quyết định đưa chứng cứ ra xử lý chung hay giữ quyền phán xét trong tay mình.|Trịnh Nghiêm: Không có ta, ai trả công lính, ai mở kho ngày mai? Các người đã nghĩ tới chưa?|Chốt cách sử dụng chứng cứ sau chiến thắng.
`)
  },
  12: {
    summary: 'Trịnh Nghiêm đã bị giữ. Dân cần lấy lại thóc và ruộng, lính cần nhận phần công hợp lệ, người bị bắt cần về nhà. Nhóm phải chọn mình sẽ sống thế nào sau khi có cả ấn lẫn sổ.',
    goal: 'Hoàn tất việc trả người, trả của và chọn kết cục của hành trình.',
    bridge: 'Những việc cần bàn giao đã có người nhận. Quyết định cuối cùng thuộc về bạn.',
    scenes: scenes(`
Người còn thiếu trong danh sách|Tiểu Muội kiểm lại người ra khỏi trại. Vẫn có người chưa tìm được; nhóm ghi rõ để việc tìm kiếm không dừng sau lời báo thắng.|Tiểu Muội: Đừng viết đã cứu hết. Những gia đình chưa có người về cần biết ta vẫn đang tìm.|Bàn giao danh sách còn thiếu.
Tin về trước đoàn|Các bản chứng gửi sớm đã tới Hoa Lư và Thanh Khê. Dân biết chuyện trước khi nhóm mang ấn về thành.|Bạn: Đừng để người chỉ nhìn thấy ấn tưởng mọi việc do một người làm.|Xác nhận ai đang giữ kho và các bản giấy.
Tiền công và việc sai|Lính xin nhận tiền công còn thiếu. Có người từng áp giải phu; trả phần công đúng không đồng nghĩa xóa trách nhiệm của họ.|Lão Tam: Phần công phải trả thì trả. Việc đánh người vẫn phải hỏi riêng, đừng dùng cái này che cái kia.|Tách tiền công khỏi việc xét sai phạm.
Kho lại bị cướp|Một toán nhân lúc đổi người giữ ấn xông vào kho, tự nhận lấy thóc thay dân. Nhóm ngăn họ để thóc được trả theo danh sách.|Bạn: Người bị lấy thóc có tên ở đây. Ai muốn nhận phải đối chiếu, không phải hô to hơn.|Bảo vệ kho chung.
Đỗ Mậu rời ghế hỏi|Đỗ Mậu giao ghế chủ tọa cho người kiểm sổ. Ông chấp nhận tiếp tục bị hỏi về các lệnh đã ký, không coi việc giao giấy là xong.|Đỗ Mậu: Ta sẽ trả lời phần tên mình. Không xin lấy một lần giúp đúng đổi hết những lần đã làm sai.|Ghi việc tiếp tục xử lý quan trấn.
Giấy trả ruộng cho Bà Tư|Bà Tư nhận giấy dừng chuyển ruộng và lịch đối chiếu trả lại. Mùa lúa đã mất vẫn cần giống và người giúp gieo lại.|Bà Tư: Giấy này giữ được đất. Cho tôi xin giống để mùa sau đất còn có thứ nuôi người.|Ghi nhu cầu làm lại vụ mùa.
Thợ Bảy sửa phần hàng lỗi|Phường rèn nhận công sửa vũ khí và hoàn phần tiền sai. Nhóm ghi rõ khối lượng để người học việc không bị buộc làm không công mãi.|Thợ Bảy: Tôi trả phần mình giữ sai. Bọn trẻ vẫn phải được trả công cho việc chúng làm hôm nay.|Chốt việc bồi hoàn và tiền công.
Kẻ phá danh sách trả thóc|Một nhóm cướp định đốt giấy đối chiếu để lấy phần trong kho. Bạn giữ chúng ngoài sân trong khi dân mang sổ ra chỗ khác.|Bạn: Giữ người chép và bản sao trước. Đừng để mọi thứ lại phụ thuộc vào một cuốn sổ!|Chặn đội phá giấy trả thóc.
Vũ Bình trở về quán|Vũ Bình tới Rồng Lửa cùng bản lời khai đã ký. Ông còn phải trả lời về việc sửa sổ, nhưng được gặp con trong lúc chờ xử lý.|Bé Na: Cha ngồi vào đây. Bát cũ con vẫn giữ, chỉ có cơm là con nấu lại rồi.|Cho hai cha con gặp nhau.
Bữa cơm của cha con|Na hỏi cha có đi mất nữa không. Vũ Bình nói thật rằng mình còn phải tới làm chứng, rồi sẽ báo rõ mỗi lần đi.|Vũ Bình: Cha đã trốn cả con vì sợ. Từ giờ cha sẽ nói con biết cha đi đâu.|Để lời hứa cuối hành trình là điều có thể làm được.
Cha Tiểu Muội về nhà|Tiểu Muội nhận tin cha đã về an toàn và đang dưỡng bệnh. Nàng muốn mở chỗ chữa người phu còn yếu.|Tiểu Muội: Ta đã tìm được cha. Giờ muốn những người khác cũng có nơi để hồi sức mà không phải vay thêm nợ.|Sắp xếp thuốc và người chăm sóc.
Người đòi quyền thu mới|Một nhóm đề nghị nhóm anh hùng giữ ấn rồi tiếp tục thu nợ dưới tên khác. Họ hứa trả lính và chia phần thưởng.|Bạn: Đổi người cầm ấn mà vẫn lấy sai thì dân chỉ phải nhớ thêm một cái tên để sợ.|Chuẩn bị quyết định cách giao quyền sau trận.
Lão Tam gặp người cũ|Người phu từng bị Lão Tam giao cho lính được trả phần công. Ông chưa nói đã tha thứ, nhưng nhờ Lão Tam chỉ đường cho người về làng.|Lão Tam: Ta sẽ đi cùng tới bến. Lần này ông muốn dừng ở đâu, cứ nói.|Cho người bị hại tự chọn cách tiếp tục quan hệ.
Giữ chuyến thóc trả làng|Lính thuê cũ định lấy chuyến thóc cuối để ép trả thêm. Nhóm hộ tống thóc về đúng nơi đã nhận hàng.|Bà Tư: Bao có dấu làng nào trả làng ấy. Đừng ai lấy hộ rồi bắt người ta tới xin lại.|Bảo vệ chuyến trả thóc.
Cẩm Tú mở lại sân khấu|Cẩm Tú xin diễn một buổi có ghi rõ dùng dây và khói. Người xem được chọn ở lại, không phải ký nợ sau màn cứu giúp.|Cẩm Tú: Lần này họ biết ta đang làm nghề gì. Vậy mới vui được khi họ vỗ tay.|Giao lại dụng cụ cho đoàn diễn.
Kha Vân trả món thật sự vay|Kha Vân đối chiếu phần vay ban đầu, bỏ các khoản thương hội tự thêm. Nàng muốn thi đấu tiếp bằng hợp đồng được đọc trước.|Kha Vân: Nợ thật ta trả. Trận sau, ta chỉ bước lên sân khi biết mình đã đồng ý điều gì.|Trả giấy gốc cho các võ sĩ.
Quán chủ hỏi chuyện mai sau|Quán đã sửa được mái. Ông hỏi bạn muốn ở lại hay đi tiếp, không coi việc cứu quán là món nợ bạn phải trả bằng cả đời.|Quán chủ: Bếp vẫn có chỗ. Nhưng con chọn ở lại vì muốn, đừng vì nghĩ mình chưa trả đủ ơn.|Nghĩ về con đường sau hành trình.
Giữ lần bàn giao cuối|Một toán cướp muốn lấy ấn trước buổi bàn giao. Nhóm bảo vệ nơi dân và người giữ kho đang gặp nhau.|Bạn: Để họ nhận xong phần việc. Chúng ta không đánh giữa những người đang chờ nhận lại nhà.|Bảo vệ buổi bàn giao.
Đặt sổ xuống bàn|Bản sao đã được gửi, người làm chứng có nơi về, việc còn thiếu có tên người tiếp tục. Bạn không còn phải giữ mọi thứ trong một chiếc túi.|Bạn: Tới lúc chọn điều ta muốn làm, chứ không chỉ chạy theo việc kẻ khác gây ra.|Chuẩn bị chọn kết cục.
Con đường của bạn|Bạn có thể giao chứng cứ để trả lại công bằng, giữ quyền lực để ép người khác, dùng tiền tự lập thế lực, hoặc rời giang hồ trở về cuộc sống riêng.|Quán chủ: Ta chỉ hỏi con có muốn ăn cơm không. Chuyện thành người thế nào, con phải tự chọn.|Chọn kết cục phù hợp với những gì đã làm.
`)
  }
};
export function rewriteChapter(chapter, number) {
  const rewrite = STORY_REWRITES[number];
  const outcomes = [
    ['Dân làng đã giữ thêm bản chép. Mất sổ gốc vẫn còn chứng cứ ở Thanh Khê.', 'Bạn giữ mọi bản trong nhóm. Dân làng chưa có giấy tự bảo vệ khi bạn đi xa.'],
    ['Lão Tam và Tiểu Muội đã nói rõ điều còn giấu. Nhóm biết việc gì cần hỏi nhau trước khi đi tiếp.', 'Nhóm chưa hỏi hết chuyện cũ. Những điều chưa nói vẫn có thể khiến người trong nhóm nghi ngờ.'],
    ['Lời khai ghi cả việc Vũ Bình sửa sổ. Ông sẽ phải trả lời phần mình đã làm.', 'Bạn đã giấu một phần lỗi của Vũ Bình. Người khác có thể dùng việc ấy để nghi ngờ bản lời khai.'],
    ['Nhóm đã ưu tiên chuyển người bệnh ra ngoài. Việc đuổi xe hàng chậm lại nhưng những người ấy được cứu.', 'Nhóm đã ưu tiên theo xe hàng. Những người còn lại phải tự lo việc chuyển người bệnh thêm một lúc.'],
    ['Nhóm giữ lời với các võ sĩ và nhận thêm bản giấy nợ cũ để kiểm tra.', 'Nhóm chỉ giữ những giấy có lợi ngay cho mình; một số võ sĩ vẫn chưa tin mục đích chuyến đi.'],
    ['Bản sao ghi cả phần sai của người đã giúp nhóm. Các bản có thể được kiểm cùng nhau.', 'Bạn bỏ qua phần sai của người giúp nhóm. Bản sao không còn kể đủ việc đã xảy ra.'],
    ['Phường rèn đã tự đứng tên lời khai sau khi biết rủi ro. Họ có quyền yêu cầu nhóm bảo vệ mình.', 'Nhóm mang lời khai mà không để phường rèn tự đứng tên. Người thợ chưa có tiếng nói riêng trước phủ.'],
    ['Dân và người làm chứng đã được vào nghe. Có thêm người có thể xác nhận Đỗ Mậu đã trả lời gì.', 'Buổi hỏi chỉ có số người được chọn. Dân ngoài cửa vẫn phải nhờ người khác kể lại.'],
    ['Nhóm đã giúp đoàn phu sửa đường. Người và xe thuốc có thể đi cùng lên núi.', 'Nhóm đã đi trước. Đoàn phu phải tự sửa lối cho người bệnh và xe thuốc.'],
    ['Người biểu diễn đã được đưa tới chỗ an toàn trước khi công bố chứng cứ.', 'Chứng cứ được công bố khi một số người biểu diễn còn gặp nguy hiểm.'],
    ['Các phái đã nghe cả lời người từng tham gia đường dây và kiểm nó bằng chứng cứ.', 'Một số người có lỗi không được nói. Những việc chỉ họ biết vẫn chưa được kể đủ.'],
    ['Bạn đã giao phần việc cho người tiếp tục làm, thay vì tự giữ mọi quyền quyết định.', 'Bạn giữ nhiều quyền quyết định trong tay. Người được giúp vẫn phải chờ bạn cho phép ở một số việc.']
  ][number - 1];
  const choiceText = number === 5 ? { a: 'Giữ giấy nợ của võ sĩ để cùng đối chiếu.', b: 'Chỉ giữ giấy có lợi ngay cho nhóm.' } : {};
  return rewrite ? { ...chapter, ...rewrite, decision: { ...chapter.decision, ...choiceText, good: outcomes[0], bad: outcomes[1] } } : chapter;
}
