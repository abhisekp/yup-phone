# yup-phone [![MIT License](https://img.shields.io/badge/-MIT-56A902.svg?style=flat-square&maxAge=2592000 'MIT License')](https://github.com/abhisekp/yup-phone/blob/master/LICENSE) [![npm - yup-phone](https://img.shields.io/npm/v/yup-phone)](https://www.npmjs.com/package/yup-phone 'yup-phone npm') [![Tweet yup-phone validator](https://img.shields.io/badge/share-on%20X-000000?logo=x&logoColor=white 'Tweet yup-phone validator')](https://twitter.com/intent/tweet?text=Are+you+still+validating+phone+numbers+using+regex%3F%0D%0AUse+%40npmjs+module+for+adding+phone+number+validation+%23yup+%23yupphone+%0D%0A%0D%0A%60npm+install+-S+yup+yup-phone%60+%E2%98%8E%EF%B8%8F%0D%0A%0D%0A&hashtags=javascript,Nodejs,validation,regex,npm,phone&via=abhisek&related=abhisek%3ADeveloper,npmjs&url=https://www.npmjs.com/package/yup-phone)

[![Build Status](https://github.com/abhisekp/yup-phone/actions/workflows/ci.yml/badge.svg)](https://github.com/abhisekp/yup-phone/actions/workflows/ci.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_shield)
[![Known Vulnerabilities](https://snyk.io/test/github/abhisekp/yup-phone/badge.svg?targetFile=package.json)](https://snyk.io/test/github/abhisekp/yup-phone?targetFile=package.json)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2bbf03ae96ad4a75ba09ea1418021fe5)](https://app.codacy.com/manual/abhisekp/yup-phone?utm_source=github.com&utm_medium=referral&utm_content=abhisekp/yup-phone&utm_campaign=Badge_Grade_Settings)

<!-- [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) -->
<!-- [![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone) -->
<!--
[![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone)
[![Coverage Status](https://coveralls.io/repos/github/abhisekp/yup-phone/badge.svg?branch=master)](https://coveralls.io/github/abhisekp/yup-phone?branch=master)
-->

Phone validation for **Yup 0.32.11 and 1.x**, powered by
[libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js).
Version 2 uses **max metadata** to validate digits as well as length, including
fixed lines, mobiles, and service numbers. Yup remains external: the plugin
registers on your application's Yup instance.

## Install

```sh
npm install yup yup-phone
# Existing Yup 0.32 applications:
npm install yup@0.32.11 yup-phone@2
```

## Use

```js
import * as yup from 'yup';
import 'yup-phone';

yup.string().phone().required().isValidSync('9876543210'); // true
yup.string().phone('US').isValidSync('(541) 754-3010'); // true
yup.string().phone('IN', true).isValidSync('+1 345 9490088'); // false
yup.string().phone('IN', false).isValidSync('+1 345 9490088'); // true
```

CommonJS works with the same API:

```js
const yup = require('yup');
require('yup-phone');

yup.string().phone('IN', true).isValidSync('+919876543210'); // true
```

`phone(countryCode?: string, strict?: boolean, errorMessage?: string)` returns
the same schema type, preserving required/optional/nullable/context/default
inference and chainable Yup methods. TypeScript users only need the side-effect
import; remove obsolete `@types/yup` when using Yup's built-in types.

| Argument       | Default                           | Behavior                                                                                                                           |
| -------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `countryCode`  | `IN`                              | Country used to parse national numbers. International numbers retain their own calling code.                                       |
| `strict`       | `false`                           | When true, validate against the requested region's rules and calling code. Shared service ranges can be valid in multiple regions. |
| `errorMessage` | Existing regional/general message | Accepts Yup `${path}` interpolation.                                                                                               |

```js
const schema = yup.object({
  phone: yup.string().phone('IN', true, '${path} is invalid').required(),
});
```

## Compatibility with version 1

The original test file is unchanged. Version 2 retains the default India region,
loose international validation, country-code string parameters, strict region
rules, error messages, Yup casting, formatted numbers, extensions, and vanity
numbers such as `1-800-FLOWERS`. Missing or non-two-character country arguments
fall back to India and disable strict region matching, as before. Unknown or
lowercase two-character codes do not become an India fallback.

Empty strings, undefined, and null continue to fail the phone check, even when
the schema is optional or nullable. PR #826 would change that contract and is
not included. An application can conditionally apply `phone()` when a value is
present if optional empty phone fields are required.

The new major release raises the runtime requirement from Node 9 to **Node 18+**
and targets modern browsers with ES2020 support. Development and release checks
use Node 22/24 and current TypeScript. TypeScript consumer checks use an ES2020
library and `skipLibCheck: false`. Historical CJS and UMD filenames remain; the
historical ESM `.js` filename is also shipped for bundlers. Native Node ESM uses
the `.mjs` entry through conditional exports.

Phone-number assignments change over time. Updating libphonenumber-js updates
external CJS/ESM metadata; CDN/UMD metadata changes when yup-phone is released.
The Google reference comparison catches regressions across regions and number
types but does not promise identical results for every input or freeze old
numbering plans forever.

## Common integration questions

The region is a default parsing region in loose mode. Use the second argument
when the number must belong to that region:

```js
yup.string().phone('DE').isValidSync('+919876543210'); // true
yup.string().phone('DE', true).isValidSync('+919876543210'); // false
yup.string().phone('US').isValidSync('2819129531'); // true
```

Pass a custom message as the third argument. To keep the default India region,
use `phone(undefined, false, 'Invalid phone number')`; JavaScript does not support
named arguments such as `phone(errorMessage = '...')`.

To opt into optional empty fields while retaining the phone validator's legacy
contract, apply it only when a value is present:

```js
const optionalPhone = yup.lazy((value) =>
  value == null || value === ''
    ? yup.string().nullable()
    : yup.string().phone('US'),
);

// Place required first when its message should win for an empty string.
const requiredPhone = yup.string().required('Phone is required').phone('US');
```

If `.phone` is missing at runtime, import `'yup-phone'` before constructing
schemas and use one supported Yup instance. Version 2 declares Yup as a peer,
ships augmentation declarations, and keeps registration as a side effect.
Packed-package tests exercise Node, browser bundling, and TypeScript consumers.

## Module formats

| Consumer                       | Entry                                     |
| ------------------------------ | ----------------------------------------- |
| Node `require`                 | `dist/yup-phone.cjs.js`                   |
| Node `import` / modern bundler | `dist/yup-phone.esm.mjs`                  |
| TypeScript                     | `dist/index.d.ts`                         |
| UMD / AMD / browser global     | `dist/yup-phone.umd.js` and `.umd.min.js` |
| unpkg / jsDelivr               | `dist/yup-phone.umd.min.js`               |

The UMD bundle includes phone metadata and expects an existing global `yup`, or
an AMD/CommonJS `yup` dependency. Load Yup before the plugin in a script-tag
application. Package metadata intentionally has no `browser` override, following
PR #835, so web bundlers consume the external ESM/CJS dependency rather than
silently choosing a bundled UMD snapshot. `sideEffects: true` keeps registration
from being removed by tree shaking.

## Benchmarks and verification

```sh
npm ci --ignore-scripts
npm run check
npm run test:baseline
npm run benchmark
npm audit --audit-level=low
```

The benchmark compares the frozen v1.3.2 adapter with the new adapter using the
same Yup version and current Google reference metadata. It measures synchronous
validation across valid, invalid, strict, formatted, extension, and vanity cases;
fresh-process adapter import time; and raw/gzip artifact sizes. It alternates
sample order and saves individual timings and environment/version details in
[`benchmarks/results/latest.json`](benchmarks/results/latest.json) and a
[readable report](benchmarks/results/latest.md). `BENCH_ITERATIONS` and
`BENCH_SAMPLES` control the run length. CPU timings are informational; CI enforces
at least a 25% gzip reduction for the full UMD bundle against the v1 fixture.

The migration reduces the bundled browser footprint. Some input classes and
cold CJS imports can be slower, so consult the measured report for your workload.
Google is only a development/reference dependency and is excluded from the
published package's production dependency graph.

CI runs the unchanged original tests, regression/reference checks, strict
declaration checks, and actual packed CJS/ESM/UMD/AMD/TypeScript consumers against
Yup 0.32.11, 1.0.0, and latest on Node 22/24, with Windows coverage. Weekly runs
detect dependency/metadata drift. Audits and CodeQL cover security, and grouped
Dependabot updates keep dependencies and pinned Actions current.

## Releases

See [release setup](docs/releasing.md) for the one-time npm trusted-publisher and
GitHub Actions setup. Conventional commits drive Release Please version PRs,
changelogs, `v<major>.<minor>.<patch>` tags, GitHub Releases, provenance-backed npm
publication, and downloadable package/benchmark artifacts. The initial `feat!`
migration advances the existing v1.3.2 line to **v2.0.0**, retaining both supported
Yup major lines. Generated dist files are built and tested by CI and `prepack`;
they are also checked into Git for direct repository consumers.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_large)

[MIT](LICENSE).
