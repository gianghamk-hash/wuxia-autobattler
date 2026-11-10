import {deepFreeze} from './DataUtils.js';

/**
 * Sprint 1: sixty authored journeys keyed by stable companion IDs.
 * Narrative hooks, battle evidence and two explicit trade-off outcomes are
 * independent of the original 60 max-affinity passives and never mutate them.
 */
export const COMPANION_JOURNEY_DESIGNS = deepFreeze({
  "companion_01": {
    "id": "companion_01",
    "quest": {
      "id": "bond_companion_01_50",
      "title": "Bát cơm chờ người",
      "context": "Đưa bạn đồng hành trở về sau trận, giữ lại phần cơm cho người vắng mặt",
      "metric": "survive",
      "required": 1,
      "objective": "Đưa bạn đồng hành trở về sau trận, giữ lại phần cơm cho người vắng mặt — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Bát cơm chờ người",
      "context": "Sau biến cố «Bát cơm chờ người», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_01_mercy",
          "label": "Chia bát cơm cuối",
          "statChanges": {
            "maxHp": 0.1,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_01_truth",
          "label": "Mang cơm đi tìm người",
          "statChanges": {
            "physicalAtk": 0.075,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_01",
      "frame": "Bếp lửa soi chiếc bát sứ còn nguyên vệt nứt",
      "confession": "Ta từng ăn phần người khác để giả vờ họ vẫn bên cạnh",
      "climax": "Lần này bát thứ sáu được đặt xuống cho người vừa trở về",
      "chapter": 1
    }
  },
  "companion_02": {
    "id": "companion_02",
    "quest": {
      "id": "bond_companion_02_50",
      "title": "Bàn cờ không giấu quân",
      "context": "Giữ thế trận mà không đánh đổi đồng đội như quân cờ vô danh",
      "metric": "poise",
      "required": 1,
      "objective": "Giữ thế trận mà không đánh đổi đồng đội như quân cờ vô danh — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Bàn cờ không giấu quân",
      "context": "Sau biến cố «Bàn cờ không giấu quân», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_02_mercy",
          "label": "Bày cờ công khai",
          "statChanges": {
            "magicalAtk": 0.095,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_02_truth",
          "label": "Giữ nước cờ bí mật",
          "statChanges": {
            "physicalDef": 0.125,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_02",
      "frame": "Quân cờ trắng nằm lật ngửa giữa trời mưa",
      "confession": "Ta từng giấu quân để thắng, rồi giấu luôn cả lỗi của mình",
      "climax": "Huyền Đạo Trưởng tự tay đặt quân sai lên giữa bàn cho mọi người nhìn thấy",
      "chapter": 2
    }
  },
  "companion_03": {
    "id": "companion_03",
    "quest": {
      "id": "bond_companion_03_50",
      "title": "Nỗi sợ của người chữa bệnh",
      "context": "Cứu một đồng đội trong giao tranh dù chính mình còn sợ",
      "metric": "aid",
      "required": 1,
      "objective": "Cứu một đồng đội trong giao tranh dù chính mình còn sợ — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Nỗi sợ của người chữa bệnh",
      "context": "Sau biến cố «Nỗi sợ của người chữa bệnh», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_03_mercy",
          "label": "Nói thật nỗi sợ",
          "statChanges": {
            "physicalDef": 0.13,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_03_truth",
          "label": "Giữ bình tĩnh trước bệnh nhân",
          "statChanges": {
            "physicalAtk": 0.095,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_03",
      "frame": "Một con chuột chạy qua mái trạm xá lúc tiếng gõ cửa vang lên",
      "confession": "Tay ta run mỗi khi nghe tiếng thở khó nhọc, nhưng ta chưa từng dám nói",
      "climax": "Tiểu Muội quỳ xuống cạnh giường, đọc tên người bệnh thật rõ",
      "chapter": 3
    }
  },
  "companion_04": {
    "id": "companion_04",
    "quest": {
      "id": "bond_companion_04_50",
      "title": "Ba mũi kim trả lại",
      "context": "Dùng tuyệt kỹ để ngăn ám khí rơi vào tay kẻ xấu",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng tuyệt kỹ để ngăn ám khí rơi vào tay kẻ xấu — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Ba mũi kim trả lại",
      "context": "Sau biến cố «Ba mũi kim trả lại», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_04_mercy",
          "label": "Thu hồi mẫu kim cũ",
          "statChanges": {
            "preparedEnergy": 0.12,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_04_truth",
          "label": "Công khai cách tháo kim",
          "statChanges": {
            "maxHp": 0.095,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_04",
      "frame": "Ba mũi kim gỉ nằm trên tấm khăn trắng của người thợ",
      "confession": "Ta làm chúng để cứu người bị vây, kẻ khác lại dùng để đổ máu",
      "climax": "Đường Thập Nhị bẻ mũi kim cuối và khâu lại vạt áo nạn nhân",
      "chapter": 4
    }
  },
  "companion_05": {
    "id": "companion_05",
    "quest": {
      "id": "bond_companion_05_50",
      "title": "Cửa thiền mở trong đêm",
      "context": "Chống chịu đòn đánh để đoàn người qua được cánh cổng chùa",
      "metric": "defend",
      "required": 1,
      "objective": "Chống chịu đòn đánh để đoàn người qua được cánh cổng chùa — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Cửa thiền mở trong đêm",
      "context": "Sau biến cố «Cửa thiền mở trong đêm», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_05_mercy",
          "label": "Mở cửa đón người lạ",
          "statChanges": {
            "magicalDef": 0.125,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_05_truth",
          "label": "Giữ cửa và thương lượng",
          "statChanges": {
            "magicalAtk": 0.09,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_05",
      "frame": "Cánh cổng gỗ rung trong gió, một ngọn đèn còn cháy",
      "confession": "Ta sợ phá giới hơn sợ người nằm chết ngoài thềm",
      "climax": "Đại Lực Kim Cang lùi một bước, nhường ngưỡng cửa cho cả đoàn",
      "chapter": 5
    }
  },
  "companion_06": {
    "id": "companion_06",
    "quest": {
      "id": "bond_companion_06_50",
      "title": "Tên người trong toa thuốc",
      "context": "Chống chịu và giữ sức để tìm người sống sót từ toa thuốc giả",
      "metric": "survive",
      "required": 1,
      "objective": "Chống chịu và giữ sức để tìm người sống sót từ toa thuốc giả — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Tên người trong toa thuốc",
      "context": "Sau biến cố «Tên người trong toa thuốc», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_06_mercy",
          "label": "Trao thuốc giải cho dân",
          "statChanges": {
            "dodgeRate": 0.035,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_06_truth",
          "label": "Đem toa thuốc đến quan",
          "statChanges": {
            "physicalDef": 0.115,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_06",
      "frame": "Chai sứ mất nhãn được đặt cạnh bản khai dính mực",
      "confession": "Một nét gạch của ta suýt cướp đi mạng người không biết mặt",
      "climax": "Lý Độc Thủ chép lại tên bệnh nhân lên lọ thuốc mới",
      "chapter": 6
    }
  },
  "companion_07": {
    "id": "companion_07",
    "quest": {
      "id": "bond_companion_07_50",
      "title": "Dự báo trước bão",
      "context": "Phối hợp một tuyệt kỹ đúng lúc giữ thuyền qua dòng nước xiết",
      "metric": "ultimate",
      "required": 1,
      "objective": "Phối hợp một tuyệt kỹ đúng lúc giữ thuyền qua dòng nước xiết — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Dự báo trước bão",
      "context": "Sau biến cố «Dự báo trước bão», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_07_mercy",
          "label": "Thừa nhận dự báo sai",
          "statChanges": {
            "preparedDamage": 0.08,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_07_truth",
          "label": "Tự chèo thuyền chuộc lỗi",
          "statChanges": {
            "maxHp": 0.105,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_07",
      "frame": "Tấm bản đồ sao ướt sũng treo trước ngọn đèn xanh",
      "confession": "Ta đếm đúng mây mà quên hỏi người chèo đò về nước",
      "climax": "Ngô Sách xóa dấu sao sai rồi nhường tay lái cho lão lái thuyền",
      "chapter": 7
    }
  },
  "companion_08": {
    "id": "companion_08",
    "quest": {
      "id": "bond_companion_08_50",
      "title": "Khoản nợ không có giấy",
      "context": "Giành chiến thắng mà không để người đi cùng bị bỏ lại ở bến",
      "metric": "protect",
      "required": 1,
      "objective": "Giành chiến thắng mà không để người đi cùng bị bỏ lại ở bến — Thắng một trận khi nhân vật chính và đồng hành đều sống sót."
    },
    "branch": {
      "title": "Ngã rẽ · Khoản nợ không có giấy",
      "context": "Sau biến cố «Khoản nợ không có giấy», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_08_mercy",
          "label": "Trả lại tiền công",
          "statChanges": {
            "physicalAtk": 0.095,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_08_truth",
          "label": "Đưa sổ nợ ra đối chất",
          "statChanges": {
            "magicalAtk": 0.105,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_08",
      "frame": "Bến sông vắng, dấu chân phu khuân hàng còn in trên bùn",
      "confession": "Ta gọi đó là thay tuyến để kiếm lời, họ gọi là mất cả bữa cơm",
      "climax": "Mai Tước đặt túi bạc trước người phu và ngồi nghe đến hết",
      "chapter": 8
    }
  },
  "companion_09": {
    "id": "companion_09",
    "quest": {
      "id": "bond_companion_09_50",
      "title": "Tên người dưới tiếng mõ",
      "context": "Giữ đồng đội sống qua trận để không ai bị xóa tên khỏi sổ thuốc",
      "metric": "guard",
      "required": 1,
      "objective": "Giữ đồng đội sống qua trận để không ai bị xóa tên khỏi sổ thuốc — Thắng một trận cùng ít nhất ba thành viên trong đội còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Tên người dưới tiếng mõ",
      "context": "Sau biến cố «Tên người dưới tiếng mõ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_09_mercy",
          "label": "Đọc tên người đã mất",
          "statChanges": {
            "maxHp": 0.13,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_09_truth",
          "label": "Giữ sổ thuốc để truy cứu",
          "statChanges": {
            "magicalDef": 0.14,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_09",
      "frame": "Tiếng mõ chùa ngân bên trang giấy ghi dở",
      "confession": "Ta không chữa được tất cả, nhưng có thể giữ cho họ một cái tên",
      "climax": "Sư thái đọc từng tên dưới ngọn đèn, không bỏ qua ai",
      "chapter": 9
    }
  },
  "companion_10": {
    "id": "companion_10",
    "quest": {
      "id": "bond_companion_10_50",
      "title": "Mũi tên không rời dây",
      "context": "Khống chế nhịp chiến đấu mà không phải hạ người đưa thư",
      "metric": "ultimate",
      "required": 1,
      "objective": "Khống chế nhịp chiến đấu mà không phải hạ người đưa thư — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Mũi tên không rời dây",
      "context": "Sau biến cố «Mũi tên không rời dây», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_10_mercy",
          "label": "Buông dây cứu sứ giả",
          "statChanges": {
            "critRate": 0.025,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_10_truth",
          "label": "Giữ thư làm chứng cứ",
          "statChanges": {
            "maxHp": 0.105,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_10",
      "frame": "Mũi tên chạm mép ống thư trong bàn tay run",
      "confession": "Ta nhìn thấy mục tiêu trước khi thấy người mang tin",
      "climax": "Bách Bộ hạ cung, dùng dây cung buộc lại cánh tay bị thương",
      "chapter": 10
    }
  },
  "companion_11": {
    "id": "companion_11",
    "quest": {
      "id": "bond_companion_11_50",
      "title": "Lời hứa trả lại",
      "context": "Hỗ trợ đồng hành vượt qua một trận mà không bỏ ai phía sau",
      "metric": "aid",
      "required": 1,
      "objective": "Hỗ trợ đồng hành vượt qua một trận mà không bỏ ai phía sau — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Lời hứa trả lại",
      "context": "Sau biến cố «Lời hứa trả lại», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_11_mercy",
          "label": "Xin lỗi người ở lại",
          "statChanges": {
            "maxHp": 0.105,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_11_truth",
          "label": "Hoàn thành lời hứa cũ",
          "statChanges": {
            "physicalAtk": 0.08,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_11",
      "frame": "Một sợi dây buộc trên cột quán đã bạc màu",
      "confession": "Ta tưởng giữ lời là đủ, không biết có người đã chờ đến mỏi mòn",
      "climax": "Người giữ lời tháo nút dây, buộc lại bằng tên người hiện tại",
      "chapter": 11
    }
  },
  "companion_12": {
    "id": "companion_12",
    "quest": {
      "id": "bond_companion_12_50",
      "title": "Bản lệnh bỏ trống",
      "context": "Dùng chiêu kiếm giải vây mà không ký lệnh chưa đọc",
      "metric": "impact",
      "required": 1,
      "objective": "Dùng chiêu kiếm giải vây mà không ký lệnh chưa đọc — Thắng một trận có đóng góp sát thương đáng kể của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Bản lệnh bỏ trống",
      "context": "Sau biến cố «Bản lệnh bỏ trống», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_12_mercy",
          "label": "Từ chối lệnh trái đạo",
          "statChanges": {
            "magicalAtk": 0.1,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_12_truth",
          "label": "Công khai nội dung lệnh",
          "statChanges": {
            "physicalDef": 0.13,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_12",
      "frame": "Lá lệnh không dấu nằm cạnh thanh kiếm chưa rút",
      "confession": "Người ta gọi ta hèn vì không chịu ký bằng máu của kẻ khác",
      "climax": "Kiếm khách đặt thanh kiếm ngang trang giấy và yêu cầu được đọc",
      "chapter": 12
    }
  },
  "companion_13": {
    "id": "companion_13",
    "quest": {
      "id": "bond_companion_13_50",
      "title": "Đường chỉ dưới áo",
      "context": "Đứng vững trong trận, nhận ra người đã từng cứu kẻ truy đuổi",
      "metric": "defend",
      "required": 1,
      "objective": "Đứng vững trong trận, nhận ra người đã từng cứu kẻ truy đuổi — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Đường chỉ dưới áo",
      "context": "Sau biến cố «Đường chỉ dưới áo», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_13_mercy",
          "label": "Chữa vết thương kẻ thù",
          "statChanges": {
            "physicalDef": 0.12,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_13_truth",
          "label": "Tìm chủ nhân đường khâu",
          "statChanges": {
            "physicalAtk": 0.085,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_13",
      "frame": "Tà áo rách được lật mặt trong, lộ mũi chỉ vụng",
      "confession": "Ta từng cười đường chỉ xấu; hóa ra chính nó giữ một người sống",
      "climax": "Người giữ áo kéo lại mũi kim, không giấu vết vá nữa",
      "chapter": 13
    }
  },
  "companion_14": {
    "id": "companion_14",
    "quest": {
      "id": "bond_companion_14_50",
      "title": "Bẫy mở đường",
      "context": "Dùng kỹ năng đánh lạc hướng để giữ mạng sinh linh trong bẫy",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng kỹ năng đánh lạc hướng để giữ mạng sinh linh trong bẫy — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Bẫy mở đường",
      "context": "Sau biến cố «Bẫy mở đường», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_14_mercy",
          "label": "Tháo hết bẫy cũ",
          "statChanges": {
            "preparedEnergy": 0.125,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_14_truth",
          "label": "Giữ một bẫy để dẫn dụ",
          "statChanges": {
            "maxHp": 0.1,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_14",
      "frame": "Sợi dây bẫy đứt dưới chân một con chim ướt",
      "confession": "Ta đặt bẫy để kiếm tiền, giờ chỉ nghe tiếng kêu trong đêm",
      "climax": "Người giăng bẫy tháo nút cuối rồi mở lồng thả chim",
      "chapter": 14
    }
  },
  "companion_15": {
    "id": "companion_15",
    "quest": {
      "id": "bond_companion_15_50",
      "title": "Chén thứ sáu cho bạn",
      "context": "Giành chiến thắng và cùng trở về quán rượu tìm người bạn cũ",
      "metric": "survive",
      "required": 1,
      "objective": "Giành chiến thắng và cùng trở về quán rượu tìm người bạn cũ — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Chén thứ sáu cho bạn",
      "context": "Sau biến cố «Chén thứ sáu cho bạn», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_15_mercy",
          "label": "Nâng chén xin lỗi",
          "statChanges": {
            "magicalDef": 0.13,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_15_truth",
          "label": "Giữ lại chén làm tin",
          "statChanges": {
            "magicalAtk": 0.095,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_15",
      "frame": "Sáu chiếc chén bày trên bàn nhưng chỉ có năm người",
      "confession": "Ta đùa đến mức không biết bạn mình đã bỏ đi từ khi nào",
      "climax": "Chén thứ sáu được rót đầy, người bạn cuối cùng bước qua cửa",
      "chapter": 15
    }
  },
  "companion_16": {
    "id": "companion_16",
    "quest": {
      "id": "bond_companion_16_50",
      "title": "Nửa canh cứu người",
      "context": "Bỏ thiền định đúng lúc bảo vệ người yếu thế khỏi nguy hiểm",
      "metric": "guard",
      "required": 1,
      "objective": "Bỏ thiền định đúng lúc bảo vệ người yếu thế khỏi nguy hiểm — Thắng một trận cùng ít nhất ba thành viên trong đội còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Nửa canh cứu người",
      "context": "Sau biến cố «Nửa canh cứu người», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_16_mercy",
          "label": "Rời thiền đi cứu",
          "statChanges": {
            "dodgeRate": 0.025,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_16_truth",
          "label": "Nhờ người khác cứu trước",
          "statChanges": {
            "physicalDef": 0.105,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_16",
      "frame": "Chiếc mõ ngừng giữa tiếng kêu phía bờ suối",
      "confession": "Ta cứ ngồi yên, tự hỏi tĩnh tâm có nghĩa là không nghe thấy",
      "climax": "Người tu hành đứng dậy, ngọn đèn dầu vẫn cháy sau lưng",
      "chapter": 16
    }
  },
  "companion_17": {
    "id": "companion_17",
    "quest": {
      "id": "bond_companion_17_50",
      "title": "Sự thật trong mũi châm",
      "context": "Giúp đồng hành hồi phục khi phải nói ra lời khó nghe",
      "metric": "aid",
      "required": 1,
      "objective": "Giúp đồng hành hồi phục khi phải nói ra lời khó nghe — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Sự thật trong mũi châm",
      "context": "Sau biến cố «Sự thật trong mũi châm», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_17_mercy",
          "label": "Nói hết bệnh tình",
          "statChanges": {
            "preparedDamage": 0.085,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_17_truth",
          "label": "Cho người bệnh thời gian",
          "statChanges": {
            "maxHp": 0.11,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_17",
      "frame": "Một mũi châm nằm giữa hai tờ kết quả trái nhau",
      "confession": "Ta có thể giấu nỗi đau hôm nay, nhưng không giấu được ngày mai",
      "climax": "Người thầy thuốc trao bản chẩn đoán bằng cả hai tay",
      "chapter": 17
    }
  },
  "companion_18": {
    "id": "companion_18",
    "quest": {
      "id": "bond_companion_18_50",
      "title": "Thư muộn vẫn tới",
      "context": "Đưa tin kịp tới người nhận sau một chiến thắng có đồng hành tham chiến",
      "metric": "swift",
      "required": 1,
      "objective": "Đưa tin kịp tới người nhận sau một chiến thắng có đồng hành tham chiến — Thắng một trận dưới 100 giây khi đồng hành còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Thư muộn vẫn tới",
      "context": "Sau biến cố «Thư muộn vẫn tới», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_18_mercy",
          "label": "Giao thư tận tay",
          "statChanges": {
            "physicalAtk": 0.1,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_18_truth",
          "label": "Đọc thư trước để bảo vệ",
          "statChanges": {
            "magicalAtk": 0.11,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_18",
      "frame": "Lá thư cũ ép dưới đáy hòm, dấu niêm phong còn nguyên",
      "confession": "Ta đi qua cánh cửa này ba lần mà không dám gõ",
      "climax": "Người đưa tin gõ cửa lần thứ tư, không quay đầu",
      "chapter": 18
    }
  },
  "companion_19": {
    "id": "companion_19",
    "quest": {
      "id": "bond_companion_19_50",
      "title": "Trang tên không được xóa",
      "context": "Giữ người cùng đội sống để sửa tên người vô tội trong sổ sử",
      "metric": "protect",
      "required": 1,
      "objective": "Giữ người cùng đội sống để sửa tên người vô tội trong sổ sử — Thắng một trận khi nhân vật chính và đồng hành đều sống sót."
    },
    "branch": {
      "title": "Ngã rẽ · Trang tên không được xóa",
      "context": "Sau biến cố «Trang tên không được xóa», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_19_mercy",
          "label": "Công khai bản gốc",
          "statChanges": {
            "maxHp": 0.12,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_19_truth",
          "label": "Giữ chứng cứ chờ phiên xét",
          "statChanges": {
            "magicalDef": 0.13,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_19",
      "frame": "Trang sử có một ô giấy trắng lộ vết cạo",
      "confession": "Ta xóa một chữ vì sợ, rồi cả một người biến mất khỏi giấy",
      "climax": "Người chép sử viết lại tên bằng nét mực không thể tẩy",
      "chapter": 19
    }
  },
  "companion_20": {
    "id": "companion_20",
    "quest": {
      "id": "bond_companion_20_50",
      "title": "Đường về xóm cũ",
      "context": "Gánh đòn cùng đội hình để đưa gia đình bị bỏ lại về nhà",
      "metric": "defend",
      "required": 1,
      "objective": "Gánh đòn cùng đội hình để đưa gia đình bị bỏ lại về nhà — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Đường về xóm cũ",
      "context": "Sau biến cố «Đường về xóm cũ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_20_mercy",
          "label": "Quay lại đón người",
          "statChanges": {
            "critRate": 0.03,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_20_truth",
          "label": "Chờ viện binh giữ đường",
          "statChanges": {
            "maxHp": 0.11,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_20",
      "frame": "Con đường rừng có một chiếc dép trẻ em nằm bên gốc cây",
      "confession": "Ta cứ tưởng hộ tống xong là xong cả nghĩa",
      "climax": "Người hộ viện quay ngựa, trả lại chiếc dép cho đứa bé",
      "chapter": 20
    }
  },
  "companion_21": {
    "id": "companion_21",
    "quest": {
      "id": "bond_companion_21_50",
      "title": "Con rối chỉ lối",
      "context": "Sống sót qua trận và dẫn đường bằng tiết mục rối của Chú Tễu",
      "metric": "poise",
      "required": 1,
      "objective": "Sống sót qua trận và dẫn đường bằng tiết mục rối của Chú Tễu — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Con rối chỉ lối",
      "context": "Sau biến cố «Con rối chỉ lối», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_21_mercy",
          "label": "Dạy trẻ trò rối thoát hiểm",
          "statChanges": {
            "maxHp": 0.11,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_21_truth",
          "label": "Giấu đường đi trong trò diễn",
          "statChanges": {
            "physicalAtk": 0.085,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_21",
      "frame": "Con rối gỗ giơ tay chỉ về phía chiếc cầu hẹp",
      "confession": "Ta sợ lũ trẻ khóc, nên tự mình đóng vai kẻ ngốc",
      "climax": "Chú Tễu cúi chào, phía sau lũ trẻ đã vượt cầu bình an",
      "chapter": 1
    }
  },
  "companion_22": {
    "id": "companion_22",
    "quest": {
      "id": "bond_companion_22_50",
      "title": "Tên thật trong sổ bệnh",
      "context": "Hồi sức cho người bệnh và đổi cách gọi họ trong sổ nợ",
      "metric": "aid",
      "required": 1,
      "objective": "Hồi sức cho người bệnh và đổi cách gọi họ trong sổ nợ — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Tên thật trong sổ bệnh",
      "context": "Sau biến cố «Tên thật trong sổ bệnh», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_22_mercy",
          "label": "Trả tên thật cho bệnh nhân",
          "statChanges": {
            "magicalAtk": 0.09,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_22_truth",
          "label": "Giữ sổ nợ để đối chứng",
          "statChanges": {
            "physicalDef": 0.12,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_22",
      "frame": "Một trang sổ thuốc ghi bệnh nhân dưới cái tên con nợ",
      "confession": "Ta nhận ra người ta đau cả vì cách mình gọi họ",
      "climax": "Sen Non gạch chữ nợ, viết tên thật vào ô trống",
      "chapter": 2
    }
  },
  "companion_23": {
    "id": "companion_23",
    "quest": {
      "id": "bond_companion_23_50",
      "title": "Phiếu thu dưới lá",
      "context": "Đem phiếu thu bị giấu ra ánh sáng trong một cuộc đối đầu",
      "metric": "impact",
      "required": 1,
      "objective": "Đem phiếu thu bị giấu ra ánh sáng trong một cuộc đối đầu — Thắng một trận có đóng góp sát thương đáng kể của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Phiếu thu dưới lá",
      "context": "Sau biến cố «Phiếu thu dưới lá», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_23_mercy",
          "label": "Giao phiếu cho dân làng",
          "statChanges": {
            "physicalDef": 0.125,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_23_truth",
          "label": "Giữ phiếu nhờ sư trụ trì",
          "statChanges": {
            "physicalAtk": 0.09,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_23",
      "frame": "Tờ phiếu thu tô dính đất rơi ra dưới chiếc lá bồ đề",
      "confession": "Ta đã quét sân cả đời mà không thấy nỗi sợ ngay dưới chân",
      "climax": "Mộc An giũ sạch lớp đất và đọc to số thóc bị lấy",
      "chapter": 3
    }
  },
  "companion_24": {
    "id": "companion_24",
    "quest": {
      "id": "bond_companion_24_50",
      "title": "Lời nói thay lưỡi kiếm",
      "context": "Chiến thắng bằng việc giữ tỉnh táo, không nóng vội rút kiếm",
      "metric": "poise",
      "required": 1,
      "objective": "Chiến thắng bằng việc giữ tỉnh táo, không nóng vội rút kiếm — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Lời nói thay lưỡi kiếm",
      "context": "Sau biến cố «Lời nói thay lưỡi kiếm», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_24_mercy",
          "label": "Đối chất công khai",
          "statChanges": {
            "preparedEnergy": 0.13,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_24_truth",
          "label": "Lặng lẽ ghi lời khai",
          "statChanges": {
            "maxHp": 0.105,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_24",
      "frame": "Thanh kiếm gỗ đặt trên bàn hội làng, cạnh bản cam kết",
      "confession": "Ta đã học trăm đường kiếm; hôm nay chỉ cần một câu đúng",
      "climax": "Lam Nhi đặt thanh kiếm gỗ xuống, đẩy bản cam kết tới trước",
      "chapter": 4
    }
  },
  "companion_25": {
    "id": "companion_25",
    "quest": {
      "id": "bond_companion_25_50",
      "title": "Tiếng còi của lá thư giả",
      "context": "Phá mưu bằng nhịp còi đúng lúc trong giao tranh",
      "metric": "ultimate",
      "required": 1,
      "objective": "Phá mưu bằng nhịp còi đúng lúc trong giao tranh — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Tiếng còi của lá thư giả",
      "context": "Sau biến cố «Tiếng còi của lá thư giả», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_25_mercy",
          "label": "Báo động cả bến",
          "statChanges": {
            "magicalDef": 0.12,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_25_truth",
          "label": "Lần theo người đưa thư giả",
          "statChanges": {
            "magicalAtk": 0.085,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_25",
      "frame": "Tiếng còi thứ ba vang ngược nhịp đò thường lệ",
      "confession": "Ta từng nghĩ chỉ có trẻ con mới sợ thổi còi sai",
      "climax": "Tín Còi thổi lại đúng nhịp, đoàn đò đồng loạt quay đầu",
      "chapter": 5
    }
  },
  "companion_26": {
    "id": "companion_26",
    "quest": {
      "id": "bond_companion_26_50",
      "title": "Chiếc mõ không còn hát oan",
      "context": "Bảo vệ người bị vu oan dù chiếc mõ chỉ còn một mảnh",
      "metric": "guard",
      "required": 1,
      "objective": "Bảo vệ người bị vu oan dù chiếc mõ chỉ còn một mảnh — Thắng một trận cùng ít nhất ba thành viên trong đội còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Chiếc mõ không còn hát oan",
      "context": "Sau biến cố «Chiếc mõ không còn hát oan», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_26_mercy",
          "label": "Gõ mõ kể sự thật",
          "statChanges": {
            "dodgeRate": 0.03,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_26_truth",
          "label": "Giấu mõ để cứu nhân chứng",
          "statChanges": {
            "physicalDef": 0.11,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_26",
      "frame": "Chiếc mõ nứt đặt trước hội làng, dây gõ đã rách",
      "confession": "Ta không còn mõ lành, nhưng vẫn còn tiếng nói",
      "climax": "Bàu Rách gõ lên mảnh gỗ, cả sân đình lặng đi",
      "chapter": 6
    }
  },
  "companion_27": {
    "id": "companion_27",
    "quest": {
      "id": "bond_companion_27_50",
      "title": "Sổ đò hai bờ",
      "context": "Trở về sau trận với người đi cùng, đối chiếu từng chuyến đò",
      "metric": "survive",
      "required": 1,
      "objective": "Trở về sau trận với người đi cùng, đối chiếu từng chuyến đò — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Sổ đò hai bờ",
      "context": "Sau biến cố «Sổ đò hai bờ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_27_mercy",
          "label": "Khai hết chuyến bị nghi",
          "statChanges": {
            "preparedDamage": 0.09,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_27_truth",
          "label": "Đưa người lái đò làm chứng",
          "statChanges": {
            "maxHp": 0.115,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_27",
      "frame": "Sổ đò lật giữa gió, hai bờ viết bằng hai nét chữ",
      "confession": "Ta chỉ ghi một phía vì nghĩ chẳng ai hỏi phía còn lại",
      "climax": "Bảy Cò lật sổ, mở trang mới ghi đủ cả hai bờ",
      "chapter": 7
    }
  },
  "companion_28": {
    "id": "companion_28",
    "quest": {
      "id": "bond_companion_28_50",
      "title": "Vườn mận không rào",
      "context": "Giành thắng lợi mà không mất người để giữ vườn của kẻ yếu",
      "metric": "protect",
      "required": 1,
      "objective": "Giành thắng lợi mà không mất người để giữ vườn của kẻ yếu — Thắng một trận khi nhân vật chính và đồng hành đều sống sót."
    },
    "branch": {
      "title": "Ngã rẽ · Vườn mận không rào",
      "context": "Sau biến cố «Vườn mận không rào», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_28_mercy",
          "label": "Mời đối thủ hái mận",
          "statChanges": {
            "physicalAtk": 0.09,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_28_truth",
          "label": "Giữ cây cho người làm thuê",
          "statChanges": {
            "magicalAtk": 0.1,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_28",
      "frame": "Quả mận chín rơi cạnh hàng rào vừa tháo",
      "confession": "Ta giữ vườn bằng đá ném, giờ muốn thử bằng một lời mời",
      "climax": "Mận Chua đặt rổ quả chua trước người từng tranh đất",
      "chapter": 8
    }
  },
  "companion_29": {
    "id": "companion_29",
    "quest": {
      "id": "bond_companion_29_50",
      "title": "Cổng chùa lúc khuya",
      "context": "Chặn đòn giữ cổng mở cho người bệnh qua trong đêm",
      "metric": "defend",
      "required": 1,
      "objective": "Chặn đòn giữ cổng mở cho người bệnh qua trong đêm — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Cổng chùa lúc khuya",
      "context": "Sau biến cố «Cổng chùa lúc khuya», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_29_mercy",
          "label": "Mở cổng không hỏi giấy",
          "statChanges": {
            "maxHp": 0.125,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_29_truth",
          "label": "Đánh chuông gọi sư trụ trì",
          "statChanges": {
            "magicalDef": 0.135,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_29",
      "frame": "Cánh cổng chùa mở hé dưới ánh đèn pin của phu cáng",
      "confession": "Ta đã học cách đóng cổng đúng giờ; chưa học cách nhìn người đang sốt",
      "climax": "Tùng Gầy kéo chốt cửa thật mạnh để đoàn cáng bước vào",
      "chapter": 9
    }
  },
  "companion_30": {
    "id": "companion_30",
    "quest": {
      "id": "bond_companion_30_50",
      "title": "Mũi chỉ nhận diện",
      "context": "Giữ vững thế trận để trả lại tấm áo làm chứng tích",
      "metric": "poise",
      "required": 1,
      "objective": "Giữ vững thế trận để trả lại tấm áo làm chứng tích — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Mũi chỉ nhận diện",
      "context": "Sau biến cố «Mũi chỉ nhận diện», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_30_mercy",
          "label": "Trao áo cho người bị hại",
          "statChanges": {
            "critRate": 0.035,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_30_truth",
          "label": "Khâu dấu kín để bảo vệ",
          "statChanges": {
            "maxHp": 0.115,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_30",
      "frame": "Tấm áo được giơ trước ánh đèn, mũi chỉ đỏ nổi lên",
      "confession": "Mỗi mũi chỉ đều có một người, không phải chỉ để áo khỏi rách",
      "climax": "Cúc Mộc khâu thêm sợi chỉ đỏ và đọc tên chủ áo",
      "chapter": 10
    }
  },
  "companion_31": {
    "id": "companion_31",
    "quest": {
      "id": "bond_companion_31_50",
      "title": "Tên khắc trong chuông",
      "context": "Dùng tuyệt kỹ phá lớp phòng thủ để tìm tên người đúc chuông",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng tuyệt kỹ phá lớp phòng thủ để tìm tên người đúc chuông — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Tên khắc trong chuông",
      "context": "Sau biến cố «Tên khắc trong chuông», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_31_mercy",
          "label": "Khắc tên thợ lên chuông",
          "statChanges": {
            "maxHp": 0.1,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_31_truth",
          "label": "Đưa bằng chứng tới phường đúc",
          "statChanges": {
            "physicalAtk": 0.075,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_31",
      "frame": "Mặt trong quả chuông có vết đục một cái tên",
      "confession": "Tiếng chuông vang mà người làm nó bị buộc im",
      "climax": "Phúc Đồng cầm dùi, tiếng chuông đầu tiên vang cùng tên thợ",
      "chapter": 11
    }
  },
  "companion_32": {
    "id": "companion_32",
    "quest": {
      "id": "bond_companion_32_50",
      "title": "Hợp đồng ai cũng được đọc",
      "context": "Giữ đồng hành sống sót để giúp người hộ vệ đọc bản giao kèo",
      "metric": "guard",
      "required": 1,
      "objective": "Giữ đồng hành sống sót để giúp người hộ vệ đọc bản giao kèo — Thắng một trận cùng ít nhất ba thành viên trong đội còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Hợp đồng ai cũng được đọc",
      "context": "Sau biến cố «Hợp đồng ai cũng được đọc», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_32_mercy",
          "label": "Đọc hợp đồng trước dân",
          "statChanges": {
            "magicalAtk": 0.095,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_32_truth",
          "label": "Trả hợp đồng về chủ cũ",
          "statChanges": {
            "physicalDef": 0.125,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_32",
      "frame": "Mảnh hợp đồng ướt phơi cạnh bếp than, chữ nhỏ dần hiện lên",
      "confession": "Ta cầm kiếm thay họ, nhưng chưa từng hỏi họ có được đọc chữ không",
      "climax": "Liễu Thanh xoay tờ giấy về phía người hộ vệ, không ai ký vội",
      "chapter": 12
    }
  },
  "companion_33": {
    "id": "companion_33",
    "quest": {
      "id": "bond_companion_33_50",
      "title": "Đêm giữ bệnh án",
      "context": "Bảo vệ người bệnh và giữ lại lời chẩn đoán nguyên vẹn",
      "metric": "aid",
      "required": 1,
      "objective": "Bảo vệ người bệnh và giữ lại lời chẩn đoán nguyên vẹn — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Đêm giữ bệnh án",
      "context": "Sau biến cố «Đêm giữ bệnh án», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_33_mercy",
          "label": "Giữ kín bệnh án cho bệnh nhân",
          "statChanges": {
            "physicalDef": 0.13,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_33_truth",
          "label": "Nộp bản sao để truy chứng",
          "statChanges": {
            "physicalAtk": 0.095,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_33",
      "frame": "Lều thuốc rung theo gió, tấm bệnh án được ép dưới hộp kim",
      "confession": "Ta không thể chữa bằng một lời khai bị sửa",
      "climax": "Trúc Yên đưa bệnh án vào tay bệnh nhân trước khi người khác chạm tới",
      "chapter": 13
    }
  },
  "companion_34": {
    "id": "companion_34",
    "quest": {
      "id": "bond_companion_34_50",
      "title": "Lồng chim bỏ ngỏ",
      "context": "Dùng tuyệt kỹ để phá bẫy mà không làm hại người bị mắc",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng tuyệt kỹ để phá bẫy mà không làm hại người bị mắc — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Lồng chim bỏ ngỏ",
      "context": "Sau biến cố «Lồng chim bỏ ngỏ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_34_mercy",
          "label": "Tháo lồng mở đường",
          "statChanges": {
            "preparedEnergy": 0.12,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_34_truth",
          "label": "Giữ bẫy làm vật chứng",
          "statChanges": {
            "maxHp": 0.095,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_34",
      "frame": "Lồng chim treo nghiêng, dây bẫy cứa vào thân cây",
      "confession": "Ta từng tự hào vì bẫy không ai thoát; giờ chỉ muốn nó mở",
      "climax": "Vân Rổ tháo cửa lồng bằng chiếc kim nhỏ, chim vỗ cánh",
      "chapter": 14
    }
  },
  "companion_35": {
    "id": "companion_35",
    "quest": {
      "id": "bond_companion_35_50",
      "title": "Sáu chén hòa giải",
      "context": "Giữ một trận đấu ổn định, buộc đôi bên nghe hết lời nhau",
      "metric": "duration",
      "required": 1,
      "objective": "Giữ một trận đấu ổn định, buộc đôi bên nghe hết lời nhau — Thắng một trận kéo dài ít nhất 8 giây khi đồng hành còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Sáu chén hòa giải",
      "context": "Sau biến cố «Sáu chén hòa giải», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_35_mercy",
          "label": "Mời đôi bên cùng uống",
          "statChanges": {
            "magicalDef": 0.125,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_35_truth",
          "label": "Để người mắc nợ nói trước",
          "statChanges": {
            "magicalAtk": 0.09,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_35",
      "frame": "Sáu chén rượu được xếp thành vòng tròn, không ai cầm chén đầu",
      "confession": "Ta cười để che cuộc cãi vã, ai ngờ càng làm người ta tức",
      "climax": "Sáu Chén rót nước thay rượu, hai người đối diện cùng bật cười",
      "chapter": 15
    }
  },
  "companion_36": {
    "id": "companion_36",
    "quest": {
      "id": "bond_companion_36_50",
      "title": "Ghế đá vẫn có chỗ",
      "context": "Đứng vững qua một trận để giữ chỗ cho người chưa về",
      "metric": "survive",
      "required": 1,
      "objective": "Đứng vững qua một trận để giữ chỗ cho người chưa về — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Ghế đá vẫn có chỗ",
      "context": "Sau biến cố «Ghế đá vẫn có chỗ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_36_mercy",
          "label": "Giữ ghế chờ bạn",
          "statChanges": {
            "dodgeRate": 0.035,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_36_truth",
          "label": "Đặt tên người trên ghế",
          "statChanges": {
            "physicalDef": 0.115,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_36",
      "frame": "Ghế đá trống dưới cây hạc, rêu phủ nửa mặt",
      "confession": "Ta sợ dọn chỗ ấy đi thì ký ức cũng bị mang theo",
      "climax": "Hạc Nâu lau nửa ghế, đặt lên đó một bông hoa cũ",
      "chapter": 16
    }
  },
  "companion_37": {
    "id": "companion_37",
    "quest": {
      "id": "bond_companion_37_50",
      "title": "Kim châm không báo thù",
      "context": "Cứu và hỗ trợ đồng đội dù trước mắt là người từng hại mình",
      "metric": "aid",
      "required": 1,
      "objective": "Cứu và hỗ trợ đồng đội dù trước mắt là người từng hại mình — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Kim châm không báo thù",
      "context": "Sau biến cố «Kim châm không báo thù», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_37_mercy",
          "label": "Chữa cho kẻ vu oan",
          "statChanges": {
            "preparedDamage": 0.08,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_37_truth",
          "label": "Yêu cầu người ấy thú nhận",
          "statChanges": {
            "maxHp": 0.105,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_37",
      "frame": "Bộ kim châm mở cạnh đôi bàn tay đã từng chỉ trỏ mình",
      "confession": "Ta ghét bàn tay ấy; giờ nó đang nắm lấy tay ta vì đau",
      "climax": "Bạch Liên đặt mũi châm xuống, nhìn thẳng người vừa được cứu",
      "chapter": 17
    }
  },
  "companion_38": {
    "id": "companion_38",
    "quest": {
      "id": "bond_companion_38_50",
      "title": "Thư vượt biển muộn",
      "context": "Giao thư dù phải đổi tuyến, giữ toàn đội có thể trở về",
      "metric": "swift",
      "required": 1,
      "objective": "Giao thư dù phải đổi tuyến, giữ toàn đội có thể trở về — Thắng một trận dưới 100 giây khi đồng hành còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Thư vượt biển muộn",
      "context": "Sau biến cố «Thư vượt biển muộn», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_38_mercy",
          "label": "Cứu người trước giao thư",
          "statChanges": {
            "physicalAtk": 0.095,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_38_truth",
          "label": "Gửi thư nhờ thuyền khác",
          "statChanges": {
            "magicalAtk": 0.105,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_38",
      "frame": "Cánh hải âu đập vào cột buồm, thư ướt nằm trong tay",
      "confession": "Ta từng nghĩ chậm là thất bại; hôm nay biết có thứ không được bỏ lại",
      "climax": "Hải Âu thả chim, đưa lá thư khô tới người đợi",
      "chapter": 18
    }
  },
  "companion_39": {
    "id": "companion_39",
    "quest": {
      "id": "bond_companion_39_50",
      "title": "Dấu mực sau ngày giỗ",
      "context": "Đưa trang ghi chép bị sửa đến nơi kiểm chứng bằng một trận thắng",
      "metric": "impact",
      "required": 1,
      "objective": "Đưa trang ghi chép bị sửa đến nơi kiểm chứng bằng một trận thắng — Thắng một trận có đóng góp sát thương đáng kể của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Dấu mực sau ngày giỗ",
      "context": "Sau biến cố «Dấu mực sau ngày giỗ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_39_mercy",
          "label": "Công bố trang giả",
          "statChanges": {
            "maxHp": 0.13,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_39_truth",
          "label": "Tìm người viết trang thật",
          "statChanges": {
            "magicalDef": 0.14,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_39",
      "frame": "Bình mực cạn trên bàn của người đã khuất, trang giấy còn mùi ẩm",
      "confession": "Người chết không tự sửa chữ của mình, chỉ người sống mới làm thế",
      "climax": "Minh Khuê so hai nét bút trước mặt thân quyến",
      "chapter": 19
    }
  },
  "companion_40": {
    "id": "companion_40",
    "quest": {
      "id": "bond_companion_40_50",
      "title": "Lửa rừng còn một người",
      "context": "Chống chịu để quay lại cứu người bị bỏ sau cuộc tháo chạy",
      "metric": "defend",
      "required": 1,
      "objective": "Chống chịu để quay lại cứu người bị bỏ sau cuộc tháo chạy — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Lửa rừng còn một người",
      "context": "Sau biến cố «Lửa rừng còn một người», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_40_mercy",
          "label": "Trở lại giữa lửa",
          "statChanges": {
            "critRate": 0.025,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_40_truth",
          "label": "Gọi đội khác làm tuyến sau",
          "statChanges": {
            "maxHp": 0.105,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_40",
      "frame": "Bóng người lạc dưới cây rừng, ánh lửa dội vào áo giáp",
      "confession": "Ta đã đếm số người còn chạy, không đếm người chưa trở về",
      "climax": "Sơn Lâm kéo một người khỏi bụi khói và tự mình đi cuối",
      "chapter": 20
    }
  },
  "companion_41": {
    "id": "companion_41",
    "quest": {
      "id": "bond_companion_41_50",
      "title": "Chén mừng người còn sống",
      "context": "Sống sót qua trận và trở về nâng chén vì người được cứu",
      "metric": "poise",
      "required": 1,
      "objective": "Sống sót qua trận và trở về nâng chén vì người được cứu — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Chén mừng người còn sống",
      "context": "Sau biến cố «Chén mừng người còn sống», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_41_mercy",
          "label": "Mừng người thoát nạn",
          "statChanges": {
            "maxHp": 0.105,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_41_truth",
          "label": "Giữ chén chờ đủ bạn",
          "statChanges": {
            "physicalAtk": 0.08,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_41",
      "frame": "Bình rượu nằm ngửa dưới mưa, chén đựng toàn nước",
      "confession": "Ta từng uống để quên người chết; nay muốn nhớ người còn thở",
      "climax": "Đào Hồng nâng chén nước mưa, cười khi người bạn mở mắt",
      "chapter": 1
    }
  },
  "companion_42": {
    "id": "companion_42",
    "quest": {
      "id": "bond_companion_42_50",
      "title": "Lời hứa không quá lời",
      "context": "Hỗ trợ chữa trị và giữ lời hứa trong khả năng của mình",
      "metric": "aid",
      "required": 1,
      "objective": "Hỗ trợ chữa trị và giữ lời hứa trong khả năng của mình — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Lời hứa không quá lời",
      "context": "Sau biến cố «Lời hứa không quá lời», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_42_mercy",
          "label": "Nói đúng khả năng cứu chữa",
          "statChanges": {
            "magicalAtk": 0.1,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_42_truth",
          "label": "Ở lại cùng bệnh nhân tới sáng",
          "statChanges": {
            "physicalDef": 0.13,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_42",
      "frame": "Đóa quyên còn nụ treo bên cửa sổ lều thuốc",
      "confession": "Ta nói sẽ cứu được tất cả vì không chịu nổi ánh mắt họ",
      "climax": "Đỗ Quyên ngồi bên giường, lần đầu chỉ hứa điều mình làm được",
      "chapter": 2
    }
  },
  "companion_43": {
    "id": "companion_43",
    "quest": {
      "id": "bond_companion_43_50",
      "title": "Dây đàn trên nền gạch",
      "context": "Giữ nhịp một trận chiến rồi chơi nốt nhạc chưa trọn",
      "metric": "duration",
      "required": 1,
      "objective": "Giữ nhịp một trận chiến rồi chơi nốt nhạc chưa trọn — Thắng một trận kéo dài ít nhất 8 giây khi đồng hành còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Dây đàn trên nền gạch",
      "context": "Sau biến cố «Dây đàn trên nền gạch», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_43_mercy",
          "label": "Chơi nốt nhạc từ biệt",
          "statChanges": {
            "physicalDef": 0.12,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_43_truth",
          "label": "Đưa đàn cho người phản bội",
          "statChanges": {
            "physicalAtk": 0.085,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_43",
      "frame": "Dây đàn đứt đặt cạnh mái ngói ướt sau một cuộc hẹn",
      "confession": "Ta không tha thứ vì một lời xin lỗi, nhưng không để bản nhạc dở",
      "climax": "Nguyệt Cầm thay dây, gảy nốt cuối rồi khép nắp đàn",
      "chapter": 3
    }
  },
  "companion_44": {
    "id": "companion_44",
    "quest": {
      "id": "bond_companion_44_50",
      "title": "Tiếng chuông của lời nhận lỗi",
      "context": "Giữ tuyến trước để người sai được tự nhận trách nhiệm",
      "metric": "defend",
      "required": 1,
      "objective": "Giữ tuyến trước để người sai được tự nhận trách nhiệm — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Tiếng chuông của lời nhận lỗi",
      "context": "Sau biến cố «Tiếng chuông của lời nhận lỗi», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_44_mercy",
          "label": "Nhận lỗi trước môn đồ",
          "statChanges": {
            "preparedEnergy": 0.125,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_44_truth",
          "label": "Đích thân gõ chuông báo",
          "statChanges": {
            "maxHp": 0.1,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_44",
      "frame": "Chuông lớn im giữa sân chùa đông người",
      "confession": "Ta tưởng im lặng là công bằng, hóa ra im lặng cũng là lựa chọn",
      "climax": "Lôi Chấn tự gõ chuông, tiếng vang rót xuống sân vắng",
      "chapter": 4
    }
  },
  "companion_45": {
    "id": "companion_45",
    "quest": {
      "id": "bond_companion_45_50",
      "title": "Bản đồ mưa chưa khô",
      "context": "Dùng tuyệt kỹ mở đường qua bản đồ bị thấm nước",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng tuyệt kỹ mở đường qua bản đồ bị thấm nước — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Bản đồ mưa chưa khô",
      "context": "Sau biến cố «Bản đồ mưa chưa khô», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_45_mercy",
          "label": "Phơi bản đồ cho mọi người",
          "statChanges": {
            "magicalDef": 0.13,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_45_truth",
          "label": "Giữ tuyến bí mật để cứu người",
          "statChanges": {
            "magicalAtk": 0.095,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_45",
      "frame": "Tấm bản đồ loang màu dưới trận mưa đêm, đường mực biến mất",
      "confession": "Ta học cách đọc điều người khác cố xóa bằng nước",
      "climax": "Yên Vũ dùng than vẽ lại con đường bị che ngay dưới mái cũ",
      "chapter": 5
    }
  },
  "companion_46": {
    "id": "companion_46",
    "quest": {
      "id": "bond_companion_46_50",
      "title": "Con đường xin lỗi",
      "context": "Trở về sau trận đủ sức đối mặt người bạn bị bỏ lại",
      "metric": "survive",
      "required": 1,
      "objective": "Trở về sau trận đủ sức đối mặt người bạn bị bỏ lại — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Con đường xin lỗi",
      "context": "Sau biến cố «Con đường xin lỗi», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_46_mercy",
          "label": "Nói lời xin lỗi trực tiếp",
          "statChanges": {
            "dodgeRate": 0.025,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_46_truth",
          "label": "Trả món đồ từng lấy đi",
          "statChanges": {
            "physicalDef": 0.105,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_46",
      "frame": "Cột mốc cũ còn khắc tên hai người đi đường năm ấy",
      "confession": "Ta đã chạy xa đến mức quên rằng một lời xin lỗi không có chân",
      "climax": "Phong Trần quay lại cột mốc, người bạn chờ sẵn bên đường",
      "chapter": 6
    }
  },
  "companion_47": {
    "id": "companion_47",
    "quest": {
      "id": "bond_companion_47_50",
      "title": "Hạt sen trao tay",
      "context": "Bảo vệ người chữa bệnh mới để bí quyết có người kế tục",
      "metric": "aid",
      "required": 1,
      "objective": "Bảo vệ người chữa bệnh mới để bí quyết có người kế tục — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Hạt sen trao tay",
      "context": "Sau biến cố «Hạt sen trao tay», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_47_mercy",
          "label": "Dạy công thức cho học trò",
          "statChanges": {
            "preparedDamage": 0.085,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_47_truth",
          "label": "Trao sách cho y quán chung",
          "statChanges": {
            "maxHp": 0.11,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_47",
      "frame": "Hạt sen khô đặt trên cuốn sách thuốc đã sờn",
      "confession": "Ta sợ người sau làm sai, rồi nhận ra sợ hơn là không ai được học",
      "climax": "Tố Tâm trao cuốn sách, tự tay hướng dẫn mũi châm đầu",
      "chapter": 7
    }
  },
  "companion_48": {
    "id": "companion_48",
    "quest": {
      "id": "bond_companion_48_50",
      "title": "Dấu chân bùn đỏ",
      "context": "Đứng chắn mũi đánh để hiểu người bị truy đuổi cứu ai",
      "metric": "defend",
      "required": 1,
      "objective": "Đứng chắn mũi đánh để hiểu người bị truy đuổi cứu ai — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Dấu chân bùn đỏ",
      "context": "Sau biến cố «Dấu chân bùn đỏ», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_48_mercy",
          "label": "Thả người từng bị truy đuổi",
          "statChanges": {
            "physicalAtk": 0.1,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_48_truth",
          "label": "Đưa người ấy ra làm chứng",
          "statChanges": {
            "magicalAtk": 0.11,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_48",
      "frame": "Dấu chân bùn đỏ ngoặt lại về làng trong khói",
      "confession": "Ta đi theo dấu ấy để bắt, không biết họ đang đi ngược lửa để cứu người",
      "climax": "Lạc Hồng quỳ xuống chỗ dấu chân, ngẩng lên thấy đứa trẻ bình an",
      "chapter": 8
    }
  },
  "companion_49": {
    "id": "companion_49",
    "quest": {
      "id": "bond_companion_49_50",
      "title": "Điệu múa qua vòng vây",
      "context": "Dùng tuyệt kỹ dẫn lối giữ đoàn người ra khỏi vòng vây",
      "metric": "ultimate",
      "required": 1,
      "objective": "Dùng tuyệt kỹ dẫn lối giữ đoàn người ra khỏi vòng vây — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Điệu múa qua vòng vây",
      "context": "Sau biến cố «Điệu múa qua vòng vây», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_49_mercy",
          "label": "Dùng điệu múa đánh lạc",
          "statChanges": {
            "maxHp": 0.12,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_49_truth",
          "label": "Dạy tín hiệu múa cho dân",
          "statChanges": {
            "magicalDef": 0.13,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_49",
      "frame": "Vạt áo múa quét qua ánh đuốc, một hàng người lặng lẽ bước theo",
      "confession": "Ta học điệu múa cho hội xuân, không ngờ nó cứu người đêm nay",
      "climax": "Thiên Hương xoay người lần cuối, lối thoát mở sau lưng",
      "chapter": 9
    }
  },
  "companion_50": {
    "id": "companion_50",
    "quest": {
      "id": "bond_companion_50_50",
      "title": "Đường núi có bạn",
      "context": "Phối hợp đội hình vượt dốc thay vì một mình gánh hết trận",
      "metric": "protect",
      "required": 1,
      "objective": "Phối hợp đội hình vượt dốc thay vì một mình gánh hết trận — Thắng một trận khi nhân vật chính và đồng hành đều sống sót."
    },
    "branch": {
      "title": "Ngã rẽ · Đường núi có bạn",
      "context": "Sau biến cố «Đường núi có bạn», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_50_mercy",
          "label": "Nhờ người dẫn đường",
          "statChanges": {
            "critRate": 0.03,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_50_truth",
          "label": "Tự học đường rồi đưa lại bản đồ",
          "statChanges": {
            "maxHp": 0.11,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_50",
      "frame": "Đỉnh núi chìm trong mây, một sợi dây dài nối sáu bàn tay",
      "confession": "Ta từng nghĩ nhờ giúp là yếu; hóa ra chỉ đường không phải tranh công",
      "climax": "Trường Sơn buộc dây vào tảng đá, cả đội cùng qua vực",
      "chapter": 10
    }
  },
  "companion_51": {
    "id": "companion_51",
    "quest": {
      "id": "bond_companion_51_50",
      "title": "Lá thư phải có người nhận",
      "context": "Mang thư đến tay đúng người thay vì bỏ ở trạm giao tin",
      "metric": "swift",
      "required": 1,
      "objective": "Mang thư đến tay đúng người thay vì bỏ ở trạm giao tin — Thắng một trận dưới 100 giây khi đồng hành còn sống."
    },
    "branch": {
      "title": "Ngã rẽ · Lá thư phải có người nhận",
      "context": "Sau biến cố «Lá thư phải có người nhận», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_51_mercy",
          "label": "Gặp người đọc thư",
          "statChanges": {
            "maxHp": 0.11,
            "physicalAtk": -0.04
          }
        },
        {
          "id": "bond_companion_51_truth",
          "label": "Giữ thư đến khi an toàn",
          "statChanges": {
            "physicalAtk": 0.085,
            "maxHp": -0.045
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_51",
      "frame": "Ống thư khắc tên người nhận đứng cạnh bàn trạm vắng",
      "confession": "Ta từng chỉ đếm quãng đường, không hỏi ai đang chờ tin",
      "climax": "Tiểu Sáo trao thư qua ngưỡng cửa, lần đầu chờ người đọc xong",
      "chapter": 11
    }
  },
  "companion_52": {
    "id": "companion_52",
    "quest": {
      "id": "bond_companion_52_50",
      "title": "Dây neo cứu thuyền",
      "context": "Đứng vững khi phải bỏ hàng để giữ người trên chiếc thuyền quá tải",
      "metric": "defend",
      "required": 1,
      "objective": "Đứng vững khi phải bỏ hàng để giữ người trên chiếc thuyền quá tải — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Dây neo cứu thuyền",
      "context": "Sau biến cố «Dây neo cứu thuyền», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_52_mercy",
          "label": "Cắt dây thả hàng",
          "statChanges": {
            "magicalAtk": 0.09,
            "physicalDef": -0.06
          }
        },
        {
          "id": "bond_companion_52_truth",
          "label": "Nhờ hai bờ kéo thuyền",
          "statChanges": {
            "physicalDef": 0.12,
            "magicalAtk": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_52",
      "frame": "Dây neo căng hết cỡ, chiếc thuyền chao trong sóng",
      "confession": "Ta chỉ tiếc hàng hóa cho đến khi nghe trẻ khóc phía mũi",
      "climax": "A Lụa cắt nút dây, thuyền dần thẳng lại giữa dòng",
      "chapter": 12
    }
  },
  "companion_53": {
    "id": "companion_53",
    "quest": {
      "id": "bond_companion_53_50",
      "title": "Trục xe ngừng đúng lúc",
      "context": "Ngăn trận đánh kéo dài để chuyến xe được sửa kịp",
      "metric": "poise",
      "required": 1,
      "objective": "Ngăn trận đánh kéo dài để chuyến xe được sửa kịp — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Trục xe ngừng đúng lúc",
      "context": "Sau biến cố «Trục xe ngừng đúng lúc», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_53_mercy",
          "label": "Dừng xe kiểm trục",
          "statChanges": {
            "physicalDef": 0.125,
            "physicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_53_truth",
          "label": "Chia hàng sang xe khác",
          "statChanges": {
            "physicalAtk": 0.09,
            "physicalDef": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_53",
      "frame": "Vết nứt mảnh chạy dọc trục bánh xe trước dốc",
      "confession": "Ta nghe tiếng gỗ kêu mà giả vờ không nghe vì sợ chậm",
      "climax": "Thiết Yến chống bánh, cả đoàn quay lại giúp sửa trục",
      "chapter": 13
    }
  },
  "companion_54": {
    "id": "companion_54",
    "quest": {
      "id": "bond_companion_54_50",
      "title": "Mũi giáo che nhân chứng",
      "context": "Gánh đòn để người làm chứng nói ra sự thật trước kẻ ra lệnh",
      "metric": "defend",
      "required": 1,
      "objective": "Gánh đòn để người làm chứng nói ra sự thật trước kẻ ra lệnh — Thắng một trận đồng hành từng gánh sát thương hoặc hấp thụ khiên."
    },
    "branch": {
      "title": "Ngã rẽ · Mũi giáo che nhân chứng",
      "context": "Sau biến cố «Mũi giáo che nhân chứng», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_54_mercy",
          "label": "Đứng chắn trước nhân chứng",
          "statChanges": {
            "preparedEnergy": 0.13,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_54_truth",
          "label": "Đưa nhân chứng thoát kín",
          "statChanges": {
            "maxHp": 0.105,
            "preparedEnergy": -0.07
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_54",
      "frame": "Mũi giáo chĩa về phía người cầm lệnh, không còn chĩa vào dân",
      "confession": "Ta từng xem mệnh lệnh là đường thẳng, nay thấy người đứng giữa",
      "climax": "Vệ Thanh đặt cán giáo xuống, che cho nhân chứng bước qua",
      "chapter": 14
    }
  },
  "companion_55": {
    "id": "companion_55",
    "quest": {
      "id": "bond_companion_55_50",
      "title": "Mạch đập không biết nói dối",
      "context": "Hỗ trợ hồi phục và giữ kết quả khám bệnh không bị sửa",
      "metric": "aid",
      "required": 1,
      "objective": "Hỗ trợ hồi phục và giữ kết quả khám bệnh không bị sửa — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Mạch đập không biết nói dối",
      "context": "Sau biến cố «Mạch đập không biết nói dối», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_55_mercy",
          "label": "Ghi đúng mạch đập",
          "statChanges": {
            "magicalDef": 0.12,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_55_truth",
          "label": "Giữ bản sao khỏi bị tịch thu",
          "statChanges": {
            "magicalAtk": 0.085,
            "magicalDef": -0.06
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_55",
      "frame": "Tấm phiếu khám có dấu đỏ chặn ngang dòng ghi nhịp mạch",
      "confession": "Ta có thể bịt miệng mình, nhưng không bắt mạch người khác nói dối",
      "climax": "Thanh Tâm viết lại con số, đưa bút cho chính người bệnh xem",
      "chapter": 15
    }
  },
  "companion_56": {
    "id": "companion_56",
    "quest": {
      "id": "bond_companion_56_50",
      "title": "Ngôi làng trên khoảng trắng",
      "context": "Mở tuyến đường cứu ngôi làng bị xóa trên bản đồ",
      "metric": "ultimate",
      "required": 1,
      "objective": "Mở tuyến đường cứu ngôi làng bị xóa trên bản đồ — Thắng một trận có ít nhất một lần tung tuyệt kỹ của đồng hành."
    },
    "branch": {
      "title": "Ngã rẽ · Ngôi làng trên khoảng trắng",
      "context": "Sau biến cố «Ngôi làng trên khoảng trắng», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_56_mercy",
          "label": "Vẽ lại làng cho dân",
          "statChanges": {
            "dodgeRate": 0.03,
            "physicalDef": -0.05
          }
        },
        {
          "id": "bond_companion_56_truth",
          "label": "Giữ đường bí mật để đưa lương",
          "statChanges": {
            "physicalDef": 0.11,
            "dodgeRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_56",
      "frame": "Bản đồ trải ra có một khoảng trắng giữa hai con sông",
      "confession": "Người ta xóa làng khỏi giấy, tưởng cũng xóa được người sống",
      "climax": "Truy Phong kẻ lại đường đỏ, chiếc thuyền nhỏ đi vào khoảng trắng",
      "chapter": 16
    }
  },
  "companion_57": {
    "id": "companion_57",
    "quest": {
      "id": "bond_companion_57_50",
      "title": "Bức thư không dùng trả thù",
      "context": "Trở về sau trận và giữ lá thư làm bằng chứng thay vì lưỡi kiếm",
      "metric": "survive",
      "required": 1,
      "objective": "Trở về sau trận và giữ lá thư làm bằng chứng thay vì lưỡi kiếm — Thắng một trận khi đồng hành còn sống và còn ít nhất 20% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Bức thư không dùng trả thù",
      "context": "Sau biến cố «Bức thư không dùng trả thù», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_57_mercy",
          "label": "Đưa thư ra xét chứng",
          "statChanges": {
            "preparedDamage": 0.09,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_57_truth",
          "label": "Gặp người bị nghi oan trước",
          "statChanges": {
            "maxHp": 0.115,
            "preparedDamage": -0.04
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_57",
      "frame": "Phong thư mỏng rơi trên bậc thềm nhà bị niêm phong",
      "confession": "Ta từng chỉ muốn kiếm tìm một kẻ để chém, thư lại chỉ về người vô tội",
      "climax": "Nguyệt Ảnh tra kiếm vào vỏ, cầm thư bước vào cửa",
      "chapter": 17
    }
  },
  "companion_58": {
    "id": "companion_58",
    "quest": {
      "id": "bond_companion_58_50",
      "title": "Chuyến xe cuối quay đầu",
      "context": "Bảo vệ đồng đội để đưa đoàn phu bị bỏ lại theo cùng",
      "metric": "protect",
      "required": 1,
      "objective": "Bảo vệ đồng đội để đưa đoàn phu bị bỏ lại theo cùng — Thắng một trận khi nhân vật chính và đồng hành đều sống sót."
    },
    "branch": {
      "title": "Ngã rẽ · Chuyến xe cuối quay đầu",
      "context": "Sau biến cố «Chuyến xe cuối quay đầu», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_58_mercy",
          "label": "Quay xe đón người",
          "statChanges": {
            "physicalAtk": 0.09,
            "magicalAtk": -0.05
          }
        },
        {
          "id": "bond_companion_58_truth",
          "label": "Lập trạm đợi an toàn",
          "statChanges": {
            "magicalAtk": 0.1,
            "physicalAtk": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_58",
      "frame": "Dấu bánh xe cuối cùng dừng ngang bến, phía sau còn tiếng gọi",
      "confession": "Ta đã đếm xe rời đi, mà quên đếm bàn tay bám đuôi",
      "climax": "Hùng Côn quay xe giữa đường, kéo người phu cuối lên thùng",
      "chapter": 18
    }
  },
  "companion_59": {
    "id": "companion_59",
    "quest": {
      "id": "bond_companion_59_50",
      "title": "Kiếm dừng một tấc",
      "context": "Khống chế trận mà vẫn để đối thủ có lối thoát sau thất bại",
      "metric": "poise",
      "required": 1,
      "objective": "Khống chế trận mà vẫn để đối thủ có lối thoát sau thất bại — Thắng một trận với đồng hành còn ít nhất 40% HP."
    },
    "branch": {
      "title": "Ngã rẽ · Kiếm dừng một tấc",
      "context": "Sau biến cố «Kiếm dừng một tấc», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_59_mercy",
          "label": "Dạy thắng mà không giết",
          "statChanges": {
            "maxHp": 0.125,
            "magicalDef": -0.08
          }
        },
        {
          "id": "bond_companion_59_truth",
          "label": "Luyện kỷ luật trước khi ra tay",
          "statChanges": {
            "magicalDef": 0.135,
            "maxHp": -0.055
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_59",
      "frame": "Lưỡi kiếm dừng cách cổ áo học trò đúng một tấc",
      "confession": "Ta từng dạy phải chém đến cùng, đến lúc thấy học trò run",
      "climax": "Kim Cang Thánh Mẫu hạ kiếm, chỉ đường để học trò tự đứng dậy",
      "chapter": 19
    }
  },
  "companion_60": {
    "id": "companion_60",
    "quest": {
      "id": "bond_companion_60_50",
      "title": "Đèn biển chọn con nước",
      "context": "Giữ đồng đội sống khi trao quyền lái thuyền cho người hiểu nước",
      "metric": "aid",
      "required": 1,
      "objective": "Giữ đồng đội sống khi trao quyền lái thuyền cho người hiểu nước — Thắng một trận mà đồng hành đóng góp hồi máu, chống chịu, thi triển tuyệt kỹ hoặc gây sát thương."
    },
    "branch": {
      "title": "Ngã rẽ · Đèn biển chọn con nước",
      "context": "Sau biến cố «Đèn biển chọn con nước», hai con đường đều mang theo điều phải từ bỏ.",
      "choices": [
        {
          "id": "bond_companion_60_mercy",
          "label": "Tin người lái đò",
          "statChanges": {
            "critRate": 0.035,
            "maxHp": -0.05
          }
        },
        {
          "id": "bond_companion_60_truth",
          "label": "Chia mạng tin cho nhiều bến",
          "statChanges": {
            "maxHp": 0.115,
            "critRate": -0.02
          }
        }
      ]
    },
    "scene": {
      "id": "bond_cutscene_companion_60",
      "frame": "Đèn biển xoay trong bão, bóng người lái đò đứng giữa vòng nước",
      "confession": "Ta biết tin khắp sông, nhưng không biết từng con sóng trước mũi",
      "climax": "Thiên Âm đưa đèn chỉ đường cho người lái, cả thuyền vượt qua giông",
      "chapter": 20
    }
  }
});

const LABELS = Object.freeze({maxHp:'HP tối đa',physicalAtk:'ngoại công',magicalAtk:'nội công',physicalDef:'ngoại phòng',magicalDef:'nội phòng',preparedEnergy:'nhận nộ',preparedDamage:'sát thương',critRate:'tỷ lệ chí mạng',dodgeRate:'né tránh'});
export function branchTradeoffText(changes) {
 return Object.entries(changes).map(([stat,value])=>(value>0?'+':'')+(Math.round(value*1000)/10)+'% '+LABELS[stat]).join(' · ');
}
export function companionQuestQualifies(quest, record, combat) {
 if(!quest||!record||!combat||combat.winner!=='home')return false;
 const hp=record.maxHp>0?record.finalHp/record.maxHp:0;
 switch(quest.metric){
  case 'survive':return record.alive&&hp>=.2;
  case 'poise':return record.alive&&hp>=.4;
  case 'aid':return (record.damage+record.healing+record.absorbed)>0||record.ultimates>0;
  case 'ultimate':return record.ultimates>=1;
  case 'defend':return record.damageTaken+record.absorbed>0;
  case 'protect':return record.alive&&combat.statistics.some(x=>x.id==='hero'&&x.alive);
  case 'guard':return record.alive&&combat.statistics.filter(x=>x.team==='home'&&x.alive).length>=3;
  case 'impact':return record.damage>=Math.max(1,record.maxHp*.05);
  case 'swift':return record.alive&&combat.duration<=100;
  case 'duration':return record.alive&&combat.duration>=8;
  default:throw Error('Nhiệm vụ đồng hành không hợp lệ: '+quest.metric);
 }
}
