/** Procedural pentatonic BGM and SFX. Audio is optional and unlocked only by a user gesture. */
export class SoundManager {
  constructor({ AudioContext = globalThis.AudioContext ?? globalThis.webkitAudioContext } = {}) {
    this.Context = AudioContext; this.context = null; this.master = null; this.muted = true; this.volume = .35;
    this.track = 'title'; this.timer = null; this.voices = new Set(); this.step = 0; this.nextNote = 0;
  }
  async unlock() {
    if (!this.Context) throw new Error('Trình duyệt chưa hỗ trợ âm thanh Web Audio.');
    if (!this.context) { this.context = new this.Context(); this.master = this.context.createGain(); this.master.connect(this.context.destination); }
    await this.context.resume(); this._gain(); this._start();
  }
  _gain() { if (this.master) this.master.gain.setValueAtTime(this.muted ? 0 : this.volume, this.context.currentTime); }
  setVolume(value) { if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error('Âm lượng không hợp lệ.'); this.volume = value; this._gain(); }
  setMuted(value) { this.muted = Boolean(value); this._gain(); if (this.muted) this._stop(); else this._start(); }
  setTrack(track) {
    if (!['title', 'camp', 'battle', 'ending'].includes(track)) throw new Error('Bản nhạc không tồn tại.');
    if (this.track === track) return; this.track = track; this.step = 0;
    this._stop(); this._start();
  }
  _note(frequency, duration, { when, type = 'sine', gain = .09, slide } = {}) {
    if (!this.context || this.context.state !== 'running' || this.muted || this.voices.size >= 24) return;
    const start = when ?? this.context.currentTime, oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); if(slide)oscillator.frequency.exponentialRampToValueAtTime(slide,start+duration);
    envelope.gain.setValueAtTime(.0001, start); envelope.gain.exponentialRampToValueAtTime(gain, start + .012);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(this.master);
    this.voices.add(oscillator); oscillator.onended = () => { this.voices.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
    oscillator.start(start); oscillator.stop(start + duration + .02);
  }
  _start() {
    if (this.timer || this.muted || !this.context || this.context.state !== 'running' || globalThis.document?.hidden) return;
    this.nextNote = this.context.currentTime + .03;
    this._schedule(); this.timer = setInterval(() => this._schedule(), 100);
  }
  _schedule() {
    if (globalThis.document?.hidden) { this._stop(); return; }
    const melodies = { title: [0, 4, 7, 9, 7, 4, 2, 0], camp: [0, 2, 4, 7, 4, 2, 9, 7], battle: [0, 7, 4, 9, 2, 7, 4, 12], ending: [12, 9, 7, 4, 7, 2, 4, 0] };
    const beat = this.track === 'battle' ? .25 : .5;
    while (this.nextNote < this.context.currentTime + .3) {
      const note = melodies[this.track][this.step % 8];
      this._note(220 * 2 ** (note / 12), beat * .9, { when: this.nextNote });
      if(this.track==='battle'&&this.step%2===0)this._note(90,.14,{when:this.nextNote,gain:.15,type:'sine',slide:42});
      if (this.step % 4 === 0) this._note(110, beat * 1.8, { when: this.nextNote, gain: .045, type: 'sine' });
      this.nextNote += beat; this.step++;
    }
  }
  sfx(kind) {
    const sounds = { click: [660, .06], hit: [120, .09], magic: [740, .14], death: [82, .28], heal: [880, .17], ultimate: [440, .35], victory: [1046, .5], defeat: [146, .5] };
    if(kind==='ultimate'){this._note(330,.35,{type:'triangle',gain:.06});this._note(660,.28,{type:'sine',gain:.05});}
    const sound = sounds[kind]; if (sound) this._note(sound[0], sound[1], { gain: .11, type: kind === 'hit' ? 'sawtooth' : 'sine' });
  }
  _stop() {
    if (this.timer) clearInterval(this.timer); this.timer = null;
    for (const voice of this.voices) { try { voice.stop(); } catch { /* already stopped */ } }
    this.voices.clear();
  }
  visibilityChanged() { if (globalThis.document?.hidden) this._stop(); else this._start(); }
  async dispose() { this._stop(); if (this.context) await this.context.close(); this.context = null; this.master = null; }
}
