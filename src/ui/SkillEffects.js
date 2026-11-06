// Canvas-native authored motifs. No combat RNG, damage, movement or targeting is changed here.
const TAU = Math.PI * 2;
function line(c, points, close = false, fill = false) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  if (close) c.closePath(); fill ? c.fill() : c.stroke();
}
function oval(c, x, y, rx, ry = rx, angle = 0, fill = false) {
  c.beginPath(); c.ellipse(x, y, rx, ry, angle, 0, TAU); fill ? c.fill() : c.stroke();
}
function arc(c, x, y, r, from, to) { c.beginPath(); c.arc(x, y, r, from, to); c.stroke(); }
function polygon(c, n, radius, rotation = 0, fill = false) {
  line(c, Array.from({ length: n }, (_, i) => [Math.cos(rotation + i * TAU / n) * radius, Math.sin(rotation + i * TAU / n) * radius]), true, fill);
}
function curve(c, a, b, d, e) { c.beginPath(); c.moveTo(...a); c.bezierCurveTo(...b, ...d, ...e); c.stroke(); }
function petals(c, count, radius, size, rotation = 0) {
  for (let i = 0; i < count; i++) {
    const a = rotation + i * TAU / count;
    oval(c, Math.cos(a) * radius, Math.sin(a) * radius, size, size * .36, a);
  }
}
function sword(c, angle = -.6) {
  c.save(); c.rotate(angle);
  line(c, [[-.12, .7], [-.12, -.65], [0, -.95], [.12, -.65], [.12, .7]], true);
  line(c, [[-.35, .42], [.35, .42]]); line(c, [[0, .7], [0, 1]]); c.restore();
}
function cup(c, x = 0, y = 0, size = 1) {
  c.save(); c.translate(x, y); c.scale(size, size);
  line(c, [[-.5, -.2], [-.4, .4], [.35, .4], [.5, -.2]], true);
  oval(c, 0, -.2, .5, .12); arc(c, .5, .08, .22, -1.5, 1.5); c.restore();
}
export function drawSkillMotif(c, motif, x, y, radius, t, primary, secondary) {
  c.save(); c.translate(x, y); c.scale(radius, radius);
  c.strokeStyle = primary; c.fillStyle = primary; c.lineWidth = .055; c.lineCap = 'round'; c.lineJoin = 'round';
  const child = (name, size = 1, rotation = 0) => { c.save(); c.rotate(rotation); drawSkillMotif(c, name, 0, 0, size, t, primary, secondary); c.restore(); };
  switch (motif) {
    case 'courierKnot':line(c,[[-.75,-.4],[.4,-.4],[.4,.35],[-.75,.35]],true);line(c,[[-.75,-.4],[-.2,.05],[.4,-.4]]);for(let i=0;i<3;i++)line(c,[[.5,-.35+i*.3],[1,-.5+i*.3]]);break;
    case 'ferryRope':arc(c,0,-.15,.6,0,Math.PI*2);line(c,[[-.7,-.5],[.6,.7],[1,.7]]);for(let i=0;i<2;i++)arc(c,-.2,.6+i*.25,.7,0,Math.PI);break;
    case 'timberBrace':line(c,[[-.8,.7],[-.8,-.65],[.8,-.65],[.8,.7]],true);line(c,[[-.8,.7],[0,-.5],[.8,.7]]);line(c,[[-1,.9],[1,.9]]);break;
    case 'watchGate':for(const x of [-.65,.65])line(c,[[x,.8],[x,-.7]]);line(c,[[-.9,-.7],[.9,-.7]]);line(c,[[-.4,.7],[.4,-.4],[.65,-.65]]);break;
    case 'medicThread':line(c,[[-1,.1],[-.55,.1],[-.3,-.55],[0,.65],[.3,-.3],[.5,.1],[1,.1]]);arc(c,0,0,.95,-2.7,-.5);break;
    case 'trailMarks':for(let i=0;i<4;i++){const x=(i%2?.3:-.3),y=-.8+i*.45;arc(c,x,y,.12,0,Math.PI*2);line(c,[[x-.1,y+.18],[x+.12,y+.18]]);}break;
    case 'witnessPages':for(let i=0;i<3;i++){const x=-.75+i*.25;line(c,[[x,-.8+i*.15],[x+.8,-.8+i*.15],[x+.8,.7+i*.1],[x,.7+i*.1]],true);}line(c,[[-.35,-.1],[.25,-.1]]);break;
    case 'caravanGuard':line(c,[[-.9,-.5],[.6,-.5],[.8,.3],[-.7,.3]],true);for(const x of [-.5,.6])arc(c,x,.55,.23,0,Math.PI*2);line(c,[[-1,-.85],[1,-.85]]);break;
    case 'swordPause':sword(c,1);arc(c,0,0,.9,-2.8,-.4);line(c,[[-.9,.6],[-.3,.6],[-.3,.2]]);break;
    case 'harborBeacon':line(c,[[-.3,.7],[-.15,-.8],[.15,-.8],[.3,.7]],true);for(const k of [-1,1]){line(c,[[k*.25,-.65],[k*.95,-.9]]);line(c,[[k*.25,-.4],[k,-.25]]);}arc(c,0,.8,.9,Math.PI,Math.PI*2);break;
    case 'staffSweep':
      c.rotate(-1.1 + t * 1.8); line(c, [[-1, -.07], [1, -.07], [1, .07], [-1, .07]], true); arc(c, 0, 0, .8, -.8, 1.5); break;
    case 'yinYang':
      oval(c, 0, 0, .85); c.fillStyle = secondary; oval(c, 0, -.42, .4, .4, 0, true); oval(c, 0, -.42, .09, .09, 0, true); c.fillStyle = primary; oval(c, 0, .42, .4, .4, 0, true); c.fillStyle = '#163740'; oval(c, 0, .42, .09, .09, 0, true); break;
    case 'lotusStream': petals(c, 7, .38, .42, t * .3); line(c, [[0, .05], [0, -.5], [0, .5], [0, 0], [-.4, 0], [.4, 0]]); break;
    case 'dartFan':
      for (const a of [-.65, 0, .65]) { c.save(); c.rotate(a); line(c, [[-.08, .7], [0, -.8], [.08, .7], [0, .4]], true); c.restore(); } break;
    case 'bellShock':
      curve(c, [-.7, .4], [-.6, -.9], [.6, -.9], [.7, .4]); line(c, [[-.8, .4], [.8, .4]]); oval(c, 0, .53, .13); arc(c, 0, 0, 1.1, .1, 3); break;
    case 'poisonFog':
      for (let i = 0; i < 7; i++) { const a = i * 2.4; oval(c, Math.cos(a) * .55, Math.sin(a) * .4, .28 + t * .06, .23); } break;
    case 'brushBeam':
      c.lineWidth = .12; curve(c, [-.9, .5], [-.4, -.6], [.3, .7], [.9, -.6]); line(c, [[-.4, -.6], [.3, -.4], [-.3, .6]]); break;
    case 'shadowDash':
      for (let i = 0; i < 3; i++) { c.globalAlpha *= .8; curve(c, [-1 + i * .2, .4], [-.3, -.8], [.3, -.8], [.8 + i * .1, .3]); } break;
    case 'woodfishPulse': oval(c, 0, 0, .65, .42); line(c, [[-.5, .05], [.45, -.08]]); for (const r of [.85, 1.1]) arc(c, 0, 0, r, -.6, .7); break;
    case 'fireArrow':
      line(c, [[-.9, .5], [.7, -.5], [.3, -.5], [.7, -.5], [.6, -.1]]); c.strokeStyle = secondary; curve(c, [-.7, .3], [-.9, -.2], [-.2, -.4], [-.1, -.9]); break;
    case 'teaSteam': cup(c, 0, .2); for (const n of [-.3, 0, .3]) curve(c, [n, -.2], [n - .2, -.4], [n + .2, -.6], [n, -.9]); break;
    case 'twinSlash':
      for (let i = 0; i < 5; i++) { const y = -.65 + i * .3; line(c, [[-.85, y + .5], [.8, y - .4]]); } break;
    case 'turtleShell': polygon(c, 6, .85, Math.PI / 6); polygon(c, 6, .4, Math.PI / 6); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * TAU / 6; line(c, [[Math.cos(a) * .4, Math.sin(a) * .4], [Math.cos(a) * .85, Math.sin(a) * .85]]); } break;
    case 'toadBurst':
      oval(c, 0, .15, .56, .4); oval(c, -.28, -.28, .17); oval(c, .28, -.28, .17); line(c, [[-.5, .2], [-.85, .65], [-.45, .55]]); line(c, [[.5, .2], [.85, .65], [.45, .55]]); petals(c, 6, .9, .1); break;
    case 'featherVeil':
      for (let i = 0; i < 5; i++) { const a = i * .35 - .7; c.save(); c.rotate(a); oval(c, 0, -.35, .15, .6, a); line(c, [[0, .7], [0, -.8]]); c.restore(); } break;
    case 'silkCharm': curve(c, [-1, .4], [-.5, -1], [.5, 1], [1, -.4]); curve(c, [-1, .6], [-.5, -.8], [.5, 1.2], [1, -.2]); oval(c, 0, 0, .12); break;
    case 'pillOrbit': polygon(c, 6, .3); for (let i = 0; i < 5; i++) { const a = t * 3 + i * TAU / 5; oval(c, Math.cos(a) * .7, Math.sin(a) * .7, .13, .13, 0, true); } break;
    case 'ironCharge': arc(c, 0, 0, .65, Math.PI, TAU); line(c, [[-.65, 0], [-.4, .7], [.4, .7], [.65, 0]]); line(c, [[-.8, .4], [.8, -.1], [.2, .3]]); break;
    case 'executionCross': c.lineWidth = .14; line(c, [[-.8, -.9], [.8, .9]]); c.strokeStyle = secondary; line(c, [[-.8, .9], [.8, -.9]]); polygon(c, 4, .85, 0); break;
    case 'wineSplash': cup(c, 0, .2, .8); petals(c, 9, .7, .12, t); break;
    case 'bridgeArc': arc(c, 0, .5, .9, Math.PI, TAU); for (const x of [-.7, -.35, 0, .35, .7]) line(c, [[x, -.5], [x, .5]]); break;
    case 'herbBud': line(c, [[0, .9], [0, -.6]]); for (const i of [-1, 1]) for (const y of [-.3, .25]) oval(c, i * .25, y, .35, .12, i * -.5); oval(c, 0, -.7, .17, .26); break;
    case 'bambooBroom': line(c, [[-.8, -.8], [.2, .2]]); for (let i = 0; i < 7; i++) line(c, [[.05, .05], [.3 + i * .1, .9 - i * .09]]); petals(c, 3, .7, .12); break;
    case 'woodenBlade': sword(c, -.75); c.strokeStyle = secondary; oval(c, .5, -.2, .35, .1, -.6); break;
    case 'courierWave': line(c, [[-.7, -.4], [.7, -.4], [.7, .45], [-.7, .45]], true); line(c, [[-.7, -.4], [0, .1], [.7, -.4]]); arc(c, 0, 0, 1, -.6, .6); break;
    case 'hollowChime': oval(c, 0, 0, .75, .4); oval(c, .25, 0, .3, .12); line(c, [[-.9, -.8], [.3, -.2]]); arc(c, 0, 0, 1, .15, 1.3); break;
    case 'anchorChain': line(c, [[0, -.65], [0, .8]]); oval(c, 0, -.75, .15); arc(c, 0, .1, .65, .2, 2.95); line(c, [[-.65, .2], [-.65, .55], [-.25, .4]]); line(c, [[.65, .2], [.65, .55], [.25, .4]]); break;
    case 'rollingStones': for (let i = 0; i < 3; i++) { c.save(); c.translate((i - 1) * .6, .25 - i * .25); c.rotate(t * 3 + i); polygon(c, 7, .34); c.restore(); } break;
    case 'gatePillars': line(c, [[-.8, .8], [-.8, -.4], [.8, -.4], [.8, .8]]); line(c, [[-.9, -.4], [0, -.9], [.9, -.4]]); line(c, [[-.45, -.4], [-.45, .8], [.45, .8], [.45, -.4]]); break;
    case 'needleWeave': for (let i = 0; i < 4; i++) { const y = -.6 + i * .4; line(c, [[-.9, y], [.9, -y]]); oval(c, -.75, y * .8, .08, .03); } break;
    case 'bronzePalm': line(c, [[-.5, .75], [-.7, .1], [-.45, -.05], [-.4, -.65], [-.2, -.75], [-.1, -.1], [0, -.9], [.2, -.9], [.25, -.1], [.45, -.7], [.6, -.55], [.7, .2], [.4, .75]], true); break;
    case 'willowBlade': sword(c, .6); for (let i = 0; i < 5; i++) oval(c, -.6 + i * .25, .5 - i * .2, .25, .07, -.8); break;
    case 'bambooPulse': for (const x of [-.4, .1, .5]) { line(c, [[x, .85], [x, -.8]]); for (const y of [-.5, 0, .5]) line(c, [[x - .08, y], [x + .08, y]]); } oval(c, -.6, -.1, .3, .08, -.6); break;
    case 'basketNet': for (let i = 0; i < 5; i++) { const p = -.8 + i * .4; line(c, [[p, -.8], [p, .8]]); line(c, [[-.8, p], [.8, p]]); } oval(c, 0, 0, 1, .85); break;
    case 'sixCups': for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + t; cup(c, Math.cos(a) * .7, Math.sin(a) * .7, .32); } break;
    case 'craneGuard': curve(c, [-.7, .5], [-.3, -.4], [.3, -.2], [.15, -.8]); line(c, [[.15, -.8], [.65, -.65], [.2, -.55]]); curve(c, [0, 0], [.4, -.6], [1, -.5], [.85, .3]); line(c, [[-.05, .3], [0, .95], [.3, .95]]); break;
    case 'lotusNeedles': petals(c, 6, .32, .35); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; line(c, [[Math.cos(a) * .55, Math.sin(a) * .55], [Math.cos(a), Math.sin(a)]]); } break;
    case 'gullFlights': for (let i = 0; i < 3; i++) { const x = (i - 1) * .65, y = i % 2 ? -.4 : .2; curve(c, [x - .35, y - .15], [x - .1, y - .5], [x, y + .1], [x, y + .1]); curve(c, [x, y + .1], [x + .1, y - .5], [x + .35, y - .15], [x + .4, y - .15]); } break;
    case 'skyCalligraphy': c.lineWidth = .13; curve(c, [-.8, -.6], [.9, -.7], [-.6, .8], [.8, .7]); line(c, [[-.5, 0], [.7, -.2]]); break;
    case 'mountainGate': line(c, [[-1, .7], [-.6, -.5], [-.1, .2], [.4, -.9], [1, .7]], true); line(c, [[-.2, .7], [-.2, .2], [.25, .2], [.25, .7]]); break;
    case 'peachPetals': petals(c, 5, .4, .38, t * 2); c.strokeStyle = secondary; cup(c, 0, .25, .4); break;
    case 'nightCuckoo': curve(c, [-.6, .5], [-.4, -.9], [.2, -.9], [.5, -.2]); line(c, [[.5, -.2], [.85, -.05], [.4, .1]]); petals(c, 5, .8, .12, -t); break;
    case 'moonStrings': arc(c, 0, 0, .9, .4, TAU - .4); arc(c, .35, 0, .7, .6, TAU - .6); for (const y of [-.4, -.1, .2, .5]) line(c, [[-.8, y], [.55, y]]); break;
    case 'thunderBell': child('bellShock', .72); c.strokeStyle = secondary; for (const x of [-.8, .7]) line(c, [[x, -.9], [x - .2, -.2], [x + .15, -.2], [x - .05, .7]]); break;
    case 'puppetThreads': for (let i = 0; i < 5; i++) { const x = (i - 2) * .38; line(c, [[x, -.9], [Math.sin(i + t) * .4, .2], [x, .8]]); oval(c, x, .8, .08); } break;
    case 'rainSword': sword(c, -.3); c.strokeStyle = secondary; for (let i = 0; i < 6; i++) { const x = (i - 3) * .3; line(c, [[x, -.8], [x - .25, -.35]]); } break;
    case 'lotusLanterns': petals(c, 5, .4, .35); line(c, [[-.35, -.1], [-.25, -.7], [.25, -.7], [.35, -.1]], true); oval(c, 0, -.35, .08, .2); break;
    case 'dragonFist': curve(c, [-1, .5], [-.4, -.6], [.1, .9], [.8, -.4]); line(c, [[.8, -.4], [.4, -.8], [.8, -.7], [1, -.9], [.9, -.3], [.55, -.1]]); oval(c, .8, -.5, .05, .05, 0, true); break;
    case 'phoenixWings': for (const side of [-1, 1]) for (let i = 0; i < 5; i++) curve(c, [0, .45], [side * .5, -.8], [side * (1 - i * .1), -.7 + i * .2], [side * .85, .6 - i * .2]); oval(c, 0, -.2, .1, .45); break;
    case 'infinityCut': curve(c, [0, 0], [-1.4, -1.2], [-1.4, 1.2], [0, 0]); curve(c, [0, 0], [1.4, -1.2], [1.4, 1.2], [0, 0]); sword(c, .75); break;
    case 'goldenPeak': child('mountainGate'); child('bronzePalm', .45); petals(c, 8, 1, .1); break;
    case 'diamondWall': polygon(c, 8, 1); polygon(c, 8, .8, .4); child('turtleShell', .6); break;
    case 'dualTaiji': child('yinYang', .65); sword(c, -.8); sword(c, .8); break;
    case 'voidTaiji': child('yinYang'); for (const r of [1.1, 1.25]) arc(c, 0, 0, r, t, t + 4.8); break;
    case 'dragonStaff': child('dragonFist'); child('staffSweep', .8); break;
    case 'drunkFootsteps': for (let i = 0; i < 5; i++) oval(c, Math.sin(i * 2) * .6, -.8 + i * .35, .12, .23, Math.sin(i)); child('wineSplash', .45); break;
    case 'nineNeedles': for (let i = 0; i < 9; i++) { const a = i * TAU / 9; line(c, [[Math.cos(a) * .3, Math.sin(a) * .3], [Math.cos(a), Math.sin(a)]]); } petals(c, 3, .25, .18); break;
    case 'lotusSanctuary': child('lotusStream', .8); arc(c, 0, .2, 1, Math.PI, TAU); petals(c, 9, 1.1, .2, t); break;
    case 'hundredVenoms': child('dartFan'); for (let i = 0; i < 12; i++) { const a = i * 2.4; oval(c, Math.cos(a), Math.sin(a) * .7, .07, .12, a); } break;
    case 'phantomStep': child('shadowDash'); child('featherVeil', .7, -.5); break;
    case 'commandFlag': line(c, [[-.55, 1], [-.55, -1], [.7, -.8], [.4, -.1], [-.55, -.2]]); polygon(c, 3, .25, t); break;
    case 'cageVines': child('gatePillars'); for (const x of [-.4, 0, .4]) curve(c, [x, .8], [x - .4, 0], [x + .4, 0], [x, -.9]); break;
    case 'duelBlade': sword(c, -.7); sword(c, .7); c.strokeStyle = secondary; arc(c, 0, 0, 1, .1, 2.9); break;
    case 'taxSeal': polygon(c, 4, .9, Math.PI / 4); line(c, [[-.4, -.4], [.4, -.4], [0, -.4], [0, .5], [-.4, .1], [.4, .1]]); break;
    case 'blackFan': for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; line(c, [[0, .55], [Math.cos(a), Math.sin(a) - .2]]); } arc(c, 0, -.2, 1, Math.PI, TAU); child('puppetThreads', .4); break;
    case 'guardSpear': line(c, [[-.8, .8], [.65, -.65], [.35, -.55], [.85, -.95], [.65, -.4]], false); break;
    case 'ladleGuard': line(c, [[-.7, .8], [.35, -.35]]); oval(c, .5, -.55, .28, .38, .6); arc(c, 0, 0, .95, .1, 2.7); break;
    case 'roadGuard':
      arc(c, 0, .3, .95, Math.PI, TAU); line(c, [[-1,.25],[1,.25]]);
      c.strokeStyle=secondary; for(const x of [-.28,.28])line(c,[[x,.8],[x,-.2]]);
      for(const x of [-.8,.8])line(c,[[x,-.3],[x,.55]]); break;
    case 'pulseLotus':
      petals(c,4,.42,.36,Math.PI/4);c.strokeStyle=secondary;
      line(c,[[-1,0],[-.45,0],[-.25,-.4],[0,.5],[.22,-.22],[.4,0],[1,0]]);
      oval(c,0,0,.85,.66);break;
    case 'sharedTaiji':
      for(const x of [-.48,.48]){oval(c,x,0,.42,.65);arc(c,x,-.24,.18,-Math.PI/2,Math.PI/2);arc(c,x,.2,.18,Math.PI/2,Math.PI*1.5);}
      c.strokeStyle=secondary;line(c,[[-.2,-.65],[.2,-.65]]);line(c,[[-.2,.65],[.2,.65]]);break;
    case 'singleMeridian':
      c.lineWidth=.11;line(c,[[-.9,.8],[.72,-.72]]);oval(c,-.65,.55,.17,.07,-.8);
      c.strokeStyle=secondary;for(const [x,y] of [[-.6,-.5],[-.15,-.3],[.2,.2],[.55,.5]]){oval(c,x,y,.08);line(c,[[x-.12,y+.15],[x+.12,y-.15]]);}break;
    case 'returnRibbon':
      curve(c,[.85,-.7],[-1.1,-1],[-1.1,.85],[.45,.55]);curve(c,[.85,-.5],[-.8,-.8],[-.8,.65],[.45,.35]);
      c.strokeStyle=secondary;line(c,[[.65,-.7],[.65,.8]]);line(c,[[.45,.45],[.05,.12],[.05,.75]],true);break;
    default: throw new Error(`Missing skill motif: ${motif}`);
  }
  c.restore();
}

