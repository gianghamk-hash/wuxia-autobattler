import { Companion } from '../entities/Companion.js';
import { applyStoryIdentity, NPCS_BY_ID } from '../data/NPCData.js';
const RULES = {
  doi_truong: {
    name: 'Lệnh gọi viện binh',
    counter: 'Dùng choáng để ngắt lệnh; tối đa sáu địch còn sống.',
    threshold: 0.65
  },
  doc_le: {
    name: 'Lồng dây U Minh',
    counter:
      'Dùng choáng để ngắt. Lồng giữ chân hai người tuyến trước, vẫn có thể đánh và dùng chiêu.',
    threshold: 0.7
  },
  do_mau: {
    name: 'Ấn thu tô',
    counter:
      'Ngắt bằng choáng hoặc tập trung đánh vỡ Ấn để bỏ lớp giảm sát thương.',
    threshold: 0.7
  },
  trinh_nghiem: {
    name: 'Tơ giật dây',
    counter:
      'Ngắt bằng choáng. Hai người ít máu bị đánh dấu; tơ làm rối nhịp nội lực.',
    threshold: 0.7
  }
};
/** Story-only encounter scripts. Ordinary arena and benchmark units have no characterId. */
export class BossDirector {
  constructor(combat) {
    this.combat = combat;
    this.serial = 0;
    this.bosses = combat.units
      .filter((u) => RULES[u.characterId] && u.team === 'enemy')
      .map((unit) => ({ unit, phase: 0, tell: null, next: 0, sealId: null }));
  }
  update() {
    const c = this.combat;
    for (const b of this.bosses) {
      if (!b.unit.alive) {
        this.cancel(b, false);
        this.removeSeal(b);
        continue;
      }
      if (b.retrySeal && this.summon(b, true)) b.retrySeal = false;
      if (b.tell) {
        if (b.unit.stunned) {
          this.cancel(b, true);
          b.next = c.elapsed + 8;
          continue;
        }
        if (c.elapsed >= b.tell.until) {
          this.resolve(b);
          b.tell = null;
          b.unit.bossCasting = false;
          b.next = c.elapsed + 18;
        }
        continue;
      }
      const rule = RULES[b.unit.characterId],
        repeat = b.unit.characterId === 'doc_le' && b.phase > 0;
      const second =
        b.unit.characterId === 'trinh_nghiem' &&
        b.phase === 1 &&
        b.unit.hpRatio <= 0.35;
      if (
        c.elapsed >= b.next &&
        !b.unit.stunned &&
        ((b.phase === 0 && b.unit.hpRatio <= rule.threshold) ||
          repeat ||
          second)
      ) {
        b.phase++;
        const targets = c.units
          .filter((u) => u.team === 'home' && u.alive)
          .sort((a, z) =>
            b.unit.characterId === 'doc_le'
              ? z.gridPosition.x - a.gridPosition.x || a.id.localeCompare(z.id)
              : a.hpRatio - z.hpRatio || a.id.localeCompare(z.id)
          )
          .slice(0, 2);
        b.tell = {
          until: c.elapsed + 3,
          name: second ? 'Hắc phiến quét sân' : rule.name,
          counter: rule.counter,
          targets: targets.map((u) => u.id)
        };
        b.unit.bossCasting = true;
        c.brains.get(b.unit.id).action = null;
        c.emit({
          type: 'boss:tell',
          actorId: b.unit.id,
          name: b.tell.name,
          counter: rule.counter,
          targets: b.tell.targets,
          until: b.tell.until,
          phase: b.phase
        });
      }
    }
  }
  cancel(b, interrupted) {
    if (b.tell)
      this.combat.emit({
        type: interrupted ? 'boss:interrupt' : 'boss:cancel',
        actorId: b.unit.id,
        name: b.tell.name
      });
    b.tell = null;
    b.unit.bossCasting = false;
  }
  freeCell() {
    const c = this.combat;
    for (const x of [5, 4, 3])
      for (const y of [0, 2, 1]) if (!c.grid.at({ x, y })) return { x, y };
    return null;
  }
  summon(b, seal = false) {
    const c = this.combat,
      cell = this.freeCell();
    if (
      !cell ||
      c.units.filter((u) => u.team === 'enemy' && u.alive).length >= 6
    )
      return null;
    const u = new Companion('companion_01', {
      id: 'boss_add_' + ++this.serial,
      team: 'enemy',
      level: b.unit.level
    });
    if (seal) {
      u.name = 'Ấn thu tô';
      u.isObject = true;
      u.sect = 'TuDo';
      u.role = 'Object';
      u.characterId = 'tax_seal';
      u.stats.maxHp = Math.max(100, b.unit.stats.maxHp * 0.18);
      u.portrait = 'assets/images/tax-seal.svg';
    } else {
      applyStoryIdentity(u, NPCS_BY_ID.tay_sai);
      u.name = 'Viện binh ' + this.serial;
      u.stats.maxHp = b.unit.stats.maxHp * 0.18;
      u.stats.physicalAtk = b.unit.stats.physicalAtk * 0.35;
      u.stats.magicalAtk = b.unit.stats.magicalAtk * 0.35;
    }
    u.stats.hp = u.stats.maxHp;
    u.stats.energy = 0;
    c.addUnit(u, cell);
    if (seal) b.sealId = u.id;
    return u;
  }
  resolve(b) {
    const c = this.combat,
      id = b.unit.characterId;
    const targets = b.tell.targets
      .map((id) => c.units.find((u) => u.id === id))
      .filter((u) => u?.alive);
    if (id === 'doi_truong') {
      this.summon(b);
      this.summon(b);
    }
    if (id === 'do_mau' && !this.summon(b, true)) b.retrySeal = true;
    if (id === 'doc_le')
      for (const target of targets)
        c.statuses.apply(target, {
          type: 'root',
          duration: 2.5,
          sourceId: b.unit.id
        });
    if (id === 'trinh_nghiem') {
      for (const target of targets) {
        c.statuses.apply(target, {
          type: 'internal_injury',
          ratio: 0.35,
          duration: 4,
          sourceId: b.unit.id
        });
        if (b.phase > 1)
          c.dealDamage(b.unit, target, b.unit.stats.magicalAtk * 0.9, {
            damageType: 'magical'
          });
        else
          c.statuses.apply(target, {
            type: 'accuracy_down',
            ratio: 0.2,
            duration: 3,
            sourceId: b.unit.id
          });
      }
    }
    c.emit({
      type: 'skill:cast',
      actorId: b.unit.id,
      ownerId: id,
      skillId: 'npc_' + id + '_ult',
      name: b.tell.name,
      ultimate: true,
      origin: { ...b.unit.gridPosition },
      targets: targets.map((u) => ({
        id: u.id,
        position: { ...u.gridPosition }
      }))
    });
    c.emit({
      type: 'boss:phase',
      actorId: b.unit.id,
      name: b.tell.name,
      phase: b.phase
    });
  }
  protection(target) {
    const b = this.bosses.find((b) => b.unit === target);
    return b?.sealId &&
      this.combat.units.some((u) => u.id === b.sealId && u.alive)
      ? 0.35
      : 1;
  }
  removeSeal(b) {
    const seal = this.combat.units.find((u) => u.id === b.sealId && u.alive);
    if (seal)
      this.combat.dealDamage(null, seal, seal.stats.hp, {
        damageType: 'true',
        ignoreShield: true
      });
    b.sealId = null;
  }
  onDeath(unit) {
    const b = this.bosses.find((b) => b.unit === unit);
    if (b) {
      this.cancel(b, false);
      this.removeSeal(b);
    }
  }
}
