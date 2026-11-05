export const DUNGEONS = [
  {
    id: 'phong_nha',
    name: 'Động Phong Nha',
    floors: 5,
    level: 2,
    element: 'Tho',
    sect: 'VoDang',
    fee: 12,
    relic: 'Long mạch',
    description:
      'Thổ hoặc Võ Đang. Hang ngầm, nước xiết và bí kíp đánh theo hàng.'
  },
  {
    id: 'u_minh',
    name: 'Rừng U Minh',
    floors: 6,
    level: 5,
    element: 'Hoa',
    sect: 'CaiBang',
    fee: 22,
    relic: 'Hỏa tâm',
    description: 'Hỏa hoặc Cái Bang. Độc chướng và lửa rừng thử sức đội hình.'
  },
  {
    id: 'yen_tu',
    name: 'Núi Yên Tử',
    floors: 6,
    level: 7,
    element: 'Kim',
    sect: 'ThieuLam',
    fee: 30,
    relic: 'Thiền định',
    description: 'Kim hoặc Thiếu Lâm. Phá khiên, giữ nội lực qua đường núi.'
  },
  {
    id: 'hoa_lu',
    name: 'Thành cổ Hoa Lư',
    floors: 7,
    level: 10,
    element: 'Thuy',
    sect: 'NgaMi',
    fee: 40,
    relic: 'Binh thư',
    description: 'Thủy hoặc Nga Mi. Phục binh, nội thương và lời thề giữ thành.'
  },
  {
    id: 'son_doong',
    name: 'Hang Sơn Đoòng',
    floors: 8,
    level: 12,
    element: 'Moc',
    sect: 'DuongMon',
    fee: 50,
    relic: 'Mộc linh',
    description: 'Mộc hoặc Đường Môn. Tầng sâu có trang bị hiếm và tinh hoa.'
  }
];
export const ROOM_NAMES = {
  battle: 'Giao chiến',
  treasure: 'Kho báu',
  event: 'Sự kiện',
  rest: 'Quán nghỉ',
  boss: 'Trấn thủ'
};
export const DAILY_TASKS = [
  {
    id: 'daily_battle',
    label: 'Thắng 3 trận',
    metric: 'wins',
    target: 3,
    silver: 12
  },
  {
    id: 'daily_craft',
    label: 'Luyện đan hoặc rèn 1 lần',
    metric: 'crafts',
    target: 1,
    silver: 8
  },
  {
    id: 'daily_dungeon',
    label: 'Thắng 1 tầng bí cảnh',
    metric: 'floors',
    target: 1,
    silver: 10
  }
];
export const WEEKLY_TASKS = [
  {
    id: 'weekly_battle',
    label: 'Thắng 15 trận trong tuần',
    metric: 'wins',
    target: 15,
    silver: 70
  },
  {
    id: 'weekly_dungeon',
    label: 'Vượt 1 bí cảnh trong tuần',
    metric: 'clears',
    target: 1,
    silver: 50
  }
];
export const LOCAL_LORE = [
  'Một cây làm chẳng nên non. Tank đứng trước, y sư đứng sau; đừng để thầy thuốc thử giáp bằng mặt.',
  'Có công mài sắt, có ngày… hết tiền rèn. Rèn binh khí tăng sức mạnh lâu dài, quán trà chỉ giúp một trận.',
  'Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim. Biết người biết ta, bớt tiền thuốc.',
  'Ở Hoa Lư, người ta nói một lời giữ thành còn nặng hơn trăm lời nhận làm minh chủ.',
  'Roi Bình Định nổi tiếng gọn mà chắc. Ở sân quán trọ, đừng múa roi khi người bên cạnh còn bưng bát phở.'
];
