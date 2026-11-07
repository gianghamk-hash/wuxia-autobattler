import {gearImage} from './GearArt.js';
import {GEAR_RARITIES,GEAR_DRAW,gearRarity,NEW_GEAR} from '../data/GearCatalog.js';
import {EQUIPMENT,EQUIPMENT_BY_ID,EQUIPMENT_SETS} from '../data/EquipmentData.js';
import {equipItem} from '../entities/HeroBuild.js';
import {sectReady} from '../data/HeroIdentity.js';
import {chapterBossAvailable,chapterBossRewards,gearSalePrice,spareEquipment} from '../core/Loot.js';
import {remainingEntries,EXTRA_ENTRY_PRICE} from '../core/DungeonEntries.js';
import {count} from '../core/WorldProgress.js';
const n=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const btn=(text,fn,disabled=false)=>{const e=n('button',text);e.type='button';e.disabled=disabled;e.onclick=fn;return e;};
const labels={physicalAtk:'Ngoại công',magicalAtk:'Nội công',maxHp:'HP',physicalDef:'Ngoại phòng',magicalDef:'Nội phòng',critRate:'Bạo kích',critDmg:'Sát thương bạo kích',dodgeRate:'Né tránh',blockRate:'Đỡ đòn',attackSpeed:'Tốc đánh'};
const statsText=stats=>Object.entries(stats).map(([k,v])=>`${labels[k]??k} +${k==='attackSpeed'?v+' lần/giây':v<1?Number((v*100).toFixed(2))+'%':v}`).join(' · ');
const wear=(app,item)=>app.run(()=>{const live=app.model.session;if(live.storyProgress.pendingEncounter)throw Error('Hãy kết thúc trận đang chờ.');app.model.updateProfile(equipItem(live.hero,item.slot,item.id,live.inventory),live.inventory);renderEquipmentRefresh(app);});
export function renderEquipment(app,root,onOpenCatalog){
 const s=app.model.session,l=s.loot??{total:0,sinceExcellent:0,sinceExceptional:0,history:[]},panel=n('section',undefined,'panel gear-panel');panel.id='equipment-panel';
 const hero=n('div',undefined,'gacha-hero');
 const heroCopy=n('div',undefined,'gacha-hero-copy');
 heroCopy.append(n('p','KHO TÀNG GIANG HỒ','gacha-eyebrow'),n('h2','Vòng quay trang bị'),n('p','Thử vận may cùng 80 báu vật thuộc 5 bộ trang bị, từ Thường đến Trác việt.','gacha-subtitle'),n('strong','Bạc: '+count(s,'silver').toLocaleString('vi-VN'),'gacha-wallet'));
 const showcase=n('div',undefined,'gacha-showcase');
 for(const id of ['gear_thien_loi_exceptional_weapon','gear_thanh_tam_exceptional_helmet','gear_phong_hanh_excellent_armor']){
   const item=EQUIPMENT_BY_ID[id];if(item){const picture=gearImage(item);picture.classList.add('gacha-showcase-piece');showcase.append(picture);}
 }
 hero.append(heroCopy,showcase);panel.append(hero);
 panel.append(n('p','Đồ trùng vẫn vào túi và hoàn 80% giá thực trả/lượt. Gói 5 chia đều giá gói; hoàn bạc làm tròn theo tổng số lượt trùng. Đồ dư có thể bán; giữ lại món đang mặc.','hint'));
 const rates=n('details'),summary=n('summary','Tỉ lệ và bảo đảm trang bị');rates.append(summary);
 for(const r of GEAR_RARITIES)rates.append(n('p',`${r.name}: ${r.rate}% · ${NEW_GEAR.filter(e=>e.rarity===r.id).length} món trong bậc, chia đều.`));
 rates.append(n('p','Trong 10 lượt liên tiếp có ít nhất một món Xuất sắc trở lên; trong 50 lượt có ít nhất một món Trác việt. Hai bộ đếm độc lập với vòng quay nhân vật. Mốc 2, 3 và đủ 4 món của bộ trang bị cộng dồn, chấp nhận phối đồ khác phẩm chất.'));panel.append(rates);
 panel.append(n('p',`Xuất sắc trở lên trong ${10-l.sinceExcellent} lượt · Trác việt trong ${50-l.sinceExceptional} lượt`,'gear-pity'));
 const controls=n('div',undefined,'controls gacha-draw-controls');
 for(const[amount,cost]of [[1,GEAR_DRAW.singleCost],[5,GEAR_DRAW.tenCost]]){const b=btn(`Mở ${amount} rương · ${cost} bạc`,()=>app.run(()=>{const result=app.model.drawEquipment(amount);app.toast(`Trang bị đã vào túi${result.refund?' · Hoàn '+result.refund+' bạc do trùng':''}.`);renderEquipmentRefresh(app);}),!sectReady(s)||app.model.running||Boolean(s.storyProgress.pendingEncounter)||count(s,'silver')<cost);b.dataset.equipmentDraw=amount;b.classList.add('gacha-draw-button');controls.append(b);}panel.append(controls);
 if(onOpenCatalog){const link=btn('Xem kho đồ · 80 trang bị có thể quay ra',onOpenCatalog);link.className='gacha-vault-link';link.dataset.uiIcon='bag';panel.append(link);}
 const history=n('div',undefined,'gear-results');history.id='equipment-results';history.tabIndex=0;history.setAttribute('role','region');history.setAttribute('aria-label','Kết quả vòng quay trang bị gần đây');
 for(const row of [...l.history].slice(-5).reverse()){const item=EQUIPMENT_BY_ID[row.id],r=gearRarity(item),card=n('article',undefined,'gear-card'),equipped=s.hero.equippedGear[item.slot]===item.id;card.dataset.gearRarity=r.id;card.style.setProperty('--gear-color',r.color);card.append(gearImage(item),n('strong',item.name),n('span',r.name,'gear-grade'),n('p',statsText(item.stats)),n('p',row.duplicate?'Trùng · Hoàn '+row.refund+' bạc':row.duplicate===false?'Trang bị mới':'Kết quả đã lưu trước cập nhật','gear-refund'),btn(equipped?'Đang mặc':count(s,item.id)?'Mặc món này':'Đã bán hết',()=>wear(app,item),equipped||count(s,item.id)===0||!sectReady(s)||Boolean(s.storyProgress.pendingEncounter)));history.append(card);}panel.append(history);
 const owned=n('details');owned.className='gear-owned';owned.open=app.equipmentInventoryOpen??false;owned.addEventListener('toggle',()=>{if(owned.isConnected)app.equipmentInventoryOpen=owned.open;});owned.append(n('summary','Trang bị đang sở hữu · chọn để mặc'));const list=n('div',undefined,'gear-inventory');
 for(const item of EQUIPMENT.filter(i=>count(s,i.id)>0)){
  const r=gearRarity(item),card=n('article',undefined,'gear-card');card.style.setProperty('--gear-color',r.color);card.dataset.gearId=item.id;card.dataset.gearRarity=r.id;
  const set=EQUIPMENT_SETS.filter(set=>(set.setId??set.id)===item.setId),equipped=s.hero.equippedGear[item.slot]===item.id;
  card.append(gearImage(item),n('h3',item.name),n('span',`${r.name} · x${count(s,item.id)}`,'gear-grade'),n('p',statsText(item.stats)),n('p',item.description,'hint'));
  if(set.length)card.append(n('p',set.map(v=>`${v.name}: ${statsText(v.stats)}`).join(' / '),'gear-set'));
  card.append(btn(equipped?'Đang mặc':'Mặc trang bị',()=>wear(app,item),equipped||!sectReady(s)||Boolean(s.storyProgress.pendingEncounter)||Boolean(item.sect&&item.sect!==s.hero.sect)));
  const spare=spareEquipment(s,item.id),blocked=app.model.running||Boolean(s.storyProgress.pendingEncounter)||Boolean(s.adventure.dungeon);
  card.append(n('p',`Có thể bán: ${spare} · ${gearSalePrice(item)} bạc/món${equipped?' · Giữ lại 1 món đang mặc':''}`,'gear-sale-hint'));
  for(const amount of [...new Set([1,...(spare>1?[spare]:[])])]){const sell=btn(`Bán ${amount===1?'1 món':amount+' món dư'} · +${gearSalePrice(item)*amount} bạc`,()=>app.run(()=>{const result=app.model.sellEquipment(item.id,amount);app.toast(`Đã bán ${result.quantity} món · +${result.silver} bạc`);renderEquipmentRefresh(app);}),blocked||amount>spare);sell.dataset.sellGear=item.id;sell.dataset.sellQuantity=amount;card.append(sell);}
  list.append(card);
 }owned.append(list);const reveal=btn('Bán trang bị dư',()=>{owned.open=true;owned.scrollIntoView({block:'nearest'});});reveal.dataset.uiIcon='coin';panel.append(reveal,owned);root.append(panel);
}
function renderEquipmentRefresh(app){app.world.render();}
export function renderChapterBosses(app,root){
 const s=app.model.session;if(s.storyProgress.storyRevision!==4)return;
 const panel=n('section',undefined,'panel');panel.id='chapter-boss-panel';panel.append(n('h2','Boss chương · ôn trận'),n('p','Mở sau khi hoàn thành chương. Đây là tập trận/hồi ức, không thay diễn biến truyện; kể cả khi đã trở về hiện đại. Mỗi boss có 2 lượt/ngày và được mua thêm 1 lượt với 60 bạc; đặt lại 00:00 giờ Việt Nam. Thua/rút lui vẫn tính lượt, tiếp tục bản lưu không trừ thêm. Thua không nhận thưởng. Thắng nhận XP, bạc và có cơ hội nhận đồ; lần đầu nhận đồ chắc chắn, các lần sau 45%.','hint'));
 const rates=n('details');rates.append(n('summary','Phẩm chất đồ boss và hướng cày'),n('p','Lần thắng đầu, kể cả trong chính truyện: Hiếm (chương 1–12), Xuất sắc (13–18), Trác việt (19–20). Những lần sau có 45% rơi đồ. Nếu rơi: trần Hiếm ở chương 1–4, trần Xuất sắc ở chương 5–10; từ chương 11 là Trác việt 3%, Xuất sắc 19,4%, Hiếm 42,68%, Thường 34,92%. Phần vượt trần dồn xuống trần; từ chương 15 phần Thường nâng thành Hiếm. Hơn cấp boss quá 2 cấp giảm XP/bạc 10% mỗi cấp, tối thiểu còn 10%; nút đã tính số nhận hiện tại. Không có tiền cọc.'));panel.append(rates);
 for(let c=1;c<=20;c++){
  const remaining=remainingEntries(s,'boss_'+c),available=chapterBossAvailable(s,c),wins=s.loot?.bossWins[c]??0,reward=chapterBossRewards(s,c),b=btn(`Chương ${c} · ${available?'Đấu boss':'Chưa mở'} · ${reward.xp} XP / ${reward.silver} bạc${wins?' · Thắng '+wins+' lần':''}`,()=>app.run(()=>{app.clearBattle();app.model.startChapterBoss(c);app.enterBattle();}),!available||remaining<=0||app.model.running||Boolean(s.storyProgress.pendingEncounter));b.dataset.chapterBoss=c;panel.append(b,n('span',`Còn ${remaining}/ngày`,'hint'));if(available&&remaining===0&&!s.adventure.daily.entryPurchases?.['boss_'+c])panel.append(btn('Mua thêm 1 lượt · 60 bạc',()=>app.run(()=>{app.model.buyDungeonEntry('boss_'+c);app.world.render();}),count(s,'silver')<EXTRA_ENTRY_PRICE));
 }root.append(panel);
}
