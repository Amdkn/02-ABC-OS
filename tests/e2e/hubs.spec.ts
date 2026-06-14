import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'https://abc-os.kalybana.com';

const HUBS = [
  { name: 'Dashboard',  path: '/',          title: 'Dashboard' },
  { name: 'Community',  path: '/community', title: 'Community' },
  { name: 'Learn',      path: '/learn',     title: 'Learn' },
  { name: 'Build',      path: '/build-hub', title: 'Build' },
  { name: 'Brand',      path: '/brand',     title: 'Brand' },
];

for (const hub of HUBS) {
  test(`hub ${hub.name} (${hub.path}) loads with no console errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('requestfailed', (req) => {
      // Ignore cross-origin noise we cannot control
      const url = req.url();
      if (url.includes('favicon') || url.includes('chrome-extension')) return;
      failedRequests.push(`${req.method()} ${url} :: ${req.failure()?.errorText}`);
    });

    const response = await page.goto(BASE + hub.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response, `no response for ${hub.path}`).not.toBeNull();
    expect(response!.status(), `${hub.path} HTTP status`).toBeLessThan(400);

    // Wait for body to be present
    await page.waitForSelector('body', { timeout: 5000 });

    // Mobile-first breakpoint = check that mobile nav (4 items) renders
    const mobileNavItems = await page.locator('nav[aria-label="Main navigation"] a, nav.md\\:hidden a').count();
    if (mobileNavItems > 0) {
      // Mobile nav present — expect 4 items
      expect(mobileNavItems, `${hub.path} mobile nav items (grid-cols-4 = 4 items)`).toBeGreaterThanOrEqual(4);
    }

    // Check that "Back to Dashboard" home button is present on hub pages (not on / itself)
    if (hub.path !== '/') {
      const homeBtn = await page.locator('[aria-label="Back to Dashboard"]').count();
      expect(homeBtn, `${hub.path} has Home button (aria-label="Back to Dashboard")`).toBeGreaterThanOrEqual(1);
    }

    // Check Material Symbols font loaded (no "ligature as text" bug)
    const sampleSymbol = await page.locator('.material-symbols-outlined').first().textContent();
    if (sampleSymbol) {
      // Material Symbols is a font — when broken it shows the ligature text like "dashboard" / "groups"
      // When working, computed fontFamily contains "Material Symbols"
      const fontFamily = await page.locator('.material-symbols-outlined').first().evaluate(
        (el) => window.getComputedStyle(el).fontFamily
      );
      expect(
        fontFamily,
        `${hub.path} first icon has Material Symbols font-family (got: ${fontFamily})`
      ).toMatch(/Material Symbols/i);
    }

    // Check no console errors
    expect(consoleErrors, `${hub.path} console errors: ${consoleErrors.join('\n')}`).toEqual([]);
    expect(pageErrors, `${hub.path} page errors: ${pageErrors.join('\n')}`).toEqual([]);

    // Screenshot for visual evidence
    await page.screenshot({
      path: `../../scratch/hub-${hub.name.toLowerCase()}.png`,
      fullPage: true,
    });
  });
}

test('login page accessible and renders form', async ({ page }) => {
  const response = await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);

  // Email + Password fields must exist
  await expect(page.locator('input[type="email"]')).toHaveCount(1);
  await expect(page.locator('input[type="password"]')).toHaveCount(1);

  // Sign in / Sign up toggle
  await expect(page.locator('text=Sign in').first()).toBeVisible();

  await page.screenshot({ path: '../../scratch/login.png', fullPage: true });
});
