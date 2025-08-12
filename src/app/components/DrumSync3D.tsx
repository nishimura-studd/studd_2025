'use client';

import { useEffect, useRef, useState } from 'react';
import InteractiveController from './InteractiveController';

interface DrumSync3DProps {
  width?: string;
  height?: string;
  className?: string;
  autoStart?: boolean;
}

// SVG Volume Icons
const VolumeOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const VolumeOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>
);

const ControllerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    {/* 4x4 PAD grid layout */}
    <g transform="translate(3, 3)">
      {/* First row */}
      <rect x="0" y="0" width="4" height="4" rx="0.5" />
      <rect x="5" y="0" width="4" height="4" rx="0.5" />
      <rect x="10" y="0" width="4" height="4" rx="0.5" />
      <rect x="15" y="0" width="4" height="4" rx="0.5" />
      
      {/* Second row */}
      <rect x="0" y="5" width="4" height="4" rx="0.5" />
      <rect x="5" y="5" width="4" height="4" rx="0.5" />
      <rect x="10" y="5" width="4" height="4" rx="0.5" />
      <rect x="15" y="5" width="4" height="4" rx="0.5" />
      
      {/* Third row */}
      <rect x="0" y="10" width="4" height="4" rx="0.5" />
      <rect x="5" y="10" width="4" height="4" rx="0.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <rect x="15" y="10" width="4" height="4" rx="0.5" />
      
      {/* Fourth row */}
      <rect x="0" y="15" width="4" height="4" rx="0.5" />
      <rect x="5" y="15" width="4" height="4" rx="0.5" />
      <rect x="10" y="15" width="4" height="4" rx="0.5" />
      <rect x="15" y="15" width="4" height="4" rx="0.5" />
    </g>
  </svg>
);

