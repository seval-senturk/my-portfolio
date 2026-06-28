import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3002";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.addInitScript(() => {
  window.__inpEvents = [];
  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__inpEvents.push({
          name: e.name,
          duration: e.duration,
          startTime: e.startTime,
          processingStart: e.processingStart,
          processingEnd: e.processingEnd,
        });
      }
    });
    po.observe({ type: "event", durationThreshold: 0, buffered: true });
  } catch {
    // ignore
  }
});

await page.goto(`${BASE}/contact`, { waitUntil: "load" });
await page.waitForSelector("form input", { state: "visible", timeout: 25000 });

const nameInput = page.locator("#contact-name, input[name='name'], input[autocomplete='name']").first();
await nameInput.click();
await page.keyboard.type("test");
await page.waitForTimeout(500);

const events = await page.evaluate(() => window.__inpEvents ?? []);
const inp = events.length ? Math.max(...events.map((e) => e.duration)) : null;

console.log(JSON.stringify({ inpMs: inp, events, eventCount: events.length }, null, 2));
await browser.close();
