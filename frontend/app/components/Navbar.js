'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/records', label: 'Records', icon: '📋' },
  { href: '/users', label: 'Users', icon: '👥', adminOnly: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const roleBadge = {
    ADMIN: <span className="badge-admin">Admin</span>,
    ANALYST: <span className="badge-analyst">Analyst</span>,
    VIEWER: <span className="badge-viewer">Viewer</span>,
  };

  return (
    <nav style={{ background: '#111827', borderBottom: '1px solid #1f2937' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">Z</div>
            <span className="font-bold text-white text-lg hidden sm:block">Zorvyn Finance</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.adminOnly && user?.role !== 'ADMIN') return null;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side: user info + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <div className="mt-0.5">{roleBadge[user?.role]}</div>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer border-0 bg-transparent"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