const DrumSync3D: React.FC<DrumSync3DProps> = ({ 
  width = '100%', 
  height = '100vh',
  className = '',
  autoStart = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [showController, setShowController] = useState(false);
  const controllerRef = useRef<{ activatePad: (soundType: string) => void } | null>(null);

  useEffect(() => {
    let mounted = true;

    const initApp = async () => {
      try {
        // 動的にモジュールをインポート
        const { default: DrumSync3DApp } = await import('../../lib/DrumSync3DApp');
        
        if (!mounted) return;

        const app = new DrumSync3DApp(containerRef.current);
        await app.init();
        
        if (!mounted) return;

        // PAD同期用のコールバックを設定
        app.setPadSyncCallback((soundType: string) => {
          if (controllerRef.current) {
            controllerRef.current.activatePad(soundType);
          }
        });

        appRef.current = app;
        setIsInitialized(true);

        // iOSでの初期アドレスバー対策
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          // 少し待ってからアドレスバーを隠す
          setTimeout(() => {
            window.scrollTo(0, 1);
            setTimeout(() => window.scrollTo(0, 0), 50);
          }, 1000);
        }

      } catch (error) {
        console.error('DrumSync3D初期化エラー:', error);
      }
    };


    initApp();

    return () => {
      mounted = false;
      if (appRef.current) {
        appRef.current.dispose();
      }
      // イベントリスナーのクリーンアップは不要（自動初期化を無効化したため）
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const handleInitAudio = async () => {
    if (!appRef.current) return;
    
    try {
      await appRef.current.initAudio();
      setAudioInitialized(true);
      
      // iOSでアドレスバーを隠すためのトリック
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        setTimeout(() => {
          window.scrollTo(0, 1);
          setTimeout(() => window.scrollTo(0, 0), 50);
        }, 100);
      }
    } catch (error) {
      console.error('音声初期化エラー:', error);
    }
  };

  const handleVolumeToggle = () => {
    if (!appRef.current) return;
    
    const muted = appRef.current.toggleVolume();
    setIsMuted(muted);
  };

  const handleInteractiveModeToggle = () => {
    if (!appRef.current || !audioInitialized) return;
    
    if (isInteractiveMode) {
      // インタラクティブモードを終了
      appRef.current.setAutoMode();
      setIsInteractiveMode(false);
      setShowController(false);
    } else {
      // インタラクティブモードを開始
      appRef.current.setInteractiveMode();
      setIsInteractiveMode(true);
      setShowController(true);
    }
  };

  const handlePadTrigger = (soundType: string) => {
    if (!appRef.current || !isInteractiveMode) return;
    
    appRef.current.playInteractiveSound(soundType);
  };

  return (
    <div 
      className={`drum-sync-container ${className}`}
      style={{ 
        width, 
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {isInitialized && !audioInitialized && (
        <div className="play-button-container">
          <button className="play-button" onClick={handleInitAudio}>
            Play with sound
            <div className="play-sound-icon">
              <VolumeOnIcon />
            </div>
          </button>
        </div>
      )}
      
      {isInitialized && audioInitialized && !isInteractiveMode && (
        <>
          {/* コントローラーアイコンボタン */}
          <div className="controller-toggle-container">
            <button className="controller-button" onClick={handleInteractiveModeToggle}>
              <ControllerIcon />
            </button>
          </div>
          
          {/* ボリュームコントロール */}
          <div className="volume-control-container">
            <button className="volume-button" onClick={handleVolumeToggle}>
              {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
            </button>
          </div>
        </>
      )}
      
      {/* インタラクティブコントローラー */}
      {showController && (
        <InteractiveController
          ref={controllerRef}
          onPadTrigger={handlePadTrigger}
          onClose={handleInteractiveModeToggle}
          isActive={isInteractiveMode}
        />
      )}

      <style jsx>{`
        .drum-sync-container {
          /* iOSのアドレスバー対策 */
          height: var(--app-height);
          position: relative;
        }
        
        .drum-sync-container canvas {
          display: block;
        }
        
        .play-button-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        
        .controller-toggle-container {
          position: absolute;
          bottom: 90px;
          right: 20px;
          z-index: 10;
        }
        
        .volume-control-container {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 10;
        }
        
        @media (max-width: 768px) and (min-width: 481px) {
          .controller-toggle-container {
            bottom: 140px;
            right: 20px;
          }
          
          .volume-control-container {
            bottom: 70px;
            right: 20px;
          }
        }

        @media (hover: none) and (pointer: coarse) and (min-width: 769px) {
          .controller-toggle-container {
            bottom: max(170px, calc(env(safe-area-inset-bottom, 34px) + 150px));
            right: max(20px, env(safe-area-inset-right, 20px));
          }
          
          .volume-control-container {
            bottom: max(120px, calc(env(safe-area-inset-bottom, 34px) + 100px));
            right: max(20px, env(safe-area-inset-right, 20px));
          }
        }

        /* スマホサイズでインタラクティブモードが1/2になる場合の調整 - ブラウザボトム基準 */
        @media (max-width: 480px) {
          .controller-toggle-container {
            bottom: max(90px, calc(env(safe-area-inset-bottom, 20px) + 70px));
            right: max(20px, env(safe-area-inset-right, 20px));
          }
          
          .volume-control-container {
            bottom: max(20px, env(safe-area-inset-bottom, 20px));
            right: max(20px, env(safe-area-inset-right, 20px));
          }
        }
        
        .play-button {
          padding: 15px 30px;
          background-color: transparent;
          color: #333;
          border: 2px solid #333;
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        
        .play-button:hover {
          background-color: #333;
          color: white;
        }
        
        .play-button:active {
          background-color: #555;
          color: white;
        }
        
        .play-sound-icon {
          width: 24px;
          height: 24px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 12px;
          transition: all 0.2s ease;
        }
        
        .play-button:hover .play-sound-icon {
          color: white;
        }
        
        .controller-button, .volume-button {
          width: 60px;
          height: 60px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .controller-button svg, .volume-button svg {
          width: 24px;
          height: 24px;
        }
        
        .controller-button:hover, .volume-button:hover {
          background-color: #555;
          transform: scale(1.1);
        }
        
        .controller-button:active, .volume-button:active {
          background-color: #777;
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default DrumSync3D;