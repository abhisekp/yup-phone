# Phone validation benchmark

v25.1.0, win32, Intel(R) Core(TM) i9-14900HX; Yup 1.7.1, Google 3.2.47, libphonenumber-js/max 1.13.14.

The frozen v1.3.2 adapter uses current Google metadata for a fair comparison. Both adapters share the same Yup instance. Each case runs 7 alternating samples of 1000 synchronous validations after 200 warmups. Ratios below 1 mean the new adapter is slower. Timing is informational; hardware, metadata and invalid-input exception handling affect results.

| Case | Google ops/s | New ops/s | Ratio |
| --- | ---: | ---: | ---: |
| India national | 93544 | 117081 | 1.25x |
| US formatted | 87011 | 130779 | 1.50x |
| Germany local | 113661 | 149223 | 1.31x |
| Brazil mobile | 147215 | 170710 | 1.16x |
| Singapore invalid digits | 24051 | 23630 | 0.98x |
| Shared calling code loose | 59965 | 63677 | 1.06x |
| Shared calling code strict | 19823 | 19880 | 1.00x |
| UK region strict | 60306 | 81292 | 1.35x |
| Vanity | 117034 | 61737 | 0.53x |
| Extension | 88405 | 130808 | 1.48x |
| Invalid length | 24384 | 24525 | 1.01x |
| Malformed | 19102 | 28986 | 1.52x |

Equal-weight corpus ratio: 1.11x. Median cold adapter import: 25.73 ms old, 65.91 ms new (five fresh processes, excluding process startup).

| Artifact | Bytes | Gzip bytes |
| --- | ---: | ---: |
| yup-phone.cjs.js | 2475 | 1058 |
| yup-phone.esm.mjs | 2464 | 1054 |
| yup-phone.umd.js | 301426 | 77161 |
| yup-phone.umd.min.js | 191783 | 49741 |
| v1.3.2 UMD minified | 521107 | 111596 |

CJS/ESM sizes exclude the external phone-library dependency; the UMD comparison includes bundled metadata. The v1 UMD fixture contains the original published metadata. Full samples and versions are saved in latest.json.
