/** Descriptive observations, never a claim that one change guarantees a win. */
export function formationAdvice(members) {
  const notes = [];
  const front = members.filter((u) => u.position?.x === 2);
  if (!front.length)
    notes.push(
      'Tuyến trước đang trống. Có thể đặt người chịu đòn ở cột sát đối thủ.'
    );
  if (!members.some((u) => ['Tank', 'SubTank', 'Bruiser'].includes(u.role)))
    notes.push(
      'Đội thiếu người chịu đòn. Thử ghép một người đỡ đòn với sát thương phía sau.'
    );
  if (!members.some((u) => u.role === 'Healer'))
    notes.push(
      'Đội chưa có người chuyên hồi máu; hãy cân nhắc sức bền khi đi bí cảnh nhiều tầng.'
    );
  for (const u of front.filter((u) => ['Healer', 'RangedDPS'].includes(u.role)))
    notes.push(u.name + ' đang đứng tuyến trước, dễ bị áp sát.');
  if (
    !members.some((u) =>
      Object.values(u.skills ?? {}).some(
        (skill) =>
          skill.dmgMultiplier > 0 ||
          skill.effects?.some((effect) =>
            ['poison', 'burn', 'bleed', 'area_damage'].includes(effect.type)
          )
      )
    )
  )
    notes.push(
      'Đội chưa có chiêu gây sát thương trong bộ kỹ năng hiện tại. Hãy ghép thêm người tấn công để tránh kéo dài.'
    );
  if (!notes.length)
    notes.push(
      'Đội đã có người chịu đòn, hồi phục và gây sát thương. Thử đổi vị trí theo đối thủ; thành phần đội chưa bảo đảm chiến thắng.'
    );
  return notes;
}
export function battleAdvice(result) {
  const home = result.statistics.filter((s) => s.team === 'home'),
    notes = [];
  const first = home
    .filter((s) => Number.isFinite(s.deathAt))
    .sort((a, b) => a.deathAt - b.deathAt)[0];
  if (first)
    notes.push(
      first.name +
        ' bị hạ đầu tiên ở ' +
        first.deathAt.toFixed(1) +
        ' giây, nhận ' +
        Math.ceil(first.damageTaken ?? 0) +
        ' sát thương HP. Hãy xem lại vị trí và nguồn bảo vệ.'
    );
  const top = [...home].sort((a, b) => b.damage - a.damage)[0];
  if (top)
    notes.push(
      top.name +
        ' gây nhiều sát thương nhất đội: ' +
        Math.ceil(top.damage) +
        '.'
    );
  const blocked = [...home].sort(
    (a, b) => (b.blockedTime ?? 0) - (a.blockedTime ?? 0)
  )[0];
  if (blocked?.blockedTime > 3)
    notes.push(
      blocked.name +
        ' có ' +
        blocked.blockedTime.toFixed(1) +
        ' giây không tìm được đường tới mục tiêu. Thử chừa lối đi hoặc dùng người đánh xa.'
    );
  const attacks = home.reduce((a, s) => a + (s.attempts ?? 0), 0),
    misses = home.reduce((a, s) => a + (s.misses ?? 0), 0);
  if (attacks && misses / attacks > 0.3)
    notes.push(
      'Đội đánh hụt ' +
        misses +
        '/' +
        attacks +
        ' lượt trúng đích được kiểm tra. Xem né tránh và hiệu ứng giảm chính xác của đối thủ.'
    );
  if (result.reason === 'timeout')
    notes.push(
      'Cả hai phe còn người khi hết giờ. So sánh hồi máu, khiên và sát thương; đây là các số đo, chưa đủ kết luận một nguyên nhân duy nhất.'
    );
  return notes;
}
