import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import { avatarUrl, hasCustomAvatar } from "../avatar";

const icons = {
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />,
  browse: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />,
};

const Icon = ({ name, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    {icons[name]}
  </svg>
);

const links = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/Search", label: "Browse", icon: "browse" },
  { to: "/Profile", label: "Profile", icon: "profile" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout(); // Reset authentication state
    navigate("/"); // Redirect back to login page
  };

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <>
      {/* Top bar */}
      <nav className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          } bg-primary/70 backdrop-blur-xl border-b border-white/5`}
        />
        <div className="absolute inset-0 scrim-top -z-10" />

        <div className="relative max-w-[1600px] mx-auto flex items-center gap-6 px-4 sm:px-8 lg:px-14 h-16 sm:h-20 pointer-events-auto">
          <NavLink to="/home" aria-label="SeatFlix home" className="shrink-0">
            <Logo className="text-[28px] sm:text-[34px]" />
          </NavLink>

          {/* Desktop pill */}
          <ul className="hidden sm:flex items-center gap-1 p-1 mx-auto rounded-full glass">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-white text-black shadow-lg shadow-white/10"
                        : "text-light-200 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto sm:ml-0 flex items-center gap-2 sm:gap-3">
            <NavLink to="/Search" title="Search" aria-label="Search" className="btn-icon w-10 h-10">
              <Icon name="browse" className="w-[18px] h-[18px]" />
            </NavLink>

            {/* Account menu */}
            <div className="relative group hidden sm:block">
              <button
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full glass hover:bg-white/15 transition-colors cursor-pointer"
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                {hasCustomAvatar(user?.profilePic) ? (
                  <img
                    src={avatarUrl(user.profilePic)}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand/60"
                  />
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand to-ember text-white font-extrabold text-sm">
                    {initial}
                  </span>
                )}
                <svg className="w-3.5 h-3.5 text-light-200 transition-transform group-focus-within:rotate-180" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-56 p-2 rounded-2xl bg-surface/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 opacity-0 invisible translate-y-2 transition-all duration-200 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0"
              >
                {user?.username && (
                  <p className="px-3 pt-2 pb-3 mb-1 border-b border-white/10">
                    <span className="block text-xs text-gray-100">Signed in as</span>
                    <span className="block text-white font-bold truncate">{user.username}</span>
                  </p>
                )}
                <NavLink to="/Profile" role="menuitem" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-light-100 hover:bg-white/10 transition-colors">
                  <Icon name="profile" className="w-4 h-4" /> My Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-light-100 hover:bg-ember/15 hover:text-ember transition-colors cursor-pointer"
                >
                  <Icon name="logout" className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dock */}
      <nav className="sm:hidden fixed bottom-4 inset-x-4 z-50 rounded-full glass bg-primary/70 shadow-2xl shadow-black/70">
        <ul className="flex items-center justify-around p-1.5">
          {links.map(({ to, label, icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 rounded-full text-[10px] font-bold transition-colors ${
                    isActive ? "bg-white/10 text-brand" : "text-light-200"
                  }`
                }
              >
                <Icon name={icon} />
                {label}
              </NavLink>
            </li>
          ))}
          <li className="flex-1">
            <button
              onClick={handleLogout}
              className="w-full flex flex-col items-center gap-0.5 py-2 rounded-full text-[10px] font-bold text-light-200 cursor-pointer"
            >
              <Icon name="logout" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
