/** Shared visual language. Art is representative of a sect, not a unique companion portrait. */
export const SECT_ART = {
  ThieuLam: { index: 0, color: '#efa84b', name: 'Thiếu Lâm', sigil: 'Thiền' },
  VoDang: { index: 1, color: '#80c9df', name: 'Võ Đang', sigil: 'Đạo' },
  CaiBang: { index: 2, color: '#94bc83', name: 'Cái Bang', sigil: 'Nghĩa' },
  NgaMi: { index: 3, color: '#eea6bb', name: 'Nga Mi', sigil: 'Tâm' },
  DuongMon: { index: 4, color: '#b49bdf', name: 'Đường Môn', sigil: 'Ảnh' },
  TuDo: { index: 2, color: '#c6af79', name: 'Tự do', sigil: 'Hiệp' }
};
const PATHS = {
  camp: 'M3 20h18M5 20V10l7-7 7 7v10M9 20v-6h6v6M3 10l9-8 9 8',
  roster: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  profile: 'M12 3l5 4-1 6 4 7H4l4-7-1-6 5-4M9 8h6M9 12h6M10 16h4',
  codex: 'M12 6v15M12 6C8 2 4 3 2 4v15c4-2 7-1 10 2M12 6c4-4 8-3 10-2v15c-4-2-7-1-10 2',
  saves: 'M5 3h12l4 4v14H3V3h2M7 3v6h10V3M7 21v-8h10v8',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
  sword: 'M14 3l7-1-1 7-11 11-5-5L14 3M3 13l8 8M6 18l-4 4M15 8l2 2',
  coin: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M9 8h6v8H9V8',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  lotus: 'M12 21C1 20 1 12 2 8c5 0 8 3 10 7M12 21c11-1 11-9 10-13-5 0-8 3-10 7M12 21C5 15 8 7 12 2c4 5 7 13 0 19',
  trophy: 'M8 3h8v7a4 4 0 0 1-8 0V3M8 5H3v3a5 5 0 0 0 5 5M16 5h5v3a5 5 0 0 1-5 5M12 14v6M7 21h10',
  tea: 'M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8M17 9h2a3 3 0 0 1 0 6h-2M7 2v3M12 2v3',
  sound: 'M11 4L6 8H2v8h4l5 4V4M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
  star: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6',
  shield: 'M12 2l9 4v6c0 5-6 9-9 10-3-1-9-5-9-10V6l9-4M8 12l3 3 5-6',
  lock: 'M6 10h12v11H6V10M8 10V6a4 4 0 0 1 8 0v4M12 14v3'
};
export function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true'); svg.classList.add('game-icon');
  const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', PATHS[name] ?? PATHS.star); svg.append(path); return svg;
}
export function stylePortrait(element, sect) {
  const art = SECT_ART[sect] ?? SECT_ART.VoDang;
  element.style.setProperty('--portrait-x', `${art.index * 25}%`); element.style.setProperty('--sect-color', art.color);
  element.dataset.sect = sect ?? 'VoDang';
}
export function portrait(sect, className = '') {
  const result = document.createElement('span'); result.className = `portrait ${className}`.trim();
  result.setAttribute('aria-hidden', 'true'); stylePortrait(result, sect); return result;
}
export function decorateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(element => element.replaceChildren(icon(element.dataset.icon)));
}
