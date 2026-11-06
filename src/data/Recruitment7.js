import {deepFreeze} from './DataUtils.js';
import {EXPANSION_CAST} from './ExpansionCast.js';
export const STORY_RECRUITS7=deepFreeze([
 ['companion_03','D03H01','Thanh Lan'],['companion_51','D03H02','Tiểu Sáo'],['companion_53','D03H10','Thiết Yến'],['companion_52','D04H12','A Lụa'],['companion_23','D04H20','Mộc An'],['companion_54','D05H01','Vệ Thanh'],['companion_08','D05H10','Mai Tước'],['companion_57','D05H18','Nguyệt Ảnh Kiếm Cơ'],['companion_55','D06H01','Thanh Tâm'],['companion_01','D07H20','Lôi Nam'],['companion_59','D08H16','Kim Cang Thánh Mẫu'],['companion_58','D09H11','Hùng Côn Đại Hiệp'],['companion_56','D10H18','Truy Phong'],['companion_10','D11H18','Bách Bộ'],['companion_07','D13H03','Ngô Sách']
].map(([id,meet,name])=>({id,meet,name,chapter:Number(meet.slice(1,3))})));
export const storyRecruit7=id=>STORY_RECRUITS7.find(p=>p.id===id);
export const storyRecruitAt7=id=>STORY_RECRUITS7.find(p=>p.meet===id);
export const acquisitionText7=id=>{const p=storyRecruit7(id),extra=EXPANSION_CAST.find(p=>p.id===id);return p?'Chính truyện · chương '+p.chapter+' · hồi '+Number(p.meet.slice(4)):'Chỉ có tại Chiêu hiền quán'+(extra?' · mở sau lần gặp ở chương '+Number(extra.meet.slice(1,3))+' hồi '+Number(extra.meet.slice(4)):'');};
