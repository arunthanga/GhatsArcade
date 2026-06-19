// English message catalogue. This is the source of truth for the message shape and the
// fallback for any key missing from ta/ml. Keys are looked up by dot-path, e.g. "nav.home".

const en = {
  nav: {
    home: "Home",
    projects: "Projects",
    listings: "Listings",
    events: "Events",
    about: "About",
    contact: "Contact",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    tagline:
      "Tranquility meets high-yields - managed farmland in Kerala and the Kerala-Tamil Nadu border region.",
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
    heroTitle: "Own a farm. Skip the full-time job.",
    heroSubtitle:
      "Tranquility meets high yields. You own the land and the produce — our resident team grows and cares for it while you live your life.",
    heroCtaVisit: "Schedule a site visit",
    heroCtaProjects: "Explore projects",
  },
} as const;

export type Messages = typeof en;
export default en;
