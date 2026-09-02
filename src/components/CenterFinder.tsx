"use client";

import React, { useState } from "react";
import { ProcurementCenter, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { Building2, MapPin, Clock, Phone, Users, Search, CheckCircle2, ArrowRight } from "lucide-react";

interface CenterFinderProps {
  lang: Language;
  centers: ProcurementCenter[];
  onSelectCenterForBooking: (centerId: string) => void;
}

export const CenterFinder: React.FC<CenterFinderProps> = ({
  lang,
  centers,
  onSelectCenterForBooking,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState("");

  const filtered = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-beige-900">{t.centerTitle}</h2>
          <p className="text-xs text-beige-600 mt-1">
            Real-time capacity tracking reduces queue overcrowding.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-beige-400" />
          <input
            type="text"
            placeholder={t.centerSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs text-beige-900 focus:outline-none focus:ring-2 focus:ring-wheat-500"
          />
        </div>
      </div>

      {/* Grid of Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((center) => {
          const loadPercent = Math.round((center.currentBookings / center.capacityPerDay) * 100);
          const isHighLoad = loadPercent >= 90;

          return (
            <div
              key={center.id}
              className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card hover:shadow-soft transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-wheat-100 border border-wheat-300 text-beige-900 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-beige-900 text-base leading-tight">
                      {center.name}
                    </h3>
                    <p className="text-xs text-beige-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-wheat-600" /> {center.address}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                    isHighLoad
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-emerald-50 text-emerald-800 border-emerald-300"
                  }`}
                >
                  {isHighLoad ? t.statusFull : t.statusOpen}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 bg-beige-50/70 p-3 rounded-xl border border-beige-200">
                <div className="flex justify-between text-xs font-semibold text-beige-800">
                  <span>{t.capacityLabel}: {center.currentBookings} / {center.capacityPerDay} Tokens</span>
                  <span className={isHighLoad ? "text-amber-800 font-bold" : "text-emerald-700"}>
                    {loadPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-beige-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHighLoad ? "bg-amber-600" : "bg-emerald-600"
                    }`}
                    style={{ width: `${Math.min(loadPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs text-beige-700">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-beige-500" />
                  <span>{center.operatingHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-beige-500" />
                  <span>Avg Wait: {center.avgWaitMins} mins</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-beige-200 flex justify-between items-center">
                <div className="text-[11px] text-beige-600 font-medium">
                  Officer: {center.contactPerson}
                </div>

                <button
                  onClick={() => onSelectCenterForBooking(center.id)}
                  className="px-4 py-2 rounded-xl bg-beige-900 hover:bg-beige-800 text-beige-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Book Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
