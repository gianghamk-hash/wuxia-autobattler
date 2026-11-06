import {developed,fight} from './balance-campaign7.mjs';
import {writeFileSync} from 'node:fs';
const roster=['companion_59','companion_03','companion_57','companion_08','companion_10'];
const report={version:'7.0',scope:'Deterministic level-20 party built exclusively from story companions (one highest rarity); four-piece exceptional gear, training/forging10. This is a reachability benchmark, not a random-player win rate.',roster,records:[]};
for(const sect of ['ThieuLam','VoDang','CaiBang','NgaMi','DuongMon'])for(const chapter of [5,10,15,18,20]){const c=developed({sect,roster});c.chooseEnding('justice');c.startChapterBoss(chapter);const r=fight(c);report.records.push({sect,chapter,winner:r.winner,seconds:r.duration,phase:c.battle.bossPhase,survivors:c.battle.units.filter(u=>u.team==='home'&&u.alive).length});}
writeFileSync(process.argv[2]??'reports/story-cast7.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({wins:report.records.filter(r=>r.winner==='home').length,matches:report.records.length,losses:report.records.filter(r=>r.winner!=='home')}));
