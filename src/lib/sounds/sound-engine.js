// 音源エンジン - 個別の音の生成を担当
export class SoundEngine {
  constructor(audioContext, masterGain) {
    this.audioContext = audioContext;
    this.masterGain = masterGain;
  }

  // キックドラム
  playKick() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.5;

    // メインの低音成分
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, now);
    oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);

    // クリック音成分
    const clickOsc = this.audioContext.createOscillator();
    const clickGain = this.audioContext.createGain();
    
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(80, now);
    clickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
    
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(0.8, now + 0.005);
    clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    
    clickOsc.start(now);
    clickOsc.stop(now + 0.05);
  }

  // スネアドラム
  playSnare() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.2;

    // ノイズ成分
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    
    const highpass = this.audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(200, now);
    
    const bandpass = this.audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, now);
    bandpass.Q.setValueAtTime(1, now);
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.8, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    noiseSource.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // トーン成分
    const oscillator = this.audioContext.createOscillator();
    const toneGain = this.audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(0.4, now + 0.01);
    toneGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.connect(toneGain);
    toneGain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // ハイハット
  playHihat() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.1;

    // 高周波ノイズ
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    
    const highpass = this.audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(7000, now);
    
    const highpass2 = this.audioContext.createBiquadFilter();
    highpass2.type = 'highpass';
    highpass2.frequency.setValueAtTime(10000, now);
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.6, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    noiseSource.connect(highpass);
    highpass.connect(highpass2);
    highpass2.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // 金属的な響き
    const frequencies = [8000, 10000, 12000, 15000];
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + duration);
      
      const volume = 0.1 / (index + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // オープンハイハット
  playOpenHihat() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.3;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    
    const highpass = this.audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(6000, now);
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.7, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    noiseSource.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  // シンセベース
  playSynthBass(frequency = 55, duration = 0.5) {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(frequency, now);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2, now);
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.6, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.4, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc1.connect(filter);
    filter.connect(gain1);
    gain1.connect(this.masterGain);
    
    osc1.start(now);
    osc1.stop(now + duration);
  }

  // シンセリード
  playSynthLead(frequency = 440, duration = 0.25) {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency, now);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 2, now);
    filter.frequency.linearRampToValueAtTime(frequency * 4, now + duration);
    filter.Q.setValueAtTime(5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // シンセパッド
  playSynthPad(frequency = 220, duration = 2) {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    
    const frequencies = [frequency, frequency * 1.25, frequency * 1.5];
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(Math.random() * 10 - 5, now);
      
      const volume = 0.1 / (index + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.5);
      gain.gain.linearRampToValueAtTime(volume * 0.8, now + duration - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // 808キック
  play808Kick() {
    if (!this.audioContext || !this.masterGain) return;
    
    const now = this.audioContext.currentTime;
    const duration = 1.0;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.Q.setValueAtTime(2, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // グリッチエフェクト
  playGlitch() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    
    for (let i = 0; i < 8; i++) {
      const startTime = now + (i * 0.025);
      const burstDuration = 0.02;
      
      const bufferSize = this.audioContext.sampleRate * burstDuration;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let j = 0; j < bufferSize; j++) {
        output[j] = (Math.random() * 2 - 1) * (Math.random() > 0.5 ? 1 : 0);
      }
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.setValueAtTime(0.5 + Math.random() * 2, startTime);
      
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000 + Math.random() * 3000, startTime);
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + burstDuration);
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      source.start(startTime);
      source.stop(startTime + burstDuration);
    }
  }

  // スタティックノイズ
  playStatic() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.15;
    
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.Q.setValueAtTime(0.7, now);
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(now);
    source.stop(now + duration);
  }

  // ディストーションブラスト
  playDistortionBlast() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    
    // ノイズベース
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.8;
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    // ディストーション用ウェーブシェイパー
    const shaper = this.audioContext.createWaveShaper();
    const samples = 256;
    const curve = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 2 - 1;
      const drive = 3;
      curve[i] = Math.tanh(x * drive) * 0.7;
    }
    
    shaper.curve = curve;
    shaper.oversample = '4x';
    
    // バンドパスフィルター
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1500, now + duration);
    filter.Q.setValueAtTime(2, now);
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    source.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(now);
    source.stop(now + duration);
  }

  // ボーカルチョップ
  playVocalChop() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.15;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(330, now + duration);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1200, now + duration);
    filter.Q.setValueAtTime(8, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }
  
  // クリック音
  playClick() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.05;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + duration);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // オリジナルメソッド名との互換性
  playClickSound() {
    return this.playClick();
  }

  // シーケンサー音
  playSequencer() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.03;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // オリジナルメソッド名との互換性
  playSequencerTick() {
    return this.playSequencer();
  }

  // メタルクリック
  playMetalClick() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.08;
    
    const frequencies = [3000, 4500, 6000];
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);
      
      const volume = 0.08 / (index + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // ミニマルベース
  playMinimalBass(frequency = 55, duration = 0.8) {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.Q.setValueAtTime(0.5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.3, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // 808キック（より深い低音）
  play808Kick() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.8;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(50, now);
    oscillator.frequency.exponentialRampToValueAtTime(25, now + 0.2);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.5, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // ビットクラッシュ効果
  playBitCrush() {
    if (!this.audioContext || !this.masterGain || this.audioContext.state === 'closed') return;
    
    const now = this.audioContext.currentTime;
    const duration = 0.15;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

export default SoundEngine;