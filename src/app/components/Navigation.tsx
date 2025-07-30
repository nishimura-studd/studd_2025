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
          <div className="font-mono text-2xl font-normal text-black">
            studd.
          </div>
          <div className="font-sans text-xs text-black mt-1">
            スタッド.
          </div>
        </Link>
      </div>
      
      {/* About Link */}
      <nav className="fixed top-6 right-6 z-50">
        <Link
          href="/about"
          className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors duration-200"
        >
          about
        </Link>
      </nav>
    </>
  );
};

export default Navigation;