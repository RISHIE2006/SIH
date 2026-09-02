"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Language,
  UserRole,
  Farmer,
  ProcurementCenter,
  SlotBooking,
  ProcurementRecord,
  SmsLog,
  ProcurementOperator,
  QualityAssessment,
} from "@/lib/types";
import {
  initialFarmers,
  initialCenters,
  initialBookings,
  initialProcurements,
  initialSmsLogs,
  initialOperators,
} from "@/lib/store";

// How often (ms) the context will re-derive center & operator stats from live bookings
const SYNC_INTERVAL_MS = 30_000;

interface AppContextType {
  // Role & Language
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;

  // Data
  farmers: Farmer[];
  centers: ProcurementCenter[];
  bookings: SlotBooking[];
  procurements: ProcurementRecord[];
  smsLogs: SmsLog[];
  operators: ProcurementOperator[];

  // Last-synced timestamp
  lastSyncedAt: string | null;

  // Farmer Actions
  saveFarmers: (farmers: Farmer[]) => void;
  saveBookings: (bookings: SlotBooking[]) => void;
  saveProcurements: (procurements: ProcurementRecord[]) => void;
  saveSms: (sms: SmsLog[]) => void;
  dispatchSms: (phone: string, message: string, type: SmsLog["type"]) => void;

  // Operator Actions
  advanceQueueStage: (bookingId: string) => void;
  callNextToken: (centerId: string) => SlotBooking | null;
  performInspection: (
    bookingId: string,
    assessment: QualityAssessment,
    netWeight: number
  ) => void;
  markTokenArrived: (bookingId: string) => void;
  initiatePayment: (bookingId: string) => void;

  // Center Management
  setCenters: (centers: ProcurementCenter[]) => void;
  updateCenterStatus: (centerId: string, status: ProcurementCenter["status"]) => void;

  // Manual trigger for sync
  syncData: () => void;

  // Demo
  seedDemoData: () => void;
  resetData: () => void;
  runAutoDemoFlow: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers: derive center & operator stats from current bookings snapshot
// ---------------------------------------------------------------------------

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

    // Derive status
    const loadRatio = currentBookings / center.capacityPerDay;
    let status: ProcurementCenter["status"] = "Open";
    if (loadRatio >= 1) status = "Full";
    else if (loadRatio >= 0.85) status = "Closing Soon";

    // Average wait: 15 min baseline reduced by completed items
    const avgWaitMins = liveQueueLength > 0 ? Math.max(5, Math.round(liveQueueLength * 3.5)) : center.avgWaitMins;

    return {
      ...center,
      currentBookings,
      liveQueueLength,
      status,
      avgWaitMins,
    };
  });
}

