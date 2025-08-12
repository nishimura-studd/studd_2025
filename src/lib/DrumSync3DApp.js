// Next.js対応版 DrumSync3DApp
import ThreeRenderer from './three-renderer.js';
import DrumSystem from './sounds/drum-system.js';

class DrumSync3DApp {
  constructor(container) {
    this.container = container;
    this.threeRenderer = null;
    this.drumSystem = null;
    this.isInitialized = false;
    this.audioInitialized = false;
    this.currentMode = 'auto'; // 'auto' | 'interactive'
    this.soundMapping = {
      'kick': 'tree',
      'snare': 'house',
      'hihat': 'street_light',
      'openHihat': 'road_diamond',
      'synthbass': 'utility_pole',
      'synthlead': 'post',
      'synthpad': 'crosswalk_stripes',
      '808kick': 'vending_machine',
      'glitch': 'guardrail',
      'static': 'bench',
      'distortionblast': 'fence',
      'vocalchop': 'stop',
      'click': 'bollard',
      'sequencer': 'hydrant',
      'metalclick': 'traffic_cone',
      'minimalbass': 'bus_stop_pole'
    };
  }

  async init() {
    try {
      // 3Dレンダラー初期化（コンテナを指定）
      this.threeRenderer = new ThreeRenderer(this.container);
      await this.threeRenderer.init();

      // ドラムシステム初期化（音声はまだ初期化しない）
      this.drumSystem = new DrumSystem();
      
      // ドラムシステムの音再生時に3Dアニメーションをトリガー
      this.drumSystem.setSoundCallback((soundType) => {
        if (soundType === 'music_start') {
          this.threeRenderer.setMusicStartTime();
        } else {
          this.threeRenderer.triggerAnimation(soundType);
        }
      });

      // ループ変更時に3Dアニメーションをトリガー
      this.drumSystem.setLoopChangeCallback(() => {
        this.threeRenderer.onLoopChange();
      });

      this.isInitialized = true;
      console.log('Drum Sync 3D アプリケーションが初期化されました');

    } catch (error) {
      console.error('アプリケーションの初期化に失敗:', error);
      throw error;
    }
  }

  // 音声システムの初期化（ユーザーインタラクション後に呼び出す）
  async initAudio() {
    if (this.audioInitialized) {
      console.log('音声は既に初期化済みです');
      return;
    }

    try {
      console.log('ドラムシステムを初期化中...');
      await this.drumSystem.init();
      console.log('ドラムシステムが初期化されました');
      
      // 初期化後に自動でループを開始
      this.drumSystem.startRandomSwitchingLoop();
      console.log('ループが自動開始されました');
      
      // ThreeRendererにカメラアニメーション開始を通知
      if (this.threeRenderer) {
        this.threeRenderer.setMusicStartTime();
      }
      
      this.audioInitialized = true;
    } catch (error) {
      console.error('ドラムシステムの初期化に失敗:', error);
      throw error;
    }
  }

  // ボリュームトグル
  toggleVolume() {
    if (!this.drumSystem) return false;
    return this.drumSystem.toggleVolume();
  }

  // インタラクティブモードに切り替え
  setInteractiveMode() {
    if (!this.audioInitialized) return;
    
    console.log('DrumSync3DApp: インタラクティブモード切り替え開始');
    
    this.currentMode = 'interactive';
    
    // 1. まずドラムシステムのループを即座に停止
    if (this.drumSystem) {
      console.log('DrumSync3DApp: BGMループを停止します');
      this.drumSystem.stopLoop();
    }
    
    // 2. 次に3Dレンダラーをクリア・切り替え
    if (this.threeRenderer) {
      console.log('DrumSync3DApp: 3Dレンダラーを切り替えます');
      this.threeRenderer.setInteractiveMode();
    }
    
    console.log('DrumSync3DApp: インタラクティブモードに切り替えました');
  }

  // オートモードに切り替え
  setAutoMode() {
    if (!this.audioInitialized) return;
    
    this.currentMode = 'auto';
    
    // 3Dレンダラーをオートモードに切り替え
    this.threeRenderer.setAutoMode();
    
    // ドラムシステムのループを再開
    this.drumSystem.startRandomSwitchingLoop();
    
    console.log('オートモードに切り替えました');
  }

  // インタラクティブモードでサウンドを再生
  playInteractiveSound(soundType) {
    if (this.currentMode !== 'interactive' || !this.drumSystem) return;
    
    console.log(`playInteractiveSound: ${soundType}`);
    
    // サウンドタイプから正確なメソッド名にマッピング
    const soundMethodMap = {
      'kick': 'playKick',
      'snare': 'playSnare',
      'hihat': 'playHihat',
      'openHihat': 'playOpenHihat',
      'synthbass': 'playSynthBass',
      'synthlead': 'playSynthLead',
      'synthpad': 'playSynthPad',
      '808kick': 'play808Kick',
      'glitch': 'playGlitch',
      'static': 'playStatic',
      'distortionblast': 'playDistortionBlast',
      'vocalchop': 'playVocalChop',
      'click': 'playClick',
      'sequencer': 'playSequencer',
      'metalclick': 'playMetalClick',
      'minimalbass': 'playMinimalBass'
    };
    
    const methodName = soundMethodMap[soundType];
    
    if (methodName && typeof this.drumSystem[methodName] === 'function') {
      console.log(`Calling: ${methodName}`);
      this.drumSystem[methodName]();
    } else {
      console.warn(`Unknown sound type: ${soundType}`);
    }
  }

  // 現在のモードを取得
  getCurrentMode() {
    return this.currentMode;
  }

  // アプリケーション終了
  dispose() {
    console.log('DrumSync3DApp disposing...');
    
    if (this.drumSystem) {
      // コールバックをクリアしてからdisposeを呼ぶ
      this.drumSystem.setSoundCallback(null);
      this.drumSystem.setLoopChangeCallback(null);
      this.drumSystem.dispose();
      this.drumSystem = null;
    }
    
    if (this.threeRenderer) {
      this.threeRenderer.dispose();
      this.threeRenderer = null;
    }
    
    this.isInitialized = false;
    this.audioInitialized = false;
  }
}

export default DrumSync3DApp;