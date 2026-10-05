import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const tarball = `yup-phone-${pkg.version}.tgz`;
const integrity = `sha512-${createHash('sha512')
  .update(await readFile(tarball))
  .digest('base64')}`;
const response = await fetch(
  `https://registry.npmjs.org/yup-phone/${encodeURIComponent(pkg.version)}`,
);
if (response.ok) {
  const existing = await response.json();
  assert.equal(
    existing.dist?.integrity,
    integrity,
    'This npm version already exists with different package contents',
  );
  console.log(
    `yup-phone@${pkg.version} already published with the same integrity; continuing artifact upload.`,
  );
} else {
  assert.equal(response.status, 404, 'Could not verify npm release state');
  assert(process.env.npm_execpath, 'Run through npm run release:publish');
  execFileSync(
    process.execPath,
    [
      process.env.npm_execpath,
      'publish',
      tarball,
      '--provenance',
      '--access',
      'public',
      '--ignore-scripts',
    ],
    { stdio: 'inherit' },
  );
}
