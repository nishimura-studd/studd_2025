'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  // ホームページ以外では非表示
  if (pathname !== '/') {
    return null;
  }

  return (
    <>
      {/* Logo */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="block hover:opacity-70 transition-opacity duration-200"
        >
          <div 
            className="text-3xl font-semibold" 
            style={{
              color: 'var(--foreground)',
              lineHeight: '48px',
              transform: 'translateY(-6px)',
              letterSpacing: '-0.02em'
            }}
          >
            studd.
          </div>
          <div 
            className="text-xs font-light" 
            style={{
              color: 'var(--foreground-muted)',
              lineHeight: '16px',
              letterSpacing: '0.01em',
              transform: 'translateY(-12px)'
            }}
          >
            スタッド.
          </div>
        </Link>
      </div>
      
      {/* About Link */}
      <nav className="fixed top-6 right-6 z-50">
        <Link
          href="/about"
          className="text-sm font-light hover:opacity-70 transition-opacity duration-200"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--foreground)',
            lineHeight: '20px',
            padding: 0
          }}
        >
          about
        </Link>
      </nav>
    </>
  );
};

export default Navigation;