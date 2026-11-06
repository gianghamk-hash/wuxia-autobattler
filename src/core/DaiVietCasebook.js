import {DAI_VIET_QUESTS,resolveDaiVietQuest} from '../data/DaiVietStoryData.js';
import {DAI_VIET_CAST_BY_ID,DAI_VIET_CAST_BY_NAME} from '../data/DaiVietCast.js';
const records=[
 ['scale','D01H13','Đối chiếu','Hai loại cân','Túi thóc và phiếu nhập chưa khớp; chưa đủ để chỉ tên người lấy thóc.',['ba_tu','vu_binh']],
 ['routes','D02H08','Vật chứng','Năm viện cùng một đoàn hàng','Năm sổ học phí ghi cùng đoàn buôn; lương chưa tới đủ.',['vu_binh']],
 ['wounded','D03H06','Trách nhiệm','Lịch tập đã làm người học đau','Phong nhận lỗi tăng nhịp và nhận gánh nước cho Mộc An.',['companion_23']],
 ['stamp','D03H10','Vật chứng','Dấu trạm Vạn Lợi','Dây xe đã tháo và phiếu trạm nối cùng chuyến lương thiếu.',['tho_bay']],
 ['threebooks','D03H16','Đối chiếu','Ba trọng lượng khác nhau','Sổ viện, xe và trạm chưa thống nhất; một ngày bị nhòe vẫn để trống.',['vu_binh']],
 ['victim','D05H09','Sự việc','Lục Thư không còn trả lời được','Nhóm tới kho và rơi vào hiện trường đã bị sắp đặt; chưa biết người ra tay.',['luc_thu','companion_08']],
 ['mai','D05H15','Lời chứng','Mai của Vân Đồn','Mai nhận mình là người nhà tuyến thuyền; lấy giấy của Phong là việc phải sửa.',['companion_08']],
 ['lamp','D06H02','Đối chiếu','Giả thuyết đèn chưa đủ','Bấc khác nguồn khiến giờ giao đèn chưa chứng minh được phòng sáng hay tối.',['vu_binh']],
 ['alibi','D06H08','Đối chiếu','Các khoảng nhìn thấy giao nhau','Nhiều nhân chứng độc lập xác nhận Phong và Mai ở chợ trong một quãng bị tố ở kho.',['companion_08','kha_van']],
 ['clear','D06H15','Kết quả','Hủy lệnh giữ và sửa thông báo','Hai người được gỡ lệnh giữ; cái chết của Lục Thư vẫn đang điều tra.',['kha_van','luc_thu']],
 ['nam','D07H02','Đối chiếu','Lệnh bắt và sổ cứu người','Lôi Nam bị ghi cướp lương ở đêm có người xác nhận ông cứu thuyền.',['companion_01']],
 ['burn','D07H13','Vật chứng','Dầu từ kho Đông','Phiếu dầu trong đồ toán đốt bến có tên người nhận của Vạn Lợi.',['companion_01','trinh_nghiem']],
 ['copy','D07H14','Vật chứng','Bản sao thiếu trang cuối','Sổ nối lương viện và dự trữ biên giới; còn thiếu phần lệnh gốc.',['companion_01','companion_08']],
 ['oath','D08H16','Cam kết','Kết nghĩa không buộc cùng chết','Bộ ba giữ quyền phản đối và rời đội, nhận nghĩa vụ báo nguy cơ và bàn giao.',['companion_01','companion_08']],
 ['binh','D09H06','Trách nhiệm','Chữ ký Vũ Bình','Vũ Bình thừa nhận tham gia làm mã sổ và đã không hỏi khi có dấu hiệu bất thường.',['vu_binh','be_na']],
 ['twice','D09H10','Đối chiếu','Một lô, hai biên nhận','Hàng thật, tiền công và tuyến xe cho thấy nhiều biên nhận đã dùng hai lần.',['vu_binh','companion_08']],
 ['order','D09H11','Trách nhiệm','Lệnh có chữ ký quan kho','Đỗ Mậu phải giải thích phạm vi đã kiểm và người được giao thay.',['do_mau']],
 ['hai-van','D11H02','Vật chứng','Thư báo thiếu bị hoàn','Ngô Sách giữ thư và dấu hoàn, cho thấy trạm không được để báo tới nơi.',['companion_07']],
 ['sky','D11H11','Ghi chép','Hình cột và ánh sáng lạ','Nhật ký ghi những lần quan sát; chưa chứng minh có cổng trở về.',['companion_07']],
 ['mandate','D12H16','Cam kết','Quyền cầm cờ có thời hạn','Phong nhận điều phối cùng Mai và Lôi; người khác giữ quyền kiểm và thay.',['kha_van','companion_08','companion_01']],
 ['enemy','D13H03','Tin đã kiểm','Cờ Cao Lệ','Nhiều nguồn nhận ra lối đánh nhằm đường lương; quy mô quân còn phải đối chiếu.',['cao_le','companion_07']],
 ['leak','D13H05','Trách nhiệm','Vạn Lợi đã giao tin tuyến','Nghiêm nhận bán tin giá lương; mức độ thông đồng và hậu quả tiếp tục được hỏi.',['trinh_nghiem']],
 ['lost','D14H11','Kết quả','Năm cửa mất người giữ','Nguồn sống sót xác nhận năm chưởng môn không còn; mỗi vị trí cuối được giữ trong hồ sơ.',['dao_tinh','son_quan','bach_son','van_khach','lien_su']],
 ['fault','D14H17','Trách nhiệm','Lệnh Phong được xem lại','Phong công khai phần lệnh phát sớm; việc điều phối tiếp có người kiểm.',['kha_van']],
 ['army','D15H02','Cam kết','Quyền dừng lệnh chung','Cơ chế mới có người kiểm nguồn, ca thay và cách báo nơi bị ảnh hưởng.',['companion_08','companion_01']],
 ['repair','D15H12','Kết quả','Mai trả phần đã làm người khác chịu','Mai hoàn trả công và giữ quyền rời việc của người từng bị phạt thay.',['companion_08','nguoi_phu']],
 ['murder','D17H12','Kết quả','Ai giết Lục Thư và vì sao','Hộ vệ Hà Lập ra tay theo lệnh Trịnh Nghiêm để lấy trang chuyển kho giả. Sổ trả bạc, thư ký nhận và người chuyển lệnh cùng xác nhận; gia đình được dự hỏi.',['luc_thu','trinh_nghiem','tay_sai']],
 ['victory','D18H20','Kết quả','Cao Lệ đã bị giữ','Bộ chỉ huy bị hạ thế nhờ cửa, hậu cần, đường rút và các đội hỗ trợ nhau.',['cao_le','companion_10']],
 ['deadline','D19H05','Ghi chép','Ngày quan sát đã tính được','Có mốc nguyệt thực, chưa có bảo đảm cổng hai chiều hay lần sau.',['companion_07','companion_10']],
 ['consent','D19H12','Lựa chọn','Tình cảm do hai người chọn','Phong và Mai đã nói về tình cảm; quyết định này không thay quyền ở lại hay trở về.',['companion_08']],
 ['gate','D19H18','Lựa chọn','Hai phía của đường về','Lựa chọn đã được giữ cho hậu truyện; không có lời hứa chắc sẽ gặp lại hai phía.',['companion_08','companion_01']]
];
const questions=[
 ['grain','D01H13','D09H10','Thóc đã đi đâu khi nhiều sổ cùng ghi nhận đủ?','Nhiều lô bị kê hai lần; ghép hàng thật, tiền công và tuyến xe mới thấy rõ.'],
 ['trap','D05H09','D06H15','Phong và Mai có đúng là người gây án ở kho không?','Chuỗi nhân chứng độc lập bác mốc buộc tội; lệnh giữ đã hủy, vụ giết người tiếp tục được xét.'],
 ['copy','D06H20','D07H14','Lục Thư gửi bản sao cho ai?','Bản sao tới Lôi Nam, còn thiếu trang cuối về lệnh chuyển.'],
 ['school','D13H20','D14H11','Các chưởng môn giữ đường rút có trở về không?','Nguồn sống sót xác nhận cả năm không còn. Vị trí cuối và lời dặn được giữ riêng.'],
 ['case','D05H09','D17H12','Ai ra lệnh giết Lục Thư và nhằm che việc gì?','Trịnh Nghiêm thuê hộ vệ Hà Lập lấy trang lệnh chuyển kho giả; sổ tiền, thư nhận và người chuyển lệnh được kiểm chéo. Gia đình Lục Thư được dự hỏi.'],
 ['home','D11H11','D19H17','Ghi chép về cột sáng có dẫn tới điều gì thật không?','Nguyệt thực khớp lịch, ánh sáng lạ đã xuất hiện. Thời gian hai phía và khả năng đi lại vẫn chưa được bảo đảm.']
];
import {personalizeStory} from '../data/HeroIdentity.js';
export function daiVietCasebook(session){return personalizeStory(rawCasebook(session),session);}
function rawCasebook(session){
 const done=new Set(session.storyProgress.completedQuests),current=resolveDaiVietQuest(DAI_VIET_QUESTS.find(q=>q.id===session.storyProgress.activeQuestId),session);
 const entries=records.filter(r=>done.has(r[1])).map(([id,source,type,title,text,people])=>({id,source,type,title,text,people,quest:DAI_VIET_QUESTS.find(q=>q.id===source)}));
 const met=new Map();
 for(const raw of DAI_VIET_QUESTS.filter(q=>done.has(q.id))){const q=resolveDaiVietQuest(raw,session);for(const [speaker,text,actor]of [...(q.fullLines??q.lines),...(q.fullAftermath??q.aftermath??[])]){if(actor==='hero')continue;const p=DAI_VIET_CAST_BY_NAME[speaker];if(p&&!met.has(p.id))met.set(p.id,{id:'met_'+p.id,source:q.id,type:'Người đã gặp',title:'Gặp '+p.name,text,people:[p.id],quest:q});}}
 entries.push(...met.values());
 const ids=new Set(entries.flatMap(e=>e.people));
 return{entries,people:[...ids].map(id=>({...DAI_VIET_CAST_BY_ID[id],facts:entries.filter(e=>e.people.includes(id)).map(e=>({title:e.title,text:e.text,source:e.source}))})),questions:questions.filter(q=>done.has(q[1])).map(([id,from,answered,question,answer])=>({id,question,answered:done.has(answered),answer:done.has(answered)?answer:null,source:done.has(answered)?answered:from})),relations:[
  {from:'be_na',to:'vu_binh',source:'D01H11',text:'Con gái — cha'},
  {from:'companion_08',to:'companion_01',source:'D08H16',text:'Cùng kết nghĩa và cùng quyền phản đối'},
  {from:'vu_binh',to:'trinh_nghiem',source:'D09H06',text:'Người làm mã sổ — người dùng mạng lưới vận tải'}
 ].filter(r=>done.has(r.source)&&ids.has(r.from)&&ids.has(r.to)),next:current?{id:current.id,title:current.title,location:current.location,objective:current.objectiveText}:null};
}
