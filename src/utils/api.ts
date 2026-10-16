import { ContentDatabase, Enquiry, EnquiryStatus } from '../types';
import { initialData } from '../data/initialData';

// Base API URL: uses environment variable if defined, or falls back to same-origin relative path
const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getEndpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (res.status === 405) {
      throw new Error(
        'Server returned 405 (Method Not Allowed). On static hosting such as GitHub Pages, backend Node.js POST endpoints are not executed. Connect an external backend server using VITE_API_BASE_URL or use preview credentials.'
      );
    }

    if (res.status === 404) {
      throw new Error(
        'Backend service endpoint unavailable on this static deployment (404). For direct inquiries, message us on WhatsApp (+8801674451806) or email info@topsparkdigital.com.'
      );
    }

    let errorMsg = `Server error (${res.status})`;
    if (isJson) {
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorData.message || errorMsg;
      } catch {
        // Fallback
      }
    } else {
      const text = await res.text();
      if (text && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
        errorMsg = text.slice(0, 150);
      }
    }
    throw new Error(errorMsg);
  }

  if (isJson) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export const api = {
  // Public: Get published website content
  async getContent(): Promise<ContentDatabase> {
    const res = await fetch(getEndpoint('/api/content'), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<ContentDatabase>(res);
  },

  // Public: Submit project inquiry
  async submitEnquiry(data: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    service: string;
    budget?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; enquiryId?: string; emailStatus?: string }> {
    const res = await fetch(getEndpoint('/api/enquiries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Admin: Login
  async login(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    token: string;
    user: { id: string; username: string; role: string };
    mode?: 'live' | 'preview';
  }> {
    try {
      const res = await fetch(getEndpoint('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return await handleResponse(res);
    } catch (err: any) {
      // If deployed on static hosting (e.g. GitHub Pages) where POST endpoints return 405 Method Not Allowed or 404
      const isStaticHosting =
        err?.message?.includes('405') ||
        err?.message?.includes('404') ||
        (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io'));

      if (isStaticHosting) {
        const cleanUser = username.trim().toLowerCase();
        // Allow demonstration preview login on static hosts with default admin credentials
        if (cleanUser === 'info@topsparkdigital.com' && (password === 'adminadmin' || password === 'admin')) {
          const previewToken = 'preview-token-' + btoa(JSON.stringify({ u: cleanUser, r: 'admin', t: Date.now() }));
          return {
            success: true,
            token: previewToken,
            user: { id: 'admin-preview', username: cleanUser, role: 'admin' },
            mode: 'preview',
          };
        }
      }

      throw err;
    }
  },

  // Admin: Logout
  async logout(token: string): Promise<{ success: boolean }> {
    if (token.startsWith('preview-token-')) {
      return { success: true };
    }
    const res = await fetch(getEndpoint('/api/auth/logout'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return handleResponse(res);
  },

  // Admin: Get all inquiries
  async getEnquiries(token: string): Promise<{ enquiries: Enquiry[] }> {
    if (token.startsWith('preview-token-')) {
      const stored = localStorage.getItem('topspark_preview_enquiries');
      return { enquiries: stored ? JSON.parse(stored) : [] };
    }
    const res = await fetch(getEndpoint('/api/admin/enquiries'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return handleResponse(res);
  },

  // Admin: Update enquiry status/notes
  async updateEnquiry(
    id: string,
    status: EnquiryStatus,
    notes: string | undefined,
    token: string
  ): Promise<{ success: boolean; enquiry: Enquiry }> {
    const res = await fetch(getEndpoint(`/api/admin/enquiries/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(res);
  },

  // Admin: Delete enquiry
  async deleteEnquiry(id: string, token: string): Promise<{ success: boolean }> {
    const res = await fetch(getEndpoint(`/api/admin/enquiries/${id}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return handleResponse(res);
  },

  // Admin: Get full content including drafts
  async getAdminContent(token: string): Promise<ContentDatabase> {
    if (token.startsWith('preview-token-')) {
      return initialData;
    }
    const res = await fetch(getEndpoint('/api/admin/content'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return handleResponse<ContentDatabase>(res);
  },

  // Admin: Update site content
  async updateAdminContent(
    content: Partial<ContentDatabase>,
    token: string
  ): Promise<{ success: boolean; content: ContentDatabase }> {
    if (token.startsWith('preview-token-')) {
      return { success: true, content: { ...initialData, ...content } };
    }
    const res = await fetch(getEndpoint('/api/admin/content'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(content),
    });
    return handleResponse(res);
  },

  // Admin: Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    if (token.startsWith('preview-token-')) {
      return { success: true, message: 'Password updated successfully in preview session.' };
    }
    const res = await fetch(getEndpoint('/api/admin/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  // System Diagnostics
  async getHealth(): Promise<any> {
    try {
      const res = await fetch(getEndpoint('/api/health'), {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(res);
    } catch {
      return {
        status: 'preview',
        timestamp: new Date().toISOString(),
        database: { servicesCount: 6, caseStudiesCount: 6, productsCount: 2, clientsCount: 7, enquiriesCount: 0 },
        smtp: { configured: false, host: 'Not set (Preview Mode)', port: 587, userConfigured: false, destination: 'info@topsparkdigital.com' },
      };
    }
  },
};
