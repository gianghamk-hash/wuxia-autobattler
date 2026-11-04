import { Unit } from './Unit.js';
import { SECTS } from '../data/SectsData.js';
const ROLES = { ThieuLam: 'Tank', VoDang: 'SubTank', CaiBang: 'Bruiser', NgaMi: 'Healer', DuongMon: 'RangedDPS' };
export class Hero extends Unit {
  constructor(sectId, { name = 'Tiểu Hiệp', ...options } = {}) {
    if (!Object.hasOwn(SECTS, sectId)) throw new Error('Nhân vật chính cần chọn một trong năm môn phái.');
    const sect = SECTS[sectId];
    super({ id: 'hero', name, sect: sectId, role: ROLES[sectId], baseStats: sect.baseStats,
      growthPerLevel: sect.growthPerLevel }, { id: 'hero', ...options });
    this.passive = structuredClone(sect.passive);
    // Skill tree allocation and active hero skills are implemented in Sprint 6.
    this.allocatedSkills = [];
  }
}
