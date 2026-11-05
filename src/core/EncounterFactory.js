import { Companion } from '../entities/Companion.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { storyEnemy, applyStoryIdentity } from '../data/NPCData.js';
// Both scouting and the actual fight use these exact instances/stat transformations.
export function enemyLineup({ quest, encounter, count, grid, main }) {
  const templates = [...encounter.templates];
  if (!encounter.guide)
    while (templates.length < count)
      templates.push(
        encounter.templates[templates.length % encounter.templates.length]
      );
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
    unit.name = COMPANIONS_BY_ID[id].name;
    if (main) {
      const identity = storyEnemy(quest, index, templates.length);
      applyStoryIdentity(unit, identity);
      if(quest.canon==='dai-viet'){
        unit.canon='dai-viet';unit.storyActorId=identity.actorId;
        unit.name=identity.storyName??identity.name;
        if(identity.id==='tay_sai')unit.name=quest.chapter<=4?(quest.chapter===1||quest.chapter===4&&quest.episode===19?'Người chặn đường':'Đệ tử đối luyện'):quest.chapter>=13?'Quân Cao Lệ':'Hộ vệ Vạn Lợi';
        unit.skills.autoAttack={...unit.skills.autoAttack,name:quest.chapter>=13?'Đoản Binh':'Đòn Cơ Bản'};
        unit.skills.ultimate={...unit.skills.ultimate,name:identity.id==='doc_le'?'Chiến Lệnh Phá Tuyến':'Liên Kích'};
      }
      if (identity.id === 'tay_sai') unit.name += ' ' + (index + 1);
    }
    grid?.place(
      unit,
      [
        { x: 3, y: 1 },
        { x: 5, y: 0 },
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 0 },
        { x: 5, y: 2 }
      ][index]
    );
    return unit;
  });
}
