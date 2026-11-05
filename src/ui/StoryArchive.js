import { CHAPTERS, storyLines } from '../data/StoryChaptersData.js';
import { MAIN_QUESTS } from '../data/QuestsData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
const n = (tag, text) => {
  const e = document.createElement(tag);
  e.textContent = text;
  return e;
};
/** Replay never calls a campaign action and never awards resources. */
export function renderStoryArchive(app, root, chapter) {
  const s = app.model.session;
  let selected = chapter ?? s.storyProgress.currentChapter;
  const draw = () => {
    root.replaceChildren(
      n('h2', 'Truyện ký 12 chương'),
      n(
        'p',
        '240 hồi · Xem lại hồi đã qua, tiếp tục hồi hiện tại. Lựa chọn đã lưu được giữ nguyên.'
      )
    );
    const tabs = n('div', '');
    tabs.className = 'story-chapters';
    for (const c of CHAPTERS) {
      const b = n('button', `Chương ${c.number} · ${c.title}`);
      b.type = 'button';
      b.disabled = c.number > s.storyProgress.currentChapter;
      b.setAttribute('aria-pressed', String(selected === c.number));
      b.addEventListener('click', () => {
        selected = c.number;
        draw();
      });
      tabs.append(b);
    }
    root.append(tabs);
    const c = CHAPTERS[selected - 1];
    root.append(n('h3', c.title), n('p', c.summary));
    const list = n('div', '');
    list.className = 'story-episodes';
    for (const q of MAIN_QUESTS.filter((q) => q.chapter === selected)) {
      const done = s.storyProgress.completedQuests.includes(q.id),
        current = q.id === s.storyProgress.activeQuestId,
        b = n(
          'button',
          `${done ? 'Đã qua' : current ? 'Đang theo' : 'Chưa mở'} · Hồi ${q.episode} · ${q.title}`
        );
      b.type = 'button';
      b.dataset.episode = q.id;
      b.disabled = !done && !current;
      b.addEventListener('click', () => {
        if (current) {
          app.showMain();
          return;
        }
        app.dialogue.show({
          title: `Xem lại · Chương ${q.chapter} hồi ${q.episode} · ${q.title}`,
          quest: q,
          lines: storyLines(q, s, MAIN_QUESTS, COMPANIONS_BY_ID),
          note: s.storyProgress.decisions[q.id]
            ? `Đã chọn: ${q.choices.find((c) => c.id === s.storyProgress.decisions[q.id])?.text ?? 'Kết cục đã lưu'}`
            : 'Mốc đã đi qua từ bản lưu cũ; chưa ghi lựa chọn ở hồi này.',
          onBack: () => app.setView('tavern')
        });
        app.setView('dialogue');
      });
      list.append(b);
    }
    root.append(list);
  };
  draw();
}
