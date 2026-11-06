import {
  ELEMENTS,
  elementMultiplier,
  SECT_ELEMENT,
  sectBonuses,
  LIMITS
} from '../data/StrategyData.js';
import { CONFIG } from '../config.js';
import { AIBehavior } from './AIBehavior.js';
import { StatusEngine } from './StatusEngine.js';
import { TargetSelector } from './TargetSelector.js';
import { calculateDamage, modifier, seededRandom } from './CombatMath.js';
import { SECTS } from '../data/SectsData.js';
import { getActiveSynergies } from '../data/SynergiesData.js';
import { BossDirector } from './BossDirector.js';
import { MissionDirector } from './MissionDirector.js';
import { MISSIONS } from '../data/MissionsData.js';

const FRIENDLY = [
  'self',
  'all_allies',
  'lowest_hp_ally',
  'stunned_ally',
  'hero_ally'
];
export class CombatEngine {
  constructor({
    units,
    grid,
    seed = 12345,
    maxDuration = 120,
    overtime = true,
    yielding = true,
    missionId = null,
    enemyLimit = 6,
    nextBossWave = null,
    onEvent = () => {}
  }) {
    if (
      !Array.isArray(units) ||
      !units.length ||
      new Set(units.map((u) => u.id)).size !== units.length ||
      !Number.isInteger(seed) ||
      seed < 0 ||
      seed > 0xffffffff ||
      !Number.isFinite(maxDuration) ||
      maxDuration <= 0 ||
      (missionId !== null && !Object.hasOwn(MISSIONS, missionId))
    ) {
      throw new Error('Cấu hình trận đấu không hợp lệ.');
    }
    for (const unit of units.filter((u) => u.alive)) {
      if (
        !unit.skills.autoAttack ||
        !unit.skills.ultimate ||
        grid.units.get(unit.id) !== unit ||
        !unit.gridPosition
      )
        throw new Error('Nhân vật chưa sẵn sàng chiến đấu.');
    }
    if(![6,8].includes(enemyLimit))throw Error('Giới hạn quân không hợp lệ.');
    this.enemyLimit=enemyLimit;this.nextBossWave=nextBossWave;this.bossPhase=nextBossWave?1:0;this.phaseStartedAt=0;this.startingCells=new Map(units.filter(u=>u.team==='home').map(u=>[u.id,{...u.gridPosition}]));
    for (const team of ['home', 'enemy'])
      if (units.filter((u) => u.team === team).length > (team==='enemy'?enemyLimit:6))
        throw new Error('Mỗi phe tối đa sáu nhân vật.');
    this.autoUltimate = true;
    this.manualOrders = new Set();
    this.healWindows = new Map();
    this.healTotals = new Map();
    this.units = units;
    this.grid = grid;
    this.mission = missionId
      ? new MissionDirector(this, MISSIONS[missionId])
      : null;
    this.seed = seed;
    this.random = seededRandom(seed);
    this.maxDuration = maxDuration;
    this.overtime = Boolean(overtime);
    this.yielding = Boolean(yielding);
    this.lastYieldAt = { home: -2, enemy: -2 };
    this.onEvent = onEvent;
    this.state = 'idle';
    this.result = null;
    this.ticks = 0;
    this.elapsed = 0;
    this.accumulator = 0;
    this.events = [];
    this.brains = new Map(units.map((u) => [u.id, new AIBehavior(u)]));
    this.records = new Map(
      units.map((u) => [
        u.id,
        {
          id: u.id,
          name: u.name,
          team: u.team,
          role: u.role,
          maxHp: u.stats.maxHp,
          damageTaken: 0,
          absorbed: 0,
          attemptedHealing: 0,
          attempts: 0,
          misses: 0,
          blockedTime: 0,
          deathAt: null,
          damage: 0,
          healing: 0,
          kills: 0,
          ultimates: 0
        }
      ])
    );
    this.passives = new Map(
      units.map((u) => [
        u.id,
        {
          attacks: 0,
          shieldUsed: false,
          internalForce: u.sect === 'VoDang' ? u.stats.magicalAtk * 3 : 0
        }
      ])
    );
    this.teamSynergies = {};
    this.director = new BossDirector(this);
    this.focusId = null;
    this.statuses = new StatusEngine({
      onPeriodic: (unit, amount, effect) => {
        const source = this.units.find((u) => u.id === effect.sourceId);
        if (effect.type === 'regen') this.heal(source, unit, amount);
        else
          this.dealDamage(
            source,
            unit,
            amount *
              (effect.type === 'poison' ? 1 - (unit.poisonResistance ?? 0) : 1)*elementMultiplier(source,unit),
            { damageType: 'true', periodic: true, statusType: effect.type }
          );
      }
    });
  }
  emit(event) {
    const entry = { ...event, time: this.elapsed };
    this.events.push(entry);
    if (this.events.length > 200) this.events.shift();
    this.onEvent(entry);
  }
  start() {
    if (this.state !== 'idle') return false;
    this.state = 'running';
    for (const unit of this.units) {
      unit.inCombat = true;
      unit.energyGainMultiplier = 1;
      unit.damageMultiplier =
        unit.sect === 'DuongMon'
          ? 0.85
          : unit.sect === 'CaiBang'
            ? 0.94
            : unit.sect === 'ThieuLam'
              ? 1.12
              : 1;
      if (
        unit.profile?.allocatedSkills.filter((id) => id.endsWith('_attack'))
          .length >= 3 &&
        ['CaiBang', 'DuongMon'].includes(unit.sect)
      )
        unit.damageMultiplier *= 0.72;
      unit.element ??= SECT_ELEMENT[unit.sect];
      unit.damageMultiplier *= unit.preparedDamage ?? 1;
      unit.energyGainMultiplier += unit.preparedEnergy ?? 0;
    }
    for (const team of ['home', 'enemy']) {
      const members = this.units.filter(
        (u) => u.team === team && u.alive && !u.missionAsset
      );
      for (const bonus of sectBonuses(members.map((u) => u.sect))) {
        const value = bonus.tier === 6 ? 0.15 : bonus.tier === 4 ? 0.1 : 0.05;
        for (const unit of members) {
          if (bonus.sect === 'ThieuLam')
            this.statuses.apply(unit, {
              type: 'shield',
              amount: unit.stats.maxHp * value,
              duration: this.maxDuration + 1
            });
          if (bonus.sect === 'VoDang') unit.energyGainMultiplier += value;
          if (bonus.sect === 'CaiBang') unit.damageMultiplier *= 1 + value;
          if (bonus.sect === 'NgaMi') unit.healMultiplier = 1 + value;
          if (bonus.sect === 'DuongMon')
            unit.damageMultiplier *= 1 + value * 0.7;
        }
        this.emit({
          type: 'synergy',
          team,
          name: `${bonus.sect} ${bonus.tier} người`
        });
      }
      for (const unit of members)
        if (
          members.some(
            (ally) =>
              ally !== unit && ELEMENTS[ally.element]?.feeds === unit.element
          )
        )
          unit.energyGainMultiplier += 0.08;
      const active = getActiveSynergies([...new Set(members.map((u) => u.sect).filter(Boolean))]);
      this.teamSynergies[team] = active.map((s) => s.id);
      for (const synergy of active) {
        for (const unit of members) {
          if (synergy.id === 'thai_son_bac_dau')
            this.statuses.apply(unit, {
              type: 'shield',
              amount: unit.stats.maxHp * 0.15,
              duration: this.maxDuration + 1
            });
          if (synergy.id === 'am_duong_giao_hoa')
            unit.energyGainMultiplier += 0.25;
          if (synergy.id === 'doc_ba_vo_lam') unit.damageMultiplier *= 1.2;
        }
        this.emit({ type: 'synergy', team, name: synergy.name });
      }
    }
    this.emit({ type: 'start', seed: this.seed });
    this.checkResult();
    return true;
  }
  update(dt) {
    if (!Number.isFinite(dt) || dt < 0)
      throw new Error('Thời gian trận đấu không hợp lệ.');
    if (this.state !== 'running') return;
    this.accumulator += dt;
    const step = CONFIG.TIME.FIXED_STEP;
    while (this.accumulator >= step - 1e-9 && this.state === 'running') {
      this.accumulator = Math.max(0, this.accumulator - step);
      this.ticks++;
      this.elapsed = this.ticks * step;
      for (const unit of this.units) this.statuses.update(unit, step);
      this.director.update();
      this.mission?.update(step);
      this.grid.removeDead();
      if (this.checkResult()) break;
      // Stable initiative order; speed controls never alter iteration or random calls.
      const initiative = [...this.units].sort(
        (a, b) =>
          b.stats.attackSpeed - a.stats.attackSpeed || a.id.localeCompare(b.id)
      );
      for (const unit of initiative) {
        this.brains.get(unit.id).update(step, this);
        this.grid.removeDead();
        if (this.checkResult()) break;
      }
      if (this.state === 'running' && this.elapsed >= this.maxDuration - 1e-9)
        this.finish(
          this.mission ? 'enemy' : null,
          this.mission ? 'objective_timeout' : 'timeout'
        );
    }
  }
  checkResult() {
    const home=this.units.some(u=>u.team==='home'&&u.alive&&!u.missionAsset),enemy=this.units.some(u=>u.team==='enemy'&&u.alive);
    const outcome=this.mission?.outcome();
    if(outcome?.winner==='enemy'||!home){this.finish(outcome?.winner==='enemy'?'enemy':enemy?'enemy':null,outcome?.reason??'elimination');return true;}
    if(!enemy&&this.nextBossWave&&this.bossPhase<3){
      this.bossPhase++;this.phaseStartedAt=this.elapsed;this.healTotals.clear();this.healWindows.clear();
      for(const u of this.units.filter(u=>u.team==='home'&&u.alive&&this.startingCells.has(u.id)))this.grid.remove(u);
      for(const u of this.units.filter(u=>u.team==='home'&&u.alive&&this.startingCells.has(u.id))){this.grid.place(u,this.startingCells.get(u.id),{formation:false});this.brains.get(u.id).action=null;}
      for(const [i,u]of this.nextBossWave(this.bossPhase).entries()){
        const cell=[{x:3,y:1},{x:5,y:0},{x:4,y:2},{x:3,y:2},{x:4,y:0},{x:5,y:2},{x:3,y:0},{x:5,y:1}][i];
        if(!this.addUnit(u,cell))throw Error('Không thể mở phase boss.');
      }
      this.director=new BossDirector(this);this.emit({type:'boss:wave',phase:this.bossPhase,total:3,name:`Phase ${this.bossPhase}/3`});return false;
    }
    if(this.mission&&!this.nextBossWave){if(outcome){this.finish(outcome.winner,outcome.reason);return true;}return false;}
    if(!enemy){if(this.mission&&!outcome)return false;this.finish('home','elimination');return true;}
    return false;
  }
  finish(winner, reason) {
    if (this.state !== 'running') return;
    this.state = 'finished';
    this.units.forEach((unit) => {
      unit.inCombat = false;
      Object.assign(this.records.get(unit.id), {
        finalHp: unit.stats.hp,
        alive: unit.alive
      });
    });
    this.result = {
      winner,
      reason,
      duration: this.elapsed,
      bossPhases: this.bossPhase,
      seed: this.seed,
      statistics: structuredClone([...this.records.values()])
    };
    if (this.mission) this.result.objective = this.mission.summary();
    this.emit({ type: 'result', ...this.result });
  }
  orderUltimate(id) {
    const unit = this.units.find(
      (u) => u.id === id && u.team === 'home' && u.alive
    );
    if (
      this.state !== 'running' ||
      !unit ||
      unit.stats.energy < unit.skills.ultimate.energyCost
    )
      return false;
    this.manualOrders.add(id);
    return true;
  }
  orderFocus(id) {
    const target = this.units.find(
      (u) => u.id === id && u.team === 'enemy' && u.alive
    );
    if (this.state !== 'running' || !target) return false;
    this.focusId = id;
    this.emit({ type: 'focus', targetId: id });
    return true;
  }
  pressure() {
    const t = this.overtime
      ? Math.max(0, Math.min(1, (this.elapsed - this.phaseStartedAt - 90) / 30))
      : 0;
    return { damage: 1 + t * 1.5, healing: 1 - t * 0.6 };
  }
  yieldPath(actor, skill) {
    if (
      !this.yielding ||
      this.elapsed - this.lastYieldAt[actor.team] < 1.5 ||
      !actor.gridPosition
    )
      return false;
    const friends = this.allies(actor)
      .filter(
        (u) =>
          u !== actor &&
          !u.stunned &&
          !u.isObject &&
          !u.bossCasting &&
          !u.statusEffects.some((e) => e.type === 'root' && e.remaining > 0) &&
          !this.brains.get(u.id).action &&
          this.grid.distance(actor.gridPosition, u.gridPosition) <= 1
      )
      .sort((a, b) => a.id.localeCompare(b.id));
    const enemies = this.opponents(actor);
    for (const friend of friends)
      for (const cell of this.grid.neighbors(friend.gridPosition, friend)) {
        const before = { ...friend.gridPosition };
        friend.gridPosition = cell;
        const opens =
          enemies.some(
            (target) =>
              this.grid.pathToRange(actor, target, this.range(actor, skill)) !==
              null
          ) || this.grid.findPath(actor, before) !== null;
        friend.gridPosition = before;
        if (opens && this.grid.move(friend, cell)) {
          this.lastYieldAt[actor.team] = this.elapsed;
          friend.state = 'MOVE';
          this.emit({ type: 'yield', actorId: friend.id, targetId: actor.id });
          return true;
        }
      }
    return false;
  }
  addUnit(unit, cell) {
    if (
      this.units.some((u) => u.id === unit.id) ||
      this.units.filter((u) => u.team === unit.team && u.alive&&!u.isObject).length >= (unit.team==='enemy'?this.enemyLimit:6)
    )
      return false;
    this.grid.place(unit, cell, { formation: false });
    this.units.push(unit);
    unit.inCombat = true;
    unit.damageMultiplier = 1;
    unit.energyGainMultiplier = 1;
    this.brains.set(unit.id, new AIBehavior(unit));
    this.records.set(unit.id, {
      id: unit.id,
      name: unit.name,
      team: unit.team,
      role: unit.role,
      maxHp: unit.stats.maxHp,
      damage: 0,
      healing: 0,
      kills: 0,
      ultimates: 0,
      damageTaken: 0,
      absorbed: 0,
      attemptedHealing: 0,
      attempts: 0,
      misses: 0,
      blockedTime: 0,
      deathAt: null
    });
    this.passives.set(unit.id, {
      attacks: 0,
      shieldUsed: false,
      internalForce: 0
    });
    this.emit({ type: 'boss:summon', actorId: unit.id, name: unit.name });
    return true;
  }
  abort() {
    if (this.state === 'running') this.finish(null, 'aborted');
  }
  friendly(skill) {
    return FRIENDLY.includes(skill.targetType);
  }
  opponents(actor) {
    const charmed = actor.statusEffects.some(
      (e) => e.type === 'charm' && e.remaining > 0
    );
    return this.units.filter(
      (u) =>
        u.alive &&
        u.targetable !== false &&
        u.gridPosition &&
        u.id !== actor.id &&
        (charmed ? u.team === actor.team : u.team !== actor.team)
    );
  }
  allies(actor) {
    return this.units.filter(
      (u) => u.alive && u.gridPosition && u.team === actor.team
    );
  }
  validTarget(actor, target, skill) {
    if (!target?.alive || !target.gridPosition) return false;
    return this.friendly(skill)
      ? target.team === actor.team
      : this.opponents(actor).includes(target);
  }
  range(actor, skill) {
    return this.friendly(skill) ||
      skill.effects?.some((e) => e.type === 'blink')
      ? 6
      : skill.targetType === 'farthest_enemy'
        ? 4
        : actor.stats.attackRange;
  }
  inRange(actor, target, skill) {
    return (
      target?.gridPosition &&
      this.grid.distance(actor.gridPosition, target.gridPosition) <=
        this.range(actor, skill)
    );
  }
  chooseTarget(actor, skill, basic = false) {
    if (!skill) return null;
    const allies = this.allies(actor),
      enemies = this.opponents(actor);
    const distance = (a, b) =>
      this.grid.distance(actor.gridPosition, a.gridPosition) -
        this.grid.distance(actor.gridPosition, b.gridPosition) ||
      a.id.localeCompare(b.id);
    const hp = (a, b) => a.hpRatio - b.hpRatio || distance(a, b);
    if (skill.targetType === 'self' || skill.targetType === 'all_allies')
      return actor;
    if (skill.targetType === 'hero_ally')
      return allies.find((u) => u.templateId === 'hero') ?? null;
    if (skill.targetType === 'stunned_ally')
      return allies.filter((u) => u.stunned).sort(hp)[0] ?? null;
    if (skill.targetType === 'lowest_hp_ally')
      return allies.filter((u) => u.hpRatio < 1).sort(hp)[0] ?? null;
    const taunt = [...actor.statusEffects]
      .reverse()
      .find(
        (e) =>
          e.type === 'taunt' &&
          e.remaining > 0 &&
          enemies.some((u) => u.id === e.sourceId)
      );
    if (taunt) return enemies.find((u) => u.id === taunt.sourceId);
    if (actor.targetPriority === 'objective') {
      const asset = enemies.find((u) => u.missionAsset);
      if (asset) return asset;
    }
    if (actor.team === 'home' && this.focusId) {
      const focus = enemies.find((u) => u.id === this.focusId);
      if (focus) return focus;
    }
    if (skill.targetType === 'farthest_enemy')return enemies.sort((a,b)=>-distance(a,b))[0]??null;
    if (skill.targetType === 'lowest_hp_enemy')return enemies.sort(hp)[0]??null;
    if (skill.targetType === 'front_enemy')return enemies.sort((a,b)=>(actor.team==='home'?a.gridPosition.x-b.gridPosition.x:b.gridPosition.x-a.gridPosition.x)||distance(a,b))[0]??null;
    if (actor.targetPriority === 'weakest') return enemies.sort(hp)[0] ?? null;
    if (actor.targetPriority === 'rear')
      return (
        enemies.sort(
          (a, b) =>
            (actor.team === 'home'
              ? b.gridPosition.x - a.gridPosition.x
              : a.gridPosition.x - b.gridPosition.x) || distance(a, b)
        )[0] ?? null
      );
    if (actor.targetPriority === 'nearest')
      return enemies.sort(distance)[0] ?? null;
    if (skill.targetType === 'farthest_enemy')
      return enemies.sort((a, b) => -distance(a, b))[0] ?? null;
    if (skill.targetType === 'lowest_hp_enemy')
      return enemies.sort(hp)[0] ?? null;
    if (skill.targetType === 'front_enemy')
      return (
        enemies.sort(
          (a, b) =>
            (actor.team === 'home'
              ? a.gridPosition.x - b.gridPosition.x
              : b.gridPosition.x - a.gridPosition.x) || distance(a, b)
        )[0] ?? null
      );
    if (basic) {
      // Reuse the role selector. A charmed attacker sees its former allies as enemies.
      const view = new Proxy(actor, {
        get: (unit, key) =>
          key === 'team' && enemies[0]?.team === actor.team
            ? actor.team === 'home'
              ? 'enemy'
              : 'home'
            : Reflect.get(unit, key)
      });
      return TargetSelector.select(
        view,
        enemies,
        this.grid,
        ['Healer', 'Support', 'Buffer', 'Battery'].includes(actor.role)
          ? 'nearest'
          : 'role'
      );
    }
    return enemies.sort(distance)[0] ?? null;
  }
  reachableAlternative(actor, skill) {
    const taunted = actor.statusEffects.some(
      (e) =>
        e.type === 'taunt' &&
        e.remaining > 0 &&
        this.opponents(actor).some((u) => u.id === e.sourceId)
    );
    if (taunted) return null; // A valid taunt cannot be bypassed just because the source is screened.
    const candidates = this.friendly(skill)
      ? this.allies(actor)
      : this.opponents(actor);
    return (
      candidates
        .filter(
          (u) =>
            this.grid.pathToRange(actor, u, this.range(actor, skill)) !== null
        )
        .sort(
          (a, b) =>
            this.grid.distance(actor.gridPosition, a.gridPosition) -
              this.grid.distance(actor.gridPosition, b.gridPosition) ||
            a.id.localeCompare(b.id)
        )[0] ?? null
    );
  }
  heal(source, target, amount) {
    const key = `${target.id}:${Math.floor(this.elapsed)}`,
      window = this.healWindows.get(key) ?? 0,
      total = this.healTotals.get(target.id) ?? 0;
    const supported =
      source && ELEMENTS[source.element]?.feeds === target.element ? 1.1 : 1;
    if (source)
      this.records.get(source.id).attemptedHealing +=
        amount * (source.healMultiplier ?? 1) * supported;
    const limited = Math.max(
      0,
      Math.min(
        amount *
          (source?.healMultiplier ?? 1) *
          supported *
          this.pressure().healing,
        target.stats.maxHp * LIMITS.healingPerSecond - window,
        target.stats.maxHp * LIMITS.healingPerBattle - total
      )
    );
    const restored = target.heal(limited);
    this.healWindows.set(key, window + restored);
    this.healTotals.set(target.id, total + restored);
    if (source) this.records.get(source.id).healing += restored;
    if (restored > 0)
      this.emit({
        type: 'heal',
        actorId: source?.id,
        targetId: target.id,
        amount: restored,
        position: { ...target.gridPosition }
      });
    return restored;
  }
  dealDamage(source, target, amount, options = {}) {
    if (!target.alive) return { hpDamage: 0, absorbed: 0, killed: false };
    const {
      damageType = 'physical',
      reaction = false,
      periodic = false,
      ignoreShield = false,
      crit = false
    } = options;
    if (damageType === 'true') amount *= source?.damageMultiplier ?? 1;
    // Reflections are derived from already amplified HP damage: do not amplify twice.
    if (!reaction) amount *= this.pressure().damage;
    amount *= this.director.protection(target);
    const position = { ...target.gridPosition };
    const passive = this.passives.get(target.id);
    if (target.sect === 'VoDang' && passive.internalForce > 0) {
      const redirected = Math.min(passive.internalForce, amount * 0.4);
      amount -= redirected;
      passive.internalForce -= redirected;
    }
    const result = target.takeDamage(amount, { ignoreShield });
    this.records.get(target.id).damageTaken += result.hpDamage;
    this.records.get(target.id).absorbed += result.absorbed;
    if (source) this.records.get(source.id).damage += result.hpDamage;
    this.emit({
      type: 'damage',
      actorId: source?.id,
      targetId: target.id,
      amount: result.hpDamage,
      absorbed: result.absorbed,
      damageType,
      crit,
      statusType: options.statusType ?? null,
      position
    });
    if (result.killed) {
      this.records.get(target.id).deathAt = this.elapsed;
      if (source) {
        source.gainEnergy(CONFIG.COMBAT.ENERGY_ON_KILL);
        this.records.get(source.id).kills++;
      }
      this.emit({ type: 'death', targetId: target.id });
      this.director.onDeath(target);
    }
    if (
      target.alive &&
      target.sect === 'ThieuLam' &&
      target.hpRatio < 0.3 &&
      !passive.shieldUsed
    ) {
      passive.shieldUsed = true;
      this.statuses.apply(target, {
        type: 'shield',
        duration: 6,
        amount: target.stats.maxHp * 0.5
      });
      this.statuses.apply(target, {
        type: 'melee_reflect',
        duration: 6,
        ratio: 0.25
      });
      this.emit({
        type: 'passive',
        actorId: target.id,
        name: SECTS.ThieuLam.passive.name
      });
    }
    if (
      source?.alive &&
      !reaction &&
      !periodic &&
      damageType !== 'true' &&
      result.hpDamage > 0
    ) {
      const melee =
        source.gridPosition &&
        position &&
        this.grid.distance(source.gridPosition, position) <= 1;
      const reflected = melee ? modifier(target, 'melee_reflect') : 0;
      if (reflected > 0)
        this.dealDamage(target, source, result.hpDamage * reflected, {
          damageType: 'true',
          reaction: true
        });
      if (target.alive && target.sect === 'VoDang' && source.alive)
        this.dealDamage(
          target,
          source,
          target.stats.magicalAtk *
            0.3 * elementMultiplier(target,source) *
            (1000 /
              (1000 + source.stats.magicalDef * CONFIG.MATH.ARMOR_CONSTANT)),
          { damageType: 'magical', reaction: true }
        );
    }
    return result;
  }
  hit(actor, target, skill) {
    if (!actor.alive || !target.alive) return false;
    this.records.get(actor.id).attempts++;
    const result = calculateDamage(actor, target, skill, this.random);
    if (result.missed) {
      this.records.get(actor.id).misses++;
      this.emit({
        type: 'miss',
        actorId: actor.id,
        targetId: target.id,
        position: { ...target.gridPosition }
      });
      return false;
    }
    this.dealDamage(actor, target, result.amount, {
      damageType: skill.type,
      crit: result.crit
    });
    return true;
  }
  effect(actor, target, effect) {
    if (!target.alive) return;
    if(effect.chance!==undefined&&this.random()>=effect.chance)return;
    const apply = (data) =>
      this.statuses.apply(target, { ...data, sourceId: actor.id });
    switch (effect.type) {
      case 'heal':
        this.heal(
          actor,
          target,
          actor.stats[effect.scalingStat] * effect.multiplier
        );
        break;
      case 'heal_over_time':
        apply({
          type: 'regen',
          duration: effect.duration,
          damagePerStack: actor.stats[effect.scalingStat] * effect.multiplier
        });
        break;
      case 'shield':
        apply({
          type: 'shield',
          duration: effect.duration,
          amount: target.stats.maxHp * effect.maxHpRatio
        });
        break;
      case 'burn':
        apply({
          type: 'burn',
          duration: effect.duration,
          damagePerStack: actor.stats.magicalAtk * 0.12,
          stacks: 1
        });
        break;
      case 'internal_injury':
        apply({
          type: 'internal_injury',
          duration: effect.duration,
          ratio: effect.ratio ?? 0.35
        });
        break;
      case 'root':
      case 'stun':
      case 'taunt':
      case 'charm':
        apply({ type: effect.type, duration: effect.duration });
        break;
      case 'physical_defense_down':
      case 'attack_up':
      case 'accuracy_down':
      case 'dodge_up':
      case 'melee_reflect':
        apply({
          type: effect.type,
          duration: effect.duration,
          ratio: effect.ratio
        });
        break;
      case 'poison':
        apply({
          type: 'poison',
          duration: effect.duration,
          damagePerStack: actor.stats.magicalAtk * 0.15,
          stacks: effect.stacks
        });
        break;
      case 'cleanse':
        this.statuses.cleanse(target, effect.statuses);
        break;
      case 'energy_restore':
        target.gainEnergy(effect.amount);
        break;
      case 'knockback': {
        const columns = target.team === 'enemy' ? [5, 4, 3] : [0, 1, 2];
        const cell = columns
          .map((x) => ({ x, y: target.gridPosition.y }))
          .find((p) => !this.grid.at(p));
        if (cell) this.grid.place(target, cell, { formation: false });
        break;
      }
      case 'execute':
        if (target.hpRatio < effect.hpThreshold)
          this.dealDamage(actor, target, target.stats.hp + target.shield, {
            damageType: 'true',
            ignoreShield: true
          });
        break;
      default:
        throw new Error(`Hiệu ứng chưa được xử lý: ${effect.type}`);
    }
    this.emit({
      type: 'effect',
      actorId: actor.id,
      targetId: target.id,
      name: effect.type
    });
  }
  resolveSkill(actor, anchor, skill, ultimate) {
    if (
      !actor.alive ||
      actor.stunned ||
      !this.validTarget(actor, anchor, skill)
    )
      return;
    const origin = { ...actor.gridPosition };
    const announce = (targets) =>
      this.emit({
        type: 'skill:cast',
        actorId: actor.id,
        skillId: skill.id ?? skill.name,
        name: skill.name,
        ultimate,
        ownerId:
          actor.characterId ??
          (actor.templateId === 'hero' ? actor.sect : actor.templateId),
        origin,
        targets: targets.map((target) => ({
          id: target.id,
          position: { ...target.gridPosition }
        }))
      });
    if (ultimate) {
      this.records.get(actor.id).ultimates++;
      this.emit({ type: 'ultimate', actorId: actor.id, name: skill.name });
    }
    const effects = skill.effects ?? [];
    const random = effects.find((e) => e.type === 'random_choice');
    if (random) {
      let roll =
        this.random() * random.choices.reduce((sum, c) => sum + c.weight, 0);
      const choice =
        random.choices.find((c) => {
          roll -= c.weight;
          return roll < 0;
        }) ?? random.choices.at(-1);
      if (choice.type === 'full_heal') {
        const ally = this.allies(actor).sort(
          (a, b) => a.hpRatio - b.hpRatio || a.id.localeCompare(b.id)
        )[0];
        if (ally) {
          announce([ally]);
          this.heal(actor, ally, ally.stats.maxHp);
        }
      } else {
        announce([anchor]);
        this.hit(actor, anchor, {
          ...skill,
          dmgMultiplier: choice.dmgMultiplier
        });
      }
      return;
    }
    if (effects.some((e) => e.type === 'blink')) {
      const p = anchor.gridPosition;
      const cell = [
        { x: p.x + (anchor.team === 'enemy' ? 1 : -1), y: p.y },
        ...this.grid.neighbors(p, actor)
      ].find((p) => this.grid.isInside(p) && !this.grid.at(p));
      if (cell) this.grid.place(actor, cell, { formation: false });
    }
    let targets =
      skill.targetType === 'all_allies' ? this.allies(actor) : [anchor];
    const area = effects.find(
      (e) => e.type === 'area_damage' || e.radius !== undefined
    );
    if (area) {
      const center =
        skill.targetType === 'self' ? actor.gridPosition : anchor.gridPosition;
      const radius = area.radius ?? Math.floor(area.width / 2);
      targets = this.opponents(actor).filter(
        (u) => this.grid.distance(center, u.gridPosition) <= radius
      );
    }
    if (
      effects.some((e) => e.type === 'row_damage') ||
      (ultimate && actor.rowUltimate && skill.dmgMultiplier > 0)
    )
      targets = this.opponents(actor).filter(
        (u) => u.gridPosition.x === anchor.gridPosition.x
      );
    if (effects.some((e) => e.type === 'piercing_projectiles')) {
      const count = effects.find(
        (e) => e.type === 'piercing_projectiles'
      ).count;
      targets = this.opponents(actor)
        .sort(
          (a, b) =>
            Math.abs(a.gridPosition.y - anchor.gridPosition.y) -
              Math.abs(b.gridPosition.y - anchor.gridPosition.y) ||
            a.id.localeCompare(b.id)
        )
        .slice(0, count);
    }
    const state = this.passives.get(actor.id);
    if (!ultimate && actor.sect === 'CaiBang' && (state.attacks + 1) % 4 === 0)
      targets = this.opponents(actor).filter(
        (u) => u.gridPosition.y === anchor.gridPosition.y
      );
    for (const effect of effects.filter(e=>e.recipient==='caster')) this.effect(actor,actor,effect);
    announce(targets);
    let connected = false;
    for (const target of targets) {
      if (!actor.alive) break;
      let landed = skill.dmgMultiplier <= 0;
      const hits = effects.find((e) => e.type === 'multi_hit')?.hits ?? 1;
      for (
        let i = 0;
        i < hits && target.alive && actor.alive && skill.dmgMultiplier > 0;
        i++
      )
        landed = this.hit(actor, target, skill) || landed;
      connected ||= landed;
      if (landed) {
        for (const effect of effects.filter(
          (e) =>
            e.recipient!=='caster' && ![
              'area_damage',
              'multi_hit',
              'piercing_projectiles',
              'blink',
              'row_damage'
            ].includes(e.type)
        ))
          this.effect(actor, target, effect);
        if (ultimate && target.alive && target.team !== actor.team) {
          if (actor.element === 'Hoa')
            this.statuses.apply(target, {
              type: 'burn',
              duration: 4,
              damagePerStack: actor.stats.physicalAtk * 0.1,
              sourceId: actor.id
            });
          if (actor.element === 'Tho')
            this.statuses.apply(target, {
              type: 'internal_injury',
              duration: 4,
              ratio: 0.35,
              sourceId: actor.id
            });
        }
        if (!ultimate && target.alive && target.team !== actor.team) {
          if (actor.preparedBurn && (state.attacks + 1) % 4 === 0)
            this.statuses.apply(target, {
              type: 'burn',
              duration: 3,
              damagePerStack: actor.stats.physicalAtk * 0.08,
              sourceId: actor.id
            });
          if (actor.sect === 'DuongMon') {
            const poison = this.statuses.apply(target, {
              type: 'poison',
              duration: 5,
              damagePerStack: actor.stats.physicalAtk * 0.1,
              sourceId: actor.id
            });
            if (poison.stacks >= 5) {
              this.statuses.cleanse(target, ['poison']);
              this.dealDamage(actor, target, actor.stats.physicalAtk * 1.1, {
                damageType: 'true'
              });
            }
          }
          if (
            this.teamSynergies[actor.team]?.includes('hiep_nghia_giang_ho') &&
            this.random() < 0.2
          )
            this.statuses.apply(target, {
              type: 'physical_defense_down',
              ratio: 0.3,
              duration: 3
            });
        }
      }
    }
    if (!ultimate && connected) {
      state.attacks++;
      actor.gainEnergy(skill.energyGain);
    }
    if (ultimate && actor.sect === 'NgaMi')
      for (const ally of this.allies(actor))
        this.statuses.cleanse(ally, ['stun', 'charm', 'taunt']);
  }
}
