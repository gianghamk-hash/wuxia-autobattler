/** Accessibility curve for all 100 dungeon/tower floors (zero-based). */
export const earlyDungeonFactor = floor =>
  floor < 10 ? 0.57 :
  floor < 20 ? 0.68 :
  floor < 30 ? 0.78 :
  floor < 60 ? 0.88 : 0.93;
