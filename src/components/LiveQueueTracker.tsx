"use client";

import React, { useState } from "react";
import { SlotBooking, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FastForward, CheckCircle2, Volume2, Calendar, UserPlus, RefreshCw, AlertCircle } from "lucide-react";

interface LiveQueueTrackerProps {
  lang: Language;
  bookings: SlotBooking[];
  onAdvanceQueue: (bookingId: string) => void;
  onBookSlotClick?: () => void;
  onRegisterClick?: () => void;
}

export const LiveQueueTracker: React.FC<LiveQueueTrackerProps> = ({
  lang,
  bookings,
  onAdvanceQueue,
  onBookSlotClick,
  onRegisterClick,
}) => {
  const t = translations[lang];

  const activeBookings = bookings.filter((b) => b.status !== "Completed" && b.status !== "Cancelled");
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    activeBookings[0]?.id || bookings[0]?.id || ""
  );

  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || activeBookings[0] || bookings[0];

  const steps = [
    { key: "Booked", label: "1. Slot Confirmed" },
    { key: "In-Queue", label: "2. Counter Arrival" },
    { key: "Inspected", label: "3. Quality Pass (Grade A)" },
    { key: "Weighed", label: "4. Weighbridge Gross" },
    { key: "Completed", label: "5. DBT Payment Settled" },
  ];

  const getStepIndex = (status: SlotBooking["status"]) => {
    switch (status) {
      case "Booked": return 0;
      case "In-Queue": return 1;
      case "Inspected": return 2;
      case "Weighed": return 3;
      case "Completed": return 4;
      default: return 0;
    }
  };

  const currentStepIdx = currentBooking ? getStepIndex(currentBooking.status) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Ticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-beige-900 via-beige-800 to-amber-900 text-beige-50 rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Clock className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-wheat-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {t.currentTokenHeading}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              {currentBooking ? `Token ${currentBooking.tokenId}` : "Mandi Desk Active"}
            </h2>
            <p className="text-xs text-beige-300 mt-1">
              {currentBooking ? `${currentBooking.farmerName} • ${currentBooking.centerName}` : "Register a farmer & book a slot to issue a live token."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right">
              <p className="text-[11px] text-beige-300 font-medium">{t.estWait}</p>
              <p className="text-xl font-bold text-emerald-300">
                {currentBooking?.estimatedWaitTimeMins ?? 15} {t.minutes}
              </p>
            </div>

            {currentBooking && currentBooking.status !== "Completed" && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onAdvanceQueue(currentBooking.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wheat-500 hover:bg-wheat-600 text-beige-900 font-bold text-xs shadow-md transition-all"
                title="Simulate queue counter progression"
              >
                <FastForward className="w-4 h-4" />
                <span>Next Counter Stage</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Live Queue Progress Stepper */}
        {currentBooking ? (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isCurrent
                        ? "bg-white text-beige-900 border-white shadow-md scale-102"
                        : isPassed
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-white/5 text-beige-400 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] opacity-80">Stage {idx + 1}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="leading-tight">{step.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Main Queue Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Selector & Live Waiting List */}
        <div className="bg-white p-5 rounded-2xl border border-beige-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-beige-900">{t.queueTitle}</h3>
            <span className="text-xs bg-beige-100 text-beige-700 px-2 py-0.5 rounded-full font-semibold">
              {bookings.length} Tokens Total
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="py-8 text-center space-y-3 text-beige-500 text-xs">
              <AlertCircle className="w-8 h-8 text-wheat-500 mx-auto" />
              <p className="font-semibold text-beige-800">{t.emptyBookingsMsg}</p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onRegisterClick}
                  className="w-full py-2 rounded-xl bg-beige-100 hover:bg-beige-200 text-beige-900 font-bold text-xs"
                >
                  + {t.btnRegisterFarmer}
                </button>
                <button
                  onClick={onBookSlotClick}
                  className="w-full py-2 rounded-xl bg-beige-900 hover:bg-beige-800 text-white font-bold text-xs"
                >
                  + {t.btnBookSlot}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              <AnimatePresence>
                {bookings.map((booking) => {
                  const isSelected = booking.id === selectedBookingId;
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-wheat-50 border-wheat-400 shadow-sm"
                          : "bg-beige-50/50 border-beige-200 hover:border-beige-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-beige-900">
                              {booking.tokenId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                booking.status === "Completed"
                                  ? "bg-leaf-50 text-leaf-700 border-leaf-300"
                                  : "bg-amber-50 text-amber-900 border-amber-300"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-beige-800 mt-1">
                            {booking.farmerName}
                          </p>
                          <p className="text-[11px] text-beige-600 truncate max-w-[200px]">
                            {booking.centerName}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700 block">
                            {booking.estimatedWaitTimeMins ? `${booking.estimatedWaitTimeMins} min` : "Done"}
                          </span>
                          <span className="text-[10px] text-beige-500 font-mono">
                            {booking.timeSlot.split("-")[0]}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Selected Token Live Details Panel */}
        {currentBooking ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl border border-beige-200 shadow-card space-y-6"
          >
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-beige-200 gap-2">
              <div>
                <span className="text-xs font-bold text-wheat-700 uppercase tracking-wider">
                  Token Verification Card
                </span>
                <h3 className="text-xl font-extrabold text-beige-900 mt-0.5">
                  {currentBooking.farmerName} ({currentBooking.tokenId})
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="bg-wheat-100 text-beige-900 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-wheat-300">
                  Counter: {currentBooking.currentCounter || "Counter #1"}
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-beige-50 p-3 rounded-xl border border-beige-200">
                <span className="text-[11px] text-beige-600 block">{t.tokensAhead}</span>
                <span className="text-lg font-bold text-beige-900">
                  {currentBooking.queuePosition || 0}
                </span>
              </div>

              <div className="bg-beige-50 p-3 rounded-xl border border-beige-200">
                <span className="text-[11px] text-beige-600 block">{t.estWait}</span>
                <span className="text-lg font-bold text-emerald-700">
                  {currentBooking.estimatedWaitTimeMins || 0} Mins
                </span>
              </div>

              <div className="bg-beige-50 p-3 rounded-xl border border-beige-200">
                <span className="text-[11px] text-beige-600 block">Declared Crop</span>
                <span className="text-lg font-bold text-beige-900">
                  {currentBooking.cropType}
                </span>
              </div>

              <div className="bg-beige-50 p-3 rounded-xl border border-beige-200">
                <span className="text-[11px] text-beige-600 block">Est Quantity</span>
                <span className="text-lg font-bold text-beige-900">
                  {currentBooking.estimatedQuantityQuintals} Qt
                </span>
              </div>
            </div>

            {/* Audio Prompt */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900">
                  NIC SMS & Mandi Public Announcement Active
                </p>
                <p className="text-amber-800 leading-relaxed">
                  {lang === 'hi' 
                    ? `किसान ${currentBooking.farmerName}, आपका टोकन ${currentBooking.tokenId} नंबर पर है। कृपया अपनी तौल रसीद एवं आधार कार्ड के साथ तैयार रहें।`
                    : `Farmer ${currentBooking.farmerName}, Token ${currentBooking.tokenId} is queued. Please report to Counter #1 with your crop samples.`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => onAdvanceQueue(currentBooking.id)}
                className="px-4 py-2.5 rounded-xl bg-beige-900 text-beige-50 text-xs font-bold hover:bg-beige-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Token Advance</span>
              </button>
            </div>

          </motion.div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 rounded-2xl border border-beige-200 shadow-card text-center text-beige-500 text-xs space-y-3">
            <Calendar className="w-10 h-10 text-wheat-400 mx-auto" />
            <p className="font-semibold text-beige-800">No token selected. Book a slot to view live queue tracking.</p>
          </div>
        )}

      </div>
    </div>
  );
};
