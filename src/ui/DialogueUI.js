import { hasWebtoon, renderWebtoon } from './Webtoon.js';
/** Pure DOM dialogue surface; actions are validated by the campaign controller. */
export class DialogueUI {
  constructor(root) { this.root = root; }
  show({ title, lines = [], choices = [], onChoice, onBack, note = '', quest, textOnly = false }) {
    this.root.replaceChildren();
    const illustrated = hasWebtoon(quest) && !textOnly;
    this.root.classList.toggle('is-webtoon', illustrated);
    this.root.parentElement.classList.toggle('has-webtoon', illustrated);
    const heading = document.createElement('h2'); heading.textContent = title; this.root.append(heading);
    if (hasWebtoon(quest)) {
      const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'webtoon-mode';
      toggle.textContent = illustrated ? 'Đọc dạng chữ' : 'Xem truyện tranh';
      toggle.setAttribute('aria-pressed', String(illustrated));
      toggle.addEventListener('click', () => this.show({ title, lines, choices, onChoice, onBack, note, quest, textOnly: !textOnly }));
      this.root.append(toggle);
    }
    if (illustrated) renderWebtoon(this.root, { quest, lines });
    else for (const [speaker, text] of lines) {
      const row = document.createElement('article'); row.className = 'dialogue-line';
      const name = document.createElement('strong'); name.textContent = speaker;
      const body = document.createElement('p'); body.textContent = text; row.append(name, body); this.root.append(row);
    }
    if (note && (!illustrated || !lines.some(([, text]) => text === note))) { const text = document.createElement('p'); text.className = 'hint'; text.textContent = note; this.root.append(text); }
    const buttons = document.createElement('div'); buttons.className = 'dialogue-choices';
    for (const choice of choices) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = choice.text; button.disabled = choice.disabled === true; button.dataset.choice = String(choice.id);
      button.addEventListener('click', () => onChoice(choice.id)); buttons.append(button);
    }
    if (onBack) { const back = document.createElement('button'); back.type = 'button'; back.textContent = 'Về doanh trại'; back.addEventListener('click', onBack); buttons.append(back); }
    this.root.append(buttons);
  }
}
