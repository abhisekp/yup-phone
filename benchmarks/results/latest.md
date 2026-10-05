# Phone validation benchmark

v25.1.0, win32, Intel(R) Core(TM) i9-14900HX; Yup 1.7.1, Google 3.2.47, libphonenumber-js/max 1.13.14.

The frozen v1.3.2 adapter uses current Google metadata for a fair comparison. Both adapters share the same Yup instance. Each case runs 7 alternating samples of 1000 synchronous validations after 200 warmups. Ratios below 1 mean the new adapter is slower. Timing is informational; hardware, metadata and invalid-input exception handling affect results.

| Case | Google ops/s | New ops/s | Ratio |
| --- | ---: | ---: | ---: |
| India national | 89926 | 114160 | 1.27x |
| US formatted | 77221 | 114089 | 1.48x |
| Germany local | 105007 | 153304 | 1.46x |
| Brazil mobile | 131156 | 143530 | 1.09x |
| Singapore invalid digits | 20734 | 20841 | 1.01x |
| Shared calling code loose | 58059 | 65454 | 1.13x |
| Shared calling code strict | 17336 | 18534 | 1.07x |
| UK region strict | 64795 | 85350 | 1.32x |
| Vanity | 111801 | 64760 | 0.58x |
| Extension | 81102 | 125243 | 1.54x |
| Invalid length | 11758 | 13127 | 1.12x |
| Malformed | 9600 | 16167 | 1.68x |

Equal-weight corpus ratio: 1.21x. Median cold adapter import: 29.39 ms old, 77.45 ms new (five fresh processes, excluding process startup).

| Artifact | Bytes | Gzip bytes |
| --- | ---: | ---: |
| yup-phone.cjs.js | 2476 | 1058 |
| yup-phone.esm.mjs | 2465 | 1054 |
| yup-phone.umd.js | 301427 | 77161 |
| yup-phone.umd.min.js | 191783 | 49741 |
| v1.3.2 UMD minified | 521107 | 111596 |

CJS/ESM sizes exclude the external phone-library dependency; the UMD comparison includes bundled metadata. The v1 UMD fixture contains the original published metadata. Full samples and versions are saved in latest.json.
