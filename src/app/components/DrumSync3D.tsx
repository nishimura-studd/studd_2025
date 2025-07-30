'use client';

import { useEffect, useRef, useState } from 'react';

interface DrumSync3DProps {
  width?: string;
  height?: string;
  className?: string;
  autoStart?: boolean;
}

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
        backgroundColor: '#000'
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {isInitialized && (
        <div className="drum-controls">
          {!audioInitialized ? (
            <button onClick={handleInitAudio}>
              CLICK TO PLAY
            </button>
          ) : (
            <button onClick={handleVolumeToggle}>
              {isMuted ? '🔇 OFF' : '🔊 ON'}
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .drum-sync-container canvas {
          display: block;
        }
        
        .drum-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
        }
        
        .drum-controls button {
          padding: 10px 20px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-family: monospace;
          transition: all 0.2s ease;
        }
        
        .drum-controls button:hover {
          background-color: #555;
        }
        
        .drum-controls button:active {
          background-color: #777;
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default DrumSync3D;