import { portrait } from './Visuals.js';
import { roleLabel, skillSummary } from '../combat/BattleIntent.js';
const n = (tag, text) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  return e;
};
export function renderBattleBrief(root, brief) {
  if (!brief) return;
  if (brief.objective) {
    const goal = n(
      'p',
      'Mục tiêu đặc biệt: ' +
        brief.objective.title +
        ' · ' +
        brief.objective.description
    );
    goal.className = 'mission-brief-goal';
    root.append(goal);
  }
  const d = n('details');
  d.className = 'battle-brief';
  d.append(n('summary', 'Trinh sát trước trận · ' + brief.name));
  d.append(
    n(
      'p',
      brief.objective?.description ??
        'Thắng khi hạ toàn bộ đội địch; thua khi đội mình bị hạ. Hết giờ mà hai phe còn người thì hòa.'
    )
  );
  if (brief.objective) d.append(n('p', 'Thất bại: ' + brief.objective.failure));
  const list = n('div');
  list.className = 'brief-grid';
  for (const u of brief.enemies) {
    const card = n('article');
    card.className = 'brief-enemy';
    card.dataset.scout = u.id;
    card.append(
      portrait(u),
      n('strong', u.name),
      n(
        'small',
        roleLabel(u.role) +
          ' · Cấp ' +
          u.level +
          ' · ' +
          Math.ceil(u.stats.maxHp) +
          ' HP'
      ),
      n(
        'p',
        u.skills.autoAttack.name + ' · ' + skillSummary(u.skills.autoAttack)
      ),
      n(
        'p',
        'Tuyệt kỹ: ' +
          u.skills.ultimate.name +
          ' · ' +
          skillSummary(u.skills.ultimate)
      )
    );
    const guide = brief.guides.find((g) => g.id === u.characterId);
    if (guide) card.append(n('p', 'Cơ chế: ' + guide.text));
    if (u.targetPriority === 'objective')
      card.append(
        n(
          'p',
          'Ý đồ: ưu tiên đánh mục tiêu bảo vệ khi có thể tiếp cận. Khiêu khích có thể kéo hắn ra.'
        )
      );
    list.append(card);
  }
  d.append(
    list,
    n(
      'p',
      'Đây là đội hình và kỹ năng thực của trận sắp tới. Mục tiêu trong lúc đánh có thể đổi theo khiêu khích, tầm đánh và đường đi.'
    )
  );
  root.append(d);
}
