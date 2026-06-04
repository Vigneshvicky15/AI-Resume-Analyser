import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Calendar, ChevronRight, FileText } from 'lucide-react';

const HistoryCard = ({ analysis }) => {
  const { _id, score, jobMatchPercentage, jobDescription, createdAt } = analysis;

  // Format date nicely
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Truncate job description for preview
  const truncateText = (text, maxLength = 80) => {
    if (!text) return 'General industry scan (no specific JD compared)';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (val >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="glass-card hover:bg-slate-900/40 border border-white/5 rounded-2xl p-6 transition-all hover:scale-[1.01] hover:border-white/10 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <FileText className="h-4 w-4" />
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-3">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Score</p>
            <div className="flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-slate-300" />
              <span className={`text-base font-bold px-2 py-0.5 rounded-lg border ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Job Match</p>
            <div className="flex items-center space-x-1.5">
              <Target className="h-4 w-4 text-slate-300" />
              <span className="text-base font-bold px-2 py-0.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400">
                {jobMatchPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Job Description Preview */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Job</p>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {truncateText(jobDescription)}
          </p>
        </div>
      </div>

      {/* Action Redirect */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-end">
        <Link
          to={`/analysis/${_id}`}
          className="flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-all group-hover:translate-x-0.5"
        >
          <span>View Detailed Report</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default HistoryCard;
