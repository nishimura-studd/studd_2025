# DrumSync3D インタラクティブモード技術実装仕様書

## アーキテクチャ分析結果

### 既存システム構造
現在のDrumSync3Dシステムは以下のレイヤーで構成されている：

#### 1. React レイヤー (`DrumSync3D.tsx`)
- 状態管理: `isInitialized`, `audioInitialized`, `isMuted`
- UIコンポーネント: Play ボタン、ボリュームボタン
- ライフサイクル管理: 初期化、破棄

#### 2. アプリケーションレイヤー (`DrumSync3DApp.js`)
- システム統合: `ThreeRenderer` + `DrumSystem`
- コールバック管理: サウンド → 3Dアニメーション
- 音声初期化フロー制御

#### 3. 音響システム (`DrumSystem.js`)
- 個別サウンド再生メソッド: `playKick()`, `playSnare()` など16種類
- ループシステム: 自動切り替え、BPM管理
- コールバック: `triggerSound()` で3Dアニメーションをトリガー

#### 4. 3Dレンダリングシステム (`ThreeRenderer.js`)
- モジュラー設計: SceneManager, CameraSystem, GuideSphere, ObjectSpawner
- カメラ制御: `isCameraAnimationActive` フラグで制御
- サウンド連動: `triggerAnimation()` でオブジェクト生成

## インタラクティブモード実装戦略

### Phase 1: React状態拡張

#### 新規状態追加
```typescript
interface DrumSync3DState {
  // 既存
  isInitialized: boolean;
  audioInitialized: boolean;
  isMuted: boolean;
  
  // 新規
  isInteractiveMode: boolean;
  showController: boolean;
}
```

#### モードEnum定義
```typescript
enum PlayMode {
  AUTO = 'auto',
  INTERACTIVE = 'interactive'
}
```

### Phase 2: アプリケーションレイヤー拡張

#### DrumSync3DApp.js 新規メソッド
```javascript
class DrumSync3DApp {
  // 新規プロパティ
  this.currentMode = 'auto';
  this.soundMapping = { /* 既存マッピング */ };

  // 新規メソッド
  setInteractiveMode() {
    this.currentMode = 'interactive';
    this.drumSystem.stopLoop();
    this.threeRenderer.resetToInteractiveMode();
  }

  setAutoMode() {
    this.currentMode = 'auto';
    this.drumSystem.startRandomSwitchingLoop();
    this.threeRenderer.resetToAutoMode();
  }

  playInteractiveSound(soundType) {
    if (this.currentMode !== 'interactive') return;
    this.drumSystem[`play${capitalize(soundType)}`]();
  }
}
```

### Phase 3: 音響システム拡張

#### DrumSystem.js 修正点
既存の個別再生メソッドを活用：
- `playKick()`, `playSnare()` など16メソッドが既に実装済み
- `triggerSound()` による3Dアニメーション連動も実装済み
- 新規実装不要、既存APIをそのまま利用

#### サウンドマッピング外部化
```javascript
export const INTERACTIVE_SOUND_MAPPING = {
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

// 総数: 16個（bitcrushをdistortionblastで置換）
```

### Phase 4: 3Dシステム拡張

#### ThreeRenderer.js 新規メソッド
```javascript
class ThreeRenderer {
  setInteractiveMode() {
    // オブジェクトクリア
    this.objectSpawner.clearAllObjects();
    // カメラをz直進モードに変更
    this.cameraSystem.setInteractiveMode();
    // ガイドスフィア停止
    this.guideSphere.setInteractiveMode();
  }

  setAutoMode() {
    this.cameraSystem.setAutoMode();
    this.guideSphere.setAutoMode();
  }
}
```

#### CameraSystem.js 拡張
```javascript
class CameraSystem {
  setInteractiveMode() {
    this.isInteractiveMode = true;
    this.camera.position.set(0, 10, 50);
    this.camera.lookAt(0, 0, -100);
  }

  setAutoMode() {
    this.isInteractiveMode = false;
    // 元のカメラ追従システムに戻す
  }
}
```

### Phase 5: UI コンポーネント実装

#### 新規コンポーネント構造
```
DrumSync3D.tsx
├── InteractiveController (new)
│   ├── ControllerGrid (new)
│   │   └── PadButton × 16 (new)
│   └── CloseButton (new)
└── ModeToggleButton (new)
```

#### PadButton コンポーネント
```typescript
interface PadButtonProps {
  soundType: string;
  label: string;
  onTrigger: (soundType: string) => void;
  keyBinding: string;
  isActive: boolean;
  category: 'drum' | 'synth' | 'effect' | 'other';
}

// サウンドタイプからカテゴリーを判定する関数
const getSoundCategory = (soundType: string): 'drum' | 'synth' | 'effect' | 'other' => {
  const drumSounds = ['kick', 'snare', 'hihat', 'openHihat'];
  const synthSounds = ['synthbass', 'synthlead', 'synthpad'];
  const effectSounds = ['glitch', 'static', 'distortionblast'];
  
  if (drumSounds.includes(soundType)) return 'drum';
  if (synthSounds.includes(soundType)) return 'synth';
  if (effectSounds.includes(soundType)) return 'effect';
  return 'other';
};
```

