import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  // Resend OTP timer state
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Retrieve email from routing state or local storage fallback
    const stateEmail = location.state?.email || localStorage.getItem('verify_email');
    if (!stateEmail) {
      toast.error('Email not found. Redirecting to signup.');
      navigate('/register');
    } else {
      setEmail(stateEmail);
      localStorage.setItem('verify_email', stateEmail);
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0 && !canResend) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [cooldown, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(otp)) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOTP(email, otp);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Email verified successfully! Welcome back.');
      localStorage.removeItem('verify_email');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCooldown(60);
    
    const result = await resendOTP(email);
    if (result.success) {
      toast.success('A new OTP has been sent to your email!');
    } else {
      toast.error(result.error || 'Failed to resend OTP.');
      setCanResend(true);
      setCooldown(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative subtle background glows */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            We sent a 6-digit verification code to <br />
            <strong className="text-indigo-400 font-semibold">{email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="relative block w-full rounded-2xl border-0 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-widest text-white placeholder-slate-600 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="flex flex-col items-center justify-between space-y-4 pt-4 text-center border-t border-white/5 text-xs">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className="text-slate-300 hover:text-white font-medium transition-colors disabled:text-slate-600 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span>Resend verification code</span>
            {!canResend && <span>({cooldown}s)</span>}
          </button>

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

export default VerifyOTP;
