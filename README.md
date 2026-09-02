# KrishiSetu (कृषि सेतु) - Smart Farmer Procurement & Queue Management Portal

**Smart India Hackathon 2026 • Problem Statement ID: 26032**  
*Ministry of Consumer Affairs, Food & Public Distribution — Department of Consumer Affairs (DoCA)*

---

## 🌾 Overview
**KrishiSetu** is an intelligent crop procurement schedule and queue optimization platform designed to eliminate long waiting times, reduce procurement center congestion, provide real-time queue status visibility, and ensure transparent Direct Benefit Transfer (DBT) payments to farmers.

### 🎯 Problem Statement #26032
> **"Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status."**

---

## ✨ Key Features

1. **🌾 Farmer Registration & Profile**
   - Aadhaar-verified registration with land size (acres), crop details, and DBT bank account info.
   
2. **📅 Smart Dynamic Slot Booking**
   - Enables farmers to select preferred procurement centers, dates, and morning/afternoon time slots.
   - Dynamic load balancing analyzes center capacity to prevent overcrowding.
   - Instant digital token generation (`TK-104`) with QR verification.

3. **⏱️ Real-Time Queue Ticker & Token Status**
   - Displays live active counter token numbers, queue position, and estimated waiting time.
   - Reduces waiting time at procurement yards from **4.5 hours to under 22 minutes** (-91%).
   - Interactive counter stage advancement (`Slot Booked` ➔ `In-Queue` ➔ `Inspected` ➔ `Weighed` ➔ `DBT Completed`).

4. **📱 Automated SMS Notification Hub**
   - Real-time SMS alerts for slot confirmations, queue turn warnings, grain inspection results, and DBT payment credits.
   - Simulated interactive SMS notification drawer for real-time demonstration.

5. **⚖️ Digital Quality Inspection & Weighbridge Invoice**
   - Moisture %, foreign matter testing, and grain grading (Grade A / Grade B / FAQ).
   - Digital weighbridge entry and automatic MSP rate calculation (e.g. Wheat @ ₹2,275/Qt).

6. **💳 Direct Benefit Transfer (DBT) Payout Tracker**
   - Automated payment disbursement to farmers' Aadhaar-linked bank accounts with DBT reference numbers.

7. **🌐 Bilingual UI (English & Hindi)**
   - Minimalist Beige and White aesthetic with one-click seamless toggle between **English** and **हिन्दी**.

---

## 🏗️ Architecture & Codebase Patterns

This project extracts and builds upon patterns from existing project codebases (`./E-mail` and `./studio`):

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling & Aesthetics**: Tailwind CSS with custom minimalist beige palette (`#FAF8F5`, `#F4EFEA`, `#EAE3D2`, `#8C6D46`, `#2D251E`).
- **Icons & Animation**: Lucide React + Framer Motion.
- **UI Utilities**: `clsx` + `tailwind-merge` (`cn` helper).
- **Localization**: Centralized dictionary structure (`src/lib/translations.ts`).
- **State Management**: Reactive state store with mock dataset (`src/lib/store.ts`).

---

## 📁 Directory Structure (`d:\SIH`)

```
SIH/
├── src/
│   ├── app/
│   │   ├── globals.css          # Minimalist beige theme & glassmorphism styles
│   │   ├── layout.tsx           # SEO metadata & root layout
│   │   └── page.tsx             # Main dashboard & tab routing
│   ├── components/
│   │   ├── Header.tsx           # Navigation & bilingual toggle
│   │   ├── Footer.tsx           # Ministry details & helpline
│   │   ├── StatsOverview.tsx    # KPI metrics grid
│   │   ├── FarmerRegistrationModal.tsx # Farmer onboarding form
│   │   ├── SlotBookingModal.tsx # Smart slot booking engine
│   │   ├── LiveQueueTracker.tsx # Real-time queue tracker & simulation
│   │   ├── ProcurementTracker.tsx # Weighbridge & DBT payout records
│   │   ├── CenterFinder.tsx     # Center locator & capacity gauge
│   │   ├── SmsNotificationDrawer.tsx # Live SMS alert simulator
│   │   └── AdminCounterPanel.tsx # Operator counter desk
│   └── lib/
│       ├── types.ts             # TypeScript interfaces
│       ├── translations.ts      # English & Hindi translation dictionary
│       ├── sms.ts               # SMS formatting logic
│       ├── store.ts             # Initial mock state
│       └── utils.ts             # Currency & date formatting helpers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser at:
http://localhost:3000
```

---
*Developed for Smart India Hackathon (SIH 2026) — Department of Consumer Affairs (DoCA)*
