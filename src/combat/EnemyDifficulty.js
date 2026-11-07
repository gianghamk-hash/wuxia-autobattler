/** Additional difficulty relative to the existing encounter, equipment and boss scaling. */
export function campaignEnemyMultiplier(chapter) {
  return Number.isInteger(chapter) && chapter >= 3 ? 2 : 1;
}

/** Battle instances only. Objectives and friendly units retain their authored stats. */
export function scaleEnemyStats(unit, multiplier = 1) {
  if (unit.team !== 'enemy' || unit.missionAsset) return unit;
  const previous = unit.enemyStatMultiplier ?? 1;
  if (previous === multiplier) return unit;
  const ratio = multiplier / previous;
  for (const [key, value] of Object.entries(unit.stats))
    if (Number.isFinite(value)) unit.stats[key] = value * ratio;
  unit.enemyStatMultiplier = multiplier;
  return unit;
}
