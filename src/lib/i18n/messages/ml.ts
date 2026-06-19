// Malayalam (മലയാളം) message catalogue. Partial by design — any missing key falls back to
// English. AI-assisted translations for the UI chrome + hero; review by a native speaker
// recommended before launch.

import type { DeepPartial } from "../config";
import type { Messages } from "./en";

const ml: DeepPartial<Messages> = {
  nav: {
    home: "ഹോം",
    projects: "പ്രോജക്ടുകൾ",
    listings: "ലിസ്റ്റിംഗുകൾ",
    events: "ഇവന്റുകൾ",
    about: "ഞങ്ങളെക്കുറിച്ച്",
    contact: "ബന്ധപ്പെടുക",
    language: "ഭാഷ",
    openMenu: "മെനു തുറക്കുക",
    closeMenu: "മെനു അടയ്ക്കുക",
  },
  footer: {
    tagline:
      "ശാന്തതയും ഉയർന്ന വരുമാനവും — കേരളത്തിലും കേരള-തമിഴ്‌നാട് അതിർത്തി പ്രദേശത്തും പരിപാലിക്കുന്ന കൃഷിഭൂമി.",
    explore: "പര്യവേക്ഷണം",
    learn: "അറിയുക",
    guidance: "മാർഗനിർദേശം",
    rights: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
  },
  common: {
    chatWhatsApp: "ഞങ്ങളോട് ചാറ്റ് ചെയ്യൂ",
    bookVisit: "സന്ദർശനം ബുക്ക് ചെയ്യൂ",
    scheduleVisit: "സൈറ്റ് സന്ദർശനം ഷെഡ്യൂൾ ചെയ്യൂ",
    requestCallback: "തിരികെ വിളിക്കാൻ അഭ്യർത്ഥിക്കൂ",
    sendMessage: "സന്ദേശം അയയ്ക്കൂ",
    readMore: "കൂടുതൽ വായിക്കൂ",
    readAllArticles: "എല്ലാ ലേഖനങ്ങളും വായിക്കൂ",
    viewLargerMap: "വലിയ ഭൂപടം കാണുക",
  },
  home: {
    heroEyebrow: "പരിപാലിത കൃഷിഭൂമി · കേരളം & കേരള–തമിഴ്‌നാട് അതിർത്തി",
    heroTitle: "ഒരു കൃഷിയിടം സ്വന്തമാക്കൂ. മുഴുവൻ സമയ ജോലി ഒഴിവാക്കൂ.",
    heroSubtitle:
      "ശാന്തതയും ഉയർന്ന വിളവും ഒത്തുചേരുന്നു. ഭൂമിയും വിളവും നിങ്ങളുടേത് — നിങ്ങൾ ജീവിതം ജീവിക്കുമ്പോൾ ഞങ്ങളുടെ പ്രാദേശിക സംഘം അത് വളർത്തി പരിപാലിക്കുന്നു.",
    heroCtaVisit: "സൈറ്റ് സന്ദർശനം ഷെഡ്യൂൾ ചെയ്യൂ",
    heroCtaProjects: "പ്രോജക്ടുകൾ പര്യവേക്ഷണം ചെയ്യൂ",
  },
};

export default ml;
