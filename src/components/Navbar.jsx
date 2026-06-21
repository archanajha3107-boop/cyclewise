import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/home',
    label: 'Home',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#9B6B8A' : 'none'} stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    to: '/cycle',
    label: 'Cycle',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    to: '/wellness',
    label: 'wellness',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    to: '/sakhi',
    label: 'Sakhi',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#9B6B8A' : 'none'} stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    to: '/community',
    label: 'Community',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9B6B8A' : '#8C7070'} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-blush shadow-warm z-50">
      <div className="flex justify-around items-center py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              {item.icon(isActive)}
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-mauve' : 'text-muted-rose'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}