import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, UploadCloud } from 'lucide-react';
import heroLogo from '../assets/hero.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img src={heroLogo} alt="ResumePilot Logo" className="h-10 w-10 rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300" />
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Resume</span><span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 font-extrabold">Pilot</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-md shadow-brand-500/10 hover:opacity-90"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Analyze Resume</span>
                  </Link>

                  {/* Profile Indicator */}
                  <div className="h-8 w-px bg-white/10"></div>
                  <div className="flex items-center space-x-3 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <a href="#features" className="text-slate-300 hover:text-white text-sm font-medium transition-all">
                    Features
                  </a>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition-all shadow-md shadow-white/5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950 px-2 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-base font-medium ${
                  isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-slate-300'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <div className="px-3 py-2 text-sm text-slate-400 border-t border-white/5 mt-2 pt-2 flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
                <span>Logged in as <strong>{user.name}</strong></span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 mt-1"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-medium text-center bg-white text-slate-950 font-semibold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
