import test from 'node:test';
import assert from 'node:assert/strict';
import { SoundManager } from '../src/audio/SoundManager.js';
import { SKILL_VISUALS } from '../src/data/SkillVisualsData.js';
import { MUSIC_PLAYLIST } from '../src/audio/MusicPlaylist.js';
class Recording {
 constructor(){this.paused=true;this.currentTime=0;this.volume=1;}
 play(){this.paused=false;return Promise.resolve();} pause(){this.paused=true;}
 removeAttribute(){this.src='';} load(){}
}
function parameter() { return { setValueAtTime() {}, exponentialRampToValueAtTime() {} }; }
class Context {
  constructor() { this.currentTime = 0; this.state = 'suspended'; this.destination = {}; this.started = 0; }
  async resume() { this.state = 'running'; }
  createGain() { return { gain: parameter(), connect() {}, disconnect() {} }; }
  createOscillator() { const context = this; return { frequency: parameter(), connect() {}, disconnect() {}, start() { context.started++; }, stop() { this.onended?.(); } }; }
  async close() { this.state = 'closed'; }
}
test('playlist keeps its recording and position across views, pauses on mute/hidden and wraps after six songs', async () => {
  globalThis.document = { hidden: false };
  const sound = new SoundManager({ AudioContext: Context,Audio:Recording }); sound.sfx('hit'); assert.equal(sound.context, null);assert.equal(sound.music,null);
  await sound.unlock(); assert.equal(sound.music, null); sound.setMuted(false); assert.equal(sound.music.paused,false);assert.equal(sound.music.src,MUSIC_PLAYLIST[0].url);
  sound.sfx('ultimate'); sound.sfx('magic'); sound.sfx('death'); sound.setVolume(.5); assert.throws(() => sound.setVolume(2));
  sound.music.currentTime=42;const music=sound.music;sound.setTrack('battle');sound.setTrack('camp');sound.setTrack('ending');assert.equal(sound.music,music);assert.equal(music.currentTime,42);
  document.hidden = true; sound.visibilityChanged(); assert.equal(music.paused,true);
  document.hidden = false; sound.visibilityChanged(); assert.equal(music.paused,false);assert.equal(music.currentTime,42);
  for(let i=1;i<=6;i++){music.onended();assert.equal(sound.musicIndex,i%6);assert.equal(music.src,MUSIC_PLAYLIST[i%6].url);}
  sound.setMuted(true); assert.equal(music.paused,true);await sound.dispose(); assert.equal(sound.context, null);assert.equal(sound.music,null);assert.equal(music.onended,null);
});
test('unsupported audio rejects clearly without creating a timer', async () => {
  const sound = new SoundManager({ AudioContext: null }); await assert.rejects(sound.unlock(), /chưa hỗ trợ/); assert.equal(sound.timer, null);
});
test('playlist resumes a separate device position cache without touching campaign saves, and rejects corrupt cache',async()=>{
 globalThis.document={hidden:false};let saved=JSON.stringify({index:3,time:52});const storage={getItem:()=>saved,setItem:(_key,v)=>saved=v};
 const sound=new SoundManager({AudioContext:Context,Audio:Recording,storage});await sound.unlock();sound.setMuted(false);sound.music.duration=200;sound.music.onloadedmetadata();assert.equal(sound.musicIndex,3);assert.equal(sound.music.currentTime,52);sound.music.currentTime=62;sound.setMuted(true);assert.deepEqual(JSON.parse(saved),{index:3,time:62});await sound.dispose();
 const corrupt=new SoundManager({AudioContext:Context,Audio:Recording,storage:{getItem:()=>'{bad'}});assert.equal(corrupt.musicIndex,0);await corrupt.dispose();
});
test('skill audio has stable, distinct gestures and remains silent while hidden or without consent',async()=>{
  globalThis.document={hidden:false};const sound=new SoundManager({AudioContext:Context});
  const profiles=['sweep','projectile','ward','petals','dash'].map(path=>SKILL_VISUALS.find(p=>p.path===path&&p.ultimate));
  profiles.forEach(p=>sound.skill({ownerId:p.ownerId,skillId:p.skillId}));assert.equal(sound.context,null);
  await sound.unlock();sound.setMuted(false);const before=sound.context.started;
  profiles.forEach(p=>sound.skill({ownerId:p.ownerId,skillId:p.skillId}));assert.ok(sound.context.started>before);
  document.hidden=true;sound.visibilityChanged();const hidden=sound.context.started;
  profiles.forEach(p=>sound.skill({ownerId:p.ownerId,skillId:p.skillId}));assert.equal(sound.context.started,hidden);
  const notes=[];sound._note=(...args)=>notes.push(args);
  const gestures=profiles.map(p=>{notes.length=0;sound.skill({ownerId:p.ownerId,skillId:p.skillId});return JSON.stringify(notes);});
  assert.equal(new Set(gestures).size,5);
  await sound.dispose();document.hidden=false;
});
