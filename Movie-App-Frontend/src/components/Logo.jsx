import React from "react";

// Theater-seat glyph + wordmark
const Logo = ({ className = "text-3xl" }) => (
  <span className={`brand-logo ${className}`}>
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M9 4h14a4 4 0 0 1 4 4v9H5V8a4 4 0 0 1 4-4Z" opacity="0.55" />
      <path d="M3 17a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4Z" />
      <path d="M7 24h3v4H7zM22 24h3v4h-3z" />
    </svg>
    <span>
      Seat<em>flix</em>
    </span>
  </span>
);

export default Logo;
