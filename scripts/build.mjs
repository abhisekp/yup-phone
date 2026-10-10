import { build } from 'esbuild';
import { rollup } from 'rollup';
import { mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { root, generatedPath } from './paths.mjs';
import config from '../rollup.config.mjs';

// Fixed repository-local generated directories.
process.chdir(root);
await rm(generatedPath('dist'), { recursive: true, force: true });
await rm(generatedPath('.build'), { recursive: true, force: true });
await mkdir('dist', { recursive: true });
const common = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: 'es2020',
  external: ['yup', 'libphonenumber-js/max'],
  sourcemap: true,
};
await build({
  ...common,
  format: 'cjs',
  platform: 'node',
  outfile: 'dist/yup-phone.cjs.js',
});
await build({
  ...common,
  format: 'esm',
  platform: 'neutral',
  outfile: 'dist/yup-phone.esm.mjs',
});
await copyFile('dist/yup-phone.esm.mjs', 'dist/yup-phone.esm.js');
await build({
  ...common,
  format: 'esm',
  platform: 'browser',
  outfile: '.build/index.js',
});
const bundle = await rollup(config);
try {
  for (const output of config.output) await bundle.write(output);
} finally {
  await bundle.close();
}
execFileSync(
  process.execPath,
  [
    'node_modules/typescript/bin/tsc',
    '--singleThreaded',
    '-p',
    'tsconfig.build.json',
  ],
  { stdio: 'inherit' },
);
const declaration = "import './index';\nexport {};\n";
for (const name of ['cjs', 'esm', 'umd', 'umd.min']) {
  await writeFile(`dist/yup-phone.${name}.d.ts`, declaration);
}
await writeFile(
  'dist/yup-phone.esm.d.mts',
  "import './index.js';\nexport {};\n",
);
// Keep the self-hosted Pages playground in sync with the package and Yup versions.
await import('./build-docs.mjs');
