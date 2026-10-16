# Top Spark Digital — Production Website

Modern, dark, cinematic full-stack agency website for **Top Spark Digital** (`https://topsparkdigital.com/`), an established Bangladesh-based digital marketing, content production, and technology agency.

---

## 1. Business Information & Truth Authority

- **Brand:** Top Spark Digital
- **Domain:** `https://topsparkdigital.com/`
- **Location:** Bangladesh
- **Office Address:** 131/2 A, Mirpur-1, Dhaka
- **Phone & WhatsApp:** +8801674451806
- **Business Email:** info@topsparkdigital.com
- **Primary Positioning:** *"We Turn Businesses Into Digital Brands."*
- **Supporting Positioning:** *"Strategy, content, technology and execution — built around your business goals."*

> **Subdomain Protection Notice:**  
> The owner's separate existing website at **`https://dnm.topsparkdigital.com/`** (Dhaka Night Market) is an independent project and must remain completely untouched during all deployments.

---

## 2. Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Plus Jakarta Sans typography.
- **Backend:** Express full-stack API server (`server.ts`) with Vite dev middleware in development and static asset delivery in production.
- **Database & Persistence:**
  - ACID atomic file-backed persistent database (`src/server/db.ts`) storing enquiries, content, client records, and admin credentials in `/data/app_data.json`.
  - ANSI SQL schema provided in `/database/schema.sql` for MySQL/MariaDB deployments on Hostinger or VPS.
- **Security:**
  - Secure password hashing using Node.js `crypto.scryptSync` with cryptographic salts.
  - Constant-time verification (`crypto.timingSafeEqual`) against timing attacks.
  - Session tokens with 24-hour expiration.
  - Rate limiting against brute-force login attempts (5 attempts per 15-minute window).
  - Server-side validation and sanitization on all inquiry submissions.
- **Email Delivery:**
  - Integrated `nodemailer` SMTP client targeting `info@topsparkdigital.com`.
  - Fail-safe queueing: all inquiries are stored safely in the database *before* SMTP dispatch is attempted.
- **SEO & AEO:**
  - Fully qualified canonical URLs (`https://topsparkdigital.com/`).
  - Open Graph and Twitter Card metadata.
  - Schema.org JSON-LD structured data (`Organization`, `ProfessionalService`, `LocalBusiness`).
  - XML Sitemap (`/public/sitemap.xml`) and `robots.txt` (`/public/robots.txt`).

---

## 3. Implemented Routes & Capabilities

1. **Home (`/`)**:
   - Section 1: Hero with bold positioning, CTAs, and studio production visual showcase.
   - Section 2: Trust strip featuring confirmed clients (Aalo, GrowUp, The Royal Valley, The Law Matter, Voice Sending, DrWala, Tech Den).
   - Section 3: Services overview (Social Media, Content Creation, Photography/Videography, Google Business Profile, SEO & AEO, Digital Solutions).
   - Section 4: Featured case studies with editorial cards.
   - Section 5: Why Top Spark (6 core agency principles).
   - Section 6: Digital products (Voice Sending & E-commerce Website Solution).
   - Section 7: How We Work (4-step refined methodology).
   - Section 8: Execution evidence & qualitative agency showcase.
   - Section 9: Testimonials (conditionally hidden until approved by owner).
   - Section 10: About & studio preview (Mirpur-1 operations).
   - Section 11: Blog infrastructure (kept in draft/hidden state until owner enables).
   - Section 12: Final conversion CTA.
   - Section 13: Footer with full business contact, WhatsApp link, and legal drafts.
2. **Services (`/services`)**: In-depth breakdowns of all 6 capabilities, deliverables, and business fit.
3. **Case Studies (`/case-studies`)**: Filterable portfolio with industry filters.
4. **Case Study Detail (`/case-studies/:slug`)**: Dedicated detail pages for every project (The Law Matter, Voice Sending, Aalo, GrowUp, DrWala, The Royal Valley).
5. **Products (`/products`)**: Dedicated product pages for Voice Sending and E-commerce Website Solution.
6. **About (`/about`)**: Agency story, studio capabilities, operational pillars.
7. **Contact (`/contact`)**: Validated inquiry form, office details, direct WhatsApp link.
8. **Admin Dashboard (`/admin`)**: Protected portal with session authentication, inquiry management, content editing, draft controls, and SMTP status checks.
9. **Legal Drafts (`/privacy`, `/terms`)**: Transparent draft legal notices for agency operations.
10. **404 Not Found**: Branded 404 page.

---

## 4. Development & Build Commands

```bash
# Start full-stack development server on port 3000
npm run dev

# Build production assets for deployment
npm run build

# Run TypeScript typechecks
npm run lint

# Start production server
npm start
```

---

## 5. Deployment & Disaster Recovery

- See **`HOSTINGER_DEPLOYMENT_GUIDE.md`** for step-by-step instructions for Hostinger VPS, Cloud, and Shared hosting plans.
- See **`BACKUP_AND_RECOVERY_GUIDE.md`** for backup retention and disaster recovery protocols.

---

## 6. Admin Portal Credentials

- **URL:** `https://topsparkdigital.com/admin`
- **Admin Email:** `info@topsparkdigital.com`
- **Default Password:** `adminadmin`

