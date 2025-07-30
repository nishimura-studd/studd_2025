'use client';

import { useEffect, useRef, useState } from 'react';

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

        appRef.current = app;
        setIsInitialized(true);

        // 自動開始が有効な場合、ユーザーインタラクション後に自動初期化
        if (autoStart && !audioInitialized) {
          document.addEventListener('click', handleAutoInit, { once: true });
        }

      } catch (error) {
        console.error('DrumSync3D初期化エラー:', error);
      }
    };

    const handleAutoInit = async () => {
      if (appRef.current && !audioInitialized) {
        try {
          console.log('音声自動初期化を開始...');
          await appRef.current.initAudio();
          setAudioInitialized(true);
          console.log('音声自動初期化完了');
        } catch (error) {
          console.error('音声自動初期化エラー:', error);
        }
      }
    };

    initApp();

    return () => {
      mounted = false;
      if (appRef.current) {
        appRef.current.dispose();
      }
      document.removeEventListener('click', handleAutoInit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const handleInitAudio = async () => {
    if (!appRef.current) return;
    
    try {
      await appRef.current.initAudio();
      setAudioInitialized(true);
    } catch (error) {
      console.error('音声初期化エラー:', error);
    }
  };

  const handleVolumeToggle = () => {
    if (!appRef.current) return;
    
    const muted = appRef.current.toggleVolume();
    setIsMuted(muted);
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
            CLICK TO PLAY
          </button>
        </div>
      )}
      
      {isInitialized && audioInitialized && (
        <div className="volume-control-container">
          <button className="volume-button" onClick={handleVolumeToggle}>
            {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </button>
        </div>
      )}

      <style jsx>{`
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
        
        .volume-control-container {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 10;
        }
        
        .play-button {
          padding: 15px 30px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: monospace;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }
        
        .play-button:hover {
          background-color: #555;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .play-button:active {
          background-color: #777;
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .volume-button {
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
        
        .volume-button svg {
          width: 24px;
          height: 24px;
        }
        
        .volume-button:hover {
          background-color: #555;
          transform: scale(1.1);
        }
        
        .volume-button:active {
          background-color: #777;
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default DrumSync3D;