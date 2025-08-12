// ループパターン定義と実行
export class LoopPatterns {
  constructor(soundEngine) {
    this.soundEngine = soundEngine;
    this.triggerSoundCallback = null;
    this.activeTimeouts = []; // 実行中のタイマーを追跡
  }

  // コールバック設定
  setTriggerSoundCallback(callback) {
    this.triggerSoundCallback = callback;
  }

  // エレクトロニカループ（backupと同じパターン）
  playElectronicaLoop() {
    const bpm = 120;
    const sixteenthNote = 60 / bpm / 4;
    const barLength = sixteenthNote * 16;
    
    const pattern = [
      // 1小節目 - ドラムパターン
      { time: 0, sound: 'kick' },
      { time: sixteenthNote * 2, sound: 'hihat' },
      { time: sixteenthNote * 4, sound: 'snare' },
      { time: sixteenthNote * 6, sound: 'hihat' },
      { time: sixteenthNote * 8, sound: 'kick' },
      { time: sixteenthNote * 10, sound: 'hihat' },
      { time: sixteenthNote * 12, sound: 'snare' },
      { time: sixteenthNote * 14, sound: 'hihat' },
      
      // 2小節目 - ドラムパターン
      { time: barLength, sound: 'kick' },
      { time: barLength + sixteenthNote * 2, sound: 'hihat' },
      { time: barLength + sixteenthNote * 4, sound: 'snare' },
      { time: barLength + sixteenthNote * 6, sound: 'openHihat' },
      { time: barLength + sixteenthNote * 8, sound: 'kick' },
      { time: barLength + sixteenthNote * 10, sound: 'hihat' },
      { time: barLength + sixteenthNote * 12, sound: 'snare' },
      { time: barLength + sixteenthNote * 14, sound: 'hihat' },
      
      // ベースライン（オリジナルと同じ）
      { time: sixteenthNote * 4, sound: 'synthbass', freq: 55 },
      { time: sixteenthNote * 12, sound: 'synthbass', freq: 73 },
      { time: barLength + sixteenthNote * 8, sound: 'synthbass', freq: 55 },
      
      // リードシンセ（オリジナルのメロディー）
      { time: sixteenthNote * 6, sound: 'synthlead', freq: 440 },
      { time: sixteenthNote * 10, sound: 'synthlead', freq: 523 },
      { time: sixteenthNote * 14, sound: 'synthlead', freq: 659 },
      { time: barLength + sixteenthNote * 2, sound: 'synthlead', freq: 330 },
      
      // アンビエントパッド（オリジナルと同じ）
      { time: 0, sound: 'synthpad', freq: 110 },
      { time: barLength, sound: 'synthpad', freq: 146 }
    ];

    this.executePattern(pattern);
  }

  // ノイジーループ（ディストーションブラストを使用）
  playNoisyLoop() {
    const bpm = 120;
    const sixteenthNote = 60 / bpm / 4;
    const barLength = sixteenthNote * 16;
    
    const pattern = [
      // 1小節目
      { time: 0, sound: 'kick' },
      { time: sixteenthNote * 1, sound: 'distortionblast' },
      { time: sixteenthNote * 3, sound: 'glitch' },
      { time: sixteenthNote * 4, sound: 'synthbass', freq: 55 },
      { time: sixteenthNote * 5, sound: 'static' },
      { time: sixteenthNote * 7, sound: 'distortionblast' },
      { time: sixteenthNote * 8, sound: 'snare' },
      { time: sixteenthNote * 9, sound: 'glitch' },
      { time: sixteenthNote * 11, sound: 'distortionblast' },
      { time: sixteenthNote * 12, sound: 'kick' },
      { time: sixteenthNote * 13, sound: 'static' },
      { time: sixteenthNote * 14, sound: 'hihat' },
      { time: sixteenthNote * 15, sound: 'glitch' },
      
      // シンセ要素（1小節目）
      { time: sixteenthNote * 2, sound: 'synthlead', freq: 880 },
      { time: sixteenthNote * 6, sound: 'synthlead', freq: 660 },
      { time: sixteenthNote * 10, sound: 'synthlead', freq: 1320 },
      
      // 2小節目
      { time: barLength, sound: 'kick' },
      { time: barLength + sixteenthNote * 2, sound: 'distortionblast' },
      { time: barLength + sixteenthNote * 3, sound: 'hihat' },
      { time: barLength + sixteenthNote * 4, sound: 'synthbass', freq: 73 },
      { time: barLength + sixteenthNote * 6, sound: 'glitch' },
      { time: barLength + sixteenthNote * 8, sound: 'snare' },
      { time: barLength + sixteenthNote * 9, sound: 'distortionblast' },
      { time: barLength + sixteenthNote * 10, sound: 'static' },
      { time: barLength + sixteenthNote * 12, sound: 'synthbass', freq: 55 },
      { time: barLength + sixteenthNote * 14, sound: 'distortionblast' },
      { time: barLength + sixteenthNote * 15, sound: 'hihat' },
      
      // シンセ要素（2小節目）
      { time: barLength + sixteenthNote * 1, sound: 'synthlead', freq: 440 },
      { time: barLength + sixteenthNote * 7, sound: 'synthlead', freq: 330 },
      { time: barLength + sixteenthNote * 11, sound: 'synthlead', freq: 1760 },
      
      // アンビエントパッド（よりダークに）
      { time: 0, sound: 'synthpad', freq: 82 },
      { time: barLength, sound: 'synthpad', freq: 110 }
    ];

    this.executePattern(pattern);
  }

