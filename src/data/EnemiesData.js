import { MAIN_QUESTS } from './QuestsData.js';
import { DAI_VIET_QUESTS } from './DaiVietStoryData.js';
import { deepFreeze } from './DataUtils.js';
const CLASSIC_ENCOUNTERS = {
  inn_escape: {
    name: 'Đường thoát quán trọ',
    level: 1,
    templates: ['companion_06'],
    hpScale: 0.6,
    attackScale: 0.6,
    guide: true
  },
  willow_ferry: {
    name: 'Truy binh bến Liễu',
    level: 3,
    templates: ['companion_05', 'companion_04', 'companion_08'],
    hpScale: 0.85,
    attackScale: 0.8
  },
  black_wind: {
    name: 'Trấn thủ U Minh',
    level: 4,
    templates: ['companion_13', 'companion_06', 'companion_12'],
    hpScale: 1.18,
    attackScale: 0.9
  },
  tournament: {
    name: 'Vòng đấu Đại Hội',
    level: 5,
    templates: ['companion_05', 'companion_07', 'companion_08'],
    hpScale: 0.9,
    attackScale: 0.85
  },
  warehouse: {
    name: 'Vệ binh kho hàng',
    level: 6,
    templates: ['companion_18', 'companion_04', 'companion_06'],
    hpScale: 0.95,
    attackScale: 0.85
  },
  night_market: {
    name: 'Đường dây vũ khí giả',
    level: 7,
    templates: ['companion_01', 'companion_14', 'companion_15'],
    hpScale: 1.15,
    attackScale: 0.95
  },
  alliance: {
    name: 'Hộ pháp Liên Minh',
    level: 9,
    templates: ['companion_05', 'companion_03', 'companion_12'],
    hpScale: 1.15,
    attackScale: 0.95
  },
  snow_pass: {
    name: 'Cửa ải Yên Tử',
    level: 10,
    templates: ['companion_13', 'companion_14', 'companion_08'],
    hpScale: 1.15,
    attackScale: 0.955
  },
  backstage: {
    name: 'Đội đóng thế',
    level: 12,
    templates: ['companion_18', 'companion_16', 'companion_07'],
    hpScale: 1.15,
    attackScale: 0.955
  },
  summit: {
    name: 'Liên minh trên Yên Tử',
    level: 14,
    templates: ['companion_05', 'companion_07', 'companion_19'],
    hpScale: 1.3,
    attackScale: 1.05
  }
};

const templates = [
  ['companion_06', 'companion_01'],
  ['companion_01', 'companion_04'],
  ['companion_05', 'companion_04', 'companion_08'],
  ['companion_13', 'companion_06', 'companion_12'],
  ['companion_05', 'companion_07', 'companion_08'],
  ['companion_18', 'companion_04', 'companion_06'],
  ['companion_01', 'companion_14', 'companion_15'],
  ['companion_05', 'companion_03', 'companion_12'],
  ['companion_13', 'companion_14', 'companion_08'],
  ['companion_18', 'companion_16', 'companion_07'],
  ['companion_05', 'companion_07', 'companion_19'],
  ['companion_18', 'companion_14', 'companion_12']
];
const story = Object.fromEntries(
  [...MAIN_QUESTS,...DAI_VIET_QUESTS].filter((q) => q.encounter && q.encounter !== 'inn_escape').map(
    (q) => {
      const count =
        q.chapter <= 2
          ? q.boss
            ? 3
            : 2
          : q.chapter <= 4
            ? 3
            : q.chapter <= 7
              ? 4
              : q.chapter <= 9
                ? 5
                : 6;
      return [
        q.encounter,
        {
          name: `Chương ${q.chapter} · Hồi ${q.episode} · ${q.title}`,
          level: q.level,
          count:q.canon==='dai-viet'?Math.min(8,4+Math.floor((q.chapter-1)/4)):count,
          templates: Array.from(
            { length: count },
            (_, i) =>
              templates[(q.chapter - 1)%templates.length][i % templates[(q.chapter - 1)%templates.length].length]
          ),
          guide: q.chapter <= 2,
          hpScale:
            (q.chapter <= 2 ? 0.6 : 0.76 + Math.min(q.chapter,12) * 0.012) *
            (q.boss ? 1.12 : 1),
          attackScale: (0.55 + Math.min(q.chapter,12) * 0.025) * (q.boss ? 1.05 : 1)
          ,...(q.id==='D01H06'?{count:1,templates:['companion_06'],hpScale:.6,attackScale:.45,guide:true}:q.id==='D07H05'?{count:1,templates:['companion_01'],hpScale:.95,attackScale:.7}:{} )
          ,...(['duel','drill','breach'].includes(q.combatType)?{count:q.combatType==='duel'?1:2,templates:q.combatType==='duel'?['companion_06']:['companion_06','companion_05'],hpScale:.65,attackScale:.45,guide:true}: {})
          ,...(q.canon==='dai-viet'&&q.chapter>=3&&!q.combatType&&q.id!=='D07H05'?{hpScale:(.76+Math.min(q.chapter,12)*.012)*(q.boss?1.12*1.12:1.08)*(1+Math.max(0,q.chapter-7)*.009),attackScale:(.55+Math.min(q.chapter,12)*.025)*(q.boss?1.05*1.08:1.05)*(1+Math.max(0,q.chapter-7)*.006)}:{})
          ,count:q.canon==='dai-viet'?Math.min(8,4+Math.floor((q.chapter-1)/4)):count
          ,...(q.canon==='dai-viet'&&q.chapter<=4?{hpScale:q.boss?.18:.32,attackScale:q.boss?.12:.23}: {})
        }
      ];
    }
  )
);
for(const q of DAI_VIET_QUESTS.filter(q=>q.boss&&q.chapter>4)){story[q.encounter].hpScale*=.62;story[q.encounter].attackScale*=.72;}
export const ENCOUNTERS = deepFreeze({ ...CLASSIC_ENCOUNTERS, ...story });
