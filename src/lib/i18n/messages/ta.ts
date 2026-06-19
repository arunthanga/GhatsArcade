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
    events: "நிகழ்வுகள்",
    about: "எங்களைப் பற்றி",
    contact: "தொடர்பு",
    language: "மொழி",
    openMenu: "பட்டியைத் திற",
    closeMenu: "பட்டியை மூடு",
  },
  footer: {
    tagline:
      "அமைதியும் உயர் வருமானமும் — கேரளா மற்றும் கேரளா-தமிழ்நாடு எல்லைப் பகுதியில் நிர்வகிக்கப்படும் பண்ணை நிலம்.",
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
    heroTitle: "ஒரு பண்ணையை சொந்தமாக்குங்கள். முழுநேர வேலையைத் தவிர்க்கவும்.",
    heroSubtitle:
      "அமைதியும் உயர் விளைச்சலும் இணைகின்றன. நிலமும் விளைபொருளும் உங்களுடையது — நீங்கள் உங்கள் வாழ்க்கையை வாழும்போது எங்கள் வசிக்கும் குழு அதை வளர்த்துப் பராமரிக்கிறது.",
    heroCtaVisit: "நிலத்தைப் பார்வையிட திட்டமிடுங்கள்",
    heroCtaProjects: "திட்டங்களை ஆராயுங்கள்",
  },
};

export default ta;
