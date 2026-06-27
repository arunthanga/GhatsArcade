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
    saved: "സേവ് ചെയ്തവ",
    events: "ഇവന്റുകൾ",
    about: "ഞങ്ങളെക്കുറിച്ച്",
    contact: "ബന്ധപ്പെടുക",
    language: "ഭാഷ",
    openMenu: "മെനു തുറക്കുക",
    closeMenu: "മെനു അടയ്ക്കുക",
  },
  footer: {
    tagline:
      "നിങ്ങളുടെ കുടുംബത്തിനുള്ള കൃഷിഭൂമി — ക്ലീൻ ടൈറ്റിൽ, ജൈവ ജീവിതം, കേരളത്തിലെ ശാന്തമായ വാരാന്ത്യ സന്ദർശനങ്ങൾ.",
    explore: "പര്യവേക്ഷണം",
    learn: "അറിയുക",
    guidance: "മാർഗനിർദേശം",
    rights: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
  },
  common: {
    chatWhatsApp: "ഞങ്ങളോട് ചാറ്റ് ചെയ്യൂ",
    bookVisit: "സന്ദർശനം ബുക്ക് ചെയ്യൂ",
    scheduleVisit: "സൈറ്റ് സന്ദർശനം ഷെഡ്യൂൾ ചെയ്യൂ",
    requestCallback: "കോൾ ഷെഡ്യൂൾ ചെയ്യൂ",
    sendMessage: "സന്ദേശം അയയ്ക്കൂ",
    readMore: "കൂടുതൽ വായിക്കൂ",
    readAllArticles: "എല്ലാ ലേഖനങ്ങളും വായിക്കൂ",
    viewLargerMap: "വലിയ ഭൂപടം കാണുക",
  },
  home: {
    heroEyebrow: "പരിപാലിത കൃഷിഭൂമി · കേരളം & കേരള–തമിഴ്‌നാട് അതിർത്തി",
    heroTitle: "നിങ്ങളുടെ കുടുംബത്തിനുള്ള കൃഷിഭൂമി.",
    heroSubtitle:
      "പശ്ചിമഘട്ടം പാലക്കാട് ഗ്യാപിനെ കാണുന്നിടം. ക്ലീൻ ടൈറ്റിൽ, വിശ്വസനീയമായ പരിപാലനം, ജൈവ ജീവിതം, സഹകർഷക കുടുംബങ്ങൾക്ക് ശാന്തമായ വാരാന്ത്യ ലയം.",
    heroCtaVisit: "സൈറ്റ് സന്ദർശനം ഷെഡ്യൂൾ ചെയ്യൂ",
    heroCtaProjects: "പ്രോജക്ടുകൾ പര്യവേക്ഷണം ചെയ്യൂ",
  },
};

export default ml;
