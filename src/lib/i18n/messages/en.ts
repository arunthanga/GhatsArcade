// English message catalogue. This is the source of truth for the message shape and the
// fallback for any key missing from ta/ml. Keys are looked up by dot-path, e.g. "nav.home".

const en = {
  nav: {
    home: "Home",
    projects: "Projects",
    listings: "Listings",
    saved: "Saved",
    events: "Events",
    about: "About",
    contact: "Contact",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    tagline:
      "A farmland for your family — clean titles, organic living, and peaceful weekend visits in Kerala.",
    explore: "Explore",
    learn: "Learn",
    guidance: "Guidance",
    rights: "All rights reserved.",
  },
  common: {
    chatWhatsApp: "Chat with us",
    bookVisit: "Book a visit",
    scheduleVisit: "Schedule a site visit",
    requestCallback: "Request a callback",
    sendMessage: "Send message",
    readMore: "Read more",
    readAllArticles: "Read all articles",
    viewLargerMap: "View larger map",
  },
  home: {
    heroEyebrow: "Managed farmland · Kerala & the Kerala–Tamil Nadu border",
    heroTitle: "A farmland for your family.",
    heroSubtitle:
      "Where the Western Ghats meet the Palakkad Gap. Clean titles, trusted developer care, organic living, and a peaceful weekend rhythm for co-farmer families.",
    heroCtaVisit: "Schedule a site visit",
    heroCtaProjects: "Explore projects",
  },
} as const;

export type Messages = typeof en;
export default en;
