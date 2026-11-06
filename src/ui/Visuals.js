import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import { NPCS_BY_ID } from '../data/NPCData.js';
import {portraitURL} from '../data/ArtURLs.js';
/** Individual companion art; sect art remains for the player and sect picker. */
export const SECT_ART = {
  ThieuLam: { index: 0, color: '#efa84b', name: 'Thiếu Lâm', sigil: 'Thiền' },
  VoDang: { index: 1, color: '#80c9df', name: 'Võ Đang', sigil: 'Đạo' },
  CaiBang: { index: 2, color: '#94bc83', name: 'Cái Bang', sigil: 'Nghĩa' },
  NgaMi: { index: 3, color: '#eea6bb', name: 'Nga Mi', sigil: 'Tâm' },
  DuongMon: { index: 4, color: '#b49bdf', name: 'Đường Môn', sigil: 'Ảnh' },
  TuDo: { index: 2, color: '#c6af79', name: 'Tự do', sigil: 'Hiệp' }
};
export const ICON_NAMES=Object.freeze(["back", "close", "plus", "check", "play", "pause", "speed", "upload", "download", "refresh", "focus", "bag", "gift", "heart", "scroll", "hammer", "flag", "help", "up", "camp", "roster", "profile", "codex", "saves", "settings", "sword", "coin", "arrow", "lotus", "trophy", "tea", "sound", "star", "shield", "lock", "rope", "fish", "mute", "sun", "moon"]);
/** Decorative rendered bitmap; visible labels continue to supply the accessible name. */
export function icon(name) {
 const key=ICON_NAMES.includes(name)?name:'star',im=document.createElement('img');
 im.src=new URL('../../assets/images/icons/'+key+'.webp',import.meta.url).href;
 im.alt='';im.setAttribute('aria-hidden','true');im.className='game-icon';im.dataset.iconName=key;im.width=im.height=24;im.decoding='async';im.draggable=false;return im;
}
export function decorateRarity(element, unit) {
  if (!unit?.tier) return;
  element.dataset.tier = String(unit.tier);
  if (!element.querySelector(':scope > .rarity-ornament') && unit.tier >= 3) {
    const ornament = document.createElement('span');
    ornament.className = 'rarity-ornament';
    ornament.setAttribute('aria-hidden', 'true');
    element.append(ornament);
    if (unit.tier === 5) {
      const petals = document.createElement('span');
      petals.className = 'rarity-petals';
      petals.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 5; i++) {
        const p = document.createElement('i');
        p.style.setProperty('--i', i);
        petals.append(p);
      }
      element.append(petals);
    }
  }
}
export function stylePortrait(element, source) {
  const unit = typeof source === 'object' ? source : COMPANIONS_BY_ID[source] ?? NPCS_BY_ID[source];
  const sect = unit?.sect ?? source;
  const art = SECT_ART[sect] ?? SECT_ART.VoDang;
  element.style.setProperty('--portrait-x', `${art.index * 25}%`);
  element.style.setProperty('--sect-color', art.color);
  element.dataset.sect = sect ?? 'VoDang';
  if (unit?.portrait) {
    element.style.backgroundImage = `url("${portraitURL(unit.portrait)}")`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center 18%';
    if (COMPANIONS_BY_ID[unit.id]) element.dataset.companionId = unit.id;
    else element.dataset.characterId = unit.characterId ?? unit.id;
  }
}
export function portrait(source, className = '') {
  const result = document.createElement('span');
  result.className = `portrait ${className}`.trim();
  result.setAttribute('aria-hidden', 'true');
  stylePortrait(result, source);
  return result;
}
export function decorateIcons(root = document) {
  root
    .querySelectorAll('[data-icon]')
    .forEach((element) => element.replaceChildren(icon(element.dataset.icon)));
}
