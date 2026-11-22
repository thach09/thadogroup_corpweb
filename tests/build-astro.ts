import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);

/**
 * Build the site into a test-specific output directory.
 * Astro renames generated assets, so keep the output on the project volume on Windows.
 */
export async function buildAstro(outDir: string, env: Record<string, string> = {}) {
  const pkg = JSON.parse(await readFile(resolve('node_modules/astro/package.json'), 'utf8'));
  const cli = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.astro;
  await exec(process.execPath, [resolve('node_modules/astro', cli), 'build', '--outDir', outDir], {
    env: { ...process.env, ...env },
  });
}
