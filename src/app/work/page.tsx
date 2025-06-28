export default function Work() {
  return (
    <div className="min-h-screen">
      <section className="swiss-section" style={{paddingLeft: '200px'}}>
        <div className="max-w-4xl px-8">
          <h1 className="mb-16">Work</h1>
          
          <div className="mb-12">
            <h2 className="mb-6">Filter</h2>
            <div className="flex flex-wrap gap-4">
              <button className="swiss-button">All</button>
              <button className="swiss-button">React</button>
              <button className="swiss-button">Next.js</button>
              <button className="swiss-button">Three.js</button>
            </div>
          </div>

          <div>
            <h2 className="mb-8">Projects</h2>
            <div className="swiss-line mb-8" style={{height: '2px'}}></div>
            <div className="border border-black">
              <div className="border-b border-black p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">プロジェクト1</h3>
                  <span className="font-mono text-sm">2024</span>
                </div>
                <div className="flex gap-2">
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">React</span>
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">Next.js</span>
                </div>
              </div>

              <div className="border-b border-black p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">プロジェクト2</h3>
                  <span className="font-mono text-sm">2024</span>
                </div>
                <div className="flex gap-2">
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">Three.js</span>
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">WebGL</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">プロジェクト3</h3>
                  <span className="font-mono text-sm">2023</span>
                </div>
                <div className="flex gap-2">
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">Vue.js</span>
                  <span className="border border-black px-3 py-1 text-xs font-mono uppercase">TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}