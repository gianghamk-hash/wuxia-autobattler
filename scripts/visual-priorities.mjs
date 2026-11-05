import {MAIN_QUESTS,RECRUIT_QUESTS,ENDINGS} from '../src/data/QuestsData.js';
import {BOND_STORIES} from '../src/data/BondsData.js';
import {COMPANIONS} from '../src/data/CompanionsData.js';
import {NPCS,findNPC,storyEnemy} from '../src/data/NPCData.js';
import {ENCOUNTERS} from '../src/data/EnemiesData.js';
import {FIGHTERS} from '../src/data/PresentationData.js';
import {writeFileSync} from 'node:fs';
const people=[...NPCS,...COMPANIONS],rows=new Map(people.map(p=>[p.id,{id:p.id,name:p.name,portrait:p.portrait,speakerLines:0,mentionedLines:0,battleAppearances:0,hasMotion:FIGHTERS.includes(p.id)}]));
const resolve=name=>findNPC(name)??COMPANIONS.find(p=>p.name===name||(name.length>=3&&p.name.startsWith(name+' ')));
const lines=[...MAIN_QUESTS.flatMap(q=>q.lines),...RECRUIT_QUESTS.flatMap(q=>q.lines),...BOND_STORIES.flatMap(q=>q.lines),...ENDINGS.flatMap(e=>e.lines??[])];
const spokenNames=new Map();
for(const [speaker]of lines){const p=resolve(speaker);if(p)spokenNames.set(p.id,[...(spokenNames.get(p.id)??[]),speaker]);}
for(const [speaker,text] of lines){const person=resolve(speaker);if(person)rows.get(person.id).speakerLines++;
 for(const p of people){const names=[p.name,...(p.aliases??[]),...(spokenNames.get(p.id)??[])];if(names.some(n=>n.length>=3&&text.toLowerCase().includes(n.toLowerCase())))rows.get(p.id).mentionedLines++;}}
for(const q of MAIN_QUESTS.filter(q=>q.encounter)){const e=ENCOUNTERS[q.encounter],count=e.guide?e.templates.length:e.count??e.templates.length;for(let i=0;i<count;i++)rows.get(storyEnemy(q,i,count).id).battleAppearances++;}
const out=[...rows.values()].map(p=>({...p,priority:p.speakerLines*3+p.mentionedLines+p.battleAppearances})).sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify({method:'Static authored lines in main/recruit/bond/endings, each once; mentions count once per line per actor; main-story enemy slots. Priority = 3*speaker lines + mentioned lines + enemy slots. Not player telemetry or a claim of actual play time.',characters:out},null,2)+'\n');
console.log(out.slice(0,24));
