'use client';

import { useMemo } from 'react';

interface PadButtonProps {
  soundType: string;
  label: string;
  onTrigger: (soundType: string) => void;
  keyBinding: string;
  isActive: boolean;
}

// サウンドタイプからカテゴリーを判定する関数（drum-demo.htmlと同様の分類）
const getSoundCategory = (soundType: string): 'drums' | 'synth' | 'fx' | 'minimal' => {
  const drumSounds = ['kick', 'snare', 'hihat', 'openHihat'];
  const synthSounds = ['synthbass', 'synthlead', 'synthpad', '808kick'];
  const fxSounds = ['glitch', 'static', 'distortionblast', 'vocalchop'];
  const minimalSounds = ['click', 'sequencer', 'metalclick', 'minimalbass'];
  
  if (drumSounds.includes(soundType)) return 'drums';
  if (synthSounds.includes(soundType)) return 'synth';
  if (fxSounds.includes(soundType)) return 'fx';
  if (minimalSounds.includes(soundType)) return 'minimal';
  return 'minimal'; // default fallback
};

// パッド番号を取得する関数
const getPadNumber = (soundType: string): string => {
  const padNumbers: Record<string, string> = {
    'kick': '01', 'snare': '02', 'hihat': '03', 'openHihat': '04',
    'synthbass': '05', 'synthlead': '06', 'synthpad': '07', '808kick': '08',
    'glitch': '09', 'static': '10', 'distortionblast': '11', 'vocalchop': '12',
    'click': '13', 'sequencer': '14', 'metalclick': '15', 'minimalbass': '16'
  };
  return padNumbers[soundType] || '00';
};

const PadButton: React.FC<PadButtonProps> = ({
  soundType,
  label,
  onTrigger,
  keyBinding,
  isActive
}) => {
  const category = useMemo(() => getSoundCategory(soundType), [soundType]);
  const padNumber = useMemo(() => getPadNumber(soundType), [soundType]);

  const handleClick = () => {
    onTrigger(soundType);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <button
      className={`pad pad-${category} ${isActive ? 'pad-flash' : ''}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      aria-label={`${label} pad (${keyBinding.toUpperCase()})`}
    >
      <div className="pad-number">{padNumber}</div>
      <div className="pad-label">{label.toUpperCase()}</div>
      {keyBinding && (
        <div className="pad-key">{keyBinding.toUpperCase()}</div>
      )}

      <style jsx>{`
        .pad {
          background: rgba(25, 25, 25, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #f0f0f0;
          user-select: none;
          -webkit-user-select: none;
          width: 100%;
          min-height: 50px;
          box-sizing: border-box;
        }

        .pad::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .pad:hover::before {
          opacity: 1;
        }

        .pad:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .pad:active {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .pad:active::before {
          opacity: 0.8;
        }

        .pad-number {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          font-size: 0.6rem;
          opacity: 0.5;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }

        .pad-label {
          font-size: 0.65rem;
          text-align: center;
          line-height: 1.2;
          margin-top: 0.2rem;
          white-space: pre-line;
        }

        .pad-key {
          position: absolute;
          bottom: 0.3rem;
          left: 0.3rem;
          font-size: 0.6rem;
          opacity: 0.7;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }

        /* パッドの光る効果 */
        .pad-flash {
          background: rgba(255, 255, 255, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.8) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5) !important;
          transform: scale(1.05) !important;
        }

        /* パッドカテゴリ別の色分け */
        .pad-drums {
          border-left: 3px solid rgba(255, 100, 100, 0.6);
        }

        .pad-synth {
          border-left: 3px solid rgba(100, 200, 255, 0.6);
        }

        .pad-fx {
          border-left: 3px solid rgba(255, 200, 100, 0.6);
        }

        .pad-minimal {
          border-left: 3px solid rgba(150, 255, 150, 0.6);
        }

        /* モバイル対応 */
        @media (max-width: 768px) {
          .pad {
            font-size: 0.55rem;
            min-height: 40px;
            border-radius: 5px;
          }

          .pad-label {
            font-size: 0.5rem;
            line-height: 1.1;
            margin-top: 0.1rem;
          }
          
          .pad-number, .pad-key {
            font-size: 0.45rem;
          }
          
          .pad-number {
            top: 0.2rem;
            right: 0.2rem;
          }
          
          .pad-key {
            bottom: 0.2rem;
            left: 0.2rem;
            padding: 0.05rem 0.2rem;
          }
        }

        @media (max-width: 480px) {
          .pad {
            font-size: 0.6rem;
            min-height: 40px;
            border-radius: 4px;
          }

          .pad-label {
            font-size: 0.55rem;
            line-height: 1.1;
            margin-top: 0.15rem;
          }
          
          .pad-number {
            font-size: 0.5rem;
            top: 0.25rem;
            right: 0.25rem;
          }
          
          .pad-key {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .pad {
            font-size: 0.5rem;
            min-height: 35px;
            border-radius: 4px;
          }

          .pad-label {
            font-size: 0.45rem;
            line-height: 1.0;
            margin-top: 0.1rem;
          }
          
          .pad-number {
            font-size: 0.4rem;
            top: 0.2rem;
            right: 0.2rem;
          }
          
          .pad-key {
            display: none;
          }
        }

        /* 高さが小さい場合の追加調整 */
        @media (max-width: 480px) and (max-height: 600px) {
          .pad {
            min-height: 35px;
            font-size: 0.55rem;
          }

          .pad-label {
            font-size: 0.5rem;
            line-height: 1.0;
          }
          
          .pad-number {
            font-size: 0.45rem;
          }

          .pad-key {
            display: none;
          }
        }

        @media (max-width: 480px) and (max-height: 500px) {
          .pad {
            font-size: 0.5rem;
            min-height: 30px;
            border-radius: 3px;
          }

          .pad-label {
            font-size: 0.45rem;
            line-height: 0.95;
          }
          
          .pad-number {
            font-size: 0.4rem;
            top: 0.15rem;
            right: 0.15rem;
          }
          
          .pad-key {
            display: none;
          }
        }

        /* タッチデバイス向けのアクセシビリティ */
        @media (hover: none) and (pointer: coarse) {
          .pad:hover {
            transform: none;
          }
          
          .pad:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </button>
  );
};

export default PadButton;