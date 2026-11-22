import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('both pages load their assets under the Pages content security policy', async ({ page, baseURL }) => {
  const headers = await readFile('dist/_headers', 'utf8');
  const policy = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/mi)?.[1].trim();
  if (!policy) throw new Error('Missing Content-Security-Policy in dist/_headers');
  for (const expected of [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ]) {
    expect(policy, expected).toContain(expected);
  }
  expect(policy).not.toMatch(/unsafe-(inline|eval)/);
  for (const header of [
    'X-Frame-Options: DENY',
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security: max-age=31536000',
  ]) {
    expect(headers, header).toContain(header);
  }

  const violations: string[] = [];
  await page.exposeFunction('reportPolicyViolation', (directive: string, uri: string) => {
    violations.push(`${directive} blocked ${uri}`);
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      const report = (window as Window & {
        reportPolicyViolation: (directive: string, uri: string) => void;
      }).reportPolicyViolation;
      report(event.effectiveDirective, event.blockedURI);
    });
  });
  // Astro preview serves static files. Apply the same document header as Cloudflare Pages.
  await page.route((url) => url.origin === baseURL, async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy } });
  });
  for (const path of ['/', '/en/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#copy-number')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    expect(violations, path).toEqual([]);
  }
});
