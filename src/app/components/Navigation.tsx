'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-2 left-2 right-2 z-50 bg-white">
      <div className="max-w-screen-xl mx-auto px-8 py-8">
        <ul className="flex justify-end gap-12">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`font-mono text-base tracking-wider uppercase transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;