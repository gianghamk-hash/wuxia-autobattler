import { Campaign, createCampaign } from "../src/core/Campaign.js";
import { DAI_VIET_QUESTS } from "../src/data/DaiVietStoryData.js";
import { PLOT_UNLOCKS } from "../src/data/DaiVietCast.js";
import { NEW_GEAR } from "../src/data/GearCatalog.js";
import {
  createHeroBuild,
  allocateAttribute,
  allocateSkill,
  equipItem,
} from "../src/entities/HeroBuild.js";
import { SKILL_TREES } from "../src/data/SkillTreeData.js";
import { DUNGEONS } from "../src/data/WorldData.js";
import { DIFFICULTY } from "../src/combat/BattleRules6.js";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
export function developed({
  sect = "VoDang",
  roster = [
    "companion_05",
    "companion_49",
    "companion_50",
    "companion_14",
    "companion_20",
  ],
} = {}) {
  const s = createCampaign({
      story: "dai-viet",
      sect,
      name: "Đội khảo trận",
    }),
    done = DAI_VIET_QUESTS.slice(0, -1),
    q = DAI_VIET_QUESTS.at(-1);
  s.storyProgress.completedQuests = done.map((q) => q.id);
  s.storyProgress.decisions = Object.fromEntries(
    done.map((q) => [
      q.id,
      q.id === "D19H18"
        ? "stay"
        : q.id === "D19H12"
          ? "friends"
          : (q.choices[0]?.id ?? "continue"),
    ]),
  );
  Object.assign(s.storyProgress, {
    activeQuestId: q.id,
    currentChapter: 20,
    currentEpisode: 20,
    currentAct: q.act,
  });
  s.inventory.find((i) => i.itemId === "silver").quantity = 100000;
  const gear = NEW_GEAR.filter(
    (e) =>
      e.setId ===
        (["VoDang", "NgaMi"].includes(sect)
          ? "thanh_tam"
          : "phong_hanh") && e.rarity === "exceptional",
  );
  s.inventory.push(...gear.map((e) => ({ itemId: e.id, quantity: 1 })));
  let h = createHeroBuild({ sect, level: 20, name: s.hero.name });
  while (h.freeAttributePoints)
    h = allocateAttribute(
      h,
      ["VoDang", "NgaMi"].includes(sect) ? "khiHai" : "kinhLuc",
      s.inventory,
    );
  for (const branch of ["attack", "guard", "balanced"])
    for (const n of SKILL_TREES[sect].filter((n) => n.branch === branch)) {
      try {
        h = allocateSkill(h, n.id, s.inventory);
      } catch {}
    }
  for (const e of gear) h = equipItem(h, e.slot, e.id, s.inventory);
  s.hero = h;
  s.party.active = [...roster];
  s.party.unlocked = [...s.party.active];
  for (const id of Object.keys(PLOT_UNLOCKS)) {
    if (!s.party.unlocked.includes(id)) s.party.unlocked.push(id);
    s.storyProgress.completedQuests.push("recruit_" + id.slice(-2));
  }
  s.party.formation = Object.fromEntries(
    ["hero", ...s.party.active].map((id, i) => [
      id,
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 0 },
      ][i],
    ]),
  );
  s.companionsAffinity = Object.fromEntries(
    s.party.unlocked.map((id) => [id, 100]),
  );
  s.adventure.training = 10;
  s.adventure.forging = 10;
  const c = new Campaign({ now: () => 1720000000000 });
  c.load(s);
  return c;
}
export function fight(c) {
  let asked = false;
  for (let i = 0; i < 22500 && c.running; i++) {
    const b = c.battle;
    if (
      !asked &&
      b.mission?.definition.type === "rescue" &&
      (b.elapsed >= 25 ||
        b.units.filter((u) => u.team === "enemy" && u.alive && !u.missionAsset)
          .length <= 2)
    ) {
      b.mission.requestRescue("hero");
      asked = true;
    }
    c.update(1 / 60);
  }
  if (c.running) throw Error("Battle did not finish");
  return c.lastResult;
}
export function measure() {
  const report = {
    version: "7.0",
    difficulty: DIFFICULTY,
    scope:
      "Deterministic developed level-20 party, exceptional gear, training/forging 10; not a random-player win-rate estimate.",
    storyFights: DAI_VIET_QUESTS.filter((q) => q.encounter).length,
    chapterBosses: [],
    towers: [],
  };
  const c = developed();
  c.chooseEnding("justice");
  for (let chapter = 1; chapter <= 20; chapter++) {
    c.startChapterBoss(chapter);
    const r = fight(c);
    report.chapterBosses.push({
      chapter,
      winner: r.winner,
      seconds: r.duration,
      phase: c.battle.bossPhase,
      survivors: c.battle.units.filter((u) => u.team === "home" && u.alive)
        .length,
    });
  }
  for (const def of DUNGEONS) {
    const c = developed();
    c.enterDungeon(def.id);
    const floors = [];
    while (c.session.adventure.dungeon) {
      const n = c.session.adventure.dungeon.floor + 1;
      c.chooseRoom(0);
      const r = fight(c);
      floors.push({
        floor: n,
        winner: r.winner,
        seconds: r.duration,
        phase: c.battle.bossPhase,
        survivors: c.battle.units.filter((u) => u.team === "home" && u.alive)
          .length,
        xp: r.rewards.xp,
        silver: r.rewards.silver,
        gear: r.rewards.gear ?? [],
      });
      if (r.winner !== "home") break;
    }
    report.towers.push({
      id: def.id,
      cleared: c.session.adventure.clears.includes(def.id),
      floors,
    });
  }
  return report;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const report = measure();
  writeFileSync(
    process.argv[2] ?? "reports/balance-campaign7.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      bosses: report.chapterBosses.filter((r) => r.winner === "home").length,
      towers: report.towers.map((t) => ({
        id: t.id,
        cleared: t.cleared,
        floors: t.floors.length,
      })),
    }),
  );
}
