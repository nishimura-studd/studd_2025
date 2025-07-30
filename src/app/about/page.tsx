import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="swiss-section" style={{paddingLeft: '200px'}}>
        <div className="max-w-4xl px-8">
          <div className="mb-8">
            <nav className="flex gap-6">
              <Link href="/" className="text-sm font-mono uppercase tracking-wider text-gray-600 hover:text-black transition-colors">
                ← Home
              </Link>
              <Link href="/work" className="text-sm font-mono uppercase tracking-wider text-gray-600 hover:text-black transition-colors">
                Work
              </Link>
            </nav>
          </div>
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

            <article>
              <h2 className="mb-6">Contact</h2>
              <div className="swiss-line mb-8" style={{height: '2px'}}></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3">Email</h3>
                  <p className="text-gray-600">your.email@example.com</p>
                </div>
                
                <div>
                  <h3 className="mb-4">Social Media</h3>
                  <div className="space-y-3">
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      GitHub
                    </a>
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      LinkedIn
                    </a>
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      Twitter
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-4">Contact Form</h3>
                  <div className="border border-black p-8 bg-gray-50">
                    <p className="font-mono text-sm uppercase tracking-wider text-center text-gray-600">
                      お問い合わせフォームは保留中です
                    </p>
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