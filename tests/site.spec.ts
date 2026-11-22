import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const locales = [
  { lang: 'vi', path: '/', alternate: '/en/', soon: 'Sắp ra mắt' },
  { lang: 'en', path: '/en/', alternate: '/', soon: 'Coming soon' },
] as const;

const anchors = ['about', 'sectors', 'products', 'contact'];

async function checkViewport(page: Page) {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, 'The page must fit the viewport width').toBeLessThanOrEqual(1);
}

for (const locale of locales) {
  test.describe(locale.lang, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(locale.path);
    });

    test('metadata, navigation, products and contact', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
      await expect(page).toHaveTitle(/THADO/i);
      await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//);
      for (const language of locales) {
        const href = await page.locator(`head link[rel="alternate"][hreflang="${language.lang}"]`).getAttribute('href');
        expect(new URL(href!).pathname).toBe(language.path);
      }
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const menu = page.locator('header button[aria-expanded]');
      const collapses = await menu.isVisible();
      if (collapses) await menu.click();
      for (const id of anchors) {
        await expect(page.locator(`header a[href$="#${id}"]:visible`).first()).toBeVisible();
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
      const languageLink = page.locator(`header a[href="${locale.alternate}"]:visible`).first();
      await languageLink.click();
      await expect(page).toHaveURL(new RegExp(`${locale.alternate}$`));
      await expect(page.locator('html')).not.toHaveAttribute('lang', locale.lang);
      await page.goto(locale.path);
      await page.locator('main a[href$="#products"]').first().click();
      await expect(page).toHaveURL(/#products$/);
      const products = page.locator('#products');
      await expect(products).toBeInViewport();
      for (const product of ['Ganbarou', 'Jiayou']) {
        await expect(products.getByRole('heading', { name: new RegExp(product, 'i') })).toBeVisible();
      }
      const links = products.locator('a');
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('href', /^https:\/\//);
        expect([null, '_self']).toContain(await link.getAttribute('target'));
        await expect(link).toHaveAccessibleName(/Ganbarou|Jiayou/i);
      }
      const statuses = products.getByText(locale.soon, { exact: true });
      expect(await links.count() + await statuses.count()).toBe(2);
      const contact = page.locator('#contact');
      await expect(contact).toContainText('Thach Do');
      await expect(contact.getByRole('link', { name: /0354314095/ })).toHaveAttribute('href', 'tel:+84354314095');
      for (const [service, href] of [
        ['Facebook', 'https://www.facebook.com/hcaht.09?locale=vi_VN'],
        ['GitHub', 'https://github.com/thach09'],
      ]) {
        const link = contact.getByRole('link', { name: new RegExp(service, 'i') });
        await expect(link).toHaveAttribute('href', href);
        const dimensions = await link.boundingBox();
        expect(dimensions!.width).toBeGreaterThanOrEqual(44);
        expect(dimensions!.height).toBeGreaterThanOrEqual(44);
      }
      const phone = contact.getByRole('link', { name: /0354314095/ });
      const copy = contact.getByRole('button', { name: /Zalo|sao chép|copy/i });
      for (const target of [phone, copy]) {
        const dimensions = await target.boundingBox();
        expect(dimensions!.width, 'Touch target width').toBeGreaterThanOrEqual(44);
        expect(dimensions!.height, 'Touch target height').toBeGreaterThanOrEqual(44);
      }
      await checkViewport(page);
    });

    test('mobile navigation opens with keyboard and closes with Escape', async ({ page }) => {
      const menu = page.locator('header button[aria-expanded]');
      test.skip(!(await menu.isVisible()), 'This viewport uses expanded navigation');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await menu.focus();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      const about = page.locator('header a[href$="#about"]:visible').first();
      await about.focus();
      await page.keyboard.press('Escape');
      await expect(menu).toBeFocused();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.locator('header a[href$="#about"]:visible').first().click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(page).toHaveURL(/#about$/);
    });

    test('Zalo copy action reports feedback and keeps the number readable', async ({ page }) => {
      const contact = page.locator('#contact');
      const copy = contact.getByRole('button', { name: /Zalo|sao chép|copy/i });
      const feedback = contact.locator('[aria-live], [role="status"]').first();
      await expect(copy).toBeVisible();
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: (value: string) => { document.body.dataset.copied = value; return Promise.resolve(); } },
        });
      });
      await copy.click();
      await expect(page.locator('body')).toHaveAttribute('data-copied', '0354314095');
      await expect(feedback).toContainText(/(Đã sao chép|number copied)/i);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
        document.execCommand = () => true;
      });
      await copy.click();
      await expect(feedback).toContainText(/(Đã sao chép|number copied)/i);
      await page.evaluate(() => { document.execCommand = () => false; });
      await copy.click();
      await expect(feedback).toContainText(/(chọn và sao chép|Select and copy)/i);
      await expect(contact).toContainText('0354314095');
    });

    test('accessibility, reduced motion and visual evidence', async ({ page }, info) => {
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).not.toBe('smooth');
      const issues = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(issues.violations.map(v => ({ id: v.id, targets: v.nodes.map(node => node.target) }))).toEqual([]);
      await checkViewport(page);
      if (info.project.name.startsWith('chromium')) {
        const screenshot = { fullPage: true };
        const evidenceDir = process.env.QA_SCREENSHOT_DIR;
        if (evidenceDir) await mkdir(evidenceDir, { recursive: true });
        const path = evidenceDir && `${evidenceDir}/${locale.lang}-${info.project.name}.png`;
        await info.attach('landing', { body: await page.screenshot({ ...screenshot, path }), contentType: 'image/png' });
      }
    });
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  for (const locale of locales) {
    test(locale.lang, async ({ page }) => {
      await page.goto(locale.path);
      const cta = page.locator('main a[href$="#products"]').first();
      await expect(cta).toBeVisible();
      await cta.click();
      await expect(page).toHaveURL(/#products$/);
      await expect(page.locator('#products')).toBeInViewport();
      for (const selector of ['h1', '#products h3', '#contact a[href^="tel:"]']) {
        const readable = await page.locator(selector).first().evaluate((element) => {
          for (let node: Element | null = element; node; node = node.parentElement) {
            const style = getComputedStyle(node);
            if (Number(style.opacity) === 0 || style.visibility === 'hidden' || style.display === 'none') return false;
          }
          return true;
        });
        expect(readable, selector).toBe(true);
      }
      const phone = page.locator('a[href="tel:+84354314095"]');
      await expect(phone).toBeVisible();
      await expect(page.locator('#contact')).toContainText('0354314095');
      await checkViewport(page);
    });
  }
});

test('unknown paths return a branded 404 with a way home', async ({ page }) => {
  const response = await page.goto('/missing-thado-test-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toContainText(/THADO/i);
  const homeLink = page.locator('a[href="/"]').last();
  await homeLink.click();
  await expect(page.locator('#products')).toBeVisible();
});

test('hero CTA works while assets load on a slow mobile connection', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'Uses Chromium network emulation at 360 px');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const network = await context.newCDPSession(page);
  await network.send('Network.enable');
  await network.send('Network.emulateNetworkConditions', {
    offline: false, latency: 400, downloadThroughput: 50_000, uploadThroughput: 25_000,
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const cta = page.locator('main a[href$="#products"]').first();
  await cta.focus();
  const focusedOutline = await cta.evaluate(el => getComputedStyle(el).outlineStyle);
  expect(focusedOutline).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#products$/);
  await expect(page.locator('#products')).toBeInViewport();
  await checkViewport(page);
});
