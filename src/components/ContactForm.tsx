import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

interface ContactFormProps {
  initialService?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialService = '', onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: initialService || 'Social Media Management',
    budget: '৳25,000 – ৳50,000 / month',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  const services = [
    'Social Media Management',
    'Content Creation',
    'Photography/Videography',
    'Google Business Profile',
    'SEO/AEO',
    'Website',
    'Digital Product',
    'Other',
  ];

  const budgetRanges = [
    '৳15,000 – ৳30,000 / month',
    '৳30,000 – ৳60,000 / month',
    '৳60,000 – ৳150,000 / month',
    '৳150,000+ / project',
    'To be determined based on scope',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name or company representative name.');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid business or personal email address.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      setErrorMessage('Please enter a valid phone or WhatsApp number so we can reach you.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please describe your requirements or goals (at least 10 characters).');
      return;
    }

    setStatus('submitting');

    try {
      const data = await api.submitEnquiry(formData);

      setStatus('success');
      setSubmittedId(data.enquiryId || '');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Connection failed. Please reach us directly.';
      setErrorMessage(msg);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Enquiry Received
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
          Thank you for reaching out to Top Spark Digital. We have logged your request{' '}
          {submittedId && <span className="font-mono text-purple-400 text-xs">({submittedId})</span>} and will review
          your business requirements within 24 business hours.
        </p>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-slate-400 max-w-md mx-auto mb-6">
          Need an immediate response? You can also message our team directly on WhatsApp at{' '}
          <a
            href="https://wa.me/8801674451806"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-semibold hover:underline"
          >
            +8801674451806
          </a>
          .
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setFormData({
              name: '',
              company: '',
              phone: '',
              email: '',
              service: 'Social Media Management',
              budget: '৳25,000 – ৳50,000 / month',
              message: '',
            });
          }}
          className="text-xs font-semibold text-purple-400 hover:text-white transition-colors cursor-pointer"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6 sm:p-10 shadow-2xl space-y-6"
      noValidate
    >
      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Your Name <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Tanvir Ahmed"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm placeholder:text-slate-600 transition-colors outline-none"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Company / Brand
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Green Valley Agro"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm placeholder:text-slate-600 transition-colors outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Phone / WhatsApp <span className="text-purple-400">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+8801XXXXXXXXX"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm placeholder:text-slate-600 transition-colors outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Email Address <span className="text-purple-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm placeholder:text-slate-600 transition-colors outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            What do you need help with? <span className="text-purple-400">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#131620] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm transition-colors outline-none cursor-pointer"
          >
            {services.map((srv) => (
              <option key={srv} value={srv} className="bg-[#131620] text-white">
                {srv}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Estimated Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#131620] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm transition-colors outline-none cursor-pointer"
          >
            {budgetRanges.map((range) => (
              <option key={range} value={range} className="bg-[#131620] text-white">
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Project Details & Goals <span className="text-purple-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your brand, what you are trying to achieve, and any specific timelines..."
          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#6A22F2] focus:ring-1 focus:ring-[#6A22F2] text-white text-sm placeholder:text-slate-600 transition-colors outline-none resize-y"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Send Project Enquiry</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500">
          We respect your privacy. No spam or aggressive sales tactics — just practical advice.
        </p>
      </div>
    </form>
  );
};
