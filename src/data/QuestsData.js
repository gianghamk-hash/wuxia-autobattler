import { STORY_ENDINGS } from './StoryEndings.js';
import { deepFreeze } from './DataUtils.js';
import { buildMainStory } from './StoryChaptersData.js';
import { COMPANIONS } from './CompanionsData.js';
// Đại Việt giả tưởng: folklore-inspired geography, not a reconstruction of a historical dynasty.
export const LEGACY_MAIN_QUESTS = deepFreeze([
  {
    id: 'Q101',
    act: 1,
    title: 'Quán trọ Rồng Lửa',
    location: 'Làng Thanh Khê · Đại Việt giả tưởng',
    level: 1,
    xp: 120,
    silver: 20,
    encounter: 'inn_escape',
    lines: [
      [
        'Người kể',
        'Bạn là tiểu nhị quán trọ, nhặt được cuốn sổ thu tô bị bỏ quên. Quan thuế thuê giang hồ đến lấy lại.'
      ],
      [
        'Lão Tam',
        'Một chữ cũng là thầy, nửa bát cơm cũng là ơn. Đừng giao dân làng cho đám ấy.'
      ]
    ],
    choices: [
      {
        id: 'protect',
        text: 'Bảo vệ dân làng, giữ cuốn sổ làm bằng chứng.',
        karma: 1
      },
      { id: 'escape', text: 'Giữ sổ để mặc cả, bỏ mặc dân làng.', karma: -1 }
    ]
  },
  {
    id: 'Q102',
    act: 1,
    title: 'Một cây làm chẳng nên non',
    location: 'Bến nước Thanh Khê',
    level: 2,
    xp: 160,
    silver: 20,
    objective: ['companion_01', 'companion_03'],
    lines: [
      [
        'Lão Tam',
        'Muốn đi xa phải có bạn, muốn có bạn trước hết phải có bữa tối.'
      ],
      [
        'Người kể',
        'Giúp Lão Tam tìm thức ăn, cứu Tiểu Muội trên cây rồi cùng lên đường. Hai người sẽ giúp bạn vượt ải kế.'
      ]
    ],
    choices: [
      {
        id: 'together',
        text: 'Mời hai người cùng điều tra vụ thu tô.',
        karma: 1
      }
    ]
  },
  {
    id: 'Q103',
    act: 1,
    title: 'Bến nước và lời vu oan',
    location: 'Bến Liễu · đường về Hoa Lư',
    level: 3,
    xp: 300,
    silver: 35,
    encounter: 'willow_ferry',
    lines: [
      [
        'Tiểu Muội',
        'Người chép sổ đang trốn ở bến. Không có lời chứng, dân làng sẽ chịu tội.'
      ],
      [
        'Lão Tam',
        'Quan nói thu đúng, dân nói thu đủ. Vậy phần dư chắc là tiền… thu đúng đủ hai lần.'
      ]
    ],
    choices: [
      { id: 'witness', text: 'Đưa người chép sổ về làm chứng.', karma: 1 },
      { id: 'bluff', text: 'Giả làm tay sai để lấy luôn tiền thuế.', karma: -1 }
    ]
  },
  {
    id: 'Q104',
    act: 1,
    title: 'Trấn thủ U Minh',
    location: 'Cửa rừng U Minh · Boss Hồi I',
    level: 4,
    xp: 500,
    silver: 65,
    encounter: 'black_wind',
    lines: [
      ['Trấn thủ', 'Có tiền thì qua, không tiền thì đưa sổ!'],
      ['Bạn', 'Ăn quả nhớ kẻ trồng cây; sao các ông chặt luôn cả gốc?']
    ],
    choices: [
      {
        id: 'mercy',
        text: 'Đánh bại trấn thủ, thả người bị ép làm tay sai.',
        karma: 1
      },
      { id: 'seize', text: 'Chiếm kho bạc và nhận luôn địa bàn.', karma: -1 }
    ]
  },
  {
    id: 'Q201',
    act: 2,
    title: 'Hội võ Bình Định',
    location: 'Sân võ Bình Định',
    level: 5,
    xp: 700,
    silver: 65,
    encounter: 'tournament',
    lines: [
      [
        'Chủ hội',
        'Đấu công bằng! Ai mua vé ngồi gần sẽ được… bốc thăm xa đối thủ mạnh.'
      ],
      ['Bạn', 'Phải thắng hội võ mới được vào kho sổ của liên minh.']
    ],
    choices: [
      { id: 'fair', text: 'Thi đấu đường hoàng, xin dân làm chứng.', karma: 1 },
      {
        id: 'sponsor',
        text: 'Mua đường tắt bằng một lời hứa chia lợi.',
        karma: -1
      }
    ]
  },
  {
    id: 'Q202',
    act: 2,
    title: 'Sổ đỏ mặt, lòng đen thui',
    location: 'Kho tô thuế Hoa Lư',
    level: 6,
    xp: 850,
    silver: 85,
    flags: { DISCOVERED_DEBT_BOOK: true },
    encounter: 'warehouse',
    lines: [
      [
        'Bạn',
        'Đây không phải bí kíp. Là sổ tô thuế giả và giấy bán ruộng của cả làng.'
      ],
      ['Tiểu Muội', 'Người nghèo bị ghi nợ cả phần đã nộp.'],
      ['Lão Tam', 'Bút sa gà chết, ở đây bút sa thì… cả làng mất ruộng.']
    ],
    choices: [
      { id: 'copy', text: 'Sao sổ để trả ruộng cho dân.', karma: 1 },
      {
        id: 'leverage',
        text: 'Giữ sổ để ép quan và giang hồ phục tùng.',
        karma: -1
      }
    ]
  },
  {
    id: 'Q203',
    act: 2,
    title: 'Rèn sắt còn nóng, đừng rèn lời',
    location: 'Chợ rèn bên thành',
    level: 7,
    xp: 1000,
    silver: 95,
    gearReward: true,
    encounter: 'night_market',
    lines: [
      ['Thợ rèn', 'Kiếm này chém sắt như bùn. Xin đừng thử với sắt thật!'],
      [
        'Người kể',
        'Dấu đóng trên vũ khí giả trùng với dấu trong sổ thuế. Người thợ chịu khai nếu được bảo vệ.'
      ]
    ],
    choices: [
      {
        id: 'expose',
        text: 'Bảo vệ thợ rèn, giữ lời khai công khai.',
        karma: 1
      },
      { id: 'trade', text: 'Ép thợ rèn phục vụ riêng cho mình.', karma: -1 }
    ]
  },
  {
    id: 'Q204',
    act: 2,
    title: 'Cửa thành Hoa Lư',
    location: 'Thành cổ Hoa Lư · Boss Hồi II',
    level: 9,
    xp: 1400,
    silver: 140,
    encounter: 'alliance',
    lines: [
      ['Trấn quan', 'Ta ký giấy nhưng không biết họ dùng để lấy ruộng.'],
      [
        'Bạn',
        'Mục chia bạc cũng có chữ ký của ông. Chắc tay ông biết nhiều hơn ông.'
      ]
    ],
    choices: [
      {
        id: 'protect',
        text: 'Đưa nhân chứng và dân làng qua cửa thành.',
        karma: 1
      },
      { id: 'threaten', text: 'Buộc quan giao ấn tín cho mình.', karma: -1 }
    ]
  },
  {
    id: 'Q301',
    act: 3,
    title: 'Đường lên Yên Tử',
    location: 'Đèo Yên Tử',
    level: 10,
    xp: 1600,
    silver: 150,
    encounter: 'snow_pass',
    lines: [
      [
        'Người kể',
        'Chủ mưu trốn trên Yên Tử. Trên đường, đoàn phu gánh hàng bị lính chặn lại.'
      ],
      [
        'Tiểu Muội',
        'Thương người như thể thương thân. Xin đừng coi họ là vật cản.'
      ]
    ],
    choices: [
      { id: 'rescue', text: 'Cứu phu gánh hàng rồi cùng lên núi.', karma: 1 },
      { id: 'press', text: 'Bỏ mặc đoàn phu, chiếm đường trước.', karma: -1 }
    ]
  },
  {
    id: 'Q302',
    act: 3,
    title: 'Chưởng phong mùi pháo',
    location: 'Sân khấu Yên Tử',
    level: 12,
    xp: 1900,
    silver: 170,
    flags: { DISCOVERED_FAKE_LEADER: true },
    encounter: 'backstage',
    lines: [
      [
        'Người đóng thế',
        'Minh chủ thuê tôi đứng trong khói; chưởng là pháo, khinh công là dây.'
      ],
      ['Lão Tam', 'Tưởng cao thủ nội công, hóa ra cao thủ… nội dung.']
    ],
    choices: [
      {
        id: 'shelter',
        text: 'Bảo vệ người đóng thế và công khai trò lừa.',
        karma: 1
      },
      { id: 'hire', text: 'Giữ trò lừa để mình dùng sau.', karma: -1 }
    ]
  },
  {
    id: 'Q303',
    act: 3,
    title: 'Giữ dân hay giữ ngôi?',
    location: 'Đỉnh Yên Tử · Boss Hồi III',
    level: 14,
    xp: 2400,
    silver: 220,
    encounter: 'summit',
    lines: [
      ['Minh chủ', 'Ai cầm sổ và ấn thì người ấy có quyền.'],
      [
        'Bạn',
        'Quyền để giữ dân, hay để bắt dân giữ ngôi? Hôm nay phải nói cho rõ.'
      ]
    ],
    choices: [
      { id: 'justice', text: 'Hạ minh chủ, trả sổ và ấn cho dân.', karma: 1 },
      { id: 'power', text: 'Hạ minh chủ để tự nắm quyền.', karma: -1 }
    ]
  },
  {
    id: 'Q304',
    act: 3,
    title: 'Bốn ngả đường giang hồ',
    location: 'Bình minh Hoa Lư',
    level: 14,
    xp: 0,
    silver: 0,
    ending: true,
    choices: [],
    lines: [
      [
        'Người kể',
        'Sổ thuế, ấn tín và người đồng hành đều ở đây. Bạn đã chọn gì suốt đường đi? Mở Nhật ký giang hồ nếu muốn nhớ lại.'
      ],
      [
        'Bạn',
        'Chính đạo, tà đạo, ẩn dật hay xưng vương: lần này ta chọn bằng cả hành trình.'
      ]
    ]
  }
]);
export const MAIN_QUESTS = buildMainStory(LEGACY_MAIN_QUESTS);
export const MAIN_BY_ID = deepFreeze(
  Object.fromEntries(MAIN_QUESTS.map((q) => [q.id, q]))
);
const ENDING_DEFINITIONS = [
  {
    id: 'justice',
    name: 'Chính đạo · Hiệp nghĩa Đại Việt',
    requirement: 'Nhân nghĩa từ +2; có bằng chứng sổ tô thuế.',
    description: 'Trả ruộng cho dân, lập hội nghĩa hiệp.',
    lines: [
      [
        'Bạn',
        'Ở hiền không tự gặp lành. Có lúc phải đứng ra giữ lấy điều lành.'
      ],
      [
        'Người kể',
        'Sổ thuế được công khai. Quán trọ thêm một tấm biển: dân làng làm chủ, giang hồ giữ lời.'
      ]
    ]
  },
  {
    id: 'wealth',
    name: 'Tà đạo · Chúa đất giang hồ',
    requirement: 'Nhân nghĩa từ −2 trở xuống và chi 100 bạc.',
    description: 'Dùng sổ thuế và vũ lực để thống trị.',
    lines: [
      ['Bạn', 'Ai nợ ai không quan trọng. Quan trọng là tất cả phải nợ ta.'],
      [
        'Người kể',
        'Bạn có cả giang hồ trong tay, chỉ không còn chiếc ghế trống bên bàn bạn cũ.'
      ]
    ]
  },
  {
    id: 'retire',
    name: 'Ẩn dật · Bún đậu tri kỷ',
    requirement: 'Luôn có thể chọn sau trận cuối.',
    description: 'Buông quyền lực, về mở quán với bạn bè.',
    lines: [
      [
        'Lão Tam',
        'Ta xin chức nếm thử. Lương không cần, chỉ cần đừng đếm miếng đậu.'
      ],
      [
        'Người kể',
        'Giang hồ có thể thiếu một minh chủ, nhưng quán nhỏ không thiếu người trở về.'
      ]
    ]
  },
  {
    id: 'actor',
    name: 'Xưng vương · Ngai vàng Hoa Lư',
    requirement: 'Chi 500 bạc dựng chính quyền mới sau khi thắng minh chủ.',
    description: 'Nhận ấn, dựng triều đình trong Đại Việt giả tưởng.',
    lines: [
      [
        'Bạn',
        'Dân có thể đưa thuyền đi, cũng có thể lật thuyền. Ta nhận ngôi, cũng nhận trách nhiệm.'
      ],
      [
        'Người kể',
        'Bức chiếu đầu tiên không bàn long bào. Nó bàn miễn tô và trả công cho người gánh hàng.'
      ]
    ]
  }
];
export const ENDINGS = deepFreeze(
  ENDING_DEFINITIONS.map((e) => ({ ...e, lines: STORY_ENDINGS[e.id] }))
);

