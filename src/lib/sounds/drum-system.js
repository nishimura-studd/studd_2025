// ドラムシステム - ループ管理とコーディネーション
import SoundEngine from './sound-engine.js';
import LoopPatterns from './loop-patterns.js';

export class DrumSystem {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
    this.masterGain = null;
    this.isMuted = false;
    
    // サブシステム
    this.soundEngine = null;
    this.loopPatterns = null;
    
    // ループシステム状態
    this.loopSystem = {
      isLooping: false,
      currentLoopType: 'electronica',
      loopCount: 0,
      maxLoopsBeforeSwitch: 2,
      loopInterval: null,
      bpm: 120,
      loopLength: (60 / 120) * 8 // 2小節の長さ（秒）
    };
    
    // コールバック
    this.onSoundCallback = null;
    this.onLoopChangeCallback = null;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // マスターゲインノードを作成
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      
      // サブシステムを初期化
      this.soundEngine = new SoundEngine(this.audioContext, this.masterGain);
      this.loopPatterns = new LoopPatterns(this.soundEngine);
      
      // LoopPatternsに3Dアニメーションコールバックを設定
      this.loopPatterns.setTriggerSoundCallback((soundType) => {
        this.triggerSound(soundType);
      });
      
      this.isInitialized = true;
      console.log('ドラムシステムが初期化されました');
      return true;
    } catch (error) {
      console.error('ドラムシステムの初期化に失敗しました:', error);
      throw error;
    }
  }

  // コールバック設定（3Dアニメーション用）
  setSoundCallback(callback) {
    this.onSoundCallback = callback;
  }

  // ループ変更コールバック設定（カメラ切り替え用）
  setLoopChangeCallback(callback) {
    this.onLoopChangeCallback = callback;
  }

  // ボリュームON/OFF切り替え
  toggleVolume() {
    if (!this.isInitialized || !this.masterGain) return;
    
    this.isMuted = !this.isMuted;
    const now = this.audioContext.currentTime;
    
    if (this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.1);
      console.log('音声をミュートしました');
    } else {
      this.masterGain.gain.linearRampToValueAtTime(1.0, now + 0.1);
      console.log('音声のミュートを解除しました');
    }
    
    return this.isMuted;
  }

  // ミュート状態を取得
  getVolumeState() {
    return {
      isMuted: this.isMuted,
      isInitialized: this.isInitialized
    };
  }

  // 音再生時のコールバック実行
  triggerSound(soundType) {
    if (this.onSoundCallback) {
      this.onSoundCallback(soundType);
    }
  }

  // 個別音源の再生メソッド（外部からの直接呼び出し用）
  playKick() {
    if (!this.isInitialized) return;
    this.triggerSound('kick');
    this.soundEngine.playKick();
  }

  playSnare() {
    if (!this.isInitialized) return;
    this.triggerSound('snare');
    this.soundEngine.playSnare();
  }

  playHihat() {
    if (!this.isInitialized) return;
    this.triggerSound('hihat');
    this.soundEngine.playHihat();
  }

  playOpenHihat() {
    if (!this.isInitialized) return;
    this.triggerSound('openHihat');
    this.soundEngine.playOpenHihat();
  }

  playSynthBass(frequency = 55, duration = 0.5) {
    if (!this.isInitialized) return;
    this.triggerSound('synthbass');
    this.soundEngine.playSynthBass(frequency, duration);
  }

  playSynthLead(frequency = 440, duration = 0.3) {
    if (!this.isInitialized) return;
    this.triggerSound('synthlead');
    this.soundEngine.playSynthLead(frequency, duration);
  }

  playSynthPad(frequency = 220, duration = 2.0) {
    if (!this.isInitialized) return;
    this.triggerSound('synthpad');
    this.soundEngine.playSynthPad(frequency, duration);
  }

  play808Kick() {
    if (!this.isInitialized) return;
    this.triggerSound('808kick');
    this.soundEngine.play808Kick();
  }

  playGlitch() {
    if (!this.isInitialized) return;
    this.triggerSound('glitch');
    this.soundEngine.playGlitch();
  }

  playStatic() {
    if (!this.isInitialized) return;
    this.triggerSound('static');
    this.soundEngine.playStatic();
  }

  playBitCrush() {
    if (!this.isInitialized) return;
    this.triggerSound('bitcrush');
    this.soundEngine.playBitCrush();
  }

  playVocalChop() {
    if (!this.isInitialized) return;
    this.triggerSound('vocalchop');
    this.soundEngine.playVocalChop();
  }

  playClick() {
    if (!this.isInitialized) return;
    this.triggerSound('click');
    this.soundEngine.playClick();
  }

  playSequencer() {
    if (!this.isInitialized) return;
    this.triggerSound('sequencer');
    this.soundEngine.playSequencer();
  }

  playMetalClick() {
    if (!this.isInitialized) return;
    this.triggerSound('metalclick');
    this.soundEngine.playMetalClick();
  }

  playMinimalBass(frequency = 55) {
    if (!this.isInitialized) return;
    this.triggerSound('minimalbass');
    this.soundEngine.playMinimalBass(frequency);
  }
  
  playDistortionBlast() {
    if (!this.isInitialized) return;
    this.triggerSound('distortionblast');
    this.soundEngine.playDistortionBlast();
  }

  // ループ管理メソッド
  toggleLoop() {
    if (this.loopSystem.isLooping) {
      this.stopLoop();
    } else {
      this.startRandomSwitchingLoop();
    }
  }

  startRandomSwitchingLoop() {
    if (!this.isInitialized || this.loopSystem.isLooping) return;
    
    this.loopSystem.isLooping = true;
    this.loopSystem.currentLoopType = 'electronica';
    this.loopSystem.loopCount = 0;
    
    // 3Dレンダラーに音楽開始時刻を通知
    if (this.onSoundCallback) {
      this.onSoundCallback('music_start');
    }
    
    this.playCurrentLoop();
    
    this.loopSystem.loopInterval = setInterval(() => {
      if (!this.loopSystem.isLooping) return;
      
      this.loopSystem.loopCount++;
      
      // 指定回数ループしたら別のパターンに切り替え
      if (this.loopSystem.loopCount >= this.loopSystem.maxLoopsBeforeSwitch) {
        this.switchToRandomLoop();
        this.loopSystem.loopCount = 0;
        
        // カメラアングル変更コールバック実行
        if (this.onLoopChangeCallback) {
          this.onLoopChangeCallback();
        }
      }
      
      this.playCurrentLoop();
    }, this.loopSystem.loopLength * 1000);
    
    console.log('ランダム切り替えループを開始しました');
  }

  playCurrentLoop() {
    const loopType = this.loopSystem.currentLoopType;
    // Debug: console.log(`ループ再生: ${loopType} (${this.loopSystem.loopCount + 1}/${this.loopSystem.maxLoopsBeforeSwitch})`);
    
    switch (loopType) {
      case 'electronica':
        this.loopPatterns.playElectronicaLoop();
        break;
      case 'noisy':
        this.loopPatterns.playNoisyLoop();
        break;
      case 'clickhouse':
        this.loopPatterns.playClickhouseLoop();
        break;
      case 'jerseyclub':
        this.loopPatterns.playJerseyClubLoop();
        break;
      default:
        this.loopPatterns.playElectronicaLoop();
    }
  }

  switchToRandomLoop() {
    const availableLoops = this.loopPatterns.getAvailableLoops();
    const currentIndex = availableLoops.indexOf(this.loopSystem.currentLoopType);
    const otherLoops = availableLoops.filter((_, index) => index !== currentIndex);
    const randomIndex = Math.floor(Math.random() * otherLoops.length);
    
    this.loopSystem.currentLoopType = otherLoops[randomIndex];
    console.log(`ループを切り替えました: ${this.loopSystem.currentLoopType}`);
  }

  stopLoop() {
    console.log('ループ停止を開始します');
    
    this.loopSystem.isLooping = false;
    this.loopSystem.loopCount = 0;
    
    // メインのループインターバルを停止
    if (this.loopSystem.loopInterval) {
      clearInterval(this.loopSystem.loopInterval);
      this.loopSystem.loopInterval = null;
    }
    
    // LoopPatternsの進行中のタイマーもクリア
    if (this.loopPatterns) {
      this.loopPatterns.stopAllPatterns();
    }
    
    console.log('ループを完全に停止しました');
  }

  getRandomLoop() {
    const availableLoops = this.loopPatterns.getAvailableLoops();
    const randomIndex = Math.floor(Math.random() * availableLoops.length);
    return availableLoops[randomIndex];
  }

  getLoopStatus() {
    return {
      isLooping: this.loopSystem.isLooping,
      currentLoopType: this.loopSystem.currentLoopType,
      loopCount: this.loopSystem.loopCount,
      maxLoopsBeforeSwitch: this.loopSystem.maxLoopsBeforeSwitch
    };
  }

  dispose() {
    this.stopLoop();
    
    // コールバックをクリア
    this.onSoundCallback = null;
    this.onLoopChangeCallback = null;
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default DrumSystem;