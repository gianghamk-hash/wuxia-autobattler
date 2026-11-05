import { casebook } from '../core/Casebook.js';
import { portrait } from './Visuals.js';
const n = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const button = (text, fn) => {
  const b = n('button', text);
  b.type = 'button';
  b.onclick = fn;
  return b;
};
export function renderCasebook(app, root) {
  const book = casebook(app.model.session);
  const preference=app.casebookView??={tab:'evidence',query:''};
  root.append(
    n('h2', 'Sổ đầu mối vụ án'),
    n(
      'p',
      'Chỉ ghi việc đã biết qua hồi hoàn thành. Lời chứng và nghi vấn được giữ riêng với vật chứng; mở sổ không đổi lựa chọn hay nhận thưởng.',
      'hint'
    )
  );
  const next = n('article', undefined, 'panel');
  next.append(
    n('h3', book.next ? 'Việc cần làm tiếp' : 'Hành trình đã khép lại'),
    n(
      'p',
      book.next
        ? book.next.location + ' · ' + book.next.title
        : 'Có thể xem lại các chứng cứ đã thu thập.'
    )
  );
  if (book.next) {
    next.append(
      n('p', book.next.objective),
      button('Theo hồi hiện tại', () => app.showMain())
    );
  }
  root.append(next);
  const tabs = n('div', undefined, 'casebook-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Nội dung sổ đầu mối');
  const content = n('section'),
    search = n('input');
  search.type = 'search';
  search.placeholder = 'Tìm người hoặc đầu mối đã biết';
  search.setAttribute('aria-label', 'Tìm trong sổ đầu mối');
  let tab = preference.tab;search.value=preference.query;
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  const matches = (s) => norm(s).includes(norm(search.value.trim()));
  const source = (card, id) => {
    const q = book.entries.find((e) => e.source === id)?.quest;
    card.append(
      button(
        'Xem lại nguồn' + (q ? ' · Ch' + q.chapter + ' H' + q.episode : ''),
        () => {
          root.querySelector('dialog')?.close();
          app.openCaseSource(id);
        }
      )
    );
  };
  const showPerson = (id) => {
    const p = book.people.find((p) => p.id === id);
    if (!p) return;
    let dialog = root.querySelector('dialog');
    if (!dialog) {
      dialog = n('dialog', undefined, 'case-person-modal');
      dialog.setAttribute('aria-labelledby', 'case-person-title');
      root.append(dialog);
    }
    const title = n('h2', p.name);
    title.id = 'case-person-title';
    dialog.replaceChildren(
      portrait(p),
      title,
      n('p', 'Hồ sơ chỉ dùng các đầu mối đã mở.')
    );
    for (const fact of p.facts) {
      const article = n('article');
      article.append(n('h3', fact.title), n('p', fact.text));
      source(article, fact.source);
      dialog.append(article);
    }
    dialog.append(button('Đóng hồ sơ', () => dialog.close()));
    dialog.showModal();
  };
  const draw = () => {
    content.replaceChildren();
    for (const b of tabs.children)
      b.setAttribute('aria-pressed', String(b.dataset.tab === tab));
    if (tab === 'evidence')
      for (const e of book.entries.filter((e) =>
        matches(e.title + ' ' + e.text + ' ' + e.type)
      )) {
        const card = n('article', undefined, 'panel case-entry');
        card.dataset.clue = e.id;
        card.append(
          n(
            'small',
            e.type +
              ' · Chương ' +
              e.quest.chapter +
              ' · Hồi ' +
              e.quest.episode
          ),
          n('h3', e.title),
          n('p', e.text)
        );
        source(card, e.source);
        content.append(card);
      }
    if (tab === 'people')
      for (const p of book.people.filter((p) =>
        matches(p.name + ' ' + p.facts.map((f) => f.text).join(' '))
      )) {
        const card = n('article', undefined, 'panel case-person');
        card.dataset.casePerson = p.id;
        card.append(
          portrait(p),
          button(p.name, () => showPerson(p.id))
        );
        for (const fact of p.facts) {
          card.append(n('p', fact.text));
          source(card, fact.source);
        }
        content.append(card);
      }
    if (tab === 'questions')
      for (const q of book.questions.filter((q) =>
        matches(q.question + ' ' + (q.answer ?? ''))
      )) {
        const card = n('article', undefined, 'panel');
        card.append(
          n('small', q.answered ? 'Đã có câu trả lời' : 'Cần xác minh'),
          n('h3', q.question),
          n('p', q.answer ?? 'Chưa đủ bằng chứng trong các hồi đã hoàn thành.')
        );
        source(card, q.source);
        content.append(card);
      }
    if (tab === 'relations')
      for (const e of book.relations) {
        const a = book.people.find((p) => p.id === e.from),
          b = book.people.find((p) => p.id === e.to);
        if (!matches(a.name + ' ' + b.name + ' ' + e.text)) continue;
        const card = n('article', undefined, 'panel case-relation');
        card.append(
          portrait(a),
          button(a.name, () => showPerson(a.id)),
          n('span', '↔'),
          portrait(b),
          button(b.name, () => showPerson(b.id)),
          n('p', e.text)
        );
        source(card, e.source);
        content.append(card);
      }
    if (!content.children.length)
      content.append(
        n(
          'p',
          search.value
            ? 'Chưa có kết quả trong thông tin đã biết.'
            : 'Chưa có ghi chép ở mục này. Hoàn thành các hồi để bổ sung đầu mối.',
          'hint'
        )
      );
  };
  for (const [id, label] of [
    ['evidence', 'Bằng chứng'],
    ['questions', 'Cần xác minh'],
    ['people', 'Nhân vật'],
    ['relations', 'Quan hệ']
  ]) {
    const b = button(label, () => {
      tab = id;
      preference.tab=id;
      draw();
    });
    b.dataset.tab = id;
    tabs.append(b);
  }
  search.addEventListener('input', ()=>{preference.query=search.value;draw();});
  root.append(tabs, search, content);
  draw();
}
