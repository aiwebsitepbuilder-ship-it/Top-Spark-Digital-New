import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, verifyPassword } from './db';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const SECRET_KEY = process.env.SESSION_SECRET || 'top-spark-secret-signing-key-2026';

interface SessionData {
  userId: string;
  username: string;
  role: string;
  expiresAt: number;
}

// In-memory active sessions map (backed by HMAC signed token)
const activeSessions = new Map<string, SessionData>();

// Simple login rate limiting
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 10;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;

  if (now - record.firstAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return true;
  }

  return record.count < MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

export function resetAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export function createSession(userId: string, username: string, role: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ userId, username, role, expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  const token = `${payload}.${signature}`;

  activeSessions.set(token, {
    userId,
    username,
    role,
    expiresAt,
  });
  return token;
}

export function verifySession(token: string): SessionData | null {
  if (!token) return null;

  // 1. Check in-memory active cache
  const cached = activeSessions.get(token);
  if (cached) {
    if (Date.now() > cached.expiresAt) {
      activeSessions.delete(token);
      return null;
    }
    return cached;
  }

  // 2. Cryptographic fallback (persists across server restarts)
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadBase64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadBase64).digest('hex');
    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8')) as SessionData;
    if (Date.now() > data.expiresAt) return null;

    // Cache back in activeSessions
    activeSessions.set(token, data);
    return data;
  } catch {
    return null;
  }
}

export function destroySession(token: string) {
  activeSessions.delete(token);
}

// Express Auth Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session invalid or expired. Please log in again.' });
  }

  (req as any).user = session;
  next();
}
