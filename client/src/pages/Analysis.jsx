import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import AnalysisResult from '../components/AnalysisResult';
import Loader from '../components/Loader';
import { ChevronLeft, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/resume/${id}`);
        if (data && data.success) {
          setAnalysis(data.data);
        } else {
          setError('Failed to retrieve the analysis results.');
        }
      } catch (err) {
        console.error('[Analysis Page Error]', err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || 'Report not found or you do not have permission to view it.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-md glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-white">Analysis Report Error</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{error || 'Unable to load report.'}</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl space-y-6 relative animate-fade-in">
        {/* Back navigation bar */}
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/5 px-3 py-2 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Detailed Assessment */}
        <AnalysisResult analysis={analysis} onReset={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default Analysis;
