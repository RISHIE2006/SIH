"use client";

import React from "react";
import { Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { Building2, CalendarCheck, Clock, Banknote, MessageSquare, TrendingDown } from "lucide-react";

interface StatsOverviewProps {
  lang: Language;
  centerCount: number;
  bookingCount: number;
  totalPayout: number;
  smsCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  lang,
  centerCount,
  bookingCount,
  totalPayout,
  smsCount,
}) => {
  const t = translations[lang];

  const stats = [
    {
      title: t.statCenters,
      value: centerCount.toString(),
      subtext: "Across 4 Districts",
      icon: Building2,
      accent: "text-amber-800 bg-amber-50 border-amber-200",
    },
    {
      title: t.statBookings,
      value: bookingCount.toString(),
      subtext: "Tokens Allocated Today",
      icon: CalendarCheck,
      accent: "text-amber-700 bg-stone-100 border-amber-200",
    },
    {
      title: t.statAvgWait,
      value: "22 Mins",
      subtext: t.statWaitReduced,
      icon: Clock,
      badge: "-91% Waiting Time",
      accent: "text-emerald-800 bg-emerald-50 border-emerald-200",
    },
    {
      title: t.statPayouts,
      value: `₹${(totalPayout / 100000).toFixed(2)} Lakhs`,
      subtext: "Direct Benefit Transfer (DBT)",
      icon: Banknote,
      accent: "text-amber-900 bg-amber-100/50 border-amber-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card hover:shadow-soft transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl border ${stat.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              {stat.badge && (
                <span className="bg-leaf-50 text-leaf-700 border border-leaf-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> {stat.badge}
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-beige-900 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold text-beige-700 mt-0.5">
                {stat.title}
              </p>
              <p className="text-[11px] text-beige-500 mt-1 font-medium">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
