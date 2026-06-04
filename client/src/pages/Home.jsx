import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Navigation2, Target, Award, Search, Sparkles, CheckCircle2, Plane } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Award className="h-6 w-6 text-brand-400" />,
      title: 'ATS Scoring Algorithm',
      description: 'Receive an immediate 0-100 score indicating how well your credentials line up with industry-standard resume parsers.',
    },
    {
      icon: <Navigation2 className="h-6 w-6 text-sky-400" />,
      title: 'Claude AI Deep Scan',
      description: "Analyze your CV using Anthropic's state-of-the-art Claude Sonnet. Extracts strengths, flaws, and impact metrics.",
    },
    {
      icon: <Target className="h-6 w-6 text-violet-400" />,
      title: 'Target Job Comparison',
      description: 'Paste any job description to compare your qualifications, see specific skill gaps, and compute a match percentage.',
    },
    {
      icon: <Search className="h-6 w-6 text-emerald-400" />,
      title: 'Keyword Gap Diagnostics',
      description: 'Expose missing keywords and technical terms, helping you bypass algorithmic filtering with ease.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col justify-between">
      {/* Decorative background grid and glowing circles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[130px] animate-pulse-slow"></div>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center space-y-8 flex-grow flex flex-col justify-center">
        <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-sky-300">
          <Plane className="h-3.5 w-3.5" />
          <span>AI-Powered Resume Analysis — ResumePilot</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Optimize Your Resume.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400">
            Land More Interviews.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
          Upload your resume PDF and let Claude AI identify critical formatting flaws, skill gaps, and keyword mismatches. Match your qualifications against target job descriptions in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-lg shadow-brand-500/25 hover:opacity-95 hover:shadow-brand-500/35 transition-all"
          >
            <span>{user ? 'Go to Dashboard' : 'Create Free Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-8 py-4 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Learn How it Works</span>
          </a>
        </div>

        {/* Visual Mockup */}
        <div className="relative mx-auto max-w-4xl pt-12">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-500 to-fuchsia-500 opacity-20 blur-xl"></div>
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur shadow-2xl">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-4 mb-4">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-500 font-mono ml-4">https://resumepilot.ai/analyzer</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left">
                <div className="h-3 bg-brand-500/40 rounded w-1/2"></div>
                <div className="h-8 bg-brand-500/20 rounded flex items-center px-3 text-sm font-extrabold text-brand-400">88 / 100</div>
                <div className="h-2 bg-slate-800 rounded w-full"></div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left sm:col-span-2">
                <div className="h-3 bg-emerald-500/40 rounded w-1/3"></div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-slate-800 rounded w-full"></div>
                  <div className="h-2 bg-slate-800 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-800 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <section id="features" className="relative border-t border-white/5 bg-slate-950/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold font-display text-white">Full-Suite ATS Resume Diagnostic</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Equipped with deep learning filters to analyze, optimize, and rank your credentials exactly like corporate recruiters do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-card hover:bg-slate-900/40 border border-white/5 rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-white/10 space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white font-display">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4">
          <p>© {new Date().getFullYear()} ResumePilot. All rights reserved. Designed for elite recruitment optimization.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
