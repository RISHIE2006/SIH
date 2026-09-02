"use client";

import React, { useState } from "react";
import {
  Language, Farmer, ProcurementCenter, SlotBooking,
  ProcurementRecord, SmsLog,
} from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, Calendar, MapPin, Clock, CheckCircle2,
  Banknote, Bell, ArrowRight, Search, Building2, Users,
  Phone, ShieldCheck, RefreshCw, AlertCircle, ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FarmerDashboardProps {
  lang: Language;
  farmers: Farmer[];
  centers: ProcurementCenter[];
  bookings: SlotBooking[];
  procurements: ProcurementRecord[];
  smsLogs: SmsLog[];
  lastSyncedAt: string | null;
  onOpenRegister: () => void;
  onOpenBookSlot: (centerId?: string) => void;
  onOpenSms: () => void;
  syncData: () => void;
}

const STEPS = [
  { key: "Booked", label: "Slot Confirmed", icon: Calendar },
  { key: "In-Queue", label: "At Counter", icon: Users },
  { key: "Inspected", label: "Quality Checked", icon: CheckCircle2 },
  { key: "Weighed", label: "Weighed", icon: ShieldCheck },
  { key: "Completed", label: "Payment Credited", icon: Banknote },
];

function getStepIdx(status: SlotBooking["status"]): number {
  const map: Record<string, number> = {
    Booked: 0, "In-Queue": 1, Inspected: 2, Weighed: 3, Completed: 4,
  };
  return map[status] ?? 0;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  lang, farmers, centers, bookings, procurements, smsLogs,
  lastSyncedAt, onOpenRegister, onOpenBookSlot, onOpenSms, syncData,
}) => {
  const t = translations[lang];
  const [centerSearch, setCenterSearch] = useState("");
  const [activeSection, setActiveSection] = useState<"home" | "centers" | "mytoken" | "payment">("home");

  const myBookings = bookings.filter((b) => b.status !== "Cancelled");
  const activeBooking = myBookings.find((b) => b.status !== "Completed") || myBookings[0];
  const myPayment = activeBooking
    ? procurements.find((p) => p.bookingId === activeBooking.id)
    : null;

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
      c.district.toLowerCase().includes(centerSearch.toLowerCase())
  );

  const stepIdx = activeBooking ? getStepIdx(activeBooking.status) : -1;

  const syncLabel = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  return (
    <div className="space-y-6">
      {/* ── Farmer Hero Strip (Original Warm Beige & Amber Palette) ── */}
      <div className="bg-gradient-to-br from-beige-100 via-white to-wheat-100 border border-beige-300 rounded-3xl p-6 sm:p-10 shadow-glass relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" />
                <span>{t.pmAashaBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-beige-900 tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-beige-700 text-sm max-w-xl leading-relaxed">{t.heroDesc}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBookSlot()}
                  className="px-5 py-3 rounded-2xl bg-beige-900 hover:bg-beige-800 text-beige-50 font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-wheat-400" /> {t.btnBookSlot}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenRegister()}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-beige-50 text-beige-900 border border-beige-300 font-bold text-xs sm:text-sm shadow-card transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-leaf-600" /> {t.btnRegisterFarmer}
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Active Token", value: activeBooking ? activeBooking.tokenId : "—" },
                { label: "SMS Alerts", value: smsLogs.length.toString() },
                { label: "Centers", value: centers.length.toString() },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-beige-200 rounded-2xl px-4 py-3 min-w-[100px] shadow-sm">
                  <p className="text-xl font-extrabold text-beige-900">{s.value}</p>
                  <p className="text-beige-600 text-[11px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section nav */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-beige-200">
            {(["home", "centers", "mytoken", "payment"] as const).map((sec) => {
              const labels = { home: "Overview", centers: "Find Centre", mytoken: "My Token", payment: "My Payment" };
              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === sec
                      ? "bg-beige-900 text-beige-50 shadow-sm"
                      : "bg-white text-beige-700 hover:bg-beige-50 border border-beige-200"
                  }`}
                >
                  {labels[sec]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">

          {/* HOME */}
          {activeSection === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Register", desc: "Add your Aadhaar & land details to get verified on KrishiSetu.", icon: ShieldCheck, action: onOpenRegister, btn: "Register Now" },
                  { step: "2", title: "Find & Book a Slot", desc: "Choose your nearest mandi center and pick a time slot.", icon: Calendar, action: () => setActiveSection("centers"), btn: "Find Centre" },
                  { step: "3", title: "Track Token & Payment", desc: "Receive SMS updates. Direct Benefit Transfer (DBT) credited automatically.", icon: Banknote, action: () => setActiveSection("mytoken"), btn: "Track Token" },
                ].map((s) => (
                  <motion.div key={s.step} whileHover={{ y: -4 }} className="bg-white border border-beige-200 rounded-2xl p-6 shadow-card hover:shadow-soft transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-wheat-100 text-beige-900 font-black text-sm flex items-center justify-center">{s.step}</div>
                      <s.icon className="w-5 h-5 text-leaf-600" />
                    </div>
                    <h3 className="font-bold text-beige-900 text-base">{s.title}</h3>
                    <p className="text-xs text-beige-600 leading-relaxed">{s.desc}</p>
                    <button onClick={s.action} className="text-xs font-bold text-amber-800 flex items-center gap-1 hover:gap-2 transition-all">
                      {s.btn} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {activeBooking && (
                <div className="bg-white border border-beige-200 rounded-2xl p-5 shadow-card flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-beige-600 font-semibold uppercase tracking-wider">Your Active Token</p>
                    <p className="text-2xl font-black text-beige-900 mt-0.5">{activeBooking.tokenId}</p>
                    <p className="text-xs text-beige-600">{activeBooking.farmerName} • {activeBooking.centerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-leaf-50 text-leaf-700 text-xs font-bold rounded-xl border border-leaf-200">{activeBooking.status}</span>
                    <button onClick={() => setActiveSection("mytoken")} className="px-4 py-2 bg-beige-900 text-beige-50 text-xs font-bold rounded-xl hover:bg-beige-800 transition-colors flex items-center gap-1.5">
                      Track <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* CENTERS */}
          {activeSection === "centers" && (
            <motion.div key="centers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-beige-900">Find Procurement Centre</h2>
                  <p className="text-xs text-beige-600 mt-1">All government-authorised DoCA mandi yards near you</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-beige-400" />
                  <input
                    type="text"
                    placeholder="Search district or centre…"
                    value={centerSearch}
                    onChange={(e) => setCenterSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-beige-300 rounded-xl text-xs text-beige-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCenters.map((center) => {
                  const load = Math.round((center.currentBookings / center.capacityPerDay) * 100);
                  const full = load >= 90;
                  return (
                    <div key={center.id} className="bg-white border border-beige-200 rounded-2xl p-5 shadow-card hover:shadow-soft transition-all space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-start">
                          <div className="p-2.5 bg-wheat-100 rounded-xl text-beige-900 mt-0.5">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-beige-900 text-sm leading-tight">{center.name}</h3>
                            <p className="text-xs text-beige-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-leaf-600" /> {center.address}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${
                          full ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-leaf-50 text-leaf-700 border-leaf-300"
                        }`}>
                          {full ? "High Load" : "Available"}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-beige-700">
                          <span>Slots: {center.currentBookings}/{center.capacityPerDay}</span>
                          <span className={full ? "text-amber-800 font-bold" : "text-leaf-700 font-bold"}>{load}%</span>
                        </div>
                        <div className="w-full h-2 bg-beige-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${full ? "bg-amber-500" : "bg-leaf-600"}`} style={{ width: `${Math.min(load, 100)}%` }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-beige-600 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{center.operatingHours}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Wait: {center.avgWaitMins}m</span>
                        </div>
                        <button
                          onClick={() => onOpenBookSlot(center.id)}
                          className="px-3.5 py-1.5 bg-beige-900 hover:bg-beige-800 text-beige-50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          Book Here <ArrowRight className="w-3 h-3 text-wheat-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* MY TOKEN */}
          {activeSection === "mytoken" && (
            <motion.div key="mytoken" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              {!activeBooking ? (
                <div className="text-center py-20 space-y-4 bg-white rounded-2xl border border-beige-200">
                  <AlertCircle className="w-12 h-12 text-beige-400 mx-auto" />
                  <p className="font-bold text-beige-900">No active token found</p>
                  <p className="text-xs text-beige-600">Register as a farmer and book a slot to issue your procurement token.</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={onOpenRegister} className="px-4 py-2 bg-beige-900 text-beige-50 text-xs font-bold rounded-xl">Register</button>
                    <button onClick={() => onOpenBookSlot()} className="px-4 py-2 bg-beige-100 text-beige-900 text-xs font-bold rounded-xl">Book Slot</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-beige-900 text-beige-50 rounded-3xl p-8 relative overflow-hidden shadow-soft">
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2 text-wheat-400 text-xs font-semibold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        Live Queue Token
                      </div>
                      <div className="flex flex-wrap justify-between items-end gap-4">
                        <div>
                          <p className="text-5xl font-black text-amber-300 tracking-tight">{activeBooking.tokenId}</p>
                          <p className="text-beige-100 text-sm mt-1">{activeBooking.farmerName}</p>
                          <p className="text-beige-300 text-xs">{activeBooking.centerName}</p>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                            <p className="text-[10px] text-beige-300">Est. Wait</p>
                            <p className="text-xl font-bold text-amber-300">{activeBooking.estimatedWaitTimeMins ?? 15} min</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                            <p className="text-[10px] text-beige-300">Counter</p>
                            <p className="text-sm font-bold text-beige-100">{activeBooking.currentCounter ?? "Counter #1"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-beige-800">
                        <div className="flex justify-between">
                          {STEPS.map((step, idx) => {
                            const past = idx <= stepIdx;
                            const current = idx === stepIdx;
                            const Icon = step.icon;
                            return (
                              <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                                  current ? "bg-amber-400 border-amber-300 text-beige-950 font-bold scale-110 shadow-md"
                                          : past ? "bg-white/20 border-white/40 text-white"
                                          : "bg-transparent border-white/20 text-white/30"
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <p className={`text-[9px] font-semibold text-center leading-tight max-w-12 ${past ? "text-beige-100" : "text-beige-500"}`}>{step.label}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* PAYMENT */}
          {activeSection === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              {!myPayment ? (
                <div className="text-center py-20 space-y-4 bg-white rounded-2xl border border-beige-200">
                  <Banknote className="w-12 h-12 text-beige-400 mx-auto" />
                  <p className="font-bold text-beige-900">No payment record yet</p>
                  <p className="text-xs text-beige-600">Payment will be displayed after quality inspection and weighing.</p>
                </div>
              ) : (
                <div className="bg-white border border-beige-200 rounded-2xl p-6 shadow-card space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-beige-600 font-semibold uppercase tracking-wider">MSP Payment Statement</p>
                      <p className="text-3xl font-black text-beige-900 mt-1">{formatCurrency(myPayment.totalAmount)}</p>
                      <p className="text-xs text-beige-600 mt-0.5">at ₹{myPayment.mspRatePerQuintal}/Qt MSP Rate</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-leaf-50 text-leaf-700 border border-leaf-200">
                      {myPayment.paymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
