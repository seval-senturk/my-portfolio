/**
 * Production performance measurement script.
 * Requires: npm run build && npm run start (port 3000)
 * Usage: node scripts/measure-performance.mjs
 */
import { execSync, spawn } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = ["/", "/about", "/experience", "/projects", "/resume", "/contact", "/blog"];

function formatMs(ms) {
  return Math.round(ms * 100) / 100;
}

async function measureTtfb(url) {
  const start = performance.now();
  const response = await fetch(url, { redirect: "follow" });
  const ttfb = performance.now() - start;
  const body = await response.text();
  return {
    url,
    status: response.status,
    ttfbMs: formatMs(ttfb),
    htmlBytes: Buffer.byteLength(body, "utf8"),
  };
}

function getBuildManifestSizes() {
  const buildDir = join(process.cwd(), ".next");
  const manifestPath = join(buildDir, "app-build-manifest.json");
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    return manifest;
  } catch {
    return null;
  }
}

function sumJsInDir(dir) {
  let total = 0;
  let files = 0;
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        const nested = sumJsInDir(full);
        total += nested.total;
        files += nested.files;
      } else if (entry.name.endsWith(".js")) {
        total += statSync(full).size;
        files += 1;
      }
    }
  } catch {
    // ignore
  }
  return { total, files };
}

function analyzeBundles() {
  const chunksDir = join(process.cwd(), ".next", "static", "chunks");
  const appDir = join(process.cwd(), ".next", "static", "chunks", "app");
  const allChunks = sumJsInDir(chunksDir);
  const appChunks = sumJsInDir(appDir);

  return {
    allJsChunksBytes: allChunks.total,
    allJsChunksFiles: allChunks.files,
    appJsChunksBytes: appChunks.total,
    appJsChunksFiles: appChunks.files,
    allJsChunksKb: formatMs(allChunks.total / 1024),
    appJsChunksKb: formatMs(appChunks.total / 1024),
  };
}

async function runLighthouse(url, outPath) {
  try {
    execSync(
      `npx --yes lighthouse "${url}" --only-categories=performance --output=json --output-path="${outPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`,
      { stdio: "pipe", timeout: 120000 },
    );
    const report = JSON.parse(readFileSync(outPath, "utf8"));
    const audits = report.audits ?? {};
    const metrics = {
      performanceScore: report.categories?.performance?.score
        ? Math.round(report.categories.performance.score * 100)
        : null,
      fcpMs: audits["first-contentful-paint"]?.numericValue ?? null,
      lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      tbtMs: audits["total-blocking-time"]?.numericValue ?? null,
      siMs: audits["speed-index"]?.numericValue ?? null,
      ttfbMs: audits["server-response-time"]?.numericValue ?? null,
      inpMs: audits["interaction-to-next-paint"]?.numericValue ?? null,
    };
    return metrics;
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

async function runPlaywrightMetrics(baseUrl) {
  try {
    const { chromium } = await import("playwright");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = {
      initialLoad: null,
      routeTransitions: [],
    };

    const navStart = performance.now();
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    const navEnd = performance.now();

    const initialMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const paint = performance.getEntriesByType("paint");
      const fcp = paint.find((e) => e.name === "first-contentful-paint");
      let lcp = null;
      try {
        const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
        lcp = lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime : null;
      } catch {
        // LCP observer may be unavailable
      }

      const resources = performance.getEntriesByType("resource");
      const jsBytes = resources
        .filter((r) => r.initiatorType === "script" || r.name.includes("_next/static"))
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);

      return {
        ttfbMs: nav ? nav.responseStart - nav.requestStart : null,
        domContentLoadedMs: nav ? nav.domContentLoadedEventEnd - nav.startTime : null,
        loadEventMs: nav ? nav.loadEventEnd - nav.startTime : null,
        fcpMs: fcp ? fcp.startTime : null,
        lcpMs: lcp,
        jsTransferBytes: jsBytes,
        navigationType: nav?.type ?? null,
      };
    });

    results.initialLoad = {
      wallClockMs: formatMs(navEnd - navStart),
      ...initialMetrics,
    };

    const transitionPairs = [
      { from: "/", to: "/about", link: 'a[href="/about"]' },
      { from: "/about", to: "/experience", link: 'a[href="/experience"]' },
      { from: "/experience", to: "/projects", link: 'a[href="/projects"]' },
      { from: "/projects", to: "/resume", link: 'a[href="/resume"]' },
    ];

    for (const pair of transitionPairs) {
      await page.goto(`${baseUrl}${pair.from}`, { waitUntil: "networkidle" });

      const start = performance.now();
      await page.click(pair.link);
      await page.waitForURL(`**${pair.to}`, { timeout: 15000 });
      await page.waitForLoadState("domcontentloaded");

      const transitionMs = formatMs(performance.now() - start);

      const paintAfter = await page.evaluate(() => {
        const paint = performance.getEntriesByType("paint");
        const fcp = paint.find((e) => e.name === "first-contentful-paint");
        return { fcpMs: fcp ? fcp.startTime : null };
      });

      results.routeTransitions.push({
        from: pair.from,
        to: pair.to,
        routeTransitionMs: transitionMs,
        fcpAfterNavMs: paintAfter.fcpMs,
      });
    }

    await browser.close();
    return results;
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 304) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  console.log("=== Performance Measurement ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  const serverUp = await waitForServer(BASE_URL);
  if (!serverUp) {
    console.error("Server not reachable. Start with: npm run build && npm run start");
    process.exit(1);
  }

  const report = {
    measuredAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    bundles: analyzeBundles(),
    ttfbByRoute: [],
    lighthouse: {},
    playwright: null,
  };

  console.log("1) Bundle analysis (.next/static/chunks)...");
  console.log(JSON.stringify(report.bundles, null, 2));

  console.log("\n2) TTFB per route (fetch timing)...");
  for (const route of ROUTES) {
    const result = await measureTtfb(`${BASE_URL}${route}`);
    report.ttfbByRoute.push(result);
    console.log(`  ${route}: TTFB=${result.ttfbMs}ms status=${result.status} html=${result.htmlBytes}B`);
  }

  console.log("\n3) Lighthouse (homepage)...");
  const lhPath = join(process.cwd(), ".next", "lighthouse-home.json");
  report.lighthouse.home = await runLighthouse(BASE_URL, lhPath);
  console.log(JSON.stringify(report.lighthouse.home, null, 2));

  console.log("\n4) Lighthouse (/about)...");
  const lhAbout = join(process.cwd(), ".next", "lighthouse-about.json");
  report.lighthouse.about = await runLighthouse(`${BASE_URL}/about`, lhAbout);
  console.log(JSON.stringify(report.lighthouse.about, null, 2));

  console.log("\n5) Playwright navigation + Web Vitals (lab)...");
  report.playwright = await runPlaywrightMetrics(BASE_URL);
  console.log(JSON.stringify(report.playwright, null, 2));

  const outFile = join(process.cwd(), ".next", "performance-report.json");
  writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(`\nFull report saved: ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
