import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { root, generatedPath } from './paths.mjs';

const pkg = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
);
const yup = JSON.parse(
  await readFile(
    new URL('../node_modules/yup/package.json', import.meta.url),
    'utf8',
  ),
);
await build({
  absWorkingDir: root,
  entryPoints: ['docs/assets/playground.mjs'],
  outfile: generatedPath('docs/assets/playground.js'),
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  minify: true,
  legalComments: 'eof',
  define: {
    __PACKAGE_VERSION__: JSON.stringify(pkg.version),
    __YUP_VERSION__: JSON.stringify(yup.version),
  },
});
