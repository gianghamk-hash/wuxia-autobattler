/** Broad formation roles, shared by roster, formation and character details. */
export const HERO_ROLES = Object.freeze({ThieuLam:'Tank',VoDang:'SubTank',CaiBang:'Bruiser',NgaMi:'Healer',DuongMon:'RangedDPS'});
export const ROLE_GROUPS = Object.freeze({
  Tank:'frontline',SubTank:'frontline',Bruiser:'frontline',ReflectTank:'frontline',
  Healer:'support',Support:'support',Buffer:'support',Debuffer:'support',Battery:'support',CrowdControl:'support',Disruptor:'support',
  RangedDPS:'damage',BurstMage:'damage',Mage:'damage',Assassin:'damage',DualDPS:'damage',Poisoner:'damage',EvasionDPS:'damage',Finisher:'damage',Wildcard:'damage'
});
export const ROLE_TAGS = Object.freeze({
  frontline:{label:'Tiền tuyến',hint:'Ưu tiên hàng trước để đỡ đòn và giữ chân địch.'},
  support:{label:'Hỗ trợ',hint:'Ưu tiên vị trí được bảo vệ để hồi phục, cường hóa hoặc khống chế.'},
  damage:{label:'Sát thương',hint:'Bố trí theo tầm đánh để tập trung gây sát thương.'}
});
export function formationRole(unit) {
  if(unit.missionAsset)return null;
  return ROLE_GROUPS[unit.role ?? (unit.id==='hero' ? HERO_ROLES[unit.sect] ?? 'Bruiser' : '')] ?? null;
}
