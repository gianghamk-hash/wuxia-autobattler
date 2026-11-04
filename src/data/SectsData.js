import { deepFreeze } from './DataUtils.js';

export const SECTS = deepFreeze({
  "ThieuLam": {
    "id": "ThieuLam",
    "name": "Thiếu Lâm",
    "role": "Đỡ đòn",
    "preferredAttributes": "Căn Cốt, Phòng ngự",
    "baseStats": {
      "maxHp": 1600,
      "hp": 1600,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 70,
      "magicalAtk": 20,
      "physicalDef": 70,
      "magicalDef": 50,
      "attackSpeed": 0.7,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 1
    },
    "growthPerLevel": {
      "maxHp": 120,
      "physicalAtk": 4,
      "magicalAtk": 1,
      "physicalDef": 5,
      "magicalDef": 3
    },
    "passive": {
      "id": "thieulam_passive",
      "name": "Kim Cang Bất Hoại",
      "description": "Máu dưới 30% tạo khiên bằng 50% máu tối đa và phản 25% sát thương cận chiến.",
      "trigger": "hp_below",
      "hpThreshold": 0.3,
      "shieldMaxHpRatio": 0.5,
      "meleeReflectRatio": 0.25,
      "maxActivationsPerBattle": 1
    }
  },
  "VoDang": {
    "id": "VoDang",
    "name": "Võ Đang",
    "role": "Đỡ đòn / Khống chế",
    "preferredAttributes": "Khí Hải, Nội công",
    "baseStats": {
      "maxHp": 1250,
      "hp": 1250,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 40,
      "magicalAtk": 100,
      "physicalDef": 45,
      "magicalDef": 65,
      "attackSpeed": 0.8,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 2
    },
    "growthPerLevel": {
      "maxHp": 90,
      "physicalAtk": 2,
      "magicalAtk": 7,
      "physicalDef": 3,
      "magicalDef": 5
    },
    "passive": {
      "id": "vodang_passive",
      "name": "Thái Cực Lưỡng Nghi",
      "description": "Dùng nội lực đỡ thay 40% sát thương nhận vào; phản kích sóng nội công.",
      "trigger": "damage_received",
      "resource": "internalForce",
      "damageRedirectRatio": 0.4,
      "counterDamageType": "magical"
    }
  },
  "CaiBang": {
    "id": "CaiBang",
    "name": "Cái Bang",
    "role": "Đấu sĩ / Diện rộng",
    "preferredAttributes": "Kình Lực, Thân Pháp",
    "baseStats": {
      "maxHp": 1300,
      "hp": 1300,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 100,
      "magicalAtk": 20,
      "physicalDef": 45,
      "magicalDef": 35,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 1
    },
    "growthPerLevel": {
      "maxHp": 95,
      "physicalAtk": 7,
      "magicalAtk": 1,
      "physicalDef": 3,
      "magicalDef": 2
    },
    "passive": {
      "id": "caibang_passive",
      "name": "Túy Quyền Nộ Khí",
      "description": "Sau ba đòn đánh thường, đòn thứ tư quét sát thương toàn hàng đối phương.",
      "trigger": "basic_attack",
      "everyAttacks": 4,
      "targetType": "enemy_row",
      "dmgMultiplier": 1
    }
  },
  "NgaMi": {
    "id": "NgaMi",
    "name": "Nga Mi",
    "role": "Hồi máu / Hỗ trợ",
    "preferredAttributes": "Khí Hải, Ngộ Tính",
    "baseStats": {
      "maxHp": 1000,
      "hp": 1000,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 25,
      "magicalAtk": 100,
      "physicalDef": 30,
      "magicalDef": 55,
      "attackSpeed": 0.85,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 3
    },
    "growthPerLevel": {
      "maxHp": 70,
      "physicalAtk": 1,
      "magicalAtk": 7,
      "physicalDef": 2,
      "magicalDef": 4
    },
    "passive": {
      "id": "ngami_passive",
      "name": "Cửu Âm Hồi Xuân",
      "description": "Đánh thường hồi máu cho đồng đội yếu nhất; tuyệt kỹ giải toàn bộ khống chế.",
      "trigger": "basic_attack",
      "targetType": "lowest_hp_ally",
      "healMultiplier": 0.8,
      "ultimateCleanse": "all_control"
    }
  },
  "DuongMon": {
    "id": "DuongMon",
    "name": "Đường Môn",
    "role": "Tầm xa / Độc sát",
    "preferredAttributes": "Thân Pháp, Cơ Duyên",
    "baseStats": {
      "maxHp": 950,
      "hp": 950,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 110,
      "magicalAtk": 45,
      "physicalDef": 30,
      "magicalDef": 35,
      "attackSpeed": 1,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 4
    },
    "growthPerLevel": {
      "maxHp": 65,
      "physicalAtk": 8,
      "magicalAtk": 3,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "passive": {
      "id": "duongmon_passive",
      "name": "Bách Độc Xuyên Tâm",
      "description": "Đòn đánh găm một tầng độc; đủ năm tầng phát nổ sát thương chuẩn xuyên giáp.",
      "trigger": "basic_attack_hit",
      "status": "poison",
      "stacksPerHit": 1,
      "maxStacks": 5,
      "detonateAtStacks": 5,
      "detonationDamageType": "true"
    }
  }
});

export const SECT_IDS = Object.freeze(Object.keys(SECTS));
export function getSectName(id) { return id === 'TuDo' ? 'Tự Do' : (SECTS[id]?.name ?? 'Chưa chọn phái'); }
