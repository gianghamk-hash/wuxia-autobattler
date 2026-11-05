import { Unit } from './Unit.js';
import { HERO_SKILLS } from '../data/HeroSkillsData.js';
import { SECTS } from '../data/SectsData.js';
import { SKILLS_BY_ID } from '../data/SkillTreeData.js';
import { EQUIPMENT_BY_ID, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import { createHeroBuild, normalizeHeroBuild, allocateSkill, allocateAttribute, equipItem } from './HeroBuild.js';
const ROLES = { ThieuLam: 'Tank', VoDang: 'SubTank', CaiBang: 'Bruiser', NgaMi: 'Healer', DuongMon: 'RangedDPS' };
export class Hero extends Unit {
  constructor(sectId, { name = 'Tiểu Hiệp', profile, inventory = [], ...options } = {}) {
    if (!Object.hasOwn(SECTS, sectId)) throw new Error('Nhân vật chính cần chọn một trong năm môn phái.');
    const build = normalizeHeroBuild(profile ?? createHeroBuild({ sect: sectId, name, level: options.level ?? 1 }), inventory);
    if (build.sect !== sectId) throw new Error('Hồ sơ không khớp môn phái chiến đấu.');
    const sect = SECTS[sectId];
    super({ id: 'hero', name: build.name, sect: sectId, role: ROLES[sectId], baseStats: sect.baseStats,
      growthPerLevel: sect.growthPerLevel }, { ...options, id: options.id ?? 'hero', level: build.level });
    this.passive = structuredClone(sect.passive); this.skills = structuredClone(HERO_SKILLS[sectId]);
    this.profile = build; this.inventory = structuredClone(inventory);
    this.attributes = structuredClone(build.attributes); this.allocatedSkills = [...build.allocatedSkills];
    this.equippedGear = structuredClone(build.equippedGear); this.activeEquipmentSets = [];
    const add = bonuses => { for (const [key, amount] of Object.entries(bonuses)) this.stats[key] += amount; };
    const a = this.attributes;
    add({ maxHp: a.canCot * 25, magicalAtk: a.khiHai * 4, magicalDef: a.khiHai,
      physicalAtk: a.kinhLuc * 4, dodgeRate: a.thanPhap * .002, critRate: a.coDuyen * .002 });
    for (const id of this.allocatedSkills) {
      const node = SKILLS_BY_ID[id]; add(node.stats);
      if (node.ultimate) this.skills.ultimate = structuredClone(node.ultimate);
    }
    const items = Object.values(this.equippedGear).filter(Boolean).map(id => EQUIPMENT_BY_ID[id]);
    items.forEach(item => add(item.stats));
    for (const set of EQUIPMENT_SETS) if (items.filter(item => item.setId === set.id).length >= set.requiredPieces) {
      add(set.stats); this.activeEquipmentSets.push(set.id);
    }
    this.stats.hp = this.stats.maxHp;
  }
  getBuild() { return structuredClone(this.profile); }
  _replaceBuild(next) {
    if (this.inCombat) throw new Error('Không thể đổi kỹ năng hoặc trang bị trong trận.');
    const replacement = new Hero(this.sect, { profile: next, inventory: this.inventory, id: this.id, team: this.team });
    // Recompute from base stats, never add bonuses repeatedly to an existing instance.
    for (const key of ['stats', 'skills', 'profile', 'attributes', 'allocatedSkills', 'equippedGear', 'activeEquipmentSets']) this[key] = replacement[key];
    return this.getBuild();
  }
  learnSkill(id) { return this._replaceBuild(allocateSkill(this.profile, id, this.inventory)); }
  allocateAttribute(key) { return this._replaceBuild(allocateAttribute(this.profile, key, this.inventory)); }
  equip(slot, id) { return this._replaceBuild(equipItem(this.profile, slot, id, this.inventory)); }
}
