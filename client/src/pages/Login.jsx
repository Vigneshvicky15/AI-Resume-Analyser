import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Successfully logged in! Welcome back.', {
        style: {
          background: '#064e3b',
          color: '#fff',
        },
      });
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="relative min-h-[calc(screen-64px)] py-20 flex flex-col items-center justify-center px-4 bg-slate-950">
      <div className="absolute top-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-brand-600/10 blur-[80px] animate-pulse-slow"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="glass-panel border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">Welcome Back</h2>
            <p className="text-sm text-slate-400">
              Sign in to PerfectResume.AI to continue auditing your resumes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-lg shadow-brand-500/10 transition-all"
            >
              <span>{isSubmitting ? 'Verifying Profile...' : 'Sign In'}</span>
              <LogIn className="h-4 w-4" />
            </button>
          </form>

          {/* Redirect link */}
          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have a secure PerfectResume.AI account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300">
              Sign Up Free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
