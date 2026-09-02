"use client";

import React from "react";
import { SmsLog, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { X, MessageSquare, CheckCheck, Smartphone, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SmsNotificationDrawerProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  smsLogs: SmsLog[];
}

export const SmsNotificationDrawer: React.FC<SmsNotificationDrawerProps> = ({
  lang,
  isOpen,
  onClose,
  smsLogs,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-beige-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-l border-beige-200 w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-beige-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-wheat-200 text-beige-900 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-beige-900 text-base leading-none">
                {t.smsTitle}
              </h3>
              <p className="text-xs text-beige-600 mt-1">{t.smsSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-beige-500 hover:text-beige-900 hover:bg-beige-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMS Feed */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {smsLogs.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-beige-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-beige-300" />
              <p>{t.smsEmpty}</p>
            </div>
          ) : (
            smsLogs.map((sms) => (
              <div
                key={sms.id}
                className="bg-beige-50 border border-beige-200 rounded-xl p-4 space-y-2 text-xs relative"
              >
                <div className="flex justify-between items-center text-[11px] font-mono text-beige-600">
                  <span className="font-bold text-beige-900">{sms.phone}</span>
                  <span className="bg-wheat-200 text-beige-800 px-2 py-0.5 rounded font-sans text-[10px]">
                    {sms.type}
                  </span>
                </div>

                {/* SMS Bubble */}
                <div className="bg-white p-3 rounded-lg border border-beige-200 text-beige-900 font-sans leading-relaxed shadow-xs">
                  {sms.message}
                </div>

                <div className="flex justify-between items-center text-[10px] text-beige-500 font-mono pt-1">
                  <span>{new Date(sms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCheck className="w-3.5 h-3.5" /> Delivered via SMS Gateway
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-beige-200 text-[11px] text-beige-600 flex items-center justify-between">
          <span>SMS Gateway API Simulated</span>
          <span className="font-mono text-wheat-700">NIC SMS Service</span>
        </div>

      </div>
    </div>
  );
};
