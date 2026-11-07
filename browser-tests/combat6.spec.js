import { test, expect } from "./fixtures.js";
import { developed } from "../scripts/balance-campaign6.mjs";
async function ready(page, view = "dungeons") {
  await page.goto("/");
  await expect(page.locator("#boot-status")).toBeHidden();
  await page.locator("#hero-name").fill("Đội khảo trận");
  await page.locator("#btn-new-game").click();
  await page.evaluate(
    ({ s, view }) => {
      const a = window.__game;
      a.engine.stop();
      a.model.load(s);
      a.hasLoaded = true;
      a.renderPlayer();
      a.setView(view);
    },
    { s: developed().snapshot(), view },
  );
}
test("boss phase HUD follows three continuous squads and settles one reward on mobile", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await page.evaluate(() => {
    const a = window.__game;
    // Isolate phase continuity from the newly unlocked healing passives.
    const snapshot=a.model.snapshot();
    for(const id of snapshot.party.active)snapshot.companionsAffinity[id]=15;
    a.model.load(snapshot);
    a.model.startChapterBoss(18);
    a.enterBattle();document.querySelector('#prebattle-dialog [data-start-battle]')?.click();
    a.engine.stop();
    a.model.battle.units[0].stats.hp = 777;
  });
  await expect(page.locator("#boss-phase-hud")).toBeVisible();
  for (const phase of [2, 3]) {
    await page.evaluate(() => {
      const a = window.__game,
        b = a.model.battle;
      for (const u of b.units.filter((u) => u.team === "enemy" && u.alive))
        u.stats.hp = 0;
      b.grid.removeDead();
      a.model.update(1 / 60);
    });
    await expect(
      page.locator('#boss-phase-hud [data-phase="' + phase + '"]'),
    ).toHaveAttribute("data-active", "true");
    expect(
      await page.evaluate(() => window.__game.model.battle.units[0].stats.hp),
    ).toBe(777);
    await expect(page.locator("#battle-result-panel")).toBeHidden();
  }
  expect(
    await page.evaluate(
      () =>
        window.__game.model.battle.units.filter(
          (u) => u.team === "enemy" && u.alive,
        ).length,
    ),
  ).toBe(8);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(async () => {
    const r = window.__game.renderer;
    r.render();
    await Promise.all(
      [
        ...r.fighters.values(),
        ...r.companionImages.values(),
        r.environment,
      ].map((im) => im.decode().catch(() => {})),
    );
    r.render();
  });
  await page
    .locator("#game-canvas")
    .screenshot({ path: info.outputPath("eight-enemies-board.png") });
  await page.screenshot({
    path: info.outputPath("eight-enemies-boss3.png"),
    animations: "disabled",
  });
  await page.evaluate(() => {
    const a = window.__game;
    for (const u of a.model.battle.units.filter(
      (u) => u.team === "enemy" && u.alive,
    ))
      u.stats.hp = 0;
    a.model.update(1 / 60);
  });
  await expect(page.locator("#battle-result-panel")).toBeVisible();
  expect(
    await page.evaluate(() => window.__game.model.session.loot.bossWins[18]),
  ).toBe(1);
  expect(
    await page.evaluate(() => window.__game.model.lastResult.bossPhases),
  ).toBe(3);
});
test("tower victory starts the next floor automatically and returns to Bi canh", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await ready(page);
  await page.evaluate(() => {
    const a = window.__game;
    a.model.enterDungeon("phong_nha");
    a.model.chooseRoom(0);
    a.enterBattle();document.querySelector('#prebattle-dialog [data-start-battle]')?.click();
    a.engine.stop();
    for (let i = 0; i < 22500 && a.model.running; i++) a.model.update(1 / 60);
  });
  await expect(page.locator("#btn-battle-camp")).toContainText("Bí cảnh");
  await expect
    .poll(() =>
      page.evaluate(() => ({
        floor: window.__game.model.session.adventure.dungeon?.floor,
        running: window.__game.model.running,
        view: window.__game.view,
      })),
    )
    .toEqual({ floor: 1, running: true, view: "battle" });
  expect(
    await page.evaluate(
      () => window.__game.model.session.adventure.daily.entries.phong_nha,
    ),
  ).toBe(1);
  await page.evaluate(() => {
    window.__game.engine.stop();
    window.__game.model.retreat();
  });
  await page.locator("#btn-battle-camp").click();
  await expect(page.locator("#view-dungeons")).toBeVisible();
  await expect(page.locator("#view-camp")).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("tower-return-mobile.png"),
    fullPage: true,
    animations: "disabled",
  });
});
test("five companion results keep the reduced bundle price and preserve the selected party", async ({
  page,
}) => {
  await ready(page, "roster");
  await page.getByRole("tab", { name: "Chiêu hiền", exact: true }).click();
  const before = await page.evaluate(() => ({
    silver: window.__game.model.session.inventory.find(
      (i) => i.itemId === "silver",
    ).quantity,
    party: JSON.stringify({
      active: window.__game.model.session.party.active,
      formation: window.__game.model.session.party.formation,
    }),
  }));
  await expect(page.locator('[data-draw="10"]')).toHaveCount(0);
  await expect(page.locator('[data-draw="5"]')).toContainText("150");
  await page.locator('[data-draw="5"]').click();
  const after = await page.evaluate(() => ({
    silver: window.__game.model.session.inventory.find(
      (i) => i.itemId === "silver",
    ).quantity,
    party: JSON.stringify({
      active: window.__game.model.session.party.active,
      formation: window.__game.model.session.party.formation,
    }),
    total: window.__game.model.session.gacha.total,
    refunds: window.__game.model.session.gacha.history
      .slice(-5)
      .reduce((n, r) => n + r.refund, 0),
  }));
  expect(after).toEqual({
    silver: before.silver - 150 + after.refunds,
    refunds: after.refunds,
    party: before.party,
    total: 5,
  });
});
test("twelve enemy atlases decode six painted poses with transparent padding", async ({
  page,
}, info) => {
  await ready(page);
  const rows = await page.evaluate(async () => {
    const rows = await (
        await fetch("/assets/images/fighters/combat6-manifest.json")
      ).json(),
      root = document.createElement("section");
    root.style.cssText =
      "display:grid;grid-template-columns:repeat(3,1fr);background:#153738;color:white;padding:20px;gap:12px";
    document.body.replaceChildren(root);
    const checks = [];
    for (const row of rows) {
      const im = new Image();
      im.src = "/" + row.asset;
      await im.decode();
      const c = document.createElement("canvas");
      c.width = im.width;
      c.height = im.height;
      c.style.width = "100%";
      c.getContext("2d").drawImage(im, 0, 0);
      const cells = [];
      for (let i = 0; i < 6; i++) {
        const p = c
          .getContext("2d")
          .getImageData((i % 3) * 512, Math.floor(i / 3) * 512, 512, 512).data;
        let clear = 0,
          ink = 0;
        for (let j = 3; j < p.length; j += 4) {
          if (p[j] < 10) clear++;
          if (p[j] > 100) ink++;
        }
        cells.push({ clear, ink });
      }
      const label = document.createElement("p");
      label.textContent = row.id;
      const card = document.createElement("article");
      card.append(c, label);
      root.append(card);
      checks.push({ id: row.id, width: im.width, height: im.height, cells });
    }
    return checks;
  });
  expect(rows).toHaveLength(12);
  for (const r of rows) {
    expect(r.width).toBe(1536);
    expect(r.height).toBe(1024);
    for (const c of r.cells) {
      expect(c.clear, r.id).toBeGreaterThan(100000);
      expect(c.ink, r.id).toBeGreaterThan(10000);
    }
  }
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.screenshot({
    path: info.outputPath("enemy-atlas-review.png"),
    fullPage: true,
    animations: "disabled",
  });
});
