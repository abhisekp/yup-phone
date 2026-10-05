# Open PR review

Snapshot: 5 October 2026. Reviewed 27 open PRs through the GitHub connector,
including head revisions and available file patches. This is a recommendation
and incorporation report; it does not merge or close contributors' PRs.

## Behavior and packaging PRs

**#823 — replace Google with libphonenumber-js**

Head: `465a9389fae754d2cfaff011ae0cb271b381e53a`.

- **P1: default-region regression.** Removing the India fallback makes
  `.phone().isValidSync('9876543210')` false. The PR changes the existing test's
  expected result rather than preserving it. Retain the original fallback and
  run the original suite unchanged.
- **P1: insufficient validation metadata.** The default library entry selects
  minimal metadata. It does not retain Google's complete number-type digit
  rules. Use `/max`; for example `+6599555555` must remain invalid for Singapore.
- **P2: country-code API narrowing.** Replacing the string parameter with
  `CountryCode` rejects existing callers whose country comes from a string
  variable, and changes the handling of unsupported codes. Keep the public
  string contract and validate the effective region internally.
- Strict validation must apply the requested region's rules, including shared
  service ranges. A simple parsed-country equality check rejects previously
  valid regional toll-free numbers. The migration's reference comparison
  verifies this across Google example numbers.
- Google accepts vanity numbers, extensions, and international numbers with
  an unknown default region. The migration adds adapters and regression checks
  for these parsing differences.

The v2 migration incorporates the library replacement and credits the PR, while
correcting these compatibility problems. Review against
[PR #823](https://github.com/abhisekp/yup-phone/pull/823).

**#826 — accept empty optional values**

Head: `4b351f135186821611e64e0758ac01571f1c2797`.

The early return accepts empty strings, undefined, and null, regardless of the
old phone test's result. Required Yup schemas still reject these values, but
optional and nullable schemas change behavior. That is an intentional API change,
not a compatibility-preserving fix. Defer it or expose an explicit opt-in in a
separate change; v2 retains the old result and tests it. See
[PR #826](https://github.com/abhisekp/yup-phone/pull/826).

**#835 — remove the browser override**

Head: `d716a3aa0d97532c1c465bc998e7b21e456ef3da`.

The direction is sound: use CDN-specific UMD fields and let browser bundlers use
external ESM/CJS dependencies. The v2 migration incorporates this approach and
adds conditional exports, declarations, side-effect metadata, valid native ESM
filenames, and packed-consumer execution for CJS, ESM, global UMD, and AMD. See
[PR #835](https://github.com/abhisekp/yup-phone/pull/835).

## Dependency and security PRs

These upgrades address obsolete snapshots, but merging the independent old
lockfile edits together would produce an unverified dependency graph. The v2
migration regenerates one lockfile, updates retained tools to current releases,
and removes tools no longer needed. Package-only Snyk patches do not update the
lockfile, so they are not complete security remediations on their own.

| PR | Subject | Recommendation / v2 treatment |
| --- | --- | --- |
| [#833](https://github.com/abhisekp/yup-phone/pull/833) | filesize 10 security update | Superseded by removal; built-in byte/gzip measurements replace it. |
| [#832](https://github.com/abhisekp/yup-phone/pull/832) | commitlint 16 security update | Superseded by removal of obsolete commit tooling; conventional commits drive releases. |
| [#831](https://github.com/abhisekp/yup-phone/pull/831) | filesize 10 security update | Duplicate upgrade target; superseded by removal. |
| [#830](https://github.com/abhisekp/yup-phone/pull/830) | filesize 10 security update | Duplicate upgrade target; superseded by removal. |
| [#829](https://github.com/abhisekp/yup-phone/pull/829) | filesize + semantic-release security fixes | Superseded by removal and Release Please. |
| [#828](https://github.com/abhisekp/yup-phone/pull/828) | Jest 30 security update | Incorporated using current Jest 30, matching types, and the esbuild transform. |
| [#827](https://github.com/abhisekp/yup-phone/pull/827) | Eight security fixes | Superseded by current commonjs/Jest and removal of old tooling; regenerated lockfile audited. |
| [#820](https://github.com/abhisekp/yup-phone/pull/820) | commitlint 17 | Superseded by removal. |
| [#819](https://github.com/abhisekp/yup-phone/pull/819) | rollup-plugin-ts 3 | Superseded by esbuild and native TypeScript declarations. |
| [#818](https://github.com/abhisekp/yup-phone/pull/818) | semantic-release 20 | Superseded by Release Please in GitHub Actions. |
| [#815](https://github.com/abhisekp/yup-phone/pull/815) | json5 security patch | Old vulnerable transitive graph removed; regenerated lockfile audited. |
| [#813](https://github.com/abhisekp/yup-phone/pull/813) | core-js 3 | Babel config still selected core-js 2; superseded by removal of Babel/polyfill tooling. |
| [#811](https://github.com/abhisekp/yup-phone/pull/811) | qs security patch | Old filesize/release dependency chain removed. |
| [#810](https://github.com/abhisekp/yup-phone/pull/810) | TypeScript 4.9 | Superseded by current TypeScript 7; types tested with full library checking. |
| [#805](https://github.com/abhisekp/yup-phone/pull/805) | minimatch security patch | Old graph regenerated; current dependency tree audited. |
| [#804](https://github.com/abhisekp/yup-phone/pull/804) | ESLint types 8 | Unused standalone types removed. |
| [#803](https://github.com/abhisekp/yup-phone/pull/803) | Babel preset-env 7.20 | Reviewed the full lockfile diff separately; Babel pipeline removed. |
| [#798](https://github.com/abhisekp/yup-phone/pull/798) | Babel runtime transform | Superseded by removal of Babel. |
| [#790](https://github.com/abhisekp/yup-phone/pull/790) | Rollup 2.79 | Superseded by current Rollup 4 and current plugins. |
| [#766](https://github.com/abhisekp/yup-phone/pull/766) | Terser 5.14 security patch | Incorporated via current Rollup Terser plugin and resolved Terser. |
| [#742](https://github.com/abhisekp/yup-phone/pull/742) | semver-regex security patch | Old release dependency chain removed. |
| [#738](https://github.com/abhisekp/yup-phone/pull/738) | Jest/types 28 | Superseded by current matching Jest/types 30. |
| [#720](https://github.com/abhisekp/yup-phone/pull/720) | node-fetch security patch | Old release dependency chain removed. |
| [#647](https://github.com/abhisekp/yup-phone/pull/647) | @wessberg plugin-ts 2 | Deprecated duplicate plugin removed. |

## Validation evidence

The initial npm audit found 102 vulnerabilities: 10 critical, 48 high, 19 moderate,
and 25 low, in a 1,577-dependency graph. The regenerated lockfile audit reports
zero known vulnerabilities at the time of this review. This is npm advisory
coverage, not a guarantee against unknown vulnerabilities. CI repeats audits
and CodeQL on an ongoing basis.

The original 18 tests remain unchanged. Additional tests cover retained API
contracts and compare Google example numbers across geographic regions, number
types, formats, and loose/strict validation. Published-package consumers run
against Yup 0.32.11, 1.0.0, and latest, including TypeScript with
`skipLibCheck: false`. Benchmarks record both improvements and slower cases;
the full browser bundle, rather than an external-only stub, is used for size
comparisons.
