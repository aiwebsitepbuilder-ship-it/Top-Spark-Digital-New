import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, verifyPassword } from './src/server/db';
import { emailService } from './src/server/email';
import {
  requireAdminAuth,
  createSession,
  destroySession,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from './src/server/auth';
import { EnquiryStatus } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with safe payload limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Trust proxy for IP checking behind Cloud Run / reverse proxies
app.set('trust proxy', 1);

// Security Headers middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// --- API ROUTES ---

// Health & Diagnostic Status
app.get('/api/health', (_req, res) => {
  const content = db.getContent();
  const enquiries = db.getEnquiries();
  const smtpStatus = emailService.getStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      servicesCount: content.services.length,
      caseStudiesCount: content.caseStudies.length,
      productsCount: content.products.length,
      clientsCount: content.clients.length,
      enquiriesCount: enquiries.length,
    },
    smtp: smtpStatus,
  });
});

// Public: Get site content
app.get('/api/content', (_req, res) => {
  try {
    const content = db.getContent();
    // Return sanitized public view (drafts filtered out for unauthenticated visitors)
    const publicContent = {
      settings: content.settings,
      services: content.services.filter((s) => s.featuredInHome || true),
      caseStudies: content.caseStudies.filter((c) => c.status === 'published'),
      products: content.products.filter((p) => p.status === 'published'),
      clients: content.clients.filter((c) => c.published),
      testimonials: content.testimonials.filter((t) => t.published),
      teamMembers: content.teamMembers.filter((t) => t.published),
      // Blog posts remain hidden if settings.blogPubliclyEnabled is false
      blogPosts: content.settings.blogPubliclyEnabled
        ? content.blogPosts.filter((b) => b.status === 'published')
        : [],
    };
    res.json(publicContent);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch content';
    res.status(500).json({ error: errorMsg });
  }
});

// Public: Submit Contact Enquiry
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, company, phone, email, service, budget, message } = req.body;

    // Strict Server-side Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number.' });
    }

    if (!service || typeof service !== 'string' || service.trim().length === 0) {
      return res.status(400).json({ error: 'Please select a requested service.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a project description message (at least 5 characters).' });
    }

    // Persist enquiry in database FIRST (ensures zero data loss)
    const savedEnquiry = db.addEnquiry({
      name: name.trim().slice(0, 200),
      company: (company || '').trim().slice(0, 200),
      phone: phone.trim().slice(0, 60),
      email: email.trim().toLowerCase().slice(0, 200),
      service: service.trim().slice(0, 100),
      budget: (budget || '').trim().slice(0, 100),
      message: message.trim().slice(0, 4000),
    });

    // Attempt SMTP delivery asynchronously in background
    let emailStatus = 'pending';
    try {
      const emailResult = await emailService.sendEnquiryNotification(savedEnquiry);
      if (emailResult.success) {
        db.markEnquiryEmailSent(savedEnquiry.id, true);
        emailStatus = 'sent';
      } else {
        emailStatus = 'queued_unconfigured';
      }
    } catch (emailErr) {
      console.error('[API] Non-blocking email delivery failure:', emailErr);
      emailStatus = 'failed';
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received by Top Spark Digital.',
      enquiryId: savedEnquiry.id,
      emailStatus,
    });
  } catch (err: unknown) {
    console.error('[API] Enquiry submission error:', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again.' });
  }
});

// Admin: Login
app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.findUserByUsername(username);
  if (!user) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  resetAttempts(ip);
  db.updateLastLogin(user.id);
  const token = createSession(user.id, user.username, user.role);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

// Admin: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    destroySession(token);
  }
  res.json({ success: true });
});

// Admin: Check Current Session
app.get('/api/auth/me', requireAdminAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

// Admin: Get all inquiries (protected)
app.get('/api/admin/enquiries', requireAdminAuth, (_req, res) => {
  const enquiries = db.getEnquiries();
  res.json({ enquiries });
});

// Admin: Update enquiry status & notes (protected)
app.patch('/api/admin/enquiries/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses: EnquiryStatus[] = ['New', 'In Progress', 'Contacted', 'Closed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  const updated = db.updateEnquiryStatus(id, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  res.json({ success: true, enquiry: updated });
});

// Admin: Delete enquiry (protected)
app.delete('/api/admin/enquiries/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteEnquiry(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }
  res.json({ success: true });
});

// Admin: Get full unredacted content (including drafts)
app.get('/api/admin/content', requireAdminAuth, (_req, res) => {
  res.json(db.getContent());
});

// Admin: Update content database (protected)
app.put('/api/admin/content', requireAdminAuth, (req, res) => {
  try {
    const updatedContent = req.body;
    const result = db.updateContent(updatedContent);
    res.json({ success: true, content: result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update content';
    res.status(500).json({ error: errorMsg });
  }
});

// Admin: Change password
app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const adminUser = db.findUserByUsername(user.username);
  if (!adminUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const isValid = verifyPassword(currentPassword, adminUser.passwordHash, adminUser.salt);
  if (!isValid) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  db.updateAdminPassword(adminUser.id, newPassword);
  res.json({ success: true, message: 'Password updated successfully.' });
});

// --- STATIC ASSETS & VITE INTEGRATION ---

async function startServer() {
  const httpServer = http.createServer(app);

  if (!isProduction) {
    // Development Mode: Use Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve static build from dist directory
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Top Spark Digital] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
