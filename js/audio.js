/**
 * Diwali Audio Engine - Pure Web Audio API
 * Generates all festive sounds, instruments, and fireworks procedurally
 * Zero external audio files = instant loading, zero latency, 100% offline capable!
 */

class DiwaliAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientRunning = false;
    this.ambientInterval = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;

    // Raag Bhupali / Mohanam notes (pentatonic: Sa, Re, Ga, Pa, Dha, Sa)
    // Warm, peaceful, and traditionally auspicious Indian festive scale
    this.ragaNotes = [
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Sa')
      587.33, // D5 (Re')
      659.25, // E5 (Ga')
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    this.ctx = new AudioContext();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Music & SFX Gain branches
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.7,
        this.ctx.currentTime,
        0.05
      );
    }
    return !this.isMuted;
  }

  // --- AMBIENT TANPURA & BANSURI/SITAR MELODY ---
  startAmbientMusic() {
    if (this.ambientRunning) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.ambientRunning = true;

    // Start soothing Tanpura drone
    try {
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3 fundamental (Sa)

      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(196.00, this.ctx.currentTime); // G3 (Pa)

      droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.musicGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn("Drone audio error:", e);
    }

    // Play meditative melodic notes periodically
    const playMelodyNote = () => {
      if (!this.ambientRunning || this.isMuted) return;
      
      const noteIdx = Math.floor(Math.random() * this.ragaNotes.length);
      const freq = this.ragaNotes[noteIdx];
      
      // Sitar-like pluck
      this.playPluckNote(freq, 0.15, 2.2);

      // Random delay between 1.2s to 3.5s for natural Indian classical cadence
      const delay = 1200 + Math.random() * 2000;
      this.ambientInterval = setTimeout(playMelodyNote, delay);
    };

    this.ambientInterval = setTimeout(playMelodyNote, 800);
  }

  stopAmbientMusic() {
    this.ambientRunning = false;
    if (this.ambientInterval) {
      clearTimeout(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch (e) {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch (e) {}
      this.droneOsc2 = null;
    }
  }

  // --- PLUCKED STRING (Sitar / Veena Style) ---
  playPluckNote(freq, volume = 0.2, duration = 1.8) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, now); // Harmonic ring

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  // --- TEMPLE BELL (Mandir Ghanti) ---
  playBell(freq = 1046.50) { // C6
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, now); // Inharmonic metallic chime

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }

  // --- DIYA LIGHTING SOUND (Spark + Ascending Raga Chime) ---
  playDiyaLight(step = 0) {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // 1. Warm match flame whoosh
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);

    // 2. Auspicious melodic tone based on diya index
    const note = this.ragaNotes[step % this.ragaNotes.length];
    this.playPluckNote(note, 0.28, 1.6);
  }

  // --- ALL DIYAS CELEBRATION CHORD ---
  playCelebrationFanfare() {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();
    
    // Play celebratory arpeggio
    this.ragaNotes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBell(freq * 1.5);
        this.playPluckNote(freq, 0.25, 2.0);
      }, idx * 110);
    });
  }

  // --- SPARKLER (Phooljhadi) HISS & CRACKLE ---
  playSparklerCrackle() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Create high-frequency crackle click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1500 + Math.random() * 2500, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, now);

    const dur = 0.04 + Math.random() * 0.05;
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + dur);
  }

  // --- ANAR (Flower Pot Fountain) FOUNTAIN SOUND ---
  playAnarFountain() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(3200, now + 1.2);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // --- CHAKRI (Ground Spinner) SPIN SOUND ---
  playChakriSpin() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(330, now + 1.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // --- ROCKET / SKY FIREWORK (Launch + Explosion) ---
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // 1. Rising whistle (launch)
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(350, now);
    whistle.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

    whistleGain.gain.setValueAtTime(0.08, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    whistle.connect(whistleGain);
    whistleGain.connect(this.sfxGain);
    whistle.start(now);
    whistle.stop(now + 0.45);

    // 2. Explosion boom (after whistle)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const burstTime = this.ctx.currentTime;

      // Deep sub-bass thud
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'triangle';
      boom.frequency.setValueAtTime(140, burstTime);
      boom.frequency.exponentialRampToValueAtTime(35, burstTime + 0.6);

      boomGain.gain.setValueAtTime(0.4, burstTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.6);

      boom.connect(boomGain);
      boomGain.connect(this.sfxGain);
      boom.start(burstTime);
      boom.stop(burstTime + 0.6);

      // Noise crackle burst
      const burstSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, burstSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < burstSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (burstSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, burstTime);

      const burstGain = this.ctx.createGain();
      burstGain.gain.setValueAtTime(0.3, burstTime);
      burstGain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.7);

      noise.connect(filter);
      filter.connect(burstGain);
      burstGain.connect(this.sfxGain);
      noise.start(burstTime);
    }, 440);
  }

  // --- DISTANT BACKGROUND FIREWORK (Subtle, Muffled Night Sky Thud) ---
  playDistantBoom() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(85 + Math.random() * 35, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // --- RANGOLI COLOR TAP (Woody / Glass Pop) ---
  playColorTap(index = 0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
    const freq = scale[index % scale.length];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // --- MITHAI BITE (Tactile Pop / Crunch) ---
  playBite() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Trigger subtle device haptic feedback if mobile browser supports it
  triggerHaptic(pattern = 18) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

// Global instance
window.diwaliAudio = new DiwaliAudioEngine();

