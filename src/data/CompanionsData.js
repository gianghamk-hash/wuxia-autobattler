import {specializeRoster7} from './CharacterKits7.js';
import { expandCompanions } from './NewCompanionsData.js';
import {expandStoryCompanions} from './ExpansionCast.js';
import { deepFreeze } from './DataUtils.js';

const ORIGINAL_COMPANIONS = [
  {
    "id": "companion_01",
    "name": "Lão Tam Ăn Mày",
    "sect": "CaiBang",
    "role": "Bruiser",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_01",
      "description": "Đòi 10 đùi gà nướng trộm từ bếp Thiếu Lâm.",
      "conditions": [
        {
          "type": "collect",
          "itemId": "quest_roast_chicken_leg",
          "quantity": 10
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_01_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_01_ult",
        "name": "Đả Cẩu Bổng",
        "description": "Đả cẩu bổng gây choáng trong phạm vi một ô.",
        "dmgMultiplier": 2.8,
        "type": "physical",
        "targetType": "nearest_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "stun",
            "duration": 1.5,
            "radius": 1
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_02",
    "name": "Huyền Đạo Trưởng",
    "sect": "VoDang",
    "role": "SubTank",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_02",
      "description": "Thua cược cờ vây với nhân vật chính dưới chân núi.",
      "conditions": [
        {
          "type": "win_minigame",
          "gameId": "go_wager"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_02_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_02_ult",
        "name": "Thái Cực Hộ Thuẫn",
        "description": "Tạo hộ thuẫn hấp thụ sát thương.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "self",
        "energyCost": 100,
        "effects": [
          {
            "type": "shield",
            "maxHpRatio": 0.3,
            "duration": 5
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_03",
    "name": "Tiểu Muội Nga Mi",
    "sect": "NgaMi",
    "role": "Healer",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1120.0,
      "hp": 1120.0,
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
      "maxHp": 78.4,
      "physicalAtk": 1,
      "magicalAtk": 7,
      "physicalDef": 2,
      "magicalDef": 4
    },
    "recruitment": {
      "questId": "recruit_03",
      "description": "Bị kẹt trên ngọn cây vì sợ chuột, cần cứu.",
      "conditions": [
        {
          "type": "rescue",
          "eventId": "tree_rescue"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_03_basic",
        "name": "Hồi Xuân",
        "dmgMultiplier": 0,
        "type": "magical",
        "energyGain": 15,
        "targetType": "lowest_hp_ally",
        "effects": [
          {
            "type": "heal",
            "multiplier": 0.8,
            "scalingStat": "magicalAtk"
          }
        ]
      },
      "ultimate": {
        "id": "companion_03_ult",
        "name": "Hồi Xuân Liên Tục",
        "description": "Hồi máu liên tục cho đồng đội yếu nhất.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "lowest_hp_ally",
        "energyCost": 100,
        "effects": [
          {
            "type": "heal_over_time",
            "scalingStat": "magicalAtk",
            "multiplier": 0.6,
            "duration": 5,
            "tickInterval": 1
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_04",
    "name": "Đường Thập Nhị",
    "sect": "DuongMon",
    "role": "RangedDPS",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 950,
      "hp": 950,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 115,
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
    "recruitment": {
      "questId": "recruit_04",
      "description": "Gỡ giúp bẫy chuột do chính hắn đặt nhầm.",
      "conditions": [
        {
          "type": "resolve_event",
          "eventId": "remove_mouse_trap"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_04_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_04_ult",
        "name": "Tam Tuyến Ám Khí",
        "description": "Bão ám khí ba tia xuyên thấu.",
        "dmgMultiplier": 1.2,
        "type": "physical",
        "targetType": "enemy_line",
        "energyCost": 100,
        "effects": [
          {
            "type": "piercing_projectiles",
            "count": 3
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_05",
    "name": "Đại Lực Kim Cang",
    "sect": "ThieuLam",
    "role": "Tank",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_05",
      "description": "Đấu vật tay và thắng hắn tại tửu điếm.",
      "conditions": [
        {
          "type": "win_minigame",
          "gameId": "arm_wrestling"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_05_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_05_ult",
        "name": "Kim Cang Khiêu Chiến",
        "description": "Khiêu khích toàn bộ kẻ địch trong một ô.",
        "dmgMultiplier": 0,
        "type": "physical",
        "targetType": "self",
        "energyCost": 100,
        "effects": [
          {
            "type": "taunt",
            "radius": 1,
            "duration": 3
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_06",
    "name": "Lý Độc Thủ",
    "sect": "TuDo",
    "role": "Debuffer",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1232.0,
      "hp": 1232.0,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 85,
      "magicalAtk": 125,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 2
    },
    "growthPerLevel": {
      "maxHp": 84.0,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_06",
      "description": "Tìm nấm độc hiếm mọc trong hầm cầu quán trọ.",
      "conditions": [
        {
          "type": "collect",
          "itemId": "quest_rare_poison_mushroom",
          "quantity": 1
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_06_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_06_ult",
        "name": "Độc Vụ Mê Tung",
        "description": "Khói độc gây sát thương, giảm chính xác và gây nội thương giảm 35% hồi nội lực.",
        "dmgMultiplier": 1.5,
        "type": "magical",
        "targetType": "enemy_area",
        "energyCost": 100,
        "effects": [
          {
            "type": "accuracy_down",
            "ratio": 0.3,
            "duration": 4,
            "radius": 1
          },
          {
            "type": "internal_injury",
            "duration": 5,
            "ratio": 0.35
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_07",
    "name": "Thôi Mệnh Thư Sinh",
    "sect": "VoDang",
    "role": "BurstMage",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1250,
      "hp": 1250,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 40,
      "magicalAtk": 125,
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
    "recruitment": {
      "questId": "recruit_07",
      "description": "Chuộc lại cây bút lông gia truyền ở tiệm cầm đồ.",
      "conditions": [
        {
          "type": "recover_item",
          "itemId": "quest_heirloom_brush"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_07_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_07_ult",
        "name": "Bút Phóng Kiếm Khí",
        "description": "Viết chữ phóng kiếm khí tầm xa.",
        "dmgMultiplier": 3.2,
        "type": "magical",
        "targetType": "farthest_enemy",
        "energyCost": 100,
        "effects": []
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_08",
    "name": "Hồng Nương Tử",
    "sect": "CaiBang",
    "role": "Assassin",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1050,
      "hp": 1050,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 120,
      "magicalAtk": 20,
      "physicalDef": 45,
      "magicalDef": 35,
      "attackSpeed": 1.15,
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
    "recruitment": {
      "questId": "recruit_08",
      "description": "Báo thù kẻ bán rượu giả làm nàng ngộ độc.",
      "conditions": [
        {
          "type": "defeat",
          "enemyId": "quest_fake_wine_seller"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_08_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_08_ult",
        "name": "Hồng Ảnh Đoạt Mệnh",
        "description": "Lướt ra sau lưng kẻ địch có phần trăm máu thấp nhất.",
        "dmgMultiplier": 2.6,
        "type": "physical",
        "targetType": "lowest_hp_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "blink",
            "destination": "behind_target"
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_09",
    "name": "Tịnh Không Sư Thái",
    "sect": "NgaMi",
    "role": "Buffer",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1120.0,
      "hp": 1120.0,
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
      "maxHp": 78.4,
      "physicalAtk": 1,
      "magicalAtk": 7,
      "physicalDef": 2,
      "magicalDef": 4
    },
    "recruitment": {
      "questId": "recruit_09",
      "description": "Tìm con mèo cưng trốn khỏi am miếu.",
      "conditions": [
        {
          "type": "rescue",
          "eventId": "find_temple_cat"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_09_basic",
        "name": "Hồi Xuân",
        "dmgMultiplier": 0,
        "type": "magical",
        "energyGain": 15,
        "targetType": "lowest_hp_ally",
        "effects": [
          {
            "type": "heal",
            "multiplier": 0.8,
            "scalingStat": "magicalAtk"
          }
        ]
      },
      "ultimate": {
        "id": "companion_09_ult",
        "name": "Định Tâm Mộc Ngư",
        "description": "Gõ mõ định tâm tăng 25% công toàn đội.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "all_allies",
        "energyCost": 100,
        "effects": [
          {
            "type": "attack_up",
            "ratio": 0.25,
            "duration": 5
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_10",
    "name": "Bách Bộ Thần Thương",
    "sect": "TuDo",
    "role": "RangedDPS",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1100,
      "hp": 1100,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 115,
      "magicalAtk": 65,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 4
    },
    "growthPerLevel": {
      "maxHp": 75,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_10",
      "description": "Thắng cuộc thi bắn bia trong hội chợ thị trấn.",
      "conditions": [
        {
          "type": "win_minigame",
          "gameId": "archery_contest"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_10_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_10_ult",
        "name": "Hỏa Tiễn Liên Hoàn",
        "description": "Mũi tên lửa nổ trên vùng ba nhân ba ô.",
        "dmgMultiplier": 2.4,
        "type": "physical",
        "targetType": "enemy_area",
        "energyCost": 100,
        "effects": [
          {
            "type": "area_damage",
            "width": 3,
            "height": 3
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_11",
    "name": "Mộng Cô Bán Trà",
    "sect": "TuDo",
    "role": "Support",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1232.0,
      "hp": 1232.0,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 85,
      "magicalAtk": 65,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 2
    },
    "growthPerLevel": {
      "maxHp": 84.0,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_11",
      "description": "Trả giúp nàng tiền bảo kê quán nước vô lý.",
      "conditions": [
        {
          "type": "resolve_event",
          "eventId": "pay_tea_shop_protection"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_11_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_11_ult",
        "name": "Trà Nóng Tỉnh Mộng",
        "description": "Trà nóng giải choáng, nội thương, độc cho toàn đội; hồi máu và 8 nội lực.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "all_allies",
        "energyCost": 100,
        "effects": [
          {
            "type": "cleanse",
            "statuses": [
              "stun",
              "internal_injury",
              "poison"
            ]
          },
          {
            "type": "heal",
            "scalingStat": "magicalAtk",
            "multiplier": 1.6
          },
          {
            "type": "energy_restore",
            "amount": 8
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_12",
    "name": "Bất Khắc Kiếm Khách",
    "sect": "VoDang",
    "role": "DualDPS",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1050,
      "hp": 1050,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 120,
      "magicalAtk": 100,
      "physicalDef": 45,
      "magicalDef": 65,
      "attackSpeed": 1.15,
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
    "recruitment": {
      "questId": "recruit_12",
      "description": "Mua cho hắn một bầu rượu đắt tiền.",
      "conditions": [
        {
          "type": "deliver",
          "itemId": "quest_expensive_wine",
          "quantity": 1
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_12_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_12_ult",
        "name": "Song Kiếm Ngũ Liên",
        "description": "Song kiếm trảm năm nhát liên hoàn.",
        "dmgMultiplier": 0.8,
        "type": "physical",
        "targetType": "nearest_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "multi_hit",
            "hits": 5
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_13",
    "name": "Quy Tức Lão Nhân",
    "sect": "ThieuLam",
    "role": "ReflectTank",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_13",
      "description": "Đánh thức lão dậy sau giấc ngủ ba ngày.",
      "conditions": [
        {
          "type": "resolve_event",
          "eventId": "wake_sleeping_elder"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_13_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_13_ult",
        "name": "Quy Tức Phản Chấn",
        "description": "Ngồi thiền phản lại 40% sát thương cận chiến.",
        "dmgMultiplier": 0,
        "type": "physical",
        "targetType": "self",
        "energyCost": 100,
        "effects": [
          {
            "type": "melee_reflect",
            "ratio": 0.4,
            "duration": 5
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_14",
    "name": "Thiềm Thừ Bà Bà",
    "sect": "DuongMon",
    "role": "Poisoner",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 950,
      "hp": 950,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 110,
      "magicalAtk": 125,
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
    "recruitment": {
      "questId": "recruit_14",
      "description": "Bắt giúp năm con cóc độc dưới đầm lầy.",
      "conditions": [
        {
          "type": "collect",
          "itemId": "quest_poison_toad",
          "quantity": 5
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_14_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_14_ult",
        "name": "Thiềm Thừ Độc Bạo",
        "description": "Đặt cóc nổ gây độc diện rộng.",
        "dmgMultiplier": 1.8,
        "type": "magical",
        "targetType": "enemy_area",
        "energyCost": 100,
        "effects": [
          {
            "type": "poison",
            "stacks": 2,
            "duration": 5,
            "tickInterval": 1,
            "radius": 1
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_15",
    "name": "Phi Thiên Đạo Tặc",
    "sect": "TuDo",
    "role": "EvasionDPS",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1050,
      "hp": 1050,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 120,
      "magicalAtk": 65,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 1.15,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 2
    },
    "growthPerLevel": {
      "maxHp": 75,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_15",
      "description": "Đuổi kịp hắn trong cuộc đua qua mái nhà.",
      "conditions": [
        {
          "type": "win_minigame",
          "gameId": "rooftop_race"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_15_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_15_ult",
        "name": "Phi Thiên Vô Ảnh",
        "description": "Tăng 50% né tránh trong bốn giây.",
        "dmgMultiplier": 0,
        "type": "physical",
        "targetType": "self",
        "energyCost": 100,
        "effects": [
          {
            "type": "dodge_up",
            "ratio": 0.5,
            "duration": 4
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_16",
    "name": "Hoa Khôi Lầu Xanh",
    "sect": "TuDo",
    "role": "CrowdControl",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1100,
      "hp": 1100,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 85,
      "magicalAtk": 125,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 2
    },
    "growthPerLevel": {
      "maxHp": 75,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_16",
      "description": "Giải cứu nàng khỏi đám đệ tử ăn quỵt tiền.",
      "conditions": [
        {
          "type": "defeat",
          "enemyId": "quest_delinquent_disciples"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_16_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_16_ult",
        "name": "Mê Hồn Vũ",
        "description": "Múa lụa mê hoặc khiến địch đánh đồng đội của chúng.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "nearest_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "charm",
            "duration": 3
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_17",
    "name": "Luyện Đan Đồng Tử",
    "sect": "NgaMi",
    "role": "Battery",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1120.0,
      "hp": 1120.0,
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
      "maxHp": 78.4,
      "physicalAtk": 1,
      "magicalAtk": 7,
      "physicalDef": 2,
      "magicalDef": 4
    },
    "recruitment": {
      "questId": "recruit_17",
      "description": "Tìm lại lò luyện đan bị rơi xuống giếng.",
      "conditions": [
        {
          "type": "recover_item",
          "itemId": "quest_alchemy_furnace"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_17_basic",
        "name": "Hồi Xuân",
        "dmgMultiplier": 0,
        "type": "magical",
        "energyGain": 15,
        "targetType": "lowest_hp_ally",
        "effects": [
          {
            "type": "heal",
            "multiplier": 0.8,
            "scalingStat": "magicalAtk"
          }
        ]
      },
      "ultimate": {
        "id": "companion_17_ult",
        "name": "Đan Khí Tiếp Sức",
        "description": "Bơm trực tiếp 40 nộ khí cho nhân vật chính.",
        "dmgMultiplier": 0,
        "type": "magical",
        "targetType": "hero_ally",
        "energyCost": 100,
        "effects": [
          {
            "type": "energy_restore",
            "amount": 40
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_18",
    "name": "Thiết Đầu Công",
    "sect": "ThieuLam",
    "role": "Disruptor",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_18",
      "description": "Dùng đầu húc vỡ tảng đá phong ấn cửa động.",
      "conditions": [
        {
          "type": "resolve_event",
          "eventId": "break_sealed_cave_rock"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_18_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_18_ult",
        "name": "Thiết Đầu Phá Trận",
        "description": "Húc văng kẻ địch tiền tuyến về hậu tuyến.",
        "dmgMultiplier": 2,
        "type": "physical",
        "targetType": "front_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "knockback",
            "destination": "enemy_back_row"
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_19",
    "name": "Vô Danh Kiếm Nô",
    "sect": "TuDo",
    "role": "Finisher",
    "gridPosition": null,
    "baseStats": {
      "maxHp": 1100,
      "hp": 1100,
      "maxEnergy": 100,
      "energy": 0,
      "physicalAtk": 125,
      "magicalAtk": 65,
      "physicalDef": 35,
      "magicalDef": 40,
      "attackSpeed": 0.9,
      "critRate": 0.1,
      "critDmg": 1.5,
      "dodgeRate": 0.05,
      "blockRate": 0.05,
      "moveSpeed": 1.5,
      "attackRange": 1
    },
    "growthPerLevel": {
      "maxHp": 75,
      "physicalAtk": 5,
      "magicalAtk": 4,
      "physicalDef": 2,
      "magicalDef": 2
    },
    "recruitment": {
      "questId": "recruit_19",
      "description": "Rút thanh kiếm gỉ sét cắm trên tảng đá cổ.",
      "conditions": [
        {
          "type": "recover_item",
          "itemId": "quest_rusted_ancient_sword"
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_19_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_19_ult",
        "name": "Vô Danh Tuyệt Trảm",
        "description": "Chém kết liễu kẻ địch dưới 15% máu.",
        "dmgMultiplier": 2,
        "type": "physical",
        "targetType": "lowest_hp_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "execute",
            "hpThreshold": 0.15
          }
        ]
      }
    },
    "statusEffects": []
  },
  {
    "id": "companion_20",
    "name": "Tửu Tiên Bất Tỉnh",
    "sect": "CaiBang",
    "role": "Wildcard",
    "gridPosition": null,
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
    "recruitment": {
      "questId": "recruit_20",
      "description": "Mang đến loại rượu ngon nhất thiên hạ.",
      "conditions": [
        {
          "type": "deliver",
          "itemId": "quest_finest_wine",
          "quantity": 1
        }
      ]
    },
    "skills": {
      "autoAttack": {
        "id": "companion_20_basic",
        "name": "Đánh thường",
        "dmgMultiplier": 1,
        "type": "physical",
        "energyGain": 15,
        "targetType": "nearest_enemy",
        "effects": []
      },
      "ultimate": {
        "id": "companion_20_ult",
        "name": "Tửu Tiên Nhất Trịch",
        "description": "Quăng bình rượu: gây sát thương lớn hoặc hồi đầy máu.",
        "dmgMultiplier": 0,
        "type": "physical",
        "targetType": "nearest_enemy",
        "energyCost": 100,
        "effects": [
          {
            "type": "random_choice",
            "choices": [
              {
                "weight": 1,
                "type": "damage",
                "targetType": "nearest_enemy",
                "dmgMultiplier": 4
              },
              {
                "weight": 1,
                "type": "full_heal",
                "targetType": "lowest_hp_ally"
              }
            ]
          }
        ]
      }
    },
    "statusEffects": []
  }
];
export const COMPANIONS = deepFreeze(specializeRoster7(expandStoryCompanions(expandCompanions(ORIGINAL_COMPANIONS))));

export const ROLE_LABELS = deepFreeze({"Bruiser": "Đấu sĩ", "SubTank": "Đỡ đòn phụ", "Healer": "Hồi máu", "RangedDPS": "Sát thương tầm xa", "Tank": "Đỡ đòn", "Debuffer": "Suy yếu địch", "BurstMage": "Nội công bộc phát", "Assassin": "Thích khách", "Buffer": "Cường hóa", "Support": "Hỗ trợ", "DualDPS": "Song kiếm", "ReflectTank": "Đỡ đòn / Phản sát thương", "Poisoner": "Độc sát", "EvasionDPS": "Né tránh", "CrowdControl": "Khống chế", "Battery": "Tiếp nộ", "Disruptor": "Phá đội hình", "Finisher": "Kết liễu", "Wildcard": "Biến số"});
export const COMPANIONS_BY_ID = deepFreeze(Object.fromEntries(COMPANIONS.map(unit => [unit.id, unit])));
