"use client";

import React, { useState } from "react";
import { SlotBooking, QualityAssessment, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { ShieldAlert, CheckCircle2, Scale, Banknote, ArrowRight, User, RefreshCw, Send } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminCounterPanelProps {
  lang: Language;
  bookings: SlotBooking[];
  onProcessInspection: (bookingId: string, assessment: QualityAssessment, netWeight: number) => void;
  onDisbursePayment: (bookingId: string) => void;
}

export const AdminCounterPanel: React.FC<AdminCounterPanelProps> = ({
  lang,
  bookings,
  onProcessInspection,
  onDisbursePayment,
}) => {
  const t = translations[lang];

  const pendingTokens = bookings.filter((b) => b.status === "In-Queue" || b.status === "Booked");
  const inspectedTokens = bookings.filter((b) => b.status === "Inspected" || b.status === "Weighed");

  const [activeToken, setActiveToken] = useState<SlotBooking | null>(pendingTokens[0] || bookings[0] || null);

  const [moisture, setMoisture] = useState("10.5");
  const [foreignMatter, setForeignMatter] = useState("0.8");
  const [grade, setGrade] = useState<QualityAssessment["grade"]>("Grade-A");
  const [grossWeight, setGrossWeight] = useState("45.0");
  const [netWeight, setNetWeight] = useState("44.2");

  const handleSaveInspection = () => {
    if (!activeToken) return;

    onProcessInspection(
      activeToken.id,
      {
        moisturePercentage: parseFloat(moisture) || 10.5,
        foreignMatterPercentage: parseFloat(foreignMatter) || 0.8,
        damagedGrainsPercentage: 1.0,
        grade,
      },
      parseFloat(netWeight) || 44.2
    );

    alert(`Quality test passed for ${activeToken.farmerName} (${activeToken.tokenId}). Invoice generated!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Operator Banner */}
      <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-wheat-200 text-beige-900 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-wheat-300">
            Official Operator Desk • Counter #1
          </span>
          <h2 className="text-xl font-extrabold text-beige-900 mt-1">{t.adminTitle}</h2>
          <p className="text-xs text-beige-600">{t.adminSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (pendingTokens.length > 0) setActiveToken(pendingTokens[0]);
            }}
            className="px-4 py-2.5 rounded-xl bg-wheat-500 hover:bg-wheat-600 text-beige-900 font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.btnCallNext}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Queue List */}
        <div className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-3">
          <h3 className="font-bold text-beige-900 text-sm">Active Counter Desk Queue</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setActiveToken(b)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeToken?.id === b.id
                    ? "bg-wheat-50 border-wheat-400 font-semibold"
                    : "bg-beige-50/50 border-beige-200 hover:border-beige-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-beige-900">{b.tokenId}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-beige-200 text-beige-800">
                    {b.status}
                  </span>
                </div>
                <p className="text-beige-900 mt-1 font-medium">{b.farmerName}</p>
                <p className="text-[11px] text-beige-500">{b.cropType} • {b.estimatedQuantityQuintals} Qt Est.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspection & Weighbridge Desk */}
        {activeToken ? (
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-beige-200 shadow-card space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-beige-200">
              <div>
                <span className="text-xs text-beige-500 font-mono">Token #: {activeToken.tokenId}</span>
                <h3 className="text-lg font-bold text-beige-900">{activeToken.farmerName}</h3>
                <p className="text-xs text-beige-600">{activeToken.centerName}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-wheat-700 bg-wheat-100 px-3 py-1 rounded-xl border border-wheat-300">
                  Status: {activeToken.status}
                </span>
              </div>
            </div>

            {/* Quality Test Form */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-beige-900 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-wheat-600" /> Quality Testing & Digital Weighbridge Entry
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full px-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                    Foreign Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={foreignMatter}
                    onChange={(e) => setForeignMatter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                    Grain Grade Output
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as QualityAssessment["grade"])}
                    className="w-full px-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900"
                  >
                    <option value="Grade-A">Grade-A (Superior MSP)</option>
                    <option value="Grade-B">Grade-B (Standard)</option>
                    <option value="Fair-Average-Quality">FAQ (Fair Average)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                    Gross Weight (Quintals)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="w-full px-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                    Net Procurement Weight (Quintals)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="w-full px-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900"
                  />
                </div>
              </div>

              {/* Instant MSP Calculated Amount */}
              <div className="bg-wheat-50 p-4 rounded-xl border border-wheat-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-beige-600 font-medium">Calculated MSP Value</span>
                  <p className="text-xl font-extrabold text-amber-900">
                    {formatCurrency((parseFloat(netWeight) || 0) * 2275)}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleSaveInspection}
                  className="px-4 py-2.5 rounded-xl bg-beige-900 text-beige-50 text-xs font-bold hover:bg-beige-800 transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.btnConfirmWeight}</span>
                </button>
              </div>
            </div>

            {/* Direct Benefit Transfer Disburse Action */}
            <div className="bg-leaf-50/70 p-4 rounded-xl border border-leaf-200 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Banknote className="w-6 h-6 text-leaf-600" />
                <div>
                  <p className="text-xs font-bold text-leaf-900">Direct Benefit Transfer (DBT)</p>
                  <p className="text-[11px] text-leaf-700">Instant credit to Aadhaar linked bank account</p>
                </div>
              </div>

              <button
                onClick={() => onDisbursePayment(activeToken.id)}
                className="px-4 py-2 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.btnDisbursePayment}</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 rounded-2xl border border-beige-200 shadow-card text-center text-beige-500 text-xs">
            Select a token from the left queue list to inspect grain quality and weigh.
          </div>
        )}

      </div>
    </div>
  );
};
