import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DAI_VIET_QUESTS,DAI_VIET_BY_ID,resolveDaiVietQuest} from '../src/data/DaiVietStoryData.js';
import {NARRATION_EDITS7,HOME_NARRATION7} from '../src/data/ConciseNarration7.js';
const words=lines=>lines.reduce((sum,line)=>sum+line[1].trim().split(/\s+/).length,0);

test('default reading is about 20% shorter while every episode keeps its full optional narrative and stable two-line reader',()=>{
 const audit=JSON.parse(readFileSync('reports/dialogue-shortening7.json','utf8'));
 const actual=words(DAI_VIET_QUESTS.flatMap(q=>[...q.lines,...q.aftermath??[]]));
 assert.equal(actual,audit.revised);assert.ok(actual/audit.original>=.78&&actual/audit.original<=.82);
 assert.equal(DAI_VIET_QUESTS.length,400);
 for(const q of DAI_VIET_QUESTS){assert.ok(q.lines.length<=2);assert.ok(!q.aftermath||q.aftermath.length<=2);assert.ok(q.fullLines?.length);assert.ok(q.handoff.length>40);
  const edit=NARRATION_EDITS7[q.id];if(edit)for(const[stage,text]of Object.entries(edit)){const short=q[stage].find(l=>l[0]==='Người kể')[1];assert.ok(short.startsWith(text),q.id);const full=q[stage==='lines'?'fullLines':'fullAftermath'];assert.ok(full.some(l=>l[0]==='Người kể'&&l[1]!==text),q.id);}
 }
});

test('abridged scenes retain the murder evidence, accountability, enrollment and uncertainty of the return choice',()=>{
 const line=id=>[...DAI_VIET_BY_ID[id].lines,...DAI_VIET_BY_ID[id].aftermath??[]].map(l=>l[1]).join(' ');
 for(const clue of ['Hà Lập','Nghiêm','giết Lục Thư','lệnh kho giả','Sổ bạc','Gia đình'])assert.ok(line('D17H12').includes(clue),clue);
 for(const school of ['Thiếu Lâm','Võ Đang','Cái Bang','Nga Mi','Đường Môn'])assert.ok(line('D02H10').includes(school),school);
 assert.ok(line('D19H05').includes('chưa bảo đảm'));assert.ok(line('D14H01').includes('giờ phát lệnh'));
 assert.deepEqual(DAI_VIET_BY_ID.D19H18.choices.map(c=>c.id),['home','stay']);
 assert.deepEqual(DAI_VIET_BY_ID.D19H12.choices.map(c=>c.id),['together','friends']);
});

test('all 22 return-route scenes stay in their own timeline and preserve original full dialogue',()=>{
 const session={hero:{name:'Lan An'},storyProgress:{storyRevision:4,decisions:{D19H18:'home'}}};
 assert.equal(Object.keys(HOME_NARRATION7).length,22);
 for(const id of Object.keys(HOME_NARRATION7)){const q=resolveDaiVietQuest(DAI_VIET_BY_ID[id],session),full=q.fullAftermath??q.fullLines;assert.ok(full.length>=4,id);assert.ok(q.lines.length<=2,id);assert.ok((q.aftermath??q.lines)[0][1].length<full[0][1].length,id);if(q.encounter)assert.equal(q.combatContext,'memory',id);}
 const arrival=resolveDaiVietQuest(DAI_VIET_BY_ID.D20H01,session);assert.ok(arrival.lines[0][1].includes('gần ba tháng'));assert.ok(arrival.lines[0][1].includes('Lan An'));
 const end=resolveDaiVietQuest(DAI_VIET_BY_ID.D20H20,session);assert.ok((end.aftermath??end.lines)[0][1].includes('chưa đường')||(end.aftermath??end.lines)[0][1].includes('Chưa đường'));
});
