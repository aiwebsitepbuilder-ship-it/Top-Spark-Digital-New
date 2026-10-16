import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { ContentDatabase } from '../types';

interface ContactPageProps {
  data: ContentDatabase;
  initialService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ data, initialService }) => {
  const { settings } = data;

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
          Start a Conversation
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Let's Build Something That Works.
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Tell us what you're trying to achieve. We'll figure out what makes sense.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Details & Office (Cols 1-5) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-3xl border border-white/[0.08] bg-[#0E1017] space-y-6">
            <h2 className="text-xl font-bold text-white">Direct Agency Contact</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Reach out directly by phone, email, or WhatsApp. You can also visit our production studio in Dhaka by appointment.
            </p>

            <div className="space-y-4 text-sm pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Studio & Office Address
                  </div>
                  <div className="font-medium text-white text-base mt-0.5">
                    131/2 A, Mirpur-1, Dhaka
                  </div>
                  <div className="text-xs text-slate-400">Bangladesh</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone & WhatsApp
                  </div>
                  <div className="font-medium text-white text-base mt-0.5">
                    <a href="tel:+8801674451806" className="hover:text-purple-400 transition-colors">
                      +8801674451806
                    </a>
                  </div>
                  <div className="text-xs text-slate-400">Available during business hours</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Official Business Email
                  </div>
                  <div className="font-medium text-white text-base mt-0.5">
                    <a href="mailto:info@topsparkdigital.com" className="hover:text-purple-400 transition-colors">
                      info@topsparkdigital.com
                    </a>
                  </div>
                  <div className="text-xs text-slate-400">General & RFP inquiries</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Response Commitment</span>
            </div>
            <p>
              We respond to all project inquiries within 24 business hours. If you submit during weekends, our team will review on Sunday morning.
            </p>
          </div>
        </div>

        {/* Form Container (Cols 6-12) */}
        <div className="lg:col-span-7">
          <ContactForm initialService={initialService} />
        </div>
      </div>
    </div>
  );
};
