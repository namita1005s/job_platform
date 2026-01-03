import React, { useState, useEffect } from 'react';
import type { Job, Application } from '../types'; // Removed AIRecommendation
import { analyzeApplications } from '../geminiService';
import JobPostForm from './JobPostForm';

interface HRDashboardProps {
  jobs: Job[];
  applications: Application[];
  selectedJobId: string | null;
  onSelectJob: (id: string | null) => void;
  onPostJob: (job: Omit<Job, 'id' | 'postedAt' | 'creatorId'>) => void;
  onUpdateJob: (job: Job) => void;
  onUpdateApplications: (apps: Application[]) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ 
  jobs, 
  applications, 
  selectedJobId, 
  onSelectJob, 
  onPostJob, 
  onUpdateJob,
  onUpdateApplications
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Maintain active selection
  useEffect(() => {
    if (jobs.length > 0) {
      const exists = jobs.find(j => j.id === selectedJobId);
      if (!exists) {
        onSelectJob(jobs[0].id);
      }
    } else {
      onSelectJob(null);
    }
  }, [jobs, selectedJobId, onSelectJob]);

  const activeJob = jobs.find(j => j.id === selectedJobId);
  const jobApplications = applications.filter(app => app.jobId === selectedJobId);

  const handleAIScan = async () => {
    if (!activeJob || jobApplications.length === 0) return;
    setIsAnalyzing(true);
    try {
      const recommendations = await analyzeApplications(activeJob, jobApplications);
      const updatedApps: Application[] = recommendations.map(rec => {
        const app = jobApplications.find(a => a.id === rec.applicationId);
        return app ? { ...app, aiScore: rec.score, aiFeedback: rec.feedback } : null;
      }).filter(Boolean) as Application[];
      
      if (updatedApps.length > 0) onUpdateApplications(updatedApps);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowPostForm(true);
  };

  const handleViewResume = (app: Application) => {
    if (app.resumeBase64) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<iframe src="${app.resumeBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    } else {
      alert("No PDF resume available.");
    }
  };

  const sunsetGradient = "bg-gradient-to-r from-[#ff9966] to-[#ff5e62]";

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Sidebar: Job List */}
      <div className="w-full md:w-80 space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-lg font-bold text-slate-900">Positions</h2>
          <button 
            onClick={() => { setEditingJob(null); setShowPostForm(true); }}
            className={`p-2 ${sunsetGradient} text-white rounded-xl hover:brightness-110 shadow-lg`}
            title="Create new job posting"
            aria-label="Create new job posting"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {jobs.length === 0 ? (
            <p className="text-slate-400 text-sm p-4 text-center border border-dashed rounded-xl">No postings</p>
          ) : (
            jobs.map(job => (
              <button 
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedJobId === job.id ? 'border-[#ff5e62] bg-orange-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="font-bold text-slate-900 truncate">{job.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase font-black">
                  {applications.filter(a => a.jobId === job.id).length} Applicants
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1">
        {activeJob ? (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{activeJob.title}</h1>
                <p className="text-slate-500 font-medium">{activeJob.company} • {activeJob.location}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAIScan}
                  disabled={isAnalyzing || jobApplications.length === 0}
                  className={`${sunsetGradient} text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg disabled:opacity-50`}
                  title="Analyze candidates with AI"
                  aria-label="Analyze candidates with Gemini AI"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Gemini AI Screen'}
                </button>

                <button
                  onClick={() => handleEdit(activeJob)}
                  className="p-3.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl hover:text-blue-500 transition-all flex items-center gap-2 font-bold px-5"
                  title="Edit job posting"
                  aria-label="Edit job posting"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Job</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {jobApplications.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                  <p className="text-slate-400 font-medium italic">No applications received yet.</p>
                </div>
              ) : (
                jobApplications.map(app => (
                  <div key={app.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">
                          {app.candidateName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{app.candidateName}</h4>
                          <p className="text-xs text-[#ff5e62] font-bold">{app.candidateEmail}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {app.aiScore !== undefined && (
                          <div className="px-3 py-1 bg-orange-50 text-[#ff5e62] rounded-lg font-black text-sm">
                            {app.aiScore}%
                          </div>
                        )}
                        <button 
                          onClick={() => handleViewResume(app)} 
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 border px-3 py-1 rounded-lg"
                          title="View candidate resume"
                          aria-label="View candidate resume"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                    {app.aiFeedback && (
                      <p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">"{app.aiFeedback}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900">Manage Your Recruitment</h3>
            <p className="text-slate-500 mt-2">Select a job posting from the left to manage candidates.</p>
          </div>
        )}
      </div>

      {showPostForm && (
        <JobPostForm 
          initialData={editingJob || undefined}
          onClose={() => { setShowPostForm(false); setEditingJob(null); }} 
          onSubmit={onPostJob} 
          onUpdate={onUpdateJob}
        />
      )}
    </div>
  );
};

export default HRDashboard;