  // クリックハウスループ（backupと同じパターン）
  playClickhouseLoop() {
    const bpm = 120;
    const sixteenthNote = 60 / bpm / 4;
    const barLength = sixteenthNote * 16;
    
    const pattern = [
      // 1小節目 - ミニマルなパターン
      { time: 0, sound: 'kick' },
      { time: sixteenthNote * 2, sound: 'click' },
      { time: sixteenthNote * 4, sound: 'sequencer' },
      { time: sixteenthNote * 6, sound: 'click' },
      { time: sixteenthNote * 8, sound: 'snare' },
      { time: sixteenthNote * 10, sound: 'metalclick' },
      { time: sixteenthNote * 12, sound: 'kick' },
      { time: sixteenthNote * 14, sound: 'sequencer' },
      { time: sixteenthNote * 15, sound: 'click' },
      
      // ベースライン（1小節目）- オリジナルと同じ
      { time: 0, sound: 'minimalbass', freq: 55 },
      { time: sixteenthNote * 8, sound: 'minimalbass', freq: 73 },
      
      // 2小節目
      { time: barLength, sound: 'kick' },
      { time: barLength + sixteenthNote * 1, sound: 'metalclick' },
      { time: barLength + sixteenthNote * 3, sound: 'click' },
      { time: barLength + sixteenthNote * 5, sound: 'sequencer' },
      { time: barLength + sixteenthNote * 8, sound: 'snare' },
      { time: barLength + sixteenthNote * 9, sound: 'click' },
      { time: barLength + sixteenthNote * 11, sound: 'metalclick' },
      { time: barLength + sixteenthNote * 12, sound: 'kick' },
      { time: barLength + sixteenthNote * 15, sound: 'sequencer' },
      
      // ベースライン（2小節目）- オリジナルと同じ
      { time: barLength, sound: 'minimalbass', freq: 82 },
      { time: barLength + sixteenthNote * 6, sound: 'minimalbass', freq: 65 },
      { time: barLength + sixteenthNote * 12, sound: 'minimalbass', freq: 55 }
    ];

    this.executePattern(pattern);
  }

