import {icon} from './Visuals.js';
const normal=text=>String(text??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const IDS={
 'btn-main-quest':'scroll','btn-casebook':'codex','btn-new-game':'play','btn-continue':'play','btn-resume-battle':'refresh',
 'btn-audio':'sound','btn-more':'settings','btn-save':'saves','btn-load':'download','btn-export':'upload','btn-import':'download',
 'btn-retry-save':'refresh','btn-rescue-export':'upload','btn-latest-save':'download','btn-new-session':'plus',
 'btn-practice':'sword','btn-pause':'pause','btn-retreat':'back','btn-battle-mode':'settings','btn-rescue-mission':'heart',
 'dialogue-previous':'back','dialogue-next':'arrow','dialogue-advance':'arrow','btn-camp-roster':'roster',
 'tab-skills':'sword','tab-attributes':'plus','tab-gear':'bag'
};
/** Every label remains in the DOM; icons are decorative and never become the accessible name. */
export function actionKey({id='',text='',view,close,scale,focus,skill,attribute,buy,explicit}) {
  if(explicit)return explicit;
  if(close)return 'close';
  if(focus)return 'focus';
  if(scale!==undefined)return 'speed';
  if(skill)return 'sword';
  if(attribute)return 'plus';
  if(buy)return buy==='tea'?'tea':'bag';
  if(view)return {camp:'camp',roster:'roster',tavern:'tea',dungeons:'flag',profile:'profile',codex:'codex',saves:'saves',settings:'settings',title:'back'}[view]??'arrow';
  if(IDS[id])return id==='btn-pause'&&/tiep tuc/.test(normal(text))?'play':IDS[id];
  if(/^đóng/i.test(String(text)))return 'close';
  const t=normal(text);
  for(const [pattern,key] of [
    [/^(huy|thoat)(\s|$)/,'close'],[/luu|ghi de/,'saves'],[/xuat/,'upload'],[/nhap|tai /,'download'],
    [/ve |quay lai|truoc|rut lui/,'back'],[/lam moi|thu lai|tay |hoan tra/,'refresh'],
    [/tap trung|muc tieu/,'focus'],[/cuu |hoi mau/,'heart'],[/tang qua|tang tra|tra ngon/,'gift'],[/tang|cong |\+1|thuoc tinh/,'plus'],
    [/vo cong|ky nang|tuyet ky|chien|luyen|thu suc/,'sword'],[/doi|xep|dong doi|xuat tran|dong hanh|nhan vat|ket nghia/,'roster'],
    [/trang bi|hanh trang|tui |day thung|ca tuoi/,'bag'],[/tang qua|tang tra|tra ngon/,'gift'],
    [/ren|che tao|nang cap/,'hammer'],[/dai hoi|thanh tich/,'trophy'],[/bi canh|hanh trinh/,'flag'],
    [/chuong|hoi |truyen|nguon|dau moi|nhat ky|lich su/,'scroll'],[/moi |quay|chieu hien/,'star'],
    [/quan|tra|nghi/,'tea'],[/chinh|cai dat|thiet lap/,'settings'],[/da hoc|da qua|hoan thanh/,'check'],
    [/len dau/,'up'],[/loc|tat ca|da mo|bac/,'codex']
  ])if(pattern.test(t))return key;
  return 'arrow';
}
export function decorateAction(element) {
  const isSummary=element.tagName==='SUMMARY';
  const key=actionKey({id:element.id,text:element.getAttribute('aria-label')??element.textContent,view:element.dataset.view,close:element.dataset.closeSheet,scale:element.dataset.scale,focus:element.dataset.focus,skill:element.dataset.skillId,attribute:element.dataset.attribute,buy:element.dataset.buy,explicit:element.dataset.uiIcon});
  if(element.dataset.closeSheet&&element.textContent.trim()==='×')for(const child of [...element.childNodes])if(child.nodeType===3)child.remove();
  if(element.id==='dialogue-advance'){
    const indicator=element.querySelector('.classic-indicator');
    if(indicator&&!indicator.querySelector('svg'))indicator.replaceChildren(icon('arrow'));
    element.dataset.actionIcon='arrow';return;
  }
  const original=element.querySelector('svg.game-icon:not([data-action-symbol])');
  if(original){element.dataset.actionIcon=key;return;}
  const own=[...element.children].filter(e=>e.matches?.('svg[data-action-symbol]'));
  if(own.length===1&&own[0].dataset.actionSymbol===key){element.dataset.actionIcon=key;return;}
  own.forEach(e=>e.remove());
  const glyph=icon(key);glyph.dataset.actionSymbol=key;glyph.classList.add('action-symbol');element.prepend(glyph);
  element.dataset.actionIcon=key;element.classList.add('has-action-icon');
  if(!isSummary&&element.matches('.formation-cell,.sect-option,.formation-units button,.shop-items button'))element.classList.add('portrait-action');
}
export function mountActionIcons(root=document.body) {
  const targets='button,summary';root.querySelectorAll(targets).forEach(decorateAction);
  const observer=new MutationObserver(records=>{
    const dirty=new Set();
    for(const r of records){
      const parent=r.target.nodeType===1?r.target:r.target.parentElement;
      const owner=parent?.closest?.(targets);if(owner)dirty.add(owner);
      for(const node of r.addedNodes??[])if(node.nodeType===1){if(node.matches(targets))dirty.add(node);node.querySelectorAll(targets).forEach(e=>dirty.add(e));}
    }
    for(const element of dirty)if(element.isConnected)decorateAction(element);
  });
  observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','data-ui-icon']});
  return {disconnect:()=>observer.disconnect()};
}