#### キーボードイベント処理
```typescript
useEffect(() => {
  // 2行8列のレイアウトに対応したキーマッピング
  const keyMapping = {
    // 上段（Pad1-8）
    '1': 'kick', '2': 'snare', '3': 'hihat', '4': 'openHihat',
    '5': 'synthbass', '6': 'synthlead', '7': 'synthpad', '8': '808kick',
    
    // 下段（Pad9-16）
    'q': 'glitch', 'w': 'static', 'e': 'distortionblast', 'r': 'vocalchop',
    't': 'click', 'y': 'sequencer', 'u': 'metalclick', 'i': 'minimalbass'
  };

  const handleKeyDown = (event) => {
    if (!isInteractiveMode) return;
    const soundType = keyMapping[event.key.toLowerCase()];
    if (soundType) {
      onPadTrigger(soundType);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isInteractiveMode]);
```

## レイアウト実装詳細

### CSS Grid レスポンシブレイアウト
```css
.interactive-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.three-display {
  flex: 2;
  position: relative;
}

.controller-area {
  flex: 1;
  background: #0d1117;
  padding: 20px;
  border-top: 1px solid #30363d;
}

.pad-container {
  background: #161b22;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* PC版: 2行8列 */
.pad-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* SP版: 4行4列 */
@media (max-width: 768px) {
  .pad-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    max-width: 600px;
    gap: 6px;
  }
  
  .controller-area {
    padding: 16px;
  }
}

/* パッドボタン基本スタイル */
.pad-button {
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid transparent;
  min-height: 48px;
}

/* サウンドタイプ別カラー */
.pad-button.drum {
  background: #2d3748;
  border-color: #4a5568;
}
.pad-button.drum:hover { background: #4a5568; }
.pad-button.drum.active { 
  background: #ed8936; 
  border-color: #ed8936;
  transform: scale(0.95); 
}

.pad-button.synth {
  background: #2b6cb0;
  border-color: #3182ce;
}
.pad-button.synth:hover { background: #3182ce; }
.pad-button.synth.active { 
  background: #63b3ed; 
  border-color: #63b3ed;
  transform: scale(0.95); 
}

.pad-button.effect {
  background: #c53030;
  border-color: #e53e3e;
}
.pad-button.effect:hover { background: #e53e3e; }
.pad-button.effect.active { 
  background: #fc8181; 
  border-color: #fc8181;
  transform: scale(0.95); 
}

.pad-button.other {
  background: #553c9a;
  border-color: #6b46c1;
}
.pad-button.other:hover { background: #6b46c1; }
.pad-button.other.active { 
  background: #a78bfa; 
  border-color: #a78bfa;
  transform: scale(0.95); 
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #c53030;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  transition: all 0.1s ease;
}

.close-button:hover {
  background: #e53e3e;
  transform: scale(1.05);
}
```

## データフロー設計

### インタラクティブモードフロー
```
User Input (Click/Key) 
→ PadButton.onTrigger() 
→ DrumSync3D.handlePadTrigger() 
→ DrumSync3DApp.playInteractiveSound() 
→ DrumSystem.playXXX() 
→ DrumSystem.triggerSound() 
→ ThreeRenderer.triggerAnimation() 
→ ObjectSpawner.triggerSpawn()
```

### モード切り替えフロー
```
Auto → Interactive:
1. User clicks controller icon
2. DrumSync3DApp.setInteractiveMode()
3. DrumSystem.stopLoop()
4. ThreeRenderer.resetToInteractiveMode()
5. UI shows controller

Interactive → Auto:
1. User clicks close button
2. DrumSync3DApp.setAutoMode()
3. ThreeRenderer.resetToAutoMode()
4. DrumSystem.startRandomSwitchingLoop()
5. UI hides controller
```

## パフォーマンス考慮事項

### メモリ管理
- パッドボタンのイベントリスナー適切な削除
- キーボードイベントリスナーのクリーンアップ
- モード切り替え時の不要オブジェクト削除

### レンダリング最適化
- インタラクティブモード時のカメラ固定でCPU負荷軽減
- パッドアニメーションのrequestAnimationFrame使用
- デバウンス処理でキー連打対応

## 実装優先度

### High Priority
1. 基本モード切り替え機能
2. パッドUIレイアウト
3. サウンドトリガー機能

### Medium Priority
1. キーボードショートカット
2. パッドアニメーション
3. レスポンシブ対応

### Low Priority
1. パッドカスタマイゼーション
2. モード切り替えアニメーション
3. 追加サウンドエフェクト

## テスト戦略

### 動作テスト
- 各パッドのサウンド再生確認
- 3Dオブジェクト生成確認
- キーボードショートカット確認
- モード切り替え確認

### パフォーマンステスト
- 連続パッド押下時のメモリリーク確認
- フレームレート維持確認
- モバイルデバイス動作確認

### ブラウザ互換性
- Chrome, Firefox, Safari での動作確認
- Web Audio API 制約の確認
- タッチデバイス対応確認