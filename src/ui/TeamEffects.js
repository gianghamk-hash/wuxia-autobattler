import {MAX_AFFINITY7} from '../data/MaxAffinity7.js';
import {storyPerson} from '../data/DaiVietCast.js';
import {icon} from './Visuals.js';
import {sectBonuses} from '../data/StrategyData.js';
import {getActiveSynergies} from '../data/SynergiesData.js';
import {SECTS} from '../data/SectsData.js';
import {COMPANIONS_BY_ID} from '../data/CompanionsData.js';
import {storyHeroBuild} from '../data/HeroIdentity.js';
export function teamEffects(session){
 const sects=[storyHeroBuild(session).sect,...session.party.active.map(id=>session.adventure.tactics.affiliations[id]??COMPANIONS_BY_ID[id].sect)].filter(Boolean);
 const names={ThieuLam:'khiên vào trận',VoDang:'tích nội lực',CaiBang:'sát thương',NgaMi:'hiệu quả hồi máu',DuongMon:'sát thương'};
 return [...sectBonuses(sects).map(b=>`${SECTS[b.sect].name} ${b.count} người · ${b.tier===6?15:b.tier===4?10:5}% ${names[b.sect]}${b.sect==='DuongMon'?' × 0,7':''}`),...getActiveSynergies(sects).map(v=>`${v.name}: ${v.description}`),...session.party.active.filter(id=>(session.companionsAffinity?.[id]??0)>=100&&MAX_AFFINITY7[id]).map(id=>`${storyPerson(session,COMPANIONS_BY_ID[id]).name} · ${MAX_AFFINITY7[id].name} (duyên phận 100/100)`)];
}
export function mountTeamEffects(root,session){
 const box=document.createElement('details');box.className='team-effects';box.open=true;
 const effects=teamEffects(session),title=document.createElement('summary');title.textContent=`Hiệu ứng đội hình · ${effects.length} đã kích hoạt`;box.append(title);
 if(!effects.length){const p=document.createElement('p');p.textContent='Ghép từ 2 người cùng phái hoặc phối các phái tương trợ để kích hoạt buff.';box.append(p);}
 for(const effect of effects){const p=document.createElement('p');p.append(icon('check'),document.createTextNode(effect));box.append(p);}
 root.append(box);return box;
}
