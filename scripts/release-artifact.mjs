import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

/** Read Git metadata without executing code from the release checkout. */
function git(repository, ...args) {
  return execFileSync('git', args, {
    cwd: repository,
    encoding: 'utf8',
  }).trim();
}

/** Require the stable tag format used by this package's release workflow. */
function stableTag(tag) {
  assert(
    /^v\d+\.\d+\.\d+$/u.test(tag ?? ''),
    'Expected a stable vMAJOR.MINOR.PATCH tag',
  );
}

/** Hash the exact bytes transferred between the build and publication jobs. */
function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Verify the tagged version and master ancestry before building release files. */
export async function verifySourceRelease({
  repository = process.cwd(),
  tag = process.env.RELEASE_TAG,
} = {}) {
  stableTag(tag);
  const commit = git(repository, 'rev-parse', `${tag}^{commit}`);
  assert.equal(
    git(repository, 'rev-parse', 'HEAD'),
    commit,
    'Checkout must be the exact tagged commit',
  );
  execFileSync(
    'git',
    ['merge-base', '--is-ancestor', commit, 'origin/master'],
    { cwd: repository },
  );
  const pkg = JSON.parse(await readFile(path.join(repository, 'package.json')));
  const source = JSON.parse(git(repository, 'show', `${commit}:package.json`));
  assert.equal(source.name, 'yup-phone');
  assert.equal(
    tag,
    `v${source.version}`,
    'Release tag must match the package version',
  );
  assert.equal(
    pkg.version,
    source.version,
    'Working version differs from the tag',
  );
  return { tag, commit, version: source.version };
}

/** Pack the checked release and bind its files to a source commit and digest. */
export async function prepareReleaseArtifact({
  repository = process.cwd(),
  directory = path.resolve(repository, '.release-artifacts'),
  tag = process.env.RELEASE_TAG,
  npmCli = process.env.npm_execpath,
} = {}) {
  assert(npmCli, 'Run through npm run release:prepare');
  const release = await verifySourceRelease({ repository, tag });
  await mkdir(directory, { recursive: true });
  assert.equal(
    (await readdir(directory)).length,
    0,
    'Artifact directory must be empty',
  );
  const [packed] = JSON.parse(
    execFileSync(
      process.execPath,
      [
        npmCli,
        'pack',
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        directory,
      ],
      { cwd: repository, encoding: 'utf8' },
    ),
  );
  const tarball = `yup-phone-${release.version}.tgz`;
  assert.equal(packed.name, 'yup-phone');
  assert.equal(packed.version, release.version);
  assert.equal(packed.filename, tarball);
  const files = [tarball, 'latest.json', 'latest.md'];
  for (const name of files.slice(1)) {
    await copyFile(
      path.join(repository, 'benchmarks/results', name),
      path.join(directory, name),
    );
  }
  const checksums = {};
  for (const name of files)
    checksums[name] = sha256(await readFile(path.join(directory, name)));
  assert.deepEqual(await verifySourceRelease({ repository, tag }), release);
  const manifest = { schema: 1, ...release, checksums };
  const bytes = `${JSON.stringify(manifest, null, 2)}\n`;
  await writeFile(path.join(directory, 'manifest.json'), bytes);
  return { ...release, digest: sha256(bytes) };
}

/** Reject substituted artifacts, moved tags, or releases outside master. */
export async function verifyReleaseArtifact({
  repository = process.cwd(),
  directory = path.resolve(repository, '.release-artifacts'),
  tag = process.env.RELEASE_TAG,
  expectedDigest = process.env.RELEASE_MANIFEST_SHA256,
} = {}) {
  stableTag(tag);
  assert.match(
    expectedDigest ?? '',
    /^[a-f0-9]{64}$/u,
    'Missing trusted artifact digest',
  );
  const bytes = await readFile(path.join(directory, 'manifest.json'));
  assert.equal(
    sha256(bytes),
    expectedDigest,
    'Release manifest checksum mismatch',
  );
  const manifest = JSON.parse(bytes);
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.tag, tag, 'Artifact tag mismatch');
  assert.equal(manifest.version, tag.slice(1), 'Artifact version mismatch');
  assert.match(manifest.commit, /^[a-f0-9]{40}$/u);
  assert.equal(
    git(repository, 'rev-parse', `${tag}^{commit}`),
    manifest.commit,
    'Release tag moved after preparation',
  );
  execFileSync(
    'git',
    ['merge-base', '--is-ancestor', manifest.commit, 'origin/master'],
    { cwd: repository },
  );
  const source = JSON.parse(
    git(repository, 'show', `${manifest.commit}:package.json`),
  );
  assert.equal(source.name, 'yup-phone');
  assert.equal(
    source.version,
    manifest.version,
    'Artifact differs from tagged version',
  );
  const filename = `yup-phone-${manifest.version}.tgz`;
  const names = [filename, 'latest.json', 'latest.md'];
  assert.deepEqual(Object.keys(manifest.checksums).sort(), [...names].sort());
  assert.deepEqual(
    (await readdir(directory)).sort(),
    [...names, 'manifest.json'].sort(),
    'Unexpected release artifact files',
  );
  for (const name of names) {
    assert.equal(
      sha256(await readFile(path.join(directory, name))),
      manifest.checksums[name],
      `Release file checksum mismatch: ${name}`,
    );
  }
  const tarball = path.join(directory, filename);
  const integrity = `sha512-${createHash('sha512')
    .update(await readFile(tarball))
    .digest('base64')}`;
  return { ...manifest, tarball, integrity };
}
