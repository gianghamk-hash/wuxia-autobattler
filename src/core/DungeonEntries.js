const validKey=key=>/^(u_minh|hoa_lu|yen_tu|phong_nha|son_doong|boss_([1-9]|1[0-9]|20))$/.test(key);
export const EXTRA_ENTRY_PRICE=60;
export function validateEntries(daily){
 for(const field of ['entries','entryPurchases']){
  const rows=daily[field];if(rows===undefined)continue;
  if(!rows||Object.getPrototypeOf(rows)!==Object.prototype||Object.entries(rows).some(([k,v])=>!validKey(k)||!Number.isSafeInteger(v)||v<0||v>(field==='entries'?3:1)))throw Error('Lượt phó bản không hợp lệ.');
 }
 for(const[k,n]of Object.entries(daily.entries??{}))if(n>2+(daily.entryPurchases?.[k]??0))throw Error('Lượt phó bản vượt giới hạn.');
}
export const remainingEntries=(s,key)=>2+(s.adventure.daily.entryPurchases?.[key]??0)-(s.adventure.daily.entries?.[key]??0);
export function useEntry(s,key){
 if(!validKey(key)||remainingEntries(s,key)<=0)throw Error('Đã hết lượt hôm nay. Mỗi phó bản có 2 lượt, được mua thêm 1 lượt bằng bạc.');
 const d=s.adventure.daily;d.entries??={};d.entries[key]=(d.entries[key]??0)+1;
}
export const entryMethods={
 buyDungeonEntry(key){this._mutate(s=>{
  if(!validKey(key)||s.storyProgress.pendingEncounter||s.adventure.dungeon)throw Error('Hãy kết thúc lượt đang chơi trước.');
  const d=s.adventure.daily;if(d.entryPurchases?.[key])throw Error('Mỗi phó bản chỉ được mua thêm 1 lượt/ngày.');
  if((d.entries?.[key]??0)<2)throw Error('Dùng hết hai lượt miễn phí trước khi mua thêm.');
  const wallet=s.inventory.filter(i=>i.itemId==='silver');if(wallet.reduce((n,i)=>n+i.quantity,0)<EXTRA_ENTRY_PRICE)throw Error('Cần 60 bạc để mua lượt.');
  let due=EXTRA_ENTRY_PRICE;for(const i of wallet){const n=Math.min(due,i.quantity);i.quantity-=n;due-=n;}s.inventory=s.inventory.filter(i=>i.quantity>0);
  d.entryPurchases??={};d.entryPurchases[key]=1;
 },'world');}
};
