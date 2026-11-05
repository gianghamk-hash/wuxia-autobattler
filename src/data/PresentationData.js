const asset = (path) =>
  new URL('../../assets/images/' + path, import.meta.url).href;
export function sceneFor(quest = {}) {
  if(quest.canon==='dai-viet')return asset(quest.scene==='jianghu-village'||quest.scene==='modern'?'jianghu-village.webp':`scenes/${quest.scene}.webp`);
  if (quest.location?.includes('Quán Rồng Lửa'))
    return asset('jianghu-village.webp');
  const chapter = quest.chapter ?? 1;
  const scene =
    chapter <= 1
      ? null
      : chapter <= 3
        ? 'willow_ferry'
        : chapter === 4
          ? 'u_minh'
          : chapter === 5
            ? 'binh_dinh'
            : chapter <= 8
              ? 'hoa_lu'
              : 'yen_tu';
  return asset(scene ? 'scenes/' + scene + '.webp' : 'jianghu-village.webp');
}
export function battleScene(pending, quest, dungeonId) {
  if (pending?.kind === 'main') return sceneFor(quest);
  if (pending?.kind === 'arena') return asset('scenes/binh_dinh.webp');
  if (pending?.kind === 'escort') return asset('scenes/willow_ferry.webp');
  if (
    pending?.kind === 'dungeon' &&
    ['u_minh', 'hoa_lu', 'yen_tu', 'phong_nha', 'son_doong'].includes(dungeonId)
  )
    return asset('scenes/' + dungeonId + '.webp');
  return asset('jianghu-village.webp');
}
export function expressionFor(id, quest = {}) {
  if(quest.canon==='dai-viet'){
    const c=quest.chapter,e=quest.episode;
    const emotion=({be_na:c>=19?'happy':'worried',ba_tu:c>=19?'relieved':'angry',vu_binh:c>=12?'resolved':'worried',tho_bay:c>=15?'resolved':'ashamed',kha_van:c>=6?'resolved':'worried',cam_tu:c>=19?'resolved':'worried',quan_chu:c>=19?'relieved':'serious',doc_le:c>=19?'defeated':'angry',trinh_nghiem:c>=12?'angry':'smirk',do_mau:c>=12?'resigned':'worried',companion_01:c===14?'ashamed':'serious'})[id];
    return emotion?asset(`expressions/${id}-${emotion}.webp`):null;
  }
  const c = quest.chapter ?? 1,
    e = quest.episode ?? 1;
  let emotion;
  if (id === 'be_na') emotion = c === 12 ? 'happy' : 'worried';
  if (id === 'ba_tu') emotion = c === 12 ? 'relieved' : 'angry';
  if (id === 'trinh_nghiem') emotion = c >= 11 && e >= 6 ? 'angry' : 'smirk';
  if (id === 'do_mau')
    emotion = c >= 12 || (c === 8 && e >= 15) ? 'resigned' : 'worried';
  if (id === 'companion_01')
    emotion = [2, 3, 12].includes(c) ? 'ashamed' : 'serious';
  if (id === 'companion_03')
    emotion = c >= 5 || (c === 4 && e >= 7) ? 'relieved' : 'worried';
  if(id==='vu_binh')emotion=c<=3&&e<12?'worried':'resolved';
  if(id==='tho_bay')emotion=c===7&&e<15?'ashamed':'resolved';
  if(id==='kha_van')emotion=c===5&&e<14?'worried':'resolved';
  if(id==='cam_tu')emotion=c<10||(c===10&&e<15)?'worried':'resolved';
  if(id==='quan_chu')emotion=c===1?'serious':c===12?'relieved':undefined;
  if(id==='doc_le')emotion=c<=4?'angry':'defeated';
  return emotion ? asset('expressions/' + id + '-' + emotion + '.webp') : null;
}
export const FIGHTERS = Object.freeze([
  'ThieuLam',
  'VoDang',
  'CaiBang',
  'NgaMi',
  'DuongMon',
  'companion_01',
  'companion_03',
  'trinh_nghiem',
  'tay_sai','kha_van','do_mau','doc_le','quan_chu','companion_02','companion_04','companion_08','nguoi_phu'
]);
export function fighterKey(unit) {
  const id =
    (unit.characterId==='mission_captive'?'nguoi_phu':unit.characterId) ??
    (unit.id === 'hero' || unit.profile ? unit.sect : unit.templateId);
  return FIGHTERS.includes(id) ? id : null;
}
export const fighterURL = (id) => asset('fighters/' + id + '.webp');
