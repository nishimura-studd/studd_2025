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