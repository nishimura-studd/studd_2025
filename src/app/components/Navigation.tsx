'use client';

import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="fixed top-6 right-6 z-50">
      <Link
        href="/about"
        className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors duration-200"
      >
        about
      </Link>
    </nav>
  );
};

export default Navigation;