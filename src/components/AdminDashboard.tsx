"use client";

import React, { useState } from "react";
import {
  Language, ProcurementCenter, SlotBooking, ProcurementRecord,
  ProcurementOperator, Farmer, SmsLog
} from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, Banknote, ShieldCheck, Activity, RefreshCw,
  Search, CheckCircle2, AlertCircle, FileText, Cpu
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminDashboardProps {
  lang: Language;
  centers: ProcurementCenter[];
  operators: ProcurementOperator[];
  bookings: SlotBooking[];
  procurements: ProcurementRecord[];
  farmers: Farmer[];
  smsLogs: SmsLog[];
  lastSyncedAt: string | null;
  syncData: () => void;
  onUpdateCenterStatus: (centerId: string, status: ProcurementCenter["status"]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  centers,
  operators,
  bookings,
  procurements,
  farmers,
  smsLogs,
  lastSyncedAt,
  syncData,
  onUpdateCenterStatus,
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<"overview" | "centers" | "operators" | "ledger">("overview");
  const [ledgerSearch, setLedgerSearch] = useState("");

  const totalPayoutSum = procurements.reduce((sum, p) => sum + p.totalAmount, 0);

  const filteredProcurements = procurements.filter(
    (p) =>
      p.farmerName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      p.tokenId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      p.cropType.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      p.centerName.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Admin Hero Strip (Original Warm Theme) ── */}
      <div className="bg-gradient-to-br from-beige-100 via-white to-wheat-100 border border-beige-300 rounded-3xl p-6 sm:p-10 shadow-glass relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-beige-700 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                State Executive Command • System Administration
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-beige-900 tracking-tight leading-tight mt-1">
                State Procurement Administration
              </h1>
              <p className="text-beige-700 text-sm max-w-xl leading-relaxed mt-1">
                Monitor state grain centers, operator queues, and direct benefit transfer (DBT) payouts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={syncData}
                className="px-4 py-2.5 bg-beige-900 hover:bg-beige-800 text-beige-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-wheat-400" />
                Force System Sync
              </button>
            </div>
          </div>

          {/* Master Admin Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Procurement Centers</p>
              <p className="text-2xl font-black text-beige-900">{centers.length}</p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Registered Farmers</p>
              <p className="text-2xl font-black text-leaf-700">{farmers.length}</p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Issued Tokens Today</p>
              <p className="text-2xl font-black text-amber-800">{bookings.length}</p>
            </div>
            <div className="bg-white border border-beige-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-beige-600">Total DBT Disbursed</p>
              <p className="text-2xl font-black text-beige-900">{formatCurrency(totalPayoutSum)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-beige-200">
            {[
              { id: "overview", label: "Executive Overview" },
              { id: "centers", label: "Procurement Centers" },
              { id: "operators", label: "Operator Desks" },
              { id: "ledger", label: "Master Ledger & DBT" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-beige-900 text-beige-50 shadow-sm"
                    : "bg-white text-beige-700 hover:bg-beige-50 border border-beige-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Admin Content Workspace ── */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-2">
                  <div className="flex justify-between items-center text-beige-700">
                    <span className="text-xs font-bold">SMS Dispatch Logs</span>
                    <Cpu className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-3xl font-black text-beige-900">{smsLogs.length}</p>
                  <p className="text-[11px] text-beige-600">Automated NIC SMS queue alerts sent</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-2">
                  <div className="flex justify-between items-center text-beige-700">
                    <span className="text-xs font-bold">Active Centre Operators</span>
                    <Users className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-3xl font-black text-beige-900">{operators.length}</p>
                  <p className="text-[11px] text-beige-600">Assigned across state yards</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-2">
                  <div className="flex justify-between items-center text-beige-700">
                    <span className="text-xs font-bold">Completed Transactions</span>
                    <CheckCircle2 className="w-4 h-4 text-leaf-600" />
                  </div>
                  <p className="text-3xl font-black text-beige-900">
                    {procurements.filter(p => p.paymentStatus === "Credited").length}
                  </p>
                  <p className="text-[11px] text-beige-600">DBT payouts successfully credited</p>
                </div>
              </div>

              {/* Mandi Summary */}
              <div className="bg-white rounded-2xl border border-beige-200 p-6 shadow-card space-y-4">
                <h3 className="font-bold text-beige-900 text-base">Real-Time Mandi Capacity Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {centers.map(c => {
                    const load = Math.round((c.currentBookings / c.capacityPerDay) * 100);
                    return (
                      <div key={c.id} className="p-4 rounded-xl bg-beige-50/70 border border-beige-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-beige-900 truncate">{c.name.split(" ")[0]} Yard</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === "Open" ? "bg-leaf-50 text-leaf-700 border border-leaf-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>{c.status}</span>
                        </div>
                        <div className="w-full h-1.5 bg-beige-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 rounded-full" style={{ width: `${Math.min(load, 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-beige-600">
                          <span>{c.currentBookings} Bookings</span>
                          <span>{load}% Capacity</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* CENTERS */}
          {activeTab === "centers" && (
            <motion.div key="centers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="bg-white rounded-2xl border border-beige-200 shadow-card overflow-hidden">
                <table className="w-full text-left text-xs text-beige-900">
                  <thead className="bg-beige-100 border-b border-beige-200 text-beige-800 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Center Name & Location</th>
                      <th className="py-3 px-4">Daily Capacity</th>
                      <th className="py-3 px-4">Active Queue</th>
                      <th className="py-3 px-4">Avg Wait</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Status Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige-200">
                    {centers.map(c => (
                      <tr key={c.id} className="hover:bg-beige-50/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-beige-900">
                          {c.name}
                          <div className="text-[10px] text-beige-600 font-normal">{c.address}</div>
                        </td>
                        <td className="py-4 px-4 font-semibold">{c.capacityPerDay} Tokens/day</td>
                        <td className="py-4 px-4 font-bold text-amber-800">{c.liveQueueLength} waiting</td>
                        <td className="py-4 px-4">{c.avgWaitMins} Mins</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            c.status === "Open" ? "bg-leaf-50 text-leaf-700 border-leaf-200" : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>{c.status}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <select
                            value={c.status}
                            onChange={(e) => onUpdateCenterStatus(c.id, e.target.value as any)}
                            className="bg-beige-50 border border-beige-300 text-beige-900 text-xs font-bold rounded-lg px-2 py-1"
                          >
                            <option value="Open">Open</option>
                            <option value="Closing Soon">Closing Soon</option>
                            <option value="Full">Full</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* OPERATORS */}
          {activeTab === "operators" && (
            <motion.div key="operators" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operators.map(op => (
                <div key={op.id} className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-wheat-100 text-beige-900 font-bold flex items-center justify-center text-sm">
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-beige-900 text-sm">{op.name}</h4>
                        <p className="text-xs text-beige-600">{op.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-leaf-50 text-leaf-700 border border-leaf-200">
                      {op.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-beige-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-beige-600 text-[11px] block">Assigned Center</span>
                      <span className="font-bold text-beige-900">{op.centerName}</span>
                    </div>
                    <div>
                      <span className="text-beige-600 text-[11px] block">Queue Load</span>
                      <span className="font-bold text-amber-800">{op.currentQueue} Tokens</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* LEDGER */}
          {activeTab === "ledger" && (
            <motion.div key="ledger" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-beige-200 shadow-card flex justify-between items-center gap-4">
                <h3 className="font-bold text-beige-900 text-sm">Official Master Procurement Ledger</h3>
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-beige-400" />
                  <input
                    type="text"
                    placeholder="Search ledger..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-beige-50 border border-beige-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-beige-900"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-beige-200 shadow-card overflow-hidden">
                {procurements.length === 0 ? (
                  <div className="py-16 text-center text-beige-500 text-xs">
                    No procurement transactions recorded in master ledger yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-beige-900">
                      <thead className="bg-beige-100 border-b border-beige-200 text-beige-800 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Token & Farmer</th>
                          <th className="py-3 px-4">Mandi Center</th>
                          <th className="py-3 px-4">Crop</th>
                          <th className="py-3 px-4">Weight</th>
                          <th className="py-3 px-4">MSP Amount</th>
                          <th className="py-3 px-4">DBT Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-beige-200">
                        {filteredProcurements.map(p => (
                          <tr key={p.id} className="hover:bg-beige-50/60">
                            <td className="py-3 px-4 font-bold">
                              {p.tokenId} - {p.farmerName}
                            </td>
                            <td className="py-3 px-4 text-beige-600">{p.centerName}</td>
                            <td className="py-3 px-4 font-semibold">{p.cropType}</td>
                            <td className="py-3 px-4 font-bold">{p.netWeightQuintals} Qt</td>
                            <td className="py-3 px-4 font-extrabold text-beige-900">{formatCurrency(p.totalAmount)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                p.paymentStatus === "Credited" ? "bg-leaf-50 text-leaf-700 border-leaf-200" : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>{p.paymentStatus}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
