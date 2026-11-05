import { SECTS } from './SectsData.js';
import { deepFreeze } from './DataUtils.js';

export const SYNERGIES = deepFreeze([
  {
    "id": "thai_son_bac_dau",
    "name": "Thái Sơn Bắc Đẩu",
    "requiredSects": [
      "ThieuLam",
      "VoDang"
    ],
    "description": "Toàn đội nhận khiên bằng 15% máu tối đa khi vào trận.",
    "effects": [
      {
        "type": "shield",
        "trigger": "battle_start",
        "targetType": "all_allies",
        "maxHpRatio": 0.15
      }
    ]
  },
  {
    "id": "hiep_nghia_giang_ho",
    "name": "Hiệp Nghĩa Giang Hồ",
    "requiredSects": [
      "CaiBang",
      "DuongMon"
    ],
    "description": "Đánh thường có 20% xác suất giảm 30% giáp mục tiêu trong ba giây.",
    "effects": [
      {
        "type": "physical_defense_down",
        "trigger": "basic_attack_hit",
        "chance": 0.2,
        "ratio": 0.3,
        "duration": 3
      }
    ]
  },
  {
    "id": "am_duong_giao_hoa",
    "name": "Âm Dương Giao Hòa",
    "requiredSects": [
      "VoDang",
      "NgaMi"
    ],
    "description": "Tốc độ tích lũy nộ khí toàn đội tăng 25%.",
    "effects": [
      {
        "type": "energy_gain_up",
        "targetType": "all_allies",
        "ratio": 0.25
      }
    ]
  },
  {
    "id": "doc_ba_vo_lam",
    "name": "Độc Bá Võ Lâm",
    "requiredSects": [
      "DuongMon",
      "NgaMi",
      "CaiBang"
    ],
    "description": "Đủ ba phái Đường Môn, Nga Mi, Cái Bang: tăng 20% toàn bộ sát thương gây ra.",
    "effects": [
      {
        "type": "damage_up",
        "targetType": "all_allies",
        "ratio": 0.2
      }
    ]
  }
]);

/** A party is one hero + at most two companions; duplicate sects count once. */
export function getActiveSynergies(sectIds) {
  if (!Array.isArray(sectIds) || sectIds.length > 6 ||
      !sectIds.every(id => Object.hasOwn(SECTS, id) || id === 'TuDo')) {
    throw new Error('Đội hình cần tối đa sáu môn phái hợp lệ.');
  }
  const present = new Set(sectIds);
  return SYNERGIES.filter(synergy => synergy.requiredSects.every(id => present.has(id)));
}
