"use client";

import React from "react";
import { Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion } from "framer-motion";
import { UserCheck, MapPin, Smartphone, Clock, Scale, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface HowItWorksProps {
  lang: Language;
  onRegisterClick: () => void;
  onBookClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  lang,
  onRegisterClick,
  onBookClick,
}) => {
  const t = translations[lang];

  const steps = [
    {
      icon: UserCheck,
      title: t.step1Title,
      desc: t.step1Desc,
      actionLabel: "Register Profile",
      action: onRegisterClick,
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      icon: MapPin,
      title: t.step2Title,
      desc: t.step2Desc,
      actionLabel: "Book Mandi Slot",
      action: onBookClick,
      color: "bg-wheat-100 text-beige-900 border-wheat-300",
    },
    {
      icon: Smartphone,
      title: t.step3Title,
      desc: t.step3Desc,
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      icon: Clock,
      title: t.step4Title,
      desc: t.step4Desc,
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      icon: Scale,
      title: t.step5Title,
      desc: t.step5Desc,
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-card space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-beige-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-50 border border-leaf-500/30 text-leaf-700 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.pmAashaBadge}</span>
          </div>
          <h2 className="text-2xl font-black text-beige-900 tracking-tight">
            {t.guideHeading}
          </h2>
          <p className="text-xs text-beige-600 mt-1 max-w-2xl leading-relaxed">
            {t.guideSubheading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold bg-beige-100 px-3 py-1.5 rounded-xl border border-beige-300 text-beige-800">
            Govt Helpline: 1800-180-1551
          </span>
        </div>
      </div>

      {/* Steps Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-beige-50/60 p-4 rounded-2xl border border-beige-200 flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-beige-400 font-mono">
                    STEP 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-beige-900 leading-snug">
                  {step.title}
                </h3>

                <p className="text-[11px] text-beige-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              {step.action && (
                <button
                  onClick={step.action}
                  className="w-full py-1.5 px-3 rounded-lg bg-beige-900 hover:bg-beige-800 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Government Guarantees Ribbon */}
      <div className="bg-wheat-50/80 p-4 rounded-2xl border border-wheat-200 flex flex-wrap justify-around items-center gap-4 text-xs font-semibold text-beige-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-leaf-600" />
          <span>Government Guaranteed MSP Rates</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-leaf-600" />
          <span>Direct Benefit Transfer (DBT) to Bank Account</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-leaf-600" />
          <span>Zero Standby Queue & Crowd Management</span>
        </div>
      </div>
    </motion.section>
  );
};
