import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildAstro } from './build-astro';

const urls = {
  Ganbarou: 'https://heyganba.site/',
  Jiayou: 'https://jiayou.example.test/learn/',
};

test('configured HTTPS product URLs produce direct, same-tab links in both languages', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium-desktop', 'This test checks the static build output once');
  test.setTimeout(120_000);
  const output = info.outputPath('fixture');
  await buildAstro(output, { GANBAROU_URL: urls.Ganbarou, JIAYOU_URL: urls.Jiayou });
  for (const index of ['index.html', 'en/index.html']) {
    const html = await readFile(join(output, index), 'utf8');
    await page.setContent(html);
    const products = page.locator('#products');
    for (const [product, url] of Object.entries(urls)) {
      const article = products.getByRole('article').filter({ has: page.getByRole('heading', { name: product }) });
      const link = article.getByRole('link', { name: new RegExp(product) });
      await expect(link).toHaveAttribute('href', url);
      expect([null, '_self']).toContain(await link.getAttribute('target'));
    }
  }

  // Test the current real project state: Ganbarou is approved (https://heyganba.site/), Jiayou remains coming-soon
  const realStateOutput = info.outputPath('ganbarou-only');
  await buildAstro(realStateOutput, { GANBAROU_URL: 'https://heyganba.site/' });
  for (const [index, soonText] of [['index.html', 'Sắp ra mắt'], ['en/index.html', 'Coming soon']]) {
    const html = await readFile(join(realStateOutput, index), 'utf8');
    await page.setContent(html);
    const products = page.locator('#products');
    const ganbarouArticle = products.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Ganbarou' }) });
    const ganbarouLink = ganbarouArticle.getByRole('link', { name: /Ganbarou/i });
    await expect(ganbarouLink).toHaveAttribute('href', 'https://heyganba.site/');
    expect([null, '_self']).toContain(await ganbarouLink.getAttribute('target'));

    const jiayouArticle = products.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Jiayou' }) });
    await expect(jiayouArticle.getByText(soonText, { exact: true })).toBeVisible();
    await expect(jiayouArticle.getByRole('link')).toHaveCount(0);
  }

  // A build must refuse product links that are not plain HTTPS URLs.
  for (const [label, value] of [
    ['insecure', 'http://ganbarou.example.test/'],
    ['credentials', 'https://user:secret@ganbarou.example.test/'],
  ]) {
    await expect(
      buildAstro(info.outputPath('invalid-' + label), { GANBAROU_URL: value }),
    ).rejects.toMatchObject({ code: 1 });
  }
});

test('production builds index both languages while preview builds stay noindex', async ({}, info) => {
  test.skip(info.project.name !== 'chromium-desktop', 'This test checks the static build output once');
  test.setTimeout(120_000);
  const output = info.outputPath('production');
  await buildAstro(output, { SITE_ENV: 'production', SITE_URL: 'https://thadocorp.com' });

  for (const path of ['index.html', 'en/index.html']) {
    const html = await readFile(join(output, path), 'utf8');
    expect(html, path).not.toMatch(/name="robots"/);
    expect(html, path).toContain('rel="canonical"');
    expect(html, path).toContain('hreflang="vi"');
    expect(html, path).toContain('hreflang="en"');
  }

  const robots = await readFile(join(output, 'robots.txt'), 'utf8');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap: https://thadocorp.com/sitemap.xml');
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
  expect(sitemap).toContain('<loc>https://thadocorp.com/</loc>');
  expect(sitemap).toContain('<loc>https://thadocorp.com/en/</loc>');

  // Guard the release switch: a production build must reject any other origin.
  await expect(
    buildAstro(info.outputPath('wrong-origin'), { SITE_ENV: 'production', SITE_URL: 'https://wrong.example' }),
  ).rejects.toMatchObject({ code: 1 });
});
