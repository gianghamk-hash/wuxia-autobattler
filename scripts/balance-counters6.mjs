import {developed,fight} from './balance-campaign6.mjs';
import {writeFileSync} from 'node:fs';
const report=[];
for(const sect of ['VoDang','ThieuLam','CaiBang','NgaMi','DuongMon']){const c=developed({sect}),rows=[];for(const chapter of [5,10,15,20]){c.startChapterBoss(chapter===20?19:chapter);const r=fight(c);rows.push({chapter:chapter===20?19:chapter,winner:r.winner,seconds:r.duration});}report.push({sect,bosses:rows});}
for(const id of ['u_minh','hoa_lu','son_doong']){const c=developed({roster:['companion_05','companion_49','companion_03','companion_14','companion_20']});c.enterDungeon(id);let count=0;while(c.session.adventure.dungeon){c.chooseRoom(0);const r=fight(c);if(r.winner!=='home')break;count++;}report.push({id,roster:'two healers',floorsWon:count,cleared:c.session.adventure.clears.includes(id)});}
writeFileSync('./reports/counters-campaign6.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
