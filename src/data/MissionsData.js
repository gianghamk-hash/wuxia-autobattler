import { deepFreeze } from './DataUtils.js';
import {DAI_VIET_MISSIONS} from './DaiVietMissions.js';
import {EXPANSION_MISSIONS} from './ExpansionMissions.js';
const definitions = [
  [
    'C01H09',
    'hold',
    'Giữ đường cho Na',
    30,
    'Giữ ít nhất một người chiến đấu sống trong 30 giây để quán chủ đưa Na đi. Hai toán truy bắt tới ở giây 10 và 20.',
    'Cả đội bị hạ trước khi Na thoát.'
  ],
  [
    'C01H14',
    'protect',
    'Giữ xe và phiếu hàng',
    25,
    'Giữ xe chở thóc còn HP trong 25 giây hoặc hạ hết đội áp tải. Một kẻ phá xe sẽ tìm cách vòng qua bạn.',
    'Xe bị phá hoặc cả đội chiến đấu bị hạ.'
  ],
  [
    'C04H02',
    'rescue',
    'Đưa người phu khỏi trại',
    2,
    'Tiếp cận trong một ô, giải cứu 2 giây rồi đưa người phu về mép sân nhà. Có thể ưu tiên cứu sớm; sau khi hết địch, đội tự tới cứu.',
    'Người phu bị hạ sau khi được thả, cả đội bị hạ hoặc hết 120 giây.'
  ],
  [
    'C04H10',
    'rescue',
    'Cứu người khỏi dãy nhà',
    2,
    'Ưu tiên cứu để cử người tiếp cận, mở trói 2 giây rồi hộ tống ra mép sân nhà. Nếu hạ hết lính trước, đội tự giải cứu.',
    'Người được cứu bị hạ, cả đội bị hạ hoặc hết 120 giây.'
  ],
  [
    'C06H12',
    'breach',
    'Mở ba chốt kho',
    3,
    'Phá ba chốt niêm phong để lấy giấy đối chiếu. Có thể tập trung đánh chốt; không bắt buộc hạ toàn bộ lính.',
    'Cả đội bị hạ hoặc hết 120 giây khi chốt chưa được mở đủ.'
  ],
  [
    'C07H13',
    'protect',
    'Bảo vệ hòm khuôn dấu',
    25,
    'Giữ hòm khuôn dấu trong 25 giây hoặc hạ hết đội truy cướp. Kẻ phá hòm ưu tiên mục tiêu này; khiêu khích có thể kéo hắn ra.',
    'Hòm bị phá hoặc cả đội bị hạ.'
  ],
  [
    'C10H18',
    'breach',
    'Phá khóa tời bị chiếm',
    3,
    'Phá ba khóa tời do hộ vệ giữ để bảo toàn đường vận hành sân khấu. Thắng ngay khi đủ ba khóa bị phá.',
    'Cả đội bị hạ hoặc hết 120 giây khi khóa còn nguyên.'
  ],
  [
    'C11H02',
    'hold',
    'Mở lối cho khán giả',
    30,
    'Giữ ít nhất một người chiến đấu sống đủ 30 giây để khán giả rút. Hộ vệ tiếp viện ở giây 10 và 20.',
    'Cả đội bị hạ trước khi khán giả rút hết.'
  ],
  [
    'C12H14',
    'protect',
    'Giữ chuyến thóc trả làng',
    25,
    'Bảo vệ xe thóc 25 giây hoặc đẩy lui hết toán cướp. Chặn kẻ phá xe để giữ phần thóc đang trả cho dân.',
    'Xe bị phá hoặc cả đội bị hạ.'
  ]
];
export const MISSIONS = deepFreeze(
  Object.fromEntries(
    [...definitions.map(([id, type, title, duration, description, failure]) => [
      id,
      { id, type, title, duration, description, failure }
    ]),...Object.entries(DAI_VIET_MISSIONS),...Object.entries(EXPANSION_MISSIONS)]
  )
);
