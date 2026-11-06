import { getSkillVisual } from '../data/SkillVisualsData.js';
import { MUSIC_PLAYLIST } from './MusicPlaylist.js';
/** Continuous recorded playlist and layered procedural combat SFX. Audio is optional and unlocked only by a user gesture. */
export class SoundManager {
  constructor({ AudioContext = globalThis.AudioContext ?? globalThis.webkitAudioContext, Audio = globalThis.Audio, storage } = {}) {
    this.Context = AudioContext; this.context = null; this.master = null; this.muted = true; this.volume = .35;
    this.Audio = Audio; this.music = null; this.musicIndex = 0; this.musicError = null; this.disposed = false;
    try {this.musicStorage=storage??globalThis.localStorage;const saved=JSON.parse(this.musicStorage?.getItem('wuxia:music:1')??'null');if(saved&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<MUSIC_PLAYLIST.length&&Number.isFinite(saved.time)&&saved.time>=0&&saved.time<=3600){this.musicIndex=saved.index;this.restoreTime=saved.time;}}catch{/* Music preferences must never block the game save. */}
    this.track = 'title'; this.timer = null; this.voices = new Set(); this.step = 0; this.nextNote = 0;
  }
  async unlock() {
    if (!this.Context) throw new Error('Trình duyệt chưa hỗ trợ âm thanh Web Audio.');
    if (!this.context) { this.context = new this.Context(); this.master = this.context.createGain(); this.master.connect(this.context.destination); }
    await this.context.resume(); this._gain(); this._start();
  }
  _gain() { if (this.master) this.master.gain.setValueAtTime(this.muted ? 0 : this.volume, this.context.currentTime); if(this.music)this.music.volume=this.muted?0:this.volume*(this.track==='battle'?.65:.85); }
  setVolume(value) { if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error('Âm lượng không hợp lệ.'); this.volume = value; this._gain(); }
  setMuted(value) { this.muted = Boolean(value); this._gain(); if (this.muted) this._stop(); else this._start(); }
  setTrack(track) {
    if (!['title', 'camp', 'battle', 'ending'].includes(track)) throw new Error('Bản nhạc không tồn tại.');
    this.track = track; this._gain();
    // A screen transition only ducks music for combat; it never changes the recording or seek position.
  }

