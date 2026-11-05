import { COMPANIONS } from '../data/CompanionsData.js';
import { portrait, icon } from './Visuals.js';
import { findNPC } from '../data/NPCData.js';
const node = (tag, text, className) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (className) e.className = className;
  return e;
};
export function speakerPortrait(speaker, hero) {
  const name = speaker.trim().normalize('NFC');
  if (name === 'Bạn') return portrait(hero?.sect ?? 'VoDang', 'classic-portrait');
  const companion = COMPANIONS.find(c => c.name === name || (name.length >= 3 && c.name.startsWith(name + ' ')));
  if (companion) return portrait(companion, 'classic-portrait');
  const npc = findNPC(name);
  if (npc) return portrait(npc, 'classic-portrait');
  const result = node('span', undefined, 'classic-portrait');
  result.setAttribute('aria-hidden', 'true');
  result.classList.add('portrait-symbol');
  result.append(icon(['Người kể', 'Trước đó'].includes(name) ? 'codex' : 'roster'));
  return result;
}
/** Classic portrait-and-text dialogue. Reading never calls a campaign action. */
export class DialogueUI {
  constructor(root) { this.root = root; }
  show({ title, lines = [], choices = [], onChoice, onBack, note = '', quest, hero }) {
    const pages = lines.length ? lines : [['Người kể', note || 'Chưa có lời thoại.']];
    let index = 0;
    this.root.replaceChildren();
    this.root.className = 'panel classic-dialogue';
    this.root.parentElement.classList.add('has-classic-dialogue');
    this.root.append(node('h2', title, 'classic-title'));
    if (quest?.chapterGoal) {
      this.root.append(node('p', `Mục tiêu chương: ${quest.chapterGoal}`, 'classic-goal'));
      const recap = node('details', undefined, 'classic-recap');
      recap.append(node('summary', 'Nhắc lại câu chuyện'), node('p', quest.chapterSummary));
      this.root.append(recap);
    }
    const scene = node('div', undefined, 'classic-scene');
    scene.setAttribute('aria-hidden', 'true');
    scene.append(node('span', quest?.location ?? 'Giang hồ ký sự', 'classic-location'));
    this.root.append(scene);
    const frame = node('button', undefined, 'classic-line');
    frame.type = 'button'; frame.id = 'dialogue-advance';
    const copy = node('span', undefined, 'classic-copy');
    const name = node('strong', undefined, 'classic-speaker'); name.id = 'dialogue-speaker';
    const role = node('span', undefined, 'classic-role');
    const text = node('span', undefined, 'classic-text'); text.id = 'dialogue-text';
    copy.setAttribute('aria-live', 'polite'); copy.setAttribute('aria-atomic', 'true');
    copy.append(name, role, text);
    const indicator = node('span', '▸', 'classic-indicator'); indicator.setAttribute('aria-hidden', 'true');
    const controls = node('div', undefined, 'classic-controls');
    const previous = node('button', '◂ Trước'); previous.type = 'button'; previous.id = 'dialogue-previous';
    const count = node('span', undefined, 'classic-step');
    const next = node('button', 'Tiếp ▸'); next.type = 'button'; next.id = 'dialogue-next';
    controls.append(previous, count, next);
    const noteNode = node('p', note, 'hint classic-note');
    const buttons = node('div', undefined, 'dialogue-choices');
    for (const choice of choices) {
      const b = node('button', choice.text); b.type = 'button'; b.dataset.choice = String(choice.id); b.disabled = choice.disabled === true;
      b.addEventListener('click', () => onChoice(choice.id)); buttons.append(b);
    }
    this.root.append(frame, controls, noteNode, buttons);
    if (onBack) {
      const back = node('button', 'Về doanh trại', 'classic-back'); back.type = 'button';
      back.addEventListener('click', onBack); this.root.append(back);
    }
    const draw = () => {
      const [speaker, line] = pages[index], last = index === pages.length - 1;
      frame.replaceChildren(speakerPortrait(speaker, hero), copy, indicator);
      name.textContent = speaker; text.textContent = line;
      const npc = findNPC(speaker);
      role.textContent = npc?.role ?? ''; role.hidden = !npc;
      frame.title = npc?.bio ?? '';
      frame.setAttribute('aria-label', last ? `${speaker}: ${line}` : `${speaker}: ${line}. Bấm để đọc tiếp.`);
      indicator.hidden = last;
      count.textContent = `${index + 1} / ${pages.length}`;
      previous.disabled = index === 0; next.disabled = last;
      buttons.hidden = !last || !choices.length;
      noteNode.hidden = !last || !note || pages.some(([, t]) => t === note);
    };
    const move = delta => { index = Math.max(0, Math.min(pages.length - 1, index + delta)); draw(); };
    frame.addEventListener('click', () => move(1));
    frame.addEventListener('keydown', event => {
      if (['Enter', ' '].includes(event.key)) event.stopPropagation();
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    draw();
  }
}
