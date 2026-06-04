import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import UploadForm from '../components/UploadForm';
import HistoryCard from '../components/HistoryCard';
import Loader from '../components/Loader';
import { BarChart3, Plus, History, RefreshCcw, TrendingUp, Award, Layers, Copy, FileText, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'upload', or 'templates'
  const [selectedTemplate, setSelectedTemplate] = useState('tech');

  const templatesData = {
    tech: {
      name: 'Silicon Valley Tech Standard',
      description: 'Optimized for Software Engineers, Web Developers, and MERN stack specialists. Maximize keyword search matches for modern programming technologies.',
      text: `[FIRST_NAME] [LAST_NAME]\n[City, State] | [Phone] | [Email] | [LinkedIn URL] | [GitHub URL]\n\nTECHNICAL SKILLS\n- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL\n- Frameworks: React, Node.js, Express, Next.js, Redux, Tailwind CSS\n- Databases: MongoDB, PostgreSQL, Redis\n- Tools/DevOps: Git, Docker, AWS (S3, EC2), GitHub Actions (CI/CD)\n\nPROFESSIONAL EXPERIENCE\n[Company Name] | [Job Title] | [Start Date] – Present\n- Engineered high-impact responsive user interfaces utilizing React, resulting in a 25% decrease in page rendering latency.\n- Refactored server-side REST API endpoints in Express and Node.js, accelerating query speeds by 30%.\n- Integrated secure third-party Cloudinary image uploads and PDF generation services for client onboarding.\n- Automated deployment pipelines using GitHub Actions CI/CD, reducing manual staging time by 4 hours weekly.\n\nPROJECTS\nResumePilot - SaaS Platform\n- Built a secure full-stack platform using React, Node, and MongoDB, supporting 500+ active users.\n- Hooked PDF parsing services directly to deep-learning models, providing instant ATS suggestions in real-time.\n\nEDUCATION\n[University Name] | Bachelor of Science in Computer Science | [Graduation Year]`
    },
    corporate: {
      name: 'Enterprise Corporate Executive',
      description: 'Ideal for Product Managers, Scrum Masters, Business Analysts, and Project Coordinators. Focuses heavily on leadership action-verbs.',
      text: `[FIRST_NAME] [LAST_NAME]\n[City, State] | [Phone] | [Email] | [LinkedIn URL]\n\nSUMMARY\nStrategic and results-driven Product Leader with 5+ years of experience leading cross-functional teams to launch high-scale enterprise applications.\n\nCORE COMPETENCIES\n- Methodologies: Agile / Scrum, Product Lifecycle Management (PLM), Kanban\n- Skills: Roadmap Strategy, Competitive Analysis, User Research, Stakeholder Management\n- Tools: Jira, Confluence, Figma, Google Analytics, SQL, Tableau\n\nPROFESSIONAL EXPERIENCE\n[Company Name] | Senior Product Lead | [Start Date] – Present\n- Formulated and executed the product roadmap for a cloud enterprise tool, driving a 38% increase in Q3 active user adoption.\n- Orchestrated daily workflows for 12+ engineers and designers using Agile Scrum, boosting team velocity by 18%.\n- Synthesized quantitative data from Google Analytics and user research to design a revamped user experience, reducing churn by 12%.\n- Negotiated feature prioritizing with senior executives, keeping alignment with business objectives and product vision.\n\nEDUCATION\n[University Name] | Master of Business Administration (MBA) | [Graduation Year]`
    },
    design: {
      name: 'Human-Centered Creative Architect',
      description: 'Engineered for UI/UX Designers, Graphic Artists, and Creative Developers. Aligns design tokens cleanly for modern ATS parsers.',
      text: `[FIRST_NAME] [LAST_NAME]\n[City, State] | [Phone] | [Email] | [LinkedIn URL] | [Portfolio URL]\n\nAREAS OF EXPERTISE\n- Design: Wireframing, High-Fidelity Mockups, User Journeys, Design Systems, Typography\n- Research: Usability Testing, A/B Testing, Personas, Competitive Analysis\n- Software: Figma, Adobe Creative Suite, HTML, CSS, Tailwind\n\nPROFESSIONAL EXPERIENCE\n[Company Name] | Lead UI/UX Designer | [Start Date] – Present\n- Established and implemented a comprehensive enterprise design system in Figma, reducing front-end development implementation times by 40%.\n- Iterated on 45+ wireframes, responsive prototypes, and user flows, resulting in a 22% increase in conversion rates.\n- Executed 15+ comprehensive usability tests, collecting qualitative insights to optimize core user checkout pathways.\n- Directed visual designs for 3 award-winning branding portfolios, collaborating closely with marketing and product leads.\n\nEDUCATION\n[Design Academy] | Bachelor of Fine Arts in Interaction Design | [Graduation Year]`
    }
  };

  const handleCopyTemplate = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied successfully!', {
      style: {
        background: '#0f172a',
        color: '#34d399',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
      },
    });
  };

  // Fetch previous resume analyses
  const fetchHistory = async (showToast = false) => {
    try {
      const { data } = await api.get('/resume/history');
      if (data && data.success) {
        setHistory(data.data);
      }
      if (showToast) {
        toast.success('Dashboard refreshed!', { id: 'refresh' });
      }
    } catch (error) {
      console.error('Failed to retrieve history:', error.message);
      toast.error('Could not load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle uploading and initiating analysis
  const handleUpload = async (file, jobDescription) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data && data.success) {
        toast.success('Resume analysis completed successfully!');
        // Redirect to detail page
        navigate(`/analysis/${data.data._id}`);
      }
    } catch (error) {
      console.error('[Upload Error]', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Failed to analyze resume. Please try again.';
      toast.error(errorMsg, {
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compute metrics from history logs
  const computeMetrics = () => {
    if (history.length === 0) {
      return { avgScore: 0, highestMatch: 0, total: 0 };
    }
    const total = history.length;
    const avgScore = Math.round(history.reduce((sum, item) => sum + item.score, 0) / total);
    const highestMatch = Math.max(...history.map((item) => item.jobMatchPercentage || 0));
    return { avgScore, highestMatch, total };
  };

  const { avgScore, highestMatch, total } = computeMetrics();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative background glows */}
      <div className="absolute top-[5%] left-[-5%] h-[400px] w-[400px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-fuchsia-500/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-8 relative">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-display">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Upload your CV, evaluate target fits, and browse detailed assessment reports.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchHistory(true)}
              className="p-3 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Refresh Dashboard"
            >
              <RefreshCcw className="h-4.5 w-4.5" />
            </button>
            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'history' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="h-4 w-4" />
                <span>My Reports</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'upload' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>New AI Audit</span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'templates' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>ATS Templates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Average Score */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
              <h3 className="text-2xl font-bold text-white font-display mt-0.5">{avgScore} / 100</h3>
            </div>
          </div>

          {/* Highest Match */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best Match</p>
              <h3 className="text-2xl font-bold text-white font-display mt-0.5">{highestMatch}%</h3>
            </div>
          </div>

          {/* Total Audits */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes</p>
              <h3 className="text-2xl font-bold text-white font-display mt-0.5">{total} Audited</h3>
            </div>
          </div>
        </div>

        {/* Tab content panel */}
        {activeTab === 'upload' ? (
          <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xl">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold font-display text-white">New AI Resume Scan</h2>
              <p className="text-slate-400 text-xs mt-1">
                Upload your resume PDF and optional Job description to initiate the Claude audit.
              </p>
            </div>
            <UploadForm onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          </div>
        ) : activeTab === 'templates' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Templates Selector List & Guidelines */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Select ATS Format</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose a layout optimized for your career field.</p>
                </div>
                
                <div className="space-y-3">
                  {Object.keys(templatesData).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        selectedTemplate === key
                          ? 'bg-brand-500/10 border-brand-500/40 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider block">{templatesData[key].name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{templatesData[key].description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formatting advice */}
              <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4 bg-gradient-to-tr from-brand-600/5 to-fuchsia-600/5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-brand-400" />
                  <h3 className="text-sm font-bold text-white font-display">The Perfect Resume Rules</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></span>
                    <span><strong>No Sidebars / Columns:</strong> Always use a single-column layout. ATS scanners parse line-by-line and get confused by dual-columns.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></span>
                    <span><strong>Standard Fonts:</strong> Use Calibri, Arial, Georgia, or Times New Roman. Do not use custom graphical fonts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></span>
                    <span><strong>Quantified Achievements:</strong> Every bullet point should use action verbs and show metrics (e.g., "boosted speed by 25%").</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Template Viewer */}
            <div className="lg:col-span-2 glass-panel border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">{templatesData[selectedTemplate].name}</h2>
                  <p className="text-xs text-slate-400 mt-1">Copy and paste this ATS structure directly into Word/Google Docs.</p>
                </div>
                <button
                  onClick={() => handleCopyTemplate(templatesData[selectedTemplate].text)}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-white text-slate-950 rounded-xl hover:bg-slate-100 transition-all shadow-md shadow-white/5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy ATS Template</span>
                </button>
              </div>

              <pre className="bg-slate-900 border border-white/10 rounded-2xl p-6 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-[500px] overflow-y-auto select-all">
                {templatesData[selectedTemplate].text}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-bold font-display text-white">Previous Reports</h2>
            </div>
            {loading ? (
              <Loader skeleton count={3} />
            ) : history.length === 0 ? (
              <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-slate-900/10 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mx-auto">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">No scans found</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                    You haven't uploaded any resumes yet. Click "New AI Audit" to begin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <HistoryCard key={item._id} analysis={item} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Global Analysis Loading Screen Overlay */}
      {isAnalyzing && <Loader fullScreen />}
    </div>
  );
};

export default Dashboard;
