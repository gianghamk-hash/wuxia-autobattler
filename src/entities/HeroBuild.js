import { SECTS } from '../data/SectsData.js';
import { SKILLS_BY_ID } from '../data/SkillTreeData.js';
import { EQUIPMENT, EQUIPMENT_BY_ID } from '../data/EquipmentData.js';
export const MAX_LEVEL = 20;
export const ATTRIBUTES = Object.freeze({ canCot: 'Căn Cốt', khiHai: 'Khí Hải', kinhLuc: 'Kình Lực', ngoTinh: 'Ngộ Tính', thanPhap: 'Thân Pháp', coDuyen: 'Cơ Duyên' });
export const GEAR_SLOTS = Object.freeze({ weapon: 'Vũ khí', armor: 'Áo giáp', accessory: 'Phụ kiện' });
const owns = (inventory, id) => inventory.some(item => item.itemId === id && Number.isSafeInteger(item.quantity) && item.quantity > 0);
const integer = value => Number.isSafeInteger(value) && value >= 0;
const error = text => { throw new Error(text); };
export const expToNextLevel = level => Math.round(level * 100 * (1 + Math.max(0,level-7)*.08));
export function createHeroBuild({ name = 'Tiểu Hiệp', sect = null, level = 1 } = {}) {
  return { buildVersion: 1, name, sect, level, exp: 0, freeAttributePoints: (level - 1) * 2,
    freeSkillPoints: level, attributes: Object.fromEntries(Object.keys(ATTRIBUTES).map(key => [key, 0])),
    allocatedSkills: [], equippedGear: { weapon: null, armor: null, accessory: null } };
}
/** Validate before constructing battle stats or committing any profile mutation. */
export function normalizeHeroBuild(input, inventory = []) {
  const plain = value => value && Object.getPrototypeOf(value) === Object.prototype;
  if (!plain(input) || (input.attributes !== undefined && !plain(input.attributes)) || (input.equippedGear !== undefined && !plain(input.equippedGear)) || !Array.isArray(inventory)) error('Cấu trúc hồ sơ hoặc túi đồ không hợp lệ.');
  if (!input || (input.buildVersion !== undefined && input.buildVersion !== 1)) error('Phiên bản hồ sơ chưa được hỗ trợ.');
  const next = { ...createHeroBuild(), ...structuredClone(input),
    attributes: { ...createHeroBuild().attributes, ...input.attributes },
    equippedGear: { ...createHeroBuild().equippedGear, ...input.equippedGear } };
  if (typeof next.name !== 'string' || !next.name.trim() || next.name.length > 80 ||
      !(next.sect === null || Object.hasOwn(SECTS, next.sect)) || !integer(next.level) || next.level < 1 || next.level > MAX_LEVEL ||
      !integer(next.exp) || (next.level < MAX_LEVEL ? next.exp >= expToNextLevel(next.level) : next.exp !== 0)) error('Cấp độ, kinh nghiệm hoặc môn phái không hợp lệ.');
  if (Object.keys(next.attributes).some(key => !Object.hasOwn(ATTRIBUTES, key)) || !Object.values(next.attributes).every(integer)) error('Thuộc tính không hợp lệ.');
  const spentAttributes = Object.values(next.attributes).reduce((sum, value) => sum + value, 0);
  const freeAttributes = (next.level - 1) * 2 - spentAttributes;
  if (freeAttributes < 0) error('Điểm thuộc tính vượt số điểm đã nhận.');
  if (!Array.isArray(next.allocatedSkills) || new Set(next.allocatedSkills).size !== next.allocatedSkills.length) error('Danh sách kỹ năng bị trùng hoặc không hợp lệ.');
  let spentSkills = 0; const groups = new Set();
  for (const id of next.allocatedSkills) {
    const node = Object.hasOwn(SKILLS_BY_ID, id) && SKILLS_BY_ID[id];
    if (!node || node.sect !== next.sect || node.minLevel > next.level || !node.prerequisites.every(id => next.allocatedSkills.includes(id))) error('Kỹ năng không đúng phái, tầng hoặc điều kiện mở khóa.');
    if (node.exclusiveGroup && groups.has(node.exclusiveGroup)) error('Chỉ chọn một tuyệt kỹ tầng 4.');
    if (node.exclusiveGroup) groups.add(node.exclusiveGroup);
    spentSkills += node.cost;
  }
  const freeSkills = next.level - spentSkills;
  if (freeSkills < 0) error('Không đủ điểm kỹ năng.');
  if (input.buildVersion === 1 && (next.freeAttributePoints !== freeAttributes || next.freeSkillPoints !== freeSkills)) error('Số điểm còn lại không khớp với hồ sơ.');
  for (const [slot, id] of Object.entries(next.equippedGear)) {
    if (!Object.hasOwn(GEAR_SLOTS, slot)) error('Ô trang bị không hợp lệ.');
    if (id === null) continue;
    const item = Object.hasOwn(EQUIPMENT_BY_ID, id) && EQUIPMENT_BY_ID[id];
    if (!item || item.slot !== slot || (item.sect && item.sect !== next.sect) || !owns(inventory, id)) error('Trang bị chưa sở hữu, sai ô hoặc khác môn phái.');
  }
  next.buildVersion = 1; next.freeAttributePoints = freeAttributes; next.freeSkillPoints = freeSkills;
  return next;
}
function finish(next, inventory) {
  // Recompute point balances after an authorized mutation; then enforce every invariant.
  delete next.buildVersion;
  return normalizeHeroBuild(next, inventory);
}
export function allocateSkill(profile, id, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (next.allocatedSkills.includes(id)) error('Kỹ năng này đã học.');
  next.allocatedSkills.push(id); return finish(next, inventory);
}
export function allocateAttribute(profile, key, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (!Object.hasOwn(ATTRIBUTES, key)) error('Thuộc tính không tồn tại.');
  next.attributes[key]++; return finish(next, inventory);
}
export function equipItem(profile, slot, id, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (!Object.hasOwn(GEAR_SLOTS, slot)) error('Ô trang bị không tồn tại.');
  next.equippedGear[slot] = id; return finish(next, inventory);
}
export function changeSect(profile, sect, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (!Object.hasOwn(SECTS, sect)) error('Hãy chọn một trong năm môn phái.');
  if (sect !== next.sect) {
    next.sect = sect; next.allocatedSkills = [];
    for (const [slot, id] of Object.entries(next.equippedGear)) if (id && EQUIPMENT_BY_ID[id].sect) next.equippedGear[slot] = null;
  }
  return finish(next, inventory);
}
export function resetSkills(profile, inventory) {
  const next = normalizeHeroBuild(profile, inventory); next.allocatedSkills = []; return finish(next, inventory);
}
export function gainExperience(profile, amount, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (!integer(amount) || amount > 1000000) error('Kinh nghiệm không hợp lệ.');
  next.exp += amount;
  while (next.level < MAX_LEVEL && next.exp >= expToNextLevel(next.level)) { next.exp -= expToNextLevel(next.level); next.level++; }
  if (next.level === MAX_LEVEL) next.exp = 0;
  return finish(next, inventory);
}
export function trialEquipment(profile, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  if (!next.sect) error('Hãy chọn môn phái trước.');
  const items = structuredClone(inventory);
  for (const item of EQUIPMENT.filter(item => item.sect === next.sect)) if (!owns(items, item.id)) items.push({ itemId: item.id, quantity: 1 });
  return items;
}
export function resetAttributes(profile, inventory) {
  const next = normalizeHeroBuild(profile, inventory);
  next.attributes = createHeroBuild().attributes; return finish(next, inventory);
}
