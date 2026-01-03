
import React from 'react';
import type { Job, Application, User } from '../types';

interface TopTalentViewProps {
  jobs: Job[];
  applications: Application[];
  currentUser: User;
  selectedJobId: string | null;
  onSelectJob: (id: string | null) => void;
}

const TopTalentView: React.FC<TopTalentViewProps> = ({ jobs, applications, currentUser, selectedJobId, onSelectJob }) => {
  // Any HR user can view top talent for any job
  const myJobs = jobs;
  const activeJob = myJobs.find(j => j.id === selectedJobId);
  
  // High-scoring candidates (Match threshold: 70%)
  const topMatches = applications
    .filter(app => app.jobId === selectedJobId && app.aiScore !== undefined && app.aiScore >= 70)
    .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

  // Candidates awaiting analysis
  const pendingAnalysis = applications.filter(app => app.jobId === selectedJobId && app.aiScore === undefined);
  
  // Low matches
  const lowMatches = applications.filter(app => app.jobId === selectedJobId && app.aiScore !== undefined && app.aiScore < 70);

  const perfectFit = topMatches[0];
  const otherMatches = topMatches.slice(1);

  const handleViewResume = (app: Application) => {
    if (app.resumeBase64) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<iframe src="${app.resumeBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        newTab.document.title = `${app.candidateName} - Resume`;
      }
    } else {
      alert("No PDF resume available.");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Sidebar Selector */}
      <div className="w-full md:w-72 space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Top Talent Pool</h2>
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {myJobs.length === 0 ? (
            <div className="px-2 py-4 text-sm text-slate-400 italic">No active postings.</div>
          ) : (
            myJobs.map(job => {
              const matchesCount = applications.filter(a => a.jobId === job.id && (a.aiScore || 0) >= 70).length;
              const hasUnscreened = applications.some(a => a.jobId === job.id && a.aiScore === undefined);
              
              return (
                <button
                  key={job.id}
                  onClick={() => onSelectJob(job.id)}
                  className={`w-full text-left px-4 py-4 rounded-2xl transition-all border relative ${
                    selectedJobId === job.id 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]' 
                      : 'text-slate-600 bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="font-black truncate text-sm">{job.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedJobId === job.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {matchesCount} High Match{matchesCount !== 1 ? 'es' : ''}
                    </div>
                    {hasUnscreened && (
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" title="Candidates awaiting screen" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Recommendations Content */}
      <div className="flex-1">
        {!activeJob ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Job</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Choose a posting from the sidebar to view your top talent matches.</p>
          </div>
        ) : topMatches.length > 0 ? (
          <div className="space-y-10">
            {/* Spotlight Card */}
            <div className="relative">
              <div className="absolute -top-4 left-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-2 border-2 border-white">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Primary Recommendation
              </div>
              <div className="bg-white border-2 border-indigo-500 rounded-[3rem] p-10 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700 -z-0" />
                
                <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
                        {perfectFit.candidateName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 leading-none mb-2">{perfectFit.candidateName}</h2>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-lg">{perfectFit.aiScore}% Match</span>
                          <span className="text-slate-400 font-bold text-sm">• {perfectFit.candidateEmail}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          Gemini Reasoning
                        </h3>
                        <p className="text-slate-700 leading-relaxed italic text-sm">
                          "{perfectFit.aiFeedback}"
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {perfectFit.skills?.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-80 space-y-4">
                    <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xl">
                      <h4 className="text-[10px] font-black text-indigo-300 uppercase mb-4 tracking-widest">Outreach</h4>
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleViewResume(perfectFit)}
                          className="w-full py-4 bg-indigo-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 border border-indigo-600"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          Resume PDF
                        </button>
                        <a 
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${perfectFit.candidateEmail}&su=HireStream Application for ${activeJob.title}`}
                          className="w-full py-4 bg-white text-indigo-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          Contact Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Matches */}
            {otherMatches.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-slate-900">Highly Compatible</h3>
                  <div className="h-[1px] bg-slate-100 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherMatches.map(match => (
                    <div key={match.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                            {match.candidateName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{match.candidateName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{match.candidateEmail}</div>
                          </div>
                        </div>
                        <div className="text-xl font-black text-indigo-600">
                          {match.aiScore}%
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-xs text-slate-500 line-clamp-3 italic mb-6">"{match.aiFeedback}"</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewResume(match)}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                        >
                          Resume
                        </button>
                        <a 
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${match.candidateEmail}`}
                          className="flex-[2] py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-sm px-10">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
              {pendingAnalysis.length > 0 ? (
                <div className="relative">
                  <svg className="w-12 h-12 text-indigo-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              ) : (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              {pendingAnalysis.length > 0 
                ? `${pendingAnalysis.length} Candidates Pending Screen` 
                : (lowMatches.length > 0 ? 'No High-Potential Matches' : 'Waiting for Applications')}
            </h3>
            
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
              {pendingAnalysis.length > 0 
                ? "You have candidates awaiting analysis! Head over to the 'Recruit' tab and click 'Analyze with Gemini AI' to rank them here."
                : (lowMatches.length > 0 
                    ? `Found ${lowMatches.length} candidates, but none scored above the 70% threshold for this role.` 
                    : "As soon as candidates apply and are analyzed, your top talent picks will be showcased here in real-time.")}
            </p>

            {pendingAnalysis.length > 0 && (
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 inline-block px-6 py-3 rounded-2xl border border-indigo-100">
                Action Required in Recruit Tab
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTalentView;
