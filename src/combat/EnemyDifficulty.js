/**
 * Story/campaign accessibility pass.
 * Encounter templates and skills remain untouched. Difficulty is applied to
 * battle-local enemy instances, never the player's owned companions or saves.
 *
 * Before this pass chapter 3+ multiplied EVERY enemy stat by 2, on top of
 * strengthenEnemy() and boss-wave multipliers.
 */
const CHAPTER_CURVE = Object.freeze([
  {end:2, power:0.78},
  {end:6, power:0.93},
  {end:10,power:1.02},
  {end:14,power:1.11},
  {end:17,power:1.18},
  {end:20,power:1.25}
]);
export function campaignEnemyMultiplier(chapter) {
  if(!Number.isInteger(chapter)||chapter<1)return 1;
  return CHAPTER_CURVE.find(t=>chapter<=t.end)?.power??1.25;
}

/**
 * Apply *only* to hostile damage-survival statistics. In particular, NEVER
 * multiply maxEnergy, skill costs, attackRange, movement speed or crit chance:
 * values below one could otherwise prevent enemy ultimates from ever firing.
 */
const SCALABLE_STATS = Object.freeze([
  'maxHp','hp','physicalAtk','magicalAtk','physicalDef','magicalDef'
]);
export function scaleEnemyStats(unit,multiplier=1) {
  if(!unit||unit.team!=='enemy'||unit.missionAsset)return unit;
  if(!Number.isFinite(multiplier)||multiplier<=0)throw new RangeError('Hệ số sức mạnh địch không hợp lệ');
  const previous=unit.enemyStatMultiplier??1;
  if(previous===multiplier)return unit;
  const ratio=multiplier/previous;
  for(const key of SCALABLE_STATS){
    if(Number.isFinite(unit.stats?.[key]))unit.stats[key]*=ratio;
  }
  unit.enemyStatMultiplier=multiplier;
  return unit;
}

/** Moderate challenge after the accessibility pass. Keep chapter 1-2 unchanged;
 * side activities remain gentler than story fights at the same progression.
 * All values are battle-local and never change player-owned stat data.
 */
export function modeEnemyMultiplier(mode,chapter) {
  const base=campaignEnemyMultiplier(chapter);
  switch(mode){
    case 'practice':return Math.min(.79,Number((base*.94).toFixed(4)));
    case 'arena':return Math.min(.80,Number((base*.94).toFixed(4)));
    case 'escort':return Math.min(.78,Number((base*.92).toFixed(4)));
    case 'dungeon':return Number((base*.85).toFixed(4));
    case 'chapterBoss':return Number((base*.89).toFixed(4));
    case 'main':return base;
    default:return base;
  }
}
