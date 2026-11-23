import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

test('scroll reveals once and keyboard focus cancels motion immediately', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('#contact [data-reveal]');
  await page.getByRole('link', { name: 'thietthachdo@gmail.com' }).focus();
  await expect(footer).toHaveClass(/entered/);
  expect(await footer.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await footer.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await page.locator('h1').click();
  await page.locator('#products').scrollIntoViewIfNeeded();
  const card = page.locator('.product').first();
  await expect(card).toHaveClass(/entered/);
  await expect.poll(() => card.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  // Changing the OS preference while the page is open must stop all movement.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await card.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await card.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.locator('h1').scrollIntoViewIfNeeded();
  await card.scrollIntoViewIfNeeded();
  expect(await card.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
});

test('content remains readable without IntersectionObserver', async ({ page }) => {
  await page.addInitScript(() => { delete (window as Partial<Window>).IntersectionObserver; });
  await page.goto('/en/');
  const email = page.getByRole('link', { name: 'thietthachdo@gmail.com' });
  await email.scrollIntoViewIfNeeded();
  const footer = page.locator('#contact [data-reveal]');
  expect(await footer.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  expect(await footer.evaluate(el => getComputedStyle(el).transform)).toBe('none');
});
