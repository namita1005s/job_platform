import React from 'react';
import type { Application, Job, User } from '../types'; // Added 'type' keyword

interface CandidateApplicationsProps {
  applications: Application[];
  jobs: Job[];
  currentUser: User;
  onGoToBrowse?: () => void;
}

const CandidateApplications: React.FC<CandidateApplicationsProps> = ({ applications, jobs, currentUser, onGoToBrowse }) => {
  // Use email for filtering to ensure consistency with what was saved during handleApply
  const myApplications = applications
    .filter(app => app.candidateEmail.toLowerCase() === currentUser.email.toLowerCase())
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-500 font-medium">Track your status and see how your skills match the roles.</p>
      </div>

      {myApplications.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 font-bold mb-8">You haven't submitted any applications yet.</p>
          <button 
            onClick={onGoToBrowse}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Browse Open Roles
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {myApplications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full shadow-sm">Applied</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">{job?.title || 'Unknown Position'}</h2>
                    <p className="text-xl text-blue-600 font-bold mt-1">{job?.company || 'Unknown Company'}</p>
                  </div>
                  
                  {app.aiScore !== undefined ? (
                    <div className="text-center flex flex-col items-center">
                      <div className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl border-4 ${
                        app.aiScore >= 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        app.aiScore >= 60 ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        'bg-rose-50 border-rose-100 text-rose-600'
                      }`}>
                        <span className="text-3xl font-black leading-none">{app.aiScore}%</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter mt-1">Match</span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                      Screening in progress
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                   <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">My Profile Details</h4>
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Contact Email</span>
                        <span className="text-sm font-black text-slate-700">{app.candidateEmail}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {app.skills?.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-white text-xs font-bold text-slate-600 rounded-full border border-slate-100 shadow-sm">{skill}</span>
                        ))}
                      </div>
                   </div>

                   {app.aiFeedback ? (
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                        <svg className="w-16 h-16 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <h4 className="text-[10px] font-black text-indigo-700 uppercase mb-4 tracking-widest">AI Feedback</h4>
                      <p className="text-slate-700 leading-relaxed italic text-sm relative z-10">
                        "{app.aiFeedback}"
                      </p>
                    </div>
                   ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-center">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose px-4">Recruiter will contact you via {app.candidateEmail} after AI screening</p>
                    </div>
                   )}
                </div>
                
                <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Location</span>
                        <span className="text-xs font-black text-slate-700">{job?.location}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Salary</span>
                        <span className="text-xs font-black text-slate-700">{job?.salary}</span>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateApplications;