import { scalePromotedSkill } from '../data/ProgressionBalance.js';
import { Unit } from './Unit.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
export class Companion extends Unit {
  constructor(companionId, options = {}) {
    if (!Object.hasOwn(COMPANIONS_BY_ID, companionId)) throw new Error('Đồng đội không tồn tại.');
    const definition = COMPANIONS_BY_ID[companionId];
    super(definition, options);
    this.element=definition.element;this.portrait=definition.portrait;this.tier=options.rank ?? definition.tier;
    if (!Number.isInteger(this.tier) || this.tier < definition.tier || this.tier > 6) throw Error('Bậc đồng hành không hợp lệ.');
    const steps=this.tier-definition.tier, divine=this.tier===6;
    const boost=(1+steps*.22)*(divine?1.4:1), skillBoost=(1+steps*.1)*(divine?1.3:1);
    for(const key of ['maxHp','physicalAtk','magicalAtk','physicalDef','magicalDef'])this.stats[key]*=boost;
    this.stats.hp=this.stats.maxHp;this.promotionSkillBoost=skillBoost;
    for(const skill of Object.values(this.skills))scalePromotedSkill(skill,skillBoost);
    this.biography=definition.biography;this.legacyName=definition.legacyName;
    this.recruitment = structuredClone(definition.recruitment);
  }
}
