import { Language } from "./types";

export const translations = {
  en: {
    // Header & Meta
    appName: "KrishiSetu",
    tagline: "National Crop Procurement & Dynamic Queue Management Portal",
    ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
    department: "Department of Consumer Affairs (DoCA) • Government of India",
    sihBadge: "SIH 2026 • Problem ID 26032",
    langSwitch: "हिंदी",
    govEmblem: "सत्यमेव जयते",
    pmAashaBadge: "PM-AASHA & MSP Guarantee Integrated",
    
    // Navigation
    navOverview: "Home & Guide",
    navBookSlot: "Book Slot",
    navQueue: "Live Queue Ticker",
    navProcurement: "MSP & DBT Payouts",
    navCenters: "Procurement Mandis",
    navAdmin: "Mandi Officer Desk",
    navSms: "SMS Alerts",
    
    // Visitor Guide (What to do when visiting the site)
    guideHeading: "How Farmers Use KrishiSetu (5 Simple Steps)",
    guideSubheading: "Follow this step-by-step process for seamless, zero-wait crop procurement at government MSP rates.",
    step1Title: "1. Register Farmer Profile",
    step1Desc: "Enter your Aadhaar, land details, and bank account for Direct Benefit Transfer (DBT).",
    step2Title: "2. Select Nearest Mandi & Slot",
    step2Desc: "Choose an open procurement center, date, and convenient morning/afternoon time window.",
    step3Title: "3. Receive Instant SMS Token",
    step3Desc: "Get a digital token (e.g., TK-104) with QR code and SMS alert on your mobile.",
    step4Title: "4. Track Queue & Arrive on Time",
    step4Desc: "Monitor your token live on your phone. Arrive at the mandi when your turn approaches.",
    step5Title: "5. Weighing & Direct Bank Payout",
    step5Desc: "Pass digital moisture check & weighbridge. MSP payment is credited straight to your bank account.",
    
    // Hero & Stats
    heroTitle: "Government MSP Procurement without Long Queues",
    heroDesc: "Official DoCA portal for Indian farmers. Book crop procurement slots in advance, receive live SMS token updates, avoid mandi crowding, and track Direct Benefit Transfer (DBT) payments directly to your bank account.",
    btnRegisterFarmer: "Register Farmer (किसान पंजीकरण)",
    btnBookSlot: "Book Procurement Slot (स्लॉट बुक करें)",
    btnTrackQueue: "Track Live Queue (लाइव कतार देखें)",
    
    statCenters: "Active Govt Procurement Centers",
    statBookings: "Slots Allocated Today",
    statAvgWait: "Avg Mandi Waiting Time",
    statWaitReduced: "Reduced from 4.5 hrs to 15 mins",
    statPayouts: "Direct DBT Disbursed",
    statSatisfaction: "DBT Credit Success Rate",
    
    // Feature Cards
    featureSlotTitle: "Smart Slot Scheduling",
    featureSlotDesc: "Dynamic load balancing distributes farmer arrivals to prevent mandi overcrowding.",
    featureQueueTitle: "Live Digital Queue Ticker",
    featureQueueDesc: "Track your token number & serving counter live from home or mobile without waiting in line.",
    featureSmsTitle: "Instant Mobile SMS Alerts",
    featureSmsDesc: "Automated SMS alerts for slot booking, token turn alert, moisture result, and DBT payout.",
    featureDbtTitle: "Direct Benefit Transfer (DBT)",
    featureDbtDesc: "Transparent government MSP payment calculation credited directly to Aadhaar-linked bank accounts.",
    
    // Registration Form
    regTitle: "Farmer Registration Form (किसान पंजीकरण)",
    regDesc: "Register your farmer profile to book procurement slots and receive SMS notifications.",
    fieldName: "Full Name (as per Aadhaar)",
    fieldPhone: "Mobile Number (for SMS Alerts)",
    fieldAadhaar: "Aadhaar Number (for DBT Linkage)",
    fieldState: "State",
    fieldDistrict: "District",
    fieldVillage: "Village / Gram Panchayat",
    fieldLand: "Land Holding Size (Acres)",
    fieldCrop: "Crop Offered for Procurement",
    fieldBank: "Bank Account Number (for DBT)",
    fieldIfsc: "Bank IFSC Code",
    btnSubmitRegistration: "Complete Official Registration",
    regSuccessMsg: "Farmer profile registered successfully!",
    
    // Slot Booking Form
    bookTitle: "Procurement Slot Booking (खरीद स्लॉट बुकिंग)",
    bookDesc: "Select your preferred government procurement mandi, date, and time slot window.",
    selectFarmer: "Select Registered Farmer Profile",
    selectCenter: "Choose Government Procurement Center",
    selectDate: "Preferred Procurement Date",
    selectTimeSlot: "Time Slot Window",
    selectCrop: "Crop Variety",
    estQuantity: "Estimated Quantity (Quintals)",
    btnConfirmSlot: "Generate Official Token",
    slotSuccessTitle: "Procurement Slot Booked Successfully!",
    tokenNumberLabel: "Official Token Number",
    
    // Live Queue Tracker
    queueTitle: "Live Mandi Queue & Token Tracker",
    queueSubtitle: "Track active counter tokens, queue position, and estimated waiting time in real time.",
    currentTokenHeading: "Currently Serving at Counter #1",
    yourToken: "Selected Token",
    tokensAhead: "Tokens Ahead in Queue",
    estWait: "Estimated Wait Time",
    minutes: "Mins",
    queueStatus: "Current Mandi Stage",
    statusInQueue: "Reported at Mandi Gate",
    statusInspecting: "Digital Moisture Testing Underway",
    statusWeighed: "Weighbridge Net Weight Recorded",
    statusCompleted: "DBT Payment Disbursed",
    
    // Procurement & Payment Tracking
    procTitle: "Govt MSP Procurement & DBT Payment Ledger",
    procSubtitle: "Transparent record of grain quality testing, net weighbridge measurement, MSP rates, and bank transfers.",
    tableFarmer: "Farmer Name",
    tableCrop: "Crop",
    tableGrade: "Quality Grade",
    tableWeight: "Net Weight (Qt)",
    tableAmount: "MSP Total Payable (₹)",
    tableStatus: "DBT Bank Status",
    tableAction: "Official Receipt",
    
    // Center Finder
    centerTitle: "Govt Procurement Mandi Directory & Live Load Gauge",
    centerSearchPlaceholder: "Search mandi by name, district or village...",
    capacityLabel: "Daily Mandi Load Capacity",
    avgWaitTime: "Avg Wait",
    operatingHours: "Operating Hours",
    statusOpen: "Slots Available",
    statusFull: "Capacity Full",
    
    // Admin Counter Panel
    adminTitle: "Government Mandi Officer Desk",
    adminSubtitle: "Official Operator Portal for calling farmer tokens, recording moisture %, gross weighbridge, and triggering DBT payments.",
    btnCallNext: "Call Next Token (अगला टोकन)",
    btnPassInspection: "Record Moisture & Quality Pass",
    btnConfirmWeight: "Record Net Weight & Issue Receipt",
    btnDisbursePayment: "Initiate Direct DBT Bank Transfer",
    
    // SMS Drawer
    smsTitle: "NIC Govt SMS Alert Simulator",
    smsSubtitle: "Real-time SMS notifications dispatched to farmers' mobile phones.",
    smsEmpty: "No SMS sent yet. Register a farmer or book a slot to trigger real-time SMS notifications.",
    
    // Common
    close: "Close",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    allCrops: "All Crops",
    viewDetails: "View Details",
    downloadReceipt: "Download Receipt",
    verifiedBadge: "Aadhaar DBT Verified",
    emptyFarmersMsg: "No farmers registered yet. Click 'Register Farmer' to add your profile.",
    emptyBookingsMsg: "No active slot bookings yet. Select a farmer and click 'Book Slot' to schedule your procurement.",
  },
  hi: {
    // Header & Meta
    appName: "कृषि सेतु",
    tagline: "राष्ट्रीय फसल खरीद एवं डिजिटल कतार प्रबंधन पोर्टल",
    ministry: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    department: "उपभोक्ता मामले विभाग (DoCA) • भारत सरकार",
    sihBadge: "SIH 2026 • समस्या आईडी 26032",
    langSwitch: "English",
    govEmblem: "सत्यमेव जयते",
    pmAashaBadge: "PM-AASHA एवं न्यूनतम समर्थन मूल्य (MSP) गारंटी युक्त",
    
    // Navigation
    navOverview: "मुख्य पृष्ठ व मार्गदर्शन",
    navBookSlot: "स्लॉट बुक करें",
    navQueue: "लाइव कतार",
    navProcurement: "MSP व DBT भुगतान",
    navCenters: "खरीद केंद्र / मंडी",
    navAdmin: "मंडी अधिकारी डेस्क",
    navSms: "SMS संदेश",
    
    // Visitor Guide
    guideHeading: "कृषि सेतु का उपयोग कैसे करें (5 आसान चरण)",
    guideSubheading: "सरकारी न्यूनतम समर्थन मूल्य (MSP) पर बिना किसी लाइन के अनाज बेचने की पूरी प्रक्रिया:",
    step1Title: "1. किसान पंजीकरण करें",
    step1Desc: "अपना आधार, भूमि क्षेत्रफल और सीधा बैंक खाता (DBT) विवरण दर्ज करें।",
    step2Title: "2. निकटतम मंडी और समय स्लॉट चुनें",
    step2Desc: "अपनी सुविधानुसार निकटतम खरीद केंद्र, तिथि एवं समय चुनें।",
    step3Title: "3. तत्काल SMS व डिजिटल टोकन पाएं",
    step3Desc: "अपने मोबाइल पर QR कोड युक्त टोकन नंबर (जैसे TK-104) व SMS अलर्ट प्राप्त करें।",
    step4Title: "4. लाइव कतार देखें व समय पर पहुंचे",
    step4Desc: "मोबाइल पर अपनी बारी का लाइव नंबर देखें और केवल अपनी बारी पर ही मंडी जाएं।",
    step5Title: "5. धर्मकांटा तौल व सीधा बैंक खाता DBT",
    step5Desc: "नमी जांच व तौल के बाद सरकारी एमएसपी राशि सीधे आपके बैंक खाते में जमा।",
    
    // Hero & Stats
    heroTitle: "बिना लंबी लाइनों के सरकारी MSP पर अनाज खरीद",
    heroDesc: "भारत सरकार का आधिकारिक DoCA कृषि पोर्टल। पहले से स्लॉट बुक करें, मोबाइल पर लाइव टोकन देखें, मंडियों की भीड़ से बचें और सीधे बैंक खाते में Direct Benefit Transfer (DBT) प्राप्त करें।",
    btnRegisterFarmer: "किसान पंजीकरण करें",
    btnBookSlot: "खरीद स्लॉट बुक करें",
    btnTrackQueue: "लाइव कतार देखें",
    
    statCenters: "सक्रिय सरकारी खरीद केंद्र",
    statBookings: "आज की बुक की गई स्लॉट",
    statAvgWait: "मंडी में औसत प्रतीक्षा समय",
    statWaitReduced: "4.5 घंटे से घटकर केवल 15 मिनट",
    statPayouts: "सीधा बैंक खाता हस्तांतरित DBT",
    statSatisfaction: "DBT सफलता दर",
    
    // Feature Cards
    featureSlotTitle: "स्मार्ट स्लॉट आवंटन",
    featureSlotDesc: "मंडियों में भीड़ नियंत्रण के लिए गतिशील समय निर्धारण प्रणाली।",
    featureQueueTitle: "लाइव डिजिटल कतार",
    featureQueueDesc: "घर बैठे मोबाइल पर अपनी बारी का टोकन नंबर और काउंटर देखें।",
    featureSmsTitle: "तत्काल SMS मोबाइल संदेश",
    featureSmsDesc: "स्लॉट बुकिंग, टोकन अलर्ट, नमी जांच और बैंक भुगतान के तुरंत SMS अपडेट।",
    featureDbtTitle: "सीधा बैंक खाता DBT भुगतान",
    featureDbtDesc: "सरकारी एमएसपी (MSP) दर से पारदर्शी तौल रसीद और सीधे बैंक खाते में भुगतान।",
    
    // Registration Form
    regTitle: "किसान पंजीकरण फॉर्म",
    regDesc: "स्लॉट बुकिंग और एसएमएस अलर्ट प्राप्त करने के लिए अपना विवरण दर्ज करें।",
    fieldName: "पूरा नाम (आधार के अनुसार)",
    fieldPhone: "मोबाइल नंबर (SMS अलर्ट के लिए)",
    fieldAadhaar: "आधार नंबर (DBT लिंक के लिए)",
    fieldState: "राज्य",
    fieldDistrict: "ज़िला",
    fieldVillage: "गांव / ग्राम पंचायत",
    fieldLand: "भूमि का क्षेत्रफल (एकड़)",
    fieldCrop: "बेचने वाली फसल",
    fieldBank: "बैंक खाता संख्या (DBT हेतु)",
    fieldIfsc: "बैंक का IFSC कोड",
    btnSubmitRegistration: "सरकारी पंजीकरण पूर्ण करें",
    regSuccessMsg: "किसान पंजीकरण सफलतापूर्वक संपन्न हुआ!",
    
    // Slot Booking Form
    bookTitle: "अनाज खरीद स्लॉट बुकिंग",
    bookDesc: "अपनी सुविधानुसार निकटतम खरीद केंद्र, तिथि एवं समय स्लॉट चुनें।",
    selectFarmer: "पंजीकृत किसान चुनें",
    selectCenter: "सरकारी खरीद केंद्र का चयन करें",
    selectDate: "पसंदीदा तिथि",
    selectTimeSlot: "समय स्लॉट (विंडो)",
    selectCrop: "फसल का प्रकार",
    estQuantity: "अनुमानित मात्रा (क्विंटल)",
    btnConfirmSlot: "आधिकारिक टोकन जारी करें",
    slotSuccessTitle: "स्लॉट सफलतापूर्वक बुक हो गया!",
    tokenNumberLabel: "आधिकारिक टोकन नंबर",
    
    // Live Queue Tracker
    queueTitle: "लाइव मंडी कतार एवं टोकन स्थिति",
    queueSubtitle: "वर्तमान काउंटर टोकन, अपनी कतार स्थिति और अनुमानित समय लाइव देखें।",
    currentTokenHeading: "वर्तमान में काउंटर #1 पर प्रस्तुत",
    yourToken: "चयनित टोकन",
    tokensAhead: "आपसे आगे कुल टोकन",
    estWait: "अनुमानित प्रतीक्षा समय",
    minutes: "मिनट",
    queueStatus: "वर्तमान मंडी चरण",
    statusInQueue: "मंडी गेट पर रिपोर्टेड",
    statusInspecting: "डिजिटल नमी परीक्षण जारी",
    statusWeighed: "धर्मकांटा तौल दर्ज",
    statusCompleted: "DBT बैंक भुगतान संपन्न",
    
    // Procurement & Payment Tracking
    procTitle: "सरकारी MSP खरीद एवं DBT बैंक भुगतान लेजर",
    procSubtitle: "नमी परीक्षण, धर्मकांटा तौल रसीद, सरकारी एमएसपी दर और बैंक ट्रांसफर का पारदर्शी रिकॉर्ड।",
    tableFarmer: "किसान का नाम",
    tableCrop: "फसल",
    tableGrade: "गुणवत्ता ग्रेड",
    tableWeight: "शुद्ध वजन (क्विंटल)",
    tableAmount: "कुल MSP देय राशि (₹)",
    tableStatus: "DBT बैंक स्थिति",
    tableAction: "आधिकारिक रसीद",
    
    // Center Finder
    centerTitle: "सरकारी खरीद केंद्र निर्देशिका व क्षमता मीटर",
    centerSearchPlaceholder: "केंद्र का नाम, जिला या गांव खोजें...",
    capacityLabel: "दैनिक मंडी क्षमता भार",
    avgWaitTime: "औसत समय",
    operatingHours: "कार्य समय",
    statusOpen: "स्लॉट उपलब्ध",
    statusFull: "क्षमता पूर्ण",
    
    // Admin Counter Panel
    adminTitle: "सरकारी मंडी अधिकारी डेस्क (ऑपरेटर)",
    adminSubtitle: "टोकन बुलाने, नमी जांच दर्ज करने, धर्मकांटा तौल दर्ज करने और DBT भुगतान शुरू करने का पोर्टल।",
    btnCallNext: "अगला टोकन बुलाएं",
    btnPassInspection: "नमी जांच पास करें",
    btnConfirmWeight: "शुद्ध वजन दर्ज कर रसीद बनाएं",
    btnDisbursePayment: "सीधा DBT बैंक भुगतान शुरू करें",
    
    // SMS Drawer
    smsTitle: "NIC सरकारी SMS अलर्ट सिम्युलेटर",
    smsSubtitle: "किसान के मोबाइल पर भेजे जाने वाले वास्तविक समय SMS का विवरण।",
    smsEmpty: "अभी तक कोई SMS नहीं भेजा गया है। किसान पंजीकरण करें या स्लॉट बुक करें।",
    
    // Common
    close: "बंद करें",
    cancel: "रद्द करें",
    search: "खोजें",
    filter: "फ़िल्टर",
    allCrops: "सभी फसलें",
    viewDetails: "विवरण देखें",
    downloadReceipt: "रसीद डाउनलोड करें",
    verifiedBadge: "आधार DBT सत्यापित",
    emptyFarmersMsg: "अभी तक कोई किसान पंजीकृत नहीं है। 'किसान पंजीकरण' बटन पर क्लिक करके अपना विवरण जोड़ें।",
    emptyBookingsMsg: "अभी कोई सक्रिय स्लॉट बुकिंग नहीं है। किसान चुनें और 'स्लॉट बुक करें' पर क्लिक करें।",
  }
};
