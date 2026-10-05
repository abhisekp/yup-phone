import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const target = 'dist/yup-phone.cjs.js';
const current = await readFile(target);
try {
  const baseline = execFileSync('git', [
    'show',
    'v1.3.2:dist/yup-phone.cjs.js',
  ]);
  await writeFile(target, baseline);
  execFileSync(
    process.execPath,
    ['node_modules/jest/bin/jest.js', '--runInBand', 'src/yup-phone.test.ts'],
    { stdio: 'inherit' },
  );
} finally {
  await writeFile(target, current);
}