function deriveOperatorStats(
  operators: ProcurementOperator[],
  bookings: SlotBooking[],
  procurements: ProcurementRecord[]
): ProcurementOperator[] {
  return operators.map((op) => {
    const opBookings = bookings.filter(
      (b) => b.centerId === op.centerId && (b.status === "In-Queue" || b.status === "Booked")
    );
    const processed = procurements.filter(
      (p) => {
        // Match by center name; rough approximation since we don't store operatorId on record
        return p.centerName.includes(op.centerName.split(" ")[0]);
      }
    ).length;

    return {
      ...op,
      currentQueue: opBookings.length,
      farmersProcessed: processed,
      lastActive: new Date().toISOString(),
    };
  });
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("farmer");
  const [lang, setLang] = useState<Language>("en");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [centers, setCentersState] = useState<ProcurementCenter[]>(initialCenters);
  const [bookings, setBookingsState] = useState<SlotBooking[]>(initialBookings);
  const [procurements, setProcurementsState] = useState<ProcurementRecord[]>(initialProcurements);
  const [smsLogs, setSmsLogsState] = useState<SmsLog[]>(initialSmsLogs);
  const [operators, setOperators] = useState<ProcurementOperator[]>(initialOperators);

  // Refs to latest state for use in interval callbacks (avoids stale closures)
  const bookingsRef = useRef(bookings);
  const procurementsRef = useRef(procurements);
  const centersRef = useRef(centers);
  const operatorsRef = useRef(operators);

  useEffect(() => { bookingsRef.current = bookings; }, [bookings]);
  useEffect(() => { procurementsRef.current = procurements; }, [procurements]);
  useEffect(() => { centersRef.current = centers; }, [centers]);
  useEffect(() => { operatorsRef.current = operators; }, [operators]);

  // ── LocalStorage bootstrap (runs once on mount) ───────────────────────────
  useEffect(() => {
    try {
      const stored = {
        farmers: localStorage.getItem("krishisetu_farmers"),
        bookings: localStorage.getItem("krishisetu_bookings"),
        procurements: localStorage.getItem("krishisetu_procurements"),
        sms: localStorage.getItem("krishisetu_sms"),
        centers: localStorage.getItem("krishisetu_centers"),
        operators: localStorage.getItem("krishisetu_operators"),
      };
      if (stored.farmers) setFarmers(JSON.parse(stored.farmers));
      if (stored.bookings) setBookingsState(JSON.parse(stored.bookings));
      if (stored.procurements) setProcurementsState(JSON.parse(stored.procurements));
      if (stored.sms) setSmsLogsState(JSON.parse(stored.sms));
      // Centers: merge persisted overrides with base config (preserves new centers added later)
      if (stored.centers) {
        const persisted: ProcurementCenter[] = JSON.parse(stored.centers);
        const merged = initialCenters.map((ic) => {
          const found = persisted.find((pc) => pc.id === ic.id);
          return found ? { ...ic, ...found } : ic;
        });
        setCentersState(merged);
      }
      if (stored.operators) {
        const persisted: ProcurementOperator[] = JSON.parse(stored.operators);
        const merged = initialOperators.map((io) => {
          const found = persisted.find((po) => po.id === io.id);
          return found ? { ...io, ...found } : io;
        });
        setOperators(merged);
      }
    } catch {
      console.warn("[KrishiSetu] LocalStorage load failed, using initial state");
    }
  }, []);

  // ── Persistent save wrappers ───────────────────────────────────────────────
  const saveFarmers = useCallback((newFarmers: Farmer[]) => {
    setFarmers(newFarmers);
    try { localStorage.setItem("krishisetu_farmers", JSON.stringify(newFarmers)); } catch { /* quota */ }
  }, []);

  const saveBookings = useCallback((newBookings: SlotBooking[]) => {
    setBookingsState(newBookings);
    try { localStorage.setItem("krishisetu_bookings", JSON.stringify(newBookings)); } catch { /* quota */ }
  }, []);

  const saveProcurements = useCallback((newProc: ProcurementRecord[]) => {
    setProcurementsState(newProc);
    try { localStorage.setItem("krishisetu_procurements", JSON.stringify(newProc)); } catch { /* quota */ }
  }, []);

  const saveSms = useCallback((newSms: SmsLog[]) => {
    setSmsLogsState(newSms);
    try { localStorage.setItem("krishisetu_sms", JSON.stringify(newSms)); } catch { /* quota */ }
  }, []);

  const saveCenters = useCallback((newCenters: ProcurementCenter[]) => {
    setCentersState(newCenters);
    try { localStorage.setItem("krishisetu_centers", JSON.stringify(newCenters)); } catch { /* quota */ }
  }, []);

  const saveOperators = useCallback((newOps: ProcurementOperator[]) => {
    setOperators(newOps);
    try { localStorage.setItem("krishisetu_operators", JSON.stringify(newOps)); } catch { /* quota */ }
  }, []);

  // Public setCenters (used by consumers)
  const setCenters = useCallback((newCenters: ProcurementCenter[]) => {
    saveCenters(newCenters);
  }, [saveCenters]);

  // ── Core sync function ─────────────────────────────────────────────────────
  const syncData = useCallback(() => {
    const latestBookings = bookingsRef.current;
    const latestProcurements = procurementsRef.current;
    const latestCenters = centersRef.current;
    const latestOperators = operatorsRef.current;

    const updatedCenters = deriveCenterStats(latestCenters, latestBookings);
    const updatedOperators = deriveOperatorStats(latestOperators, latestBookings, latestProcurements);

    // Only persist if something actually changed (avoid unnecessary writes)
    const centersChanged = JSON.stringify(updatedCenters) !== JSON.stringify(latestCenters);
    const opsChanged = JSON.stringify(updatedOperators) !== JSON.stringify(latestOperators);

    if (centersChanged) saveCenters(updatedCenters);
    if (opsChanged) saveOperators(updatedOperators);

    setLastSyncedAt(new Date().toISOString());
  }, [saveCenters, saveOperators]);

  // ── Auto-sync interval ────────────────────────────────────────────────────
  useEffect(() => {
    // Run once immediately after mount (after localStorage is loaded)
    const initial = setTimeout(() => syncData(), 500);
    const interval = setInterval(() => syncData(), SYNC_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [syncData]);

  // ── SMS dispatch ───────────────────────────────────────────────────────────
  const dispatchSms = useCallback(
    (phone: string, message: string, type: SmsLog["type"]) => {
      const newSms: SmsLog = {
        id: `SMS-${Math.floor(1004 + Math.random() * 9000)}`,
        phone,
        message,
        sentAt: new Date().toISOString(),
        type,
        status: "Delivered",
      };
      setSmsLogsState((prev) => {
        const updated = [newSms, ...prev];
        try { localStorage.setItem("krishisetu_sms", JSON.stringify(updated)); } catch { /* quota */ }
        return updated;
      });
    },
    []
  );

  // ── Queue actions ──────────────────────────────────────────────────────────
  const advanceQueueStage = useCallback(
    (bookingId: string) => {
      setBookingsState((prev) => {
        const updated = prev.map((b) => {
          if (b.id !== bookingId) return b;

          let nextStatus: SlotBooking["status"] = b.status;
          let nextCounter = b.currentCounter;
          let nextWait = b.estimatedWaitTimeMins || 0;

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

          dispatchSms(
            b.farmerPhone,
            `Token ${b.tokenId} status updated to ${nextStatus}`,
            "Queue Alert"
          );

          return {
            ...b,
            status: nextStatus,
            currentCounter: nextCounter,
            queuePosition: Math.max(0, (b.queuePosition || 2) - 1),
            estimatedWaitTimeMins: nextWait,
          };
        });
        try { localStorage.setItem("krishisetu_bookings", JSON.stringify(updated)); } catch { /* quota */ }
        return updated;
      });
    },
    [dispatchSms]
  );

  const callNextToken = useCallback(
    (centerId: string): SlotBooking | null => {
      let found: SlotBooking | null = null;
      setBookingsState((prev) => {
        const nextBooking = prev.find(
          (b) =>
            b.centerId === centerId &&
            (b.status === "Booked" || b.status === "In-Queue")
        );
        if (nextBooking) {
          found = nextBooking;
          const updated = prev.map((b) =>
            b.id === nextBooking.id
              ? { ...b, status: "In-Queue" as SlotBooking["status"] }
              : b
          );
          try { localStorage.setItem("krishisetu_bookings", JSON.stringify(updated)); } catch { /* quota */ }
          return updated;
        }
        return prev;
      });
      return found;
    },
    []
  );

  const markTokenArrived = useCallback((bookingId: string) => {
    setBookingsState((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId ? { ...b, status: "In-Queue" as SlotBooking["status"] } : b
      );
      try { localStorage.setItem("krishisetu_bookings", JSON.stringify(updated)); } catch { /* quota */ }
      return updated;
    });
  }, []);

  const performInspection = useCallback(
    (bookingId: string, assessment: QualityAssessment, netWeight: number) => {
      setBookingsState((prevBookings) => {
        const booking = prevBookings.find((b) => b.id === bookingId);
        if (!booking) return prevBookings;

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

        setProcurementsState((prevProc) => {
          const updated = [newProcurement, ...prevProc];
          try { localStorage.setItem("krishisetu_procurements", JSON.stringify(updated)); } catch { /* quota */ }
          return updated;
        });

        const updatedBookings = prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: "Inspected" as SlotBooking["status"] } : b
        );
        try { localStorage.setItem("krishisetu_bookings", JSON.stringify(updatedBookings)); } catch { /* quota */ }

        dispatchSms(
          booking.farmerPhone,
          `Inspection completed. Weight: ${netWeight} Qt. Payment pending.`,
          "Inspection Update"
        );

        return updatedBookings;
      });
    },
    [dispatchSms]
  );

  const initiatePayment = useCallback(
    (bookingId: string) => {
      setProcurementsState((prevProc) => {
        const proc = prevProc.find((p) => p.bookingId === bookingId);
        if (!proc) return prevProc;

        const dbtRef = `DBT20260902${Math.floor(10000 + Math.random() * 90000)}`;
        const updatedProc = prevProc.map((p) =>
          p.id === proc.id
            ? {
                ...p,
                paymentStatus: "Credited" as ProcurementRecord["paymentStatus"],
                dbtRefNo: dbtRef,
              }
            : p
        );
        try { localStorage.setItem("krishisetu_procurements", JSON.stringify(updatedProc)); } catch { /* quota */ }

        setBookingsState((prevBookings) => {
          const updatedBookings = prevBookings.map((b) =>
            b.id === bookingId ? { ...b, status: "Completed" as SlotBooking["status"] } : b
          );
          try { localStorage.setItem("krishisetu_bookings", JSON.stringify(updatedBookings)); } catch { /* quota */ }
          return updatedBookings;
        });

        dispatchSms(
          proc.farmerPhone,
          `DBT payment ₹${proc.totalAmount} credited. Reference: ${dbtRef}`,
          "Payment Credit"
        );

        return updatedProc;
      });
    },
    [dispatchSms]
  );

  const updateCenterStatus = useCallback(
    (centerId: string, status: ProcurementCenter["status"]) => {
      setCentersState((prev) => {
        const updated = prev.map((c) => (c.id === centerId ? { ...c, status } : c));
        try { localStorage.setItem("krishisetu_centers", JSON.stringify(updated)); } catch { /* quota */ }
        return updated;
      });
    },
    []
  );

  // ── Demo helpers ───────────────────────────────────────────────────────────
  const seedDemoData = useCallback(() => {
    const demoFarmer: Farmer = {
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
      verified: true,
    };

    const demoBooking: SlotBooking = {
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
      status: "Booked",
      currentCounter: "Counter #1",
      queuePosition: 2,
      estimatedWaitTimeMins: 14,
      createdAt: new Date().toISOString(),
    };

    const demoSms: SmsLog = {
      id: "SMS-1001",
      phone: "+91 98765 43210",
      message: "Slot confirmed: TK-104 at Baraut Centre, 10:00 AM today",
      sentAt: new Date().toISOString(),
      type: "Booking Confirmation",
      status: "Delivered",
    };

    saveFarmers([demoFarmer]);
    saveBookings([demoBooking]);
    saveSms([demoSms]);

    // Update center to reflect booking
    setCentersState((prev) => {
      const updated = prev.map((c) =>
        c.id === "CTR-01" ? { ...c, currentBookings: 1, liveQueueLength: 1 } : c
      );
      try { localStorage.setItem("krishisetu_centers", JSON.stringify(updated)); } catch { /* quota */ }
      return updated;
    });
  }, [saveFarmers, saveBookings, saveSms]);

  const resetData = useCallback(() => {
    saveFarmers([]);
    saveBookings([]);
    saveProcurements([]);
    saveSms([]);
    saveCenters(initialCenters);
    saveOperators(initialOperators);
  }, [saveFarmers, saveBookings, saveProcurements, saveSms, saveCenters, saveOperators]);

  const runAutoDemoFlow = useCallback(async () => {
    seedDemoData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    advanceQueueStage("BOOK-801");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    performInspection(
      "BOOK-801",
      {
        moisturePercentage: 12.5,
        foreignMatterPercentage: 0.2,
        damagedGrainsPercentage: 1.1,
        grade: "Grade-A",
      },
      42
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));

    initiatePayment("BOOK-801");
  }, [seedDemoData, advanceQueueStage, performInspection, initiatePayment]);

  // ── Context value ──────────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        lang,
        setLang,
        farmers,
        centers,
        bookings,
        procurements,
        smsLogs,
        operators,
        lastSyncedAt,
        saveFarmers,
        saveBookings,
        saveProcurements,
        saveSms,
        dispatchSms,
        advanceQueueStage,
        callNextToken,
        performInspection,
        markTokenArrived,
        initiatePayment,
        setCenters,
        updateCenterStatus,
        syncData,
        seedDemoData,
        resetData,
        runAutoDemoFlow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
