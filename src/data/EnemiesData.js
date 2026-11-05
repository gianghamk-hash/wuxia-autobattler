import { deepFreeze } from './DataUtils.js';
export const ENCOUNTERS = deepFreeze({
  inn_escape: { name: 'Đường thoát quán trọ', level: 1, templates: ['companion_06'], hpScale: .6, attackScale: .6, guide: true },
  willow_ferry: { name: 'Truy binh bến Liễu', level: 3, templates: ['companion_05', 'companion_04', 'companion_08'], hpScale: .85, attackScale: .8 },
  black_wind: { name: 'Trấn thủ U Minh', level: 4, templates: ['companion_13', 'companion_06', 'companion_12'], hpScale: 1.18, attackScale: .9 },
  tournament: { name: 'Vòng đấu Đại Hội', level: 5, templates: ['companion_05', 'companion_07', 'companion_08'], hpScale: .9, attackScale: .85 },
  warehouse: { name: 'Vệ binh kho hàng', level: 6, templates: ['companion_18', 'companion_04', 'companion_06'], hpScale: .95, attackScale: .85 },
  night_market: { name: 'Đường dây vũ khí giả', level: 7, templates: ['companion_01', 'companion_14', 'companion_15'], hpScale: 1.15, attackScale: .95 },
  alliance: { name: 'Hộ pháp Liên Minh', level: 9, templates: ['companion_05', 'companion_03', 'companion_12'], hpScale: 1.15, attackScale: .95 },
  snow_pass: { name: 'Cửa ải Yên Tử', level: 10, templates: ['companion_13', 'companion_14', 'companion_08'], hpScale: 1.15, attackScale: .955 },
  backstage: { name: 'Đội đóng thế', level: 12, templates: ['companion_18', 'companion_16', 'companion_07'], hpScale: 1.15, attackScale: .955 },
  summit: { name: 'Liên minh trên Yên Tử', level: 14, templates: ['companion_05', 'companion_07', 'companion_19'], hpScale: 1.3, attackScale: 1.05 }
});
