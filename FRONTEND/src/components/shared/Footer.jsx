import React, { memo, useMemo } from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    hoverClass: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-lg hover:shadow-[#0A66C2]/25',
    path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:shadow-lg hover:shadow-[#1877F2]/25',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
  },
  {
    name: 'Twitter (X)',
    url: 'https://twitter.com',
    hoverClass: 'hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:shadow-lg hover:shadow-white/10',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    hoverClass: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-rose-500/25',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    hoverClass: 'hover:bg-slate-800 hover:border-slate-700 hover:text-white hover:shadow-lg hover:shadow-white/10',
    path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'
  }
];

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-6 sm:py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <span>
              Job<span className="text-indigo-400">Portal</span>
            </span>
          </Link>
          <span className="hidden sm:inline text-slate-700">|</span>
          <p className="text-xs sm:text-sm text-slate-400">
            © {currentYear} JobPortal. All rights reserved.
          </p>
        </div>

        {/* Social Media Links: LinkedIn, Facebook, Twitter, Instagram, GitHub */}
        <div className="flex items-center gap-2.5">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
              className={`w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${link.hoverClass}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d={link.path} />
              </svg>
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default memo(Footer);