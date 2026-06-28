/**
 * Supplementary: route transitions (warm) + INP lab simulation
 */
import { performance } from "node:perf_hooks";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3002";

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const report = { baseUrl: BASE, measuredAt: new Date().toISOString() };

  // Warm-up navigation
  await page.goto(`${BASE}/`, { waitUntil: "load" });

  const pairs = [
    ["/", "/about", 'header a[href="/about"]'],
    ["/about", "/experience", 'header a[href="/experience"]'],
    ["/experience", "/projects", 'header a[href="/projects"]'],
    ["/projects", "/resume", 'header a[href="/resume"]'],
    ["/resume", "/contact", 'header a[href="/contact"]'],
    ["/contact", "/blog", 'header a[href="/blog"]'],
    ["/blog", "/", 'header a[href="/"]'],
  ];

  report.routeTransitionsWarm = [];

  for (const [from, to, selector] of pairs) {
    await page.goto(`${BASE}${from}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    const runs = [];
    for (let i = 0; i < 3; i += 1) {
      await page.goto(`${BASE}${from}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(200);

      const start = performance.now();
      await page.click(selector);
      await page.waitForURL(`**${to}`, { timeout: 15000 });
      await page.waitForLoadState("domcontentloaded");
      runs.push(Math.round(performance.now() - start));
    }

    report.routeTransitionsWarm.push({
      from,
      to,
      runsMs: runs,
      medianMs: median(runs),
      minMs: Math.min(...runs),
      maxMs: Math.max(...runs),
    });
  }

  // JS payload per route (full page load)
  report.jsPayloadByRoute = [];
  for (const route of ["/", "/about", "/experience", "/projects", "/resume", "/contact", "/blog"]) {
    const p = await context.newPage();
    await p.goto(`${BASE}${route}`, { waitUntil: "load" });
    const payload = await p.evaluate(() => {
      const resources = performance.getEntriesByType("resource");
      const js = resources.filter(
        (r) => r.initiatorType === "script" || (r.name.includes("_next/static") && r.name.endsWith(".js")),
      );
      const totalTransfer = js.reduce((s, r) => s + (r.transferSize || 0), 0);
      const totalEncoded = js.reduce((s, r) => s + (r.encodedBodySize || 0), 0);
      const totalDecoded = js.reduce((s, r) => s + (r.decodedBodySize || 0), 0);
      return {
        jsRequests: js.length,
        transferBytes: totalTransfer,
        encodedBytes: totalEncoded,
        decodedBytes: totalDecoded,
      };
    });
    report.jsPayloadByRoute.push({ route, ...payload });
    await p.close();
  }

  // INP simulation: click nav link after page ready
  const inpPage = await context.newPage();
  await inpPage.goto(`${BASE}/`, { waitUntil: "load" });

  const inpResult = await inpPage.evaluate(async () => {
    return new Promise((resolve) => {
      let resolved = false;
      const finish = (value) => {
        if (!resolved) {
          resolved = true;
          resolve(value);
        }
      };

      try {
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "event" && entry.name === "click") {
              const duration = entry.duration;
              const processingStart = entry.processingStart ?? 0;
              const processingEnd = entry.processingEnd ?? 0;
              const inputDelay = processingStart - entry.startTime;
              const processingTime = processingEnd - processingStart;
              const presentationDelay = duration - (processingEnd - entry.startTime);
              finish({
                inpMs: duration,
                inputDelayMs: inputDelay,
                processingTimeMs: processingTime,
                presentationDelayMs: presentationDelay,
              });
            }
          }
        });
        po.observe({ type: "event", durationThreshold: 0, buffered: true });

        setTimeout(() => {
          const link = document.querySelector('header a[href="/about"]');
          if (link) link.click();
          else finish({ error: "link not found" });
        }, 500);

        setTimeout(() => finish({ error: "timeout waiting for event timing" }), 8000);
      } catch (e) {
        finish({ error: String(e) });
      }
    });
  });

  report.inpSimulation = inpResult;

  // Navigation Timing API on cold full load
  const coldPage = await context.newPage();
  await coldPage.goto(`${BASE}/`, { waitUntil: "load" });
  report.coldLoadHome = await coldPage.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((e) => e.name === "first-contentful-paint");
    return {
      ttfbMs: nav ? nav.responseStart - nav.requestStart : null,
      domContentLoadedMs: nav ? nav.domContentLoadedEventEnd - nav.startTime : null,
      loadEventMs: nav ? nav.loadEventEnd - nav.startTime : null,
      fcpMs: fcp ? fcp.startTime : null,
    };
  });

  await browser.close();

  const out = join(process.cwd(), ".next", "performance-nav-inp.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nSaved: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
