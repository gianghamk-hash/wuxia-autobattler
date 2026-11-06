import {EXTRA_COMBAT} from './DaiVietCombatStory.js';
const rows=[
 ['D01H14','protect','Giữ thóc chờ đối chiếu'],['D05H17','protect','Bảo vệ sổ giao dầu'],['D06H13','rescue','Đưa người giữ kho ra ngoài'],
 ['D07H10','hold','Giữ lối cho dân bến'],['D07H15','hold','Giữ cầu cho lượt cuối'],['D08H18','protect','Giữ hòm bản sao'],
 ['D09H04','rescue','Giải cứu phu kho'],['D09H09','breach','Mở ba chốt gian sổ'],['D09H14','protect','Giữ hòm giao nhận'],
 ['D10H09','hold','Giữ bến chuyển người'],['D10H14','protect','Giữ hòm lương chuyển bến'],['D11H09','protect','Bảo vệ xe dụng cụ'],['D11H14','rescue','Cứu người mang thư'],
 ['D12H19','hold','Giữ cửa đón người đưa tin'],['D13H09','protect','Giữ đoàn xe bổ lương'],['D13H14','rescue','Đưa người dân khỏi trạm'],
 ['D14H04','hold','Mở lối sơ tán'],['D14H08','hold','Giữ đường cho lượt cáng'],['D14H12','hold','Giữ lượt cuối rút quân'],['D14H16','protect','Giữ lương bếp trại'],
 ['D15H04','protect','Giữ xe vào trại'],['D15H09','rescue','Đưa người thợ trở về'],['D15H14','protect','Giữ hòm giống'],
 ['D16H09','rescue','Mở đường người bỏ trại'],['D16H14','breach','Phá ba chốt điều xe'],['D17H04','breach','Mở ba chốt bến'],['D17H09','protect','Giữ đoàn xe qua dốc'],['D17H14','hold','Giữ thời gian chuyển trạm tin'],
 ['D18H04','breach','Mở ba chốt cửa ngoài'],['D18H09','breach','Tách ba điểm giữ kho'],['D18H16','hold','Giữ điểm chặn cho đội cung']
];
for(const [at,scene]of Object.entries(EXTRA_COMBAT))if(['drill','breach'].includes(scene.type)){
 const [c,e]=at.split('.');rows.push([`D${c.padStart(2,'0')}H${e.padStart(2,'0')}`,scene.type==='drill'?'hold':'breach',scene.type==='drill'?'Đối luyện · giữ vị trí':'Đối luyện · mở ba chốt']);
}
export const DAI_VIET_MISSIONS=Object.fromEntries(rows.map(([id,type,title])=>[id,{id,type,title,duration:type==='hold'?30:type==='protect'?25:type==='breach'?3:2,assetLabel:type==='protect'?(title.includes('xe')?'Xe vận tải':title.includes('giống')?'Hòm giống':'Hòm vật tư'):undefined,description:type==='hold'?'Giữ ít nhất một người chiến đấu sống trong 30 giây để người ngoài bàn đấu rút an toàn. Có tiếp viện ở giây 10 và 20.':type==='protect'?'Giữ mục tiêu còn HP trong 25 giây hoặc hạ hết đội cản. Kẻ phá mục tiêu có thể bị kéo ra bằng khiêu khích.':type==='breach'?'Phá đủ ba chốt để mở đường. Có thể tập trung đánh chốt, không bắt buộc hạ mọi đối thủ.':'Tiếp cận trong một ô, mở trói 2 giây rồi đưa người được cứu về mép sân nhà. Nếu hết địch trước, đội sẽ tự tiếp cận cứu.',failure:type==='hold'?'Cả đội bị hạ trước khi đủ thời gian.':type==='protect'?'Mục tiêu bị phá hoặc cả đội chiến đấu bị hạ.':type==='breach'?'Cả đội bị hạ hoặc hết giờ khi chưa mở đủ chốt.':'Người được cứu bị hạ, cả đội bị hạ hoặc hết giờ.'}]));
for(const [at,scene]of Object.entries(EXTRA_COMBAT))if(scene.type==='drill'){
 const [c,e]=at.split('.'),id=`D${c.padStart(2,'0')}H${e.padStart(2,'0')}`;
 Object.assign(DAI_VIET_MISSIONS[id],{duration:12,noWaves:true,description:'Giữ ít nhất một người chiến đấu đứng vững hết lượt 12 giây. Không có tiếp viện. Dùng đổi vị trí, phối hợp đội và thời điểm ra chiêu để giữ hàng.',failure:'Cả đội bị hạ trước khi hết lượt đối luyện.'});
}
