import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import { root, generatedPath } from './paths.mjs';

const npmCli = process.env.npm_execpath;
process.chdir(root);
assert(npmCli, 'Run through npm run test:package');
/** Run the same npm CLI that launched this consumer verification. */
const npm = (args, options = {}) =>
  execFileSync(process.execPath, [npmCli, ...args], {
    encoding: 'utf8',
    ...options,
  });
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
assert.equal('browser' in pkg, false);
assert.equal(pkg.sideEffects, true);
const directory = generatedPath('.build/package-test');
await rm(directory, { recursive: true, force: true });
await mkdir(directory, { recursive: true });
const [packed] = JSON.parse(
  npm(['pack', '--ignore-scripts', '--json', '--pack-destination', directory]),
);
for (const field of ['main', 'module', 'types', 'unpkg', 'jsdelivr']) {
  assert(
    packed.files.some((file) => file.path === pkg[field]),
    `${field} file missing from tarball`,
  );
}
assert(
  !packed.files.some((file) =>
    /^(src|scripts|benchmarks|node_modules|\.github)\//.test(file.path),
  ),
);
await writeFile(
  path.join(directory, 'package.json'),
  JSON.stringify({ private: true }),
);
const yupVersion = JSON.parse(
  await readFile('node_modules/yup/package.json', 'utf8'),
).version;
npm(
  [
    'install',
    path.join(directory, packed.filename),
    `yup@${yupVersion}`,
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
  ],
  { cwd: directory, stdio: 'inherit' },
);
npm(['audit', '--omit=dev', '--audit-level=low'], {
  cwd: directory,
  stdio: 'inherit',
});

const assertions = `
const schema = yup.string().phone();
assert.equal(schema.isValidSync('9876543210'), true);
assert.equal(schema.isValidSync('bad'), false);
assert.equal(yup.string().phone('IN', true).isValidSync('+1 345 9490088'), false);
`;
await writeFile(
  path.join(directory, 'consumer.cjs'),
  `const assert = require('node:assert/strict'); const yup = require('yup'); require('yup-phone'); ${assertions}`,
);
await writeFile(
  path.join(directory, 'consumer.mjs'),
  `import assert from 'node:assert/strict'; import * as yup from 'yup'; import 'yup-phone'; ${assertions}`,
);
for (const file of ['consumer.cjs', 'consumer.mjs'])
  execFileSync(process.execPath, [file], { cwd: directory, stdio: 'inherit' });

await writeFile(
  path.join(directory, 'umd.cjs'),
  `
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
for (const filename of ['yup-phone.umd.js', 'yup-phone.umd.min.js']) {
  const yup = require('yup');
  delete yup.string.prototype.phone;
  const source = readFileSync(require.resolve('yup-phone/dist/' + filename), 'utf8');
  // No require/module objects: exercise the browser-global UMD branch.
  runInNewContext(source, { yup });
  { ${assertions} }
  const define = (dependencies, factory) => { assert.deepEqual(Array.from(dependencies), ['yup']); factory(yup); };
  define.amd = {};
  delete yup.string.prototype.phone;
  runInNewContext(source, { define });
  { ${assertions} }
  delete yup.string.prototype.phone;
  require('yup-phone/dist/' + filename);
  { ${assertions} }
}
`,
);
execFileSync(process.execPath, ['umd.cjs'], {
  cwd: directory,
  stdio: 'inherit',
});
// Reproduce the web-bundler metadata issue against the real installed tarball.
await writeFile(
  path.join(directory, 'browser.mjs'),
  `
import { string } from 'yup';
import 'yup-phone';
globalThis.phoneResults = [
  string().phone('US', true).isValidSync('9435551234'),
  string().phone('SG').isValidSync('+6599555555'),
  string().phone('IN', true).isValidSync('+1 345 9490088'),
];
`,
);
const browser = await build({
  absWorkingDir: directory,
  entryPoints: ['browser.mjs'],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  write: false,
  metafile: true,
});
const context = {};
runInNewContext(browser.outputFiles[0].text, context);
assert.deepEqual(Array.from(context.phoneResults), [true, false, false]);
const inputs = Object.keys(browser.metafile.inputs);
assert(
  inputs.some((file) => file.includes('libphonenumber-js/metadata.max.json')),
);
assert(
  !inputs.some((file) => /google-libphonenumber|yup-phone\.umd/u.test(file)),
);
await writeFile(
  path.join(directory, 'consumer.ts'),
  "import { string, type InferType } from 'yup'; import 'yup-phone'; const schema = string().required().phone(); const value: InferType<typeof schema> = '9876543210'; // @ts-expect-error required inference must survive phone()\nconst invalid: InferType<typeof schema> = undefined; void [value, invalid];",
);
await writeFile(
  path.join(directory, 'consumer.mts'),
  await readFile(path.join(directory, 'consumer.ts')),
);
await writeFile(
  path.join(directory, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      skipLibCheck: false,
      module: 'Node16',
      moduleResolution: 'Node16',
      target: 'ES2020',
      noEmit: true,
    },
    files: ['consumer.ts', 'consumer.mts'],
  }),
);
execFileSync(
  process.execPath,
  [
    path.resolve('node_modules/typescript/bin/tsc'),
    '--singleThreaded',
    '-p',
    directory,
  ],
  { stdio: 'inherit' },
);
console.log(
  `Packed CJS, ESM, browser bundle, UMD global/AMD and TypeScript consumers passed with Yup ${yupVersion}.`,
);
