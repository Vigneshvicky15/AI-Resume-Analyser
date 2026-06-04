import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadForm = ({ onUpload, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Validate the selected file
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!', {
        icon: '📄',
        style: {
          background: '#1e1b4b',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        },
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Resume exceeds 5MB size limit!', {
        icon: '⚠️',
        style: {
          background: '#1e1b4b',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
      });
      return;
    }

    setFile(selectedFile);
    toast.success(`${selectedFile.name} loaded successfully!`, {
      style: {
        background: '#064e3b',
        color: '#fff',
      },
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload your resume PDF first!');
      return;
    }
    onUpload(file, jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={file ? null : handleAreaClick}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center ${
          file
            ? 'border-brand-500/40 bg-brand-950/20'
            : isDragActive
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
            : 'border-white/10 bg-slate-900/40 hover:border-brand-500/30 hover:bg-slate-900/60 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isAnalyzing}
        />

        {file ? (
          <div className="w-full flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-xl">
            <div className="flex items-center space-x-3 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white max-w-[200px] sm:max-w-xs md:max-w-md truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isAnalyzing}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-300 border border-white/10 group-hover:text-white transition-all">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Drag and drop your resume here, or <span className="text-brand-400">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Accepts PDF format only (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Target Job Description */}
      <div className="space-y-2">
        <label
          htmlFor="job-description"
          className="block text-sm font-medium text-slate-300 font-display"
        >
          Target Job Description <span className="text-slate-500">(Optional)</span>
        </label>
        <textarea
          id="job-description"
          rows={5}
          placeholder="Paste the target job description here to analyze the exact match percentage, extract missing keywords, and identify specific skill gaps..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isAnalyzing}
          className="w-full bg-slate-900/60 border border-white/10 focus:border-brand-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all resize-none"
        ></textarea>
        <p className="text-xs text-slate-500">
          Comparing your CV against a job description allows Claude to give specialized tactical tips.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || isAnalyzing}
        className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm font-semibold transition-all shadow-lg ${
          !file
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
            : isAnalyzing
            ? 'bg-brand-700 text-white opacity-85 cursor-wait shadow-brand-500/10'
            : 'bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-brand-500/20 hover:opacity-95 hover:shadow-brand-500/30'
        }`}
      >
        <span>{isAnalyzing ? 'Analyzing with Claude...' : 'Begin AI Resume Analysis'}</span>
        {!isAnalyzing && <ChevronRight className="h-4 w-4" />}
      </button>
    </form>
  );
};

export default UploadForm;
