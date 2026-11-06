import {continuityFor} from '../data/StoryContinuity.js';
import { COMPANIONS } from '../data/CompanionsData.js';
import { portrait, icon } from './Visuals.js';
import { findNPC } from '../data/NPCData.js';
import { expressionFor, sceneFor } from '../data/PresentationData.js';
import { renderBattleBrief } from './BattleBriefUI.js';
import { DAI_VIET_CAST_BY_NAME } from '../data/DaiVietCast.js';
import {heroAppearance,heroLines,heroText} from '../data/HeroIdentity.js';
const node = (tag, text, className) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (className) e.className = className;
  return e;
};
export function speakerPortrait(speaker, hero, quest,actor,identitySession) {
  const name = speaker.trim().normalize('NFC');
  if (actor==='hero'||name === 'Bạn'||name==='Trần Phong')
    return portrait(identitySession?heroAppearance(identitySession,quest):hero?.sect ?? 'VoDang', 'classic-portrait');
  if(['Người kể','Trước đó'].includes(name))return portrait({id:'narrator',portrait:'assets/images/narrator.webp'},'classic-portrait');
  if(quest?.canon==='dai-viet'&&DAI_VIET_CAST_BY_NAME[name])return expressive(DAI_VIET_CAST_BY_NAME[name],quest);
  const companion = COMPANIONS.find(
    (c) =>
      c.name === name || c.legacyName===name || c.legacyName?.startsWith(name+' ') || (name.length >= 3 && c.name.startsWith(name + ' '))
  );
  if (companion) return expressive(companion, quest);
  const npc = findNPC(name);
  if (npc) return expressive(npc, quest);
  const result = node('span', undefined, 'classic-portrait');
  result.setAttribute('aria-hidden', 'true');
  result.classList.add('portrait-symbol');
  result.append(
    icon(['Người kể', 'Trước đó'].includes(name) ? 'codex' : 'roster')
  );
  return result;
}
function expressive(person, quest) {
  const result = portrait(person, 'classic-portrait'),
    url = expressionFor(person.assetId??person.id, quest);
  if (url) {
    result.style.backgroundImage = 'url("' + url + '")';
    result.dataset.expression = url.split('/').at(-1);
  }
  return result;
}
/** Classic portrait-and-text dialogue. Reading never calls a campaign action. */
export class DialogueUI {
  constructor(root) {
    this.root = root;
  }
  show({
    title,
    lines = [],
    choices = [],
    onChoice,
    onBack,
    note = '',
    quest,
    hero,
    readerKey,
    getReader,
    onRead,
    onFont,
    brief,
    continuous = false,
    identitySession
  }) {
    const pages = heroLines(lines.length
      ? lines
      : [['Người kể', note || 'Chưa có lời thoại.']],identitySession);
    let index = Math.max(
      0,
      Math.min(pages.length - 1, getReader?.().positions[readerKey] ?? 0)
    );
    this.root.replaceChildren();
    this.root.className = 'panel classic-dialogue';
    this.root.parentElement.classList.add('has-classic-dialogue');
    this.root.append(node('h2', title, 'classic-title'));
    const extras=node('section',undefined,'classic-extras');
    extras.setAttribute('aria-label','Thông tin thêm về câu chuyện');
    const returning=identitySession?.storyProgress.decisions.D19H18==='home';
    const continuity=continuityFor(quest,{returning});
    if(continuity){
      const stamp=node('p',`${quest.id==='D01H01'?'Ngày gặp nạn · Trường quay':continuity.time+' · '+continuity.place}`,'story-time');this.root.append(stamp);
      const logic=node('details',undefined,'story-logic');logic.append(node('summary','Việc đang theo đuổi và những gì đã rõ'),node('p',continuity.thread));
      const known=readerKey?.startsWith('aftermath:')||identitySession?.storyProgress.completedQuests.includes(quest.id)?quest.episode:quest.episode-1;
      for(const step of continuity.stages.filter(v=>v.at<=known))logic.append(node('p',step.label+': '+heroText(step.text,identitySession)));
      extras.append(logic);
    }
    const full=readerKey?.startsWith('aftermath:')?quest?.fullAftermath:quest?.fullLines;
    if(full?.length>lines.length){const archive=node('details',undefined,'classic-recap');archive.append(node('summary','Bản thoại đầy đủ · tùy chọn'));for(const[speaker,text]of heroLines(full,identitySession))archive.append(node('p',speaker+': '+text));extras.append(archive);}
    renderBattleBrief(this.root, brief);
    if (quest?.chapterGoal) {
      if(!continuous)this.root.append(
        node('p', `Mục tiêu chương: ${quest.chapterGoal}`, 'classic-goal')
      );
      const recap = node('details', undefined, 'classic-recap');
      recap.append(
        node('summary', 'Nhắc lại câu chuyện'),
        node('p', quest.chapterSummary)
      );
      if(continuous)recap.append(node('p',quest.chapterGoal));
      extras.append(recap);
    }
    const scene = node('div', undefined, 'classic-scene');
    scene.style.backgroundImage =
      'linear-gradient(0deg,#091f28aa,transparent),url("' +
      sceneFor(quest) +
      '")';
    if(quest?.scene==='modern'){
      scene.style.backgroundImage='linear-gradient(125deg,#28444f,#102c30)';
      scene.classList.add('modern-scene');
    }
    scene.setAttribute('aria-hidden', 'true');
    scene.append(
      node('span', quest?.location ?? 'Giang hồ ký sự', 'classic-location')
    );
    this.root.append(scene);
    const frame = node('button', undefined, 'classic-line');
    frame.type = 'button';
    frame.id = 'dialogue-advance';
    const copy = node('span', undefined, 'classic-copy');
    const name = node('strong', undefined, 'classic-speaker');
    name.id = 'dialogue-speaker';
    const role = node('span', undefined, 'classic-role');
    const text = node('span', undefined, 'classic-text');
    text.id = 'dialogue-text';
    text.style.fontSize = (getReader?.().fontSize ?? 18) + 'px';
    copy.setAttribute('aria-live', 'polite');
    copy.setAttribute('aria-atomic', 'true');
    copy.append(name, role, text);
    const indicator = node('span', '▸', 'classic-indicator');
    indicator.setAttribute('aria-hidden', 'true');
    const controls = node('div', undefined, 'classic-controls');
    const previous = node('button', '◂ Trước');
    previous.type = 'button';
    previous.id = 'dialogue-previous';
    const count = node('span', undefined, 'classic-step');
    const next = node('button', 'Tiếp ▸');
    next.type = 'button';
    next.id = 'dialogue-next';
    controls.append(previous, count, next);
    const noteNode = node('p', note, 'hint classic-note');
    const buttons = node('div', undefined, 'dialogue-choices');
    for (const choice of choices) {
      const b = node('button', choice.text);
      b.type = 'button';
      b.dataset.choice = String(choice.id);
      if(choice.portrait){b.classList.add('enrollment-choice');b.replaceChildren(portrait(choice.portrait,'enrollment-portrait'),node('span',choice.text,'enrollment-copy'));}
      b.disabled = choice.disabled === true;
      b.addEventListener('click', () => {if(this.root.contains(b))onChoice(choice.id);});
      buttons.append(b);
    }
    this.root.append(frame, controls, noteNode, buttons);
    if (getReader) {
      const tools = node('div', undefined, 'reader-tools');
      const history = node('details', undefined, 'reader-history'),
        content = node('ol');
      history.append(node('summary', 'Lịch sử lời thoại'), content);
      history.addEventListener('toggle', () => {
        if (!history.open) return;
        content.replaceChildren(
          ...getReader().history.map((row) =>
            node('li', (row.speaker==='Trần Phong'?identitySession?.hero?.name??row.speaker:row.speaker) + ': ' + heroText(row.text,identitySession))
          )
        );
      });
      tools.append(history);
      this.root.append(tools);
    }
    if (onBack) {
      const back = node('button', 'Về doanh trại', 'classic-back');
      back.type = 'button';
      back.addEventListener('click', onBack);
      this.root.append(back);
    }
    if(extras.childElementCount)this.root.append(extras);
    const draw = () => {
      const [speaker, line,actor] = pages[index],
        last = index === pages.length - 1;
      frame.replaceChildren(
        speakerPortrait(speaker, hero, quest,actor,identitySession),
        copy,
        indicator
      );
      if (readerKey) onRead?.(readerKey, index, speaker, line);
      name.textContent = speaker;
      text.textContent = line;
      const npc = actor==='hero'?null:quest?.canon==='dai-viet'?DAI_VIET_CAST_BY_NAME[speaker]:findNPC(speaker);
      role.textContent = heroText(npc?.role ?? '',identitySession);
      role.hidden = !npc;
      frame.title = npc?.bio ?? '';
      frame.setAttribute(
        'aria-label',
        last ? `${speaker}: ${line}` : `${speaker}: ${line}. Bấm để đọc tiếp.`
      );
      indicator.hidden = last;
      count.textContent = `${index + 1} / ${pages.length}`;
      previous.disabled = index === 0;
      next.disabled = last;
      buttons.hidden = !last || !choices.length;
      noteNode.hidden = !last || !note || pages.some(([, t]) => t === note);
    };
    const move = (delta) => {
      index = Math.max(0, Math.min(pages.length - 1, index + delta));
      draw();
    };
    frame.addEventListener('click', () => move(1));
    frame.addEventListener('keydown', (event) => {
      if (['Enter', ' '].includes(event.key)) event.stopPropagation();
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    draw();
  }
}
