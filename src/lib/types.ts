export type Language = 'en' | 'hi';
export type UserRole = 'farmer' | 'operator' | 'admin';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  state: string;
  district: string;
  village: string;
  landSizeAcres: number;
  cropType: 'Wheat' | 'Paddy' | 'Pulses' | 'Mustard' | 'Maize';
  bankAccount: string;
  ifscCode: string;
  verified: boolean;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  district: string;
  state: string;
  address: string;
  capacityPerDay: number;
  currentBookings: number;
  liveQueueLength: number;
  avgWaitMins: number;
  operatingHours: string;
  status: 'Open' | 'Full' | 'Closing Soon';
  contactPerson: string;
  phone: string;
}

export interface SlotBooking {
  id: string;
  tokenId: string; // e.g. "TK-104"
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centerId: string;
  centerName: string;
  date: string;
  timeSlot: string; // e.g. "09:00 AM - 11:00 AM"
  cropType: string;
  estimatedQuantityQuintals: number;
  status: 'Booked' | 'In-Queue' | 'Inspected' | 'Weighed' | 'Completed' | 'Cancelled';
  currentCounter?: string;
  queuePosition?: number;
  estimatedWaitTimeMins?: number;
  createdAt: string;
}

export interface QualityAssessment {
  moisturePercentage: number;
  foreignMatterPercentage: number;
  damagedGrainsPercentage: number;
  grade: 'Grade-A' | 'Grade-B' | 'Fair-Average-Quality';
}

export interface ProcurementRecord {
  id: string;
  bookingId: string;
  tokenId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centerName: string;
  cropType: string;
  assessment: QualityAssessment;
  grossWeightQuintals: number;
  netWeightQuintals: number;
  mspRatePerQuintal: number;
  totalAmount: number;
  paymentStatus: 'Processing' | 'Approved' | 'Disbursed' | 'Credited';
  dbtRefNo?: string;
  processedAt: string;
}

export interface SmsLog {
  id: string;
  phone: string;
  message: string;
  sentAt: string;
  type: 'Booking Confirmation' | 'Queue Alert' | 'Inspection Update' | 'Payment Credit';
  status: 'Delivered' | 'Sent';
}

export interface ProcurementOperator {
  id: string;
  name: string;
  email: string;
  phone: string;
  centerId: string;
  centerName: string;
  status: 'online' | 'offline' | 'break';
  farmersProcessed: number;
  currentQueue: number;
  lastActive: string;
}

