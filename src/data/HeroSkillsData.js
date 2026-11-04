import { COMPANIONS_BY_ID } from './CompanionsData.js';
import { deepFreeze } from './DataUtils.js';

// Starter kits reuse the sect's existing companion mechanics. Sprint 6 adds skill trees.
const templates = { ThieuLam: 'companion_05', VoDang: 'companion_02', CaiBang: 'companion_01', NgaMi: 'companion_03', DuongMon: 'companion_04' };
export const HERO_SKILLS = deepFreeze(Object.fromEntries(Object.entries(templates).map(([sect, id]) => {
  const skills = structuredClone(COMPANIONS_BY_ID[id].skills);
  skills.autoAttack.id = `hero_${sect}_basic`; skills.ultimate.id = `hero_${sect}_ult`;
  return [sect, skills];
})));
