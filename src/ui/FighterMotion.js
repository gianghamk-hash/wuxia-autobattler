/** Presentation only, in seconds. Six authored poses keep their own action rhythm. */
export function fighterMotion(frame, time, phase = 0, reduced = false) {
  if (reduced) return {x:0,y:0,rotation:0,scaleX:1,scaleY:1};
  const wave=Math.sin(time*2.6+phase), beat=Math.sin(time*14+phase);
  const pose={x:0,y:wave*.8,rotation:0,scaleX:1,scaleY:1+wave*.008};
  if(frame===1)Object.assign(pose,{x:beat*1.8,y:-Math.abs(beat)*3,rotation:beat*.035});
  if(frame===2){const strike=Math.max(0,Math.sin(time*15+phase));Object.assign(pose,{x:strike*9,y:-strike*1.5,rotation:strike*.065});}
  if(frame===3)Object.assign(pose,{y:-2-Math.sin(time*8+phase)*2,scaleX:1+Math.sin(time*8+phase)*.018,rotation:Math.sin(time*6+phase)*.025});
  if(frame===4)Object.assign(pose,{x:beat*3,y:0,rotation:-.04,scaleY:1});
  if(frame===5)Object.assign(pose,{y:0,scaleY:1});
  return pose;
}
