import { deepFreeze } from './DataUtils.js';
// Sources are completed episodes, never reader positions or an unvisited chapter.
const rows = [
  [
    'ledger',
    'Q101',
    'Vật chứng',
    'Cuốn sổ bị truy đòi',
    'Một người khách để lại sổ ở quán. Đội thu tô dùng vũ lực đòi lại; chưa biết ai đứng sau.',
    ['quan_chu', 'tay_sai']
  ],
  [
    'receipt',
    'C01H03',
    'Vật chứng',
    'Biên nhận của Bà Tư',
    'Bà Tư giữ biên nhận đã nộp đủ thóc, nhưng sổ vẫn ghi bà còn nợ.',
    ['ba_tu']
  ],
  [
    'ink',
    'C01H04',
    'Đối chiếu',
    'Hai màu mực',
    'Các dòng cũ viết bằng mực đen bị sửa tăng số nợ bằng mực xanh.',
    ['ba_tu']
  ],
  [
    'father',
    'C01H08',
    'Lời chứng',
    'Cha Bé Na là Vũ Bình',
    'Na nhận ra người gửi sổ. Giấy gói bánh mang chữ ký Vũ Bình, người chép sổ cho nha thu tô.',
    ['be_na', 'vu_binh']
  ],
  [
    'land',
    'C01H12',
    'Lời chứng',
    'Điểm chỉ vào giấy bán ruộng',
    'Trưởng xóm nói đã tưởng giấy xin hoãn nợ là giấy bán ruộng. Cần giữ cả giấy và lời khai.',
    ['truong_xom']
  ],
  [
    'route',
    'C01H14',
    'Vật chứng',
    'Phiếu chuyến xe đêm',
    'Phiếu hàng nối thóc Thanh Khê với những chuyến xe rời làng; người đánh xe là người làm thuê.',
    ['nguoi_danh_xe']
  ],
  [
    'missing',
    'C02H03',
    'Đối chiếu',
    'Hai vụ mất tích cùng chuyến hàng',
    'Danh sách Tiểu Muội mang có tên cha nàng, trùng chuyến thóc trên phiếu xe.',
    ['companion_03', 'cha_tieu_muoi']
  ],
  [
    'oldguide',
    'C02H06',
    'Lời chứng',
    'Lão Tam từng dẫn đường thu thóc',
    'Lão Tam kể mình từng đi cùng đoàn thu thóc. Đây là lời tự nhận, cần đối chiếu người bị hại.',
    ['companion_01']
  ],
  [
    'blueorder',
    'C03H06',
    'Lời chứng',
    'Vũ Bình chỉ các dòng bị sửa',
    'Vũ Bình nói cùng một lệnh tăng nợ nhiều hộ. Lời kể giúp đọc sổ, chưa thay được bản lệnh gốc.',
    ['vu_binh']
  ],
  [
    'guidefault',
    'C03H08',
    'Lời chứng',
    'Lỗi cũ của Lão Tam',
    'Vũ Bình nói Lão Tam từng giao người trốn chạy cho đội áp tải; Lão Tam nhận lỗi.',
    ['vu_binh', 'companion_01']
  ],
  [
    'wharf',
    'Q103',
    'Vật chứng',
    'Lối tới kho U Minh',
    'Nhóm qua cửa rừng, giữ phiếu hàng và tìm thấy lối mòn tới kho Đốc Lệ.',
    ['doc_le']
  ],
  [
    'survivor',
    'C04H08',
    'Lời chứng',
    'Người phu nhận ra người dẫn đường',
    'Người phu xác nhận mình bị bắt sau lần Lão Tam chỉ đường cho lính.',
    ['nguoi_phu', 'companion_01']
  ],
  [
    'silver',
    'C04H15',
    'Vật chứng',
    'Phiếu bạc Vạn Lợi',
    'Hòm lệnh có phiếu nhận bạc Vạn Lợi, nối kho thóc với tiền trả đội lính.',
    ['doc_le']
  ],
  [
    'host',
    'Q104',
    'Lời chứng',
    'Đốc Lệ chỉ tới hội võ',
    'Sau trận cửa rừng, Đốc Lệ nói người thuê mình ở hội võ Bình Định. Cần kiểm tra giấy tiền của hội.',
    ['doc_le']
  ],
  [
    'prize',
    'C05H06',
    'Đối chiếu',
    'Bảng thưởng khác tiền thực nhận',
    'Kha Vân nhận ra khoản thưởng niêm yết cao hơn số võ sĩ nhận; chênh lệch thành phí mới.',
    ['kha_van']
  ],
  [
    'ticket',
    'Q201',
    'Vật chứng',
    'Vé vào kho và danh sách võ sĩ',
    'Nhóm giữ vé vào kho Hoa Lư cùng danh sách người có giấy nợ bị sửa do Kha Vân giao.',
    ['kha_van']
  ],
  [
    'seal',
    'C06H06',
    'Vật chứng',
    'Dấu quan trấn trên bản sửa',
    'Bản sửa có dấu Đỗ Mậu. Chưa đủ kết luận ông trực tiếp sửa hay người khác đã dùng dấu.',
    ['do_mau']
  ],
  [
    'debtbuyer',
    'C06H15',
    'Vật chứng',
    'Phiếu chuyển quyền thu nợ',
    'Mặt sau phiếu ghi Vạn Lợi nhận quyền thu nợ; các khoản bị tăng cần đối chiếu bản gốc.',
    []
  ],
  [
    'original',
    'Q202',
    'Đối chiếu',
    'Hợp đồng gốc và bản sửa',
    'Bản gốc đủ đối chiếu các khoản tăng nợ. Cách sử dụng chứng cứ vẫn là lựa chọn của nhóm.',
    ['thu_lai', 'tho_giay']
  ],
  [
    'forgepay',
    'C07H06',
    'Vật chứng',
    'Sổ tiền xưởng rèn',
    'Thương hội trả tiền, hàng cấp cho lính dưới lệnh quan trấn; không có khoản chi từ kho công.',
    ['tho_bay']
  ],
  [
    'ring',
    'C07H08',
    'Lời chứng',
    'Nhẫn ngọc đen',
    'Học việc nhớ người nhận khuôn có nhẫn giống hình trên giấy mời của Trịnh Nghiêm. Đây mới là dấu nhận diện, chưa phải kết luận.',
    ['tho_bay', 'trinh_nghiem']
  ],
  [
    'mold',
    'Q203',
    'Vật chứng',
    'Khuôn dấu và người làm chứng',
    'Nhóm có khuôn cùng lời của Thợ Bảy; cách đưa lời khai ra ngoài tùy quyết định đã chọn.',
    ['tho_bay']
  ],
  [
    'wages',
    'C08H06',
    'Lời chứng',
    'Đỗ Mậu nhận bạc nuôi lính',
    'Đỗ Mậu thừa nhận nhận bạc Vạn Lợi, đổi lại cho thương hội nhận thóc và vũ khí.',
    ['do_mau']
  ],
  [
    'sickloan',
    'C08H08',
    'Lời chứng',
    'Khoản vay chữa bệnh',
    'Đỗ Mậu kể đã vay tiền chữa bệnh cho con gái và bị ép tiếp tục ký. Hoàn cảnh ấy không xóa trách nhiệm trên lệnh.',
    ['do_mau', 'co_gai']
  ],
  [
    'orders',
    'Q204',
    'Vật chứng',
    'Bản lệnh rời Hoa Lư',
    'Nhóm đưa bản lệnh cùng nhân chứng qua cổng thành để tiếp tục đối chiếu trên Yên Tử.',
    ['do_mau']
  ],
  [
    'copy',
    'C09H08',
    'Đối chiếu',
    'Bản chép từ Thanh Khê',
    'Bản Bà Tư gửi khớp dòng nợ và ngày chép trong sổ gốc, giúp kiểm tra bản nhóm đang giữ.',
    ['ba_tu', 'quan_chu']
  ],
  [
    'unpaid',
    'C09H15',
    'Vật chứng',
    'Phiếu công chưa được trả',
    'Người phu còn phiếu công vận hàng, trong khi thương hội đã ghi họ nhận cứu trợ.',
    ['nguoi_phu']
  ],
  [
    'stage',
    'C10H01',
    'Nghi vấn',
    'Dây sau sân khấu',
    'Cẩm Tú vận hành màn biểu diễn. Nhóm nghi màn cứu trợ và phép lạ được dàn dựng; cần cứu người và kiểm tra tời.',
    ['cam_tu', 'trinh_nghiem']
  ],
  [
    'stagechecked',
    'Q302',
    'Đối chiếu',
    'Đường dây và lối thoát',
    'Nhóm đã kiểm tra đường vận hành sân khấu và chuẩn bị bảo vệ người làm chứng trước giờ mở màn.',
    ['cam_tu']
  ],
  [
    'samecrack',
    'C11H08',
    'Đối chiếu',
    'Cùng một vết mẻ',
    'Thợ Bảy đặt khuôn lên mẫu đất: giấy nhận vũ khí và giấy tăng nợ có cùng vết mẻ.',
    ['tho_bay']
  ],
  [
    'public',
    'C11H15',
    'Đối chiếu',
    'Các phái dừng ký',
    'Sau khi kiểm tra giấy và sân khấu, các phái dừng ủng hộ những khoản nợ bị sửa.',
    ['trinh_nghiem']
  ],
  [
    'arrest',
    'Q303',
    'Kết quả',
    'Giữ được người đứng sau',
    'Nhóm đã hạ đội bảo vệ đài và giữ Trịnh Nghiêm. Việc xử lý chứng cứ còn tùy lựa chọn của bạn.',
    ['trinh_nghiem']
  ],
  [
    'returnland',
    'C12H06',
    'Kết quả',
    'Bà Tư nhận giấy trả ruộng',
    'Bà nhận giấy dừng chuyển ruộng và lịch đối chiếu; thiệt hại mùa lúa vẫn cần được khắc phục.',
    ['ba_tu']
  ],
  [
    'home',
    'C12H09',
    'Kết quả',
    'Vũ Bình trở về quán',
    'Vũ Bình đã trở lại quán. Những người sống sót tiếp tục chịu trách nhiệm về lời khai và việc mình từng làm.',
    ['vu_binh', 'be_na']
  ]
];
export const CASE_ENTRIES = deepFreeze(
  rows.map(([id, source, type, title, text, people]) => ({
    id,
    source,
    type,
    title,
    text,
    people
  }))
);
export const CASE_QUESTIONS = deepFreeze([
  {
    id: 'who',
    from: 'Q101',
    answered: 'C01H08',
    question: 'Ai đã gửi cuốn sổ và vì sao Bé Na nhận ra ông?',
    answer: 'Người gửi là Vũ Bình, cha Bé Na và là người chép sổ thu tô.'
  },
  {
    id: 'paid',
    from: 'C01H03',
    answered: 'C01H04',
    question: 'Vì sao dân đã nộp thóc mà vẫn còn nợ?',
    answer:
      'Các dòng nợ đã bị sửa tăng bằng mực khác. Bản lệnh và người cho sửa vẫn cần điều tra tiếp.'
  },
  {
    id: 'father',
    from: 'C02H03',
    answered: 'C04H08',
    question: 'Đoàn phu và chuyện cũ của Lão Tam liên quan thế nào?',
    answer:
      'Người phu xác nhận Lão Tam từng dẫn lính bắt mình. Lời tự nhận đã có người bị hại đối chiếu.'
  },
  {
    id: 'money',
    from: 'C04H15',
    answered: 'C07H06',
    question: 'Bạc Vạn Lợi đi đâu sau khi trả cho kho và hội võ?',
    answer:
      'Sổ xưởng rèn nối tiền thương hội với vũ khí cấp cho lính quan trấn.'
  },
  {
    id: 'stamp',
    from: 'C06H06',
    answered: 'C11H08',
    question: 'Dấu trên giấy tăng nợ có nối được tới khuôn thật không?',
    answer:
      'Mẫu đất từ khuôn của Thợ Bảy mang cùng vết mẻ trên giấy tăng nợ và nhận vũ khí.'
  },
  {
    id: 'liability',
    from: 'C08H08',
    answered: 'Q303',
    question: 'Hoàn cảnh của quan trấn có giải thích hết trách nhiệm không?',
    answer:
      'Nhóm đã giữ được Trịnh Nghiêm cùng các bằng chứng; chữ ký, tiền và lời khai vẫn phải được xử lý, không chỉ đổ lỗi cho một người.'
  }
]);
export const CASE_RELATIONS = deepFreeze([
  { from: 'be_na', to: 'vu_binh', source: 'C01H08', text: 'Con gái — cha' },
  {
    from: 'ba_tu',
    to: 'truong_xom',
    source: 'C01H12',
    text: 'Người bị lấy ruộng — người giải thích việc điểm chỉ'
  },
  {
    from: 'companion_03',
    to: 'cha_tieu_muoi',
    source: 'C02H03',
    text: 'Con gái đang tìm cha trong đoàn phu'
  },
  {
    from: 'companion_01',
    to: 'nguoi_phu',
    source: 'C04H08',
    text: 'Người từng dẫn lính — người bị bắt; Lão Tam đã nhận lỗi'
  },
  {
    from: 'tho_bay',
    to: 'do_mau',
    source: 'C07H06',
    text: 'Vũ khí từ xưởng cấp cho lính quan trấn'
  },
  {
    from: 'do_mau',
    to: 'co_gai',
    source: 'C08H08',
    text: 'Cha — con gái; lời kể về khoản vay chữa bệnh'
  },
  {
    from: 'cam_tu',
    to: 'trinh_nghiem',
    source: 'C10H01',
    text: 'Người vận hành sân khấu — người đứng biểu diễn'
  }
]);
