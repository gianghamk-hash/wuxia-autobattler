import {ENEMY_CELLS,strengthenEnemy} from '../combat/BattleRules6.js';
import { Companion } from '../entities/Companion.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { storyEnemy, applyStoryIdentity } from '../data/NPCData.js';
// Both scouting and the actual fight use these exact instances/stat transformations.
export function enemyLineup({ quest, encounter, count, grid, main,rules }) {
  const advanced=rules===6||quest?.canon==='dai-viet';
  const templates=advanced?Array.from({length:Math.max(4,Math.min(8,count))},(_,i)=>encounter.templates[i%encounter.templates.length]):[...encounter.templates];
  if(!advanced&&!encounter.guide)while(templates.length<count)templates.push(encounter.templates[templates.length%encounter.templates.length]);
  return templates.map((id, index) => {
    const unit = new Companion(id, {
      id: 'enemy_' + index,
      team: 'enemy',
      level: encounter.level
    });
    unit.stats.maxHp = Math.round(unit.stats.maxHp * encounter.hpScale);
    unit.stats.hp = unit.stats.maxHp;
    unit.stats.physicalAtk *= encounter.attackScale;
    unit.stats.magicalAtk *= encounter.attackScale;
    // Random headcounts and three boss waves should keep a four-troop
    // aggregate power budget instead of multiplying boss difficulty by eight.
    // Apply the budget before strengthenEnemy/campaign scaling so scouting,
    // retries and actual battles remain deterministic.
    if(advanced&&main&&(quest.chapter<=2||quest.boss)){
      const budget=4/templates.length;
      unit.stats.maxHp=Math.round(unit.stats.maxHp*budget);unit.stats.hp=unit.stats.maxHp;
      unit.stats.physicalAtk*=budget;unit.stats.magicalAtk*=budget;
    }
    unit.name = COMPANIONS_BY_ID[id].name;
    if (main) {
      const identity = storyEnemy(quest, index, templates.length);
      applyStoryIdentity(unit, identity);
      if(quest.canon==='dai-viet'){
        unit.canon='dai-viet';unit.storyActorId=identity.actorId;
        unit.name=identity.storyName??identity.name;
        if(identity.id==='tay_sai')unit.name=quest.chapter<=4?(quest.chapter===1||quest.chapter===4&&quest.episode===19?'Người chặn đường':'Đệ tử đối luyện'):quest.chapter>=13?'Quân Cao Lệ':'Hộ vệ Vạn Lợi';
        if(['duel','drill','breach'].includes(quest.combatType))unit.name=quest.chapter===7?'Người giữ bến · đối luyện':quest.chapter>=8?'Bạn tập':'Đệ tử đối luyện';
        unit.skills.autoAttack={...unit.skills.autoAttack,name:quest.chapter>=13?'Đoản Binh':'Đòn Cơ Bản'};
        unit.skills.ultimate={...unit.skills.ultimate,name:identity.id==='doc_le'?'Chiến Lệnh Phá Tuyến':'Liên Kích'};
      }
      if (identity.id === 'tay_sai') unit.name += ' ' + (index + 1);
    }
    if(advanced)strengthenEnemy(unit,{chapter:quest?.chapter??1,drill:['duel','drill','breach'].includes(quest?.combatType),index});
    grid?.place(unit,ENEMY_CELLS[index]);
    return unit;
  });
}

/** Stable across scouting, reload and retry, while new attempts get a fresh roster. */
export const encounterSeed = attempt => (20261105 + attempt * 2654435761) >>> 0;
export function storyEnemyCount(quest, seed, phase = 1) {
  let hash = 2166136261;
  for (const ch of `${quest.id}:${seed}:${phase}`) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0;
  hash ^= hash >>> 16;
  return 4 + (hash >>> 0) % 5;
}
export const storyWaveCounts = (quest, seed) => [1,2,3].map(phase => storyEnemyCount(quest, seed, phase));
