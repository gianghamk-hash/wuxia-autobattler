import {NEW_GEAR,GEAR_RARITIES,gearRarity} from '../data/GearCatalog.js';
import {GEAR_FAMILIES7} from '../data/GearCatalog.js';
import {gearImage} from './GearArt.js';
import {count} from '../core/WorldProgress.js';

const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const SLOTS={weapon:'Binh khí',armor:'Áo giáp',helmet:'Mũ',accessory:'Ngọc bội'};
export const DRAWABLE_GEAR=Object.freeze([...NEW_GEAR].sort((a,b)=>gearRarity(a).rank-gearRarity(b).rank||a.setId.localeCompare(b.setId)||Object.keys(SLOTS).indexOf(a.slot)-Object.keys(SLOTS).indexOf(b.slot)));
/** The actual equipment gacha pool, not starter equipment or boss/story-only rewards. */
export function renderGearCatalog(app,root){
  const owned=app.model.session;
  const p=el('section',undefined,'panel tavern-vault');p.id='equipment-vault';
  const title=el('div',undefined,'vault-header');
  title.append(el('p','BỘ SƯU TẬP TRANG BỊ · GIANG HỒ','vault-kicker'),el('h2','Kho đồ vòng quay'),el('p','Duyệt toàn bộ 80 trang bị có thể xuất hiện khi mở rương. Ảnh lấy từ kho đồ họa có sẵn trong game. Thứ tự phẩm chất tăng dần.','hint'));
  p.append(title);
  const controls=el('div',undefined,'vault-filters');
  const rarity=el('select');rarity.setAttribute('aria-label','Lọc phẩm chất');
  const slot=el('select');slot.setAttribute('aria-label','Lọc loại trang bị');
  const family=el('select');family.setAttribute('aria-label','Lọc bộ trang bị');
  const ownedOnly=el('input');ownedOnly.type='checkbox';ownedOnly.id='vault-owned-only';
  const search=el('input');search.type='search';search.placeholder='Tìm tên trang bị…';search.setAttribute('aria-label','Tìm tên trang bị');
  const option=(target,value,label)=>{const o=el('option',label);o.value=value;target.append(o);};
  option(rarity,'','Tất cả phẩm chất');GEAR_RARITIES.forEach(r=>option(rarity,r.id,r.name));
  option(slot,'','Tất cả vị trí');Object.entries(SLOTS).forEach(([id,name])=>option(slot,id,name));
  option(family,'','Tất cả bộ');GEAR_FAMILIES7.forEach(f=>option(family,f.id,f.name));
  const checkLabel=el('label',undefined,'vault-owned-label');checkLabel.htmlFor='vault-owned-only';checkLabel.append(ownedOnly,document.createTextNode(' Đã sở hữu'));
  controls.append(rarity,slot,family,search,checkLabel);p.append(controls);
  const counter=el('p',undefined,'vault-counter');counter.setAttribute('aria-live','polite');
  const grid=el('div',undefined,'vault-grid');p.append(counter,grid);
  const render=()=>{
    const query=search.value.trim().toLocaleLowerCase('vi-VN');
    const items=DRAWABLE_GEAR.filter(item=>(!rarity.value||item.rarity===rarity.value)&&(!slot.value||item.slot===slot.value)&&(!family.value||item.setId===family.value)&&(!ownedOnly.checked||count(owned,item.id)>0)&&(!query||item.name.toLocaleLowerCase('vi-VN').includes(query)));
    counter.textContent='Hiển thị '+items.length+'/'+DRAWABLE_GEAR.length+' trang bị · Thường → Hiếm → Xuất sắc → Trác việt';
    const fragment=document.createDocumentFragment();
    for(const item of items){
      const r=gearRarity(item),card=el('article',undefined,'vault-gear');
      card.dataset.gearId=item.id;card.dataset.gearRarity=r.id;
      card.style.setProperty('--gear-color',r.color);
      const art=gearImage(item);art.classList.add('vault-gear-image');
      const caption=el('div',undefined,'vault-gear-info');
      caption.append(el('strong',item.name),el('span',r.name+' · '+SLOTS[item.slot],'vault-gear-rarity'));
      const familyName=GEAR_FAMILIES7.find(f=>f.id===item.setId)?.name??item.setId;
      caption.append(el('span','Bộ '+familyName+' · '+(r.rate/20).toFixed(1).replace('.0','')+'% mỗi món (trước bảo đảm)','vault-gear-details'));
      const quantity=count(owned,item.id);
      caption.append(el('span',quantity?'Đã sở hữu: '+quantity:'Chưa sở hữu','vault-gear-owned'));
      card.append(art,caption);fragment.append(card);
    }
    grid.replaceChildren(fragment);
    if(!items.length)grid.append(el('p','Không có trang bị phù hợp bộ lọc.','hint'));
  };
  [rarity,slot,family,search,ownedOnly].forEach(input=>input.addEventListener('input',render));
  render();root.append(p);
}
