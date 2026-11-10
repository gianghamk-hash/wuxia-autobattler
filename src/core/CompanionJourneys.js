import {COMPANION_MEMORIES_BY_ID} from '../data/CompanionMemories.js';
import {COMPANION_JOURNEY_DESIGNS,companionQuestQualifies} from '../data/CompanionJourneyDesigns.js';

const owned=(s,id)=>s.party.unlocked.includes(id)&&Boolean(COMPANION_MEMORIES_BY_ID[id]);
const stage=(s,id)=>s.companionsAffinity?.[id]??0;
export const freshCompanionJourneys=()=>({battleWins:{},questDone:[],crossroads:{},watched:[]});
const isPlain=v=>v&&Object.getPrototypeOf(v)===Object.prototype;
export function validateCompanionJourneys(state){
 if(state===undefined)return;
 if(!isPlain(state)||!isPlain(state.battleWins)||!Array.isArray(state.questDone)||!isPlain(state.crossroads)||!Array.isArray(state.watched))
  throw Error('Kỷ niệm đồng hành không hợp lệ.');
 const ids=Object.keys(COMPANION_MEMORIES_BY_ID),known=id=>ids.includes(id);
 if(Object.entries(state.battleWins).some(([id,n])=>!known(id)||!Number.isSafeInteger(n)||n<0||n>2))throw Error('Tiến độ nhiệm vụ duyên phận không hợp lệ.');
 for(const arr of [state.questDone,state.watched])
  if(arr.length>60||new Set(arr).size!==arr.length||arr.some(id=>!known(id)))throw Error('Tiến độ kỷ niệm trùng hoặc sai.');
 for(const [id,choice] of Object.entries(state.crossroads))
  if(!known(id)||!COMPANION_MEMORIES_BY_ID[id].chapters[2].choices.some(c=>c.id===choice))throw Error('Ngã rẽ đồng hành không hợp lệ.');
 // Optional: saves from before Sprint 1 did not have evidence at all.
 if(state.questEvidence!==undefined && (!isPlain(state.questEvidence)||Object.entries(state.questEvidence).some(([id,n])=>!known(id)||!Number.isSafeInteger(n)||n<0||n>2)))
  throw Error('Thành tích nhiệm vụ đồng hành không hợp lệ.');
}

/**
 * Backward-compatible: old callers passed only a list of companion IDs.
 * New battle settlements additionally supply result/statistics to prove that
 * the individual quest condition was actually satisfied.
 */
export function recordCompanionQuestBattle(session,participants,result=null){
 const m=session.journey?.companionJourneys??(session.journey.companionJourneys=freshCompanionJourneys());
 const ids=[...new Set(participants.map(u=>typeof u==='string'?u:u.templateId))];
 if(result&&result.winner!=='home')return;
 if(result&&!m.questEvidence){
  // Grandfather already-earned 2-win legacy quests, without granting evidence
  // to newly played fights that do not satisfy their personal objective.
  m.questEvidence=Object.fromEntries(Object.entries(m.battleWins).filter(([id,n])=>n>=2&&owned(session,id)).map(([id])=>[id,2]));
 }
 const statistics=new Map(result?.statistics?.map(row=>[row.id,row])??[]);
 for(const id of ids){
  if(!owned(session,id)||stage(session,id)<50||m.questDone.includes(id))continue;
  m.battleWins[id]=Math.min(2,(m.battleWins[id]??0)+1);
  if(!result)continue;
  const record=statistics.get(id),quest=COMPANION_JOURNEY_DESIGNS[id].quest;
  if(companionQuestQualifies(quest,record,result))
   m.questEvidence[id]=Math.min(quest.required,(m.questEvidence[id]??0)+1);
 }
}
export const companionJourneyMethods={
 completeCompanionQuest(id){
  this._mutate(s=>{
   if(!owned(s,id)||stage(s,id)<50)throw Error('Nhiệm vụ riêng chưa mở.');
   const m=s.journey.companionJourneys??(s.journey.companionJourneys=freshCompanionJourneys());
   if(m.questDone.includes(id))throw Error('Nhiệm vụ đã hoàn thành.');
   const quest=COMPANION_JOURNEY_DESIGNS[id].quest;
   const earned=m.questEvidence?.[id]??(m.questEvidence===undefined&&m.battleWins[id]>=2?quest.required:0);
   if(earned<quest.required)throw Error('Chưa hoàn thành mục tiêu: '+quest.objective);
   m.questDone.push(id);
  },'bond');
 },
 chooseCompanionCrossroad(id,choiceId){
  this._mutate(s=>{
   if(!owned(s,id)||stage(s,id)<75)throw Error('Ngã rẽ chưa được mở.');
   if(this.running||s.storyProgress.pendingEncounter||s.adventure.dungeon)throw Error('Không thể đổi ngã rẽ trong khi đội hình đang khóa cho trận.');
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
