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
          <div className="font-mono text-2xl font-medium" style={{color: 'var(--foreground)'}}>
            studd.
          </div>
          <div className="font-sans text-xs mt-1" style={{color: 'var(--foreground-muted)'}}>
            スタッド.
          </div>
        </Link>
      </div>
      
      {/* About Link */}
      <nav className="fixed top-6 right-6 z-50">
        <Link
          href="/about"
          className="swiss-button px-4 py-2 text-sm font-medium rounded-lg"
          style={{
            background: 'var(--background-surface)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)'
          }}
        >
          about
        </Link>
      </nav>
    </>
  );
};

export default Navigation;