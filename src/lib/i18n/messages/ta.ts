// Tamil (தமிழ்) message catalogue. Partial by design — any missing key falls back to
// English. AI-assisted translations for the UI chrome + hero; review by a native speaker
// recommended before launch.

import type { DeepPartial } from "../config";
import type { Messages } from "./en";

const ta: DeepPartial<Messages> = {
  nav: {
    home: "முகப்பு",
    projects: "திட்டங்கள்",
    listings: "பட்டியல்கள்",
    saved: "சேமிக்கப்பட்டவை",
    events: "நிகழ்வுகள்",
    about: "எங்களைப் பற்றி",
    contact: "தொடர்பு",
    language: "மொழி",
    openMenu: "பட்டியைத் திற",
    closeMenu: "பட்டியை மூடு",
  },
  footer: {
    tagline:
      "உங்கள் குடும்பத்திற்கான பண்ணை நிலம் — தெளிவான பட்டா, இயற்கை வாழ்வு, கேரளாவில் அமைதியான வார இறுதி வருகைகள்.",
    explore: "ஆராயுங்கள்",
    learn: "அறியுங்கள்",
    guidance: "வழிகாட்டுதல்",
    rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  common: {
    chatWhatsApp: "எங்களுடன் அரட்டையடிக்கவும்",
    bookVisit: "வருகையைப் பதிவு செய்யுங்கள்",
    scheduleVisit: "நிலத்தைப் பார்வையிட திட்டமிடுங்கள்",
    requestCallback: "திரும்ப அழைக்கக் கோருங்கள்",
    sendMessage: "செய்தி அனுப்பு",
    readMore: "மேலும் படிக்க",
    readAllArticles: "அனைத்துக் கட்டுரைகளையும் படிக்க",
    viewLargerMap: "பெரிய வரைபடத்தைக் காண்க",
  },
  home: {
    heroEyebrow: "நிர்வகிக்கப்படும் பண்ணை நிலம் · கேரளா & கேரளா–தமிழ்நாடு எல்லை",
    heroTitle: "உங்கள் குடும்பத்திற்கான பண்ணை நிலம்.",
    heroSubtitle:
      "மேற்கு தொடர்ச்சி மலைகள் பாலக்காடு கணவாயை சந்திக்கும் இடம். தெளிவான பட்டா, நம்பகமான பராமரிப்பு, இயற்கை வாழ்வு, இணை விவசாய குடும்பங்களுக்கு அமைதியான வார இறுதி நடை.",
    heroCtaVisit: "நிலத்தைப் பார்வையிட திட்டமிடுங்கள்",
    heroCtaProjects: "திட்டங்களை ஆராயுங்கள்",
  },
};

export default ta;
