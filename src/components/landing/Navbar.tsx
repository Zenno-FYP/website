import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const linkDesktopClass = 'transition-colors hover:text-purple-400';
const linkDrawerClass =
  'transition-colors hover:text-purple-400 py-2 text-left';
const navLinkStyle = { fontSize: '0.9375rem', color: '#A7B0BE' } as const;

function Logo() {
  return (
    <img
      src={logo}
      alt="Zenno Logo"
      width={40}
      height={40}
      className="rounded-full object-cover shrink-0"
      style={{
        display: 'block',
        width: '2.5rem',
        height: '2.5rem',
        flexShrink: 0,
      }}
    />
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(91, 111, 216, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-h-10 w-full">
        <div className="landing-nav-primary-left z-10">
          <button
            type="button"
            className="landing-nav-burger p-2 rounded-xl border transition-colors hover:border-purple-500/50"
            style={{
              borderColor: 'rgba(91, 111, 216, 0.35)',
              color: '#F5F7FA',
            }}
            aria-expanded={menuOpen}
            aria-controls="landing-nav-mobile"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" aria-hidden />
            ) : (
              <Menu className="w-5 h-5" aria-hidden />
            )}
          </button>
          <Logo />
          <div className="landing-nav-links-row">
            <a href="#features" className={linkDesktopClass} style={navLinkStyle}>
              Features
            </a>
            <a
              href="#how-it-works"
              className={linkDesktopClass}
              style={navLinkStyle}
            >
              How It Works
            </a>
            <a href="#profile" className={linkDesktopClass} style={navLinkStyle}>
              Profile
            </a>
          </div>
        </div>

        <div className="shrink-0 z-10">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate('/auth');
            }}
            className="px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #5B6FD8 0%, #7C4DFF 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              boxShadow: '0 4px 16px rgba(91, 111, 216, 0.3)',
            }}
          >
            Join Now
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="landing-nav-mobile"
          className="landing-nav-mobile-dropdown max-w-7xl mx-auto pt-4 pb-2 flex flex-col gap-1 border-t mt-4"
          style={{ borderColor: 'rgba(91, 111, 216, 0.12)' }}
        >
          <a
            href="#features"
            className={linkDrawerClass}
            style={navLinkStyle}
            onClick={closeMenu}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className={linkDrawerClass}
            style={navLinkStyle}
            onClick={closeMenu}
          >
            How It Works
          </a>
          <a
            href="#profile"
            className={linkDrawerClass}
            style={navLinkStyle}
            onClick={closeMenu}
          >
            Profile
          </a>
        </div>
      ) : null}
    </nav>
  );
}
