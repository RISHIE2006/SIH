"use client";

import React from "react";
import { Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { Sprout, PhoneCall, Mail, ExternalLink, ShieldCheck } from "lucide-react";

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="bg-beige-900 text-beige-100 border-t border-beige-800 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-beige-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-wheat-500 flex items-center justify-center text-beige-900">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{t.appName}</span>
            </div>
            <p className="text-xs text-beige-300 max-w-md leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex items-center gap-3 text-xs text-wheat-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-leaf-500" /> {t.department}
              </span>
              <span>•</span>
              <span>SIH 2026 Problem ID: 26032</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-beige-300">
              <li>
                <a href="https://consumeraffairs.nic.in/" target="_blank" rel="noreferrer" className="hover:text-wheat-400 flex items-center gap-1">
                  Department of Consumer Affairs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://dfpd.gov.in/" target="_blank" rel="noreferrer" className="hover:text-wheat-400 flex items-center gap-1">
                  Food & Public Distribution <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://sih.gov.in/" target="_blank" rel="noreferrer" className="hover:text-wheat-400 flex items-center gap-1">
                  Smart India Hackathon 2026 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Farmer Helpline (टोल-फ्री)
            </h4>
            <div className="space-y-2 text-xs text-beige-300">
              <div className="flex items-center gap-2 text-wheat-300 font-semibold text-sm">
                <PhoneCall className="w-4 h-4 text-leaf-500" /> 1800-11-4000
              </div>
              <p className="text-[11px] text-beige-400">Available 24x7 in 12 Indian Languages</p>
              <div className="flex items-center gap-2 pt-1 text-beige-300">
                <Mail className="w-3.5 h-3.5" /> support-krishisetu@doca.gov.in
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-beige-400 gap-3">
          <p>© 2026 {t.appName} • Government of India Initiative for SIH 2026 (Problem #26032)</p>
          <p className="flex items-center gap-2">
            <span>Minimalist Beige & White UI</span>
            <span>•</span>
            <span>Bilingual (EN / HI)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
