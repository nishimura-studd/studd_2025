import DrumSync3D from './components/DrumSync3D';

export default function Home() {
  return (
    <div className="min-h-screen">
      <DrumSync3D 
        width="100vw" 
        height="100vh" 
        autoStart={true}
      />
    </div>
  );
}
