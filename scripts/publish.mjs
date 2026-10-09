import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyReleaseArtifact } from './release-artifact.mjs';

/** Publish only a verified tarball, or confirm an identical earlier publication. */
export async function publishRelease({
  directory = path.resolve('.release-artifacts'),
  repository = process.cwd(),
  tag = process.env.RELEASE_TAG,
  expectedDigest = process.env.RELEASE_MANIFEST_SHA256,
  fetchRegistry = fetch,
  runPublish = (args) => {
    assert(process.env.npm_execpath, 'Run through npm run release:publish');
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
      stdio: 'inherit',
    });
  },
} = {}) {
  const release = await verifyReleaseArtifact({
    directory,
    repository,
    tag,
    expectedDigest,
  });
  const response = await fetchRegistry(
    `https://registry.npmjs.org/yup-phone/${encodeURIComponent(release.version)}`,
  );
  if (response.ok) {
    const existing = await response.json();
    assert.equal(
      existing.dist?.integrity,
      release.integrity,
      'This npm version already exists with different package contents',
    );
    console.log(
      `yup-phone@${release.version} already published with the same integrity; continuing artifact upload.`,
    );
  } else {
    assert.equal(response.status, 404, 'Could not verify npm release state');
    runPublish([
      'publish',
      release.tarball,
      '--provenance',
      '--access',
      'public',
      '--ignore-scripts',
    ]);
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await publishRelease();
}
