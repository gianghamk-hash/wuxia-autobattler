// Authored screenplay package 01: companions 01-10. Pure content, no gameplay mutation.
// No guessed image filenames: the presentation layer must use canonical portrait from CompanionMemories.
export const COMPANION_SCENES_CHAPTER_ONE = Object.freeze([
  {
    "id": "companion_01",
    "title": "Bữa cơm còn nóng",
    "place": "bến Chương Dương",
    "tone": "hài hước xen day dứt",
    "prop": "một nồi cơm còn phần dành cho người mất tích",
    "secret": "người giữ bến từng khóa cổng khi đoàn thuyền rút",
    "quest": "mở lại bến để đón người còn kẹt",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "bến Chương Dương",
            "action": "Khung cảnh bến Chương Dương; một nồi cơm còn phần dành cho người mất tích.",
            "dialogue": [
              {
                "speaker": "Lôi Nam",
                "text": "Ngươi thấy một nồi cơm còn phần dành cho người mất tích chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Lôi Nam",
                "text": "người giữ bến từng khóa cổng khi đoàn thuyền rút."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "bến Chương Dương",
            "action": "Cận cảnh một nồi cơm còn phần dành cho người mất tích; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Lôi Nam",
                "text": "Ta cần mở lại bến để đón người còn kẹt. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "mở lại bến để đón người còn kẹt",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "bến Chương Dương",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Lôi Nam",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_01_protect",
            "label": "Giữ cổng chờ thêm một chuyến",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_01_account",
            "label": "Rời bến đúng lệnh để cứu đoàn hiện tại",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "bến Chương Dương",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Lôi Nam",
                "text": "Ta cứ tưởng giữ lại một bát cơm thì người ấy sẽ tìm được đường về."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_02",
    "title": "Ván cờ chưa hết",
    "place": "am Trúc Lâm",
    "tone": "trầm tĩnh, tự trào",
    "prop": "quân cờ đen giấu dưới tay áo",
    "secret": "ông từng sửa lịch vận tải để che một nước tính sai",
    "quest": "công khai bản sao lịch gốc trước người đối chiếu",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "am Trúc Lâm",
            "action": "Khung cảnh am Trúc Lâm; quân cờ đen giấu dưới tay áo.",
            "dialogue": [
              {
                "speaker": "Huyền Đạo Trưởng",
                "text": "Ngươi thấy quân cờ đen giấu dưới tay áo chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Huyền Đạo Trưởng",
                "text": "ông từng sửa lịch vận tải để che một nước tính sai."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "am Trúc Lâm",
            "action": "Cận cảnh quân cờ đen giấu dưới tay áo; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Huyền Đạo Trưởng",
                "text": "Ta cần công khai bản sao lịch gốc trước người đối chiếu. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "công khai bản sao lịch gốc trước người đối chiếu",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "am Trúc Lâm",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Huyền Đạo Trưởng",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_02_protect",
            "label": "Thú nhận sai lầm trước hội",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_02_account",
            "label": "Gửi chứng cứ riêng cho người bị hại",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "am Trúc Lâm",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Huyền Đạo Trưởng",
                "text": "Một quân cờ không làm hỏng ván. Một lời dối mới làm thế."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_03",
    "title": "Con chuột trên mái",
    "place": "lều thuốc Thất Sơn",
    "tone": "vui nhộn, ấm áp",
    "prop": "con chuột làm đổ hộp kim châm",
    "secret": "nàng sợ chuột nhưng giấu vì sợ bệnh nhân mất tin tưởng",
    "quest": "chữa cho người bị thương trong khi học trò giúp đuổi chuột",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "lều thuốc Thất Sơn",
            "action": "Khung cảnh lều thuốc Thất Sơn; con chuột làm đổ hộp kim châm.",
            "dialogue": [
              {
                "speaker": "Thanh Lan",
                "text": "Ngươi thấy con chuột làm đổ hộp kim châm chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Thanh Lan",
                "text": "nàng sợ chuột nhưng giấu vì sợ bệnh nhân mất tin tưởng."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "lều thuốc Thất Sơn",
            "action": "Cận cảnh con chuột làm đổ hộp kim châm; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Thanh Lan",
                "text": "Ta cần chữa cho người bị thương trong khi học trò giúp đuổi chuột. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "chữa cho người bị thương trong khi học trò giúp đuổi chuột",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "lều thuốc Thất Sơn",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Thanh Lan",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_03_protect",
            "label": "Nhờ mọi người cùng giúp",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_03_account",
            "label": "Tự trấn tĩnh rồi tiếp tục cứu chữa",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "lều thuốc Thất Sơn",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Thanh Lan",
                "text": "Y thuật không đòi người chữa bệnh phải không biết sợ."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_04",
    "title": "Ba mũi kim lạc",
    "place": "xưởng Vân Đồn",
    "tone": "điều tra, hối lỗi",
    "prop": "ba chiếc đinh có vết khắc không khớp",
    "secret": "mẫu ám khí bị sao chép và dùng hại phu xe",
    "quest": "truy nguồn vật liệu thay vì bắt người mang kim",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "xưởng Vân Đồn",
            "action": "Khung cảnh xưởng Vân Đồn; ba chiếc đinh có vết khắc không khớp.",
            "dialogue": [
              {
                "speaker": "Người chế ám khí",
                "text": "Ngươi thấy ba chiếc đinh có vết khắc không khớp chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Người chế ám khí",
                "text": "mẫu ám khí bị sao chép và dùng hại phu xe."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "xưởng Vân Đồn",
            "action": "Cận cảnh ba chiếc đinh có vết khắc không khớp; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Người chế ám khí",
                "text": "Ta cần truy nguồn vật liệu thay vì bắt người mang kim. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "truy nguồn vật liệu thay vì bắt người mang kim",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "xưởng Vân Đồn",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Người chế ám khí",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_04_protect",
            "label": "Giao bản vẽ cho người đối chiếu",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_04_account",
            "label": "Tự tay thu hồi toàn bộ mẫu nguy hiểm",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "xưởng Vân Đồn",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Người chế ám khí",
                "text": "Đồ ta làm ra có thể rời tay ta, nhưng trách nhiệm thì không."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_05",
    "title": "Cánh cửa đủ rộng",
    "place": "cổng viện Hoa Lư",
    "tone": "hào hùng, nhân hậu",
    "prop": "cánh cổng chỉ mở được một nửa",
    "secret": "người từng chống đối viện nay đưa cáng thương đến",
    "quest": "giữ cửa mở trong lúc toán truy đuổi áp sát",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "cổng viện Hoa Lư",
            "action": "Khung cảnh cổng viện Hoa Lư; cánh cổng chỉ mở được một nửa.",
            "dialogue": [
              {
                "speaker": "Hộ viện Hoa Lư",
                "text": "Ngươi thấy cánh cổng chỉ mở được một nửa chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Hộ viện Hoa Lư",
                "text": "người từng chống đối viện nay đưa cáng thương đến."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "cổng viện Hoa Lư",
            "action": "Cận cảnh cánh cổng chỉ mở được một nửa; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Hộ viện Hoa Lư",
                "text": "Ta cần giữ cửa mở trong lúc toán truy đuổi áp sát. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "giữ cửa mở trong lúc toán truy đuổi áp sát",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "cổng viện Hoa Lư",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Hộ viện Hoa Lư",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_05_protect",
            "label": "Cho tất cả người bị thương vào",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_05_account",
            "label": "Giữ tuyến ngoài để người khác mở cổng",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "cổng viện Hoa Lư",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Hộ viện Hoa Lư",
                "text": "Nếu võ công chỉ giữ được danh dự mà không giữ nổi người, ta luyện để làm gì?"
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_06",
    "title": "Lọ thuốc không tên",
    "place": "kho Đông",
    "tone": "u tối, chuộc lỗi",
    "prop": "lọ thuốc mất nhãn cạnh sổ cấp phát",
    "secret": "một toa thuốc bị đánh tráo đã gây thương tích cho dân",
    "quest": "đối chiếu toa gốc với lời chứng người sống sót",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "kho Đông",
            "action": "Khung cảnh kho Đông; lọ thuốc mất nhãn cạnh sổ cấp phát.",
            "dialogue": [
              {
                "speaker": "Lý Độc Thủ",
                "text": "Ngươi thấy lọ thuốc mất nhãn cạnh sổ cấp phát chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Lý Độc Thủ",
                "text": "một toa thuốc bị đánh tráo đã gây thương tích cho dân."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "kho Đông",
            "action": "Cận cảnh lọ thuốc mất nhãn cạnh sổ cấp phát; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Lý Độc Thủ",
                "text": "Ta cần đối chiếu toa gốc với lời chứng người sống sót. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "đối chiếu toa gốc với lời chứng người sống sót",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "kho Đông",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Lý Độc Thủ",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_06_protect",
            "label": "Công bố toàn bộ sai sót",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_06_account",
            "label": "Ưu tiên cứu người trước rồi lập biên bản",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "kho Đông",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Lý Độc Thủ",
                "text": "Độc không nằm trong cây cỏ. Độc nằm ở kẻ biết mà vẫn im."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_07",
    "title": "Lịch trời đêm mưa",
    "place": "đèo Hải Vân",
    "tone": "bi tráng, suy tư",
    "prop": "bản lịch trời loang mực",
    "secret": "dự báo sai từng khiến đoàn thuyền mắc cạn",
    "quest": "tìm lại dấu mực và nhật ký người lái đò",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "đèo Hải Vân",
            "action": "Khung cảnh đèo Hải Vân; bản lịch trời loang mực.",
            "dialogue": [
              {
                "speaker": "Ngô Sách",
                "text": "Ngươi thấy bản lịch trời loang mực chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Ngô Sách",
                "text": "dự báo sai từng khiến đoàn thuyền mắc cạn."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "đèo Hải Vân",
            "action": "Cận cảnh bản lịch trời loang mực; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Ngô Sách",
                "text": "Ta cần tìm lại dấu mực và nhật ký người lái đò. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "tìm lại dấu mực và nhật ký người lái đò",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "đèo Hải Vân",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Ngô Sách",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_07_protect",
            "label": "Nhận sai trước gia đình nạn nhân",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_07_account",
            "label": "Trao quyền quyết định cho người hiểu con nước",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "đèo Hải Vân",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Ngô Sách",
                "text": "Ta đọc được mây, nhưng chưa từng đọc hết lòng biển."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_08",
    "title": "Khoản nợ của bến",
    "place": "bến Vân Đồn",
    "tone": "đau xót, trưởng thành",
    "prop": "phiếu công bị gạch tên",
    "secret": "tuyến nhà nàng đổi hướng khiến phu bến mất tiền công",
    "quest": "tìm người ký lệnh và trả công đúng người",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "bến Vân Đồn",
            "action": "Khung cảnh bến Vân Đồn; phiếu công bị gạch tên.",
            "dialogue": [
              {
                "speaker": "Mai Tước",
                "text": "Ngươi thấy phiếu công bị gạch tên chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Mai Tước",
                "text": "tuyến nhà nàng đổi hướng khiến phu bến mất tiền công."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "bến Vân Đồn",
            "action": "Cận cảnh phiếu công bị gạch tên; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Mai Tước",
                "text": "Ta cần tìm người ký lệnh và trả công đúng người. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "tìm người ký lệnh và trả công đúng người",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "bến Vân Đồn",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Mai Tước",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_08_protect",
            "label": "Trả công từ khoản riêng rồi điều tra",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_08_account",
            "label": "Công khai tuyến hàng và đòi hoàn trả tập thể",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "bến Vân Đồn",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Mai Tước",
                "text": "Ta không thể đổi quá khứ. Ta có thể thôi trốn khỏi nó."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_09",
    "title": "Tiếng mõ cuối ngày",
    "place": "y quán ven Thăng Long",
    "tone": "dịu dàng, cảm động",
    "prop": "cuốn sổ thuốc còn tên người đã khuất",
    "secret": "quan kho yêu cầu xóa tên bệnh nhân để sổ đẹp hơn",
    "quest": "giữ bản ghi trung thực và trao thuốc cho người thân",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "y quán ven Thăng Long",
            "action": "Khung cảnh y quán ven Thăng Long; cuốn sổ thuốc còn tên người đã khuất.",
            "dialogue": [
              {
                "speaker": "Sư thái y quán",
                "text": "Ngươi thấy cuốn sổ thuốc còn tên người đã khuất chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Sư thái y quán",
                "text": "quan kho yêu cầu xóa tên bệnh nhân để sổ đẹp hơn."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "y quán ven Thăng Long",
            "action": "Cận cảnh cuốn sổ thuốc còn tên người đã khuất; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Sư thái y quán",
                "text": "Ta cần giữ bản ghi trung thực và trao thuốc cho người thân. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "giữ bản ghi trung thực và trao thuốc cho người thân",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "y quán ven Thăng Long",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Sư thái y quán",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_09_protect",
            "label": "Giữ tên và kể lại câu chuyện",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_09_account",
            "label": "Lập quỹ thuốc mang tên người đã mất",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "y quán ven Thăng Long",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Sư thái y quán",
                "text": "Người đi rồi không cần ta thắng. Họ cần ta nhớ đúng."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  },
  {
    "id": "companion_10",
    "title": "Mũi tên hạ xuống",
    "place": "đường thư miền núi",
    "tone": "căng thẳng, nhân bản",
    "prop": "mũi tên đã lên dây",
    "secret": "người bị nghi là thám báo thực ra mang thư báo cứu trợ",
    "quest": "hạ cung và kiểm chứng tín hiệu trước khi truy đuổi",
    "scenes": [
      {
        "at": 25,
        "slug": "first-trust",
        "shots": [
          {
            "camera": "wide",
            "stage": "đường thư miền núi",
            "action": "Khung cảnh đường thư miền núi; mũi tên đã lên dây.",
            "dialogue": [
              {
                "speaker": "Bách Bộ",
                "text": "Ngươi thấy mũi tên đã lên dây chứ? Ta từng nghĩ chẳng ai để ý."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Nhân vật ngập ngừng rồi nhìn thẳng người chơi.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta thấy. Nhưng điều ấy có ý nghĩa gì với ngươi?"
              },
              {
                "speaker": "Bách Bộ",
                "text": "người bị nghi là thám báo thực ra mang thư báo cứu trợ."
              }
            ]
          }
        ]
      },
      {
        "at": 50,
        "slug": "personal-quest",
        "shots": [
          {
            "camera": "detail",
            "stage": "đường thư miền núi",
            "action": "Cận cảnh mũi tên đã lên dây; tiếng động xa báo hiệu có người đang đến.",
            "dialogue": [
              {
                "speaker": "Bách Bộ",
                "text": "Ta cần hạ cung và kiểm chứng tín hiệu trước khi truy đuổi. Không thể nhờ ai làm thay phần trách nhiệm của ta."
              }
            ]
          },
          {
            "camera": "wide",
            "action": "Đồng đội chia việc, bảo vệ người làm chứng và đường rút.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta giúp ngươi giữ người an toàn. Chứng cứ và quyết định vẫn thuộc về ngươi."
              }
            ]
          }
        ],
        "objective": "hạ cung và kiểm chứng tín hiệu trước khi truy đuổi",
        "failForward": "Nếu thua giao tranh, nhiệm vụ được thử lại; không xóa duyên phận hoặc khóa cốt truyện."
      },
      {
        "at": 75,
        "slug": "hard-choice",
        "shots": [
          {
            "camera": "two-shot",
            "stage": "đường thư miền núi",
            "action": "Nhân vật đối diện hệ quả từ lựa chọn cũ.",
            "dialogue": [
              {
                "speaker": "Bách Bộ",
                "text": "Lần này ta không muốn để người khác quyết định thay mình."
              }
            ]
          }
        ],
        "choices": [
          {
            "id": "companion_10_protect",
            "label": "Đặt vũ khí xuống để nghe",
            "consequence": "Được lòng tin từ người cần giúp, nhưng bỏ lỡ một phần vật tư."
          },
          {
            "id": "companion_10_account",
            "label": "Bảo vệ người đưa thư tới nơi",
            "consequence": "Giữ được chứng cứ hoặc tuyến an toàn, nhưng phải mất thời gian hòa giải."
          }
        ]
      },
      {
        "at": 100,
        "slug": "bond-finale",
        "shots": [
          {
            "camera": "wide",
            "stage": "đường thư miền núi",
            "action": "Ánh sáng chuyển từ lạnh sang ấm, máy quay chậm tiến gần nhân vật.",
            "dialogue": [
              {
                "speaker": "Bách Bộ",
                "text": "Một mũi tên buông ra không gọi về được. Một lần hạ cung thì có."
              }
            ]
          },
          {
            "camera": "portrait",
            "action": "Chân dung nhân vật hiện rõ; tuyệt kỹ được nhấn bằng hiệu ứng ánh sáng riêng theo kỹ năng hiện có.",
            "dialogue": [
              {
                "speaker": "Trần Phong",
                "text": "Ta sẽ nhớ lời này, và cùng ngươi đi tiếp."
              }
            ]
          }
        ],
        "ending": "Hồi kết mở: nhân vật tiếp tục có trách nhiệm với người và vùng đất của mình."
      }
    ]
  }
]);
export const COMPANION_SCENES_CHAPTER_ONE_BY_ID = Object.freeze(Object.fromEntries(COMPANION_SCENES_CHAPTER_ONE.map(a=>[a.id,a])));
