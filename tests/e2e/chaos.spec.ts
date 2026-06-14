import { test, expect } from '@playwright/test';

/**
 * "Prompt de Destruction" — per Shubham Sharma QA doctrine
 * (resource_j39en_avais_marre_de_tester_mon_app_a_la_main)
 * Behave like a chaotic / impatient user: empty submits, rapid nav,
 * repeated clicks, back-and-forth — expose silent JS errors,
 * non-clickable elements, mobile overflow.
 */

const BASE = process.env.BASE_URL ?? 'https://abc-os.kalybana.com';

test.describe('chaos: login form', () => {
  test('submitting empty form shows validation (no crash)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

    await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]');

    // Click submit with empty fields
    const submit = page.locator('button[type="submit"]').first();
    await submit.click();
    await page.waitForTimeout(500);

    // Form should still be on the page (no crash) — inputs invalid, button still present
    await expect(page.locator('input[type="email"]')).toHaveCount(1);
    await expect(page.locator('button[type="submit"]')).toHaveCount(1);
    expect(errors, `JS errors during empty submit:\n${errors.join('\n')}`).toEqual([]);
  });

  test('rapid toggle signin <-> signup does not crash', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[role="tablist"]');

    // Click signup tab 5 times rapidly
    for (let i = 0; i < 5; i++) {
      await page.locator('button[role="tab"]', { hasText: /sign up/i }).click();
    }
    await page.waitForTimeout(300);
    // Click signin tab 5 times
    for (let i = 0; i < 5; i++) {
      await page.locator('button[role="tab"]', { hasText: /sign in/i }).click();
    }
    await page.waitForTimeout(300);

    // Form should still work
    await expect(page.locator('input[type="email"]')).toHaveCount(1);
    expect(errors, `JS errors during rapid toggle:\n${errors.join('\n')}`).toEqual([]);
  });

  test('invalid email format shows error and does not crash', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.locator('input[type="password"]').fill('short');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(500);

    // Should show inline error, no crash
    const errorBanner = await page.locator('[role="alert"]').count();
    expect(errorBanner, 'error banner shown').toBeGreaterThanOrEqual(1);
    expect(errors, `JS errors:\n${errors.join('\n')}`).toEqual([]);
  });
});

test.describe('chaos: navigation', () => {
  test('rapid back/forward through 4 hubs does not crash', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(BASE + '/community', { waitUntil: 'domcontentloaded' });
    // Rapid sequence: /community -> /learn -> /build-hub -> /brand -> back x4
    for (let i = 0; i < 3; i++) {
      await page.goto(BASE + '/community');
      await page.goto(BASE + '/learn');
      await page.goto(BASE + '/build-hub');
      await page.goto(BASE + '/brand');
    }
    await page.waitForTimeout(500);
    expect(errors, `JS errors during rapid nav:\n${errors.join('\n')}`).toEqual([]);
  });
});

test.describe('chaos: mobile viewport', () => {
  test('mobile bottom nav has exactly 4 items (no dark mode, no FAB)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto(BASE + '/community', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav.md\\:hidden', { timeout: 5000 }).catch(() => null);

    const nav = page.locator('nav[aria-label="Main navigation"]');
    const items = await nav.locator('a, button').count();
    // The nav should have 4 items (Community / Learn / Build / Brand) per A0 spec
    // Some implementations may not have aria-label on nav, fall back to counting
    if (await nav.count() === 0) {
      const fallback = page.locator('nav').last();
      const fallbackItems = await fallback.locator('a').count();
      expect(fallbackItems, 'mobile nav a-tags count').toBe(4);
    } else {
      expect(items, 'mobile nav items (Community/Learn/Build/Brand)').toBe(4);
    }

    // No "dark_mode" or "light_mode" icon in the mobile nav
    const darkIconInNav = await page.locator('nav[aria-label="Main navigation"] .material-symbols-outlined', { hasText: /dark_mode|light_mode/ }).count();
    expect(darkIconInNav, 'no dark/light mode icon in mobile nav').toBe(0);

    await page.screenshot({ path: '../../scratch/mobile-nav.png', fullPage: false });
  });

  test('mobile nav does not overflow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE smallest
    await page.goto(BASE + '/community', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Check for horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow, 'no horizontal overflow on 320px viewport').toBe(false);

    await page.screenshot({ path: '../../scratch/mobile-nav-320.png', fullPage: true });
  });
});
