import { Unit } from './Unit.js';
import { HERO_SKILLS } from '../data/HeroSkillsData.js';
import { SECTS } from '../data/SectsData.js';
import { SKILLS_BY_ID } from '../data/SkillTreeData.js';
import { EQUIPMENT_BY_ID, EQUIPMENT_SETS } from '../data/EquipmentData.js';
import { createHeroBuild, normalizeHeroBuild, allocateSkill, allocateAttribute, equipItem } from './HeroBuild.js';
const ROLES = { ThieuLam: 'Tank', VoDang: 'SubTank', CaiBang: 'Bruiser', NgaMi: 'Healer', DuongMon: 'RangedDPS' };
const UNTRAINED={baseStats:{...SECTS.ThieuLam.baseStats,maxHp:1450,hp:1450,physicalAtk:75,magicalAtk:20,physicalDef:55,magicalDef:40,attackSpeed:.85,blockRate:0,attackRange:1},growthPerLevel:SECTS.ThieuLam.growthPerLevel};
const BASIC_SKILLS={autoAttack:{id:'untrained_attack',icon:'assets/images/skills7/untrained_attack.webp',description:'Quyền cơ bản gây 100% ngoại công lên địch gần nhất; chưa có võ học môn phái.',name:'Quyền Cơ Bản',type:'physical',targetType:'nearest_enemy',dmgMultiplier:1,energyGain:15,effects:[]},ultimate:{id:'untrained_guard',icon:'assets/images/skills7/untrained_guard.webp',description:'Chưa nhập môn nên chưa sử dụng tuyệt kỹ. Chọn môn phái tại chương 2 hồi 10 để mở võ học.',name:'Chưa học tuyệt kỹ',type:'physical',targetType:'self',dmgMultiplier:0,energyCost:10000,effects:[]}};
export class Hero extends Unit {
  constructor(sectId, { name = 'Tiểu Hiệp', profile, inventory = [], ...options } = {}) {
    if (sectId!==null&&!Object.hasOwn(SECTS, sectId)) throw new Error('Môn phái chưa được hỗ trợ.');
    const build = normalizeHeroBuild(profile ?? createHeroBuild({ sect: sectId, name, level: options.level ?? 1 }), inventory);
    if (build.sect !== sectId) throw new Error('Hồ sơ không khớp môn phái chiến đấu.');
    const sect = sectId===null?UNTRAINED:SECTS[sectId];
    super({ id: 'hero', name: build.name, sect: sectId, role: ROLES[sectId]??'Bruiser', baseStats: sect.baseStats,
      growthPerLevel: sect.growthPerLevel }, { ...options, id: options.id ?? 'hero', level: build.level });
    this.passive = structuredClone(sect.passive??null); this.skills = structuredClone(sectId===null?BASIC_SKILLS:HERO_SKILLS[sectId]);
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
    for (const set of EQUIPMENT_SETS) if (items.filter(item => item.setId === (set.setId??set.id)).length >= set.requiredPieces) {
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
