import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initialData } from '../data/initialData';
import { ContentDatabase, Enquiry, EnquiryStatus } from '../types';

export interface AdminUserRecord {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AppDatabaseState {
  version: number;
  content: ContentDatabase;
  enquiries: Enquiry[];
  adminUsers: AdminUserRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app_data.json');

// Password hashing utility using Node.js crypto.scryptSync
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hashBuffer = crypto.scryptSync(password, generatedSalt, 64);
  return {
    hash: hashBuffer.toString('hex'),
    salt: generatedSalt,
  };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const candidateHash = hashBuffer.toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

class DatabaseService {
  private state: AppDatabaseState;

  constructor() {
    this.ensureDataDir();
    this.state = this.loadOrCreate();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadOrCreate(): AppDatabaseState {
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'adminadmin';
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'info@topsparkdigital.com';

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: AppDatabaseState = JSON.parse(raw);

        // Ensure database state has admin users array
        if (!parsed.adminUsers || parsed.adminUsers.length === 0) {
          const { hash, salt } = hashPassword(defaultAdminPassword);
          parsed.adminUsers = [
            {
              id: 'admin-' + crypto.randomBytes(4).toString('hex'),
              username: defaultAdminEmail,
              passwordHash: hash,
              salt: salt,
              role: 'admin',
              createdAt: new Date().toISOString(),
            },
          ];
          this.persistSync(parsed);
        } else if (process.env.ADMIN_PASSWORD) {
          // If ADMIN_PASSWORD is explicitly set via environment, ensure admin user is synced
          const mainAdmin = parsed.adminUsers[0];
          const { hash, salt } = hashPassword(process.env.ADMIN_PASSWORD);
          if (mainAdmin.passwordHash !== hash) {
            mainAdmin.passwordHash = hash;
            mainAdmin.salt = salt;
            if (process.env.ADMIN_EMAIL) mainAdmin.username = process.env.ADMIN_EMAIL;
            this.persistSync(parsed);
          }
        }

        return parsed;
      } catch (err) {
        console.error('Failed to parse existing database file, creating fresh backup:', err);
      }
    }

    // Initialize fresh database state
    const { hash, salt } = hashPassword(defaultAdminPassword);

    const freshState: AppDatabaseState = {
      version: 1,
      content: initialData,
      enquiries: [],
      adminUsers: [
        {
          id: 'admin-' + crypto.randomBytes(4).toString('hex'),
          username: defaultAdminEmail,
          passwordHash: hash,
          salt: salt,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    this.persistSync(freshState);
    return freshState;
  }

  private persistSync(state: AppDatabaseState) {
    this.ensureDataDir();
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  private save() {
    this.persistSync(this.state);
  }

  // Enquiries Operations
  public addEnquiry(enquiry: Omit<Enquiry, 'id' | 'submittedAt' | 'status'>): Enquiry {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    this.state.enquiries.unshift(newEnquiry);
    this.save();
    return newEnquiry;
  }

  public getEnquiries(): Enquiry[] {
    return this.state.enquiries;
  }

  public getEnquiryById(id: string): Enquiry | undefined {
    return this.state.enquiries.find((e) => e.id === id);
  }

  public updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Enquiry | null {
    const enquiry = this.state.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;
    enquiry.status = status;
    if (notes !== undefined) {
      enquiry.notes = notes;
    }
    this.save();
    return enquiry;
  }

  public markEnquiryEmailSent(id: string, sent: boolean) {
    const enquiry = this.state.enquiries.find((e) => e.id === id);
    if (enquiry) {
      enquiry.emailSent = sent;
      this.save();
    }
  }

  public deleteEnquiry(id: string): boolean {
    const initialLength = this.state.enquiries.length;
    this.state.enquiries = this.state.enquiries.filter((e) => e.id !== id);
    const deleted = this.state.enquiries.length < initialLength;
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  // Content Operations
  public getContent(): ContentDatabase {
    return this.state.content;
  }

  public updateContent(updatedContent: Partial<ContentDatabase>): ContentDatabase {
    this.state.content = {
      ...this.state.content,
      ...updatedContent,
    };
    this.save();
    return this.state.content;
  }

  // Admin User & Auth Operations
  public findUserByUsername(username: string): AdminUserRecord | undefined {
    const clean = username.trim().toLowerCase();
    return this.state.adminUsers.find((u) => {
      const uLower = u.username.toLowerCase();
      return (
        uLower === clean ||
        (clean === 'admin' && u.role === 'admin') ||
        (clean === 'admin@topsparkdigital.com' && uLower === 'info@topsparkdigital.com') ||
        (clean === 'info@topsparkdigital.com' && uLower === 'admin@topsparkdigital.com')
      );
    });
  }

  public updateLastLogin(userId: string) {
    const user = this.state.adminUsers.find((u) => u.id === userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.save();
    }
  }

  public updateAdminPassword(userId: string, newPassword: string):boolean {
    const user = this.state.adminUsers.find((u) => u.id === userId);
    if (!user) return false;
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    this.save();
    return true;
  }
}

export const db = new DatabaseService();
