"use client";

import React, { useState } from "react";
import {
  Language, SlotBooking, QualityAssessment, ProcurementOperator,
  ProcurementCenter, ProcurementRecord
} from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, RefreshCw, CheckCircle2, Scale, Banknote, Send, Clock,
  Building2, ShieldCheck, Activity
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OperatorDashboardProps {
  lang: Language;
  bookings: SlotBooking[];
  operators: ProcurementOperator[];
  centers: ProcurementCenter[];
  procurements: ProcurementRecord[];
  lastSyncedAt: string | null;
  onAdvanceQueue: (bookingId: string) => void;
  onProcessInspection: (bookingId: string, assessment: QualityAssessment, netWeight: number) => void;
  onDisbursePayment: (bookingId: string) => void;
  syncData: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  lang,
  bookings,
  operators,
  centers,
  procurements,
  lastSyncedAt,
  onAdvanceQueue,
  onProcessInspection,
  onDisbursePayment,
  syncData,
}) => {
  const t = translations[lang];

  const [selectedCenterId, setSelectedCenterId] = useState<string>(centers[0]?.id || "CTR-01");
  const selectedCenter = centers.find(c => c.id === selectedCenterId) || centers[0];

  const centerBookings = bookings.filter(b => b.centerId === selectedCenterId);
  const activeBookings = centerBookings.filter(b => b.status !== "Completed" && b.status !== "Cancelled");
  
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    activeBookings[0]?.id || centerBookings[0]?.id || ""
  );

  const activeToken = centerBookings.find(b => b.id === selectedBookingId) || activeBookings[0] || centerBookings[0];

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
    alert(`Quality inspection passed for ${activeToken.farmerName} (${activeToken.tokenId}). Invoice generated.`);
  };

  return (
    <div className="space-y-6">
      {/* ── Operator Hero Strip (Original Warm Theme) ── */}
      <div className="bg-gradient-to-br from-beige-100 via-white to-wheat-100 border border-beige-300 rounded-3xl p-6 sm:p-10 shadow-glass relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-beige-700 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Mandi Desk Counter #1 • Operator Workstation
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-beige-900 tracking-tight leading-tight mt-1">
                Centre Operator Terminal
              </h1>
              <p className="text-beige-700 text-sm max-w-xl leading-relaxed mt-1">
                Manage token queues, quality testing, weighbridge measurement, and DBT disbursements.
              </p>
            </div>

            {/* Yard Switcher */}
            <div className="bg-white border border-beige-300 p-3 rounded-2xl space-y-1 text-xs shadow-sm">
              <label className="text-[11px] font-semibold text-beige-700 block">Select Active Mandi Yard:</label>
              <select
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
                className="bg-beige-900 text-beige-50 font-bold px-3 py-1.5 rounded-xl border border-beige-700 focus:outline-none"
              >
                {centers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Active Mandi</p>
              <p className="text-base font-bold text-beige-900 truncate mt-0.5">{selectedCenter?.name.split(" ")[0]}</p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Waiting Tokens</p>
              <p className="text-2xl font-black text-amber-800">{activeBookings.length}</p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Farmers Processed</p>
              <p className="text-2xl font-black text-leaf-700">
                {procurements.filter(p => p.centerName.includes(selectedCenter?.name.split(" ")[0] || "")).length}
              </p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Operator Status</p>
              <p className="text-sm font-extrabold text-leaf-700 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-leaf-600 animate-pulse" /> Active Desk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Operator Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Queue List */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-card p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-beige-100">
            <div>
              <h3 className="font-bold text-beige-900 text-sm">Live Mandi Queue</h3>
              <p className="text-[11px] text-beige-600">{selectedCenter?.name}</p>
            </div>
            <span className="text-xs bg-wheat-100 text-beige-900 px-2.5 py-0.5 rounded-full font-bold">
              {centerBookings.length} Tokens
            </span>
          </div>

          {centerBookings.length === 0 ? (
            <div className="py-12 text-center text-beige-500 text-xs space-y-2">
              <Users className="w-8 h-8 mx-auto text-beige-300" />
              <p>No tokens issued for this mandi yard yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {centerBookings.map((b) => {
                const isSelected = activeToken?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-wheat-100 border-amber-600 shadow-sm"
                        : "bg-beige-50/60 border-beige-200 hover:border-beige-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-beige-900">{b.tokenId}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === "Completed" ? "bg-leaf-100 text-leaf-800" : "bg-amber-100 text-amber-900"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-beige-900 mt-1">{b.farmerName}</p>
                        <p className="text-[11px] text-beige-600">{b.cropType} • {b.estimatedQuantityQuintals} Qt</p>
                      </div>
                      <span className="text-[10px] font-mono text-beige-500">{b.timeSlot.split("-")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Inspection & Weighbridge Workstation */}
        <div className="lg:col-span-2 space-y-6">
          {activeToken ? (
            <div className="bg-white rounded-2xl border border-beige-200 shadow-card p-6 space-y-6">
              
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-beige-200 gap-3">
                <div>
                  <span className="text-[11px] font-mono text-amber-800 font-bold uppercase tracking-wider">
                    Desk Counter Active Token
                  </span>
                  <h2 className="text-2xl font-black text-beige-900 mt-0.5">
                    {activeToken.farmerName} ({activeToken.tokenId})
                  </h2>
                  <p className="text-xs text-beige-600">{activeToken.centerName}</p>
                </div>

                <button
                  onClick={() => onAdvanceQueue(activeToken.id)}
                  className="px-4 py-2 bg-beige-900 hover:bg-beige-800 text-beige-50 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Advance Counter Stage
                </button>
              </div>

              {/* Quality Testing Form */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-beige-900 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-leaf-600" /> Quality Testing & Weighbridge
                </h3>

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
                      className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                      className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                      Assigned Grade
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as QualityAssessment["grade"])}
                      className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Grade-A">Grade-A (Superior MSP)</option>
                      <option value="Grade-B">Grade-B (Standard)</option>
                      <option value="Fair-Average-Quality">Fair Average Quality (FAQ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                      Gross Weight (Quintals)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-beige-700 mb-1">
                      Net Weight (Quintals)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={netWeight}
                      onChange={(e) => setNetWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-beige-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Calculated MSP Card */}
                <div className="bg-wheat-100 p-4 rounded-xl border border-beige-300 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-beige-800 font-semibold">Calculated MSP Amount</span>
                    <p className="text-xl font-extrabold text-beige-950">
                      {formatCurrency((parseFloat(netWeight) || 0) * (activeToken.cropType.toLowerCase().includes("paddy") ? 2300 : 2275))}
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleSaveInspection}
                    className="px-4 py-2.5 rounded-xl bg-beige-900 text-beige-50 text-xs font-bold hover:bg-beige-800 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-leaf-400" />
                    Save & Generate Receipt
                  </button>
                </div>
              </div>

              {/* Direct Benefit Transfer Action */}
              <div className="bg-leaf-50 p-4 rounded-xl border border-leaf-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-leaf-700" />
                  <div>
                    <p className="text-xs font-bold text-leaf-900">Direct Benefit Transfer (DBT)</p>
                    <p className="text-[11px] text-leaf-700">Disburse payment directly to farmer bank account</p>
                  </div>
                </div>

                <button
                  onClick={() => onDisbursePayment(activeToken.id)}
                  className="px-4 py-2 rounded-xl bg-leaf-700 hover:bg-leaf-800 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Disburse Payment
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center text-beige-500 text-xs">
              Select a token from the queue to process inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
