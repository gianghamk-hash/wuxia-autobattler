import { ATTRIBUTE_BONUSES } from '../data/ProgressionBalance.js';
import {ATTRIBUTE_PLANS7,ATTRIBUTE_REASONS7} from '../data/BuildGuides7.js';
import {LIMITS} from '../data/StrategyData.js';
import {gearImage} from './GearArt.js';
import { bus, EVT } from '../core/EventBus.js';
import { SECTS } from '../data/SectsData.js';
import { SKILL_TREES } from '../data/SkillTreeData.js';
import { EQUIPMENT, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import {gearRarity} from '../data/GearCatalog.js';
import { Hero } from '../entities/Hero.js';
import { renderHeroReadout } from './HeroReadout.js';
import { ATTRIBUTES, GEAR_SLOTS, MAX_LEVEL, normalizeHeroBuild, allocateSkill, allocateAttribute,
  equipItem, changeSect, resetSkills, resetAttributes, gainExperience, expToNextLevel, trialEquipment } from '../entities/HeroBuild.js';

function element(tag, text, className) {
  const node = document.createElement(tag); if (text !== undefined) node.textContent = text;
  if (className) node.className = className; return node;
}
const STAT_NAMES = { maxHp: 'HP', physicalAtk: 'Ngoại công', magicalAtk: 'Nội công', physicalDef: 'Ngoại phòng', magicalDef: 'Nội phòng', attackSpeed: 'Tốc đánh', critRate: 'Bạo kích', critDmg:'Sát thương bạo kích', dodgeRate: 'Né tránh' };
const statsText = stats => Object.entries(stats).map(([key, value]) => `${STAT_NAMES[key] ?? key} +${key==='attackSpeed'?value+' lần/giây':value < 1 ? `${Number((value * 100).toFixed(2))}%` : value}`).join(' · ');

export function mountSkillTreeUI({ getState, onChange, canEdit, allowTraining = true }) {
  const el = id => document.getElementById(id);
  const sect = el('progress-sect'), message = el('progress-message');
  const say = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
  for (const data of Object.values(SECTS)) { const option = element('option', data.name); option.value = data.id; sect.append(option); }
  el('btn-progress-train').hidden = el('btn-progress-gear').hidden = !allowTraining;
  let controls = [],branchChoice='attack',attributePlan='balanced';
  function locks() { for (const { node, disabled } of controls) node.disabled = disabled || !canEdit(); sect.disabled = !canEdit()||getState().storyProgress?.storyRevision===4; }
  function mutate(action, text) {
    if (!canEdit()) { say('Hãy kết thúc hoặc dựng lại bàn trước khi đổi hồ sơ.', true); return; }
    try {
      const state = getState(), hero = normalizeHeroBuild(state.hero, state.inventory);
      const result = action(hero, structuredClone(state.inventory));
      onChange(result.hero, result.inventory); refresh(); say(text);
    } catch (error) { say(error.message, true); }
  }
  function change(action, text) { return () => mutate((hero, inventory) => ({ hero: action(hero, inventory), inventory }), text); }
  el('btn-progress-sect').addEventListener('click', change((hero, items) => changeSect(hero, sect.value, items), 'Đã áp dụng môn phái.'));
  el('btn-progress-train').addEventListener('click', change((hero, items) => {
    if (!hero.sect) throw new Error('Hãy chọn môn phái trước.');
    return gainExperience(hero, expToNextLevel(hero.level) - hero.exp, items);
  }, 'Đã tăng một cấp thử nghiệm và nhận điểm.'));
  el('btn-progress-respec').addEventListener('click', change(resetSkills, 'Đã hoàn trả toàn bộ điểm kỹ năng.'));
  el('btn-progress-reset-attributes').addEventListener('click', change(resetAttributes, 'Đã hoàn trả toàn bộ điểm thuộc tính.'));
  el('btn-progress-gear').addEventListener('click', () => mutate((hero, inventory) => ({ hero, inventory: trialEquipment(hero, inventory) }), 'Đã nhận bộ trang bị thử. Mỗi món chỉ nhận một lần.'));
  function refresh() {
    const { hero: input, inventory } = getState(), hero = normalizeHeroBuild(input, inventory);
    controls = []; sect.value = hero.sect ?? '';
    const storyMode=getState().storyProgress?.storyRevision===4;
    const sectLabel=document.querySelector('label[for="progress-sect"]');if(sectLabel)sectLabel.hidden=storyMode;sect.hidden=storyMode;el('btn-progress-sect').hidden=storyMode;
    el('progress-summary').textContent = `Cấp ${hero.level}/${MAX_LEVEL} · XP ${hero.exp}/${hero.level === MAX_LEVEL ? 'Tối đa' : expToNextLevel(hero.level)} · Điểm kỹ năng ${hero.freeSkillPoints} · Điểm thuộc tính ${hero.freeAttributePoints}`;
    const tree = el('skill-tree'); tree.replaceChildren();
    if(hero.sect)tree.append(element('p','Chọn hướng build: Sát lực dồn sát thương; Cân bằng vừa công vừa thủ; Phòng thủ giữ tuyến. Mỗi nhánh mở độc lập theo nút trước cùng nhánh; có thể hoàn thiện một nhánh rồi học nhánh khác. Tuyệt kỹ học sau cùng được sử dụng. Hoàn điểm miễn phí để thử lại.','build-guide'));
    if (!hero.sect) tree.append(element('p', storyMode?'Bạn chưa nhập môn. Tìm hiểu năm viện và chọn phái trong chính truyện ở chương 2, hồi 10.':'Chọn môn phái để mở cây kỹ năng.'));
    if(hero.sect){const nav=element('nav',undefined,'build-tabs');nav.setAttribute('aria-label','Hướng võ công');for(const[id,label]of Object.entries({attack:'Sát lực',balanced:'Cân bằng',guard:'Phòng thủ'})){const button=element('button',label);button.type='button';button.dataset.buildBranch=id;button.dataset.uiIcon=({attack:'sword',balanced:'lotus',guard:'shield'})[id];button.setAttribute('aria-pressed',String(branchChoice===id));button.onclick=()=>{branchChoice=id;refresh();};nav.append(button);}tree.append(nav);}
    for (const node of (SKILL_TREES[hero.sect] ?? []).filter(n=>n.branch===branchChoice)) {
      const learned = hero.allocatedSkills.includes(node.id);
      let reason = '';
      try { allocateSkill(hero, node.id, inventory); } catch (error) { reason = error.message; }
      const card = element('article', undefined, 'skill-node'); card.dataset.learned = String(learned); card.dataset.branch=node.branch;
      card.append(element('p', `Tầng ${node.tier} · ${({attack:'Sát lực',balanced:'Cân bằng',guard:'Phòng thủ'})[node.branch]}`, 'eyebrow'));
      const im=element('img');im.className='skill-art7';im.src=new URL('../../'+node.icon,import.meta.url).href;im.alt=node.name;im.loading='lazy';card.append(im);card.append(element('h3', node.name)); card.append(element('p', node.description));
      card.append(element('p', statsText(node.stats)));
      card.append(element('p', `Cấp ${node.minLevel} · ${node.cost} điểm${node.prerequisites.length ? ' · Cần nút trước của cùng nhánh' : ''}`));
      const button = element('button', learned ? 'Đã học' : 'Học kỹ năng'); button.type = 'button'; button.dataset.skillId = node.id;
      button.addEventListener('click', change((h, items) => allocateSkill(h, node.id, items), `Đã học ${node.name}.`));
      controls.push({ node: button, disabled: Boolean(reason) }); card.append(button);
      if (reason && !learned) button.title = reason;
      tree.append(card);
    }
    const attributes = el('attribute-grid'); attributes.replaceChildren();
    if(hero.sect){const guide=element('section',undefined,'attribute-guide panel'),picker=element('select');picker.setAttribute('aria-label','Hướng cộng thuộc tính');for(const[id,label]of [['attack','Sát lực'],['balanced','Cân bằng'],['guard','Phòng thủ']]){const o=element('option',label);o.value=id;picker.append(o);}picker.value=attributePlan;picker.onchange=()=>{attributePlan=picker.value;refresh();};const keys=ATTRIBUTE_PLANS7[hero.sect][picker.value];guide.append(element('strong','Gợi ý sau nhập môn'),picker,element('p',ATTRIBUTE_REASONS7[hero.sect]),element('p','Ưu tiên: '+keys.map(k=>ATTRIBUTES[k]).join(' → ')+'. Mỗi 5 điểm có thể thử: 3 điểm '+ATTRIBUTES[keys[0]]+', 1 điểm '+ATTRIBUTES[keys[1]]+', 1 điểm '+ATTRIBUTES[keys[2]]+'. Bạn tự chọn điểm để cộng.'));attributes.append(guide);}
    const attributeHelp=Object.fromEntries(Object.entries(ATTRIBUTE_BONUSES).map(([key, stats])=>[key, statsText(stats)+(key==='thanPhap'?' · +3% nhịp đánh':'')+' mỗi điểm']));
    for (const [key, label] of Object.entries(ATTRIBUTES)) {
      const row = element('div', undefined, 'attribute-row'); const info=element('span', `${label}: ${hero.attributes[key]}`);info.append(element('small',attributeHelp[key],'attribute-help'));row.append(info);
      const button = element('button', '+1'); button.type = 'button'; button.dataset.attribute = key;
      button.setAttribute('aria-label', `Cộng 1 ${label}`);
      button.addEventListener('click', change((h, items) => allocateAttribute(h, key, items), `Đã cộng một điểm ${label}.`));
      controls.push({ node: button, disabled: !hero.sect || hero.freeAttributePoints < 1 }); row.append(button); attributes.append(row);
    }
    const gear = el('gear-slots'); gear.replaceChildren();
    for (const [slot, label] of Object.entries(GEAR_SLOTS)) {
      const row = element('label', label), select = element('select'); select.dataset.gearSlot = slot;
      const empty = element('option', 'Không trang bị'); empty.value = ''; select.append(empty);
      for (const item of EQUIPMENT.filter(item => item.slot === slot && (!item.sect || item.sect === hero.sect) && inventory.some(owned => owned.itemId === item.id && owned.quantity > 0))) {
        const option = element('option', `[${gearRarity(item).name}] ${item.name} · ${statsText(item.stats)}`); option.value = item.id; select.append(option);
      }
      select.value = hero.equippedGear[slot] ?? '';
      select.addEventListener('change', change((h, items) => equipItem(h, slot, select.value || null, items), 'Đã cập nhật trang bị.'));
      controls.push({ node: select, disabled: !hero.sect }); const worn=EQUIPMENT.find(item=>item.id===hero.equippedGear[slot]);if(worn)row.append(gearImage(worn));row.append(select); gear.append(row);
    }
    if (hero.sect) {
      const instance = new Hero(hero.sect, { profile: hero, inventory });
      el('progress-stats').textContent = '';
      el('progress-ultimate').textContent = `Tuyệt kỹ hiện tại: ${instance.skills.ultimate.name}`;
      el('progress-set').textContent = instance.activeEquipmentSets.length ? `Đủ bộ: ${instance.activeEquipmentSets.map(id => EQUIPMENT_SETS.find(set => set.id === id).name).join(', ')}` : 'Chưa đủ mốc bộ. Bộ mới có mốc 2, 3 và 4 món; bộ phái có mốc 3 và 4 món.';
      renderHeroReadout({hero:instance,build:hero,setsRoot:el('hero-set-details'),skillsRoot:el('hero-skill-details')});
    } else {
      el('progress-stats').textContent = 'Chưa chọn môn phái.'; el('progress-ultimate').textContent = ''; el('progress-set').textContent = '';
      for(const id of ['hero-set-details','hero-skill-details'])el(id).replaceChildren(element('p','Nhập môn để xem thông tin chiến đấu chi tiết.','hint'));
    }
    for (const [id, disabled] of [['btn-progress-sect', false], ['btn-progress-train', !allowTraining || !hero.sect || hero.level >= MAX_LEVEL],
      ['btn-progress-respec', !hero.allocatedSkills.length], ['btn-progress-reset-attributes', Object.values(hero.attributes).every(n => n === 0)], ['btn-progress-gear', !allowTraining || !hero.sect]]) controls.push({ node: el(id), disabled });
    locks();
  }
  bus.on(EVT.BATTLE_STATE_CHANGED, locks);
  refresh(); return { refresh };
}
