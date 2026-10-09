import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import os from 'node:os';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const yup = require('yup');
const legacySource = await readFile(
  new URL('fixtures/yup-phone-v1.cjs', import.meta.url),
  'utf8',
);
const cases = [
  ['India national', '9876543210', undefined, false],
  ['US formatted', '(541) 754-3010', 'US', false],
  ['Germany local', '636-48018', 'DE', false],
  ['Brazil mobile', '+55 11 99999-5555', 'BR', false],
  ['Singapore invalid digits', '+6599555555', 'SG', false],
  ['Shared calling code loose', '+1 345 9490088', 'IN', false],
  ['Shared calling code strict', '+1 345 9490088', 'IN', true],
  ['UK region strict', '+447911123456', 'GG', true],
  ['Vanity', '1-800-FLOWERS', 'US', false],
  ['Extension', '+1 541 754 3010 ext. 123', 'US', false],
  ['Invalid length', '+9124 4723300', 'IN', false],
  ['Malformed', 'not a phone', 'IN', false],
];
runInNewContext(legacySource, {
  require,
  module: { exports: {} },
  exports: {},
});
const oldSchemas = cases.map(([, , region, strict]) =>
  yup.string().phone(region, strict),
);
require('../dist/yup-phone.cjs.js');
const newSchemas = cases.map(([, , region, strict]) =>
  yup.string().phone(region, strict),
);
const iterations = Number(process.env.BENCH_ITERATIONS ?? 1000);
const samples = Number(process.env.BENCH_SAMPLES ?? 7);
assert(iterations > 0 && Number.isInteger(iterations));
assert(samples >= 3 && Number.isInteger(samples));
/** Return the middle observation without mutating recorded samples. */
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
let checksum = 0;
/** Measure one batch of synchronous validation calls. */
function measure(schema, value) {
  const start = performance.now();
  for (let index = 0; index < iterations; index++)
    checksum += Number(schema.isValidSync(value));
  return performance.now() - start;
}
const rows = cases.map(([name, value], index) => {
  assert.equal(
    newSchemas[index].isValidSync(value),
    oldSchemas[index].isValidSync(value),
    name,
  );
  for (let warm = 0; warm < 200; warm++) {
    oldSchemas[index].isValidSync(value);
    newSchemas[index].isValidSync(value);
  }
  const oldTimes = [],
    newTimes = [];
  // Alternate order to reduce systematic warmup and scheduling bias.
  for (let sample = 0; sample < samples; sample++) {
    if (sample % 2) {
      newTimes.push(measure(newSchemas[index], value));
      oldTimes.push(measure(oldSchemas[index], value));
    } else {
      oldTimes.push(measure(oldSchemas[index], value));
      newTimes.push(measure(newSchemas[index], value));
    }
  }
  const oldMs = median(oldTimes),
    newMs = median(newTimes);
  return {
    name,
    value,
    oldMedianMs: oldMs,
    newMedianMs: newMs,
    oldOpsPerSecond: (iterations * 1000) / oldMs,
    newOpsPerSecond: (iterations * 1000) / newMs,
    speedup: oldMs / newMs,
    oldSamplesMs: oldTimes,
    newSamplesMs: newTimes,
  };
});
const sizes = {};
for (const file of [
  'yup-phone.cjs.js',
  'yup-phone.esm.mjs',
  'yup-phone.umd.js',
  'yup-phone.umd.min.js',
]) {
  const bytes = await readFile(`dist/${file}`);
  sizes[file] = { bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
}
const baseline = await readFile(
  new URL('fixtures/yup-phone-v1.umd.min.js', import.meta.url),
);
sizes['v1.3.2 UMD minified'] = {
  bytes: baseline.length,
  gzipBytes: gzipSync(baseline).length,
};
assert(
  sizes['yup-phone.umd.min.js'].gzipBytes <
    sizes['v1.3.2 UMD minified'].gzipBytes * 0.75,
  'Bundled UMD gzip size must remain at least 25% below the v1 baseline',
);
/** Measure adapter imports in fresh processes, excluding process startup. */
function coldLoad(entry) {
  const script = `const {performance}=require('node:perf_hooks'); const start=performance.now(); require(${JSON.stringify(entry)}); console.log(performance.now()-start);`;
  return Array.from({ length: 5 }, () =>
    Number(
      execFileSync(process.execPath, ['-e', script], {
        encoding: 'utf8',
      }).trim(),
    ),
  );
}
const oldCold = coldLoad('./benchmarks/fixtures/yup-phone-v1.cjs');
const newCold = coldLoad('./dist/yup-phone.cjs.js');
const result = {
  timestamp: new Date().toISOString(),
  node: process.version,
  platform: process.platform,
  cpu: os.cpus()[0]?.model,
  yup: require('yup/package.json').version,
  google: require('google-libphonenumber/package.json').version,
  libphonenumberJs: require('libphonenumber-js/package.json').version,
  iterationsPerSample: iterations,
  samples,
  checksum,
  rows,
  sizes,
  coldImport: {
    oldSamplesMs: oldCold,
    newSamplesMs: newCold,
    oldMedianMs: median(oldCold),
    newMedianMs: median(newCold),
  },
};
await mkdir('benchmarks/results', { recursive: true });
await writeFile(
  'benchmarks/results/latest.json',
  `${JSON.stringify(result, null, 2)}\n`,
);
const totalOld = rows.reduce((sum, row) => sum + row.oldMedianMs, 0);
const totalNew = rows.reduce((sum, row) => sum + row.newMedianMs, 0);
const markdown = `# Phone validation benchmark\n\n${result.node}, ${result.platform}, ${result.cpu}; Yup ${result.yup}, Google ${result.google}, libphonenumber-js/max ${result.libphonenumberJs}.\n\nThe frozen v1.3.2 adapter uses current Google metadata for a fair comparison. Both adapters share the same Yup instance. Each case runs ${samples} alternating samples of ${iterations} synchronous validations after 200 warmups. Ratios below 1 mean the new adapter is slower. Timing is informational; hardware, metadata and invalid-input exception handling affect results.\n\n| Case | Google ops/s | New ops/s | Ratio |\n| --- | ---: | ---: | ---: |\n${rows.map((row) => `| ${row.name} | ${row.oldOpsPerSecond.toFixed(0)} | ${row.newOpsPerSecond.toFixed(0)} | ${row.speedup.toFixed(2)}x |`).join('\n')}\n\nEqual-weight corpus ratio: ${(totalOld / totalNew).toFixed(2)}x. Median cold adapter import: ${median(oldCold).toFixed(2)} ms old, ${median(newCold).toFixed(2)} ms new (five fresh processes, excluding process startup).\n\n| Artifact | Bytes | Gzip bytes |\n| --- | ---: | ---: |\n${Object.entries(
  sizes,
)
  .map(([name, size]) => `| ${name} | ${size.bytes} | ${size.gzipBytes} |`)
  .join(
    '\n',
  )}\n\nCJS/ESM sizes exclude the external phone-library dependency; the UMD comparison includes bundled metadata. The v1 UMD fixture contains the original published metadata. Full samples and versions are saved in latest.json.\n`;
await writeFile('benchmarks/results/latest.md', markdown);
console.log(markdown);
