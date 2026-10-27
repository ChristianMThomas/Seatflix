import React from 'react';
import { Link } from 'react-router-dom';
import Tos from './Tos';
import Logo from './Logo';

const linkClass = "text-light-200 hover:text-brand transition-colors text-sm";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden pb-24 sm:pb-0">
      <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-[700px] h-[300px] rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo className="text-5xl" />
            <p className="text-light-200 text-sm mt-4 max-w-sm leading-relaxed">
              by <span className="text-white font-semibold">ITT</span> · Infinite Tech Team. Premium streaming for everyone. Grab a seat, dim the lights.
            </p>
            <span className="inline-block mt-5 chip text-brand border-brand/30">BETA v1.0.0</span>
          </div>

          <div>
            <p className="eyebrow text-gray-100 mb-4">Explore</p>
            <ul className="space-y-3">
              <li><Link to="/home" className={linkClass}>Home</Link></li>
              <li><Link to="/Search" className={linkClass}>Browse Content</Link></li>
              <li><Link to="/Profile" className={linkClass}>My Profile</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gray-100 mb-4">Support</p>
            <ul className="space-y-3">
              <li><Tos /></li>
              <li>
                <a href="mailto:support@infinitetechteam.com" className={linkClass}>
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://infinitetechteam.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Visit ITT Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-gray-100 text-xs">
          <p>© 2025 ITT (Infinite Tech Team). All rights reserved.</p>
          <p>Made with <span className="text-brand">♥</span> for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