  _note(frequency, duration, { when, type = 'sine', gain = .09, slide } = {}) {
    if (!this.context || this.context.state !== 'running' || this.muted || globalThis.document?.hidden || this.voices.size >= 24) return;
    const start = when ?? this.context.currentTime, oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); if(slide)oscillator.frequency.exponentialRampToValueAtTime(slide,start+duration);
    envelope.gain.setValueAtTime(.0001, start); envelope.gain.exponentialRampToValueAtTime(gain, start + .012);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(this.master);
    this.voices.add(oscillator); oscillator.onended = () => { this.voices.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
    oscillator.start(start); oscillator.stop(start + duration + .02);
  }
  _start() {
    if(this.disposed || this.muted || !this.context || this.context.state!=='running' || globalThis.document?.hidden || !this.Audio)return;
    if(!this.music){
      this.music=new this.Audio();this.music.preload='metadata';this.music.loop=false;
      this.music.src=MUSIC_PLAYLIST[this.musicIndex].url;
      this.music.onloadedmetadata=()=>{if(this.restoreTime>0&&Number.isFinite(this.music.duration)){this.music.currentTime=Math.min(this.restoreTime,Math.max(0,this.music.duration-.1));this.restoreTime=0;}};
      this.music.ontimeupdate=()=>{const mark=Math.floor(this.music.currentTime/15);if(mark!==this.lastMusicMark){this.lastMusicMark=mark;this._rememberMusic();}};
      this.music.onended=()=>{if(this.disposed)return;this.musicIndex=(this.musicIndex+1)%MUSIC_PLAYLIST.length;this.restoreTime=0;this.music.src=MUSIC_PLAYLIST[this.musicIndex].url;this._rememberMusic(0);this._start();};
      this.music.onerror=()=>{this.musicError='Không tải được '+MUSIC_PLAYLIST[this.musicIndex].title;};
      this.music.onplaying=()=>{this.musicError=null;};
    }
    this._gain();
    try{const play=this.music.play();play?.catch(error=>{if(!this.disposed&&error.name!=='AbortError')this.musicError=error.message;});}catch(error){this.musicError=error.message;}
  }
  _rememberMusic(time=this.music?.currentTime??0){try{this.musicStorage?.setItem('wuxia:music:1',JSON.stringify({index:this.musicIndex,time}));}catch{/* Optional position cache. */}}
  _impact(power=1) {
    this._note(105,.22,{gain:.15*power,type:'sine',slide:34});
    this._note(210,.09,{gain:.045*power,type:'triangle',slide:48});
    // Short band-limited noise adds contact without a harsh sustained buzz.
    const c=this.context;if(!c?.createBuffer || this.muted || c.state!=='running' || globalThis.document?.hidden || this.voices.size>=24)return;
    const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*.12),c.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length)**2;
    const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();
    source.buffer=buffer;filter.type='lowpass';filter.frequency.value=1450;gain.gain.value=.16*power;
    source.connect(filter);filter.connect(gain);gain.connect(this.master);this.voices.add(source);
    source.onended=()=>{this.voices.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start();
  }
  sfx(kind) {
    const sounds = { click: [660, .06], hit: [120, .09], magic: [740, .14], death: [82, .28], heal: [880, .17], ultimate: [440, .35], victory: [1046, .5], defeat: [146, .5] };
    if(kind==='hit')this._impact(.7);
    if(kind==='ultimate')this._impact(1.2);
    if(kind==='ultimate'){this._note(330,.35,{type:'triangle',gain:.06});this._note(660,.28,{type:'sine',gain:.05});}
    const sound = sounds[kind]; if (sound) this._note(sound[0], sound[1], { gain: .11, type: kind === 'hit' ? 'sawtooth' : 'sine' });
  }
  skill(event) {
    const p=getSkillVisual(event);if(!p)return;
    if(p.ultimate)this._impact(1.15);else if(['sweep','dash','wave'].includes(p.path))this._impact(.45);
    // Stable pitch per technique plus different envelopes for its physical gesture.
    const hash=[...p.skillId].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0),pitch=1+(hash%7)*.035;
    const bank={
      projectile:[1150,.09,'triangle',280],dash:[580,.13,'sawtooth',90],
      sweep:[190,.14,'triangle',62],wave:[120,.22,'sine',48],
      ward:[640,.26,'sine',920],petals:[880,.28,'sine',1320],
      ribbon:[420,.2,'triangle',980],mist:[220,.3,'sine',160],
      beam:[900,.18,'triangle',1100],lob:[360,.24,'sine',120]
    };
    const [frequency,duration,type,slide]=bank[p.path]??bank.sweep;
    this._note(frequency*pitch,duration,{type,slide:slide*pitch,gain:p.ultimate?.12:.045});
    if(p.ultimate)this._note(frequency*pitch*1.5,duration*.8,{type:'sine',gain:.025});
  }
  _stop() {
    if(this.music)this._rememberMusic();
    this.music?.pause();
    if (this.timer) clearInterval(this.timer); this.timer = null;
    for (const voice of this.voices) { try { voice.stop(); } catch { /* already stopped */ } }
    this.voices.clear();
  }
  visibilityChanged() { if (globalThis.document?.hidden) this._stop(); else this._start(); }
  async dispose() { this.disposed=true; this._stop(); if(this.music){this.music.onended=this.music.onerror=this.music.onloadedmetadata=this.music.ontimeupdate=this.music.onplaying=null;this.music.removeAttribute('src');this.music.load();this.music=null;} if (this.context) await this.context.close(); this.context = null; this.master = null; }
}
