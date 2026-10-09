import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedPath } from './paths.mjs';
import {
  prepareReleaseArtifact,
  verifyReleaseArtifact,
  verifySourceRelease,
} from './release-artifact.mjs';
import { publishRelease } from './publish.mjs';

const repository = generatedPath('.build/release-tests');
await rm(repository, { recursive: true, force: true });
await mkdir(path.join(repository, 'benchmarks/results'), { recursive: true });

/** Create release history only inside the disposable test repository. */
function git(...args) {
  return execFileSync(
    'git',
    [
      '-c',
      'commit.gpgsign=false',
      '-c',
      'tag.gpgsign=false',
      '-c',
      `core.hooksPath=${path.join(repository, 'empty-hooks')}`,
      ...args,
    ],
    {
      cwd: repository,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  ).trim();
}

try {
  await writeFile(
    path.join(repository, 'package.json'),
    JSON.stringify({
      name: 'yup-phone',
      version: '2.0.0',
      files: ['payload.js'],
      scripts: {
        prepack:
          "node -e \"require('fs').writeFileSync('lifecycle-ran', 'bad')\"",
      },
    }),
  );
  await writeFile(
    path.join(repository, 'payload.js'),
    'module.exports = true;\n',
  );
  await writeFile(
    path.join(repository, 'benchmarks/results/latest.json'),
    '{"tested":true}\n',
  );
  await writeFile(
    path.join(repository, 'benchmarks/results/latest.md'),
    'Verified benchmark fixture.\n',
  );
  git('init', '--initial-branch=master');
  git('config', 'user.name', 'Release test');
  git('config', 'user.email', 'release-test@example.invalid');
  git('add', '.');
  git('commit', '-m', 'test: release fixture');
  git('tag', 'v2.0.0');
  git('update-ref', 'refs/remotes/origin/master', 'HEAD');
  const directory = path.join(repository, 'artifacts');
  const prepared = await prepareReleaseArtifact({
    repository,
    directory,
    tag: 'v2.0.0',
  });
  const options = {
    repository,
    directory,
    tag: prepared.tag,
    expectedDigest: prepared.digest,
  };
  const release = await verifyReleaseArtifact(options);
  await assert.rejects(access(path.join(repository, 'lifecycle-ran')));

  // Artifacts and their reports must fail verification after any substitution.
  for (const name of [
    'manifest.json',
    'yup-phone-2.0.0.tgz',
    'latest.json',
    'latest.md',
  ]) {
    const file = path.join(directory, name);
    const original = await readFile(file);
    await writeFile(file, Buffer.concat([original, Buffer.from('tampered')]));
    await assert.rejects(verifyReleaseArtifact(options), /checksum mismatch/u);
    await writeFile(file, original);
  }
  await writeFile(path.join(directory, 'unexpected.tgz'), 'extra package');
  await assert.rejects(
    verifyReleaseArtifact(options),
    /Unexpected release artifact/u,
  );
  await rm(path.join(directory, 'unexpected.tgz'));
  await assert.rejects(
    verifyReleaseArtifact({ ...options, expectedDigest: '' }),
    /Missing trusted artifact/u,
  );
  await assert.rejects(
    verifyReleaseArtifact({ ...options, tag: 'master' }),
    /stable/u,
  );
  await assert.rejects(
    verifyReleaseArtifact({ ...options, tag: 'v2.0.1' }),
    /tag mismatch/u,
  );

  // A workflow revision newer than a release tag can safely retry that artifact.
  await writeFile(
    path.join(repository, 'package.json'),
    JSON.stringify({ name: 'yup-phone', version: '2.0.1' }),
  );
  await writeFile(
    path.join(repository, 'payload.js'),
    'module.exports = false;\n',
  );
  git('add', 'payload.js', 'package.json');
  git('commit', '-m', 'test: newer workflow revision');
  const newer = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/master', newer);
  assert.equal((await verifyReleaseArtifact(options)).commit, prepared.commit);
  await assert.rejects(
    verifySourceRelease({ repository, tag: prepared.tag }),
    /exact tagged commit/u,
  );
  git('tag', '--force', prepared.tag, newer);
  await assert.rejects(verifyReleaseArtifact(options), /tag moved/u);
  git('tag', '--force', prepared.tag, prepared.commit);

  // An otherwise matching tag cannot release a commit outside master ancestry.
  git('checkout', '--orphan', 'unmerged');
  git('commit', '-m', 'test: unrelated history');
  git('update-ref', 'refs/remotes/origin/master', 'HEAD');
  await assert.rejects(verifyReleaseArtifact(options));
  git('checkout', 'master');
  git('update-ref', 'refs/remotes/origin/master', newer);

  const calls = [];
  const request = { ...options, runPublish: (args) => calls.push(args) };
  await publishRelease({
    ...request,
    fetchRegistry: () => Promise.resolve({ ok: false, status: 404 }),
  });
  assert.deepEqual(calls, [
    [
      'publish',
      release.tarball,
      '--provenance',
      '--access',
      'public',
      '--ignore-scripts',
    ],
  ]);
  await publishRelease({
    ...request,
    fetchRegistry: () =>
      Promise.resolve({
        ok: true,
        json: () => ({ dist: { integrity: release.integrity } }),
      }),
  });
  assert.equal(calls.length, 1);
  await assert.rejects(
    publishRelease({
      ...request,
      fetchRegistry: () =>
        Promise.resolve({
          ok: true,
          json: () => ({ dist: { integrity: 'different' } }),
        }),
    }),
    /different package contents/u,
  );
  await assert.rejects(
    publishRelease({
      ...request,
      fetchRegistry: () => Promise.resolve({ ok: false, status: 503 }),
    }),
    /verify npm release state/u,
  );
  assert.equal(calls.length, 1);
  console.log(
    'Release artifact tampering, tag movement, ancestry and publication retries passed; nothing published.',
  );
} finally {
  await rm(repository, { recursive: true, force: true });
}
