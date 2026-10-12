import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const payload = () => JSON.parse('{"__proto__":{"securityProbe":true}}');

// Exercise the merge implementation each actual consumer resolves, including
// both copy loops and the nested/array paths in CVE-2026-93753.
for (const consumer of ['@rollup/plugin-node-resolve', 'jest-config']) {
  const fromConsumer = createRequire(require.resolve(consumer));
  const merge = fromConsumer('deepmerge');
  const pkg = fromConsumer('deepmerge/package.json');
  assert.equal(pkg.name, '@stackline/deepmerge', consumer);
  const results = [
    merge(Object.create(null), payload()),
    merge({ session: null }, { session: payload() }).session,
    merge(payload(), {}),
    merge([], [payload()])[0],
    merge(
      {},
      JSON.parse('{"constructor":{"prototype":{"securityProbe":true}}}'),
    ),
  ];
  for (const result of results) {
    assert.equal(result.securityProbe, undefined, consumer);
    assert.equal(Object.getPrototypeOf(result), Object.prototype, consumer);
    assert.equal(Object.hasOwn(result, '__proto__'), false, consumer);
  }
  assert.equal({}.securityProbe, undefined, consumer);

  // Jest uses .all() for presets; Rollup merges nested resolver options.
  const defaults = { resolve: { mainFields: ['module'], extensions: ['.js'] } };
  const overrides = { resolve: { mainFields: ['main'] } };
  assert.deepEqual(merge.all([defaults, overrides]), {
    resolve: { mainFields: ['module', 'main'], extensions: ['.js'] },
  });
  assert.deepEqual(
    merge(defaults, overrides, { arrayMerge: (_, source) => source }),
    {
      resolve: { mainFields: ['main'], extensions: ['.js'] },
    },
  );
  assert.deepEqual(defaults.resolve.mainFields, ['module']);
  assert.deepEqual(overrides.resolve.mainFields, ['main']);
}

// Check the locked graph too, so a fresh install cannot silently reintroduce
// the unpatched originals or the obsolete paths displayed by Snyk's SCM scan.
const lock = JSON.parse(
  await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'),
);
for (const [location, pkg] of Object.entries(lock.packages)) {
  const name = pkg.name || location.split('node_modules/').at(-1);
  assert.notEqual(name, 'deepmerge', `${location}: unpatched deepmerge`);
  assert.notEqual(name, 'sprintf-js', `${location}: unpatched sprintf-js`);
  if (name === 'tmp') {
    const [major, minor, patch] = pkg.version.split('.').map(Number);
    assert(
      major > 0 || minor > 2 || (minor === 2 && patch >= 7),
      `${location}: tmp must be at least 0.2.7`,
    );
  }
}
console.log(
  'Security regressions passed for Jest, Rollup, and the locked dependency graph.',
);
