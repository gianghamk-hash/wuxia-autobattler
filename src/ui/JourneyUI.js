import {appendCompanionMemoryRoster} from './CompanionJourneyUI.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { BOND_VARIANTS, BOND_TITLES } from '../data/BondsData.js';
import { Hero } from '../entities/Hero.js';
import { formationAdvice, battleAdvice } from '../combat/TeamAdvisor.js';
import { portrait } from './Visuals.js';
import {storyPerson,isDaiViet} from '../data/DaiVietCast.js';
const n = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
function button(text, action, disabled = false) {
  const b = n('button', text);
  b.type = 'button';
  b.disabled = disabled;
  b.onclick = action;
  return b;
}
const locked = (app) =>
  app.model.running ||
  Boolean(
    app.model.session.storyProgress.pendingEncounter ||
      app.model.session.adventure.dungeon
  );
export function renderJourneyRoster(app) {
  let root = document.getElementById('journey-roster');
  if (!root) {
    root = n('section', undefined, 'panel');
    root.id = 'journey-roster';
    (document.getElementById('roster-loadouts-anchor')??document.getElementById('roster-list')).before(root);
  }
  const s = app.model.session;
  root.replaceChildren(n('h2', 'Đội hình của ta'));
  root.append(
    n(
      'p',
      'Lưu ba cách xếp người và chiến thuật. Đổi đội không thay trang bị, môn phái đã học hay món chuẩn bị.',
      'hint'
    )
  );
  s.journey.loadouts.forEach((layout, i) => {
    const row = n('div', undefined, 'loadout-row'),
      input = n('input');
    input.maxLength = 32;
    input.value = layout?.name ?? 'Đội ' + (i + 1);
    input.setAttribute('aria-label', 'Tên đội ' + (i + 1));
    row.append(
      input,
      button(
        layout ? 'Ghi đè' : 'Lưu đội',
        () => app.run(() => app.model.saveLoadout(i, input.value)),
        locked(app)
      ),
      button(
        'Dùng đội',
        () => app.run(() => app.model.applyLoadout(i)),
        locked(app) || !layout
      )
    );
    root.append(row);
  });
  if (s.hero.sect) {
    const hero = new Hero(s.hero.sect, {
      profile: s.hero,
      inventory: s.inventory
    });
    const members = [
      hero,
      ...s.party.active.map((id) => storyPerson(s,COMPANIONS_BY_ID[id]))
    ].map((u) => ({ ...u, position: s.party.formation[u.id] }));
    const ul = n('ul');
    for (const note of formationAdvice(members)) ul.append(n('li', note));
    root.append(n('h3', 'Gợi ý xếp đội'), ul);
  }
}
export function renderBattleAdvice(app, result) {
  let root = document.getElementById('battle-advice');
  if (!root) {
    root = n('div');
    root.id = 'battle-advice';
    document.getElementById('battle-stats').after(root);
  }
  const ul = n('ul');
  for (const note of battleAdvice(result)) ul.append(n('li', note));
  root.replaceChildren(n('h3', 'Nhìn lại trận đấu'), ul);
}
export function renderBonds(app, root) {
  root.append(
    n('h2', 'Chuyện sau chuyến đi'),
    n(
      'p',
      isDaiViet(app.model.session)?'Các cuộc trò chuyện có mốc thân tình 30 / 60 / 100 và chương riêng trên từng nút. Lôi Nam và Mai Tước xuất hiện theo chính truyện; mốc cuối mở biến thể chiêu hiện có, không cộng thêm tuyệt kỹ.':'Năm người bạn đầu tiên có ba mốc thân tình: 30 / 60 / 100, ở chương 2 / 6 / 10. Mốc cuối mở một danh hiệu và biến thể tuyệt kỹ; chỉ dùng một phiên bản mỗi lần.'
    )
  );
  appendCompanionMemoryRoster(app,root);
  for (const id of Object.keys(BOND_VARIANTS)) {
    const person = storyPerson(app.model.session,COMPANIONS_BY_ID[id]),
      card = n('article', undefined, 'panel bond-card'),
      s = app.model.session;
    card.append(
      portrait(person),
      n('h3', person.name),
      n('p', 'Thân tình ' + (s.companionsAffinity[id] ?? 0) + '/100')
    );
    for (const story of app.model
      .bondStories()
      .filter((b) => b.companionId === id)) {
      const open = () => {
        const showOutcome = (choice) => {
          app.dialogue.show({
            title: story.title,
            ...app.readerOptions('bond:' + story.id),
            hero: app.model.session.hero,
            quest: {
              canon:story.canon,
              chapter: story.chapter,
              location: 'Quán Rồng Lửa · chuyện đồng hành'
            },
            lines: [
              ...story.lines,
              ['Bạn', story.choices.find((c) => c.id === choice).text],
              ['Người kể', story.endings[choice]]
            ],
            note:
              story.stage === 3
                ? 'Danh hiệu: ' +
                  BOND_TITLES[id] +
                  ' · Đã mở ' +
                  BOND_VARIANTS[id].name
                : '',
            onBack: () => app.setView('tavern')
          });
        };
        if (story.done)
          showOutcome(app.model.session.journey.bonds.choices[story.id]);
        else
          app.dialogue.show({
            title: story.title,
            ...app.readerOptions('bond:' + story.id),
            hero: s.hero,
            quest: {
              canon:story.canon,
              chapter: story.chapter,
              location: 'Quán Rồng Lửa · chuyện đồng hành'
            },
            lines: story.lines,
            choices: story.choices,
            onBack: () => app.setView('tavern'),
            onChoice: (choice) =>
              app.run(() => {
                app.model.completeBond(story.id, choice);
                showOutcome(choice);
              })
          });
        app.setView('dialogue');
      };
      card.append(
        button(
          (story.done
            ? 'Xem lại · '
            : story.available
              ? 'Trò chuyện · '
              : 'Chưa mở · ') +
            story.title +
            ' · Ch' +
            story.chapter +
            ' / ' +
            story.affinity +
            ' thân tình',
          open,
          (!story.available && !story.done) || locked(app)
        )
      );
    }
    if (s.journey.bonds.completed.includes('bond_' + id + '_3')) {
      card.append(
        n('strong', 'Danh hiệu: ' + BOND_TITLES[id]),
        n('p', BOND_VARIANTS[id].description)
      );
      const modes = n('div', undefined, 'bond-modes');
      for (const [mode, label] of [
        ['base', 'Chiêu gốc'],
        ['variant', BOND_VARIANTS[id].name]
      ]) {
        const b = button(
          label,
          () => app.run(() => app.model.setBondMode(id, mode)),
          locked(app)
        );
        b.setAttribute(
          'aria-pressed',
          String(s.journey.bonds.modes[id] === mode)
        );
        modes.append(b);
      }
      card.append(modes);
    }
    root.append(card);
  }
}
