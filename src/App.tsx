import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { CaseStudyDetailPage } from './pages/CaseStudyDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { initialData } from './data/initialData';
import { ContentDatabase } from './types';
import { api } from './utils/api';

// Universal Path Normalization Helper
// Works seamlessly on root domains (topsparkdigital.com), subpaths (/repo-name/), and hash fallback (/ #/...)
function getNormalizedPath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check for Hash-based routing: /#/services or #/services
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#/, '');
    if (rawHash.startsWith('/')) {
      const cleanHash = rawHash.split('?')[0];
      return cleanHash;
    }
  }

  // 2. Extract pathname
  let path = window.location.pathname || '/';

  // 3. Strip base URL if deployed with a Vite base path (e.g. /my-repo/)
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (baseUrl && baseUrl !== '/' && baseUrl !== '.' && path.startsWith(baseUrl)) {
    path = path.slice(baseUrl.length);
  } else if (typeof window.location.hostname === 'string' && window.location.hostname.endsWith('github.io')) {
    // Automatic GitHub Pages repository subpath detection
    // e.g. /my-repo/services -> /services
    const segments = path.split('/').filter(Boolean);
    const knownRoutes = ['services', 'case-studies', 'products', 'about', 'contact', 'admin', 'privacy', 'terms'];
    if (segments.length > 0 && !knownRoutes.includes(segments[0])) {
      path = '/' + segments.slice(1).join('/');
    }
  }

  path = path.replace(/\/index\.html$/i, '/').replace(/\/index$/i, '/');
  if (!path || path === '' || path === '/home') return '/';
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => getNormalizedPath());
  const [data, setData] = useState<ContentDatabase>(initialData);

  // Sync with browser back/forward buttons and hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch updated content from backend
  useEffect(() => {
    api
      .getContent()
      .then((serverContent) => {
        if (serverContent && typeof serverContent === 'object' && Array.isArray(serverContent.services)) {
          setData((prev) => ({
            ...prev,
            ...serverContent,
            settings: serverContent.settings || prev.settings,
            services: serverContent.services || prev.services,
            caseStudies: serverContent.caseStudies || prev.caseStudies,
            products: serverContent.products || prev.products,
            clients: serverContent.clients || prev.clients,
            testimonials: serverContent.testimonials || prev.testimonials,
            teamMembers: serverContent.teamMembers || prev.teamMembers,
            blogPosts: serverContent.blogPosts || prev.blogPosts,
          }));
        }
      })
      .catch((err) => {
        // Silently use bundled initialData if server is compiling, starting, or in static hosting mode
        console.log('[Client] Active bundled initialData available:', err?.message || 'offline');
      });
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    // Handle in-page hash anchors
    if (path.includes('#') && !path.startsWith('/#')) {
      const hash = path.split('#')[1];
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const cleanPath = path.split('#')[0].split('?')[0] || '/';
    setCurrentPath(cleanPath);

    // Maintain subpath prefix if running under a custom base
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    let pushUrl = path;
    if (baseUrl && baseUrl !== '/' && baseUrl !== '.' && !path.startsWith(baseUrl)) {
      pushUrl = `${baseUrl}${path}`;
    }

    try {
      window.history.pushState({}, '', pushUrl);
    } catch {
      // Fallback for strict sandbox iframe / file protocol
      window.location.hash = '#' + path;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Route Resolution
  const renderCurrentPage = () => {
    // 1. Admin Dashboard Route
    if (currentPath === '/admin') {
      return <AdminDashboard onNavigateHome={() => handleNavigate('/')} />;
    }

    // 2. Case Study Detail Route: /case-studies/:slug
    if (currentPath.startsWith('/case-studies/')) {
      const slug = currentPath.replace('/case-studies/', '');
      return (
        <CaseStudyDetailPage
          slug={slug}
          data={data}
          onNavigate={handleNavigate}
        />
      );
    }

    // 3. Main Pages
    switch (currentPath) {
      case '/':
        return <HomePage data={data} onNavigate={handleNavigate} />;
      case '/services':
        return <ServicesPage data={data} onNavigate={handleNavigate} />;
      case '/case-studies':
        return <CaseStudiesPage data={data} onNavigate={handleNavigate} />;
      case '/products':
        return <ProductsPage data={data} onNavigate={handleNavigate} />;
      case '/about':
        return <AboutPage data={data} onNavigate={handleNavigate} />;
      case '/contact':
        return <ContactPage data={data} />;
      case '/privacy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case '/terms':
        return <TermsPage onNavigate={handleNavigate} />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  const isAdminRoute = currentPath === '/admin';

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-[#6A22F2] selection:text-white">
      {/* Hide public header on private admin login/dashboard */}
      {!isAdminRoute && (
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
      )}

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Hide public footer on private admin dashboard */}
      {!isAdminRoute && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Floating WhatsApp chat button on all public pages */}
      {!isAdminRoute && (
        <FloatingWhatsApp phoneNumber="+8801674451806" />
      )}
    </div>
  );
}
