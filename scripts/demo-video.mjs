// Records a narrated-by-motion demo video of the public website by driving a real
// browser through the key pages with smooth scrolling. Uses Playwright (already a
// devDependency via @playwright/test) and its built-in video recording.
//
// Prerequisites (run on a machine where deps are installed):
//   1. pnpm install
//   2. pnpm exec playwright install chromium     # one-time browser download
//   3. Start the site in another terminal:
//        pnpm dev                  (or: pnpm build && pnpm start)
//   4. Record:
//        pnpm demo:video           (or: node scripts/demo-video.mjs)
//
// Options (env vars):
//   DEMO_BASE_URL   default http://localhost:3000
//   DEMO_OUT_DIR    default tests/demo-video
//
// Output: tests/demo-video/ghats-arcade-demo-<timestamp>.webm
// Convert to mp4 (optional, needs ffmpeg):
//   ffmpeg -i ghats-arcade-demo-*.webm -c:v libx264 -pix_fmt yuv420p ghats-arcade-demo.mp4

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.DEMO_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve(process.env.DEMO_OUT_DIR ?? "tests/demo-video");
const VIEWPORT = { width: 1280, height: 800 };

// Ordered tour. `openFirst` (a CSS selector) tries to click the first matching card to
// also showcase a dynamic detail page — skipped gracefully if the list is empty.
const TOUR = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects", openFirst: "a[href^='/projects/']" },
  { path: "/listings", label: "Listings", openFirst: "a[href^='/listings/']" },
  { path: "/gallery", label: "Gallery" },
  { path: "/events", label: "Events", openFirst: "a[href^='/events/']" },
  { path: "/blog", label: "The Farmlands Journal", openFirst: "a[href^='/blog/']" },
  { path: "/what-is-managed-farmland", label: "What is Managed Farmland" },
  { path: "/why-invest", label: "Why Invest" },
  { path: "/who-should-buy", label: "Who Should Buy" },
  { path: "/horticulture", label: "Horticulture & Plantation" },
  { path: "/in-and-around", label: "In & Around Eruthempathy" },
  { path: "/legal-checklist", label: "Legal Checklist" },
  { path: "/faq", label: "FAQ" },
  { path: "/resale", label: "Resale & Exit" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

// Gradually scroll a page top→bottom→top so the recording reveals the content.
async function smoothScroll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const maxY = Math.max(0, document.body.scrollHeight - window.innerHeight);
    const step = Math.max(180, Math.floor(window.innerHeight * 0.55));
    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo({ top: y, behavior: "smooth" });
      await sleep(420);
    }
    await sleep(500);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await sleep(500);
  });
}

async function visit(page, url, label) {
  process.stdout.write(`→ ${label} (${url})\n`);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await page.waitForTimeout(900);
    await smoothScroll(page);
    return true;
  } catch (err) {
    process.stdout.write(`  ! skipped: ${err.message}\n`);
    return false;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: OUT_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  for (const stop of TOUR) {
    const url = new URL(stop.path, BASE_URL).toString();
    const ok = await visit(page, url, stop.label);
    if (!ok) continue;

    if (stop.openFirst) {
      const link = page.locator(stop.openFirst).first();
      if ((await link.count()) > 0) {
        try {
          await link.click();
          await page.waitForLoadState("load");
          await page.waitForTimeout(900);
          await smoothScroll(page);
        } catch {
          /* detail page is a bonus; ignore failures */
        }
      }
    }
  }

  const video = page.video();
  await context.close(); // finalizes the recording
  await browser.close();

  if (video) {
    const dest = path.join(OUT_DIR, `ghats-arcade-demo-${Date.now()}.webm`);
    await video.saveAs(dest);
    process.stdout.write(`\n\u2713 Saved demo video: ${dest}\n`);
  } else {
    process.stdout.write("\n! No video was produced.\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
