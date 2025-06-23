export default function Work() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Work</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">All</button>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">React</button>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Next.js</button>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Three.js</button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Project Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">プロジェクト1</h3>
                <p className="text-sm text-gray-600 mb-3">2024</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Next.js</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}