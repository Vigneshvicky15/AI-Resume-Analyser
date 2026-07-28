import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { KeyRound, ArrowLeft, RefreshCw, MailCheck } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Password reset link sent!');
      setIsSent(true);
    } else {
      toast.error(result.error || 'Failed to request password reset link.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle glow animations */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
            {isSent ? <MailCheck className="h-8 w-8" /> : <KeyRound className="h-8 w-8" />}
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            {isSent ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSent 
              ? `We sent password reset instructions to your email address: ${email}` 
              : 'Enter your email address and we will send you a link to reset your password.'
            }
          </p>
        </div>

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-2xl border-0 bg-white/5 px-4 py-4 text-white placeholder-slate-500 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="flex w-full items-center justify-center rounded-2xl bg-brand-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="mt-8">
            <button
              onClick={() => setIsSent(false)}
              className="flex w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Resend Link
            </button>
          </div>
        )}

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

export default ForgotPassword;
