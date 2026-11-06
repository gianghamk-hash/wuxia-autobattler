import { portrait, decorateRarity } from './Visuals.js';
import { SECTS, SECT_IDS, getSectName } from '../data/SectsData.js';
import { COMPANIONS, ROLE_LABELS } from '../data/CompanionsData.js';
import { SYNERGIES, getActiveSynergies } from '../data/SynergiesData.js';
import { EQUIPMENT, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import {storyPerson,isDaiViet} from '../data/DaiVietCast.js';
import {storyRecruit7,acquisitionText7} from '../data/Recruitment7.js';
import {gearImage} from './GearArt.js';
import {gearRarity} from '../data/GearCatalog.js';

const STAT_LABELS = {
  maxHp: 'Sinh lực',
  physicalAtk: 'Ngoại công',
  magicalAtk: 'Nội công',
  physicalDef: 'Ngoại phòng',
  magicalDef: 'Nội phòng',
  attackSpeed: 'Tốc đánh',
  attackRange: 'Tầm đánh',critRate:'Bạo kích',critDmg:'Bạo thương',dodgeRate:'Né tránh',blockRate:'Đỡ đòn',maxEnergy:'Nộ tối đa'
};
const SLOT_LABELS = {
  weapon: 'Vũ khí',
  armor: 'Áo giáp',
  accessory: 'Ngọc bội',helmet:'Mũ'
};
const fold = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi');
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function statsText(stats) {
  return Object.entries(stats)
    .filter(([key]) => STAT_LABELS[key])
    .map(([key, value]) => `${STAT_LABELS[key]} ${key.endsWith('Rate')?Number((value*100).toFixed(2))+'%':value}`)
    .join(' · ');
}
function line(card, label, text) {
  card.append(element('p', `${label}: ${text}`));
}
function skillImage7(skill){const img=element('img');img.className='skill-art7';img.alt=skill.name;img.src=new URL('../../'+skill.icon,import.meta.url).href;img.loading='lazy';return img;}

export function mountCodexUI({getState=()=>null}={}) {
  const view = document.getElementById('catalog-view');
  const filter = document.getElementById('catalog-sect');
  const search = document.getElementById('catalog-search');
  const results = document.getElementById('catalog-results');
  const count = document.getElementById('catalog-count');
  for (const id of [...SECT_IDS, 'TuDo']) {
    const option = element('option', getSectName(id));
    option.value = id;
    filter.append(option);
  }
  function render() {
    const companions=COMPANIONS.map(p=>storyPerson(getState(),p));
    const source =
      {
        companions,
        sects: Object.values(SECTS),
        synergies: SYNERGIES,
        equipment: EQUIPMENT
      }[view.value] ?? companions;
    const query = fold(search.value.trim());
    const entries = source.filter((item) => {
      const matchesSect =
        !filter.value ||
        item.sect === filter.value ||
        item.id === filter.value ||
        item.requiredSects?.includes(filter.value);
      // Search human-readable names, recruitment and skill descriptions, including without accents.
      const text = [
        item.name,
        getSectName(item.sect),
        ROLE_LABELS[item.role],
        item.role,
        item.recruitment?.description,
        item.recruitment?acquisitionText7(item.id):null,
        item.skills?.ultimate.name,
        item.skills?.ultimate.description,
        item.description,
        item.passive?.description,
        item.passive?.name
      ]
        .filter(Boolean)
        .join(' ');
      return matchesSect && fold(text).includes(query);
    });
    count.textContent = `${entries.length} / ${source.length} mục`;
    results.replaceChildren();
    if (!entries.length) {
      results.append(
        element('p', 'Không có kết quả phù hợp. Thử đổi môn phái hoặc từ khóa.')
      );
      return;
    }
    for (const item of entries) {
      const card = element('article', undefined, 'codex-card');
      if (view.value === 'companions' || view.value === 'sects')
        card.append(portrait(view.value === 'companions' ? item : item.id));
      if (view.value === 'companions') {
        decorateRarity(card, item);
        line(card, 'Phẩm bậc', `Bậc ${item.tier}`);
      }
      card.append(element('h3', item.name));
      if (view.value === 'sects') {
        line(card, 'Vai trò', item.role);
        line(card, 'Ưu tiên', item.preferredAttributes);
        line(card, item.passive.name, item.passive.description);
        line(card, 'Chỉ số cấp 1', statsText(item.baseStats));
        line(card, 'Mỗi cấp', statsText(item.growthPerLevel));
      } else if (view.value === 'synergies') {
        line(card, 'Cần đủ', item.requiredSects.map(getSectName).join(' + '));
        card.append(element('p', item.description));
      } else if (view.value === 'equipment') {
        card.append(gearImage(item));
        line(
          card,
          'Loại',
          `${SLOT_LABELS[item.slot]} · ${gearRarity(item).name} · Bậc ${item.tier}`
        );
        line(
          card,
          'Môn phái',
          item.sect ? getSectName(item.sect) : 'Dùng chung'
        );
        line(card, 'Cộng chỉ số', statsText(item.stats));
        for (const set of EQUIPMENT_SETS.filter(set=>(set.setId??set.id)===item.setId))
          line(
            card,
            set.name,
            `${set.requiredPieces} món: ${statsText(set.stats)}`
          );
      } else {
        line(
          card,
          'Môn phái / Vai trò',
          `${getSectName(item.sect)} · ${ROLE_LABELS[item.role]}`
        );
        line(card, 'Tiểu sử', item.biography);
        line(card, 'Chiêu mộ', isDaiViet(getState())?acquisitionText7(item.id):storyRecruit7(item.id)?'Nhiệm vụ đồng hành · '+item.recruitment.description:'Chỉ có tại Chiêu hiền quán');
        card.append(skillImage7(item.skills.ultimate));
        line(card, item.skills.ultimate.name, item.skills.ultimate.description);
        const details = element('details');
        details.append(element('summary', 'Chỉ số và đánh thường'));
        details.append(element('p', 'Chỉ số cấp 1: '+statsText(item.baseStats)),skillImage7(item.skills.autoAttack));
        details.append(
          element(
            'p',
            item.skills.autoAttack.name+': '+item.skills.autoAttack.description
          )
        );
        details.append(
          element(
            'p',
            `Tuyệt kỹ cần ${item.skills.ultimate.energyCost} nộ. Chỉ số tăng theo cấp của nhân vật chính; xem hồ sơ để đọc chỉ số ở cấp hiện tại.`
          )
        );
        card.append(details);
      }
      results.append(card);
    }
  }
  view.addEventListener('change', render);
  filter.addEventListener('change', render);
  search.addEventListener('input', render);
  render();

  const positions = ['preview-hero', 'preview-ally-1', 'preview-ally-2'].map(
    (id) => document.getElementById(id)
  );
  const preview = document.getElementById('synergy-preview');
  for (const select of positions) {
    for (const id of [...SECT_IDS, 'TuDo']) {
      const option = element('option', getSectName(id));
      option.value = id;
      select.append(option);
    }
  }
  function renderPreview() {
    const active = getActiveSynergies(
      positions.map((select) => select.value).filter(Boolean)
    );
    preview.replaceChildren();
    if (!active.length) {
      preview.append(
        element(
          'p',
          'Chưa có kích duyên. Chọn các môn phái khác nhau để thử phối hợp.'
        )
      );
      return;
    }
    for (const synergy of active) {
      const entry = element('p');
      entry.append(
        element('strong', synergy.name),
        document.createTextNode(` — ${synergy.description}`)
      );
      preview.append(entry);
    }
  }
  positions.forEach((select) =>
    select.addEventListener('change', renderPreview)
  );
  renderPreview();
  return {render};
}
