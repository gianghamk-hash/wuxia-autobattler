import c01 from './story/chapter01.js';
import c02 from './story/chapter02.js';
import c03 from './story/chapter03.js';
import c04 from './story/chapter04.js';
import c05 from './story/chapter05.js';
import c06 from './story/chapter06.js';
import c07 from './story/chapter07.js';
import c08 from './story/chapter08.js';
import c09 from './story/chapter09.js';
import c10 from './story/chapter10.js';
import c11 from './story/chapter11.js';
import c12 from './story/chapter12.js';
import { deepFreeze } from './DataUtils.js';
import { rewriteChapter } from './StoryRewriteData.js';
import { daiVietLines } from './DaiVietStoryData.js';
export const STORY_REVISION = 3;
export const CHAPTERS = deepFreeze(
  [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12].map((c, i) => ({
    ...rewriteChapter(c, i + 1),
    number: i + 1
  }))
);
export const LEGACY_IDS = [
  'Q101',
  'Q102',
  'Q103',
  'Q104',
  'Q201',
  'Q202',
  'Q203',
  'Q204',
  'Q301',
  'Q302',
  'Q303',
  'Q304'
];
export const CHAPTER_XP = [
  260, 360, 500, 650, 850, 1050, 1250, 1450, 1650, 1850, 2100, 2000
];
export const CHAPTER_SILVER = [
  70, 80, 100, 115, 125, 135, 150, 165, 180, 195, 220, 200
];
export const CHAPTER_LEVELS = [1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20];
export const COMPANION_STORY = [
  {
    chapter: 1,
    episode: 11,
    id: 'companion_01',
    line: 'Ta đã đi những đường xe ấy. Lần này muốn nhớ ai ngồi sau xe, không chỉ ai trả công.'
  },
  {
    chapter: 2,
    episode: 14,
    id: 'companion_03',
    line: 'Tên cha ta chỉ là một trong nhiều tên. Tìm được ông không thể là lý do ngừng tìm người khác.'
  },
  {
    chapter: 2,
    episode: 18,
    id: 'companion_02',
    line: 'Cờ giữ được đường lui mới đi xa. Giấy chứng cũng cần một lối trở về ngoài chiếc túi đang mang.'
  },
  {
    chapter: 3,
    episode: 14,
    id: 'companion_04',
    line: 'Khóa kho và khuôn dấu cùng có vết của người làm. Ta sẽ giúp giữ những vết ấy khỏi bị gọi là tình cờ.'
  },
  {
    chapter: 4,
    episode: 8,
    id: 'companion_06',
    line: 'Ta biết dùng độc nên càng muốn người ta được biết mình đã bị cho uống thứ gì.'
  },
  {
    chapter: 4,
    episode: 16,
    id: 'companion_07',
    line: 'Lãi trên giấy cứ nhân lên, tay người gánh thóc thì vẫn chỉ có hai. Cần hỏi ai đang hưởng phép tính ấy.'
  },
  {
    chapter: 5,
    episode: 8,
    id: 'companion_08',
    line: 'Rượu bị pha giả khiến người ta mất tin; giấy công bị pha giả khiến người ta mất cả nhà.'
  },
  {
    chapter: 5,
    episode: 15,
    id: 'companion_05',
    line: 'Thua một trận đúng luật còn đứng dậy được. Thắng bằng luật đổi giữa chừng thì cả sân khó đứng yên.'
  },
  {
    chapter: 5,
    episode: 19,
    id: 'companion_09',
    line: 'Đừng đem người bị thương ra làm cảnh cho lời kêu gọi. Chữa cho họ trước, rồi để họ tự nói.'
  },
  {
    chapter: 6,
    episode: 6,
    id: 'companion_10',
    line: 'Bắn đúng một điểm không đủ nếu nhìn nhầm bia. Hãy xác định ai ra lệnh trước khi chọn người để trách.'
  },
  {
    chapter: 6,
    episode: 18,
    id: 'companion_11',
    line: 'Người vào quán ta có thể gọi trà đắng. Không ai được gọi hộ rằng họ thích uống khi chưa hỏi.'
  },
  {
    chapter: 7,
    episode: 8,
    id: 'companion_12',
    line: 'Tên ta khó gọi không có nghĩa chữ ký ta nên được dùng ở chỗ ta chưa từng đọc.'
  },
  {
    chapter: 7,
    episode: 16,
    id: 'companion_13',
    line: 'Ngủ quên một ngày còn tỉnh được. Đừng để người khác ngủ qua cả việc mình đã ký nhận.'
  },
  {
    chapter: 8,
    episode: 6,
    id: 'companion_14',
    line: 'Có thứ độc không nằm trong chai. Nó nằm ở lời ai cũng biết sai nhưng cùng ngại nói.'
  },
  {
    chapter: 8,
    episode: 16,
    id: 'companion_15',
    line: 'Ta đi trên mái để nhìn đường, không phải để cho người dưới đất gánh thay chỗ ta đã bước sai.'
  },
  {
    chapter: 9,
    episode: 8,
    id: 'companion_16',
    line: 'Bài ca người ta buộc ta hát từng nghe rất đẹp. Xin để người chịu lời ca ấy được kể phần đời của họ.'
  },
  {
    chapter: 9,
    episode: 16,
    id: 'companion_17',
    line: 'Lò đan mất còn tìm lại được. Mạng người đã đem ra thử thì không nên gọi là một mẻ hỏng.'
  },
  {
    chapter: 10,
    episode: 6,
    id: 'companion_18',
    line: 'Đầu cứng không phải lý do cứ lao vào vật đang giữ người khác phía trên.'
  },
  {
    chapter: 10,
    episode: 17,
    id: 'companion_19',
    line: 'Ta từng tưởng giữ lời là im miệng. Có những lời phải nói mới giữ được người mình đã hứa bảo vệ.'
  },
  {
    chapter: 11,
    episode: 15,
    id: 'companion_20',
    line: 'Rượu khiến lời người ta dài thêm. Quyền lực khiến họ tưởng không còn cần nghe lời ai khác.'
  }
];
export function buildMainStory(legacy) {
  const chapters = [];
  for (const c of CHAPTERS) {
    if (c.scenes.length !== 20 || c.scenes.some((r) => r.length !== 4))
      throw Error(`Chương ${c.number} cần đúng 20 hồi hợp lệ.`);
    const anchor = legacy[c.number - 1],
      anchorAt = c.number === 1 ? 1 : 20;
    const weights = c.scenes.map((_, i) =>
      c.number === 12 && i === 19
        ? 0
        : c.battles.includes(i + 1)
          ? i === 19
            ? 3
            : 2
          : 1
    );
    let total = weights.reduce((a, b) => a + b, 0),
      budget = CHAPTER_XP[c.number - 1],
      silver = CHAPTER_SILVER[c.number - 1];
    const xp = weights.map((w) => Math.floor((budget * w) / total)),
      money = weights.map((w) => Math.floor((silver * w) / total));
    if (c.number === 1) {
      xp[0] = 120;
      const rest = weights.slice(1).reduce((a, b) => a + b, 0);
      for (let i = 1; i < 20; i++)
        xp[i] = Math.floor(((budget - 120) * weights[i]) / rest);
    }
    const remainderIndex = c.number === 12 ? 18 : 19;
    xp[remainderIndex] += budget - xp.reduce((a, b) => a + b, 0);
    money[remainderIndex] += silver - money.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 20; i++) {
      const [title, scene, speech, lead] = c.scenes[i],
        episode = i + 1,
        isAnchor = episode === anchorAt,
        battle = c.battles.includes(episode),
        colon = speech.indexOf(':'),
        speaker = speech.slice(0, colon),
        quote = speech.slice(colon + 1).trim();
      const quest = {
        id: isAnchor
          ? anchor.id
          : `C${String(c.number).padStart(2, '0')}H${String(episode).padStart(2, '0')}`,
        chapter: c.number,
        episode,
        chapterTitle: c.title,
        chapterGoal: c.goal,
        chapterSummary: c.summary,
        act: Math.ceil(c.number / 4),
        title,
        location: c.place,
        level: Math.min(
          20,
          CHAPTER_LEVELS[c.number - 1] + (episode >= 14 ? 1 : 0)
        ),
        xp: xp[i],
        silver: money[i],
        kind: battle
          ? 'battle'
          : episode === c.decision.at
            ? 'choice'
            : 'story',
        boss: battle && episode === 20,
        objectiveText: lead,
        previous:
          episode > 1
            ? c.scenes[i - 1][1]
            : c.number > 1
              ? CHAPTERS[c.number - 2].bridge
              : 'Bạn đang phụ bếp ở quán Rồng Lửa, chưa có danh tiếng hay thế lực.',
        lines: [
          ['Người kể', scene],
          [speaker, quote],
          ['Người kể', lead]
        ],
        choices: [
          {
            id: 'continue',
            text: battle
              ? 'Bảo vệ đường đi, vượt đội chặn.'
              : 'Tiếp tục hành trình.',
            karma: 0
          }
        ]
      };
      if (episode === 1) quest.lines.unshift(['Người kể', c.summary]);
      if (episode === c.decision.at)
        quest.choices = [
          { id: 'open', text: c.decision.a, karma: 1 },
          { id: 'control', text: c.decision.b, karma: -1 }
        ];
      if (battle)
        quest.encounter =
          isAnchor && anchor.id === 'Q101'
            ? 'inn_escape'
            : `story_${c.number}_${episode}`;
      if (isAnchor) {
        quest.choices = structuredClone(anchor.choices);
        for (const key of ['objective', 'flags', 'gearReward', 'ending'])
          if (anchor[key] !== undefined)
            quest[key] = structuredClone(anchor[key]);
        if (anchor.ending) {
          quest.kind = 'ending';
          delete quest.encounter;
          quest.boss = false;
        }
      }
      if (episode === 20) {
        quest.lines.push(['Người kể', c.bridge]);
        quest.flags = { ...quest.flags, [`STORY_CHAPTER_${c.number}`]: true };
      }
      quest.spotlights = COMPANION_STORY.filter(
        (s) => s.chapter === c.number && s.episode === episode
      );
      chapters.push(quest);
    }
  }
  return deepFreeze(chapters);
}
export function chapterDecisionId(number, quests) {
  const c = CHAPTERS[number - 1];
  return quests.find((q) => q.chapter === number && q.episode === c.decision.at)
    ?.id;
}
export function storyCallbacks(quest, quests) {
  const rules = [],
    c = CHAPTERS[quest.chapter - 1];
  if (quest.episode === 1 && quest.chapter > 1) {
    const prior = CHAPTERS[quest.chapter - 2];
    rules.push({
      questId: chapterDecisionId(prior.number, quests),
      choice: 'open',
      speaker: 'Người kể',
      yes: prior.decision.good,
      no: prior.decision.bad
    });
  }
  if (quest.episode === 19 && quest.chapter !== 12)
    rules.push({
      questId: chapterDecisionId(c.number, quests),
      choice: 'open',
      speaker: 'Người kể',
      yes: c.decision.good,
      no: c.decision.bad
    });
  if (quest.chapter === 11 && quest.episode === 4)
    rules.push({
      questId: 'Q104',
      choice: 'mercy',
      speaker: 'Lão Tam',
      yes: 'Ở U Minh, ta đã để Đốc Lệ sống để phải trả lời về lệnh đã nhận. Hôm nay hãy đặt giấy nhận lệnh ấy cạnh lời người phu.',
      no: 'Ta đã lấy tiền của toán truy bắt ở U Minh. Người phu vẫn giúp làm chứng, nhưng ta cũng phải giải thích cách đã xử lý người đầu hàng.'
    });
  if (quest.chapter === 8 && quest.episode === 11)
    rules.push({
      questId: 'Q103',
      choice: 'witness',
      speaker: 'Vũ Bình',
      yes: 'Ở bến Liễu, các cậu đã đưa tôi về làm chứng. Tới Hoa Lư rồi, tôi sẽ nói cả việc mình từng sửa sổ.',
      no: 'Ở bến, ta đã dùng danh nghĩa giả để qua trạm. Hôm nay tôi muốn đứng đây bằng tên thật và trả lời điều mình đã làm.'
    });
  if (quest.chapter === 12 && quest.episode === 8)
    rules.push({
      questId: 'Q303',
      choice: 'justice',
      speaker: 'Bạn',
      yes: 'Ta đã chọn đưa chứng cứ ra công khai. Danh sách trả thóc này cũng phải được giữ để dân tự kiểm.',
      no: 'Ta đã giữ quyền xét sau trận cuối. Nhưng kẻ khác không được đốt danh sách để lấy thóc của dân.'
    });
  return rules;
}
export function storyLines(quest, session, quests, companions) {
  if(quest.canon==='dai-viet')return daiVietLines(quest,session);
  const lines = quest.lines.map((line) => [...line]);
  for (const rule of storyCallbacks(quest, quests)) {
    const choice = session.storyProgress.decisions[rule.questId];
    if (choice)
      lines.splice(lines.length - 1, 0, [
        rule.speaker,
        choice === rule.choice ? rule.yes : rule.no
      ]);
  }
  for (const s of quest.spotlights ?? [])
    if (session.party.unlocked.includes(s.id))
      lines.splice(lines.length - 1, 0, [companions[s.id].name, s.line]);
  return lines;
}
