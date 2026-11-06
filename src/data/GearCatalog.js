import {deepFreeze} from './DataUtils.js';
export const GEAR_RARITIES=[
 {id:'common',name:'Thường',rate:60,color:'#aeb9b5',rank:1},
 {id:'rare',name:'Hiếm',rate:28,color:'#65b6ee',rank:2},
 {id:'excellent',name:'Xuất sắc',rate:10,color:'#bd8beb',rank:3},
 {id:'exceptional',name:'Trác việt',rate:2,color:'#e7bd62',rank:4}
];
export const GEAR_DRAW={singleCost:80,tenCost:720,excellentPity:10,exceptionalPity:50};
const families=[
 {id:'phong_hanh',name:'Vân Hành',weapon:{physicalAtk:18,magicalAtk:14},armor:{maxHp:85,physicalDef:6},accessory:{attackSpeed:.025,physicalAtk:6},two:{physicalAtk:12,magicalAtk:10},three:{critRate:.03,attackSpeed:.04}},
 {id:'thiet_ve',name:'Thiết Vệ',weapon:{physicalAtk:14,physicalDef:5},armor:{maxHp:125,physicalDef:8},accessory:{maxHp:70,magicalDef:7},two:{maxHp:150,physicalDef:10},three:{blockRate:.035,magicalDef:15}},
 {id:'thanh_tam',name:'Thanh Tâm',weapon:{magicalAtk:20,physicalAtk:6},armor:{maxHp:95,magicalDef:8},accessory:{magicalAtk:8,magicalDef:6},two:{magicalAtk:14,magicalDef:8},three:{maxHp:120,attackSpeed:.04}}
];
export const NEW_GEAR=families.flatMap(f=>GEAR_RARITIES.flatMap(r=>['weapon','armor','accessory'].map(slot=>({
 id:`gear_${f.id}_${r.id}_${slot}`,name:`${({weapon:'Binh khí',armor:'Áo',accessory:'Ngọc'})[slot]} ${f.name} · ${r.name}`,slot,rarity:r.id,tier:r.rank,sect:null,setId:f.id,
 stats:Object.fromEntries(Object.entries(f[slot]).map(([key,n])=>[key,n<1?Number((n*[0,1,1.45,2,2.7][r.rank]).toFixed(4)):Math.round(n*[0,1,1.45,2,2.7][r.rank])])),
 description:`Bộ ${f.name}; phối hợp hai và ba món kể cả khác phẩm chất. ${f.id==='phong_hanh'?'Ưu tiên nhịp đánh và công kích.':f.id==='thiet_ve'?'Ưu tiên sống sót và giữ tuyến.':'Ưu tiên nội công và hồi phục.'}`
}))));
export const NEW_GEAR_SETS=families.flatMap(f=>[2,3].map(n=>({id:f.id+'_'+n,setId:f.id,name:`${f.name} · ${n} món`,requiredPieces:n,stats:n===2?f.two:f.three})));
export const gearRarity=item=>GEAR_RARITIES.find(r=>r.id===item.rarity)??GEAR_RARITIES[0];
export const STORY_GEAR={D03H10:'gear_thiet_ve_common_armor',D04H20:'gear_phong_hanh_rare_weapon',D08H20:'gear_thanh_tam_rare_accessory',D11H18:'gear_thanh_tam_excellent_weapon',D15H20:'gear_thiet_ve_excellent_armor'};
for(const catalog of [GEAR_RARITIES,GEAR_DRAW,NEW_GEAR,NEW_GEAR_SETS,STORY_GEAR])deepFreeze(catalog);
