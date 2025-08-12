'use client';

import { useEffect, useState } from 'react';
import PadButton from './PadButton';

interface InteractiveControllerProps {
  onPadTrigger: (soundType: string) => void;
  onClose: () => void;
  isActive: boolean;
}

// サウンドマッピング（将来的に使用する可能性があるため保持）
// const SOUND_MAPPING = {
//   'kick': 'tree',
//   'snare': 'house',
//   'hihat': 'street_light',
//   'openHihat': 'road_diamond',
//   'synthbass': 'utility_pole',
//   'synthlead': 'post',
//   'synthpad': 'crosswalk_stripes',
//   '808kick': 'vending_machine',
//   'glitch': 'guardrail',
//   'static': 'bench',
//   'distortionblast': 'fence',
//   'vocalchop': 'stop',
//   'click': 'bollard',
//   'sequencer': 'hydrant',
//   'metalclick': 'traffic_cone',
//   'minimalbass': 'bus_stop_pole'
// };

// パッド配置（2行8列）
const PAD_LAYOUT = [
  // 上段（数字キー）
  ['kick', 'snare', 'hihat', 'openHihat', 'synthbass', 'synthlead', 'synthpad', '808kick'],
  // 下段（QWERTY）
  ['glitch', 'static', 'distortionblast', 'vocalchop', 'click', 'sequencer', 'metalclick', 'minimalbass']
];

// キーマッピング（配置をシフト：123~ → QWE~、QWE~ → ASD~）
const KEY_MAPPING = {
  // 上段（QWERTYキー - 元の数字キー）
  'q': 'kick', 'w': 'snare', 'e': 'hihat', 'r': 'openHihat',
  't': 'synthbass', 'y': 'synthlead', 'u': 'synthpad', 'i': '808kick',
  
  // 下段（ASDFキー - 元のQWERTY）
  'a': 'glitch', 's': 'static', 'd': 'distortionblast', 'f': 'vocalchop',
  'g': 'click', 'h': 'sequencer', 'j': 'metalclick', 'k': 'minimalbass'
};

// サウンドタイプからキーを取得
const getKeyForSound = (soundType: string): string => {
  return Object.keys(KEY_MAPPING).find(key => KEY_MAPPING[key as keyof typeof KEY_MAPPING] === soundType) || '';
};

