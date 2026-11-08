import {COMPANION_MEMORIES_BY_ID} from '../data/CompanionMemories.js';

const owned=(s,id)=>s.party.unlocked.includes(id)&&Boolean(COMPANION_MEMORIES_BY_ID[id]);
const stage=(s,id)=>s.companionsAffinity?.[id]??0;
export const freshCompanionJourneys=()=>({battleWins:{},questDone:[],crossroads:{},watched:[]});
export function validateCompanionJourneys(state){
 if(state===undefined)return;
 if(!state||Object.getPrototypeOf(state)!==Object.prototype||!state.battleWins||Object.getPrototypeOf(state.battleWins)!==Object.prototype||
 !Array.isArray(state.questDone)||!state.crossroads||Object.getPrototypeOf(state.crossroads)!==Object.prototype||!Array.isArray(state.watched))
  throw Error('Kỷ niệm đồng hành không hợp lệ.');
 const ids=Object.keys(COMPANION_MEMORIES_BY_ID);
 const known=id=>ids.includes(id);
 if(Object.entries(state.battleWins).some(([id,n])=>!known(id)||!Number.isSafeInteger(n)||n<0||n>2))throw Error('Tiến độ nhiệm vụ duyên phận không hợp lệ.');
 for(const arr of [state.questDone,state.watched])
  if(arr.length>60||new Set(arr).size!==arr.length||arr.some(id=>!known(id)))throw Error('Tiến độ kỷ niệm trùng hoặc sai.');
 for(const [id,choice] of Object.entries(state.crossroads))
  if(!known(id)||!COMPANION_MEMORIES_BY_ID[id].chapters[2].choices.some(c=>c.id===choice))throw Error('Ngã rẽ đồng hành không hợp lệ.');
}
export function recordCompanionQuestBattle(session,activeIds){
 const m=session.journey?.companionJourneys??(session.journey.companionJourneys=freshCompanionJourneys());
 for(const id of new Set(activeIds))if(owned(session,id)&&stage(session,id)>=50&&!m.questDone.includes(id))
  m.battleWins[id]=Math.min(2,(m.battleWins[id]??0)+1);
}
export const companionJourneyMethods={
 completeCompanionQuest(id){
  this._mutate(s=>{
   if(!owned(s,id)||stage(s,id)<50)throw Error('Nhiệm vụ riêng chưa mở.');
   const m=s.journey.companionJourneys??(s.journey.companionJourneys=freshCompanionJourneys());
   if(m.questDone.includes(id))throw Error('Nhiệm vụ đã hoàn thành.');
   if((m.battleWins[id]??0)<2)throw Error('Hãy thắng hai trận với đồng hành này trong đội.');
   m.questDone.push(id);
  },'bond');
 },
 chooseCompanionCrossroad(id,choiceId){
  this._mutate(s=>{
   if(!owned(s,id)||stage(s,id)<75)throw Error('Ngã rẽ chưa được mở.');
   const m=s.journey.companionJourneys??(s.journey.companionJourneys=freshCompanionJourneys());
   const choices=COMPANION_MEMORIES_BY_ID[id].chapters[2].choices;
   if(!choices.some(c=>c.id===choiceId))throw Error('Lựa chọn không hợp lệ.');
   if(m.crossroads[id])throw Error('Ngã rẽ đã được quyết định.');
   m.crossroads[id]=choiceId;
  },'bond');
 },
 watchCompanionCutscene(id){
  this._mutate(s=>{
   if(!owned(s,id)||stage(s,id)<100)throw Error('Hoạt cảnh duyên phận chưa mở.');
   const m=s.journey.companionJourneys??(s.journey.companionJourneys=freshCompanionJourneys());
   if(!m.watched.includes(id))m.watched.push(id);
  },'bond');
 }
};
