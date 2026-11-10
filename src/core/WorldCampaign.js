import {applyAffinityMilestones} from '../data/AffinityMilestones.js';
import {applyCompanionCrossroad} from '../combat/CompanionBattleBranches.js';
import { mirrorPosition } from '../combat/BoardGeometry.js';
import {ENEMY_CELLS,strengthenEnemy,bossSequence} from '../combat/BattleRules6.js';
import {earlyDungeonFactor} from '../combat/EarlyDungeon.js';
import {modeEnemyMultiplier} from '../combat/EnemyDifficulty.js';
import {NEW_GEAR} from '../data/GearCatalog.js';
import { gainExperience } from '../entities/HeroBuild.js';
import { applyBondVariant } from '../data/BondsData.js';
import { Hero } from '../entities/Hero.js';
import { Companion } from '../entities/Companion.js';
import { GridSystem } from '../combat/GridSystem.js';
import { CombatEngine } from '../combat/CombatEngine.js';
import {
  QIGONG,
  PRIORITIES,
  SECT_ELEMENT,
  QIGONG_UNLOCKS,
  applyQigong
} from '../data/StrategyData.js';
import { DUNGEONS } from '../data/WorldData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import {isDaiViet,applyDaiVietName,DAI_VIET_CAST_BY_ID} from '../data/DaiVietCast.js';
import {heroAppearance,hasEnrollment} from '../data/HeroIdentity.js';
import { EQUIPMENT } from '../data/EquipmentData.js';
import {
  count,
  give,
  pay,
  worldAction,
  log,
  makeDungeon,
  calendar,
  resetCalendar,
  teamSnapshot,
  encodeTeam,
  decodeTeam,
  teamId,
  validatePreparation
} from './WorldProgress.js';
import {useEntry} from './DungeonEntries.js';
const fail = (t) => {
  throw new Error(t);
};
function fromTeam(team, side, grid) {
  const units = [
    new Hero(team.hero.sect, {
      profile: team.hero,
      inventory: team.inventory,
      id: side === 'home' ? 'hero' : 'enemy_hero',
      team: side
    }),
    ...team.active.map(
      (id) =>
        new Companion(id, {
          id: side === 'home' ? id : `enemy_${id}`,
          team: side,
          rank: team.ranks?.[id],
          level: team.level
        })
    )
  ];
  for (const u of units) {
    applyBondVariant(u, team.variants?.[u.templateId] ?? 'base');
    applyAffinityMilestones(u,team.affinityLevels?.[u.templateId]??((team.maxAffinity??[]).includes(u.templateId)?100:0));
    const original =
        u.id === 'enemy_hero' ? 'hero' : u.id.replace(/^enemy_/, ''),
      p = team.formation[original];
    u.sect = team.tactics.affiliations[original] ?? u.sect;
    u.targetPriority = team.tactics.priorities[original] ?? 'nearest';
    if (side === 'enemy') {
      applyQigong(u, team.tactics.qigong);
      u.stats.hp = u.stats.maxHp;
    }
    grid.place(u, side === 'home' ? p : mirrorPosition(p));
  }
  return units;
}
export const worldMethods = {
  recruitFee(q) {
    return ['recruit_01', 'recruit_03'].includes(q.id)
      ? 0
      : 15 + q.act * 10 + Number(q.id.slice(-2)) * 2;
  },
  action(action, arg) {
    let message;
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter) fail('Hãy xử lý trận đang chờ.');
      message = worldAction(s, action, arg, this.now());
    }, 'world');
    return message;
  },
  setTactics(patch) {
    if (this.running) {
      if (
        Object.keys(patch).length !== 1 ||
        typeof patch.autoUltimate !== 'boolean'
      )
        fail('Chỉ được đổi tự động/thủ công trong trận.');
      const next = this.snapshot();
      next.adventure.tactics.autoUltimate = patch.autoUltimate;
      if (next.storyProgress.pendingEncounter?.preparation)
        next.storyProgress.pendingEncounter.preparation.tactics.autoUltimate =
          patch.autoUltimate;
      this.battle.autoUltimate = patch.autoUltimate;
      this._commit(next, 'combat-option');
      return;
    }
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter)
        fail('Thiết lập đã khóa theo trận đang chờ.');
      const t = s.adventure.tactics;
      for (const key of Object.keys(patch))
        if (!['qigong', 'food', 'autoUltimate', 'priorities'].includes(key))
          fail('Tùy chọn không hợp lệ.');
      if (
        QIGONG_UNLOCKS[patch.qigong] &&
        !s.adventure.clears.includes(QIGONG_UNLOCKS[patch.qigong])
      )
        fail('Cần vượt bí cảnh tương ứng để học khí công.');
      if (patch.food && count(s, patch.food) < 1)
        fail('Chưa sở hữu món chuẩn bị.');
      Object.assign(t, structuredClone(patch));
      validatePreparation({
        tactics: t,
        training: s.adventure.training,
        forging: s.adventure.forging
      });
    }, 'tactics');
  },
  prepareUnits(units, pending) {
    const prep = pending.preparation ?? {
      tactics: this.session.adventure.tactics,
      training: 0,
      forging: 0
    };
    for (const u of units.filter((u) => u.team === 'home')) {
      if(isDaiViet(this.session)&&u.id==='hero')Object.assign(u,heroAppearance(this.session));
      if(this.session?.party?.active?.includes(u.id)&&u.affinityStage===undefined){const locked=pending.preparation?.maxAffinity??(pending.kind==='dungeon'?this.session.adventure.dungeon?.squad.maxAffinity:undefined);const affinity=pending.preparation?.affinityLevels?.[u.id]??this.session.companionsAffinity[u.id]??0;applyAffinityMilestones(u,locked&&!locked.includes(u.templateId)?Math.min(99.999,affinity):affinity);}
      if (!u.bondConfigured) applyBondVariant(u, this.session?.journey?.bonds.modes[u.templateId] ?? 'base');
      if(u.templateId?.startsWith('companion_') && u.affinityStage>=75){
        const branch=this.session?.journey?.companionJourneys?.crossroads?.[u.templateId];
        if(branch)applyCompanionCrossroad(u,branch);
      }
      if(isDaiViet(this.session)&&u.id!=='guide')applyDaiVietName(u);
      u.sect = isDaiViet(this.session)&&u.id==='hero'&&!hasEnrollment(this.session)?null:prep.tactics.affiliations[u.id] ?? u.sect;
      u.targetPriority =
        prep.tactics.priorities[u.id] ?? u.targetPriority ?? 'nearest';
      u.element = u.sect==='TuDo'?(u.element??'Tho'):SECT_ELEMENT[u.sect];
      if (u.id === 'hero') {
        u.stats.maxHp *= 1 + prep.training * 0.02 + Math.min(20,(this.session?.adventure?.guild?.contributions??0)) * .015;
        u.stats.physicalAtk *= 1 + prep.training * 0.01 + prep.forging * 0.03 + Math.min(20,(this.session?.adventure?.guild?.contributions??0)) * .01;
        u.stats.magicalAtk *= 1 + prep.training * 0.01 + prep.forging * 0.03 + Math.min(20,(this.session?.adventure?.guild?.contributions??0)) * .01;
      }
      applyQigong(u, prep.tactics.qigong);
      if (prep.tactics.food === 'tea')
        u.preparedEnergy = (u.preparedEnergy ?? 0) + 0.15;
      if (prep.tactics.food === 'food_fish') u.stats.maxHp *= 1.08;
      if (prep.tactics.food === 'elixir') u.stats.maxHp *= 1.1;
      u.stats.hp = u.stats.maxHp;
    }
  },
  exportTeam() {
    this._guard();
    return encodeTeam(teamSnapshot(this.session));
  },
  importTeam(code) {
    const team = decodeTeam(code.trim());
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter) fail('Hãy kết thúc trận đang chờ.');
      const id = teamId(team);
      if (s.adventure.arena.some((e) => e.id === id))
        fail('Đội hình này đã có trong danh sách.');
      if (s.adventure.arena.length >= 8)
        fail('Đã đủ 8 đội hình; hãy xóa một đội trước.');
      s.adventure.arena.push({ id, team });
      log(
        s,
        `Nhập đội hình của ${team.name}; đây là bản chụp để AI điều khiển, không phải trận trực tuyến.`,
        this.now()
      );
    }, 'world');
  },
  removeOpponent(id) {
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter) fail('Có trận đang chờ.');
      s.adventure.arena = s.adventure.arena.filter((e) => e.id !== id);
    }, 'world');
  },
  startArena(id) {
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter || s.adventure.dungeon)
        fail('Hãy xử lý hành trình đang dở.');
      if (
        !/^npc_[0-2]$/.test(id) &&
        !s.adventure.arena.some((e) => e.id === id)
      )
        fail('Đối thủ không có trong danh sách.');
      this._pending(s, 'arena', id);
    }, 'encounter');
    return this.retryEncounter();
  },
  startEscort(route) {
    this._mutate((s) => {
      if (
        !['safe', 'fast'].includes(route) ||
        s.storyProgress.pendingEncounter ||
        s.adventure.dungeon
      )
        fail('Chưa thể nhận chuyến tiêu.');
      if (s.adventure.daily.escorts >= 2)
        fail('Mỗi ngày chỉ có 2 chuyến tiêu.');
      pay(s, 'silver', route === 'safe' ? 10 : 20);
      s.adventure.daily.escorts++;
      s.adventure.escort = { route, level: s.hero.level };
      this._pending(s, 'escort', route);
      log(
        s,
        `Nhận tiêu tuyến ${route === 'safe' ? 'an toàn (cọc 10)' : 'đường tắt (cọc 20)'}.`,
        this.now()
      );
    }, 'encounter');
    return this.retryEncounter();
  },
  enterDungeon(id, weekly = false) {
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter) fail('Có trận chưa xử lý.');
      s.adventure.dungeon = makeDungeon(s, id, weekly, this.now());
      useEntry(s,id);
      log(
        s,
        `Vào ${id}${weekly ? ' · thử thách tuần' : ''}; đội hình và sinh lực được giữ riêng cho lượt này.`,
        this.now()
      );
    }, 'world');
  },
  leaveDungeon() {
    this._mutate((s) => {
      if (s.storyProgress.pendingEncounter)
        fail('Hãy rút lui khỏi trận trước.');
      if (!s.adventure.dungeon) fail('Không có bí cảnh đang đi.');
      s.adventure.dungeon = null;
      log(s, 'Rời bí cảnh, không hoàn lại phí vào.', this.now());
    }, 'world');
  },
  chooseRoom(index, option = 0) {
    this._guard();
    let combat = false;
    this._mutate((s) => {
      const d = s.adventure.dungeon;
      if (
        !d ||
        s.storyProgress.pendingEncounter ||
        ![0, 1].includes(index) ||
        ![0, 1].includes(option)
      )
        fail('Lối đi không hợp lệ.');
      const type = d.rooms[d.floor][index];
      d.selected = index;
      if (type === 'battle' || type === 'boss') {
        this._pending(s, 'dungeon', d.id);
        combat = true;
        return;
      }
      if (type === 'treasure') {
        give(s, 'ore', 1);
        give(s, 'herb', 1);
        give(
          s,
          'silver',
          Math.max(1, Math.round((6 + d.floor * 2) * d.rewardScale))
        );
      }
      if (type === 'rest') {
        if (option === 0) pay(s, 'silver', 10);
        for (const id of Object.keys(d.hp))
          if (d.hp[id] > 0)
            d.hp[id] = Math.min(1, d.hp[id] + (option === 0 ? 0.25 : 0.08));
      }
      if (type === 'event') {
        if (option === 0) {
          pay(s, 'silver', 5);
          give(s, 'herb', 2);
        } else {
          for (const id of Object.keys(d.hp))
            if (d.hp[id] > 0) d.hp[id] = Math.max(0.02, d.hp[id] - 0.12);
          give(s, 'ore', 2);
        }
      }
      log(
        s,
        `Bí cảnh tầng ${d.floor + 1}: ${type}, chọn ${option === 0 ? 'thận trọng' : 'mạo hiểm'}.`,
        this.now()
      );
      d.floor++;
      d.selected = null;
    }, 'world');
    return combat ? this.retryEncounter() : null;
  },
  _worldBattle(pending) {
    const s = this.session,
      grid = new GridSystem(),
      d = s.adventure.dungeon,
      team = pending.kind === 'dungeon' ? d.squad : teamSnapshot(s);
    // Arena and escort fights must replay the original ready-screen affinity
    // snapshot, not the potentially changed live session after a reload.
    if(pending.kind!=='dungeon'&&pending.preparation){
      const levels=pending.preparation.affinityLevels,locked=pending.preparation.maxAffinity;
      if(levels||locked){
        team.affinityLevels=Object.fromEntries(team.active.map(id=>[id,levels?.[id]??(locked?.includes(id)?100:Math.min(99.999,team.affinityLevels?.[id]??0))]));
        team.maxAffinity=team.active.filter(id=>team.affinityLevels[id]>=100);
      }
    }
    const units = fromTeam(team, 'home', grid);
    let title = '',
      level = s.hero.level,
      templates = ['companion_05', 'companion_04', 'companion_03'],
      scale = 1;
    if (pending.kind === 'arena') {
      const imported = s.adventure.arena.find((e) => e.id === pending.questId);
      if (imported) {
        units.push(...fromTeam(imported.team, 'enemy', grid));
        title = `Đại hội · ${imported.team.name}`;
      } else {
        const n = Number(pending.questId.slice(-1));
        templates = [
          ['companion_05', 'companion_03', 'companion_10'],
          ['companion_14', 'companion_06', 'companion_01'],
          ['companion_02', 'companion_09', 'companion_12']
        ][n];
        title = `Đại hội · đội AI bản địa ${n + 1}`;
        level = Math.min(20, Math.max(1, s.hero.level + n - 1));
        scale = 0.85 + n * 0.1;
      }
    }
    if (pending.kind === 'escort') {
      const safe = pending.questId === 'safe';
      title = safe ? 'Tiêu cục · đường quan' : 'Tiêu cục · đường tắt U Minh';
      scale = safe ? 0.25 : 0.4;
      level = Math.max(1, s.hero.level - (safe ? 3 : 2));
      templates = safe
        ? ['companion_01', 'companion_04']
        : ['companion_14', 'companion_05', 'companion_12'];
    }
    if (pending.kind === 'dungeon') {
      const def = DUNGEONS.find((v) => v.id === d.id),
        boss = d.rooms[d.floor][d.selected] === 'boss';
      title = `${def.name} · tầng ${d.floor + 1}/${d.mode==='tower'?100:def.floors}${boss ? ' · TRẤN THỦ' : ''}`;
      level = Math.min(
        20,
        def.level + Math.floor(d.floor/(d.mode==='tower'?7:2))+(d.weekly?2:0)
      );
      scale=d.mode==='tower'?(.48+d.floor*.0045)*(boss?.8:1)*(d.weekly?1.1:1):(.65+d.floor*.045)*(boss?1.25:1);
      if(isDaiViet(s))scale*=earlyDungeonFactor(d.floor);
      templates = [
        ['companion_05', 'companion_06', 'companion_08'],
        ['companion_14', 'companion_09', 'companion_01'],
        ['companion_02', 'companion_03', 'companion_13'],
        ['companion_18', 'companion_04', 'companion_10'],
        ['companion_14', 'companion_07', 'companion_19']
      ][DUNGEONS.indexOf(def)];
    }
    if(pending.kind==='chapterBoss'){
      const c=Number(pending.questId),q=this.catalog.quests.filter(q=>q.chapter===c&&q.encounter).at(-1);
      title=`Ôn trận · Boss chương ${c}`;level=Math.min(20,c+1);scale=.60+c*.008;
      templates=q?.enemyId==='companion_01'?['companion_01','companion_06','companion_05']:['companion_05','companion_04','companion_06'];
    }
    const chapter=pending.kind==='chapterBoss'?Number(pending.questId):Math.min(20,Math.floor((d?.floor??0)/5)+1),isBoss=pending.kind==='chapterBoss'||pending.kind==='dungeon'&&d.mode==='tower'&&d.rooms[d.floor][d.selected]==='boss';
    const targetCount=isBoss?4:pending.kind==='dungeon'&&d.mode==='tower'?Math.min(8,4+Math.floor(d.floor/20)):Math.min(8,Math.max(4,team.active.length+1));
    for(let i=units.filter(u=>u.team==='enemy').length;i<targetCount;i++){
      const unit=new Companion(templates[i%templates.length],{id:`enemy_${i}`,team:'enemy',level});unit.stats.maxHp=Math.round(unit.stats.maxHp*scale);unit.stats.hp=unit.stats.maxHp;unit.stats.physicalAtk*=scale;unit.stats.magicalAtk*=scale;grid.place(unit,ENEMY_CELLS.find(p=>!grid.at(p)));units.push(unit);
    }
    units.filter(u=>u.team==='enemy').forEach((u,index)=>{strengthenEnemy(u,{chapter,index});if(isDaiViet(s))u.canon='dai-viet';});
    // Apply each side's preparation once. Shared teams cannot import currency, training or paid buffs.
    this.prepareUnits(units, pending);
    if (pending.kind === 'dungeon') {
      for (const unit of units.filter((u) => u.team === 'home'))
        unit.stats.hp = unit.stats.maxHp * (d.hp[unit.id] ?? 0);
      grid.removeDead();
    }
    this.battleToken = pending.token;
    this.lastResult = null;
    const nextBossWave=isBoss?bossSequence(units.filter(u=>u.team==='enemy'),chapter,pending.kind==='dungeon'?{title:title.replace(' · TRẤN THỦ',''),training:false,skin:d.floor<30?'boss_river':d.floor<60?'boss_captain':'boss_marshal',normalizeWaveSize:true,waveCounts:[4,4,5]}:{normalizeWaveSize:true,waveCounts:[4,4,5]}):null;
    this.battle = new CombatEngine({
      enemyStatMultiplier:isDaiViet(s)?modeEnemyMultiplier(pending.kind,pending.kind==='chapterBoss'?Number(pending.questId):s.storyProgress.currentChapter):1,
      enemyLimit:8,nextBossWave,maxDuration:isBoss?360:150,
      units,
      grid,
      seed: pending.seed,
      onEvent: this.onBattleEvent
    });
    this.battle.autoUltimate =
      pending.preparation?.tactics.autoUltimate ?? true;
    this.battle.encounterName = title;
    this.battle.start();
    return this.battle;
  },
  settleWorld(s, pending, result, rewards) {
    const w = s.adventure,
      won = result.winner === 'home';
    if (pending.kind === 'escort') {
      if (won) {
        rewards.xp = 90 + s.hero.level * 10;
        rewards.silver = pending.questId === 'safe' ? 75 : 150;
        give(s, 'silver', rewards.silver);
        give(s, 'ore', pending.questId === 'safe' ? 3 : 5);
        give(s, 'herb', 1);
      }
      w.escort = null;
    }
    if (
      pending.kind === 'arena' &&
      won &&
      !w.weekly.arenaClaims.includes(pending.questId) &&
      w.weekly.arenaClaims.length < 3
    ) {
      w.weekly.arenaClaims.push(pending.questId);
      rewards.xp = 40 + s.hero.level * 5;
      rewards.silver = 25 + s.hero.level * 2;
      give(s, 'silver', rewards.silver);
      give(s, 'ore', 2);
    }
    if (pending.kind === 'dungeon') {
      const d = w.dungeon;
      if (!won) {
        w.dungeon = null;
        log(
          s,
          'Đoàn thám hiểm rút khỏi bí cảnh; phí vào và món chuẩn bị đã tiêu hao.',
          this.now()
        );
        return;
      }
      for (const unit of this.battle.units.filter((u) => u.team === 'home'))
        d.hp[unit.id] = Math.max(0, Math.min(1,unit.hpRatio+(d.mode==='tower'?.35:0)));
      w.daily.floors++;
      rewards.xp = Math.max(
        10,
        Math.round((d.mode==='tower'?25+d.floor*4:40+d.floor*15)*d.rewardScale)
      );
      rewards.silver = Math.max(
        1,
        Math.round((d.mode==='tower'?12+d.floor*2:5+d.floor*3)*d.rewardScale)
      );
      give(s, 'silver', rewards.silver);
      d.floor++;
      if(d.mode==='tower'){
        w.towerBest??={};w.towerBest[d.id]=Math.max(w.towerBest[d.id]??0,d.floor);
        if(d.floor%10===0){for(const id of Object.keys(d.hp))d.hp[id]=1;rewards.checkpointRest=true;const rank=d.floor>=80?4:d.floor>=40?3:2,pool=NEW_GEAR.filter(e=>e.tier===rank),item=pool[(d.seed+d.floor)%pool.length];give(s,item.id,1);rewards.gear=[item.id];give(s,'ore',Math.ceil(d.floor/10));}
        if(d.floor%25===0)give(s,'essence',d.floor/25);
      }
      d.selected = null;
      const def = DUNGEONS.find((v) => v.id === d.id);
      if(d.floor===(d.mode==='tower'?100:def.floors)) {
        w.weekly.clears++;
        give(s, 'ore', 3);
        give(s, 'herb', 2);
        if (!w.clears.includes(d.id)) {
          w.clears.push(d.id);
          give(s, `secret_${d.id}`, 1);
          const rare = EQUIPMENT.find(
            (i) => i.sect === s.hero.sect && !count(s, i.id)
          );
          if (rare) give(s, rare.id, 1);
          log(
            s,
            `Lần đầu vượt ${def.name}: bí kíp ${def.relic} và trang bị hiếm (nếu còn món chưa có).`,
            this.now()
          );
        }
        if (d.weekly && !w.weeklyClears.includes(d.week)) {
          w.weeklyClears.push(d.week);
          w.weeklyClears = w.weeklyClears.slice(-30);
          give(s, 'silver', 80);
          give(s, 'essence', 1);
          rewards.silver += 80;
        }
        w.dungeon = null;
        log(
          s,
          `Hoàn tất ${def.name}. Sinh lực không hồi giữa các tầng chiến đấu.`,
          this.now()
        );
      }
    }
    if (rewards.xp) s.hero = gainExperience(s.hero, rewards.xp, s.inventory);
  }
};
