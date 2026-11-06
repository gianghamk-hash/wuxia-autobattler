import {storyPerson,isDaiViet} from '../data/DaiVietCast.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { GACHA, RARITIES, rarityLabel } from '../data/GachaData.js';
import { itemCount } from '../core/Campaign.js';
import { freshGacha } from '../core/Gacha.js';
import { portrait, decorateRarity } from './Visuals.js';
const n = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
export function mountGachaUI(app) {
  const root = document.getElementById('gacha-root');
  let last = null;
  function render() {
    const s = app.model.session,
      g = s.gacha ?? freshGacha();
    root.replaceChildren();
    if (
      last &&
      !last.results.every((r) =>
        g.history.some(
          (h) => h.pull === r.pull && h.id === r.id && h.time === r.time
        )
      )
    )
      last = null;
    const heading = n('div', undefined, 'section-title');
    heading.append(
      n('h2', 'Chiêu hiền quán'),
      n('span', 'QUAY BẰNG BẠC', 'tiny-label')
    );
    root.append(
      heading,
      n(
        'p',
        isDaiViet(s)?'15 đồng hành gia nhập qua chính truyện, gồm đúng 1 người bậc 5. 45 người còn lại chỉ nhận tại vòng quay; nhân vật mới mở quay sau lần gặp trong truyện. Trong mỗi bậc chia đều những người đang có trong nhóm quay. Quay không tự đổi đội hình.':'Một chén trà, một cuộc gặp. 15 hiệp khách có tuyến nhận qua truyện, 45 người còn lại chỉ có trong vòng quay; quay không cộng kinh nghiệm hay tự đổi đội hình.',
        'hint'
      )
    );
    const pity = n('div', undefined, 'gacha-pity');
    pity.append(
      n('span', `Bậc 4 trở lên trong ${10 - g.sinceEpic} lượt`),
      n('span', `Bậc 5 trong ${80 - g.sinceLegendary} lượt`)
    );
    root.append(pity);
    const locked =
      app.model.running ||
      Boolean(s.storyProgress.pendingEncounter) ||!s.hero.sect||
      !s.storyProgress.completedQuests.includes('Q101')&&!s.storyProgress.completedQuests.includes('D01H06');
    const controls = n('div', undefined, 'gacha-actions');
    for (const [count, cost] of [
      [1, GACHA.singleCost],
      [5, GACHA.tenCost]
    ]) {
      const b = n('button', `Mời ${count} lượt · ${cost} bạc`);
      b.type = 'button';
      b.dataset.draw = String(count);
      b.disabled = locked || itemCount(s, 'silver') < cost;
      b.addEventListener('click', () =>
        app.run(() => {
          last = app.model.drawCompanions(count);
          render();
          app.toast(
            `Đã mời ${count} lượt · ${last.results.filter((r) => !r.duplicate).length} đồng hành mới.`
          );
        })
      );
      controls.append(b);
    }
    root.append(controls);
    if (locked)
      root.append(
        n(
          'p',
          'Mở sau trận đầu; kết thúc trận hoặc thử thách đang chờ để quay.',
          'hint'
        )
      );
    const rules = n('details');
    rules.append(n('summary', 'Tỉ lệ, bảo đảm và nhân vật trùng'));
    const table = n('table');
    table.className = 'gacha-rates';
    const head = n('tr');
    for (const text of ['Bậc', 'Tỉ lệ gốc', 'Hoàn khi trùng'])
      head.append(n('th', text));
    table.append(head);
    for (const r of RARITIES) {
      const row = n('tr');
      for (const t of [
        `${r.tier} · ${r.color}`,
        `${r.rate}%`,
        `${r.refund} bạc`
      ])
        row.append(n('td', t));
      table.append(row);
    }
    rules.append(
      table,
      n(
        'p',
        'Mỗi người cùng bậc có xác suất bằng nhau. Lượt thứ 10 liên tiếp chưa có bậc 4+ nâng kết quả thấp lên bậc 4; tỉ lệ bậc 5 vẫn 1%. Lượt thứ 80 chưa có bậc 5 bảo đảm bậc 5. Bậc 5 đặt lại cả hai bộ đếm; bậc 4 chỉ đặt lại mốc 10. Kết quả trùng vẫn tính bảo đảm. Hai mốc tính xuyên qua mọi lần mời, được lưu cùng tiến trình.',
        'hint'
      ),
      n(
        'p',
        'Gói mời 5 kết quả giá 540 bạc; lượt đơn giá 60 bạc. Tỉ lệ mỗi kết quả và bộ đếm bảo đảm được giữ. Phải đủ toàn bộ bạc trước khi mời; hoàn trùng áp dụng sau khi trừ giá. Đây là tiền trong game.',
        'hint'
      )
    );
    root.append(rules);
    if (last) {
      const result = n('section', undefined, 'gacha-reveal');
      result.setAttribute('aria-live', 'polite');
      result.append(n('h3', `Cuộc gặp vừa rồi · ${last.price} bạc`));
      const cards = n('div', undefined, 'gacha-results');
      for (const r of last.results) {
        const u = storyPerson(s,COMPANIONS_BY_ID[r.id]),
          card = n('button', undefined, 'gacha-result');
        card.type = 'button';
        decorateRarity(card, u);
        card.append(
          portrait(u),
          n('strong', u.name),
          n('span', rarityLabel(u.tier)),
          n(
            'small',
            r.duplicate
              ? `Đã có · hoàn ${r.refund} bạc`
              : 'Mới · đã vào bộ sưu tập'
          )
        );
        card.addEventListener('click', () => app.world.inspect(u));
        cards.append(card);
      }
      result.append(cards);
      root.append(result);
    }
    const history = n('details');
    history.append(n('summary', `Lịch sử · tổng ${g.total} lượt`));
    if (!g.history.length) history.append(n('p', 'Chưa có cuộc gặp.'));
    for (const r of [...g.history].reverse()) {
      const u = storyPerson(s,COMPANIONS_BY_ID[r.id]);
      history.append(
        n(
          'p',
          `#${r.pull} · ${u.name} · bậc ${r.tier} · ${r.duplicate ? `trùng, hoàn ${r.refund} bạc` : 'mới'}${r.guarantee === 'legendary' ? ' · bảo đảm 80' : r.guarantee === 'epic' ? ' · bảo đảm 10' : ''}`,
          'gacha-history'
        )
      );
    }
    root.append(history);
  }
  render();
  return { render };
}
