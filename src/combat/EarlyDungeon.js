/** A small HP/attack reduction for the first twenty dungeon floors (zero-based). */
export const earlyDungeonFactor = floor => floor < 10 ? 0.85 : floor < 20 ? 0.9 : 1;
