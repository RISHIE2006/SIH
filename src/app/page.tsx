"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Language, UserRole, Farmer, ProcurementCenter, SlotBooking, ProcurementRecord, SmsLog, QualityAssessment, ProcurementOperator } from "@/lib/types";
import { translations } from "@/lib/translations";
import { buildSmsContent } from "@/lib/sms";
import { initialFarmers, initialCenters, initialBookings, initialProcurements, initialSmsLogs, initialOperators } from "@/lib/store";

// ─── Sync helpers ────────────────────────────────────────────────────────────
const SYNC_INTERVAL_MS = 30_000;

function deriveCenterStats(
  centers: ProcurementCenter[],
  bookings: SlotBooking[]
): ProcurementCenter[] {
  return centers.map((center) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const centerBookings = bookings.filter(
      (b) => b.centerId === center.id && b.date === todayStr
    );
    const liveBookings = centerBookings.filter(
      (b) => b.status !== "Completed" && b.status !== "Cancelled"
    );
    const currentBookings = centerBookings.filter(
      (b) => b.status !== "Cancelled"
    ).length;
    const liveQueueLength = liveBookings.length;
    const loadRatio = currentBookings / center.capacityPerDay;
    let status: ProcurementCenter["status"] = "Open";
    if (loadRatio >= 1) status = "Full";
    else if (loadRatio >= 0.85) status = "Closing Soon";
    const avgWaitMins =
      liveQueueLength > 0
        ? Math.max(5, Math.round(liveQueueLength * 3.5))
        : center.avgWaitMins;
    return { ...center, currentBookings, liveQueueLength, status, avgWaitMins };
  });
}

function deriveOperatorStats(
  operators: ProcurementOperator[],
  bookings: SlotBooking[],
  procurements: ProcurementRecord[]
): ProcurementOperator[] {
  return operators.map((op) => {
    const currentQueue = bookings.filter(
      (b) =>
        b.centerId === op.centerId &&
        (b.status === "In-Queue" || b.status === "Booked")
    ).length;
    const farmersProcessed = procurements.filter((p) =>
      p.centerName.startsWith(op.centerName.split(" ")[0])
    ).length;
    return {
      ...op,
      currentQueue,
      farmersProcessed,
      lastActive: new Date().toISOString(),
    };
  });
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsOverview } from "@/components/StatsOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { FarmerRegistrationModal } from "@/components/FarmerRegistrationModal";
import { SlotBookingModal } from "@/components/SlotBookingModal";
import { LiveQueueTracker } from "@/components/LiveQueueTracker";
import { ProcurementTracker } from "@/components/ProcurementTracker";
import { CenterFinder } from "@/components/CenterFinder";
import { SmsNotificationDrawer } from "@/components/SmsNotificationDrawer";
import { AdminCounterPanel } from "@/components/AdminCounterPanel";

import { FarmerDashboard } from "@/components/FarmerDashboard";
import { OperatorDashboard } from "@/components/OperatorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