  // ジャージークラブループ（backupと同じパターン）
  playJerseyClubLoop() {
    const bpm = 120;
    const sixteenthNote = 60 / bpm / 4;
    const barLength = sixteenthNote * 16;
    
    // ジャージークラブの正確なパターン: ⚫︎⚪︎⚫︎⚪︎⚪︎⚫︎⚪︎⚫︎ (8th noteベース)
    const pattern = [
      // 1小節目 - ⚫︎⚪︎⚫︎⚪︎⚪︎⚫︎⚪︎⚫︎
      { time: 0, sound: 'kick' },                    // ⚫︎ (1拍目)
      // ⚪︎ (1拍目裏)
      { time: sixteenthNote * 4, sound: 'kick' },    // ⚫︎ (2拍目)
      // ⚪︎ (2拍目裏)
      // ⚪︎ (3拍目)
      { time: sixteenthNote * 10, sound: 'kick' },   // ⚫︎ (3拍目裏)
      // ⚪︎ (4拍目)
      { time: sixteenthNote * 14, sound: 'kick' },   // ⚫︎ (4拍目裏)
      
      // 2小節目 - 同じパターン
      { time: barLength, sound: 'kick' },                    // ⚫︎
      { time: barLength + sixteenthNote * 4, sound: 'kick' }, // ⚫︎
      { time: barLength + sixteenthNote * 10, sound: 'kick' },// ⚫︎
      { time: barLength + sixteenthNote * 14, sound: 'kick' },// ⚫︎
      
      // スネア（2拍目と4拍目）
      { time: sixteenthNote * 8, sound: 'snare' },
      { time: barLength + sixteenthNote * 8, sound: 'snare' },
      
      // ハイハット
      { time: sixteenthNote * 2, sound: 'hihat' },
      { time: sixteenthNote * 6, sound: 'hihat' },
      { time: sixteenthNote * 12, sound: 'hihat' },
      { time: barLength + sixteenthNote * 2, sound: 'hihat' },
      { time: barLength + sixteenthNote * 6, sound: 'hihat' },
      { time: barLength + sixteenthNote * 12, sound: 'hihat' },
      
      // 808キック（オリジナルパターン）
      { time: 0, sound: '808kick' },
      { time: sixteenthNote * 8, sound: '808kick' },
      { time: barLength, sound: '808kick' },
      { time: barLength + sixteenthNote * 8, sound: '808kick' },
      
      // ボーカルチョップ（オリジナルパターン）
      { time: sixteenthNote * 3, sound: 'vocalchop' },
      { time: sixteenthNote * 7, sound: 'vocalchop' },
      { time: sixteenthNote * 11, sound: 'vocalchop' },
      { time: sixteenthNote * 15, sound: 'vocalchop' },
      { time: barLength + sixteenthNote * 3, sound: 'vocalchop' },
      { time: barLength + sixteenthNote * 7, sound: 'vocalchop' },
      { time: barLength + sixteenthNote * 11, sound: 'vocalchop' },
      { time: barLength + sixteenthNote * 15, sound: 'vocalchop' }
    ];

    this.executePattern(pattern);
  }

  // パターンを実行
  executePattern(pattern) {
    pattern.forEach(({ time, sound, freq }) => {
      const timeoutId = setTimeout(() => {
        // 3Dアニメーションコールバック実行
        if (this.triggerSoundCallback) {
          this.triggerSoundCallback(sound);
        }
        
        switch (sound) {
          case 'kick': this.soundEngine.playKick(); break;
          case 'snare': this.soundEngine.playSnare(); break;
          case 'hihat': this.soundEngine.playHihat(); break;
          case 'openHihat': this.soundEngine.playOpenHihat(); break;
          case 'synthbass': this.soundEngine.playSynthBass(freq, 60 / 120 / 4 * 3); break;
          case 'synthlead': this.soundEngine.playSynthLead(freq, 60 / 120 / 4 * 2); break;
          case 'synthpad': this.soundEngine.playSynthPad(freq, 60 / 120 / 4 * 16); break;
          case 'glitch': this.soundEngine.playGlitch(); break;
          case 'static': this.soundEngine.playStatic(); break;
          case 'distortionblast': this.soundEngine.playDistortionBlast(); break;
          case 'click': this.soundEngine.playClick(); break;
          case 'sequencer': this.soundEngine.playSequencer(); break;
          case 'minimalbass': this.soundEngine.playMinimalBass(freq, 60 / 120 / 4 * 4); break;
          case 'metalclick': this.soundEngine.playMetalClick(); break;
          case '808kick': this.soundEngine.play808Kick(); break;
          case 'bitcrush': this.soundEngine.playBitCrush(); break;
          case 'vocalchop': this.soundEngine.playVocalChop(); break;
        }
      }, time * 1000);
      
      // タイマーIDを記録
      this.activeTimeouts.push(timeoutId);
    });
  }

