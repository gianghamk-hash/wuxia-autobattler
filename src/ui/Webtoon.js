/** Authored opening storyboard. Story text stays in HTML, never baked into art. */
const OPENING = {
  image: './assets/images/story/chapter01-opening.webp',
  shots: [
    { alt: 'Quán Rồng Lửa bên gốc đa lúc chạng vạng, ánh đèn ấm hắt ra mặt nước.', label: 'Thanh Khê · Quán Rồng Lửa' },
    { alt: 'Một bàn tay che cuốn sổ cũ bên bát cơm; bóng người cầm đuốc xuất hiện ở cửa.', label: 'Một cuốn sổ bị bỏ lại.' },
    { alt: 'Đội thu tô xông vào quán. Quán chủ dang tay bảo vệ những người đang ăn.', label: 'Bữa cơm chưa kịp nguội.' }
  ]
};
export function hasWebtoon(quest) { return quest?.id === 'Q101'; }
const element = (tag, text, className) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (className) e.className = className;
  return e;
};
export function renderWebtoon(root, { quest, lines }) {
  const intro = element('header', undefined, 'webtoon-intro');
  intro.append(element('p', `CHƯƠNG ${String(quest.chapter).padStart(2, '0')}`, 'webtoon-kicker'), element('p', 'Lửa dưới mái quán', 'webtoon-title'), element('p', 'Cuộn xuống để theo câu chuyện', 'webtoon-scroll-hint'));
  root.append(intro);
  const recap = lines.filter(([speaker]) => speaker === 'Trước đó');
  const narrative = lines.filter(([speaker]) => speaker !== 'Trước đó');
  if (recap.length) {
    const detail = element('details', undefined, 'webtoon-recap');
    detail.append(element('summary', 'Trước khi câu chuyện bắt đầu'));
    for (const [, text] of recap) detail.append(element('p', text));
    root.append(detail);
  }
  const strip = element('div', undefined, 'webtoon-strip');
  strip.setAttribute('aria-label', 'Truyện tranh cuộn dọc: Lửa dưới mái quán');
  const panels = OPENING.shots.map((shot, index) => {
    const panel = element('figure', undefined, `webtoon-panel webtoon-panel-${index}`);
    const art = element('div', undefined, 'webtoon-art');
    const img = document.createElement('img');
    img.src = OPENING.image; img.alt = shot.alt; img.width = 1024; img.height = 1536;
    img.loading = index === 0 ? 'eager' : 'lazy'; img.decoding = 'async';
    img.style.top = `${index * -100}%`;
    art.append(img, element('span', shot.label, 'webtoon-location'));
    const caption = element('figcaption', undefined, 'webtoon-caption');
    panel.append(art, caption); strip.append(panel);
    return caption;
  });
  // Preserve every authored line and callback, in its original reading order.
  // The first two narrator beats establish the inn and ledger; the rest follows the confrontation.
  narrative.forEach(([speaker, text], index) => {
    const block = element('div', undefined, speaker === 'Người kể' ? 'webtoon-narration' : 'webtoon-bubble');
    if (speaker !== 'Người kể') block.append(element('strong', speaker, 'webtoon-speaker'));
    block.append(element('p', text));
    panels[Math.min(index, 2)].append(block);
  });
  root.append(strip, element('p', 'Từ đây, câu chuyện nằm trong tay bạn.', 'webtoon-transition'));
}
