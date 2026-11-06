import { deepFreeze } from './DataUtils.js';
import { SECTS } from './SectsData.js';
import { HERO_SKILLS } from './HeroSkillsData.js';

const variants = {
  ThieuLam: [
    { name: 'Kim Cang Trấn Sơn', type: 'physical', targetType: 'enemy_area', dmgMultiplier: 2.6, effects: [{ type: 'area_damage', width: 3, height: 3 }, { type: 'stun', duration: 2 }] },
    { name: 'Bất Hoại Kim Thân', type: 'physical', targetType: 'self', dmgMultiplier: 0, effects: [{ type: 'shield', maxHpRatio: .5, duration: 6 }, { type: 'melee_reflect', ratio: .25, duration: 6 }] }
  ],
  VoDang: [
    { name: 'Lưỡng Nghi Kiếm Trận', type: 'magical', targetType: 'enemy_area', dmgMultiplier: 3.2, effects: [{ type: 'area_damage', width: 3, height: 3 }] },
    { name: 'Thái Cực Vô Cực', type: 'magical', targetType: 'self', dmgMultiplier: 0, effects: [{ type: 'shield', maxHpRatio: .45, duration: 7 }] }
  ],
  CaiBang: [
    { name: 'Đả Cẩu Trấn Giang Hồ', type: 'physical', targetType: 'enemy_area', dmgMultiplier: 3.4, effects: [{ type: 'area_damage', width: 3, height: 3 }, { type: 'stun', duration: 1 }] },
    { name: 'Túy Bộ Hộ Thân', type: 'physical', targetType: 'self', dmgMultiplier: 0, effects: [{ type: 'dodge_up', ratio: .4, duration: 6 }, { type: 'shield', maxHpRatio: .4, duration: 6 }] }
  ],
  NgaMi: [
    { name: 'Cửu Âm Liên Châm', type: 'magical', targetType: 'enemy_area', dmgMultiplier: 3.4, effects: [{ type: 'area_damage', width: 3, height: 3 }] },
    { name: 'Liên Hoa Phổ Độ', type: 'magical', targetType: 'all_allies', dmgMultiplier: 0, effects: [{ type: 'heal', scalingStat: 'magicalAtk', multiplier: 1.8 }, { type: 'heal_over_time', scalingStat: 'magicalAtk', multiplier: .6, duration: 5, tickInterval: 1 }] }
  ],
  DuongMon: [
    { name: 'Vạn Tiễn Bách Độc', type: 'physical', targetType: 'enemy_area', dmgMultiplier: 2.8, effects: [{ type: 'area_damage', width: 3, height: 3 }, { type: 'poison', stacks: 2, duration: 5, tickInterval: 1 }] },
    { name: 'Ảnh Bộ Tàng Phong', type: 'physical', targetType: 'self', dmgMultiplier: 0, effects: [{ type: 'dodge_up', ratio: .5, duration: 6 }, { type: 'shield', maxHpRatio: .25, duration: 6 }] }
  ]
};
const descriptions = {
  ThieuLam: ['Đánh vùng 3×3 với 260% ngoại công, gây choáng 2 giây.', 'Khiên bằng 50% HP tối đa và phản 25% sát thương cận chiến trong 6 giây.'],
  VoDang: ['Kiếm trận vùng 3×3, gây 320% nội công.', 'Tạo khiên bằng 45% HP tối đa trong 7 giây.'],
  CaiBang: ['Đánh vùng 3×3 với 340% ngoại công, gây choáng 1 giây.', 'Tăng 40% né tránh và tạo khiên 40% HP tối đa trong 6 giây.'],
  NgaMi: ['Liên châm vùng 3×3 gây 340% nội công.', 'Hồi ngay 180% nội công cho toàn đội, rồi hồi 60% nội công mỗi giây trong 5 giây.'],
  DuongMon: ['Đánh vùng 3×3 với 280% ngoại công, gây thêm 2 tầng độc trong 5 giây.', 'Tăng 50% né tránh và tạo khiên 25% HP tối đa trong 6 giây.']
};
export const SKILL_TREES = deepFreeze(Object.fromEntries(Object.keys(SECTS).map(sect => {
  const attack = ['VoDang', 'NgaMi'].includes(sect) ? 'magicalAtk' : 'physicalAtk';
  const nodes = [];
  for (const [index, branch] of ['attack', 'guard'].entries()) {
    const names = branch === 'attack' ? ['Công pháp nhập môn', (['VoDang', 'NgaMi'].includes(sect) ? 'Chân khí tinh thông' : 'Kình lực tinh thông'), 'Hội tâm bí quyết', variants[sect][index].name] : ['Dưỡng sinh nhập môn', 'Hộ thể tinh thông', 'Thân pháp bí quyết', variants[sect][index].name];
    const bonuses = branch === 'attack' ? [{ [attack]: 15 }, { [attack]: 25 }, { critRate: .08 }, { [attack]: 30 }] : [{ maxHp: 100 }, { physicalDef: 12, magicalDef: 12 }, { maxHp: 200, dodgeRate: .05 }, { maxHp: 250 }];
    for (let tier = 1; tier <= 4; tier++) {
      nodes.push({ id: `${sect}_t${tier}_${branch}`, sect, tier, branch, name: names[tier - 1],
        minLevel: [1, 3, 5, 8][tier - 1], cost: [1, 1, 2, 3][tier - 1],
        prerequisites: tier === 1 ? [] : [`${sect}_t${tier - 1}_${branch}`], stats: bonuses[tier - 1],
        description: tier === 4 ? `${descriptions[sect][index]} Chỉ chọn một tuyệt kỹ tầng 4.` : (branch === 'attack' ? 'Tăng khả năng tấn công theo nhánh môn phái.' : 'Tăng sức bền và khả năng phòng thủ.'),
        exclusiveGroup: tier === 4 ? 'ultimate' : null,
        ...(tier === 4 ? { ultimate: { ...structuredClone(HERO_SKILLS[sect].ultimate), ...variants[sect][index], description: descriptions[sect][index], id: `hero_${sect}_t4_${branch}` } } : {}) });
    }
  }
  const balancedNames=['Hợp khí nhập môn','Công thủ tương hỗ','Bền nhịp giao tranh','Trung Hòa Hộ Trận'];
  const balancedStats=[{[attack]:8,maxHp:60},{[attack]:12,physicalDef:8,magicalDef:8},{maxHp:100,attackSpeed:.04},{[attack]:18,maxHp:140}];
  for(let tier=1;tier<=4;tier++)nodes.push({id:`${sect}_t${tier}_balanced`,sect,tier,branch:'balanced',name:balancedNames[tier-1],minLevel:[1,3,5,8][tier-1],cost:[1,1,2,3][tier-1],prerequisites:tier===1?[]:[`${sect}_t${tier-1}_balanced`],stats:balancedStats[tier-1],description:tier===4?'Đánh vùng với 160% công kích chủ đạo, tạo khiên 20% HP cho bản thân trong 5 giây. Chỉ chọn một tuyệt kỹ tầng 4.':'Kết hợp công kích và chống chịu, phù hợp đội hình thiếu người giữ nhịp.',exclusiveGroup:tier===4?'ultimate':null,...(tier===4?{ultimate:{...structuredClone(HERO_SKILLS[sect].ultimate),id:`hero_${sect}_t4_balanced`,name:'Trung Hòa Hộ Trận',type:['VoDang','NgaMi'].includes(sect)?'magical':'physical',targetType:'enemy_area',dmgMultiplier:1.6,effects:[{type:'area_damage',width:3,height:3},{type:'shield',recipient:'caster',maxHpRatio:.2,duration:5}]}}:{})});
  return [sect, nodes.sort((a, b) => a.tier - b.tier || a.branch.localeCompare(b.branch))];
})));
export const SKILLS_BY_ID = deepFreeze(Object.fromEntries(Object.values(SKILL_TREES).flat().map(node => [node.id, node])));
