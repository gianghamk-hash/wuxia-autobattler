import { deepFreeze } from './DataUtils.js';
import {NEW_GEAR,NEW_GEAR_SETS,LEGACY_HELMETS7,LEGACY_FULL_SETS7} from './GearCatalog.js';

export const EQUIPMENT = deepFreeze([...NEW_GEAR,...LEGACY_HELMETS7,{id:"starter_helmet",name:"Mũ Vải Đi Đường",slot:"helmet",rarity:"common",tier:1,sect:null,setId:null,stats:{maxHp:35,physicalDef:3},description:"Mũ khởi hành dùng chung, không yêu cầu môn phái."},
  {
    "id": "thieulam_weapon",
    "name": "Thiền Trượng",
    "slot": "weapon",
    "rarity": "rare",
    "tier": 1,
    "sect": "ThieuLam",
    "setId": "thieulam_set",
    "stats": {
      "physicalAtk": 25
    },
    "description": "Trang bị khởi tạo của Thiếu Lâm."
  },
  {
    "id": "thieulam_armor",
    "name": "Tăng Bào",
    "slot": "armor",
    "rarity": "rare",
    "tier": 1,
    "sect": "ThieuLam",
    "setId": "thieulam_set",
    "stats": {
      "maxHp": 150,
      "physicalDef": 10
    },
    "description": "Trang bị khởi tạo của Thiếu Lâm."
  },
  {
    "id": "thieulam_accessory",
    "name": "Phật Châu",
    "slot": "accessory",
    "rarity": "rare",
    "tier": 1,
    "sect": "ThieuLam",
    "setId": "thieulam_set",
    "stats": {
      "magicalDef": 10,
      "maxHp": 50
    },
    "description": "Trang bị khởi tạo của Thiếu Lâm."
  },
  {
    "id": "vodang_weapon",
    "name": "Thái Cực Kiếm",
    "slot": "weapon",
    "rarity": "rare",
    "tier": 1,
    "sect": "VoDang",
    "setId": "vodang_set",
    "stats": {
      "magicalAtk": 25
    },
    "description": "Trang bị khởi tạo của Võ Đang."
  },
  {
    "id": "vodang_armor",
    "name": "Đạo Bào",
    "slot": "armor",
    "rarity": "rare",
    "tier": 1,
    "sect": "VoDang",
    "setId": "vodang_set",
    "stats": {
      "maxHp": 150,
      "physicalDef": 10
    },
    "description": "Trang bị khởi tạo của Võ Đang."
  },
  {
    "id": "vodang_accessory",
    "name": "Lưỡng Nghi Ngọc",
    "slot": "accessory",
    "rarity": "rare",
    "tier": 1,
    "sect": "VoDang",
    "setId": "vodang_set",
    "stats": {
      "magicalDef": 10,
      "maxHp": 50
    },
    "description": "Trang bị khởi tạo của Võ Đang."
  },
  {
    "id": "caibang_weapon",
    "name": "Trúc Bổng",
    "slot": "weapon",
    "rarity": "rare",
    "tier": 1,
    "sect": "CaiBang",
    "setId": "caibang_set",
    "stats": {
      "physicalAtk": 25
    },
    "description": "Trang bị khởi tạo của Cái Bang."
  },
  {
    "id": "caibang_armor",
    "name": "Bách Kết Y",
    "slot": "armor",
    "rarity": "rare",
    "tier": 1,
    "sect": "CaiBang",
    "setId": "caibang_set",
    "stats": {
      "maxHp": 150,
      "physicalDef": 10
    },
    "description": "Trang bị khởi tạo của Cái Bang."
  },
  {
    "id": "caibang_accessory",
    "name": "Hồ Lô Rượu",
    "slot": "accessory",
    "rarity": "rare",
    "tier": 1,
    "sect": "CaiBang",
    "setId": "caibang_set",
    "stats": {
      "magicalDef": 10,
      "maxHp": 50
    },
    "description": "Trang bị khởi tạo của Cái Bang."
  },
  {
    "id": "ngami_weapon",
    "name": "Phất Trần",
    "slot": "weapon",
    "rarity": "rare",
    "tier": 1,
    "sect": "NgaMi",
    "setId": "ngami_set",
    "stats": {
      "magicalAtk": 25
    },
    "description": "Trang bị khởi tạo của Nga Mi."
  },
  {
    "id": "ngami_armor",
    "name": "Liên Hoa Y",
    "slot": "armor",
    "rarity": "rare",
    "tier": 1,
    "sect": "NgaMi",
    "setId": "ngami_set",
    "stats": {
      "maxHp": 150,
      "physicalDef": 10
    },
    "description": "Trang bị khởi tạo của Nga Mi."
  },
  {
    "id": "ngami_accessory",
    "name": "Ngọc Hồi Xuân",
    "slot": "accessory",
    "rarity": "rare",
    "tier": 1,
    "sect": "NgaMi",
    "setId": "ngami_set",
    "stats": {
      "magicalDef": 10,
      "maxHp": 50
    },
    "description": "Trang bị khởi tạo của Nga Mi."
  },
  {
    "id": "duongmon_weapon",
    "name": "Liên Nỏ",
    "slot": "weapon",
    "rarity": "rare",
    "tier": 1,
    "sect": "DuongMon",
    "setId": "duongmon_set",
    "stats": {
      "physicalAtk": 25
    },
    "description": "Trang bị khởi tạo của Đường Môn."
  },
  {
    "id": "duongmon_armor",
    "name": "Dạ Hành Y",
    "slot": "armor",
    "rarity": "rare",
    "tier": 1,
    "sect": "DuongMon",
    "setId": "duongmon_set",
    "stats": {
      "maxHp": 150,
      "physicalDef": 10
    },
    "description": "Trang bị khởi tạo của Đường Môn."
  },
  {
    "id": "duongmon_accessory",
    "name": "Độc Nang",
    "slot": "accessory",
    "rarity": "rare",
    "tier": 1,
    "sect": "DuongMon",
    "setId": "duongmon_set",
    "stats": {
      "magicalDef": 10,
      "maxHp": 50
    },
    "description": "Trang bị khởi tạo của Đường Môn."
  },
  {
    "id": "starter_weapon",
    "name": "Kiếm Gỗ",
    "slot": "weapon",
    "rarity": "common",
    "tier": 1,
    "sect": null,
    "setId": null,
    "stats": {
      "physicalAtk": 10
    },
    "description": "Trang bị nhập môn dùng chung."
  },
  {
    "id": "starter_armor",
    "name": "Áo Vải",
    "slot": "armor",
    "rarity": "common",
    "tier": 1,
    "sect": null,
    "setId": null,
    "stats": {
      "maxHp": 80
    },
    "description": "Trang bị nhập môn dùng chung."
  },
  {
    "id": "starter_accessory",
    "name": "Túi Hương",
    "slot": "accessory",
    "rarity": "common",
    "tier": 1,
    "sect": null,
    "setId": null,
    "stats": {
      "magicalDef": 5
    },
    "description": "Trang bị nhập môn dùng chung."
  }
]);

export const EQUIPMENT_SETS = deepFreeze([...NEW_GEAR_SETS,...LEGACY_FULL_SETS7,
  {
    "id": "thieulam_set",
    "name": "Bộ Thiếu Lâm",
    "requiredPieces": 3,
    "stats": {
      "maxHp": 200
    }
  },
  {
    "id": "vodang_set",
    "name": "Bộ Võ Đang",
    "requiredPieces": 3,
    "stats": {
      "magicalAtk": 20
    }
  },
  {
    "id": "caibang_set",
    "name": "Bộ Cái Bang",
    "requiredPieces": 3,
    "stats": {
      "physicalAtk": 20
    }
  },
  {
    "id": "ngami_set",
    "name": "Bộ Nga Mi",
    "requiredPieces": 3,
    "stats": {
      "magicalAtk": 20
    }
  },
  {
    "id": "duongmon_set",
    "name": "Bộ Đường Môn",
    "requiredPieces": 3,
    "stats": {
      "attackSpeed": 0.1
    }
  }
]);
export const EQUIPMENT_BY_ID = deepFreeze(Object.fromEntries(EQUIPMENT.map(item => [item.id, item])));
