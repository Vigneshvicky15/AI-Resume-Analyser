import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Lock, ArrowLeft, RefreshCw } from 'lucide-react';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(token, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Password reset successful! Redirecting to login.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle backgrounds glows */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-2xl border-0 bg-white/5 px-4 py-4 text-white placeholder-slate-500 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full rounded-2xl border-0 bg-white/5 px-4 py-4 text-white placeholder-slate-500 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !password || !confirmPassword}
            className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="flex justify-center pt-4 border-t border-white/5 text-xs">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Sign In</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
