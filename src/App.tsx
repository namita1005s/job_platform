import React, { useState, useEffect, useCallback } from 'react';
import { UserRole } from './types';
import type { Job, Application, User, HRView, CandidateView } from './types';
import Header from './components/Header';
import CandidateDashboard from './components/CandidateDashboard';
import CandidateApplications from './components/CandidateApplications';
import HRDashboard from './components/HRDashboard';
import TopTalentView from './components/TopTalentView';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import { db } from './db';
import { authService } from './authService';

const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    creatorId: 'system',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    description: 'We are looking for a React expert to build our next-generation cloud dashboard.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', '5+ years experience'],
    location: 'Remote / San Francisco',
    salary: '$140k - $180k',
    postedAt: new Date(),
  },
  {
    id: '2',
    creatorId: 'system',
    title: 'AI Product Manager',
    company: 'Neural Labs',
    description: 'Lead our GenAI product strategy and work closely with engineering teams.',
    requirements: ['Product Management', 'LLM Knowledge', 'Agile', 'Strategy'],
    location: 'New York',
    salary: '$160k - $210k',
    postedAt: new Date(),
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [isViewingInfo, setIsViewingInfo] = useState(false);
  const [hrView, setHrView] = useState<HRView>('DASHBOARD');
  const [candidateView, setCandidateView] = useState<CandidateView>('BROWSE');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const initData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    
    try {
      await db.seed(INITIAL_JOBS);
      const [loadedJobs, loadedApps] = await Promise.all([
        db.getJobs(),
        db.getApplications()
      ]);
      const user = authService.getCurrentUser();
      
      setJobs(loadedJobs);
      setApplications(loadedApps);
      setCurrentUser(user);
      
      // Set default selected job for HR users
      if (user?.role === UserRole.HR && loadedJobs.length > 0) {
        setSelectedJobId(prev => prev || loadedJobs[0].id);
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleApply = async (jobId: string, candidateData: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => {
    try {
      const newApp: Application = {
        ...candidateData,
        id: crypto.randomUUID(),
        jobId,
        appliedAt: new Date(),
      };
      await db.insertApplication(newApp);
      setApplications(prev => [...prev, newApp]);
    } catch (error) {
      console.error('Failed to apply for job:', error);
      throw error;
    }
  };

  const handlePostJob = async (newJob: Omit<Job, 'id' | 'postedAt' | 'creatorId'>) => {
    if (!currentUser) return;
    
    try {
      const job: Job = {
        ...newJob,
        id: crypto.randomUUID(),
        creatorId: currentUser.id,
        postedAt: new Date(),
      };
      await db.insertJob(job);
      setJobs(prev => [job, ...prev]);
      setSelectedJobId(job.id);
    } catch (error) {
      console.error('Failed to post job:', error);
      throw error;
    }
  };

  const handleUpdateJob = async (updatedJob: Job) => {
    if (currentUser?.role !== UserRole.HR) return;
    
    try {
      await db.updateJob(updatedJob);
      setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  };

  const handleUpdateApplications = async (updatedApps: Application[]) => {
    try {
      await db.updateApplications(updatedApps);
      const updatedMap = new Map(updatedApps.map(a => [a.id, a]));
      setApplications(prev => prev.map(app => updatedMap.has(app.id) ? updatedMap.get(app.id)! : app));
    } catch (error) {
      console.error('Failed to update applications:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthMode(null);
    setIsViewingInfo(false);
    setSelectedJobId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading HireStream AI...</p>
        </div>
      </div>
    );
  }

  // Show landing page if viewing info or not logged in
  if (isViewingInfo || (!currentUser && !authMode)) {
    return (
      <LandingPage 
        onAuth={(mode) => setAuthMode(mode)} 
        isLoggedIn={!!currentUser}
        onBackToDashboard={() => setIsViewingInfo(false)}
      />
    );
  }

  // Show auth page if auth mode is set
  if (!currentUser && authMode) {
    return (
      <AuthPage 
        initialMode={authMode} 
        onAuthSuccess={() => { 
          initData(false); 
          setAuthMode(null); 
        }} 
      />
    );
  }

  // Safety check - should not happen but handles edge cases
  if (!currentUser) {
    return (
      <LandingPage 
        onAuth={(mode) => setAuthMode(mode)} 
        isLoggedIn={false}
        onBackToDashboard={() => setIsViewingInfo(false)}
      />
    );
  }

  const renderContent = () => {
    if (currentUser.role === UserRole.CANDIDATE) {
      if (candidateView === 'APPLICATIONS') {
        return (
          <CandidateApplications 
            applications={applications} 
            jobs={jobs} 
            currentUser={currentUser} 
            onGoToBrowse={() => setCandidateView('BROWSE')} 
          />
        );
      }
      return (
        <CandidateDashboard 
          jobs={jobs} 
          currentUser={currentUser} 
          onApply={handleApply} 
          onRefresh={() => initData(false)} 
        />
      );
    }

    if (currentUser.role === UserRole.HR) {
      if (hrView === 'DASHBOARD') {
        return (
          <HRDashboard 
            jobs={jobs} 
            applications={applications} 
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            onPostJob={handlePostJob}
            onUpdateJob={handleUpdateJob}
            onUpdateApplications={handleUpdateApplications}
          />
        );
      }

      return (
        <TopTalentView 
          jobs={jobs} 
          applications={applications}
          currentUser={currentUser}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        user={currentUser}
        onLogout={handleLogout}
        hrView={hrView}
        setHrView={setHrView}
        candidateView={candidateView}
        setCandidateView={setCandidateView}
        onShowAbout={() => setIsViewingInfo(true)}
      />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        {renderContent()}
      </main>
      <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200">
        <p>© {new Date().getFullYear()} HireStream AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;