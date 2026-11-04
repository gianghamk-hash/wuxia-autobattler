import { Unit } from './Unit.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
export class Companion extends Unit {
  constructor(companionId, options = {}) {
    if (!Object.hasOwn(COMPANIONS_BY_ID, companionId)) throw new Error('Đồng đội không tồn tại.');
    const definition = COMPANIONS_BY_ID[companionId];
    super(definition, options);
    this.recruitment = structuredClone(definition.recruitment);
  }
}
