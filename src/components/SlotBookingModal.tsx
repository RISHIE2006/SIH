"use client";

import React, { useState } from "react";
import { Farmer, ProcurementCenter, SlotBooking, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { X, Calendar, Clock, MapPin, QrCode, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface SlotBookingModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  farmers: Farmer[];
  centers: ProcurementCenter[];
  onBookSlot: (booking: SlotBooking) => void;
  onOpenRegister: () => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  lang,
  isOpen,
  onClose,
  farmers,
  centers,
  onBookSlot,
  onOpenRegister,
}) => {
  const t = translations[lang];

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || "");
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || "");
  const [date, setDate] = useState("2026-08-31");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 10:30 AM");
  const [cropType, setCropType] = useState("Wheat");
  const [estimatedQuantity, setEstimatedQuantity] = useState("50");

  const [createdBooking, setCreatedBooking] = useState<SlotBooking | null>(null);

  if (!isOpen) return null;

  const currentCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];
  const selectedFarmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer || !currentCenter) return;

    const tokenNum = Math.floor(106 + Math.random() * 80);
    const newBooking: SlotBooking = {
      id: `BOOK-${Math.floor(804 + Math.random() * 900)}`,
      tokenId: `TK-${tokenNum}`,
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      centerId: currentCenter.id,
      centerName: currentCenter.name,
      date,
      timeSlot,
      cropType: cropType || selectedFarmer.cropType,
      estimatedQuantityQuintals: parseFloat(estimatedQuantity) || 50,
      status: "In-Queue",
      currentCounter: "Counter #1",
      queuePosition: Math.floor(Math.random() * 4) + 1,
      estimatedWaitTimeMins: Math.floor(Math.random() * 15) + 10,
      createdAt: new Date().toISOString(),
    };

    onBookSlot(newBooking);
    setCreatedBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beige-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-beige-200 rounded-2xl max-w-lg w-full p-6 shadow-glass relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-beige-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-leaf-100 text-leaf-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-beige-900 leading-none">
                {t.bookTitle}
              </h3>
              <p className="text-xs text-beige-600 mt-1">{t.bookDesc}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setCreatedBooking(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-beige-500 hover:text-beige-900 hover:bg-beige-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdBooking ? (
          /* Token Ticket Card */
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-leaf-50 border border-leaf-500/30 text-leaf-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            
            <h4 className="text-lg font-bold text-beige-900">{t.slotSuccessTitle}</h4>

            {/* Token Badge */}
            <div className="bg-wheat-50 border-2 border-dashed border-wheat-300 rounded-2xl p-5 max-w-sm mx-auto space-y-3">
              <div className="flex justify-between items-center text-xs text-beige-600 font-medium">
                <span>{t.appName} Token Ticket</span>
                <span className="font-mono">{createdBooking.id}</span>
              </div>

              <div className="py-2">
                <span className="text-3xl font-black text-beige-900 tracking-wider font-mono">
                  {createdBooking.tokenId}
                </span>
                <p className="text-xs font-semibold text-leaf-700 mt-1">
                  Queue Position: #{createdBooking.queuePosition} (Est. {createdBooking.estimatedWaitTimeMins} Mins)
                </p>
              </div>

              <div className="text-xs text-left border-t border-wheat-200 pt-3 space-y-1 text-beige-800">
                <p><strong>Farmer:</strong> {createdBooking.farmerName}</p>
                <p><strong>Center:</strong> {createdBooking.centerName}</p>
                <p><strong>Window:</strong> {createdBooking.date} ({createdBooking.timeSlot})</p>
                <p><strong>Crop:</strong> {createdBooking.cropType} ({createdBooking.estimatedQuantityQuintals} Qt)</p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-beige-600 font-mono">
                <QrCode className="w-4 h-4 text-beige-800" /> [Digital QR Verified]
              </div>
            </div>

            <p className="text-xs text-beige-600">
              An SMS with token reference has been dispatched to {createdBooking.farmerPhone}.
            </p>

            <button
              onClick={() => {
                setCreatedBooking(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-beige-900 text-white text-xs font-bold hover:bg-beige-800 transition-colors"
            >
              Done & View Live Queue
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="mt-4 space-y-4 text-xs">
            
            {/* Farmer Select */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-beige-800">{t.selectFarmer} *</label>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="text-amber-800 hover:underline font-semibold"
                >
                  + Add New Farmer
                </button>
              </div>
              {farmers.length > 0 ? (
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district} • {f.phone})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                  No farmers registered yet. Click above to register.
                </p>
              )}
            </div>

            {/* Center Select */}
            <div>
              <label className="block font-semibold text-beige-800 mb-1">{t.selectCenter} *</label>
              <select
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
                className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - [{c.district}] ({c.currentBookings}/{c.capacityPerDay} Capacity)
                  </option>
                ))}
              </select>
            </div>

            {/* Congestion Recommendation Badge */}
            {currentCenter && (
              <div className="p-3 bg-wheat-50 border border-wheat-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <div>
                    <span className="font-bold text-beige-900">{currentCenter.name}</span>
                    <p className="text-[11px] text-beige-600">
                      Live Queue: {currentCenter.liveQueueLength} Farmers | Avg Wait: {currentCenter.avgWaitMins} mins
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-leaf-100 text-leaf-700 border border-leaf-500/20">
                  Low Congestion
                </span>
              </div>
            )}

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.selectDate} *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.selectTimeSlot} *</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                >
                  <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM (Morning)</option>
                  <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM (Morning Peak)</option>
                  <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM (Midday)</option>
                  <option value="01:30 PM - 03:00 PM">01:30 PM - 03:00 PM (Afternoon)</option>
                  <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Crop & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.selectCrop}</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.estQuantity}</label>
                <input
                  type="number"
                  required
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-beige-100 text-beige-700 font-semibold hover:bg-beige-200"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={farmers.length === 0}
                className="px-5 py-2 rounded-xl bg-beige-900 text-beige-50 font-semibold hover:bg-beige-800 shadow-sm disabled:opacity-50"
              >
                {t.btnConfirmSlot}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
