const n = (tag, text) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  return e;
};
export function renderMissionStatus(app) {
  const battle = app.model.battle;
  let root = document.getElementById('mission-status');
  if (!root) {
    root = n('section');
    root.id = 'mission-status';
    root.className = 'panel mission-status';
    document.querySelector('.battle-toolbar').after(root);
  }
  if (!battle?.mission) {
    root.hidden = true;
    return;
  }
  root.hidden = false;
  const s = battle.mission.summary();
  if (root._battle !== battle) {
    root._battle = battle;
    const title = n('h2'),
      desc = n('p'),
      status = n('p'),
      meter = n('progress'),
      assets = n('p'),
      button = n('button', 'Ưu tiên cứu người');
    title.dataset.field = 'title';
    desc.dataset.field = 'description';
    status.dataset.field = 'status';
    meter.dataset.field = 'meter';
    assets.dataset.field = 'assets';
    meter.setAttribute('aria-label', 'Tiến độ mục tiêu');
    button.type = 'button';
    button.id = 'btn-rescue-mission';
    button.onclick = () => {
      if (battle.mission.requestRescue('hero')) app.updateBattleStatus();
    };
    const help=n('details'),summary=n('summary','Cách hoàn thành');help.append(summary,desc,n('p','Thất bại: '+s.failure));
    root.replaceChildren(title, status, meter, assets, button,help);
  }
  for (const key of ['title', 'description', 'status'])
    root.querySelector('[data-field="' + key + '"]').textContent = s[key];
  const meter = root.querySelector('progress');
  meter.max = s.max;
  meter.value = s.value;
  root.querySelector('[data-field="assets"]').textContent = s.assets
    .map(
      (a) =>
        a.name +
        ': ' +
        (a.alive
          ? Math.ceil(a.hp) + '/' + Math.ceil(a.maxHp) + ' HP'
          : 'Đã bị phá / bị hạ')
    )
    .join(' · ');
  const button = root.querySelector('button');
  button.hidden = s.type !== 'rescue';
  button.disabled = !s.canRescue;
  button.textContent = battle.mission.helperId
    ? 'Đã ưu tiên cứu · đang tiếp cận'
    : 'Ưu tiên cứu người';
}