const InteractiveController: React.FC<InteractiveControllerProps> = ({
  onPadTrigger,
  onClose,
  isActive
}) => {
  const [activePads, setActivePads] = useState<Set<string>>(new Set());

  // キーボードイベント処理
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const soundType = KEY_MAPPING[event.key.toLowerCase() as keyof typeof KEY_MAPPING];
      if (soundType) {
        event.preventDefault();
        onPadTrigger(soundType);
        
        // アクティブ状態を設定
        setActivePads(prev => new Set(prev).add(soundType));
        
        // 200ms後にアクティブ状態を解除
        setTimeout(() => {
          setActivePads(prev => {
            const newSet = new Set(prev);
            newSet.delete(soundType);
            return newSet;
          });
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onPadTrigger]);

  // パッドクリック処理
  const handlePadClick = (soundType: string) => {
    onPadTrigger(soundType);
    
    // アクティブ状態を設定
    setActivePads(prev => new Set(prev).add(soundType));
    
    // 200ms後にアクティブ状態を解除
    setTimeout(() => {
      setActivePads(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundType);
        return newSet;
      });
    }, 200);
  };

  return (
    <div className="interactive-controller">
      <div className="controller-content">
        {/* 3D表示エリア */}
        <div className="three-display-area" />
        
        {/* コントローラエリア */}
        <div className="controller-area">
          {/* 閉じるボタン */}
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close Interactive Mode"
          >
            <span className="close-text">close</span>
            <span className="close-x"></span>
          </button>
          
          {/* パッドコンテナ */}
          <div className="pad-container">
            <div className="pad-grid">
              {PAD_LAYOUT.flat().map((soundType) => {
                // 長いラベルに改行を追加
                let displayLabel = soundType.toUpperCase();
                if (soundType === 'distortionblast') {
                  displayLabel = 'DISTORTION\nBLAST';
                }
                
                return (
                  <PadButton
                    key={soundType}
                    soundType={soundType}
                    label={displayLabel}
                    onTrigger={handlePadClick}
                    keyBinding={getKeyForSound(soundType)}
                    isActive={activePads.has(soundType)}
                  />
                );
              })}
            </div>
            
            {/* 凡例 */}
            <div className="legend">
              <span className="legend-item">
                <span className="legend-color drums-color"></span> DRUMS
              </span>
              <span className="legend-item">
                <span className="legend-color synth-color"></span> SYNTH
              </span>
              <span className="legend-item">
                <span className="legend-color fx-color"></span> FX
              </span>
              <span className="legend-item">
                <span className="legend-color minimal-color"></span> MINIMAL
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .interactive-controller {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          background-color: transparent;
          pointer-events: none;
        }

        .controller-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .three-display-area {
          flex: 2;
          position: relative;
          background-color: transparent;
        }

        .controller-area {
          flex: 1;
          background: #0d1117;
          padding: 16px;
          border-top: 1px solid #30363d;
          position: relative;
          pointer-events: auto;
          min-height: 0;
        }

        /* スマホサイズでも2/3と1/3の比率を維持 */

        .close-button {
          position: absolute;
          top: 6px;
          right: 16px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: lowercase;
          transition: all 0.2s ease;
          z-index: 20;
          pointer-events: auto;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .close-button:hover {
          color: #ccc;
        }

        .close-text {
          display: inline;
        }

        .close-x {
          display: none;
          font-size: 18px;
          line-height: 1;
          font-weight: 300;
          position: relative;
          width: 12px;
          height: 12px;
        }

        .close-x::before,
        .close-x::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 1.5px;
          background-color: currentColor;
          transform-origin: center;
        }

        .close-x::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .close-x::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .pad-container {
          background: #161b22;
          border-radius: 12px;
          padding: 12px;
          height: calc(100% - 32px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          pointer-events: auto;
          overflow: hidden;
          margin-top: 32px;
          box-sizing: border-box;
        }

        /* PC版: 2行8列 */
        .pad-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(80px, 1fr));
          grid-template-rows: repeat(2, minmax(50px, 70px));
          gap: 16px 10px;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          flex: 1;
          align-content: center;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
          font-size: 0.65rem;
          color: #888;
          text-align: center;
          flex-shrink: 0;
          height: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .drums-color {
          background-color: rgba(255, 100, 100, 0.6);
        }

        .synth-color {
          background-color: rgba(100, 200, 255, 0.6);
        }

        .fx-color {
          background-color: rgba(255, 200, 100, 0.6);
        }

        .minimal-color {
          background-color: rgba(150, 255, 150, 0.6);
        }

        /* タブレット版: 4行4列 */
        @media (max-width: 768px) {
          .controller-area {
            padding: 8px;
            display: flex;
            flex-direction: column;
          }
          
          .pad-container {
            padding: 8px;
            height: calc(100% - 24px);
            margin-top: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 0;
            overflow: hidden;
            box-sizing: border-box;
          }
          
          .pad-grid {
            grid-template-columns: repeat(4, minmax(60px, 1fr));
            grid-template-rows: repeat(4, minmax(40px, 50px));
            max-width: 350px;
            gap: 10px 6px;
            margin: 0 auto;
            flex: 1;
            align-content: center;
          }
          
          .close-button {
            padding: 8px 14px;
            font-size: 14px;
          }

          .legend {
            gap: 8px;
            font-size: 0.55rem;
            margin-top: 4px;
            height: 16px;
            flex-shrink: 0;
          }

          .legend-color {
            width: 8px;
            height: 8px;
          }
        }

        /* モバイル版 - 1/3エリアに最適化 */
        @media (max-width: 480px) {
          .controller-area {
            padding: 4px;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .pad-container {
            padding: 4px;
            height: calc(100% - 8px);
            flex: 1;
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 0;
            overflow: hidden;
            box-sizing: border-box;
          }

          .pad-grid {
            grid-template-columns: repeat(4, minmax(60px, 1fr));
            grid-template-rows: repeat(4, minmax(40px, 50px));
            max-width: 100%;
            gap: 8px 6px;
            margin: 0 auto;
            flex: 1;
            align-content: center;
            width: 100%;
          }

          .close-button {
            position: absolute;
            top: -32px;
            right: 8px;
            padding: 6px;
            font-size: 16px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(20, 20, 20, 0.85);
            backdrop-filter: blur(8px);
            z-index: 30;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.9);
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          .close-button:hover {
            background: rgba(40, 40, 40, 0.9);
            border-color: rgba(255, 255, 255, 0.3);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          }

          .close-button:active {
            transform: scale(0.95);
            background: rgba(60, 60, 60, 0.9);
          }

          .close-text {
            display: none;
          }

          .close-x {
            display: inline;
          }

          .legend {
            display: none;
          }
        }

        /* 極小画面版 */
        @media (max-width: 360px) {
          .pad-grid {
            grid-template-columns: repeat(4, minmax(55px, 1fr));
            grid-template-rows: repeat(4, minmax(35px, 45px));
            max-width: 100%;
            gap: 6px 4px;
            margin: 0 auto;
            flex: 1;
            align-content: center;
            width: 100%;
          }

          .close-button {
            top: -30px;
            right: 6px;
            padding: 5px;
            width: 24px;
            height: 24px;
          }

          .close-x {
            width: 10px;
            height: 10px;
          }

          .close-x::before,
          .close-x::after {
            width: 10px;
            height: 1.2px;
          }
        }

        /* 縦画面の高さが小さい場合の追加調整 */
        @media (max-width: 480px) and (max-height: 600px) {
          .pad-grid {
            grid-template-rows: repeat(4, minmax(35px, 42px));
            gap: 6px 4px;
            max-width: 100%;
          }

          .close-button {
            top: -30px;
            right: 6px;
            width: 22px;
            height: 22px;
            padding: 4px;
          }
        }

        /* さらに高さが小さい場合 */
        @media (max-width: 480px) and (max-height: 500px) {
          .pad-grid {
            grid-template-rows: repeat(4, minmax(30px, 35px));
            gap: 4px 3px;
            max-width: 100%;
          }

          .close-button {
            top: -28px;
            right: 4px;
            width: 20px;
            height: 20px;
            padding: 3px;
          }

          .close-x {
            width: 8px;
            height: 8px;
          }

          .close-x::before,
          .close-x::after {
            width: 8px;
            height: 1px;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveController;