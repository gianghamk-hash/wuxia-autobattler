import {gearRarity} from '../data/GearCatalog.js';
import {EQUIPMENT_BY_ID} from '../data/EquipmentData.js';
export function gearArtPath(item){
 const family=item.setId==='thiet_ve'?'thiet_ve':item.setId==='thanh_tam'?'thanh_tam':item.setId==='phong_hanh'?'phong_hanh':['ThieuLam','CaiBang'].includes(item.sect)?'thiet_ve':['NgaMi','VoDang'].includes(item.sect)?'thanh_tam':'phong_hanh';
 return `assets/images/gear/${family}_${gearRarity(item).id}_${item.slot}.webp`;
}
export function gearImage(item){
 const frame=document.createElement('span');frame.className='gear-art';frame.dataset.gearRarity=gearRarity(item).id;
 frame.style.setProperty('--gear-color',gearRarity(item).color);
 const image=document.createElement('img');image.src=new URL('../../'+gearArtPath(item),import.meta.url).href;image.alt=item.name;image.loading='lazy';image.width=image.height=96;frame.append(image);return frame;
}
export function equipmentAura(gear={}){
 const items=Object.values(gear).map(id=>EQUIPMENT_BY_ID[id]).filter(Boolean);
 const ranks=items.map(i=>gearRarity(i).rank),rank=Math.max(0,...ranks);
 return {rank,color:['transparent','#aeb9b5','#65b6ee','#bd8beb','#e7bd62'][rank],pieces:ranks.filter(n=>n===rank).length};
}
