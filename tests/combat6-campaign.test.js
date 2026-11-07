import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { developed, fight } from "../scripts/balance-campaign6.mjs";
import { Companion } from "../src/entities/Companion.js";
import { Hero } from "../src/entities/Hero.js";
import { CombatEngine } from "../src/combat/CombatEngine.js";
import { GridSystem } from "../src/combat/GridSystem.js";
import {
  bossSequence,
  strengthenEnemy,
  ENEMY_CELLS,
  DIFFICULTY,
} from "../src/combat/BattleRules6.js";
import { DAI_VIET_QUESTS } from "../src/data/DaiVietStoryData.js";
import { DUNGEONS } from "../src/data/WorldData.js";
import { rollGacha } from "../src/core/Gacha.js";
import { drawEquipment } from "../src/core/Loot.js";
import { NEW_GEAR } from "../src/data/GearCatalog.js";
import { validateCampaign } from "../src/core/Campaign.js";

test("the 6.0 campaign has 265 fights, twenty chapter closers and concise safe sections with a complete optional source", () => {
  assert.equal(DAI_VIET_QUESTS.filter((q) => q.encounter).length, 265);
  for (let chapter = 1; chapter <= 20; chapter++)
    assert.equal(
      DAI_VIET_QUESTS.filter((q) => q.chapter === chapter && q.boss).length,
      1,
    );
  for (const q of DAI_VIET_QUESTS) {
    assert.ok(q.lines.length <= 2, q.id);
    assert.ok((q.aftermath?.length ?? 0) <= 2, q.id);
    assert.ok(q.fullLines.length >= q.lines.length, q.id);
    if (q.handoff)
      assert.ok(
        [...(q.aftermath ?? q.lines)].some((l) => l[1].includes(q.handoff)),
        q.id,
      );
  }
});
test("difficulty applies a reproducible twofold HP/attack budget and eight hostile cells fit without exceeding the home-party cap", () => {
  const u = new Companion("companion_05", { team: "enemy" }),
    before = structuredClone(u.stats);
  strengthenEnemy(u);
  assert.equal(u.stats.maxHp, Math.round(before.maxHp * 1.6));
  assert.equal(u.stats.physicalAtk, before.physicalAtk * 1.25);
  assert.equal(u.stats.magicalAtk, before.magicalAtk * 1.25);
  assert.equal(DIFFICULTY.hp * DIFFICULTY.attack, 2);
  const grid = new GridSystem(),
    h = new Hero("VoDang"),
    enemies = ENEMY_CELLS.map((p, i) => {
      const u = new Companion("companion_05", { id: "e" + i, team: "enemy" });
      grid.place(u, p, { formation: false });
      return u;
    });
  grid.place(h, { x: 1, y: 1 }, { formation: false });
  const b = new CombatEngine({ units: [h, ...enemies], grid, enemyLimit: 8 });
  assert.equal(b.start(), true);
  assert.equal(b.units.filter((u) => u.team === "enemy").length, 8);
  assert.throws(() => new CombatEngine({ units: [h, ...enemies], grid }));
});
test("boss waves are continuous: no free HP/energy reset, no early result, and a final eight-member squad", () => {
  const grid = new GridSystem(),
    h = new Hero("VoDang"),
    enemies = ENEMY_CELLS.slice(0, 4).map((p, i) => {
      const u = new Companion("companion_05", { id: "e" + i, team: "enemy" });
      grid.place(u, p, { formation: false });
      return u;
    });
  grid.place(h, { x: 1, y: 1 }, { formation: false });
  const nextBossWave = bossSequence(enemies, 18),
    b = new CombatEngine({
      units: [h, ...enemies],
      grid,
      enemyLimit: 8,
      nextBossWave,
    });
  b.start();
  h.stats.hp = 321;
  h.stats.energy = 37;
  for (let phase = 1; phase <= 3; phase++) {
    assert.equal(b.bossPhase, phase);
    const wave = b.units.filter((u) => u.team === "enemy" && u.alive);
    assert.equal(wave.length, phase < 3 ? 4 : 8);
    for (const u of wave) u.stats.hp = 0;
    b.grid.removeDead();
    b.checkResult();
    if (phase < 3) {
      assert.equal(b.state, "running");
      assert.equal(h.stats.hp, 321);
      assert.equal(h.stats.energy, 37);
      assert.equal(b.result, null);
    }
  }
  assert.equal(b.result.winner, "home");
  assert.equal(b.result.bossPhases, 3);
  assert.equal(b.events.filter((e) => e.type === "boss:wave").length, 2);
});
test("five-result bundles use reduced prices and ten-draw guarantees carry across two calls", () => {
  const s = developed().snapshot(),
    one = rollGacha(s, 5, { random: () => 0 }),
    two = rollGacha(one.session, 5, { random: () => 0 });
  assert.equal(one.price, 300);
  assert.equal(one.results.length, 5);
  assert.equal(two.results.at(-1).tier, 4);
  assert.throws(() => rollGacha(s, 10));
  const gear1 = drawEquipment(s, 5, { random: () => 0 }),
    gear2 = drawEquipment(gear1.session, 5, { random: () => 0 });
  assert.equal(gear1.price, 400);
  assert.equal(gear1.results.length, 5);
  assert.equal(
    NEW_GEAR.find((e) => e.id === gear2.results.at(-1).id).rarity,
    "excellent",
  );
  assert.throws(() => drawEquipment(s, 10));
});
test("all five towers retain 100 floors, deterministic reloads and correct rewards or losses under the stronger difficulty", () => {
  for (const def of DUNGEONS) {
    const c = developed();
    c.enterDungeon(def.id);
    assert.equal(c.session.adventure.dungeon.rooms.length, 100);
    for (const [i, room] of c.session.adventure.dungeon.rooms.entries())
      assert.ok(
        room.every((t) => t === ((i + 1) % 10 === 0 ? "boss" : "battle")),
      );
    const s = c.snapshot();
    s.adventure.dungeon.floor = 99;
    c.load(s);
    c.chooseRoom(0);
    const pending = c.snapshot(),
      b = c.battle;
    assert.equal(b.units.filter((u) => u.team === "enemy").length, 4);
    const copy = developed();
    copy.load(pending);
    copy.retryEncounter();
    assert.equal(copy.battle.seed, b.seed);
    assert.equal(b.enemyStatMultiplier,2);
    const r = fight(c), repeated=fight(copy);
    assert.equal(r.winner,repeated.winner,def.id);
    assert.deepEqual(r.rewards,repeated.rewards,def.id);
    if(r.winner!=="home"){assert.equal(r.rewards.xp,0);assert.ok(!c.session.adventure.clears.includes(def.id));validateCampaign(c.snapshot());continue;}
    assert.equal(r.bossPhases, 3);
    assert.equal(c.session.adventure.dungeon, null);
    assert.equal(c.session.adventure.towerBest[def.id], 100);
    assert.equal(r.rewards.gear.length, 1);
    assert.equal(
      NEW_GEAR.find((e) => e.id === r.rewards.gear[0]).rarity,
      "exceptional",
    );
    validateCampaign(c.snapshot());
  }
});
test("all twelve six-pose enemy atlases have recorded prompts and immutable hashes", () => {
  const rows = JSON.parse(
    readFileSync("assets/images/fighters/combat6-manifest.json"),
  );
  assert.equal(rows.length, 12);
  assert.equal(new Set(rows.map((r) => r.id)).size, 12);
  for (const r of rows) {
    assert.deepEqual(r.size, [1536, 1024]);
    assert.equal(
      createHash("sha256").update(readFileSync(r.asset)).digest("hex"),
      r.sha256,
    );
    assert.ok(r.prompt.length > 100);
    assert.equal(
      createHash("sha256").update(readFileSync(r.portrait)).digest("hex"),
      r.portraitSha256,
    );
  }
});

test("dungeon bosses never reveal campaign antagonists before their story meeting", () => {
  const c = developed();
  c.enterDungeon("phong_nha");
  const s = c.snapshot();
  s.adventure.dungeon.floor = 89;
  c.load(s);
  c.chooseRoom(0);
  const b = c.battle;
  for (let phase = 1; phase <= 3; phase++) {
    const enemies = b.units.filter((u) => u.team === "enemy" && u.alive);
    assert.ok(
      enemies.every(
        (u) =>
          !u.name.includes("Cao Lệ") &&
          !u.name.includes("Trịnh Nghiêm") &&
          !u.name.includes("Bạn tập"),
      ),
    );
    assert.ok(!enemies.some((u) => u.characterId === "doc_le"));
    for (const u of enemies) u.stats.hp = 0;
    b.grid.removeDead();
    b.checkResult();
  }
});
