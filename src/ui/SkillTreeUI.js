import { bus, EVT } from '../core/EventBus.js';
import { SECTS } from '../data/SectsData.js';
import { SKILL_TREES } from '../data/SkillTreeData.js';
import { EQUIPMENT, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import { Hero } from '../entities/Hero.js';
import { ATTRIBUTES, GEAR_SLOTS, MAX_LEVEL, normalizeHeroBuild, allocateSkill, allocateAttribute,
  equipItem, changeSect, resetSkills, resetAttributes, gainExperience, expToNextLevel, trialEquipment } from '../entities/HeroBuild.js';

function element(tag, text, className) {
  const node = document.createElement(tag); if (text !== undefined) node.textContent = text;
  if (className) node.className = className; return node;
}
const STAT_NAMES = { maxHp: 'HP', physicalAtk: 'Ngoại công', magicalAtk: 'Nội công', physicalDef: 'Ngoại phòng', magicalDef: 'Nội phòng', attackSpeed: 'Tốc đánh', critRate: 'Bạo kích', dodgeRate: 'Né tránh' };
const statsText = stats => Object.entries(stats).map(([key, value]) => `${STAT_NAMES[key] ?? key} +${value < 1 ? `${Math.round(value * 100)}%` : value}`).join(' · ');

export function mountSkillTreeUI({ getState, onChange, canEdit, allowTraining = true }) {
  const el = id => document.getElementById(id);
  const sect = el('progress-sect'), message = el('progress-message');
  const say = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
  for (const data of Object.values(SECTS)) { const option = element('option', data.name); option.value = data.id; sect.append(option); }
  el('btn-progress-train').hidden = el('btn-progress-gear').hidden = !allowTraining;
  let controls = [];
  function locks() { for (const { node, disabled } of controls) node.disabled = disabled || !canEdit(); sect.disabled = !canEdit(); }
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
    el('progress-summary').textContent = `Cấp ${hero.level}/${MAX_LEVEL} · XP ${hero.exp}/${hero.level === MAX_LEVEL ? 'Tối đa' : expToNextLevel(hero.level)} · Điểm kỹ năng ${hero.freeSkillPoints} · Điểm thuộc tính ${hero.freeAttributePoints}`;
    const tree = el('skill-tree'); tree.replaceChildren();
    if (!hero.sect) tree.append(element('p', 'Chọn môn phái để mở cây kỹ năng.'));
    for (const node of SKILL_TREES[hero.sect] ?? []) {
      const learned = hero.allocatedSkills.includes(node.id);
      let reason = '';
      try { allocateSkill(hero, node.id, inventory); } catch (error) { reason = error.message; }
      const card = element('article', undefined, 'skill-node'); card.dataset.learned = String(learned);
      card.append(element('p', `Tầng ${node.tier} · ${node.branch === 'attack' ? 'Công pháp' : 'Hộ thân'}`, 'eyebrow'));
      card.append(element('h3', node.name)); card.append(element('p', node.description));
      card.append(element('p', statsText(node.stats)));
      card.append(element('p', `Cấp ${node.minLevel} · ${node.cost} điểm${node.prerequisites.length ? ' · Cần nút trước của cùng nhánh' : ''}`));
      const button = element('button', learned ? 'Đã học' : 'Học kỹ năng'); button.type = 'button'; button.dataset.skillId = node.id;
      button.addEventListener('click', change((h, items) => allocateSkill(h, node.id, items), `Đã học ${node.name}.`));
      controls.push({ node: button, disabled: Boolean(reason) }); card.append(button);
      if (reason && !learned) button.title = reason;
      tree.append(card);
    }
    const attributes = el('attribute-grid'); attributes.replaceChildren();
    for (const [key, label] of Object.entries(ATTRIBUTES)) {
      const row = element('div', undefined, 'attribute-row'); row.append(element('span', `${label}: ${hero.attributes[key]}`));
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
        const option = element('option', `${item.name} · ${statsText(item.stats)}`); option.value = item.id; select.append(option);
      }
      select.value = hero.equippedGear[slot] ?? '';
      select.addEventListener('change', change((h, items) => equipItem(h, slot, select.value || null, items), 'Đã cập nhật trang bị.'));
      controls.push({ node: select, disabled: !hero.sect }); row.append(select); gear.append(row);
    }
    if (hero.sect) {
      const instance = new Hero(hero.sect, { profile: hero, inventory });
      el('progress-stats').textContent = `HP ${instance.stats.maxHp} · Ngoại công ${instance.stats.physicalAtk} · Nội công ${instance.stats.magicalAtk} · Ngoại phòng ${instance.stats.physicalDef} · Nội phòng ${instance.stats.magicalDef} · Bạo kích ${Math.round(Math.min(.75, instance.stats.critRate + hero.attributes.ngoTinh * .005) * 100)}%`;
      el('progress-ultimate').textContent = `Tuyệt kỹ hiện tại: ${instance.skills.ultimate.name}`;
      el('progress-set').textContent = instance.activeEquipmentSets.length ? `Đủ bộ: ${instance.activeEquipmentSets.map(id => EQUIPMENT_SETS.find(set => set.id === id).name).join(', ')}` : 'Chưa đủ bộ ba món.';
    } else {
      el('progress-stats').textContent = 'Chưa chọn môn phái.'; el('progress-ultimate').textContent = ''; el('progress-set').textContent = '';
    }
    for (const [id, disabled] of [['btn-progress-sect', false], ['btn-progress-train', !allowTraining || !hero.sect || hero.level >= MAX_LEVEL],
      ['btn-progress-respec', !hero.allocatedSkills.length], ['btn-progress-reset-attributes', Object.values(hero.attributes).every(n => n === 0)], ['btn-progress-gear', !allowTraining || !hero.sect]]) controls.push({ node: el(id), disabled });
    locks();
  }
  bus.on(EVT.BATTLE_STATE_CHANGED, locks);
  refresh(); return { refresh };
}
