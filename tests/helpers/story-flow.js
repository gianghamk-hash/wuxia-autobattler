/** State/reward tests need a controlled victor, independently of live balance.
 * Reinforce only test battle instances; production enemies retain their real multiplier.
 */
export function reinforceStoryParty(campaign) {
  for (const u of campaign.battle.units.filter(u=>u.team==='home'&&u.alive&&!u.missionAsset&&!u.testFlowReinforced)) {
    u.testFlowReinforced=true;
    u.stats.maxHp*=20;u.stats.hp=u.stats.maxHp;
    u.stats.physicalAtk*=20;u.stats.magicalAtk*=20;
  }
}
