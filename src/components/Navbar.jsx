import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/home', label: 'Home', icon: '🏠' },
    { to: '/cycle', label: 'Cycle', icon: '🌙' },
    { to: '/checkin', label: 'Check-In', icon: '✍️' },
    { to: '/sakhi', label: 'Sakhi', icon: '🌸' },
    { to: '/community', label: 'Community', icon: '💬' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blush shadow-warm max-w-sm mx-auto">
      <div className="flex justify-around items-center py-2 px-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="flex flex-col items-center gap-0.5 min-w-0"
            >
              <span className="text-lg">{link.icon}</span>
              <span
                className={`text-xs font-medium truncate ${
                  isActive ? 'text-mauve' : 'text-muted-rose'
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}