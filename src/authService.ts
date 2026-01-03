import { UserRole } from './types';
import type { User } from './types';
import { db } from './db';

const generateToken = (user: User) => btoa(JSON.stringify({ ...user, iat: Date.now() }));
const parseToken = (token: string): User | null => {
  try { return JSON.parse(atob(token)); } catch { return null; }
};

export const authService = {
  async signup(name: string, email: string, password: string, role: UserRole): Promise<string> {
    const existing = await db.findUserByEmail(email);
    if (existing) throw new Error("Email already registered");
    const user: User = { id: Math.random().toString(36).substr(2, 9), name, email, password, role };
    await db.registerUser(user);
    const token = generateToken(user);
    db.setSession(token);
    return token;
  },

  async login(email: string, password: string): Promise<string> {
    const user = await db.findUserByEmail(email);
    if (!user || user.password !== password) throw new Error("Invalid email or password");
    const token = generateToken(user);
    db.setSession(token);
    return token;
  },

  logout() { db.clearSession(); },

  getCurrentUser(): User | null {
    const token = db.getSession();
    return token ? parseToken(token) : null;
  }
};