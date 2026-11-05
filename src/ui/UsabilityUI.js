import {mountActionIcons} from './ActionIcons.js';
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function action(text,glyph,fn) {const b=node('button',text);b.type='button';b.dataset.uiIcon=glyph;b.onclick=fn;return b;}
/** Presentation-only organization. Existing controls, event handlers and campaign actions are retained. */
export function mountUsability(app) {
  const roster=document.getElementById('view-roster'),panes=new Map(),tabs=new Map(),scrolls=new Map();let selected='formation',profileChoice='gear';
  const formation=roster.querySelector('.formation-panel'),tactics=document.getElementById('tactics-root'),loadouts=document.getElementById('journey-roster'),gacha=document.getElementById('gacha-root');
  const list=document.getElementById('roster-list'),filters=roster.querySelector(':scope > .collection-filters'),companionTitle=filters.previousElementSibling,recruits=document.getElementById('recruit-list'),recruitFilters=document.getElementById('recruit-filters'),recruitHint=recruitFilters.previousElementSibling,recruitTitle=recruitHint.previousElementSibling;
  const nav=node('div',undefined,'roster-tabs');nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Chức năng đồng đội');roster.querySelector('.section-heading').after(nav);
  const show=id=>{if(!panes.has(id))return;const changed=id!==selected;selected=id;for(const [key,pane] of panes)pane.hidden=key!==id;for(const [key,tab] of tabs){tab.setAttribute('aria-selected',String(key===id));tab.tabIndex=key===id?0:-1;}if(changed){scrolls.delete('roster');if(app.view==='roster')window.scrollTo({top:0,behavior:'instant'});}};
  for(const [id,label,glyph] of [['formation','Xếp trận','roster'],['companions','Đồng đội','heart'],['recruit','Chiêu mộ','scroll'],['gacha','Chiêu hiền','star']]) {
    const pane=node('section',undefined,'roster-pane');pane.id='roster-pane-'+id;pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','roster-tab-'+id);panes.set(id,pane);
    const tab=action(label,glyph,()=>show(id));tab.id='roster-tab-'+id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',pane.id);tabs.set(id,tab);nav.append(tab);roster.append(pane);
  }
  panes.get('formation').append(formation,tactics);
  if(loadouts)panes.get('formation').append(loadouts);
  const anchor=node('div');anchor.id='roster-loadouts-anchor';panes.get('formation').append(anchor);
  panes.get('companions').append(companionTitle,filters,list);
  panes.get('recruit').append(recruitTitle,recruitHint,recruitFilters,recruits);
  panes.get('gacha').append(gacha);
  nav.addEventListener('keydown',event=>{const choices=[...tabs.values()],at=choices.indexOf(document.activeElement);if(at<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?choices.length-1:(at+(event.key==='ArrowRight'?1:-1)+choices.length)%choices.length;choices[next].click();choices[next].focus();});
  show(selected);
  const quick=node('nav',undefined,'page-tools');quick.id='page-tools';quick.setAttribute('aria-label','Thao tác nhanh');
  const home=action('Doanh trại','camp',()=>app.run(()=>app.setView('camp'))),saves=action('Lưu / Tải','saves',()=>app.run(()=>app.setView('saves'))),top=action('Lên đầu','up',()=>window.scrollTo({top:0,behavior:'instant'}));
  quick.append(home,saves,top);document.getElementById('app-message').after(quick);
  const jumps=node('nav',undefined,'battle-jumps');jumps.setAttribute('aria-label','Tìm nhanh trong trận');
  const target=(id)=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});
  jumps.append(action('Bàn đấu','sword',()=>target('battle-arena')),action('Tướng & ý đồ','roster',()=>target('battle-unit-list')));
  const result=action('Kết quả','trophy',()=>target('battle-result-panel'));jumps.append(result);document.querySelector('.battle-toolbar').after(jumps);
  const resize=()=>{const header=document.querySelector('.app-header');if(!header)return;const h=Math.ceil(header.getBoundingClientRect().height);document.documentElement.style.setProperty('--ui-header-height',h+'px');};
  resize();const headerObserver=globalThis.ResizeObserver?new ResizeObserver(resize):null;headerObserver?.observe(document.querySelector('.app-header'));
  const icons=mountActionIcons();
  return {
    openRoster(id){scrolls.delete('roster');show(id);},
    beforeView(old,next){if(old==='profile')profileChoice=document.querySelector('[data-profile-tab][aria-selected="true"]')?.dataset.profileTab??profileChoice;if(old!==next&&!['dialogue','battle','title'].includes(old))scrolls.set(old,window.scrollY);},
    afterView(view){if(view==='profile')app.selectProfileTab(profileChoice);quick.hidden=['title','battle','dialogue'].includes(view);home.hidden=view==='camp';saves.hidden=view==='saves';home.disabled=saves.disabled=Boolean(app.model.running);const y=['dialogue','battle','title'].includes(view)?0:scrolls.get(view)??0;requestAnimationFrame(()=>window.scrollTo({top:y,behavior:'instant'}));},
    updateBattle(){result.disabled=!app.model.lastResult;},
    destroy(){icons.disconnect();headerObserver?.disconnect();}
  };
}
