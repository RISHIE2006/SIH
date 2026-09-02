import { Language, SmsLog } from "./types";

export function buildSmsContent(
  type: 'Booking Confirmation' | 'Queue Alert' | 'Inspection Update' | 'Payment Credit',
  data: {
    farmerName: string;
    tokenNo: string;
    centerName: string;
    date?: string;
    timeSlot?: string;
    tokensAhead?: number;
    amount?: number;
    dbtRefNo?: string;
  },
  lang: Language = 'en'
): string {
  if (lang === 'hi') {
    switch (type) {
      case 'Booking Confirmation':
        return `प्रिय ${data.farmerName}, कृषि सेतु पर आपकी खरीद स्लॉट की पुष्टि हो गई है। टोकन: ${data.tokenNo}, केंद्र: ${data.centerName}, तिथि: ${data.date}, समय: ${data.timeSlot}। कृपया समय पर पहुंचे।`;
      case 'Queue Alert':
        return `अलर्ट: ${data.farmerName}, आपका टोकन ${data.tokenNo} जल्द ही काउंटर पर आ रहा है। आपसे आगे केवल ${data.tokensAhead} किसान हैं। कृपया गेट पर तैयार रहें।`;
      case 'Inspection Update':
        return `सूचना: ${data.farmerName}, आपके अनाज का गुणवत्ता परीक्षण (ग्रेड-ए) और धर्मकांटा तौल पूर्ण हो गया है। रसीद तैयार है।`;
      case 'Payment Credit':
        return `बधाई! कृषि सेतु डीबीटी: ₹${data.amount?.toLocaleString('en-IN')} का भुगतान आपके आधार लिंक बैंक खाते में भेज दिया गया है। DBT संदर्भांक: ${data.dbtRefNo}। DoCA`;
    }
  } else {
    switch (type) {
      case 'Booking Confirmation':
        return `Dear ${data.farmerName}, your procurement slot is confirmed on KrishiSetu. Token: ${data.tokenNo}, Center: ${data.centerName}, Date: ${data.date}, Time: ${data.timeSlot}. Please arrive 15 mins prior.`;
      case 'Queue Alert':
        return `ALERT: ${data.farmerName}, your Token ${data.tokenNo} is approaching the counter. Only ${data.tokensAhead} tokens ahead of you. Please report to Counter #1.`;
      case 'Inspection Update':
        return `UPDATE: ${data.farmerName}, your grain quality test (Grade-A) and weighbridge measurement are completed. Digital receipt generated.`;
      case 'Payment Credit':
        return `SUCCESS! KrishiSetu DBT: ₹${data.amount?.toLocaleString('en-IN')} has been disbursed directly to your Aadhaar-linked bank account. Ref: ${data.dbtRefNo}. DoCA`;
    }
  }
}
