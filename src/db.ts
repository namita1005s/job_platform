import type { Job, Application, User } from './types';

const STORAGE_KEYS = {
  JOBS: 'hirestream_jobs',
  APPLICATIONS: 'hirestream_applications',
  USERS: 'hirestream_users',
  SESSION_TOKEN: 'hirestream_token',
  SEEDED: 'hirestream_seeded_v3'
};

class LocalDB {
  // --- Auth & Users ---
  
  public async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async registerUser(user: User): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  public setSession(token: string): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
  }

  public getSession(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  public clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  // --- Jobs Table ---
  
  public async getJobs(): Promise<Job[]> {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((j: any) => ({ 
        ...j, 
        postedAt: new Date(j.postedAt) 
      }));
    } catch {
      return [];
    }
  }

  public async insertJob(job: Job): Promise<void> {
    const jobs = await this.getJobs();
    jobs.unshift(job);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }

  public async updateJob(updatedJob: Job): Promise<void> {
    const jobs = await this.getJobs();
    const index = jobs.findIndex(j => j.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = updatedJob;
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
  }

  // --- Applications Table ---

  public async getApplications(): Promise<Application[]> {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((a: any) => ({ 
        ...a, 
        appliedAt: new Date(a.appliedAt) 
      }));
    } catch {
      return [];
    }
  }

  public async insertApplication(app: Application): Promise<void> {
    const apps = await this.getApplications();
    apps.push(app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  }

  public async updateApplications(updatedApps: Application[]): Promise<void> {
    const allApps = await this.getApplications();
    const map = new Map(updatedApps.map(app => [app.id, app]));
    const finalApps = allApps.map(app => map.has(app.id) ? map.get(app.id)! : app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(finalApps));
  }

  public async seed(initialJobs: Job[]): Promise<void> {
    const hasSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
    if (!hasSeeded) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
      localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
    }
  }
}

export const db = new LocalDB();