export function paintSkillEffect(ctx, effect, t, project, reducedMotion = false) {
  const p = effect.profile, origin = project(effect.origin);
  const targets = effect.targets.length ? effect.targets.map(target => project(target.position)) : [origin];
  ctx.save(); ctx.globalAlpha = Math.min(1, (1 - t) * 3);
  if (reducedMotion) {
    for (const target of targets) drawSkillMotif(ctx, p.motif, target.x, target.y - 15, p.ultimate ? 30 : 12, .5, p.primary, p.secondary);
    ctx.restore(); return;
  }
  ctx.shadowColor = p.primary; ctx.shadowBlur = p.ultimate ? 9 : 2;
  const radius = p.ultimate ? 62 : 15;
  if (t < .35) drawSkillMotif(ctx, p.motif, origin.x, origin.y - 10, radius * .6, t, p.secondary, p.primary);
  for (const target of targets) {
    const progress = Math.min(1, t / .35);
    if (p.path !== 'ward' && progress < 1) {
      const x = origin.x + (target.x - origin.x) * progress;
      const y = origin.y + (target.y - origin.y) * progress - (p.path === 'lob' ? Math.sin(progress * Math.PI) * 65 : 0);
      ctx.strokeStyle = p.primary; ctx.lineWidth = p.ultimate ? 3 : 1.5;
      if (['beam', 'ribbon', 'wave', 'sweep', 'dash'].includes(p.path)) {
        ctx.beginPath(); ctx.moveTo(origin.x, origin.y - 12);
        ctx.quadraticCurveTo((origin.x + x) / 2, (origin.y + y) / 2 - (p.path === 'ribbon' ? 35 : 0), x, y - 12); ctx.stroke();
      }
      drawSkillMotif(ctx, p.motif, x, y - 12, radius * .45, t, p.primary, p.secondary);
    }
    if (t > .12 || p.path === 'ward') {
      const bloom = Math.min(1, (t + .1) / .4);
      drawSkillMotif(ctx, p.motif, target.x, target.y - 14, radius * bloom, t, p.primary, p.secondary);
      if (p.crest && p.ultimate) {
        ctx.strokeStyle = p.secondary; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(target.x, target.y - 10, radius * 1.35, radius * .9, 0, .3, 5.7); ctx.stroke();
      }
    }
  }
  ctx.restore();
}
