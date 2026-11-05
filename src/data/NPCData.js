import { deepFreeze } from './DataUtils.js';
import { DAI_VIET_CAST_BY_ID } from './DaiVietCast.js';
const records = [
  ['quan_chu', 'Quán chủ', 'Chủ quán Rồng Lửa', 'Người đã cho bạn chỗ ở và việc phụ bếp. Ông che chở khách trong quán.', ['Chủ quán']],
  ['ba_tu', 'Bà Tư', 'Người trồng lúa ở Thanh Khê', 'Bà giữ biên nhận đã nộp đủ thóc, nhưng vẫn bị đòi nợ và lấy ruộng.', []],
  ['be_na', 'Bé Na', 'Đứa trẻ phụ bếp', 'Na ở nhờ quán Rồng Lửa. Em đang chờ cha về ăn cơm.', []],
  ['truong_xom', 'Trưởng xóm', 'Người xác nhận giấy trong làng', 'Ông biết những tờ giấy mà dân làng đã bị yêu cầu điểm chỉ.', []],
  ['nguoi_danh_xe', 'Người đánh xe', 'Người chở thóc thuê', 'Anh chỉ nhận chở hàng, không phải kẻ áp giải dân làng.', []],
  ['doi_truong', 'Đội trưởng', 'Chỉ huy đội thu tô', 'Hắn dẫn người đến đòi cuốn sổ ở quán Rồng Lửa.', ['Đội trưởng thu tô']],
  ['nguoi_lai_do', 'Người lái đò', 'Người đưa khách qua bến Liễu', 'Bà biết các trạm gác và thuyền chở thóc trên sông.', []],
  ['vu_binh', 'Vũ Bình', 'Người chép sổ thu tô', 'Ông là người có thể giải thích những con số bị sửa trong sổ.', []],
  ['nguoi_phu', 'Người phu', 'Người bị bắt chở thóc trả nợ', 'Ông chứng kiến cách lính gác đối xử với đoàn phu.', []],
  ['doc_le', 'Đốc Lệ', 'Trấn thủ kho U Minh', 'Ông chỉ huy lính giữ kho và đoàn phu trong rừng.', ['Trấn thủ']],
  ['cha_tieu_muoi', 'Cha Tiểu Muội', 'Người trong đoàn phu mất tích', 'Tiểu Muội đi tìm ông sau khi ông bị đưa vào U Minh.', []],
  ['ba_cu_giu_kho', 'Bà cụ giữ kho', 'Người trông kho thóc của dân', 'Bà biết kho đã chứa gì trước khi đội lính đến tiếp quản.', []],
  ['kha_van', 'Kha Vân', 'Võ sĩ hội võ Bình Định', 'Nàng dự hội võ để tìm cách trả món nợ của mình.', []],
  ['thu_lai', 'Thư lại', 'Người ghi chép trong kho sổ', 'Anh đếm thóc và chép giấy; những gì anh nhớ giúp đối chiếu sổ.', []],
  ['tho_giay', 'Thợ giấy', 'Người làm giấy cho nha kho', 'Chị nhận ra loại giấy và ngày các lô giấy được giao.', []],
  ['tho_bay', 'Thợ Bảy', 'Thợ rèn bên thành Hoa Lư', 'Ông làm vũ khí và biết khuôn dấu đã được dùng ở xưởng.', ['Thợ rèn']],
  ['co_gai', 'Con gái Đỗ Mậu', 'Người bệnh trong phủ quan trấn', 'Nàng đang dưỡng bệnh. Nàng không quyết định những việc cha đã làm.', ['Cô gái']],
  ['do_mau', 'Đỗ Mậu', 'Quan trấn Hoa Lư', 'Các lệnh thu thóc có chữ ký của ông. Nhóm cần hỏi ông đã ký những gì.', ['Trấn quan']],
  ['cam_tu', 'Cẩm Tú', 'Nghệ sĩ biểu diễn trên Yên Tử', 'Nàng biết cách sân khấu, dây kéo và khói được vận hành.', []],
  ['trinh_nghiem', 'Trịnh Nghiêm', 'Chủ thương hội Vạn Lợi', 'Ông có tiền, đoàn hộ vệ và ảnh hưởng tới các hội võ.', ['Minh chủ']],
  ['tay_sai', 'Tay sai thu tô', 'Lính thuê của đội thu tô', 'Một thành viên đội vũ trang đi thu thóc và truy bắt người giữ sổ.', ['Lính thu tô', 'Hộ vệ']]
];
export const NPCS = deepFreeze(records.map(([id, name, role, bio, aliases]) => ({ id, name, role, bio, aliases, portrait: `assets/images/npcs/${id}.webp` })));
export const NPCS_BY_ID = deepFreeze(Object.fromEntries(NPCS.map(n => [n.id, n])));
export function findNPC(name) { return NPCS.find(n => n.name === name || n.aliases.includes(name)); }

