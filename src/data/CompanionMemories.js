import {affinityMilestoneDetails} from './AffinityMilestones.js';
import { COMPANIONS } from './CompanionsData.js';
import { DAI_VIET_CAST_BY_ID } from './DaiVietCast.js';
// Narrative content stage 1: no gameplay mutation. Every entry is anchored
// to the canonical companion ID and reuses the character's actual portrait.
const CHARACTER_ARCS = [
  {
    "id": "companion_01",
    "title": "Bữa cơm còn nóng",
    "turn": "Lão Tam giữ phần ăn cho đứa trẻ vắng mặt; tiếng cười giấu nỗi sợ không ai trở lại.",
    "mood": "humor"
  },
  {
    "id": "companion_02",
    "title": "Ván cờ chưa hết",
    "turn": "Huyền Đạo Trưởng từng thắng bằng cách giấu một quân; nay phải công khai nước đi sai.",
    "mood": "dramatic"
  },
  {
    "id": "companion_03",
    "title": "Con chuột trên mái",
    "turn": "Tiểu Muội Nga Mi học cách thừa nhận nỗi sợ trước người mình chữa bệnh.",
    "mood": "dramatic"
  },
  {
    "id": "companion_04",
    "title": "Ba mũi kim lạc",
    "turn": "Đường Thập Nhị phát hiện chính mẫu ám khí mình chế tạo đã bị dùng để hại người.",
    "mood": "dramatic"
  },
  {
    "id": "companion_05",
    "title": "Cánh cửa đủ rộng",
    "turn": "Đại Lực Kim Cang buộc phải chọn giữ danh dự hay mở cửa cho người từng chống mình.",
    "mood": "hopeful"
  },
  {
    "id": "companion_06",
    "title": "Lọ thuốc không tên",
    "turn": "Lý Độc Thủ tìm lại người sống sót từ một toa thuốc từng bị đánh tráo.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_07",
    "title": "Lịch trời đêm mưa",
    "turn": "Ngô Sách thú nhận một lần dự báo sai đã khiến đoàn thuyền mắc cạn.",
    "mood": "humor"
  },
  {
    "id": "companion_08",
    "title": "Khoản nợ của bến",
    "turn": "Mai Tước đối mặt người phu bị mất tiền vì tuyến nhà nàng đổi hướng.",
    "mood": "dramatic"
  },
  {
    "id": "companion_09",
    "title": "Tiếng mõ cuối ngày",
    "turn": "Một sư thái giữ tên người bệnh đã mất thay vì xóa họ khỏi sổ thuốc.",
    "mood": "hopeful"
  },
  {
    "id": "companion_10",
    "title": "Mũi tên hạ xuống",
    "turn": "Bách Bộ chọn ngừng bắn khi nhận ra người trước mặt chỉ đang đưa thư.",
    "mood": "dramatic"
  },
  {
    "id": "companion_11",
    "title": "Lời hứa trong gió",
    "turn": "Người giữ lời hứa nhận ra lời hứa cũ đã làm tổn thương người hiện tại.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_12",
    "title": "Đường kiếm không ký",
    "turn": "Kiếm khách từ chối lệnh không cho đọc, dù đồng đội gọi đó là hèn nhát.",
    "mood": "dramatic"
  },
  {
    "id": "companion_13",
    "title": "Mảnh vải vá dở",
    "turn": "Một vết khâu trên áo cho biết người bị thương từng cứu chính kẻ truy đuổi.",
    "mood": "humor"
  },
  {
    "id": "companion_14",
    "title": "Chiếc bẫy mở cửa",
    "turn": "Người giăng bẫy phải tháo bẫy của mình để cứu một sinh linh vô tội.",
    "mood": "dramatic"
  },
  {
    "id": "companion_15",
    "title": "Chén rượu thứ sáu",
    "turn": "Một lời đùa trong tửu quán dẫn đến cuộc gặp lại người bạn bị bỏ quên.",
    "mood": "dramatic"
  },
  {
    "id": "companion_16",
    "title": "Nửa canh tĩnh tọa",
    "turn": "Người tu hành phá lệ rời thiền định để nghe một đứa trẻ gọi cứu.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_17",
    "title": "Mũi châm không đau",
    "turn": "Người chữa bệnh chọn nói sự thật khó nghe thay vì an ủi bằng lời dối.",
    "mood": "hopeful"
  },
  {
    "id": "companion_18",
    "title": "Cánh chim về muộn",
    "turn": "Người đưa tin tìm thấy lá thư chưa từng đến tay người nhận.",
    "mood": "dramatic"
  },
  {
    "id": "companion_19",
    "title": "Trang sử bỏ trắng",
    "turn": "Người chép sử nhận ra mình từng xóa tên người vô tội.",
    "mood": "humor"
  },
  {
    "id": "companion_20",
    "title": "Đường về rừng cũ",
    "turn": "Người hộ viện gặp lại gia đình từng phải bỏ nhà vì cuộc hộ tống của mình.",
    "mood": "dramatic"
  },
  {
    "id": "companion_21",
    "title": "Con rối qua cầu",
    "turn": "Chú Tễu diễn một vở hài để trẻ em nhớ đường chạy khi có biến.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_22",
    "title": "Tên trên sổ thuốc",
    "turn": "Sen Non trả lại tên thật cho những bệnh nhân bị ghi là con nợ.",
    "mood": "dramatic"
  },
  {
    "id": "companion_23",
    "title": "Lá rụng sân chùa",
    "turn": "Mộc An tìm được tờ phiếu thu tô giấu dưới sân và phải chọn người tin cậy.",
    "mood": "dramatic"
  },
  {
    "id": "companion_24",
    "title": "Thanh kiếm bằng gỗ",
    "turn": "Lam Nhi thắng một cuộc đối chất mà không cần rút kiếm thật.",
    "mood": "dramatic"
  },
  {
    "id": "companion_25",
    "title": "Tiếng còi sai nhịp",
    "turn": "Tín Còi nhận ra thư giả nhờ một nhịp gọi đò không đúng.",
    "mood": "humor"
  },
  {
    "id": "companion_26",
    "title": "Chiếc mõ nứt",
    "turn": "Bàu Rách từ chối hát lời vu oan, dù chỉ còn một chiếc mõ vỡ.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_27",
    "title": "Sổ đò hai bờ",
    "turn": "Bảy Cò phải tự ghi cả chuyến đò khiến mình bị nghi ngờ.",
    "mood": "dramatic"
  },
  {
    "id": "companion_28",
    "title": "Vườn mận đầu mùa",
    "turn": "Mận Chua giữ vườn cho người hái quả và mời cả đối thủ ăn quả chua.",
    "mood": "dramatic"
  },
  {
    "id": "companion_29",
    "title": "Cổng mở lúc khuya",
    "turn": "Tùng Gầy cho người bệnh qua cổng, bất chấp lệnh cấm cũ.",
    "mood": "hopeful"
  },
  {
    "id": "companion_30",
    "title": "Mũi chỉ màu đỏ",
    "turn": "Cúc Mộc khâu lại chiếc áo mang chứng tích thương tích bị che giấu.",
    "mood": "dramatic"
  },
  {
    "id": "companion_31",
    "title": "Chuông đồng không tên",
    "turn": "Phúc Đồng tìm lại tên thợ từng bị xóa khỏi khuôn đúc.",
    "mood": "humor"
  },
  {
    "id": "companion_32",
    "title": "Tờ hợp đồng ướt",
    "turn": "Liễu Thanh trả lại quyền đọc và từ chối cho người hộ vệ bị ép ký.",
    "mood": "dramatic"
  },
  {
    "id": "companion_33",
    "title": "Đêm ở lều thuốc",
    "turn": "Trúc Yên bảo vệ bệnh án trước người muốn biến bệnh nhân thành kẻ trốn việc.",
    "mood": "hopeful"
  },
  {
    "id": "companion_34",
    "title": "Lồng chim bỏ ngỏ",
    "turn": "Vân Rổ tháo chiếc bẫy mình làm ra khi biết nó đang bị lạm dụng.",
    "mood": "dramatic"
  },
  {
    "id": "companion_35",
    "title": "Sáu chén không say",
    "turn": "Sáu Chén dùng trò vui để hòa giải hai người từng tranh một khoản nợ.",
    "mood": "dramatic"
  },
  {
    "id": "companion_36",
    "title": "Ghế đá không người",
    "turn": "Hạc Nâu giữ một chỗ ngồi cho người bạn không còn trở lại.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_37",
    "title": "Kim châm qua mùa",
    "turn": "Bạch Liên chọn cứu người từng làm hỏng danh tiếng mình.",
    "mood": "humor"
  },
  {
    "id": "companion_38",
    "title": "Cánh hải âu gãy",
    "turn": "Hải Âu đổi tuyến đưa tin để cứu người, chấp nhận thư đến muộn.",
    "mood": "dramatic"
  },
  {
    "id": "companion_39",
    "title": "Dấu mực trong gió",
    "turn": "Minh Khuê phát hiện trang ghi chép bị sửa sau khi người viết qua đời.",
    "mood": "dramatic"
  },
  {
    "id": "companion_40",
    "title": "Ngọn lửa bên rừng",
    "turn": "Sơn Lâm quay lại đón người bị bỏ sau cuộc tháo chạy.",
    "mood": "dramatic"
  },
  {
    "id": "companion_41",
    "title": "Bình rượu dưới mưa",
    "turn": "Đào Hồng nâng chén mừng một người còn sống, không mừng chiến thắng.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_42",
    "title": "Đóa quyên không nở",
    "turn": "Đỗ Quyên học cách chăm người bệnh mà không hứa điều không thể.",
    "mood": "dramatic"
  },
  {
    "id": "companion_43",
    "title": "Khúc nguyệt cầm đứt",
    "turn": "Nguyệt Cầm chơi nốt nhạc cuối cho người từng phản bội lời hẹn.",
    "mood": "humor"
  },
  {
    "id": "companion_44",
    "title": "Tiếng chuông không vang",
    "turn": "Lôi Chấn nhận lỗi khi sự im lặng của mình bị hiểu là đồng thuận.",
    "mood": "dramatic"
  },
  {
    "id": "companion_45",
    "title": "Mưa qua mái cũ",
    "turn": "Yên Vũ lần theo một bí mật được cất trong bản đồ thấm nước.",
    "mood": "hopeful"
  },
  {
    "id": "companion_46",
    "title": "Lối về của khách",
    "turn": "Phong Trần thôi chạy trốn và trở lại xin lỗi một người bạn cũ.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_47",
    "title": "Cánh sen cuối mùa",
    "turn": "Tố Tâm quyết định trao bí quyết chữa bệnh cho người khác tiếp nối.",
    "mood": "dramatic"
  },
  {
    "id": "companion_48",
    "title": "Dấu chân bùn đỏ",
    "turn": "Lạc Hồng nhận ra người mình đuổi theo từng cứu dân làng.",
    "mood": "dramatic"
  },
  {
    "id": "companion_49",
    "title": "Vũ khúc chưa hết",
    "turn": "Thiên Hương dựng một điệu múa để dẫn người qua vòng vây.",
    "mood": "humor"
  },
  {
    "id": "companion_50",
    "title": "Đường núi không tên",
    "turn": "Trường Sơn chấp nhận nhờ người dẫn đường thay vì một mình gánh hết.",
    "mood": "dramatic"
  },
  {
    "id": "companion_51",
    "title": "Lá thư có người nhận",
    "turn": "Tiểu Sáo bảo vệ thư đến tay người đọc thay vì chỉ hoàn thành chuyến giao.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_52",
    "title": "Dây neo giữ bạn",
    "turn": "A Lụa bỏ hàng nặng để thuyền không quá tải, cứu người trên bến.",
    "mood": "dramatic"
  },
  {
    "id": "companion_53",
    "title": "Trục xe nứt",
    "turn": "Thiết Yến dừng chuyến hàng dù ai cũng thúc đi cho kịp.",
    "mood": "hopeful"
  },
  {
    "id": "companion_54",
    "title": "Ngọn giáo trước cửa",
    "turn": "Vệ Thanh bảo vệ người làm chứng trước chính người ra lệnh cho mình.",
    "mood": "dramatic"
  },
  {
    "id": "companion_55",
    "title": "Một mạch đập thật",
    "turn": "Thanh Tâm ghi điều đã khám, không viết kết luận theo áp lực.",
    "mood": "humor"
  },
  {
    "id": "companion_56",
    "title": "Khoảng trắng bản đồ",
    "turn": "Truy Phong tìm thấy ngôi làng bị xóa khỏi bản đồ tuyến hàng.",
    "mood": "bittersweet"
  },
  {
    "id": "companion_57",
    "title": "Bức thư của Lục Thư",
    "turn": "Nguyệt Ảnh chọn chứng cứ thay vì trả thù người bị nghi oan.",
    "mood": "hopeful"
  },
  {
    "id": "companion_58",
    "title": "Chuyến xe cuối",
    "turn": "Hùng Côn quay lại nhận trách nhiệm với đoàn phu từng bị bỏ lại.",
    "mood": "dramatic"
  },
  {
    "id": "companion_59",
    "title": "Kiếm dừng trước người",
    "turn": "Kim Cang Thánh Mẫu dạy học trò thắng bằng cách để đối thủ còn đường sống.",
    "mood": "dramatic"
  },
  {
    "id": "companion_60",
    "title": "Đèn biển qua giông",
    "turn": "Thiên Âm giao quyền quyết con nước cho người lái đò, dù bản thân giữ mạng lưới tin.",
    "mood": "dramatic"
  }
];
const byId = Object.fromEntries(COMPANIONS.map(c => [c.id,c]));
const bondMilestones = [25,50,75,100];
function buildMemory(arc) {
  const c=byId[arc.id];
  if(!c) throw new Error('Missing canonical companion: '+arc.id);
  const canonical=DAI_VIET_CAST_BY_ID[arc.id];
  const name=canonical?.name ?? c.name;
  // Legacy nicknames in the authored arc must not leak into the canonical Đại Việt roster.
  const turn=arc.id==='companion_01'?arc.turn.replaceAll('Lão Tam',name):arc.turn;
  const portrait=canonical?.portrait ?? c.portrait ?? `assets/images/companions/${arc.id}.webp`;
  const skill=c.skills?.ultimate?.name ?? 'Tuyệt kỹ';
  const motive=canonical?.role ?? c.biography ?? c.recruitment?.description ?? '';
  const mission=c.recruitment?.description ?? '';
  const questId=`bond_${arc.id}_50`;
  const rewards=affinityMilestoneDetails(arc.id);
  return {
    ...arc, turn, name, sect:c.sect, portrait, motive, skill,
    unlocks:bondMilestones,
    chapters: [
      {at:25,reward:rewards[0],id:`memory_${arc.id}_25`,title:'Một lời thật lòng',
       text:`${name} kể về điều mình vẫn giấu sau những chuyến đi. ${motive} Người chơi có thể lắng nghe mà không cần phán xét.`,
       dialogue:[{speaker:name,text:turn},{speaker:'Trần Phong',text:'Ta muốn nghe chính lời ngươi, không nghe lời đồn.'}]},
      {at:50,reward:rewards[1],id:`memory_${arc.id}_50`,title:arc.title,
       text:`Từ câu chuyện cũ, một việc chưa giải quyết buộc ${name} trở lại nơi từng lảng tránh. ${turn}`,
       quest:{id:questId,objective:mission||turn,requiresCompanion:arc.id,
        completionFlag:`bond_quest_completed_${arc.id}`}},
      {at:75,reward:rewards[2],id:`memory_${arc.id}_75`,title:'Ngã rẽ của người đồng hành',
       text:`Giữa lúc ${arc.title.toLowerCase()}, ${name} phải quyết định điều nào đáng giữ hơn chiến thắng trước mắt.`,
       choices:[
         {id:`bond_${arc.id}_mercy`,label:'Giữ người và lời hứa',gain:'Tăng lòng tin của dân và đồng đội',cost:'Chậm một lượt hành trình; bỏ lỡ tài nguyên trước mắt'},
         {id:`bond_${arc.id}_truth`,label:'Giữ chứng cứ và sự thật',gain:'Mở thêm thông tin cho nhiệm vụ sau',cost:'Mất cơ hội nhận phần thưởng tức thời'}
       ]},
      {at:100,reward:rewards[3],id:`memory_${arc.id}_100`,title:'Sinh Tử Bất Phụ — '+arc.title,
       text:`${turn} Lần này ${name} không phải bước một mình. ${skill} trở thành dấu ấn của hành trình ấy.`,
       cutscene:{id:`bond_cutscene_${arc.id}`,portrait,background:'assets/images/world/world_map.webp',
        beats:[{kind:'portrait',text:turn},{kind:'dialogue',speaker:name,text:'Ta từng nghĩ đoạn đường này chỉ có một mình.'},
         {kind:'dialogue',speaker:'Trần Phong',text:'Giang hồ rộng lớn. Từ nay cùng đi.'},
         {kind:'skill',skillName:skill,text:'Duyên phận đã thành. Không quên lời hẹn.'}],
        skippable:true,replayable:true,reducedMotion:true}}
    ]
  };
}
export const COMPANION_MEMORIES = Object.freeze(CHARACTER_ARCS.map(buildMemory));
export const COMPANION_MEMORIES_BY_ID = Object.freeze(Object.fromEntries(COMPANION_MEMORIES.map(m=>[m.id,m])));
