import React from 'react';
import Tos from './Tos';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="pattern opacity-10" />

      <div className="relative backdrop-blur-xl bg-dark-100/50">
        <div className="container mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-3">
                SeatFlix
              </h3>
              <p className="text-light-200 text-sm mb-2">
                by <span className="font-semibold text-purple-400">ITT</span>
              </p>
              <p className="text-gray-400 text-sm">
                Infinite Tech Team - Premium streaming for everyone
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/home" className="block text-light-200 hover:text-purple-400 transition-colors text-sm">
                  Home
                </a>
                <a href="/Search" className="block text-light-200 hover:text-purple-400 transition-colors text-sm">
                  Browse Content
                </a>
                <a href="/Profile" className="block text-light-200 hover:text-purple-400 transition-colors text-sm">
                  My Profile
                </a>
              </div>
            </div>

            {/* Support Section */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Tos />
                <a
                  href="mailto:support@infinitetechteam.com"
                  className="block text-light-200 hover:text-purple-400 transition-colors text-sm"
                >
                  Contact Support
                </a>
                <a
                  href="https://infinitetechteam.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-light-200 hover:text-purple-400 transition-colors text-sm"
                >
                  Visit ITT Website
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-6"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 <span className="text-purple-400 font-semibold">ITT (Infinite Tech Team)</span>. All rights reserved.
            </p>

            {/* Social Links / Additional Info */}
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-xs">
                Made with <span className="text-red-400">❤️</span> for movie lovers
              </span>
            </div>
          </div>

          {/* Beta Badge */}
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-semibold">
              BETA v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
