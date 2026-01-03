import React, { useState } from 'react';
import type { Job, Application, User } from '../types'; // Added 'type' keyword
import JobCard from './JobCard';

interface CandidateDashboardProps {
  jobs: Job[];
  currentUser: User;
  onApply: (jobId: string, data: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => void;
  onRefresh?: () => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ jobs, currentUser, onApply, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Sort jobs: newest first
  const sortedJobs = [...jobs].sort((a, b) => 
    new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">Find your next big thing.</h1>
          <p className="text-slate-500 font-medium">Discover opportunities at the fastest-growing tech companies.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh Jobs'}
        </button>
      </div>

      {sortedJobs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
           </div>
           <h3 className="text-lg font-bold text-slate-900">No openings found</h3>
           <p className="text-slate-500 max-w-xs mx-auto mt-1">Check back soon for new opportunities or try refreshing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedJobs.map(job => (
            <JobCard key={job.id} job={job} currentUser={currentUser} onApply={onApply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;