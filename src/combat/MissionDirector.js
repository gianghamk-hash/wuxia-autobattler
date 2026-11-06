import { Unit } from '../entities/Unit.js';
import { Companion } from '../entities/Companion.js';
import { NPCS_BY_ID, applyStoryIdentity } from '../data/NPCData.js';
/** Assets occupy real cells but are not party members or sect-synergy contributors. */
export class MissionDirector {
  constructor(combat, definition) {
    this.c = combat;
    this.definition = definition;
    this.assets = [];
    this.helperId = null;
    this.progress = 0;
    this.moveCredit = 0;
    this.waves = new Set();
    const fighters = combat.units.filter((u) => u.team === 'home'),
      base = fighters[0].stats;
    const hp = Math.max(...fighters.map((u) => u.stats.maxHp));
    const count =
      definition.type === 'breach' ? 3 : definition.type === 'hold' ? 0 : 1;
    for (let i = 0; i < count; i++) {
      const captive = definition.type === 'rescue',
        enemy = definition.type === 'breach';
      const asset = new Unit(
        {
          id: 'mission_asset',
          name: definition.assetLabel??(captive
            ? 'Người phu'
            : enemy
              ? (definition.id === 'C10H18' ? 'Khóa tời ' : 'Chốt kho ') +
                (i + 1)
              : definition.id === 'C07H13'
                ? 'Hòm khuôn dấu'
                : 'Xe thóc'),
          sect: 'TuDo',
          role: 'Object',
          baseStats: {
            ...base,
            maxHp: hp * (enemy ? 0.22 : 1.8*(combat.enemyLimit===8?2:1)),
            physicalAtk: 0,
            magicalAtk: 0,
            physicalDef: 0,
            magicalDef: 0,
            dodgeRate: 0,
            blockRate: 0,
            critRate: 0,
            moveSpeed: 2,
            attackRange: 1
          },
          skills: {
            autoAttack: {
              id: 'asset_idle',
              name: 'Mục tiêu nhiệm vụ',
              dmgMultiplier: 0,
              type: 'physical',
              targetType: 'self'
            },
            ultimate: {
              id: 'asset_idle_ult',
              name: 'Mục tiêu nhiệm vụ',
              dmgMultiplier: 0,
              type: 'physical',
              targetType: 'self',
              energyCost: 10000
            }
          }
        },
        { id: 'mission_asset_' + i, team: enemy ? 'enemy' : 'home' }
      );
      asset.isObject = true;
      asset.missionAsset = true;
      asset.isCaptive = captive;
      asset.targetable = !captive;
      asset.rescued = false;
      asset.characterId = captive
        ? 'mission_captive'
        : enemy
          ? 'mission_lock'
          : 'mission_cart';
      asset.portrait = captive
        ? NPCS_BY_ID.nguoi_phu.portrait
        : enemy
          ? 'assets/images/mission-lock.svg'
          : 'assets/images/mission-cart.svg';
      const cells = captive ? [4, 5, 3] : enemy ? [5, 4, 3] : [0, 1, 2];
      let position;
      for (const x of cells)
        for (const y of [1, 0, 2])
          if (!position && !combat.grid.at({ x, y })) position = { x, y };
      if (!position) throw Error('Không đủ ô cho mục tiêu nhiệm vụ.');
      combat.grid.place(asset, position, { formation: false });
      combat.units.push(asset);
      this.assets.push(asset);
    }
    if (['protect', 'rescue'].includes(definition.type)) {
      const hunter = combat.units.find(
        (u) => u.team === 'enemy' && !u.missionAsset
      );
      if (hunter) hunter.targetPriority = 'objective';
    }
  }
  fighters(team) {
    return this.c.units.filter(
      (u) => u.team === team && !u.missionAsset && u.alive
    );
  }
  outcome() {
    const type = this.definition.type;
    if (!this.fighters('home').length)
      return { winner: 'enemy', reason: 'objective_failed' };
    if (type !== 'breach' && this.assets.some((u) => !u.alive))
      return { winner: 'enemy', reason: 'objective_failed' };
    const won =
      type === 'breach'
        ? this.assets.every((u) => !u.alive)
        : type === 'rescue'
          ? this.assets[0].rescued && this.assets[0].gridPosition?.x === 0
          : this.c.elapsed >= this.definition.duration ||
            (type === 'protect' && !this.fighters('enemy').length);
    return won ? { winner: 'home', reason: 'objective_complete' } : null;
  }
  requestRescue(id) {
    if (
      this.c.state !== 'running' ||
      this.definition.type !== 'rescue' ||
      this.assets[0].rescued
    )
      return false;
    const helper =
      this.fighters('home').find((u) => u.id === id) ??
      this.fighters('home')[0];
    if (!helper) return false;
    if (this.helperId === helper.id) return true;
    this.helperId = helper.id;
    this.progress = 0;
    this.c.brains.get(helper.id).action = null;
    this.c.emit({
      type: 'mission:rescue',
      actorId: helper.id,
      name: 'Ưu tiên cứu người'
    });
    return true;
  }
  control(unit, dt) {
    if (
      unit.id !== this.helperId ||
      this.definition.type !== 'rescue' ||
      this.assets[0].rescued
    )
      return false;
    const c = this.c,
      npc = this.assets[0],
      brain = c.brains.get(unit.id);
    brain.action = null;
    brain.targetId = npc.id;
    if (c.grid.distance(unit.gridPosition, npc.gridPosition) <= 1) {
      unit.state = 'RESCUE';
      return true;
    }
    unit.state = 'MOVE';
    if (unit.statusEffects.some((e) => e.type === 'root' && e.remaining > 0))
      return true;
    const route = c.grid.pathToRange(unit, npc, 1);
    if (!route?.length) {
      this.yieldForPath(unit,()=>c.grid.pathToRange(unit,npc,1)!==null,npc.id);
      return true;
    }
    brain.moveCredit += dt * unit.stats.moveSpeed;
    if (brain.moveCredit >= 1) {
      brain.moveCredit -= 1;
      c.grid.move(unit, route[0]);
    }
    return true;
  }
  update(dt) {
    if (this.outcome()) return;
    const c = this.c,
      type = this.definition.type;
    if (type === 'hold' && !this.definition.noWaves)
      for (const at of [10, 20])
        if (c.elapsed >= at && !this.waves.has(at)) {
          this.waves.add(at);
          const original = c.units.find(
            (u) => u.team === 'enemy' && !u.missionAsset
          );
          let spawned = 0;
          for (let i = 0; i < 2; i++) {
            if (
              !original ||
              c.units.filter((u) => u.team === 'enemy' && u.alive).length >= 6
            )
              break;
            let cell;
            for (const x of [5, 4, 3])
              for (const y of [0, 2, 1])
                if (!cell && !c.grid.at({ x, y })) cell = { x, y };
            if (!cell) break;
            const unit = new Companion(original.templateId, {
              id: 'mission_wave_' + at + '_' + i,
              team: 'enemy',
              level: original.level
            });
            applyStoryIdentity(unit, NPCS_BY_ID.tay_sai);
            unit.name =
              'Toán truy bắt ' + (at === 10 ? 'I' : 'II') + ' · ' + (i + 1);
            unit.stats.maxHp = original.stats.maxHp * 0.55;
            unit.stats.hp = unit.stats.maxHp;
            unit.stats.physicalAtk = original.stats.physicalAtk * 0.55;
            unit.stats.magicalAtk = original.stats.magicalAtk * 0.55;
            if (c.addUnit(unit, cell)) spawned++;
          }
          c.emit({
            type: 'mission:wave',
            name: spawned
              ? 'Toán truy bắt tiếp viện'
              : 'Toán tiếp viện không vào được sân đang chật'
          });
        }
    if (type !== 'rescue') return;
    const npc = this.assets[0];
    if (!npc.rescued) {
      let helper = this.fighters('home').find((u) => u.id === this.helperId);
      if (!helper) this.helperId = null;
      if (!helper && !this.fighters('enemy').length) {
        helper = this.fighters('home').sort(
          (a, b) =>
            c.grid.distance(a.gridPosition, npc.gridPosition) -
              c.grid.distance(b.gridPosition, npc.gridPosition) ||
            a.id.localeCompare(b.id)
        )[0];
        if (helper) this.requestRescue(helper.id);
      }
      if (
        helper &&
        !helper.stunned &&
        c.grid.distance(helper.gridPosition, npc.gridPosition) <= 1
      ) {
        this.progress += dt;
        if (this.progress >= this.definition.duration) {
          npc.rescued = true;
          this.escortStartX = npc.gridPosition.x;
          npc.targetable = true;
          this.helperId = null;
          c.emit({
            type: 'mission:freed',
            targetId: npc.id,
            name: 'Đã cứu người; bảo vệ đường rút'
          });
        }
      } else this.progress = 0;
    } else {
      this.moveCredit += dt * npc.stats.moveSpeed;
      if (this.moveCredit < 1) return;
      this.moveCredit = 0;
      const routes = [0, 1, 2]
        .map((y) => c.grid.findPath(npc, { x: 0, y }))
        .filter((p) => p?.length)
        .sort((a, b) => a.length - b.length);
      if (routes[0]) {
        npc.state = 'MOVE';
        c.grid.move(npc, routes[0][0]);
      } else {
        // Approach the furthest reachable column toward safety before asking a blocker to yield.
        const partial = [];
        for (let x = 0; x < npc.gridPosition.x; x++)
          for (let y = 0; y < 3; y++) {
            const p = c.grid.findPath(npc, { x, y });
            if (p?.length) partial.push({ x, p });
          }
        partial.sort((a, b) => a.x - b.x || a.p.length - b.p.length);
        if (partial[0]) {
          npc.state = 'MOVE';
          c.grid.move(npc, partial[0].p[0]);
        } else this.clearEscortPath(npc);
      }
    }
  }
  clearEscortPath(npc) {
    return this.yieldForPath(npc,()=>[0,1,2].some(y=>this.c.grid.findPath(npc,{x:npc.gridPosition.x-1,y})!==null),npc.id);
  }
  yieldForPath(actor,opensPath,targetId) {
    const c = this.c;
    if (c.elapsed - c.lastYieldAt.home < 1.5) return false;
    const friends = this.fighters('home')
      .filter(
        (u) =>
          u!==actor && !u.stunned &&
          !u.bossCasting &&
          !u.statusEffects.some((e) => e.type === 'root' && e.remaining > 0) &&
          !c.brains.get(u.id).action
      )
      .sort(
        (a, b) =>
          a.gridPosition.x - b.gridPosition.x || a.id.localeCompare(b.id)
      );
    // Finish an immediately useful move before planning another two-step opening.
    for(const lookAhead of [false,true])for (const friend of friends)
      for (const cell of c.grid.neighbors(friend.gridPosition, friend)) {
        const before = { ...friend.gridPosition };
        friend.gridPosition = cell;
        let opens = opensPath();
        // A dense formation can require two blockers to move before any route opens.
        // Plan the second step without moving it or skipping the first unit's real move.
        if(!opens&&lookAhead)for(const second of friends){
          if(second===friend)continue;
          const secondBefore={...second.gridPosition};
          for(const next of c.grid.neighbors(secondBefore,second)){
            second.gridPosition=next;
            opens=opensPath();
            second.gridPosition=secondBefore;
            if(opens)break;
          }
          if(opens)break;
        }
        friend.gridPosition = before;
        if (opens && c.grid.move(friend, cell)) {
          c.lastYieldAt.home = c.elapsed;
          friend.state = 'MOVE';
          c.emit({ type: 'yield', actorId: friend.id, targetId });
          return true;
        }
      }
    return false;
  }
  summary() {
    const d = this.definition,
      type = d.type;
    const value =
      type === 'breach'
        ? this.assets.filter((u) => !u.alive).length
        : type === 'rescue'
          ? this.assets[0].rescued
            ? 1 +
              Math.max(
                0,
                Math.min(
                  1,
                  ((this.escortStartX ?? 4) -
                    (this.assets[0].gridPosition?.x ??
                      this.escortStartX ??
                      4)) /
                    (this.escortStartX || 4)
                )
              )
            : Math.min(1, this.progress / d.duration)
          : Math.min(d.duration, this.c.elapsed);
    return {
      id: d.id,
      type,
      title: d.title,
      description: d.description,
      failure: d.failure,
      value,
      max: type === 'breach' ? 3 : type === 'rescue' ? 2 : d.duration,
      status:
        this.c.result?.reason === 'objective_timeout'
          ? 'Hết giờ · mục tiêu chưa hoàn thành'
          : !this.fighters('home').length
            ? 'Đội chiến đấu đã bị hạ'
            : type !== 'breach' && this.assets.some((u) => !u.alive)
              ? 'Mục tiêu bảo vệ đã bị hạ / bị phá'
              : type === 'breach'
                ? value + '/3 chốt đã mở'
                : type === 'rescue'
                  ? this.assets[0].rescued
                    ? this.assets[0].gridPosition?.x === 0
                      ? 'Đã đưa người về an toàn'
                      : 'Đã cứu · đang đưa về mép sân nhà'
                    : this.helperId
                      ? 'Đang tiếp cận / giải cứu'
                      : 'Chưa giải cứu · có thể ưu tiên cứu sớm'
                  : Math.min(d.duration, this.c.elapsed).toFixed(1) +
                    ' / ' +
                    d.duration +
                    ' giây',
      assets: this.assets.map((u) => ({
        id: u.id,
        name: u.name,
        hp: u.stats.hp,
        maxHp: u.stats.maxHp,
        alive: u.alive
      })),
      canRescue:
        type === 'rescue' &&
        !this.assets[0].rescued &&
        this.c.state === 'running'
    };
  }
}