  // 全てのパターンを停止
  stopAllPatterns() {
    console.log(`LoopPatterns: ${this.activeTimeouts.length}個のタイマーをクリアします`);
    
    // 全てのアクティブなタイマーをクリア
    this.activeTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    
    // タイマーリストをクリア
    this.activeTimeouts = [];
    
    console.log('LoopPatterns: 全てのパターンタイマーを停止しました');
  }

  // ドラムンベースデモループ（4小節）
  playDrumBassDemo() {
    const bpm = 174; // D&Bの典型的なBPM
    const sixteenthNote = 60 / bpm / 4;
    const barLength = sixteenthNote * 16;
    
    const pattern = [
      // 1小節目 - シンプルなキックとスネア
      { time: 0, sound: 'kick' },
      { time: sixteenthNote * 8, sound: 'snare' },
      
      // 2小節目 - ベースライン導入
      { time: barLength, sound: 'kick' },
      { time: barLength + sixteenthNote * 8, sound: 'snare' },
      { time: barLength + sixteenthNote * 4, sound: 'synthbass', freq: 55 },
      { time: barLength + sixteenthNote * 12, sound: 'synthbass', freq: 73 },
      
      // 3小節目 - ハイハットパターン追加
      { time: barLength * 2, sound: 'kick' },
      { time: barLength * 2 + sixteenthNote * 2, sound: 'hihat' },
      { time: barLength * 2 + sixteenthNote * 4, sound: 'hihat' },
      { time: barLength * 2 + sixteenthNote * 6, sound: 'hihat' },
      { time: barLength * 2 + sixteenthNote * 8, sound: 'snare' },
      { time: barLength * 2 + sixteenthNote * 10, sound: 'hihat' },
      { time: barLength * 2 + sixteenthNote * 12, sound: 'hihat' },
      { time: barLength * 2 + sixteenthNote * 14, sound: 'openHihat' },
      { time: barLength * 2 + sixteenthNote * 6, sound: 'synthbass', freq: 82 },
      { time: barLength * 2 + sixteenthNote * 14, sound: 'synthbass', freq: 65 },
      
      // 4小節目 - フルパターン
      { time: barLength * 3, sound: 'kick' },
      { time: barLength * 3 + sixteenthNote * 1, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 3, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 5, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 7, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 8, sound: 'snare' },
      { time: barLength * 3 + sixteenthNote * 9, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 11, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 12, sound: 'kick' },
      { time: barLength * 3 + sixteenthNote * 13, sound: 'hihat' },
      { time: barLength * 3 + sixteenthNote * 15, sound: 'openHihat' },
      
      // ベースライン（4小節目）
      { time: barLength * 3 + sixteenthNote * 2, sound: 'synthbass', freq: 55 },
      { time: barLength * 3 + sixteenthNote * 6, sound: 'synthbass', freq: 73 },
      { time: barLength * 3 + sixteenthNote * 10, sound: 'synthbass', freq: 82 },
      { time: barLength * 3 + sixteenthNote * 14, sound: 'synthbass', freq: 55 },
      
      // リードメロディー（3-4小節目）
      { time: barLength * 2 + sixteenthNote * 8, sound: 'synthlead', freq: 440 },
      { time: barLength * 2 + sixteenthNote * 12, sound: 'synthlead', freq: 523 },
      { time: barLength * 3 + sixteenthNote * 4, sound: 'synthlead', freq: 659 },
      { time: barLength * 3 + sixteenthNote * 8, sound: 'synthlead', freq: 784 },
      { time: barLength * 3 + sixteenthNote * 12, sound: 'synthlead', freq: 523 },
      
      // パッド（全体を通して）
      { time: 0, sound: 'synthpad', freq: 110 },
      { time: barLength, sound: 'synthpad', freq: 146 },
      { time: barLength * 2, sound: 'synthpad', freq: 164 },
      { time: barLength * 3, sound: 'synthpad', freq: 110 }
    ];

    this.executePattern(pattern);
  }

  // 利用可能なループタイプを取得
  getAvailableLoops() {
    return ['electronica', 'noisy', 'clickhouse', 'jerseyclub', 'drumbass'];
  }
}

export default LoopPatterns;