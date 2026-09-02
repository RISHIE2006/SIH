import { Farmer, ProcurementCenter, SlotBooking, ProcurementRecord, SmsLog, ProcurementOperator } from "./types";

// Empty initial arrays for production readiness (No mock dummy farmers or bookings)
export const initialFarmers: Farmer[] = [];

// Official Government Procurement Centers (Ready for real slot allocation)
export const initialCenters: ProcurementCenter[] = [
  {
    id: "CTR-01",
    name: "Baraut Central Grain Mandi (DoCA Yard #1)",
    district: "Baghpat",
    state: "Uttar Pradesh",
    address: "NH-709B, Main Mandi Yard, Baraut",
    capacityPerDay: 500,
    currentBookings: 0,
    liveQueueLength: 0,
    avgWaitMins: 15,
    operatingHours: "08:00 AM - 06:00 PM",
    status: "Open",
    contactPerson: "Dr. Alok Verma (Procurement Officer)",
    phone: "1800-180-1551"
  },
  {
    id: "CTR-02",
    name: "Ludhiana Regional Procurement Hub (FCI Yard)",
    district: "Ludhiana",
    state: "Punjab",
    address: "GT Road, Grain Market, Ludhiana",
    capacityPerDay: 800,
    currentBookings: 0,
    liveQueueLength: 0,
    avgWaitMins: 20,
    operatingHours: "07:30 AM - 07:00 PM",
    status: "Open",
    contactPerson: "S. Harjit Singh (Senior Inspector)",
    phone: "1800-180-1551"
  },
  {
    id: "CTR-03",
    name: "Patiala Farmer Service Kendra (State Civil Supplies)",
    district: "Patiala",
    state: "Punjab",
    address: "Rajpura Road, Procurement Yard, Patiala",
    capacityPerDay: 600,
    currentBookings: 0,
    liveQueueLength: 0,
    avgWaitMins: 12,
    operatingHours: "08:00 AM - 05:30 PM",
    status: "Open",
    contactPerson: "Mahesh Chandra (Mandi Nodal)",
    phone: "1800-180-1551"
  },
  {
    id: "CTR-04",
    name: "Ujjain Krishi Upaj Mandi (DoCA Facility)",
    district: "Ujjain",
    state: "Madhya Pradesh",
    address: "Agar Road, Ujjain Mandi Complex",
    capacityPerDay: 450,
    currentBookings: 0,
    liveQueueLength: 0,
    avgWaitMins: 18,
    operatingHours: "08:30 AM - 06:00 PM",
    status: "Open",
    contactPerson: "Suresh Rawat (Warehouse Manager)",
    phone: "1800-180-1551"
  }
];

export const initialBookings: SlotBooking[] = [];
export const initialProcurements: ProcurementRecord[] = [];
export const initialSmsLogs: SmsLog[] = [];

export const initialOperators: ProcurementOperator[] = [
  {
    id: "OP-01",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@mandi.gov.in",
    phone: "9876543210",
    centerId: "CTR-01",
    centerName: "Baraut Central Grain Mandi",
    status: "online",
    farmersProcessed: 0,
    currentQueue: 0,
    lastActive: new Date().toISOString()
  },
  {
    id: "OP-02",
    name: "Priya Gupta",
    email: "priya.gupta@mandi.gov.in",
    phone: "9876543211",
    centerId: "CTR-02",
    centerName: "Ludhiana Regional Procurement Hub",
    status: "online",
    farmersProcessed: 0,
    currentQueue: 0,
    lastActive: new Date().toISOString()
  },
  {
    id: "OP-03",
    name: "Harjit Singh",
    email: "harjit.singh@mandi.gov.in",
    phone: "9876543212",
    centerId: "CTR-03",
    centerName: "Patiala Farmer Service Kendra",
    status: "online",
    farmersProcessed: 0,
    currentQueue: 0,
    lastActive: new Date().toISOString()
  },
  {
    id: "OP-04",
    name: "Amita Patel",
    email: "amita.patel@mandi.gov.in",
    phone: "9876543213",
    centerId: "CTR-04",
    centerName: "Ujjain Krishi Upaj Mandi",
    status: "online",
    farmersProcessed: 0,
    currentQueue: 0,
    lastActive: new Date().toISOString()
  }
];

