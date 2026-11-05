import {deepFreeze} from './DataUtils.js';
const npc=(id)=>`assets/images/npcs/${id}.webp`;
const companion=(id)=>`assets/images/companions/${id}.webp`;
const rows=[
 ['kha_van','Kha Vân','kha_van','Người kiểm hội và võ quan giữ việc đối chiếu','npc'],
 ['quan_chu','Quán chủ','quan_chu','Chủ quán Rồng Lửa, người giữ chỗ ăn và việc làm','npc'],
 ['be_na','Bé Na','be_na','Con Vũ Bình, học chữ và giúp người đọc giấy','npc'],
 ['ba_tu','Bà Tư','ba_tu','Người trồng lúa, đại diện nhu cầu trả thóc và giữ giống','npc'],
 ['vu_binh','Vũ Bình','vu_binh','Người chép sổ phải đối diện phần trách nhiệm của mình','npc'],
 ['tay_sai','Hà Lập','tay_sai','Người vũ trang chặn đường theo lệnh tuyến hàng','npc'],
 ['dao_tinh','Đạo Tĩnh','truong_xom','Người hướng dẫn ở Trúc Lâm, dạy quyền hỏi và cách dừng','npc'],
 ['tho_bay','Thợ Bảy','tho_bay','Người thợ kiểm vật liệu, sửa đồ và giữ quyền dừng lô lỗi','npc'],
 ['son_quan','Sơn Quân','doi_truong','Chưởng môn Hoa Lư, coi việc đưa đủ người về quan trọng hơn giữ cờ','npc'],
 ['bach_son','Bạch Sơn','ba_cu_giu_kho','Chưởng môn Tản Viên, giữ nền tảng và quyền nghỉ của người học','npc'],
 ['van_khach','Vân Khách','cha_tieu_muoi','Chưởng môn Vân Đồn, người giữ đường thư và lối rút','npc'],
 ['lien_su','Liên Sư','co_gai','Chưởng môn Thất Sơn, giữ thuốc để cứu người','npc'],
 ['companion_23','Mộc An','companion_23','Bạn học của Phong, cùng sửa lịch tập sau chấn thương','companion'],
 ['nguoi_danh_xe','Người đánh xe','nguoi_danh_xe','Người vận chuyển có thể xác nhận xe và phiếu hàng','npc'],
 ['nguoi_lai_do','Người lái đò','nguoi_lai_do','Người chỉ huy chuyến sông bằng hiểu biết con nước','npc'],
 ['companion_08','Mai Tước','companion_08','Người điều tuyến Vân Đồn, học minh bạch và nhận trách nhiệm với gia đình','companion'],
 ['do_mau','Đỗ Mậu','do_mau','Quan kho phải trả lời về những lệnh đã ký','npc'],
 ['trinh_nghiem','Trịnh Nghiêm','trinh_nghiem','Chủ Vạn Lợi, dùng nỗi sợ thiếu đói để biện hộ việc nắm đường lương','npc'],
 ['companion_01','Lôi Nam','companion_01','Người giữ bến có nỗi sợ bỏ người, học cách về cùng đội','companion'],
 ['nguoi_phu','Người phu','nguoi_phu','Người làm công có quyền đòi phần thiếu và chọn mức tham gia','npc'],
 ['companion_07','Ngô Sách','companion_07','Người giữ lịch trời Hải Vân, phân biệt quan sát với điều mong thấy','companion'],
 ['companion_10','Bách Bộ','companion_10','Người dạy cung, giữ giới hạn tầm bắn và quyền hạ cung','companion'],
 ['cam_tu','Cẩm Tú','cam_tu','Người tổ chức tín hiệu, tìm thân nhân và giữ công thợ sân khấu','npc'],
 ['cao_le','Cao Lệ','doc_le','Tướng xâm lược đánh đường lương, phải trả lời về lệnh của mình','npc'],
 ['luc_thu','Lục Thư','thu_lai','Người chép sổ để lại bản sao; cái chết mở oan án kho Đông','npc']
];
export const DAI_VIET_CAST=deepFreeze(rows.map(([id,name,assetId,role,kind])=>({id,name,assetId,role,portrait:kind==='npc'?npc(assetId):companion(assetId),kind})));
export const DAI_VIET_CAST_BY_ID=deepFreeze(Object.fromEntries(DAI_VIET_CAST.map(p=>[p.id,p])));
export const DAI_VIET_CAST_BY_NAME=deepFreeze(Object.fromEntries(DAI_VIET_CAST.map(p=>[p.name,p])));
export const PLOT_COMPANIONS=deepFreeze(['companion_23','companion_08','companion_01','companion_07','companion_10']);
export const PLOT_UNLOCKS=deepFreeze({companion_23:'D04H20',companion_08:'D05H10',companion_01:'D07H20',companion_10:'D11H18',companion_07:'D13H03'});
export const isDaiViet=session=>session?.storyProgress?.storyRevision===4;
function namedSkills(id,skills){const names={companion_01:['Côn Giữ Bến','Lôi Côn Phá Lộ'],companion_08:['Đoản Kích Vân Đồn','Hồng Ảnh Đổi Hướng']}[id];return !skills||!names?skills:{...skills,autoAttack:{...skills.autoAttack,name:names[0]},ultimate:{...skills.ultimate,name:skills.ultimate.id.endsWith('_bond_ult')?(id==='companion_01'?'Lôi Côn Hộ Bạn':'Hồng Ảnh Cản Đường'):names[1]}};}
export function storyPerson(session,person){const p=DAI_VIET_CAST_BY_ID[person?.id];return isDaiViet(session)&&p?({...person,name:p.name,portrait:p.portrait,skills:namedSkills(person.id,person.skills),storyRole:p.role,biography:p.role,recruitment:{...person.recruitment,description:PLOT_COMPANIONS.includes(p.id)?'Tham gia theo các hồi chính truyện; không cần trả phí mời lại.':person.recruitment?.description}}):person;}
export function storyPoolAllows(session,id){return !isDaiViet(session)||!PLOT_COMPANIONS.includes(id)||session.party.unlocked.includes(id);}
export function applyDaiVietName(unit){const p=DAI_VIET_CAST_BY_ID[unit.templateId??unit.id];if(p){unit.name=p.name;unit.portrait=p.portrait;unit.storyActorId=p.id;unit.canon='dai-viet';unit.skills=namedSkills(p.id,unit.skills);}return unit;}
