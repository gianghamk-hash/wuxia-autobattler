import { deepFreeze } from './DataUtils.js';
import { COMPANIONS } from './CompanionsData.js';

export const MAIN_QUESTS = deepFreeze([
  { id: 'Q101', act: 1, title: 'Quán trọ Rồng Lửa', location: 'Trấn Thanh Khê', level: 1, xp: 120, silver: 20,
    lines: [['Người kể', 'Bạn là tiểu nhị quán trọ Rồng Lửa. Sáng nay, cả giang hồ kéo đến tìm một cuốn bí kíp. Tối qua, bạn dùng nó kê chân bàn.'], ['Bộ khoái', 'Kẻ trộm bí kíp! Đứng lại!'], ['Bạn', 'Tôi còn chưa được trả lương tháng này. Ăn trộm thứ có tiền thì còn hiểu được!']],
    choices: [{ id: 'protect', text: 'Đưa khách trọ ra ngoài, rồi tìm đường thoát.', karma: 1 }, { id: 'escape', text: 'Giữ mạng trước, minh oan sau.', karma: 0 }], encounter: 'inn_escape' },
  { id: 'Q102', act: 1, title: 'Một người không thành giang hồ', location: 'Ngoại ô Thanh Khê', level: 2, xp: 160, silver: 20,
    lines: [['Người kể', 'Lão Tam Ăn Mày nghe tin bí kíp mất tích, liền hỏi bí kíp có đổi được đùi gà không. Tiểu Muội Nga Mi ở gần đó đang mắc kẹt trên cây.'], ['Lão Tam', 'Muốn đi xa phải có bạn. Muốn có bạn thì trước hết phải có bữa tối.']],
    objective: ['companion_01', 'companion_03'], choices: [{ id: 'together', text: 'Mời Lão Tam và Tiểu Muội cùng lên đường.', karma: 1 }] },
  { id: 'Q103', act: 1, title: 'Chiếc bàn và lời vu oan', location: 'Bến Liễu', level: 3, xp: 300, silver: 40,
    lines: [['Tiểu Muội', 'Dấu chân trong quán trọ không phải của huynh. Người kia đi giày thêu chữ “chính nghĩa”.'], ['Lão Tam', 'Giày đắt thế mà vẫn đi ăn trộm. Nghề của ta còn có đạo đức hơn.']],
    choices: [{ id: 'witness', text: 'Bảo vệ nhân chứng ở bến thuyền.', karma: 1 }, { id: 'bluff', text: 'Giả làm đệ tử danh môn để vượt chốt.', karma: -1 }], encounter: 'willow_ferry' },
  { id: 'Q104', act: 1, title: 'Đêm ở phân đà', location: 'Phân đà Hắc Phong', level: 4, xp: 500, silver: 60,
    lines: [['Phân đà chủ', 'Nộp bí kíp ra đây!'], ['Bạn', 'Ông có biết nội dung cuốn đó không?'], ['Phân đà chủ', 'Không. Nhưng người trả tiền bảo ta phải tỏ ra rất quan tâm.']],
    choices: [{ id: 'mercy', text: 'Đánh bại rồi thả những người bị ép đi truy bắt.', karma: 1 }, { id: 'seize', text: 'Tịch thu tiền công của nhóm truy bắt.', karma: -1 }], encounter: 'black_wind' },
  { id: 'Q201', act: 2, title: 'Đại Hội Quần Hùng', location: 'Võ đài Hoa Sơn', level: 5, xp: 700, silver: 80,
    lines: [['Chủ hội', 'Đại hội công bằng tuyệt đối! Ai đóng thêm lệ phí được bốc thăm hai lần.'], ['Lão Tam', 'Vậy ai không có tiền như ta có được thua miễn phí không?']],
    choices: [{ id: 'fair', text: 'Thi đấu đường hoàng để được lên tiếng.', karma: 1 }, { id: 'sponsor', text: 'Giả làm nhà tài trợ để điều tra hậu trường.', karma: -1 }], encounter: 'tournament' },
  { id: 'Q202', act: 2, title: 'Bí kíp không có võ công', location: 'Kho hàng Vạn Lợi', level: 6, xp: 850, silver: 100,
    lines: [['Bạn', 'Trang một: “Chưởng môn nợ ba trăm lượng”. Trang hai: “Đất hậu sơn đang thế chấp”.'], ['Tiểu Muội', 'Bí kíp mà cả giang hồ tranh giành… là sổ nợ cờ bạc và hợp đồng bán đất?'], ['Lão Tam', 'Ta biết mà. Đòn lợi hại nhất ở đời là đòi nợ.']],
    choices: [{ id: 'copy', text: 'Sao lại sổ nợ, giữ bằng chứng cho dân chúng.', karma: 1 }, { id: 'leverage', text: 'Giữ bản gốc làm con bài thương lượng.', karma: -1 }], flags: { DISCOVERED_DEBT_BOOK: true }, encounter: 'warehouse' },
  { id: 'Q203', act: 2, title: 'Bí kíp bảo hành một buổi', location: 'Chợ đêm Huyền Cơ', level: 7, xp: 1000, silver: 120,
    lines: [['Thương nhân', 'Kiếm này chém sắt như bùn! Xin quý khách đừng thử với sắt thật.'], ['Người kể', 'Vũ khí rởm, đan dược giả và hợp đồng độc quyền đều dẫn về một người đứng sau đại hội.']],
    choices: [{ id: 'expose', text: 'Bảo vệ người bán rong để họ chịu làm chứng.', karma: 1 }, { id: 'trade', text: 'Dùng sổ nợ ép thương nhân khai ra.', karma: -1 }], gearReward: true, encounter: 'night_market' },
  { id: 'Q204', act: 2, title: 'Danh môn ký tên', location: 'Sảnh Liên Minh', level: 9, xp: 1400, silver: 150,
    lines: [['Chưởng môn', 'Ta chỉ ký hợp đồng, hoàn toàn không biết bán bí kíp giả là trái đạo nghĩa.'], ['Bạn', 'Chữ ký ở cả mục “chia lợi nhuận” cũng là không biết sao?']],
    choices: [{ id: 'protect', text: 'Đưa nhân chứng rời khỏi liên minh.', karma: 1 }, { id: 'threaten', text: 'Buộc các chưởng môn giao nộp tài sản.', karma: -1 }], encounter: 'alliance' },
  { id: 'Q301', act: 3, title: 'Tuyết Sơn không nhận giấy nợ', location: 'Đường lên Tuyết Sơn', level: 10, xp: 1600, silver: 180,
    lines: [['Người kể', 'Tuyết phủ trắng đường núi. Những người tự xưng chính phái chặn lối bằng cả đao kiếm lẫn điều khoản hợp đồng.'], ['Tiểu Muội', 'Đứng sau lưng nhau thì ấm hơn. Lần này đừng ai bỏ ai lại.']],
    choices: [{ id: 'rescue', text: 'Cứu người khuân vác mắc kẹt trong tuyết.', karma: 1 }, { id: 'press', text: 'Tiến thẳng lên đỉnh để chặn chủ mưu.', karma: -1 }], encounter: 'snow_pass' },
  { id: 'Q302', act: 3, title: 'Chưởng phong mùi pháo', location: 'Hậu trường Thiên Đài', level: 12, xp: 1900, silver: 200,
    lines: [['Diễn viên đóng thế', 'Tôi chỉ nhận tiền đứng trong khói! Chưởng phong là pháo hoa, khinh công là dây kéo.'], ['Bạn', 'Vậy Minh Chủ không biết võ?'], ['Diễn viên đóng thế', 'Ông ấy biết tính lãi kép. Trong giang hồ này cũng gần như thần công.']],
    choices: [{ id: 'shelter', text: 'Bảo vệ người diễn thay, công khai trò lừa.', karma: 1 }, { id: 'hire', text: 'Giữ bí mật để xoay chuyển thế cờ.', karma: -1 }], flags: { DISCOVERED_FAKE_LEADER: true }, encounter: 'backstage' },
  { id: 'Q303', act: 3, title: 'Chân tướng đại bạch', location: 'Đỉnh Tuyết Sơn', level: 14, xp: 2400, silver: 250,
    lines: [['Minh Chủ', 'Ta không lừa giang hồ. Ta chỉ cung cấp câu chuyện mà họ muốn mua.'], ['Bạn', 'Hôm nay, người trả giá sẽ được tự chọn câu chuyện của mình.']],
    choices: [{ id: 'justice', text: 'Đối mặt liên minh và bảo vệ bằng chứng.', karma: 1 }, { id: 'power', text: 'Đánh bại họ để nắm quyền định đoạt.', karma: -1 }], encounter: 'summit' },
  { id: 'Q304', act: 3, title: 'Giang hồ sau tiếng trống', location: 'Bình minh Tuyết Sơn', level: 14, xp: 0, silver: 0,
    lines: [['Người kể', 'Đao kiếm đã hạ. Sổ nợ vẫn nằm trong tay bạn. Những người đồng hành đang chờ quyết định cuối cùng.'], ['Bạn', 'Đi hết một vòng giang hồ, cuối cùng vẫn phải chọn mình muốn trở thành ai.']], ending: true, choices: [] }
]);
export const MAIN_BY_ID = deepFreeze(Object.fromEntries(MAIN_QUESTS.map(quest => [quest.id, quest])));
export const ENDINGS = deepFreeze([
  { id: 'justice', name: 'Minh Chủ Liêm Khiết', description: 'Công khai sổ nợ; bắt các chưởng môn lao động công ích chuộc tội.', requirement: 'Nhân nghĩa ít nhất 2; đã tìm được sổ nợ.', lines: [['Bạn', 'Giấy nợ không khiến một người thành chủ thiên hạ. Trách nhiệm mới khiến người ấy xứng đáng.'], ['Người kể', 'Các chưởng môn bắt đầu một mùa quét phố. Dân chúng lần đầu thấy thần công có ích cho vỉa hè.']] },
  { id: 'wealth', name: 'Trùm Tài Phiệt Giang Hồ', description: 'Giữ sổ nợ và biến các khoản vay thành đế chế thương mại.', requirement: 'Sở hữu ít nhất 100 lượng bạc.', lines: [['Bạn', 'Không ai phải chết. Chỉ cần mọi người trả đúng kỳ hạn.'], ['Người kể', 'Giang hồ bước vào thời đại mới: đao kiếm được cất đi, bộ phận thu hồi công nợ bắt đầu làm việc.']] },
  { id: 'retire', name: 'Quy Ẩn Bán Bún Đậu', description: 'Rời giang hồ cùng hai tri kỷ, mở quán ăn ven đường.', requirement: 'Hai đồng đội xuất chiến có duyên nợ ít nhất 30.', lines: [['Lão Tam', 'Ta nhận chức nếm thử. Không cần lương, chỉ cần không giới hạn khẩu phần.'], ['Người kể', 'Có người tìm cả đời một ngôi minh chủ. Bạn tìm được hai chiếc ghế bên bàn ăn và biết như thế là đủ.']] },
  { id: 'actor', name: 'Diễn Viên Đóng Thế', description: 'Tiếp quản sân khấu Minh Chủ, dùng ảo thuật đổi cách kể chuyện giang hồ.', requirement: 'Luôn có thể chọn sau trận cuối.', lines: [['Bạn', 'Lần này khán giả sẽ được biết đâu là sân khấu.'], ['Người kể', 'Tấm biển mới dựng trước Thiên Đài: “Chưởng phong biểu diễn, xin đừng tập theo tại nhà”.']] }
]);
export const PUZZLES = deepFreeze({
  go_wager: { prompt: 'Quân cờ của Huyền Đạo Trưởng chỉ còn một khí ở bên trái. Đặt quân ở đâu để bắt nhóm đó?', options: ['Bên trái, chặn khí cuối', 'Giữa bàn cho đẹp', 'Nhường lượt để xin rượu'], correct: 0 },
  arm_wrestling: { prompt: 'Đại Lực Kim Cang khỏe hơn bạn. Cách vật tay nào hợp lý?', options: ['Gồng ngay khi chưa đặt khuỷu', 'Giữ khuỷu vững, dùng đòn bẩy', 'Dùng tay còn lại kéo ghế'], correct: 1 },
  archery_contest: { prompt: 'Gió đang thổi từ trái sang phải. Muốn trúng hồng tâm, nên ngắm thế nào?', options: ['Lệch nhẹ sang trái để bù gió', 'Lệch sang phải theo gió', 'Nhắm mắt rồi tin cơ duyên'], correct: 0 },
  rooftop_race: { prompt: 'Mái ngói bên trái ướt, ván giữa đã mục, gờ đá bên phải khô. Bạn chọn đường nào?', options: ['Mái ngói ướt', 'Ván mục ở giữa', 'Gờ đá khô bên phải'], correct: 2 }
});
const rescuePuzzles = {
  companion_03: ['Tiểu Muội sợ chuột trên cành cây. Cách cứu an toàn?', ['Buộc dây vào cành chắc rồi đỡ nàng xuống', 'Rung cây thật mạnh', 'Thả thêm một con chuột'], 0, 'rope'],
  companion_09: ['Mèo cưng trốn trong hốc đá. Nên làm gì?', ['Dọa cho mèo chạy', 'Dùng cá dụ mèo ra, để đường thoát rộng', 'Bịt hết lối ra'], 1, 'food_fish'],
  companion_11: ['Kẻ bảo kê đòi 20 lượng. Làm sao giúp Mộng Cô mà không để quán bị phá?', ['Trả giúp, ghi lại bằng chứng để tố cáo', 'Hứa trả vào năm sau', 'Đập quán trước cho họ khỏi phá'], 0, 'silver'],
  companion_04: ['Bẫy chuột kẹp chân chủ nhân. Phải làm bước nào trước?', ['Kéo chân ra thật mạnh', 'Giữ lò xo rồi mở ngàm bẫy', 'Đặt thêm một cái bẫy'], 1, null],
  companion_13: ['Lão nhân đang ngủ ba ngày. Nên đánh thức thế nào?', ['Đốt cả chăn', 'Gõ chuông nhẹ, gọi tên và kiểm tra phản ứng', 'Hắt nước đá'], 1, null],
  companion_18: ['Tảng đá chặn động có một khe nứt. Cách phá hợp lý?', ['Húc vào giữa đá dày nhất', 'Bảo mọi người đứng sát xem', 'Gia cố trán, đánh đúng khe nứt khi mọi người đã lùi xa'], 2, null]
};
export const RECRUIT_QUESTS = deepFreeze(COMPANIONS.map((unit, i) => {
  const condition = unit.recruitment.conditions[0];
  const custom = rescuePuzzles[unit.id];
  const puzzle = condition.type === 'win_minigame' ? PUZZLES[condition.gameId] : custom ? { prompt: custom[0], options: custom[1], correct: custom[2] } : null;
  return { id: unit.recruitment.questId, companionId: unit.id, title: unit.name, description: unit.recruitment.description,
    act: [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3][i],
    level: Math.max(1, Math.floor(i / 2)), xp: 80 + i * 25, silver: 15 + i * 3,
    condition, puzzle, cost: custom?.[3] ? { itemId: custom[3], quantity: unit.id === 'companion_11' ? 20 : 1 } : null,
    lines: [[unit.name, unit.recruitment.description], ['Bạn', 'Nếu giúp được nhau, chúng ta cùng đi một đoạn đường.']]
  };
}));
export const RECRUIT_BY_ID = deepFreeze(Object.fromEntries(RECRUIT_QUESTS.map(q => [q.id, q])));
