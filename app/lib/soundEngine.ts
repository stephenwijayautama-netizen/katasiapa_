// Web Audio API Generative Sound Engine for Kata Siapa
// 100% Client-side, zero external assets, no latency, authentic relaxing audio.

type BgmMood = 'lofi' | 'midnight' | 'rain';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private currentMood: BgmMood = 'lofi';
  private bgmInterval: any = null;
  private noiseNode: AudioNode | null = null;
  private bgmVolume = 0.35;
  private sfxVolume = 0.6;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. INTERACTIVE SFX (Kocok, Spin, Flip, Chime)
  // ══════════════════════════════════════════════════════════════════════════

  // Sound saat kartu dikocok (Paper Card Riffle & Shuffle)
  playShuffle() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Riffle burst: 4 kartu bergesek cepat
    for (let i = 0; i < 5; i++) {
      const time = now + i * 0.045;
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + i * 200, time);
      filter.Q.setValueAtTime(3.5, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.25, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(time);
      noise.stop(time + 0.055);
    }
  }

  // Sound saat kartu di-spin (Wheel Flutter & Snap)
  playSpin() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const ticks = 7;
    for (let i = 0; i < ticks; i++) {
      const time = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + i * 80, time);
      osc.frequency.exponentialRampToValueAtTime(150, time + 0.04);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.045);
    }
  }

  // Sound saat kartu diklik / dibalik (Soft Tactile Click)
  playFlip() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.085);
  }

  // Sound perayaan / confetti (Harmonic Sparkle Chime)
  playCelebration() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const time = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + 0.42);
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. GENERATIVE BACKGROUND MUSIC (LO-FI CHILL, MIDNIGHT, RAIN)
  // ══════════════════════════════════════════════════════════════════════════

  // Play generative chord
  private playChord(freqs: number[], duration = 3.5) {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    const now = ctx.currentTime;
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Warm lo-fi low-pass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(1.2, now);

      // Smooth attack and long decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain!);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  // Lo-Fi Chord progressions (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
  private lofiChords = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [164.81, 196.0, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.0, 261.63], // Dm7
    [130.81, 164.81, 196.0, 246.94], // Cmaj7
  ];

  // Midnight Ambience (Ethereal drifting 528Hz calm chords)
  private midnightChords = [
    [110.0, 164.81, 220.0, 277.18],  // A major add9
    [98.0, 146.83, 196.0, 246.94],   // G major
    [116.54, 174.61, 233.08, 293.66],// Bb maj7
    [130.81, 196.0, 261.63, 329.63], // C maj9
  ];

  startBGM(mood: BgmMood = 'lofi') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopBGM();
    this.isBgmPlaying = true;
    this.currentMood = mood;

    let step = 0;
    const playNext = () => {
      if (!this.isBgmPlaying) return;
      const chords = mood === 'midnight' ? this.midnightChords : this.lofiChords;
      const chord = chords[step % chords.length];
      this.playChord(chord, 3.8);
      step++;
    };

    // Mainkan chord pertama segera
    playNext();
    this.bgmInterval = setInterval(playNext, 3600);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleBGM(mood?: BgmMood) {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM(mood || this.currentMood);
      return true;
    }
  }

  isPlaying() {
    return this.isBgmPlaying;
  }

  getMood() {
    return this.currentMood;
  }

  setBGMVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  getBGMVolume() {
    return this.bgmVolume;
  }
}

export const soundEngine = new SoundEngine();

