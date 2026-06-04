import React from 'react';

const Loader = ({ fullScreen = false, skeleton = false, count = 3 }) => {
  if (skeleton) {
    return (
      <div className="w-full space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-full p-6 rounded-2xl glass-card border border-white/5 animate-pulse-slow flex flex-col space-y-3"
          >
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-800 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        {/* Glowing background halo */}
        <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-md animate-pulse-slow"></div>
        {/* Primary animated circle */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-brand-500 border-l-2 border-l-transparent border-b-2 border-b-transparent animate-spin"></div>
      </div>
      <p className="text-slate-400 font-display text-sm animate-pulse">
        Analyzing credentials with Claude AI...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loader;
