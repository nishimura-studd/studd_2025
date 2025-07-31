import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen flex justify-center py-8" style={{background: 'var(--background)'}}>
      <div className="max-w-4xl w-full px-4">
        <div className="mb-8">
          <nav className="flex gap-4">
            <Link 
            href="/" 
            className="swiss-button text-sm font-medium"
            style={{
              background: 'var(--background-surface)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
            >
            ← Home
            </Link>
            <Link 
            href="/work" 
            className="swiss-button text-sm font-medium"
            style={{
              background: 'var(--background-surface)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
            >
            Work
            </Link>
          </nav>
        </div>
        <h1 className="mb-16" style={{color: 'var(--foreground)'}}>About</h1>
        
        <div className="space-y-16">
          <article>
            <h2 className="mb-6" style={{color: 'var(--foreground)'}}>Profile</h2>
            <div className="swiss-line mb-6"></div>
            <p style={{color: 'var(--foreground-muted)'}}>
              プロフィール文章を作成予定
            </p>
          </article>
            
            <article>
            <h2 className="mb-6" style={{color: 'var(--foreground)'}}>Skills</h2>
            <div className="swiss-line mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <span className="font-mono text-sm font-medium" style={{color: 'var(--foreground)'}}>React</span>
              </div>
              <div className="card text-center">
                <span className="font-mono text-sm font-medium" style={{color: 'var(--foreground)'}}>Next.js</span>
              </div>
              <div className="card text-center">
                <span className="font-mono text-sm font-medium" style={{color: 'var(--foreground)'}}>TypeScript</span>
              </div>
              <div className="card text-center">
                <span className="font-mono text-sm font-medium" style={{color: 'var(--foreground)'}}>Three.js</span>
              </div>
            </div>
          </article>

            <article>
            <h2 className="mb-6" style={{color: 'var(--foreground)'}}>Contact</h2>
            <div className="swiss-line mb-8"></div>
            
            <div className="space-y-8">
              <div>
                <h3 className="mb-3" style={{color: 'var(--foreground)'}}>Email</h3>
                <p style={{color: 'var(--foreground-muted)'}}>your.email@example.com</p>
              </div>
              
              <div>
                <h3 className="mb-4" style={{color: 'var(--foreground)'}}>Social Media</h3>
                <div className="space-y-3">
                  <a 
                    href="#" 
                    className="block border-b w-fit pb-1 transition-all duration-200 hover:opacity-70"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground-muted)'
                    }}
                  >
                    GitHub
                  </a>
                  <a 
                    href="#" 
                    className="block border-b w-fit pb-1 transition-all duration-200 hover:opacity-70"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground-muted)'
                    }}
                  >
                    LinkedIn
                  </a>
                  <a 
                    href="#" 
                    className="block border-b w-fit pb-1 transition-all duration-200 hover:opacity-70"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground-muted)'
                    }}
                  >
                    Twitter
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4" style={{color: 'var(--foreground)'}}>Contact Form</h3>
                <div className="card p-8 text-center" style={{background: 'var(--background-surface)'}}>
                  <p className="font-mono text-sm font-medium" style={{color: 'var(--foreground-subtle)'}}>
                    お問い合わせフォームは保留中です
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}