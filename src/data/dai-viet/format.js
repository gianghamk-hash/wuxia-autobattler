/** Parses authored scenes only. No generated dialogue or interchangeable filler. */
export function chapter(number, title, place, summary, goal, bridge, battles, text) {
  const scenes = text.trim().split('\n').map((row, index) => {
    const fields = row.split('|');
    if (fields.length !== 4) throw Error(`Chương ${number} hồi ${index + 1}: sai định dạng`);
    const [title, scene, speech, objective] = fields;
    const dialogue = speech.split('~').map(line => {
      const colon = line.indexOf(':');
      if (colon < 1) throw Error(`Thiếu người nói: ${line}`);
      return [line.slice(0, colon), line.slice(colon + 1).trim()];
    });
    return {title, lines: [['Người kể',scene], ...dialogue], objective};
  });
  if (scenes.length !== 20) throw Error(`Chương ${number}: cần đúng 20 hồi`);
  return {number,title,place,summary,goal,bridge,battles,scenes};
}
