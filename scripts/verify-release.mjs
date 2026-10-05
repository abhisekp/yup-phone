import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const tag = process.env.RELEASE_TAG;
assert(
  /^v\d+\.\d+\.\d+$/.test(tag ?? ''),
  'Expected a stable vMAJOR.MINOR.PATCH tag',
);
assert.equal(
  tag,
  `v${pkg.version}`,
  'Release tag must match the package version',
);
const head = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const tagged = execFileSync('git', ['rev-parse', `${tag}^{commit}`], {
  encoding: 'utf8',
}).trim();
assert.equal(head, tagged, 'Checkout must be the exact tagged commit');
execFileSync('git', ['merge-base', '--is-ancestor', head, 'origin/master']);
console.log(`Verified ${tag} at ${head} on master.`);
