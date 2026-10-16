import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Mail,
  FolderKanban,
  Briefcase,
  Layers,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Key,
  ShieldAlert,
  Server,
  RefreshCw,
} from 'lucide-react';
import { ContentDatabase, Enquiry, EnquiryStatus, CaseStudy } from '../types';
import { api } from '../utils/api';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('topspark_admin_token'));
  const [username, setUsername] = useState('info@topsparkdigital.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'enquiries' | 'caseStudies' | 'clients' | 'settings' | 'diagnostics'>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');
  const [statusLoading, setStatusLoading] = useState(false);

  // Content state
  const [content, setContent] = useState<ContentDatabase | null>(null);
  const [contentSaveSuccess, setContentSaveSuccess] = useState(false);

  // Diagnostics & SMTP State
  const [diagnostics, setDiagnostics] = useState<any>(null);

  // Change password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch data on login
  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const fetchAdminData = async (authToken: string) => {
    try {
      // 1. Fetch Enquiries
      const enqData = await api.getEnquiries(authToken);
      if (enqData.enquiries) setEnquiries(enqData.enquiries);

      // 2. Fetch Content
      const contentData = await api.getAdminContent(authToken);
      setContent(contentData);

      // 3. Fetch Diagnostics
      const diagData = await api.getHealth();
      setDiagnostics(diagData);
    } catch (err: unknown) {
      console.error('Failed to load admin data:', err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401') || msg.includes('Authentication') || msg.includes('Session')) {
        handleLogout();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const data = await api.login(username, password);

      localStorage.setItem('topspark_admin_token', data.token);
      setToken(data.token);
      setPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials.';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (token) {
      api.logout(token).catch(() => {});
    }
    localStorage.removeItem('topspark_admin_token');
    setToken(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: EnquiryStatus, notes?: string) => {
    if (!token) return;
    setStatusLoading(true);
    try {
      const data = await api.updateEnquiry(id, newStatus, notes, token);
      if (data.success && data.enquiry) {
        setEnquiries((prev) => prev.map((e) => (e.id === id ? data.enquiry : e)));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(data.enquiry);
        }
      }
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!token || !confirm('Are you sure you want to securely delete this inquiry record?')) return;
    try {
      await api.deleteEnquiry(id, token);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const handleSaveContent = async () => {
    if (!token || !content) return;
    setContentSaveSuccess(false);
    try {
      await api.updateAdminContent(content, token);
      setContentSaveSuccess(true);
      setTimeout(() => setContentSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save content modifications.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPwMessage(null);

    try {
      await api.changePassword(currentPw, newPw, token);
      setPwMessage({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPw('');
      setNewPw('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password.';
      setPwMessage({ type: 'error', text: msg });
    }
  };

  // If not logged in, show secure login interface
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0E1017] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Top Spark Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Authorized personnel only. Protected by server session authentication and rate limiting.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-purple-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-900/30"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.06] text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to public website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered enquiries
  const filteredEnquiries =
    enquiryFilter === 'All'
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryFilter);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Top Spark Digital
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                Admin Console
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">Management Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition-colors cursor-pointer"
            >
              View Live Website
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
          {[
            { id: 'enquiries', label: `Inquiries (${enquiries.length})`, icon: Mail },
            { id: 'caseStudies', label: 'Case Studies', icon: FolderKanban },
            { id: 'clients', label: 'Client Strip', icon: Briefcase },
            { id: 'settings', label: 'Site Settings', icon: Settings },
            { id: 'diagnostics', label: 'System & SMTP', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#6A22F2] text-white shadow-md shadow-purple-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ENQUIRIES MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status Filter:</span>
                {['All', 'New', 'In Progress', 'Contacted', 'Closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      enquiryFilter === st
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchAdminData(token)}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Inquiries
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Inquiries Table / List (Cols 1-7) */}
              <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0E1017] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Received Submissions ({filteredEnquiries.length})
                </div>

                {filteredEnquiries.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    No inquiries recorded in this category.
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {filteredEnquiries.map((enq) => {
                      const isSelected = selectedEnquiry?.id === enq.id;
                      const statusColor = {
                        New: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
                        'In Progress': 'bg-amber-950/60 text-amber-400 border-amber-800/40',
                        Contacted: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
                        Closed: 'bg-slate-900 text-slate-400 border-white/[0.08]',
                      }[enq.status];

                      return (
                        <div
                          key={enq.id}
                          onClick={() => setSelectedEnquiry(enq)}
                          className={`p-4 sm:p-5 transition-colors cursor-pointer hover:bg-white/[0.02] ${
                            isSelected ? 'bg-purple-950/20 border-l-2 border-[#6A22F2]' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div>
                              <span className="font-semibold text-white text-sm">{enq.name}</span>
                              {enq.company && (
                                <span className="text-xs text-slate-400 ml-2">({enq.company})</span>
                              )}
                            </div>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${statusColor}`}>
                              {enq.status}
                            </span>
                          </div>

                          <div className="text-xs text-purple-400 font-medium mb-1">
                            {enq.service}
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {enq.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{new Date(enq.submittedAt).toLocaleString()}</span>
                            <span>{enq.phone}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Inquiry Detail View & Status Editor (Cols 8-12) */}
              <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6 space-y-6">
                {selectedEnquiry ? (
                  <>
                    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                      <div>
                        <div className="text-xs font-mono text-purple-400">{selectedEnquiry.id}</div>
                        <h3 className="text-lg font-bold text-white">{selectedEnquiry.name}</h3>
                        <p className="text-xs text-slate-400">{selectedEnquiry.company || 'Individual Client'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Phone / WhatsApp</span>
                        <a href={`tel:${selectedEnquiry.phone}`} className="font-medium text-white hover:underline text-sm">
                          {selectedEnquiry.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Email Address</span>
                        <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-purple-300 hover:underline text-sm">
                          {selectedEnquiry.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Requested Service</span>
                        <span className="font-semibold text-white">{selectedEnquiry.service}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Estimated Budget</span>
                        <span className="text-slate-300">{selectedEnquiry.budget || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Submitted Timestamp</span>
                        <span className="text-slate-400">{new Date(selectedEnquiry.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Client Message
                      </span>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </div>
                    </div>

                    {/* Status Update Control */}
                    <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Update Workflow Status
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['New', 'In Progress', 'Contacted', 'Closed'] as EnquiryStatus[]).map((st) => (
                          <button
                            key={st}
                            disabled={statusLoading || selectedEnquiry.status === st}
                            onClick={() => handleUpdateStatus(selectedEnquiry.id, st, selectedEnquiry.notes)}
                            className={`p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              selectedEnquiry.status === st
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Select an inquiry from the list to view details and update workflow status.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CASE STUDIES */}
        {activeTab === 'caseStudies' && content && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Manage Case Studies</h2>
                <p className="text-xs text-slate-400">
                  Toggle published status, modify deliverables, and align outcomes with verified client evidence.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer shadow-md shadow-purple-900/30"
              >
                {contentSaveSuccess ? 'Saved Successfully!' : 'Save Changes'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.caseStudies.map((study, idx) => (
                <div
                  key={study.id}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-purple-400">{study.client}</div>
                      <h3 className="font-bold text-white text-base">{study.title}</h3>
                      <p className="text-xs text-slate-400">{study.industry}</p>
                    </div>

                    <button
                      onClick={() => {
                        const updated = [...content.caseStudies];
                        updated[idx].status = updated[idx].status === 'published' ? 'draft' : 'published';
                        setContent({ ...content, caseStudies: updated });
                      }}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                        study.status === 'published'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {study.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Challenge Summary
                    </label>
                    <textarea
                      rows={2}
                      value={study.challenge}
                      onChange={(e) => {
                        const updated = [...content.caseStudies];
                        updated[idx].challenge = e.target.value;
                        setContent({ ...content, caseStudies: updated });
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-200 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Business Outcome
                    </label>
                    <textarea
                      rows={2}
                      value={study.outcome}
                      onChange={(e) => {
                        const updated = [...content.caseStudies];
                        updated[idx].outcome = e.target.value;
                        setContent({ ...content, caseStudies: updated });
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-200 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT TRUST STRIP */}
        {activeTab === 'clients' && content && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Trust Strip Client Brands</h2>
                <p className="text-xs text-slate-400">
                  Control which client names appear on the homepage trust section.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer shadow-md shadow-purple-900/30"
              >
                {contentSaveSuccess ? 'Saved Successfully!' : 'Save Client List'}
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6 divide-y divide-white/[0.06]">
              {content.clients.map((client, idx) => (
                <div key={client.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div>
                    <span className="font-bold text-white text-base">{client.name}</span>
                    <span className="text-xs text-slate-400 ml-3">{client.industry}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const updated = [...content.clients];
                        updated[idx].published = !updated[idx].published;
                        setContent({ ...content, clients: updated });
                      }}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                        client.published
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-slate-900 text-slate-500 border border-white/[0.08]'
                      }`}
                    >
                      {client.published ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SITE SETTINGS */}
        {activeTab === 'settings' && content && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Agency Information Settings</h2>
                <p className="text-xs text-slate-400">
                  Authoritative contact info rendered across headers, footers, schema metadata, and forms.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer shadow-md shadow-purple-900/30"
              >
                {contentSaveSuccess ? 'Saved Successfully!' : 'Save Settings'}
              </button>
            </div>

            <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Business Phone & WhatsApp
                </label>
                <input
                  type="text"
                  value={content.settings.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Official Business Email
                </label>
                <input
                  type="email"
                  value={content.settings.businessEmail}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, businessEmail: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Office Address
                </label>
                <input
                  type="text"
                  value={content.settings.officeAddress}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, officeAddress: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Public Blog</h4>
                  <p className="text-[11px] text-slate-500">
                    Currently disabled as instructed. Turn on when initial articles are approved for publication.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      settings: {
                        ...content.settings,
                        blogPubliclyEnabled: !content.settings.blogPubliclyEnabled,
                      },
                    })
                  }
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer ${
                    content.settings.blogPubliclyEnabled
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {content.settings.blogPubliclyEnabled ? 'Publicly Enabled' : 'Disabled / Hidden'}
                </button>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
              </div>

              {pwMessage && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    pwMessage.type === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  {pwMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    New Password (min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: DIAGNOSTICS & SMTP STATUS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white">System & Infrastructure Diagnostics</h2>
              <p className="text-xs text-slate-400">
                Verified status of persistent storage and SMTP email dispatch.
              </p>
            </div>

            {diagnostics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Database Store
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-slate-500">Status</span>
                      <span className="text-emerald-400 font-semibold">Active (ACID Atomic)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-slate-500">Inquiries Count</span>
                      <span className="text-white font-mono">{diagnostics.database?.enquiriesCount}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-slate-500">Case Studies</span>
                      <span className="text-white font-mono">{diagnostics.database?.caseStudiesCount}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Services Active</span>
                      <span className="text-white font-mono">{diagnostics.database?.servicesCount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    SMTP Mail Gateway
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-slate-500">SMTP State</span>
                      <span className={`font-semibold ${diagnostics.smtp?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {diagnostics.smtp?.configured ? 'Configured & Ready' : 'Unconfigured (.env required)'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-slate-500">Notification Target</span>
                      <span className="text-white font-mono text-[11px]">{diagnostics.smtp?.destination}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">SMTP Host</span>
                      <span className="text-slate-300 font-mono text-[11px]">{diagnostics.smtp?.host}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-xs text-slate-300 space-y-3 leading-relaxed">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                Hostinger / Production SMTP Activation Guide
              </h4>
              <p>
                To enable live outbound email dispatch to <strong className="text-white">info@topsparkdigital.com</strong>:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
                <li>Log in to Hostinger hPanel and navigate to <strong className="text-slate-200">Emails → topsparkdigital.com</strong>.</li>
                <li>Verify your mailbox password for <code className="text-purple-300">info@topsparkdigital.com</code>.</li>
                <li>Set <code className="text-purple-300">SMTP_HOST="smtp.hostinger.com"</code> and <code className="text-purple-300">SMTP_PORT="465"</code> in your environment variables.</li>
                <li>Set <code className="text-purple-300">SMTP_USER="info@topsparkdigital.com"</code> and <code className="text-purple-300">SMTP_PASS="your-password"</code>.</li>
                <li>All inquiries are already permanently stored in the database first, so no client messages are lost even if SMTP is offline.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
