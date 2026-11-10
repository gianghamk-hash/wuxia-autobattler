import {COMPANION_MEMORIES} from '../data/CompanionMemories.js';
import {affinityMilestoneDetails} from '../data/AffinityMilestones.js';

const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
const action=(label,fn,disabled=false)=>{const el=n('button',label);el.type='button';el.disabled=disabled;el.onclick=fn;return el;};
const locked=app=>Boolean(app.model.running||app.model.session.storyProgress.pendingEncounter||app.model.session.adventure.dungeon);
const moment=(app,m,chapter,lines,extra={})=>{
 app.dialogue.show({title:chapter.title,hero:app.model.session.hero,
  quest:{canon:'dai-viet',chapter:app.model.session.storyProgress.currentChapter,location:'Hành trình đồng hành'},
  lines,onBack:()=>app.setView('tavern'),...extra});
 app.setView('dialogue');
};
export function appendCompanionMemoryRoster(app,root){
 const s=app.model.session,progress=s.journey.companionJourneys??{battleWins:{},questDone:[],crossroads:{},watched:[]};
 const owned=COMPANION_MEMORIES.filter(m=>s.party.unlocked.includes(m.id));
 const group=n('details',undefined,'panel companion-journeys');group.append(n('summary','Kỷ niệm và duyên phận · '+owned.length+'/60 đồng hành'));
 group.append(n('p','Mỗi đồng hành có một nhiệm vụ thực chiến riêng tại mốc 50, hai con đường đánh đổi chỉ số tại mốc 75, và hoạt cảnh theo chân dung nhân vật ở mốc 100. Thưởng duyên phận và 60 nội tại độc bản vẫn được giữ nguyên.'));
 for(const m of COMPANION_MEMORIES){
  const has=owned.includes(m),points=s.companionsAffinity[m.id]??0,levels=affinityMilestoneDetails(m.id);
  const card=n('details',undefined,'companion-memory-card');card.dataset.companionId=m.id;
  card.append(n('summary',(has?'':'🔒 ')+m.name+' · '+(has?points+'/100':'Chưa chiêu mộ')+' · '+m.title));
  if(!has){group.append(card);continue;}
  const info=n('div',undefined,'companion-memory-content');
  const image=n('img');image.src=new URL('../../'+m.portrait,import.meta.url).href;image.alt='Chân dung '+m.name;image.loading='lazy';image.width=72;info.append(image);
  info.append(n('p',m.turn));
  for(const chapter of m.chapters){
   const unlock=points>=chapter.at;
   const row=n('div',undefined,'companion-memory-stage');row.dataset.milestone=String(chapter.at);
   row.append(n('strong',chapter.at+'/100 · '+chapter.title),n('p',levels.find(x=>x.at===chapter.at).description));
   if(chapter.at===25){
    row.append(action(unlock?'Đọc ký ức đầu tiên':'Chưa mở ký ức',()=>{
     moment(app,m,chapter,[['Người kể',chapter.text],...chapter.dialogue.map(d=>[d.speaker,d.text])]);
    },!unlock));
   }
   if(chapter.at===50){
    const wins=progress.battleWins?.[m.id]??0,done=progress.questDone?.includes(m.id);
    const evidence=progress.questEvidence?.[m.id]??(progress.questEvidence===undefined&&wins>=2?chapter.quest.required:0);
    row.append(n('p',chapter.quest.objective),n('p',done?'Đã hoàn thành nhiệm vụ cá nhân.':'Mục tiêu hoàn thành: '+evidence+'/'+chapter.quest.required+' lần · Thắng trận và đáp ứng điều kiện riêng.'),
      action('Đọc nhiệm vụ cá nhân',()=>{
       moment(app,m,chapter,[['Người kể',chapter.text],[m.name,m.turn],['Người kể','Mục tiêu: '+chapter.quest.objective],['Trần Phong','Hãy cho ta thấy cách ngươi lựa chọn hành động trong trận.']]);
      },!unlock));
    if(unlock&&!done)row.append(action('Hoàn thành nhiệm vụ',()=>app.run(()=>app.model.completeCompanionQuest(m.id)),evidence<chapter.quest.required||locked(app)));
   }
   if(chapter.at===75){
    const selected=progress.crossroads?.[m.id];
    const chosen=chapter.choices.find(c=>c.id===selected);
    row.append(n('p','Mỗi hướng đều tăng một năng lực và đánh đổi một năng lực khác; tác dụng chỉ áp dụng cho đồng hành khi tham chiến.'));
    if(chosen)row.append(n('p','Đã chọn: '+chosen.label+' · '+chosen.gain+' · '+chosen.cost));
    row.append(action(chosen?'Xem lại ngã rẽ':'Đọc và chọn ngã rẽ',()=>{
     const lines=[['Người kể',chapter.text],[m.name,m.turn],['Trần Phong','Cách nào cũng có giá phải trả. Ta sẽ tôn trọng lựa chọn của ngươi.']];
     if(chosen){moment(app,m,chapter,[...lines,['Người kể','Ngã rẽ đã chọn: '+chosen.label+'. '+chosen.gain+'. '+chosen.cost+'.']]);return;}
     moment(app,m,chapter,lines,{choices:chapter.choices.map(c=>({id:c.id,text:c.label+' — '+c.gain+'; '+c.cost})),
      onChoice:choice=>app.run(()=>{app.model.chooseCompanionCrossroad(m.id,choice);app.setView('tavern');})});
    },!unlock||(!chosen&&locked(app))));
   }
   if(chapter.at===100){
    const played=progress.watched?.includes(m.id);
    row.append(action(played?'Xem lại hoạt cảnh riêng':'Xem hoạt cảnh và tuyệt kỹ độc bản',()=>{
      if(!played)app.run(()=>app.model.watchCompanionCutscene(m.id));
      const beats=chapter.cutscene.beats.map(b=>[b.speaker??'Người kể',b.text]);
      moment(app,m,chapter,[['Người kể',chapter.text],...beats],{storyboard:chapter.cutscene});
    },!unlock||locked(app)));
   }
   info.append(row);
  }
  card.append(info);group.append(card);
 }
 root.append(group);
}
