interface WorkDetailProps {
  params: {
    id: string;
  };
}

export default function WorkDetail({ params }: WorkDetailProps) {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()} 
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Work
          </button>
          <h1 className="text-4xl font-bold mb-4">Project {params.id}</h1>
        </div>

        <div className="space-y-8">
          <section>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              <span className="text-gray-500">大きな画像・動画エリア</span>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">詳細説明がここに入ります。</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Next.js</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Three.js</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Links</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    Live Demo
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}