export const PUZZLES = deepFreeze({
  go_wager: {
    prompt:
      'Quân cờ của Huyền Đạo Trưởng chỉ còn một khí ở bên trái. Đặt quân ở đâu để bắt nhóm đó?',
    options: [
      'Bên trái, chặn khí cuối',
      'Giữa bàn cho đẹp',
      'Nhường lượt để xin rượu'
    ],
    correct: 0
  },
  arm_wrestling: {
    prompt: 'Đại Lực Kim Cang khỏe hơn bạn. Cách vật tay nào hợp lý?',
    options: [
      'Gồng ngay khi chưa đặt khuỷu',
      'Giữ khuỷu vững, dùng đòn bẩy',
      'Dùng tay còn lại kéo ghế'
    ],
    correct: 1
  },
  archery_contest: {
    prompt:
      'Gió đang thổi từ trái sang phải. Muốn trúng hồng tâm, nên ngắm thế nào?',
    options: [
      'Lệch nhẹ sang trái để bù gió',
      'Lệch sang phải theo gió',
      'Nhắm mắt rồi tin cơ duyên'
    ],
    correct: 0
  },
  rooftop_race: {
    prompt:
      'Mái ngói bên trái ướt, ván giữa đã mục, gờ đá bên phải khô. Bạn chọn đường nào?',
    options: ['Mái ngói ướt', 'Ván mục ở giữa', 'Gờ đá khô bên phải'],
    correct: 2
  }
});
const rescuePuzzles = {
  companion_03: [
    'Tiểu Muội sợ chuột trên cành cây. Cách cứu an toàn?',
    [
      'Buộc dây vào cành chắc rồi đỡ nàng xuống',
      'Rung cây thật mạnh',
      'Thả thêm một con chuột'
    ],
    0,
    'rope'
  ],
  companion_09: [
    'Mèo cưng trốn trong hốc đá. Nên làm gì?',
    [
      'Dọa cho mèo chạy',
      'Dùng cá dụ mèo ra, để đường thoát rộng',
      'Bịt hết lối ra'
    ],
    1,
    'food_fish'
  ],
  companion_11: [
    'Kẻ bảo kê đòi 20 lượng. Làm sao giúp Mộng Cô mà không để quán bị phá?',
    [
      'Trả giúp, ghi lại bằng chứng để tố cáo',
      'Hứa trả vào năm sau',
      'Đập quán trước cho họ khỏi phá'
    ],
    0,
    'silver'
  ],
  companion_04: [
    'Bẫy chuột kẹp chân chủ nhân. Phải làm bước nào trước?',
    [
      'Kéo chân ra thật mạnh',
      'Giữ lò xo rồi mở ngàm bẫy',
      'Đặt thêm một cái bẫy'
    ],
    1,
    null
  ],
  companion_13: [
    'Lão nhân đang ngủ ba ngày. Nên đánh thức thế nào?',
    [
      'Đốt cả chăn',
      'Gõ chuông nhẹ, gọi tên và kiểm tra phản ứng',
      'Hắt nước đá'
    ],
    1,
    null
  ],
  companion_18: [
    'Tảng đá chặn động có một khe nứt. Cách phá hợp lý?',
    [
      'Húc vào giữa đá dày nhất',
      'Bảo mọi người đứng sát xem',
      'Gia cố trán, đánh đúng khe nứt khi mọi người đã lùi xa'
    ],
    2,
    null
  ]
};
export const RECRUIT_QUESTS = deepFreeze(
  COMPANIONS.map((unit, i) => {
    const condition = unit.recruitment.conditions[0];
    const custom = rescuePuzzles[unit.id];
    const puzzle =
      condition.type === 'win_minigame'
        ? PUZZLES[condition.gameId]
        : custom
          ? { prompt: custom[0], options: custom[1], correct: custom[2] }
          : null;
    return {
      id: unit.recruitment.questId,
      companionId: unit.id,
      title: unit.name,
      description: unit.recruitment.description,
      act:
        [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3][i] ??
        Math.ceil(unit.chapter / 4),
      chapter:
        [1, 2, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 9, 10, 10, 11][i] ??
        unit.chapter,
      level: Math.min(20, Math.max(1, Math.floor(i / 2))),
      xp: i < 20 ? 80 + i * 25 : 80 + unit.chapter * 20,
      silver: i < 20 ? 15 + i * 3 : 10 + unit.chapter * 2,
      condition,
      puzzle,
      cost: custom?.[3]
        ? { itemId: custom[3], quantity: unit.id === 'companion_11' ? 20 : 1 }
        : null,
      lines: unit.recruitment.lines ?? [
        [unit.name, unit.recruitment.description],
        ['Bạn', 'Nếu giúp được nhau, chúng ta cùng đi một đoạn đường.']
      ]
    };
  })
);
export const RECRUIT_BY_ID = deepFreeze(
  Object.fromEntries(RECRUIT_QUESTS.map((q) => [q.id, q]))
);
