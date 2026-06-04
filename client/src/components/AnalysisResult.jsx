import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  ExternalLink, 
  RefreshCw, 
  Award, 
  Sparkles, 
  Copy, 
  Check, 
  Briefcase, 
  Code, 
  Settings, 
  Cpu, 
  Database, 
  Activity, 
  DollarSign, 
  Megaphone, 
  UserCheck, 
  FileText, 
  Compass, 
  Info 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AnalysisResult = ({ analysis, onReset }) => {
  const {
    score = 70,
    strengths = [],
    weaknesses = [],
    skillGaps = [],
    suggestions = [],
    jobMatchPercentage = 0,
    jobDescription = '',
    resumeUrl = '',
    // Advanced ATS fields (destructured with solid fallbacks for backward-compatibility)
    domain = 'General Professional',
    experienceLevel = 'Mid Level',
    matchedSkills = [],
    missingSkills = [],
    skillsMatchPercentage = 0,
    optimizedBullets = [],
    domainVerbs = [],
    domainMetrics = [],
    formattingTips = [],
    experienceAdvice = []
  } = analysis;

  const [activeTab, setActiveTab] = useState('alignment');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Define styling and icon based on detected domain
  const getDomainProfile = (field) => {
    const name = (field || 'General').toLowerCase();
    
    if (name.includes('software') || name.includes('it')) {
      return {
        icon: Code,
        bgGradient: 'from-sky-500/10 to-indigo-500/10',
        borderColor: 'border-sky-500/20',
        textColor: 'text-sky-300',
        iconBg: 'bg-sky-500/20 text-sky-400',
        themeColor: 'sky'
      };
    }
    if (name.includes('mechanical')) {
      return {
        icon: Settings,
        bgGradient: 'from-amber-500/10 to-orange-500/10',
        borderColor: 'border-amber-500/20',
        textColor: 'text-amber-300',
        iconBg: 'bg-amber-500/20 text-amber-400',
        themeColor: 'amber'
      };
    }
    if (name.includes('civil')) {
      return {
        icon: Compass,
        bgGradient: 'from-yellow-500/10 to-amber-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-300',
        iconBg: 'bg-yellow-500/20 text-yellow-400',
        themeColor: 'yellow'
      };
    }
    if (name.includes('ece') || name.includes('eee') || name.includes('electrical') || name.includes('embedded')) {
      return {
        icon: Cpu,
        bgGradient: 'from-purple-500/10 to-pink-500/10',
        borderColor: 'border-purple-500/20',
        textColor: 'text-purple-300',
        iconBg: 'bg-purple-500/20 text-purple-400',
        themeColor: 'purple'
      };
    }
    if (name.includes('data science') || name.includes('data') || name.includes('intelligence') || name.includes('ai')) {
      return {
        icon: Database,
        bgGradient: 'from-teal-500/10 to-emerald-500/10',
        borderColor: 'border-teal-500/20',
        textColor: 'text-teal-300',
        iconBg: 'bg-teal-500/20 text-teal-400',
        themeColor: 'teal'
      };
    }
    if (name.includes('mba') || name.includes('business') || name.includes('management') || name.includes('executive')) {
      return {
        icon: Briefcase,
        bgGradient: 'from-emerald-500/10 to-cyan-500/10',
        borderColor: 'border-emerald-500/20',
        textColor: 'text-emerald-300',
        iconBg: 'bg-emerald-500/20 text-emerald-400',
        themeColor: 'emerald'
      };
    }
    if (name.includes('healthcare') || name.includes('medical') || name.includes('clinical') || name.includes('nursing')) {
      return {
        icon: Activity,
        bgGradient: 'from-rose-500/10 to-red-500/10',
        borderColor: 'border-rose-500/20',
        textColor: 'text-rose-300',
        iconBg: 'bg-rose-500/20 text-rose-400',
        themeColor: 'rose'
      };
    }
    if (name.includes('finance') || name.includes('account')) {
      return {
        icon: DollarSign,
        bgGradient: 'from-cyan-500/10 to-sky-500/10',
        borderColor: 'border-cyan-500/20',
        textColor: 'text-cyan-300',
        iconBg: 'bg-cyan-500/20 text-cyan-400',
        themeColor: 'cyan'
      };
    }
    if (name.includes('marketing') || name.includes('growth') || name.includes('sales')) {
      return {
        icon: Megaphone,
        bgGradient: 'from-pink-500/10 to-purple-500/10',
        borderColor: 'border-pink-500/20',
        textColor: 'text-pink-300',
        iconBg: 'bg-pink-500/20 text-pink-400',
        themeColor: 'pink'
      };
    }
    
    // Default / General
    return {
      icon: UserCheck,
      bgGradient: 'from-slate-500/10 to-slate-400/10',
      borderColor: 'border-slate-500/20',
      textColor: 'text-slate-300',
      iconBg: 'bg-slate-500/20 text-slate-400',
      themeColor: 'slate'
    };
  };

  const domainProfile = getDomainProfile(domain);
  const DomainIcon = domainProfile.icon;

  // Determine colors based on scores
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (val >= 60) return 'text-amber-400 stroke-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 stroke-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const getStrokeClass = (val) => {
    if (val >= 80) return 'stroke-emerald-500';
    if (val >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  // Copy helper
  const handleCopyToClipboard = (textToCopy, index) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    toast.success('Optimized bullet point copied to clipboard!');
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Safe Fallback content for Older Scans
  const finalMatchedSkills = matchedSkills.length > 0 ? matchedSkills : ['General Professional Skills'];
  const finalMissingSkills = missingSkills.length > 0 ? missingSkills : ['Review target job requirements for specific tool lists.'];
  const finalSkillsMatchPercentage = skillsMatchPercentage > 0 ? skillsMatchPercentage : (jobMatchPercentage || 65);
  
  const finalOptimizedBullets = optimizedBullets.length > 0 ? optimizedBullets : [
    {
      before: "Worked on client projects and tasks daily.",
      after: `Spearheaded 4 high-value client workflows in the ${domain} domain, optimizing task timelines and boosting operational output by 20%.`,
      rationale: "Replaces passive 'worked on' with 'Spearheaded' and adds a quantifiable 20% productivity improvement metric."
    },
    {
      before: "Responsible for team coordination and meetings.",
      after: `Orchestrated weekly cross-functional scrum sprints for a team of 5, slashing operational project bottlenecks and completing milestones 8 days early.`,
      rationale: "Shows project management authority, active coordination, and direct speed-to-market metrics."
    },
    {
      before: "Helped improve data spreadsheet records.",
      after: `Overhauled data management files and audit listings, eliminating 15% redundant records to speed up team analytics cycles by 30%.`,
      rationale: "Demonstrates accuracy optimization and concrete quantitative operational time-savings."
    }
  ];

  const finalDomainVerbs = domainVerbs.length > 0 ? domainVerbs : ['Spearheaded', 'Orchestrated', 'Optimized', 'Formulated', 'Streamlined', 'Delivered'];
  const finalDomainMetrics = domainMetrics.length > 0 ? domainMetrics : ['Reduced process cycles by X%', 'Cut operating expenses by $X', 'Boosted production yield by X%', 'Achieved X% client retention'];
  
  const finalFormattingTips = formattingTips.length > 0 ? formattingTips : [
    "📐 Margins: Maintain a standard 1.0-inch margin on all sides for neat printable balance.",
    "🔤 Typography: Use readable, modern sans-serif fonts such as Inter or Arial at 10-12pt sizes.",
    "📁 Document Format: Save files in PDF formats, naming as 'FirstName_LastName_Resume.pdf'.",
    "💡 Parser Check: Never place contact details or skills in headers/footers, as parsers ignore them."
  ];

  const finalExperienceAdvice = experienceAdvice.length > 0 ? experienceAdvice : [
    `📊 Highlight Impact: In the ${domain} domain, balance technological tool listings with real workspace accomplishments.`,
    "🔑 Action-Oriented: Transition bullet sentences from simple tasks to proactive project ownership.",
    "🎖️ Certifications: Place professional certifications right after experiences to boost relevance instantly."
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in text-slate-100">
      
      {/* Header Info Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Dynamic Resume Assessment</h2>
          <p className="text-slate-400 text-sm mt-1">
            ResumePilot has analyzed your credentials against dynamic, industry-specific ATS filters.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/5 transition-all text-slate-300 hover:text-white"
            >
              <span>View Resume</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 transition-all text-white shadow-md shadow-brand-500/10"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Optimize Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ATS Score Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-white/5 space-y-4">
          <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
            <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-800 fill-transparent" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className={`fill-transparent transition-all duration-1000 ease-out ${getStrokeClass(score)}`}
                strokeWidth="10"
                strokeDasharray="339.3"
                strokeDashoffset={339.3 - (339.3 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white font-display">{score}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">ATS Score</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-semibold border ${getScoreColor(score)}`}>
              <Award className="h-3 w-3" />
              <span>{score >= 80 ? 'Excellent Layout' : score >= 60 ? 'Moderate Layout' : 'Needs Optimization'}</span>
            </span>
            <h3 className="text-md font-bold text-white font-display pt-1">ATS Score Meter</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-2">
              Evaluates formatting checks, keyword presence, action phrasing, and contact details.
            </p>
          </div>
        </div>

        {/* JD Match Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-white/5 space-y-4">
          <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
            <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-800 fill-transparent" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-brand-500 fill-transparent transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray="339.3"
                strokeDashoffset={339.3 - (339.3 * (jobMatchPercentage || 45)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white font-display">{jobMatchPercentage || 45}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">JD Alignment</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-semibold border border-brand-500/20 bg-brand-500/5 text-brand-400">
              <Target className="h-3 w-3" />
              <span>{jobDescription ? 'Targeted Job Match' : 'General Match'}</span>
            </span>
            <h3 className="text-md font-bold text-white font-display pt-1">JD Alignment Dial</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-2">
              {jobDescription 
                ? 'Measures direct keyword density and core duties matches with your target description.'
                : 'Presents base baseline. Paste a target job description to compute detailed matching score.'}
            </p>
          </div>
        </div>

        {/* Identified Domain Card */}
        <div className={`glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center border ${domainProfile.borderColor} bg-gradient-to-br ${domainProfile.bgGradient} space-y-4`}>
          <div className={`flex h-28 w-28 items-center justify-center rounded-full ${domainProfile.iconBg} border border-white/5`}>
            <DomainIcon className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${domainProfile.textColor} bg-white/5 border border-white/5`}>
              {experienceLevel}
            </span>
            <h3 className="text-md font-bold text-white font-display pt-1">Domain Detected</h3>
            <p className={`text-sm font-semibold ${domainProfile.textColor}`}>
              {domain}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed px-2 pt-0.5">
              ATS parameters have been customized automatically for this industry profile.
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/60 border border-white/5 rounded-2xl backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('alignment')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
            activeTab === 'alignment' 
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Alignment Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('bullets')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
            activeTab === 'bullets' 
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Re-written Bullets</span>
        </button>
        <button
          onClick={() => setActiveTab('domainTips')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
            activeTab === 'domainTips' 
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Domain Specific Tips</span>
        </button>
        <button
          onClick={() => setActiveTab('recruiter')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
            activeTab === 'recruiter' 
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span>Recruiter Advice</span>
        </button>
      </div>

      {/* Active Tab Panel Content */}
      <div className="w-full animate-fade-in">
        
        {/* Tab A: Alignment Analysis */}
        {activeTab === 'alignment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Col: Core Strengths & Flaws */}
            <div className="space-y-6">
              
              {/* Strengths */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white font-display">Key Strengths</h4>
                </div>
                <ul className="space-y-3">
                  {strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white font-display">Critical ATS Flaws</h4>
                </div>
                <ul className="space-y-3">
                  {weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Col: Skills Audit Mapping */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Target className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white font-display">Technical Skills Alignment</h4>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Skills Match Density</span>
                    <span className="font-semibold text-purple-400">{finalSkillsMatchPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-1000" 
                      style={{ width: `${finalSkillsMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Matched Skills */}
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                      ✓ Matched Credentials in Resume
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {finalMatchedSkills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/5 border border-emerald-500/15 text-emerald-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">
                      ⚠️ Missing Keywords (Highly Recommended to Add)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {finalMissingSkills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/5 border border-purple-500/15 text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white font-display">Priority Adjustments</h4>
                </div>
                <div className="space-y-2">
                  {suggestions.slice(0, 3).map((sug, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start space-x-2.5 text-xs text-slate-300">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[9px] font-bold text-brand-400 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab B: Tailored Re-written Bullets */}
        {activeTab === 'bullets' && (
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Tailored Bullet Optimizations</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Take weak, passive sentences from your CV and optimize them instantly. Click the copy icon to copy your tailored bullet points to your clipboard.
              </p>
            </div>

            <div className="space-y-4">
              {finalOptimizedBullets.map((card, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5 relative group hover:border-brand-500/20 transition-all duration-300">
                  
                  {/* Before */}
                  <div className="space-y-1.5 pr-2">
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest block">
                      ❌ Weak Phrasing / Task Focus
                    </span>
                    <p className="text-xs text-slate-400 italic">
                      "{card.before}"
                    </p>
                    <span className="text-[10px] text-slate-500 block pt-1">
                      Typically lacks context, results, and strong active verbs.
                    </span>
                  </div>

                  {/* After */}
                  <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6 relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                        ✅ ATS-Optimized (Active Verbs + Metrics)
                      </span>
                      <button
                        onClick={() => handleCopyToClipboard(card.after, idx)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-brand-500/30 text-slate-400 hover:text-white transition-all focus:outline-none"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-emerald-300 font-semibold italic pr-6 leading-relaxed">
                      "{card.after}"
                    </p>
                    <div className="flex items-start space-x-1.5 bg-brand-500/5 border border-brand-500/10 p-2.5 rounded-xl text-[10px] text-slate-400">
                      <Info className="h-3.5 w-3.5 shrink-0 text-brand-400 mt-0.5" />
                      <span>
                        <strong className="text-brand-300">Rationale: </strong>
                        {card.rationale}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab C: Domain Specific Tips */}
        {activeTab === 'domainTips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domain Active Verbs Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Compass className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Industry Action Verbs</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ATS parsers prioritize sentences starting with strong, industry-specific action verbs. Swap passive vocabulary with these:
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {finalDomainVerbs.map((verb, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-500/5 border border-brand-500/10 text-brand-300 hover:scale-105 transition-all cursor-default"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Metrics Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Target Metrics & KPIs</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add numbers, money values, or percentages to show concrete impacts of your daily work:
              </p>
              
              <div className="space-y-2.5 pt-1">
                {finalDomainMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab D: Recruiter & Formatting Advice */}
        {activeTab === 'recruiter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Formatting Guidelines */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Core Formatting Audits</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Structural ATS rules to guarantee your files compile flawlessly through company screening databases:
              </p>
              
              <div className="space-y-3 pt-1">
                {finalFormattingTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Level Advice */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">
                  {experienceLevel} Hiring Secrets
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Strategic advice customized for your identified professional tier to stand out to recruiters:
              </p>
              
              <div className="space-y-3 pt-1">
                {finalExperienceAdvice.map((advice, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-2 shrink-0"></span>
                    <span>{advice}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default AnalysisResult;
