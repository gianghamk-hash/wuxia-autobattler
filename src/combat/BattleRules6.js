import { Companion } from "../entities/Companion.js";
export const ENEMY_CELLS = [
  { x: 3, y: 1 },
  { x: 5, y: 0 },
  { x: 4, y: 2 },
  { x: 3, y: 2 },
  { x: 4, y: 0 },
  { x: 5, y: 2 },
  { x: 3, y: 0 },
  { x: 5, y: 1 },
];
export const DIFFICULTY = { power: 2, hp: 1.6, attack: 1.25 };
export const BOSS_TITLES = [
  "Đội trưởng chặn hội",
  "Chủ khảo năm viện",
  "Trưởng đội khảo lực",
  "Giám khảo xuống núi",
  "Đầu lĩnh giữ kho",
  "Đội trưởng truy chứng",
  "Trấn bến Chương Dương",
  "Chủ trận kết nghĩa",
  "Quản vệ Vạn Lợi",
  "Chỉ huy khóa sông",
  "Trấn giữ đài hiệu",
  "Chủ trận giữ cờ",
  "Tiên phong Cao Lệ",
  "Chỉ huy truy kích",
  "Chủ trận giữ trại",
  "Trấn thủ đường lương",
  "Chỉ huy ba ngả",
  "Cao Lệ · Tổng soái",
  "Khảo trận bàn giao",
  "Trận cuối giữ lời",
];
export const TROOP_SKINS = [
  "troop_spear",
  "troop_saber",
  "troop_archer",
  "troop_medic",
  "troop_raider",
  "troop_duelist",
  "troop_heavy",
  "troop_shadow",
];
export function strengthenEnemy(
  unit,
  { chapter = 1, drill = false, index = 0 } = {},
) {
  unit.stats.maxHp = Math.round(unit.stats.maxHp * DIFFICULTY.hp);
  unit.stats.hp = unit.stats.maxHp;
  unit.stats.physicalAtk *= DIFFICULTY.attack;
  unit.stats.magicalAtk *= DIFFICULTY.attack;
  if (unit.characterId === "tay_sai" || !unit.characterId) {
    unit.characterId = drill
      ? "troop_duelist"
      : TROOP_SKINS[(chapter + index) % TROOP_SKINS.length];
  }
  if (TROOP_SKINS.includes(unit.characterId))
    unit.portrait = "assets/images/enemies/" + unit.characterId + ".webp";
  return unit;
}
export function bossSkin(chapter) {
  return chapter === 18
    ? "doc_le"
    : chapter <= 4 || chapter === 8 || chapter >= 19
      ? "boss_examiner"
      : chapter === 7 || chapter === 10
        ? "boss_river"
        : chapter >= 13
          ? "boss_marshal"
          : "boss_captain";
}
/** Each new phase is a new hostile squad; surviving heroes retain HP, energy and status effects. */
export function bossSequence(enemies, chapter) {
  const seeds = enemies.map((u) => ({
    template: u.templateId,
    stats: structuredClone(u.stats),
    skills: structuredClone(u.skills),
    passive: structuredClone(u.passive),
    name: u.name,
    characterId: u.characterId,
    canon: u.canon,
    storyActorId: u.storyActorId,
  }));
  const decorate = (u, phase, index) => {
    if (index === 0) {
      u.name =
        (phase < 3 ? `Mini boss ${phase} · ` : "Boss cuối · ") +
        BOSS_TITLES[chapter - 1];
      u.characterId =
        phase === 3
          ? bossSkin(chapter)
          : phase === 1
            ? "boss_captain"
            : "boss_river";
      u.stats.maxHp = Math.round(u.stats.maxHp * (phase === 3 ? 2 : 1.25));
      u.stats.hp = u.stats.maxHp;
      u.stats.physicalAtk *= phase === 3 ? 1.2 : 1.08;
      u.stats.magicalAtk *= phase === 3 ? 1.2 : 1.08;
    } else {
      u.name =
        (chapter <= 4 || chapter >= 19 ? "Bạn tập" : "Hộ vệ") +
        " " +
        (index + 1);
      u.characterId = TROOP_SKINS[(chapter + index) % TROOP_SKINS.length];
      u.storyActorId = "troop";
    }
    u.portrait =
      u.characterId === "doc_le"
        ? "assets/images/npcs/doc_le.webp"
        : "assets/images/enemies/" + u.characterId + ".webp";
    return u;
  };
  enemies.forEach((u, i) => decorate(u, 1, i));
  return (phase) =>
    Array.from(
      {
        length:
          phase === 3 ? Math.min(8, 6 + Math.floor((chapter - 1) / 8)) : 4,
      },
      (_, i) => {
        const s = seeds[i % seeds.length],
          u = new Companion(s.template, {
            id: `phase_${phase}_enemy_${i}`,
            team: "enemy",
            level: enemies[i % enemies.length].level,
          });
        Object.assign(u, {
          ...s,
          stats: structuredClone(s.stats),
          skills: structuredClone(s.skills),
          passive: structuredClone(s.passive),
        });
        return decorate(u, phase, i);
      },
    );
}
