import React, { useState } from 'react';
import { UserRole } from '../types';
import type { User, HRView, CandidateView } from '../types'; // Import from types

interface HeaderProps {
  user: User;
  onLogout: () => void;
  hrView: HRView;
  setHrView: (view: HRView) => void;
  candidateView: CandidateView;
  setCandidateView: (view: CandidateView) => void;
  onShowAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  hrView, 
  setHrView, 
  candidateView, 
  setCandidateView, 
  onShowAbout 
}) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            if (user.role === UserRole.HR) setHrView('DASHBOARD'); // Use string literal
            else setCandidateView('BROWSE'); // Use string literal
          }}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              HireStream AI
            </span>
          </div>

          <nav className="flex items-center gap-1 md:border-l md:pl-8 border-slate-200">
            <button
              onClick={onShowAbout}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            >
              About
            </button>
            
            {user.role === UserRole.CANDIDATE && (
              <>
                <button
                  onClick={() => setCandidateView('BROWSE')} // Use string literal
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                    candidateView === 'BROWSE' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Browse Jobs
                </button>
                <button
                  onClick={() => setCandidateView('APPLICATIONS')} // Use string literal
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                    candidateView === 'APPLICATIONS' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Applied Jobs
                </button>
              </>
            )}

            {user.role === UserRole.HR && (
              <>
                <button
                  onClick={() => setHrView('DASHBOARD')} // Use string literal
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                    hrView === 'DASHBOARD' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Recruit
                </button>
                <button
                  onClick={() => setHrView('TOP_TALENT')} // Use string literal
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg flex items-center gap-2 ${
                    hrView === 'TOP_TALENT' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                  Top Matches
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors group"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{user.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 group-hover:border-blue-300">
              {user.name.charAt(0)}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Signed in as</div>
                <div className="text-sm font-bold text-slate-900 truncate">{user.email}</div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setShowProfile(false); onLogout(); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