/** Main-story opponents have story identities without changing their battle stats. */
export function storyEnemy(quest, index, count) {
  if(quest.canon==='dai-viet'){
    const actor=DAI_VIET_CAST_BY_ID[index===count-1?quest.enemyId:'tay_sai']??DAI_VIET_CAST_BY_ID.tay_sai;
    return{...actor,id:actor.assetId,storyName:actor.name,actorId:actor.id};
  }
  const boss = index === count - 1 && quest.boss;
  const id = boss ? ({ 1: 'doi_truong', 4: 'doc_le', 5: 'kha_van', 8: 'do_mau', 11: 'trinh_nghiem' }[quest.chapter] ?? 'tay_sai') : 'tay_sai';
  return NPCS_BY_ID[id];
}
const moves = {
  quan_chu: ['Muôi Gỗ', 'Nhất Muôi Giữ Quán'],
  doi_truong: ['Đao Lệnh Thu Tô', 'Huyết Lệnh Vây Làng'],
  doc_le: ['Trấn Lâm Chưởng', 'U Minh Khốn Trận'],
  kha_van: ['Vân Kiếm', 'Xích Vân Quyết Đấu'],
  do_mau: ['Quan Ấn', 'Thiết Ấn Phong Môn'],
  trinh_nghiem: ['Hắc Phiến', 'Vạn Lợi Khóa Mệnh'],
  tay_sai: ['Côn Thu Tô', 'Áp Giải Liên Kích']
};
export const NPC_MOVES = deepFreeze(moves);
export function applyStoryIdentity(unit, npc) {
  unit.characterId = npc.id; unit.portrait = npc.portrait; unit.name = npc.name;
  if (moves[npc.id]) {
    unit.skills.autoAttack = { ...unit.skills.autoAttack, id: `npc_${npc.id}_basic`, name: moves[npc.id][0] };
    unit.skills.ultimate = { ...unit.skills.ultimate, id: `npc_${npc.id}_ult`, name: moves[npc.id][1] };
    const names = { stun: 'điểm huyệt', poison: 'độc', bleed: 'chảy máu', taunt: 'khiêu khích', shield: 'hộ thuẫn', melee_reflect: 'phản chấn', multi_hit: 'liên kích', area_damage: 'đánh vùng', row_damage: 'đánh theo hàng', blink: 'áp sát', execute: 'kết liễu', internal_injury: 'nội thương', attack_up: 'tăng công', dodge_up: 'né tránh', heal: 'hồi máu', heal_over_time: 'hồi máu dần', energy_restore: 'tiếp nội lực', piercing_projectiles: 'ám khí xuyên mục tiêu' };
    const effects = unit.skills.ultimate.effects.map(e => names[e.type]).filter(Boolean);
    unit.skills.ultimate.description = `${moves[npc.id][1]} của ${npc.name}${effects.length ? ': ' + effects.join(', ') : '.'}`;
  }
}
