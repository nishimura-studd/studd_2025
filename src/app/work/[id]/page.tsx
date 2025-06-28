'use client';

interface WorkDetailProps {
  params: {
    id: string;
  };
}

export default function WorkDetail({ params }: WorkDetailProps) {
  return (
    <div className="min-h-screen">
      <section className="swiss-section" style={{paddingLeft: '200px'}}>
        <div className="max-w-4xl px-8">
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()} 
              className="swiss-button"
            >
              ← Back to Work
            </button>
          </div>
          
          <h1 className="mb-16">Project {params.id}</h1>

          <div className="space-y-12">
            <div className="aspect-video border border-black bg-gray-100 flex items-center justify-center">
              <span className="font-mono text-lg uppercase tracking-wider text-gray-500">
                大きな画像・動画エリア
              </span>
            </div>

            <article>
              <h2 className="mb-6">Project Details</h2>
              <div className="swiss-line mb-8" style={{height: '2px'}}></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">詳細説明がここに入ります。</p>
                </div>
                
                <div>
                  <h3 className="mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="border border-black px-4 py-2 font-mono text-xs uppercase">React</span>
                    <span className="border border-black px-4 py-2 font-mono text-xs uppercase">Next.js</span>
                    <span className="border border-black px-4 py-2 font-mono text-xs uppercase">Three.js</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4">Links</h3>
                  <div className="flex gap-6">
                    <a href="#" className="border-b border-black pb-1 hover:bg-black hover:text-white transition-all duration-200">
                      Live Demo
                    </a>
                    <a href="#" className="border-b border-black pb-1 hover:bg-black hover:text-white transition-all duration-200">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}