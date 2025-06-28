export default function About() {
  return (
    <div className="min-h-screen">
      <section className="swiss-section" style={{paddingLeft: '200px'}}>
        <div className="max-w-4xl px-8">
          <h1 className="mb-16">About</h1>
          
          <div className="space-y-16">
            <article>
              <h2 className="mb-6">Profile</h2>
              <div className="swiss-line mb-6" style={{height: '2px'}}></div>
              <p className="text-gray-600 leading-relaxed">
                プロフィール文章を作成予定
              </p>
            </article>
            
            <article>
              <h2 className="mb-6">Skills</h2>
              <div className="swiss-line mb-8" style={{height: '2px'}}></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-black p-4 text-center">
                  <span className="font-mono text-sm uppercase">React</span>
                </div>
                <div className="border border-black p-4 text-center">
                  <span className="font-mono text-sm uppercase">Next.js</span>
                </div>
                <div className="border border-black p-4 text-center">
                  <span className="font-mono text-sm uppercase">TypeScript</span>
                </div>
                <div className="border border-black p-4 text-center">
                  <span className="font-mono text-sm uppercase">Three.js</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}