const effects = {
  heal: 'hồi máu',
  heal_over_time: 'hồi dần',
  shield: 'hộ thuẫn',
  stun: 'choáng',
  taunt: 'khiêu khích',
  poison: 'độc',
  burn: 'thiêu đốt',
  internal_injury: 'nội thương',
  charm: 'mê hoặc',
  knockback: 'đẩy lùi',
  blink: 'lướt',
  cleanse: 'thanh tẩy',
  area_damage: 'đánh vùng',
  attack_up: 'tăng công',
  accuracy_down: 'giảm chính xác'
};
export const roleLabel = (role) =>
  ({
    Tank: 'Đỡ đòn',
    SubTank: 'Hộ vệ',
    Bruiser: 'Cận chiến',
    Healer: 'Hồi phục',
    Support: 'Hỗ trợ',
    Disruptor: 'Khống chế',
    Assassin: 'Áp sát',
    RangedDPS: 'Đánh xa',
    Mage: 'Nội công',
      Debuffer: 'Làm suy yếu',
      BurstMage: 'Dồn sát thương nội công',
      Buffer: 'Cường hóa đồng đội',
      DualDPS: 'Sát thương hỗn hợp',
      ReflectTank: 'Đỡ đòn / phản kích',
      Poisoner: 'Dùng độc',
      EvasionDPS: 'Né tránh / tấn công',
      CrowdControl: 'Khống chế',
      Battery: 'Tiếp nội lực',
      Finisher: 'Kết liễu',
      Wildcard: 'Biến chiêu',
    Object: 'Mục tiêu nhiệm vụ'
  })[role] ?? 'Võ sĩ';
export function skillSummary(skill) {
  const tags = [
    ...new Set(
      (skill.effects ?? []).map((e) => effects[e.type]).filter(Boolean)
    )
  ];
  return tags.length
    ? tags.join(' · ')
    : skill.dmgMultiplier > 0
      ? skill.type === 'magical'
        ? 'Gây sát thương nội công'
        : 'Gây sát thương ngoại công'
      : 'Hỗ trợ theo mục tiêu chiêu';
}
/** Read-only projection of current AI decisions, not a second prediction/random roll. */
export function battleIntent(combat, unit) {
  if (!unit.alive) return { short: 'Đã bị hạ', text: 'Đã bị hạ', targets: [] };
  if (combat.state === 'finished')
    return { short: 'Kết thúc', text: 'Trận đã kết thúc', targets: [] };
  if (unit.stunned)
    return {
      short: 'Choáng',
      text: 'Đang choáng, không thể hành động',
      targets: []
    };
  const tell = combat.director.bosses.find((b) => b.unit === unit)?.tell;
  if (tell) {
    const targets = tell.targets
      .map((id) => combat.units.find((u) => u.id === id))
      .filter((u) => u?.alive);
    return {
      short: 'Chuẩn bị',
      text:
        'Chuẩn bị ' +
        tell.name +
        ' · ' +
        Math.max(0, tell.until - combat.elapsed).toFixed(1) +
        's' +
        (targets.length
          ? ' · nhắm ' + targets.map((u) => u.name).join(', ')
          : ''),
      targets: targets.map((u) => u.id)
    };
  }
  if (unit.missionAsset)
    return {
      short: unit.rescued ? 'Đang rút' : 'Mục tiêu',
      text: unit.isCaptive
        ? unit.rescued
          ? 'Đã cứu · đang tìm đường ra'
          : 'Đang bị giữ · cần tiếp cận để cứu'
        : 'Mục tiêu nhiệm vụ',
      targets: []
    };
  const brain = combat.brains.get(unit.id),
    action = brain?.action,
    target =
      action?.target ??
      combat.units.find((u) => u.id === brain?.targetId && u.alive);
  if (action && target?.alive) {
    const types = (action.skill.effects ?? []).map((e) => e.type),
      healing = types.some((t) => ['heal', 'heal_over_time'].includes(t)),
      friendly = combat.friendly(action.skill);
    const short = healing
      ? 'Hồi máu'
      : friendly
        ? 'Hỗ trợ'
        : action.ultimate
          ? 'Tuyệt kỹ'
          : 'Ra đòn';
    return {
      short,
      text:
        (healing
          ? 'Chuẩn bị hồi máu cho '
          : friendly
            ? 'Chuẩn bị hỗ trợ '
            : action.ultimate
              ? 'Chuẩn bị tuyệt kỹ nhắm '
              : 'Đang nhắm ') +
        target.name +
        ' · ' +
        action.skill.name,
      targets: [target.id]
    };
  }
  const rooted = unit.statusEffects.some(
    (e) => e.type === 'root' && e.remaining > 0
  );
  if (unit.state === 'RESCUE')
    return {
      short: 'Cứu người',
      text: 'Đang giải cứu · choáng sẽ ngắt thao tác',
      targets: []
    };
  if (rooted)
    return {
      short: 'Giữ chân',
      text: 'Đang bị giữ chân · vẫn có thể đánh và dùng chiêu trong tầm',
      targets: target ? [target.id] : []
    };
  if (unit.state === 'MOVE' && target)
    return {
      short: 'Tiếp cận',
      text: 'Đang tiếp cận ' + target.name,
      targets: [target.id]
    };
  return {
    short: 'Chờ nhịp',
    text: target
      ? 'Theo dõi ' + target.name + ' · chờ nhịp hành động'
      : 'Chưa chọn mục tiêu',
    targets: target ? [target.id] : []
  };
}
