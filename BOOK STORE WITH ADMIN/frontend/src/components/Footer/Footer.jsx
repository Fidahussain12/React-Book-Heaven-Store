import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    Explore: [
      { label: 'All Books', to: '/all-books' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Bestsellers', to: '/bestsellers' },
      { label: 'Categories', to: '/categories' },
    ],
    Account: [
      { label: 'Sign Up', to: '/signup' },
      { label: 'Login', to: '/login' },
      { label: 'My Profile', to: '/profile' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Contact Us', to: '/contact' },
    ],
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-12 pb-0">

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="text-white text-lg font-bold tracking-tight">BookHaven</span>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed mb-5 max-w-[200px]">
            Your personal reading universe. Discover, collect & love books.
          </p>

          {/* Social Icons */}
          <div className="flex gap-2">
            <a href="https://twitter.com" target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:border-violet-500 hover:bg-violet-950 transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:border-violet-500 hover:bg-violet-950 transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:border-violet-500 hover:bg-violet-950 transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">
              {section}
            </h3>
            <ul className="space-y-2.5">
              {items.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-zinc-500 hover:text-violet-400 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Stay in the loop 📚</p>
            <p className="text-zinc-500 text-xs">New books, deals & recommendations — weekly.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-zinc-600 focus:border-violet-500 transition-colors duration-200"
            />
            <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 mt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800 pt-6">
        <p className="text-zinc-600 text-xs text-center sm:text-left">
          &copy; {currentYear} BookHaven. All rights reserved.
        </p>
        <p className="text-zinc-600 text-xs flex items-center gap-1.5">
          Made with
          <span className="text-red-500">♥</span>
          by
          <span className="text-zinc-400 font-medium">Fida Hussain</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;