import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
      <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
        <div style={{marginBottom: '100px'}}>
          <nav style={{height: '20px', alignItems: 'baseline'}}>
            <Link 
            href="/" 
            className="text-sm font-light hover:opacity-70 transition-opacity duration-200 flex items-center"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              lineHeight: '20px',
              padding: 0,
              transform: 'translateX(-2px)'
            }}
            >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back
            </Link>
          </nav>
        </div>
        <h1 className="text-3xl md:text-5xl" style={{color: 'var(--foreground)', lineHeight: '48px', transform: 'translateY(-6px)', marginBottom: '80px'}}>About</h1>
        
        <div className="flex flex-col gap-16 md:gap-24">
          <article>
            <h2 className="text-xl md:text-2xl" style={{color: 'var(--foreground)', lineHeight: '32px', transform: 'translateY(-3px)', marginBottom: '40px'}}>Profile</h2>
            <p className="text-sm md:text-base mb-10 md:mb-16 ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)'}}>
            西村 國芳<br/><br/>20年以上にわたり、インタラクティブなUIの開発に取り組んできました。Flash全盛期からスタートし、現在はモダンなフロントエンド技術を使って、Web上でアイデアを形にする<Link href="/work" className="underline hover:opacity-70 transition-opacity duration-200" style={{color: 'var(--foreground)'}}>仕事</Link>を続けています。キャンペーンサイトやブランドサイト、業務用のWebアプリなど、さまざまな分野での実績があります。TypeScriptやThree.js（WebGL）などの技術も活用し、デザイナーやバックエンドエンジニアと連携しながら、安定した品質と表現力のあるプロダクト開発を目指しています。
            </p>
            <p className="text-sm md:text-base ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', marginBottom: '0px', transform: 'translateY(-2px)'}}>
            Kuniyoshi Nishimura<br/><br/>I have been engaged in interactive UI development for over 20 years. Starting in the era when Flash was dominant, I have continued to bring creative ideas to life on the web using modern front-end technologies. My <Link href="/work" className="underline hover:opacity-70 transition-opacity duration-200" style={{color: 'var(--foreground)'}}>works</Link> span a wide range of projects, including campaign sites, brand sites, and business-oriented web applications. I use technologies such as TypeScript and Three.js (WebGL), and collaborate closely with designers and backend engineers to deliver products that balance stability, quality, and expressive design.
            </p>
          </article>

            <article>
            <h2 className="text-xl md:text-2xl" style={{color: 'var(--foreground)', lineHeight: '32px', marginBottom: '40px', transform: 'translateY(-3px)'}}>Contact</h2>
            
            <div className="flex flex-col gap-5 md:gap-10 ml-3 md:ml-5">
              <div>
                <p style={{color: 'var(--foreground-muted)', lineHeight: '20px', transform: 'translateY(-2px)'}}>email: nishimura [at] studd [dot] jp</p>
              </div>
              
              <div>
                <div className="flex gap-4 md:gap-5 items-center" style={{transform: 'translateY(-32px) translateX(2px)'}}>
                  <a 
                    href="https://github.com/nishimura-studd" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-200 hover:opacity-70"
                    style={{
                      color: 'var(--foreground-muted)',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="GitHub"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.facebook.com/kuniyoshi.nishimura" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-200 hover:opacity-70"
                    style={{
                      color: 'var(--foreground-muted)',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://x.com/studdjp" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-200 hover:opacity-70"
                    style={{
                      color: 'var(--foreground-muted)',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="X (Twitter)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}