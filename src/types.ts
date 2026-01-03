// Complete types with string unions and constants

// Add these two lines at the top:
export type HRView = 'DASHBOARD' | 'TOP_TALENT';
export type CandidateView = 'BROWSE' | 'APPLICATIONS';

// User roles
export const UserRole = {
  CANDIDATE: 'CANDIDATE',
  HR: 'HR'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Application status
export const ApplicationStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEWING: 'INTERVIEWING',
  REJECTED: 'REJECTED',
  OFFERED: 'OFFERED',
  HIRED: 'HIRED'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

// Employment types
export const EmploymentType = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid'
} as const;

export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];

// Experience levels
export const ExperienceLevel = {
  ENTRY: 'Entry',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive'
} as const;

export type ExperienceLevel = typeof ExperienceLevel[keyof typeof ExperienceLevel];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for local DB simulation
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Job {
  id: string;
  creatorId: string; // ID of the HR who posted the job
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  postedAt: Date;
  isActive?: boolean; // Whether job is still accepting applications
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
}

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  resumeText: string;
  resumeBase64?: string; // The Base64 encoded PDF string
  resumeFileName?: string;
  skills?: string[];
  appliedAt: Date;
  status?: ApplicationStatus; // Track application status
  aiScore?: number;
  aiFeedback?: string;
  viewedAt?: Date; // When HR viewed the application
  notes?: string; // HR notes on the application
}

export interface AIRecommendation {
  applicationId: string;
  score: number;
  feedback: string;
  strengths?: string[]; // Key strengths identified
  weaknesses?: string[]; // Areas for improvement
  recommendedActions?: string[]; // Suggested next steps
}

// For dashboard stats
export interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
  averageAiScore: number;
  topSkills: string[];
}