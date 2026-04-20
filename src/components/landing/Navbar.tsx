import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(91, 111, 216, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Zenno Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="transition-colors hover:text-purple-400"
            style={{ fontSize: '0.9375rem', color: '#A7B0BE' }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-purple-400"
            style={{ fontSize: '0.9375rem', color: '#A7B0BE' }}
          >
            How It Works
          </a>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #5B6FD8 0%, #7C4DFF 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.9375rem',
            boxShadow: '0 4px 16px rgba(91, 111, 216, 0.3)'
          }}
        >
          Join Now
        </button>
      </div>
    </nav>
  );
}
