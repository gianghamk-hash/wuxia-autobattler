import {connectChapter} from './StoryContinuity.js';
import c01 from './dai-viet/chapter01.js';
import c02 from './dai-viet/chapter02.js';
import c03 from './dai-viet/chapter03.js';
import c04 from './dai-viet/chapter04.js';
import c05 from './dai-viet/chapter05.js';
import c06 from './dai-viet/chapter06.js';
import c07 from './dai-viet/chapter07.js';
import c08 from './dai-viet/chapter08.js';
import c09 from './dai-viet/chapter09.js';
import c10 from './dai-viet/chapter10.js';
import c11 from './dai-viet/chapter11.js';
import c12 from './dai-viet/chapter12.js';
import c13 from './dai-viet/chapter13.js';
import c14 from './dai-viet/chapter14.js';
import c15 from './dai-viet/chapter15.js';
import c16 from './dai-viet/chapter16.js';
import c17 from './dai-viet/chapter17.js';
import c18 from './dai-viet/chapter18.js';
import c19 from './dai-viet/chapter19.js';
import c20 from './dai-viet/chapter20.js';
import home from './dai-viet/chapter20home.js';
import {deepFreeze} from './DataUtils.js';
import {stageCombat} from './DaiVietCombatStory.js';
import {enrichExpansion} from './ExpansionStory.js';
import {personalizeStory} from './HeroIdentity.js';
export const DAI_VIET_CHAPTERS=deepFreeze([c01,c02,c03,c04,c05,c06,c07,c08,c09,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20]);
export const DAI_VIET_HOME_CHAPTER=deepFreeze(home);
export const DAI_VIET_REVISION=4;
export const episodeId=(c,e)=>`D${String(c).padStart(2,'0')}H${String(e).padStart(2,'0')}`;
const sceneNames=['jianghu-village','willow_ferry','willow_ferry','u_minh','hoa_lu','hoa_lu','willow_ferry','jianghu-village','hoa_lu','willow_ferry','phong_nha','binh_dinh','u_minh','u_minh','jianghu-village','u_minh','willow_ferry','yen_tu','yen_tu','jianghu-village'];
const grantAt={'D04H20':'companion_23','D05H10':'companion_08','D07H20':'companion_01','D11H18':'companion_10','D13H03':'companion_07'};
const xpBudget=[260,360,500,650,850,1050,1250,1450,1650,1850,2000,2100,2200,2300,2300,2300,2400,2500,500,500];
const moneyBudget=[70,80,100,115,125,135,150,165,180,195,210,220,225,230,240,250,260,280,100,100];
const levels=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
// Player-facing recaps describe what is known on entry, not the chapter's eventual outcome.
const briefs=[
 'Trần Phong đang làm diễn viên đóng thế, muốn hoàn thành một cảnh quay rồi gọi về nhà. Tai nạn trên sườn núi đột ngột cắt ngang buổi làm.',
 'Phong đã bỏ danh Đại Tiên và được dự kỳ xét đệ tử. Năm cửa học có cách dạy, nghĩa vụ và giới hạn khác nhau; anh cần hiểu trước khi nhận lời.',
 'Phong bắt đầu học võ và học chữ, muốn đem kinh nghiệm thể lực cũ vào bài tập mới. Những chuyến lương tới viện vẫn chưa được đối chiếu đủ.',
 'Hội viện cần người mang chứng từ tới Thăng Long trước ngày niêm sổ. Phong muốn đi nhưng phải qua bài kiểm tra về khả năng giữ nhiệm vụ và đi cùng người khác.',
 'Phong tới Thăng Long với giấy của năm viện và phiếu thóc Bà Tư. Anh cần tìm đúng kho Đông, đúng người nhận, trong một thành phố chưa biết đường.',
 'Phong và Mai bị giữ sau khi bước vào căn phòng có Lục Thư đã chết. Kha Vân xin được thời gian đối chiếu; ba mốc giờ và các nguồn độc lập cần được kiểm trước khi kết luận.',
 'Người giữ kho chỉ ra bản sao Lục Thư gửi Lôi Nam ở Chương Dương. Cùng lúc, một lệnh bắt gọi người ấy là kẻ cướp lương; nhóm phải hiểu vì sao dân bến không tin mình.',
 'Sau việc cứu bến và gỡ lệnh oan, Phong, Mai và Lôi muốn cùng kiểm tiếp đường lương. Tin nhau cần cả cách chia việc, giữ tiền và nói điều không đồng ý.',
 'Bản sao và các phiếu cho phép kiểm một kho ngoài thành. Vũ Bình biết cách mã hàng từng được lập; người làm kho biết điều gì đã đi qua cửa thật.',
 'Kho đã được niêm nhưng lệnh chuyển gốc đang rời kinh trên thuyền. Nhóm cần người hiểu dòng nước và một cách giữ nhân chứng mà không đưa dân vào trận của mình.',
 'Sau nhiều tuần đi đường, nhóm tới Hải Vân để tìm người đã ký nhận những chuyến lương đáng ngờ. Trạm còn người giữ, còn thư bị hoàn và công trình cần kiểm trước khi bước vào.',
 'Hồ sơ từ Hải Vân đã về kinh. Năm viện họp sau mùa mưa để tìm cách giữ tuyến tiếp tế chung; chứng từ cần được nghe trước khi quyết ai được cầm cờ.',
 'Người báo tin biên giới đã tới hội. Có nhiều dấu tập kết quân nhưng quy mô chưa chắc; những kho đang thiếu cần được kiểm và các đường dân rút cần chuẩn bị ngay.',
 'Tin địch đổi hướng tới chậm, một lệnh tiến đã được phát. Năm chưởng môn giữ các nút rút còn lại; Phong phải nghe đủ tin xấu để cứu phần còn có thể cứu.',
 'Sau cuộc rút, trại có người sống cần ăn, người mất cần được nhớ và lệnh sai cần được xem lại. Không thể phản công trước khi có cách tổ chức cho trại đứng được.',
 'Trại đã có cơ chế chia ca và nguồn lương tạm ổn, nhưng chưa đủ đánh thẳng. Hội chọn tìm điểm yếu đường tiếp tế địch, bắt đầu bằng hỏi người sống trên các tuyến ấy.',
 'Ba điểm nối trong mạng tiếp tế địch vừa lộ. Mai nhận tuyến sông, Lôi tuyến bộ, Phong nối tin; mỗi hướng có điều kiện và khoảng giờ khác nhau.',
 'Cao Lệ rút có trật tự về Chi Lăng. Muốn phá thế giữ ải phải mở cửa ngoài, tách hậu cần và giữ đường dân; không thể chỉ chọn một nơi đẹp để bắn.',
 'Chiến sự lớn đã lắng, còn tù binh, người mất tích và việc bàn giao. Ngô Sách có mốc nguyệt thực để quan sát lại cột sáng, chưa có lời bảo đảm về đường đi hoặc đường về.',
 'Phong đã chọn ở lại, mang theo cả nỗi nhớ gia đình cũ. Những người cùng anh còn việc phục hồi, đời sống riêng và câu hỏi ai nhận phần quyền lực đang bỏ trống.'
];
export const DAI_VIET_QUESTS=deepFreeze(DAI_VIET_CHAPTERS.flatMap(c=>{
 const weights=c.scenes.map((_,i)=>c.battles.includes(i+1)?2:1),total=weights.reduce((a,b)=>a+b,0);
 const distribute=budget=>{const values=weights.map(w=>Math.floor(budget*w/total));values[19]+=budget-values.reduce((a,b)=>a+b,0);return values;};
 const xp=distribute(xpBudget[c.number-1]),silver=distribute(moneyBudget[c.number-1]);
 return c.scenes.map((scene,i)=>{
  const episode=i+1,id=episodeId(c.number,episode),battle=c.battles.includes(episode);
  const q={id,canon:'dai-viet',chapter:c.number,episode,chapterTitle:c.title,chapterGoal:c.goal,chapterSummary:c.summary,act:c.number<=4?1:c.number<=8?2:c.number<=13?3:c.number<=18?4:5,title:scene.title,location:c.place,level:levels[c.number-1],xp:xp[i],silver:silver[i],kind:battle?'battle':'story',boss:battle&&c.battles.at(-1)===episode,objectiveText:scene.objective,previous:i?c.scenes[i-1].lines[0][1]:c.number>1?DAI_VIET_CHAPTERS[c.number-2].bridge:'Trần Phong đang đóng một cảnh nguy hiểm ở hiện đại, chưa biết về Đại Việt.',lines:scene.lines,scene:sceneNames[c.number-1],choices:[{id:'continue',text:battle?'Thực hiện nhiệm vụ trận.':'Tiếp tục câu chuyện.',karma:0}],spotlights:[]};
  if(id==='D01H01'){q.location='Hiện đại · trường quay trên sườn núi';q.scene='modern';}
  q.chapterSummary=briefs[c.number-1];
  if(episode===20)q.flags={[`STORY_CHAPTER_${c.number}`]:true};
  if(battle){q.encounter=`dai_viet_${c.number}_${episode}`;q.guide=c.number<=4?'kha_van':c.number<=7?'companion_08':null;q.enemyId=c.number===7&&episode===5?'companion_01':c.number<=4?'kha_van':c.number>=13?'cao_le':'tay_sai';if((!q.boss||[13,14,15,16,17].includes(c.number))&&!(c.number===7&&episode===5))q.enemyId='tay_sai';if(c.number===1||(c.number===4&&episode===19))q.enemyId='tay_sai';}
  if(q.enemyId==='kha_van')q.guide='dao_tinh';
  if(grantAt[id])q.recruitCompanion=grantAt[id];
  if(id==='D19H12')q.choices=[{id:'together',text:'Muốn thử tìm hiểu nhau, không thay cô ấy quyết tương lai.',karma:0},{id:'friends',text:'Giữ tình bằng hữu và tôn trọng con đường riêng.',karma:0}];
  if(id==='D19H18')q.choices=[{id:'home',text:'Trở về hiện đại. Gặp lại gia đình; chia tay Đại Việt và bàn giao đã có hiệu lực.',karma:0},{id:'stay',text:'Ở lại Đại Việt. Giữ đời sống đã xây; chấp nhận chưa có đường gặp lại mẹ.',karma:0}];
  if(id==='D20H20'){q.ending=true;q.kind='ending';q.xp=0;q.silver=0;q.choices=[];}
  return enrichExpansion(connectChapter(stageCombat(q)));
 });
}));
export const DAI_VIET_BY_ID=deepFreeze(Object.fromEntries(DAI_VIET_QUESTS.map(q=>[q.id,q])));
const returns={
 D19H19:{title:'Một bước qua ánh sáng',lines:[['Người kể','Phong chọn trở về, mang theo kỷ vật và những lá thư đã được cho phép giữ. Anh không bắt Mai hoặc Lôi bước thử cùng mình. Ở mép sáng cuối, ba người nói lời đã hẹn rồi buông tay.'],['Trần Phong','Nếu không có đường gửi tin, xin đừng để cả đời chỉ chờ tin của tôi.'],['Mai Tước','Ta sẽ nhớ, và vẫn sống tiếp. Huynh cũng phải làm vậy.'],['Lôi Nam','Về gặp mẹ đi. Ngồi ăn cho hết bữa, đừng lại hẹn lát nữa.']],objective:'Bước qua cổng theo lựa chọn trở về; không còn cảnh Phong điều quân ở Đại Việt.'},
 D19H20:{title:'Những người ở hai phía',lines:[['Người kể','Khoảng sáng tắt trước khi người ở lại biết Phong đã tới đâu. Mai, Lôi và Ngô Sách xuống núi với lá thư bàn giao; bên kia, Phong nghe tiếng người gọi tên mình giữa khung cảnh trường quay đã thay đổi. Không có tin nhắn nào qua lại được giữa hai nơi.'],['Mai Tước','Ta giữ phần việc đã nhận, không giữ một chỗ đời chỉ để đợi.'],['Lôi Nam','Ngày mai vẫn tới quán. Người còn ở đây vẫn cần bữa sáng.'],['Trần Phong','Xin cho tôi biết hôm nay là ngày nào. Và giúp tôi gọi về nhà.']],objective:'Bắt đầu hậu truyện trở về với đời sống riêng của những người ở lại.'}
};
function resolveRawDaiVietQuest(q,session){
 if(q?.canon!=='dai-viet')return q;
 const returning=session.storyProgress.decisions.D19H18==='home';
 if(returning&&returns[q.id]){const{objective,...scene}=returns[q.id];return{...q,...scene,objectiveText:objective};}
 if(returning&&q.chapter===20){const scene=home.scenes[q.episode-1],ancient=[4,7,8,10,12,15,17].includes(q.episode);return{...q,title:scene.title,chapterTitle:home.title,chapterSummary:home.summary,chapterGoal:home.goal,location:q.episode===19?'Hai thế giới · hai bữa cơm':ancient?'Đại Việt · sau cuộc chia tay':'Hiện đại · sau ngày trở về',scene:ancient?'jianghu-village':'modern',lines:scene.lines,objectiveText:scene.objective,previous:q.episode===1?returns.D19H20.lines[0][1]:home.scenes[q.episode-2].lines[0][1]};}
 return q;
}
export function resolveDaiVietQuest(q,session){return q?.canon==='dai-viet'?personalizeStory(resolveRawDaiVietQuest(q,session),session):q;}
export function daiVietLines(quest,session){
 const q=resolveDaiVietQuest(quest,session),lines=q.lines.map(l=>[...l]);
 if(q.chapter===20&&session.storyProgress.decisions.D19H18!=='home'&&[3,13].includes(q.episode)){
  const romance=session.storyProgress.decisions.D19H12==='together';
  lines.push(['Mai Tước',romance?'Ta đã đồng ý tìm hiểu nhau. Những chuyện xa hơn chỉ đến khi cả hai thật sự muốn, không vì tước vị.':'Ta trân trọng tình bằng hữu đã chọn. Mọi người không cần ghép chúng ta thành một đôi để câu chuyện trông trọn.']);
 }
 return lines;
}
export const DAI_VIET_ENDINGS=deepFreeze([
 {id:'home',name:'Trở về · Người giữ hai mái nhà',requirement:'Đã chọn trở về hiện đại ở chương 19.',description:'Gặp lại gia đình, giữ ký ức và tiếp tục sống ở hiện đại.',lines:[['Người kể','Phong trở về, sửa những lời hẹn đã bỏ lỡ với mẹ và giữ những người Đại Việt trong cách sống của mình. Mai và Lôi tiếp tục con đường riêng, không phải chờ người đã đi để đời mình được kể tiếp.'],['Trần Phong','Con ra ngay. Lần này con không để câu ấy thành một lời hẹn rồi quên.']]},
 {id:'actor',name:'Hoàng bào · Nhận quyền và chịu kiểm',requirement:'Đã chọn ở lại Đại Việt.',description:'Nhận ngôi vị theo sự ủy thác, giữ quyền kiểm và thay người.',lines:[['Người kể','Phong nhận hoàng bào sau khi điều kiện ủy thác được ký, việc thu chi và quyền thay người giữ nguyên. Anh không làm năm đầu thành thái bình vĩnh viễn; mỗi mùa vẫn có việc phải nghe và sửa.'],['Mai Tước','Ta giữ tuyến thuyền theo điều kiện của mình. Chuyện riêng, chúng ta vẫn tự chọn và tự nói.'],['Lôi Nam','Người đứng đầu cũng có giờ ăn. Không ai được tự giấu mình sau một chiếc áo.'],['Trần Phong','Ngày mai mở cửa nhận việc như đã hẹn. Ai hỏi ta sai ở đâu, phải có người nhận câu hỏi ấy.']]},
 {id:'justice',name:'Trao quyền · Hội cùng giữ lời',requirement:'Đã chọn ở lại Đại Việt.',description:'Trao việc cai quản cho hội có nhiệm kỳ, tiếp tục làm công việc đã nhận.',lines:[['Người kể','Phong không nhận ngôi, bàn giao quyền cho hội có thời hạn và giữ một phần việc có thể kiểm. Các tuyến không phải chờ một người mới chạy được; lời phản đối có nơi tới cả khi người được khen đang vắng.'],['Mai Tước','Ta giữ phần mình đã chọn, không cần ai đứng cao hơn mới biết mình nên làm gì.'],['Trần Phong','Ta không biến mất khi rời ghế ấy. Còn việc làm chứng và lời cũ phải giữ.']]},
 {id:'retire',name:'Quán cũ · Một việc tử tế mỗi ngày',requirement:'Đã chọn ở lại Đại Việt.',description:'Bàn giao chức vụ, giữ đời sống riêng và những lời đã hứa.',lines:[['Người kể','Phong bàn giao đầy đủ rồi về quán, dạy người mới điều mình thật sự biết và để người có nghề sửa điều mình chưa hiểu. Anh vẫn trở lại làm chứng khi được gọi; rời quyền lực không xóa trách nhiệm cũ.'],['Lôi Nam','Bàn còn chỗ, chuyến sau ta ghé. Đừng nấu theo công thức mà quên nếm.'],['Trần Phong','Ta sẽ nếm. Và nếu chưa đúng thì sửa trước khi mời người khác ăn.']]}
]);
