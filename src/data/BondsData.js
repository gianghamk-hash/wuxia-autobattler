import { deepFreeze } from './DataUtils.js';
export const BOND_TITLES = deepFreeze({
  companion_01: 'Người giữ đường về',
  companion_03: 'Một mạch cùng lòng',
  companion_02: 'Hộ thuẫn vì người',
  companion_04: 'Một châm đúng chỗ',
  companion_08: 'Hồng ảnh giữ lời'
});
const replies = {
  companion_01: [
    [
      'Lão Tam cất lời xin lỗi đã tập, ngồi xuống nghe người phu kể về những ngày mất mùa. Khi ra về, ông xin được sửa lại chiếc càng xe bị gãy.',
      'Bạn cùng Lão Tam sửa càng xe ở ngoài sân. Người phu chưa nhận lời gặp, nhưng cho biết sáng mai có một chuyến thóc cần đưa qua bến.'
    ],
    [
      'Đoàn xe chọn đường qua xóm mình, chậm hơn nửa buổi. Lão Tam đi sau xe cuối cùng; lần này không có người cầm roi giục họ.',
      'Bạn đi cạnh xe đầu, Lão Tam ở xe cuối. Đến bến, ông tự nhận phần thiếu trong sổ hàng để người đánh xe không bị giữ lại.'
    ],
    [
      'Lão Tam tập xoay bổng thành một vòng chắn trước đồng đội. Ông bỏ đòn đánh choáng quen tay để giữ được khoảng trống phía sau.',
      'Lão Tam nhận đứng cuối mỗi lần rút lui. Cây bổng quét ngang để che người bị thương, thay cho việc lao lên hạ đối thủ.'
    ]
  ],
  companion_03: [
    [
      'Tiểu Muội đặt bát thuốc xuống, chờ người lính uống xong rồi mới hỏi tên người đã ra lệnh bắt phu. Tay nàng vẫn run, nhưng không giấu liều thuốc.',
      'Bạn nhờ thầy thuốc trong xóm băng bó cho người lính. Tiểu Muội ngồi bên cửa nghe lời khai, ghi lại những tên cần tìm mà không ép mình phải tha thứ ngay.'
    ],
    [
      'Tiểu Muội chia gói thuốc theo từng liều, hướng dẫn hai người ở bến cách pha và những dấu hiệu phải tìm thầy thuốc.',
      'Hai người đi từng nhà, ghi tên người đang sốt và người ở một mình. Tiểu Muội để thuốc theo danh sách, hẹn ngày trở lại kiểm tra.'
    ],
    [
      'Nàng tập châm cứu nguy trên nhịp thở của người bệnh. Đòn mới hồi ngay cho một người, đổi lại không còn dòng hồi phục kéo dài.',
      'Tiểu Muội vừa tập châm vừa nói từng bước cho người được chữa. Người ấy có thể ra hiệu dừng; nàng học cách cứu nguy mà vẫn để họ được chọn.'
    ]
  ],
  companion_02: [
    [
      'Người đi cuối kể mình đã bỏ hành lý để dìu một cụ già. Huyền Đạo Trưởng xóa nước cờ cũ, ghi thêm một khoảng dừng cho cả đoàn.',
      'Hai người trở lại con dốc có đá trơn. Đạo trưởng mang phần hành lý nặng nhất, lần đầu thấy con đường lui của mình chậm đến đâu.'
    ],
    [
      'Ông đặt hộ thuẫn vào người đang chống gối ở cuối buổi tập. Vòng khí không còn chỉ quanh thân đạo trưởng.',
      'Cả đội thống nhất giơ bàn tay khi cần được che. Đạo trưởng tập chờ dấu hiệu ấy, thay vì tự đoán ai đang yếu.'
    ],
    [
      'Hộ thuẫn rời tay ông, khép lại quanh người bị thương. Đạo trưởng chấp nhận khoảng trống trước ngực mình để giữ bạn qua một đòn nặng.',
      'Ông hỏi trước khi chuyển hộ thuẫn sang bạn. Cả hai tập hiệu lệnh nhận và trả khiên, để không ai phải bất ngờ gánh phần nguy hiểm.'
    ]
  ],
  companion_04: [
    [
      'Thập Nhị đếm lại từng mũi kim, làm một hộp nhận ám khí đã dùng. Người giữ kho được chỉ cách cầm phần cán, không chạm đầu kim.',
      'Bạn thử giao và nhận lại túi ám khí. Thập Nhị thêm nắp khóa và một tờ hình vẽ chỉ cách mở; túi kim không còn để lẫn với đồ chữa bệnh.'
    ],
    [
      'Thập Nhị xếp bia trước tấm phên có người đứng sau. Mỗi lần phóng chỉ một kim; trượt góc nào thì dừng ở góc ấy.',
      'Cả đội tập bước sang hai bên trước khi ra hiệu. Thập Nhị hạ tay mỗi khi đường bắn chưa trống, dù phải bỏ lỡ thời cơ.'
    ],
    [
      'Một mũi kim trúng đúng khe giáp, phá nhịp tụ khí của bia tập. Thập Nhị bỏ loạt ba tia để giữ một đòn tập trung.',
      'Bạn đánh dấu thời điểm đối thủ bắt đầu tụ khí. Thập Nhị chỉ phóng khi có hiệu lệnh, để nội thương mở cơ hội cho đồng đội tiếp chiêu.'
    ]
  ],
  companion_08: [
    [
      'Hồng Nương đặt món đồ cũ ở quầy, kèm địa chỉ có thể nhận lại. Người giữ lời khai nhận đồ nhưng chưa muốn nói chuyện; nàng không đợi ở cửa.',
      'Người ấy muốn gặp ở chỗ đông người và có người thứ ba. Hồng Nương đồng ý, cất giọng đùa thường ngày để nghe hết câu chuyện.'
    ],
    [
      'Nàng thôi tập cú lướt sâu, chuyển sang đẩy người áp sát khỏi lối đi. Người chữa thương phía sau có thêm một nhịp để lùi.',
      'Cả đội chọn một tiếng gõ lên chuôi kiếm để gọi hỗ trợ. Hồng Nương quay lại mỗi lần nghe tiếng gõ, dù mục tiêu địch đã gần trong tầm tay.'
    ],
    [
      'Hồng ảnh dừng ngay trước đồng đội bị ép góc. Một đòn đẩy mở đường về, thay cho cú lướt vào hậu tuyến.',
      'Hồng Nương hỏi lại dấu hiệu gọi nhau trước buổi tập cuối. Khi tiếng gõ vang lên, nàng dùng đòn mới giữ khoảng trống để cả đội rút về.'
    ]
  ]
};
const arcs = [
  [
    'companion_01',
    [
      [
        'Người chưa tha thứ',
        'Lão Tam',
        'Người phu ta từng giao cho lính đã về. Ta muốn xin lỗi, nhưng ông ấy chưa muốn gặp ta.',
        'Nghe điều người phu cần trước.',
        'Giúp ông ấy một việc rồi xin được nói.'
      ],
      [
        'Chuyến hàng không roi',
        'Lão Tam',
        'Có người nhờ ta dẫn xe thóc. Họ sợ ta lại đưa lính tới như ngày trước.',
        'Để người chở hàng tự chọn đường.',
        'Đi cùng và chịu trách nhiệm chuyến này.'
      ],
      [
        'Bổng giữ đường về',
        'Lão Tam',
        'Ta từng dùng bổng để mở đường cho kẻ mạnh. Lần này muốn học cách che cho người đi sau.',
        'Giữ lời bằng việc bảo vệ đồng đội.',
        'Giữ lời bằng cách đứng ra chịu trách nhiệm.'
      ]
    ]
  ],
  [
    'companion_03',
    [
      [
        'Thuốc cho người đối diện',
        'Tiểu Muội',
        'Người từng canh cha ta đang xin thuốc. Ta muốn chữa nhưng chưa hết giận.',
        'Chữa người trước, hỏi chuyện sau.',
        'Nhờ người khác chữa, rồi tự nghe lời khai.'
      ],
      [
        'Một gian thuốc nhỏ',
        'Tiểu Muội',
        'Ta muốn để lại thuốc ở bến. Nhưng người nhận thuốc cần biết liều, không chỉ biết mang ơn.',
        'Dạy người trong làng cách chăm bệnh.',
        'Lập danh sách người cần thuốc trước.'
      ],
      [
        'Mạch đập trở về',
        'Tiểu Muội',
        'Có lúc cần giữ một người qua cơn nguy kịch ngay, không thể chờ thuốc ngấm từng chút.',
        'Học cách cứu nguy đúng lúc.',
        'Học cách giải thích để người bệnh cùng quyết.'
      ]
    ]
  ],
  [
    'companion_02',
    [
      [
        'Một nước cờ đã bỏ',
        'Huyền Đạo Trưởng',
        'Ta từng tính đường lui mà quên người chạy chậm nhất. Bàn cờ không kể đủ chuyện người.',
        'Hỏi người ở cuối đoàn đã trải qua gì.',
        'Cùng ông ấy đi lại con đường ấy.'
      ],
      [
        'Chỗ đứng sau tấm khiên',
        'Huyền Đạo Trưởng',
        'Giữ được mình chưa chắc giữ được người đứng cạnh. Ta muốn đổi cách đặt hộ thuẫn.',
        'Ưu tiên người dễ bị hạ nhất.',
        'Hỏi đồng đội muốn được che lúc nào.'
      ],
      [
        'Thái cực vì người',
        'Huyền Đạo Trưởng',
        'Một vòng hộ thuẫn có thể đặt lên người khác. Ta sẵn lòng bỏ chỗ an toàn của mình.',
        'Dùng khiên cho người cần hơn.',
        'Giữ quyền lựa chọn cho người được bảo vệ.'
      ]
    ]
  ],
  [
    'companion_04',
    [
      [
        'Mũi kim và bàn tay',
        'Đường Thập Nhị',
        'Ta làm ám khí giỏi, nhưng không muốn người nhặt được một mũi kim cũ lại bị thương.',
        'Thu hồi kim và dặn người giữ kho.',
        'Đổi cách mang và nhận lại ám khí.'
      ],
      [
        'Giữ khoảng trống',
        'Đường Thập Nhị',
        'Bắn ba tia khi có dân sau mục tiêu là chuyện ta không muốn thử vận may.',
        'Tập đòn tập trung vào một mục tiêu.',
        'Đợi đồng đội mở góc bắn an toàn.'
      ],
      [
        'Một mũi đủ ngăn đường',
        'Đường Thập Nhị',
        'Ta có thể đổi bão ám khí lấy một đòn phá nhịp hồi nội lực. Ít mục tiêu hơn nhưng dễ chọn đúng người.',
        'Chọn đòn chính xác để ngăn nguy hiểm.',
        'Chọn thời điểm để đồng đội tận dụng.'
      ]
    ]
  ],
  [
    'companion_08',
    [
      [
        'Lời hẹn bên bến',
        'Hồng Nương Tử',
        'Một người ta từng dọa đang giữ lời khai giúp nhóm. Ta chưa biết nói cảm ơn thế nào.',
        'Trả lại thứ đã lấy trước khi xin gặp.',
        'Hỏi người ấy muốn giữ khoảng cách ra sao.'
      ],
      [
        'Người ở phía sau',
        'Hồng Nương Tử',
        'Ta quen lao tới người yếu nhất của địch. Nhưng có lúc người yếu nhất của ta mới cần được nhìn thấy.',
        'Tập giữ tuyến trước cho người sau.',
        'Cùng đội chọn một dấu hiệu gọi nhau.'
      ],
      [
        'Hồng ảnh cản đường',
        'Hồng Nương Tử',
        'Ta muốn có một đòn đẩy người áp sát ra xa. Đổi lại sẽ không lướt sâu vào hậu tuyến như trước.',
        'Học đòn giữ đường cho đồng đội.',
        'Đặt lời hứa vào cách phối hợp cả đội.'
      ]
    ]
  ]
];
export const BOND_STORIES = deepFreeze(
  arcs.flatMap(([companionId, rows]) =>
    rows.map(([title, speaker, text, a, b], i) => ({
      id: `bond_${companionId}_${i + 1}`,
      companionId,
      stage: i + 1,
      affinity: [30, 60, 100][i],
      chapter: [2, 6, 10][i],
      title,
      lines: [
        [
          'Người kể',
          'Chiều ở quán Rồng Lửa. Sau chuyến đi, ' +
            speaker +
            ' ngồi lại bên bàn, chờ bạn rảnh tay.'
        ],
        [speaker, text]
      ],
      choices: [
        { id: 'listen', text: a },
        { id: 'stand', text: b }
      ],
      endings: {
        listen: replies[companionId][i][0],
        stand: replies[companionId][i][1]
      }
    }))
  )
);
export const BOND_VARIANTS = deepFreeze({
  companion_01: {
    id: 'companion_01_bond_ult',
    name: 'Bổng Hộ Hành',
    description:
      'Đổi đòn choáng lấy hộ thuẫn 12% sinh lực cho cả đội trong 4 giây.',
    type: 'physical',
    dmgMultiplier: 0,
    targetType: 'all_allies',
    energyCost: 100,
    effects: [{ type: 'shield', maxHpRatio: 0.12, duration: 4 }]
  },
  companion_03: {
    id: 'companion_03_bond_ult',
    name: 'Liên Tâm Cứu Nguy',
    description:
      'Hồi ngay theo 2,5 lần nội công cho đồng đội ít máu nhất; đổi lại không hồi dần.',
    type: 'magical',
    dmgMultiplier: 0,
    targetType: 'lowest_hp_ally',
    energyCost: 100,
    effects: [{ type: 'heal', scalingStat: 'magicalAtk', multiplier: 2.5 }]
  },
  companion_02: {
    id: 'companion_02_bond_ult',
    name: 'Thái Cực Hộ Bạn',
    description:
      'Đặt khiên 35% sinh lực lên đồng đội đang bị thương nhiều nhất, thay cho khiên tự thân.',
    type: 'magical',
    dmgMultiplier: 0,
    targetType: 'lowest_hp_ally',
    energyCost: 100,
    effects: [{ type: 'shield', maxHpRatio: 0.35, duration: 5 }]
  },
  companion_04: {
    id: 'companion_04_bond_ult',
    name: 'Nhất Châm Đoạn Mạch',
    description:
      'Đánh một mục tiêu ít máu với hệ số 2 và nội thương 25% trong 3 giây, thay cho ba tia.',
    type: 'physical',
    dmgMultiplier: 2,
    targetType: 'lowest_hp_enemy',
    energyCost: 100,
    effects: [{ type: 'internal_injury', ratio: 0.25, duration: 3 }]
  },
  companion_08: {
    id: 'companion_08_bond_ult',
    name: 'Hồng Ảnh Cản Đường',
    description:
      'Đánh tiền tuyến với hệ số 1,8 và đẩy về sau, thay cho lướt vào người ít máu.',
    type: 'physical',
    dmgMultiplier: 1.8,
    targetType: 'front_enemy',
    energyCost: 100,
    effects: [{ type: 'knockback', destination: 'enemy_back_row' }]
  }
});
export function applyBondVariant(unit, mode) {
  if (mode === 'variant' && BOND_VARIANTS[unit.templateId])
    unit.skills.ultimate = structuredClone(BOND_VARIANTS[unit.templateId]);
  unit.bondConfigured = true;
}
