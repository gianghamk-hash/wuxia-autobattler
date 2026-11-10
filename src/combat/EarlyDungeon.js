/** Accessibility curve for all 100 dungeon/tower floors (zero-based). */
export const earlyDungeonFactor = floor =>
  floor < 10 ? 0.55 :
  floor < 20 ? 0.65 :
  floor < 30 ? 0.75 :
  floor < 60 ? 0.85 : 0.90;