import { motion } from "framer-motion";
import { Calendar, Clock, MessageSquare, Banknote, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [currentRole, setCurrentRole] = useState<UserRole>("farmer");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // State initialized with empty production data (persisted in localStorage)
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [centers, setCenters] = useState<ProcurementCenter[]>(initialCenters);
  const [bookings, setBookings] = useState<SlotBooking[]>(initialBookings);
  const [procurements, setProcurements] = useState<ProcurementRecord[]>(initialProcurements);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(initialSmsLogs);
  const [operators, setOperators] = useState<ProcurementOperator[]>(initialOperators);

  // Refs for stale-closure-safe access inside interval
  const bookingsRef = useRef(bookings);
  const procurementsRef = useRef(procurements);
  const centersRef = useRef(centers);
  const operatorsRef = useRef(operators);
  useEffect(() => { bookingsRef.current = bookings; }, [bookings]);
  useEffect(() => { procurementsRef.current = procurements; }, [procurements]);
  useEffect(() => { centersRef.current = centers; }, [centers]);
  useEffect(() => { operatorsRef.current = operators; }, [operators]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const storedFarmers = localStorage.getItem("krishisetu_farmers");
      const storedBookings = localStorage.getItem("krishisetu_bookings");
      const storedProcurements = localStorage.getItem("krishisetu_procurements");
      const storedSms = localStorage.getItem("krishisetu_sms");
      const storedCenters = localStorage.getItem("krishisetu_centers");
      const storedOperators = localStorage.getItem("krishisetu_operators");

      if (storedFarmers) setFarmers(JSON.parse(storedFarmers));
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedProcurements) setProcurements(JSON.parse(storedProcurements));
      if (storedSms) setSmsLogs(JSON.parse(storedSms));
      if (storedCenters) {
        const persisted: ProcurementCenter[] = JSON.parse(storedCenters);
        const merged = initialCenters.map((ic) => {
          const found = persisted.find((pc) => pc.id === ic.id);
          return found ? { ...ic, ...found } : ic;
        });
        setCenters(merged);
      }
      if (storedOperators) {
        const persisted: ProcurementOperator[] = JSON.parse(storedOperators);
        const merged = initialOperators.map((io) => {
          const found = persisted.find((po) => po.id === io.id);
          return found ? { ...io, ...found } : io;
        });
        setOperators(merged);
      }
    } catch {
      console.warn("[KrishiSetu] LocalStorage initial load failed, using defaults");
    }
  }, []);

  // ── Persistent save helpers ────────────────────────────────────────────────
  const saveFarmers = useCallback((newFarmers: Farmer[]) => {
    setFarmers(newFarmers);
    try { localStorage.setItem("krishisetu_farmers", JSON.stringify(newFarmers)); } catch { /* quota */ }
  }, []);

  const saveBookings = useCallback((newBookings: SlotBooking[]) => {
    setBookings(newBookings);
    try { localStorage.setItem("krishisetu_bookings", JSON.stringify(newBookings)); } catch { /* quota */ }
  }, []);

  const saveProcurements = useCallback((newProc: ProcurementRecord[]) => {
    setProcurements(newProc);
    try { localStorage.setItem("krishisetu_procurements", JSON.stringify(newProc)); } catch { /* quota */ }
  }, []);

  const saveSms = useCallback((newSmsLogs: SmsLog[]) => {
    setSmsLogs(newSmsLogs);
    try { localStorage.setItem("krishisetu_sms", JSON.stringify(newSmsLogs)); } catch { /* quota */ }
  }, []);

  const saveCenters = useCallback((newCenters: ProcurementCenter[]) => {
    setCenters(newCenters);
    try { localStorage.setItem("krishisetu_centers", JSON.stringify(newCenters)); } catch { /* quota */ }
  }, []);

  const saveOperators = useCallback((newOps: ProcurementOperator[]) => {
    setOperators(newOps);
    try { localStorage.setItem("krishisetu_operators", JSON.stringify(newOps)); } catch { /* quota */ }
  }, []);

  // ── Auto-sync: derive center & operator stats from live bookings ───────────
  const syncData = useCallback(() => {
    const latestBookings = bookingsRef.current;
    const latestProcurements = procurementsRef.current;
    const latestCenters = centersRef.current;
    const latestOperators = operatorsRef.current;

    const updatedCenters = deriveCenterStats(latestCenters, latestBookings);
    const updatedOperators = deriveOperatorStats(latestOperators, latestBookings, latestProcurements);

    const centersChanged = JSON.stringify(updatedCenters) !== JSON.stringify(latestCenters);
    const opsChanged = JSON.stringify(updatedOperators) !== JSON.stringify(latestOperators);

    if (centersChanged) saveCenters(updatedCenters);
    if (opsChanged) saveOperators(updatedOperators);

    setLastSyncedAt(new Date().toISOString());
  }, [saveCenters, saveOperators]);

  useEffect(() => {
    const initial = setTimeout(() => syncData(), 600);
    const interval = setInterval(() => syncData(), SYNC_INTERVAL_MS);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [syncData]);

  // Seed sample demo data for quick evaluator testing
  const handleSeedDemoData = () => {
    const sampleFarmer: Farmer = {
      id: "FARM-101",
      name: "Rameshwar Prasad Sharma",
      phone: "+91 98765 43210",
      aadhaar: "XXXX-XXXX-4821",
      state: "Uttar Pradesh",
      district: "Baghpat",
      village: "Baraut",
      landSizeAcres: 5.5,
      cropType: "Wheat",
      bankAccount: "38910029103",
      ifscCode: "SBIN0001842",
      verified: true
    };

    const sampleBooking: SlotBooking = {
      id: "BOOK-801",
      tokenId: "TK-104",
      farmerId: "FARM-101",
      farmerName: "Rameshwar Prasad Sharma",
      farmerPhone: "+91 98765 43210",
      centerId: "CTR-01",
      centerName: "Baraut Central Grain Mandi (DoCA Yard #1)",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "10:00 AM - 11:30 AM",
      cropType: "Wheat",
      estimatedQuantityQuintals: 45,
      status: "In-Queue",
      currentCounter: "Counter #1",
      queuePosition: 2,
      estimatedWaitTimeMins: 14,
      createdAt: new Date().toISOString()
    };

    const sampleSms: SmsLog = {
      id: "SMS-1001",
      phone: "+91 98765 43210",
      message: "Dear Rameshwar Prasad Sharma, your procurement slot is confirmed on KrishiSetu. Token: TK-104, Center: Baraut Central Grain Mandi, Time: 10:00 AM - 11:30 AM.",
      sentAt: new Date().toISOString(),
      type: "Booking Confirmation",
      status: "Delivered"
    };

    saveFarmers([sampleFarmer]);
    saveBookings([sampleBooking]);
    saveSms([sampleSms]);
    alert("Official sample farmer & token data loaded for demonstration!");
  };

  // Clear data back to empty state
  const handleClearData = () => {
    saveFarmers([]);
    saveBookings([]);
    saveProcurements([]);
    saveSms([]);
    saveCenters(initialCenters);
    saveOperators(initialOperators);
    try {
      localStorage.removeItem("krishisetu_farmers");
      localStorage.removeItem("krishisetu_bookings");
      localStorage.removeItem("krishisetu_procurements");
      localStorage.removeItem("krishisetu_sms");
      localStorage.removeItem("krishisetu_centers");
      localStorage.removeItem("krishisetu_operators");
    } catch { /* quota */ }
    alert("All test data cleared. System reset to fresh state.");
  };

  // Modals & Drawers
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBookSlotOpen, setIsBookSlotOpen] = useState(false);
  const [isSmsDrawerOpen, setIsSmsDrawerOpen] = useState(false);

  const t = translations[lang];

  // Helper to add SMS alert log
  const dispatchSms = (
    phone: string,
    message: string,
    type: SmsLog["type"]
  ) => {
    const newSms: SmsLog = {
      id: `SMS-${Math.floor(1004 + Math.random() * 9000)}`,
      phone,
      message,
      sentAt: new Date().toISOString(),
      type,
      status: "Delivered",
    };
    saveSms([newSms, ...smsLogs]);
  };

  // Register New Farmer
  const handleRegisterFarmer = (farmer: Farmer) => {
    saveFarmers([farmer, ...farmers]);
    
    // Dispatch Registration SMS
    const msg = lang === "hi"
      ? `प्रिय ${farmer.name}, कृषि सेतु पर आपका किसान पंजीकरण (आधार सत्यापित) सफल हुआ। अब आप अपने नजदीकी केंद्र पर स्लॉट बुक कर सकते हैं।`
      : `Dear ${farmer.name}, your farmer registration on KrishiSetu is successful. You can now book crop procurement slots.`;
    
    dispatchSms(farmer.phone, msg, "Booking Confirmation");
  };

  // Book New Procurement Slot
  const handleBookSlot = (booking: SlotBooking) => {
    const updatedBookings = [booking, ...bookings];
    saveBookings(updatedBookings);

    // Update center bookings count and persist
    const updatedCenters = centers.map((c) =>
      c.id === booking.centerId
        ? { ...c, currentBookings: c.currentBookings + 1, liveQueueLength: c.liveQueueLength + 1 }
        : c
    );
    saveCenters(updatedCenters);

    // Dispatch Slot SMS
    const msg = buildSmsContent(
      "Booking Confirmation",
      {
        farmerName: booking.farmerName,
        tokenNo: booking.tokenId,
        centerName: booking.centerName,
        date: booking.date,
        timeSlot: booking.timeSlot,
      },
      lang
    );
    dispatchSms(booking.farmerPhone, msg, "Booking Confirmation");
  };

  // Advance Queue Counter Stage
  const handleAdvanceQueue = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id !== bookingId) return b;

      let nextStatus: SlotBooking["status"] = b.status;
      let nextCounter = b.currentCounter;
      let nextWait = b.estimatedWaitTimeMins;

      if (b.status === "Booked") {
        nextStatus = "In-Queue";
        nextCounter = "Counter #1";
        nextWait = 14;
      } else if (b.status === "In-Queue") {
        nextStatus = "Inspected";
        nextCounter = "Quality Testing Desk #1";
        nextWait = 8;
      } else if (b.status === "Inspected") {
        nextStatus = "Weighed";
        nextCounter = "Digital Weighbridge #2";
        nextWait = 3;
      } else if (b.status === "Weighed") {
        nextStatus = "Completed";
        nextCounter = "DBT Payment Counter";
        nextWait = 0;
      }

      // Send Queue SMS notification
      const alertMsg = buildSmsContent(
        "Queue Alert",
        {
          farmerName: b.farmerName,
          tokenNo: b.tokenId,
          centerName: b.centerName,
          tokensAhead: Math.max(0, (b.queuePosition || 2) - 1),
        },
        lang
      );
      dispatchSms(b.farmerPhone, alertMsg, "Queue Alert");

      return {
        ...b,
        status: nextStatus,
        currentCounter: nextCounter,
        queuePosition: Math.max(0, (b.queuePosition || 2) - 1),
        estimatedWaitTimeMins: nextWait,
      };
    });

    saveBookings(updated);
  };

  // Process Inspection in Admin Counter Desk
  const handleProcessInspection = (
    bookingId: string,
    assessment: QualityAssessment,
    netWeight: number
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const mspRate = booking.cropType.toLowerCase().includes("paddy") ? 2300 : 2275;
    const totalAmount = Math.round(netWeight * mspRate);

    const newProcurement: ProcurementRecord = {
      id: `PROC-${Math.floor(903 + Math.random() * 900)}`,
      bookingId,
      tokenId: booking.tokenId,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      farmerPhone: booking.farmerPhone,
      centerName: booking.centerName,
      cropType: booking.cropType,
      assessment,
      grossWeightQuintals: netWeight + 0.8,
      netWeightQuintals: netWeight,
      mspRatePerQuintal: mspRate,
      totalAmount,
      paymentStatus: "Approved",
      processedAt: new Date().toISOString(),
    };

    saveProcurements([newProcurement, ...procurements]);

    // Update booking status
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "Inspected" as SlotBooking["status"] } : b
    );
    saveBookings(updatedBookings);

    // Trigger SMS
    const msg = buildSmsContent(
      "Inspection Update",
      {
        farmerName: booking.farmerName,
        tokenNo: booking.tokenId,
        centerName: booking.centerName,
      },
      lang
    );
    dispatchSms(booking.farmerPhone, msg, "Inspection Update");
  };

  // Disburse DBT Payment
  const handleDisbursePayment = (bookingId: string) => {
    const proc = procurements.find((p) => p.bookingId === bookingId) || procurements[0];
    if (!proc) return;

    const dbtRef = `DBT20260830${Math.floor(10000 + Math.random() * 90000)}`;

    const updatedProc = procurements.map((p) =>
      p.id === proc.id
        ? { ...p, paymentStatus: "Credited" as ProcurementRecord["paymentStatus"], dbtRefNo: dbtRef }
        : p
    );
    saveProcurements(updatedProc);

    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "Completed" as SlotBooking["status"] } : b
    );
    saveBookings(updatedBookings);

    // Trigger Credit SMS
    const sms = buildSmsContent(
      "Payment Credit",
      {
        farmerName: proc.farmerName,
        tokenNo: proc.tokenId,
        centerName: proc.centerName,
        amount: proc.totalAmount,
        dbtRefNo: dbtRef,
      },
      lang
    );
    dispatchSms(proc.farmerPhone, sms, "Payment Credit");

    alert(`Direct Benefit Transfer (DBT) payment of ₹${proc.totalAmount.toLocaleString('en-IN')} successfully credited!`);
  };

  const totalPayoutSum = procurements.reduce((sum, p) => sum + p.totalAmount, 0);
  // Format last-synced time for display
  const syncLabel = lastSyncedAt
    ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
    : "Syncing…";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === "en" ? "hi" : "en")}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        smsCount={smsLogs.length}
        onOpenSms={() => setIsSmsDrawerOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onSeedDemoData={handleSeedDemoData}
        onClearData={handleClearData}
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
      />

      {/* Live Sync Status Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-2">
        <div className="flex items-center gap-2 text-[10px] text-beige-500 font-mono">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              lastSyncedAt ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-ping"
            }`}
          />
          <span>{syncLabel}</span>
          <span className="text-beige-400">•</span>
          <span>{farmers.length} Farmers</span>
          <span className="text-beige-400">•</span>
          <span>{centers.length} Centers</span>
          <span className="text-beige-400">•</span>
          <span>{operators.length} Operators</span>
          <button
            onClick={syncData}
            className="ml-2 px-2 py-0.5 rounded bg-beige-100 hover:bg-beige-200 text-beige-700 font-sans font-semibold transition-colors"
            title="Force sync now"
          >
            ↺ Sync Now
          </button>
        </div>
      </div>

      {/* Role-Specific Main Content */}
      <main className="flex-1 w-full mx-auto">
        {currentRole === "farmer" && (
          <FarmerDashboard
            lang={lang}
            farmers={farmers}
            centers={centers}
            bookings={bookings}
            procurements={procurements}
            smsLogs={smsLogs}
            lastSyncedAt={lastSyncedAt}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenBookSlot={(centerId) => setIsBookSlotOpen(true)}
            onOpenSms={() => setIsSmsDrawerOpen(true)}
            syncData={syncData}
          />
        )}

        {currentRole === "operator" && (
          <OperatorDashboard
            lang={lang}
            bookings={bookings}
            operators={operators}
            centers={centers}
            procurements={procurements}
            lastSyncedAt={lastSyncedAt}
            onAdvanceQueue={handleAdvanceQueue}
            onProcessInspection={handleProcessInspection}
            onDisbursePayment={handleDisbursePayment}
            syncData={syncData}
          />
        )}

        {currentRole === "admin" && (
          <AdminDashboard
            lang={lang}
            centers={centers}
            operators={operators}
            bookings={bookings}
            procurements={procurements}
            farmers={farmers}
            smsLogs={smsLogs}
            lastSyncedAt={lastSyncedAt}
            syncData={syncData}
            onUpdateCenterStatus={(centerId, status) => {
              const updated = centers.map((c) => (c.id === centerId ? { ...c, status } : c));
              saveCenters(updated);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Modals & Drawers */}
      <FarmerRegistrationModal
        lang={lang}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterFarmer}
      />

      <SlotBookingModal
        lang={lang}
        isOpen={isBookSlotOpen}
        onClose={() => setIsBookSlotOpen(false)}
        farmers={farmers}
        centers={centers}
        onBookSlot={handleBookSlot}
        onOpenRegister={() => {
          setIsBookSlotOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <SmsNotificationDrawer
        lang={lang}
        isOpen={isSmsDrawerOpen}
        onClose={() => setIsSmsDrawerOpen(false)}
        smsLogs={smsLogs}
      />

    </div>
  );
}


