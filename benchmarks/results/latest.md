# Phone validation benchmark

v25.1.0, win32, Intel(R) Core(TM) i9-14900HX; Yup 1.7.1, Google 3.2.47, libphonenumber-js/max 1.13.14.

The frozen v1.3.2 adapter uses current Google metadata for a fair comparison. Both adapters share the same Yup instance. Each case runs 7 alternating samples of 1000 synchronous validations after 200 warmups. Ratios below 1 mean the new adapter is slower. Timing is informational; hardware, metadata and invalid-input exception handling affect results.

| Case | Google ops/s | New ops/s | Ratio |
| --- | ---: | ---: | ---: |
| India national | 62589 | 81722 | 1.31x |
| US formatted | 57042 | 80961 | 1.42x |
| Germany local | 81668 | 97357 | 1.19x |
| Brazil mobile | 96116 | 109674 | 1.14x |
| Singapore invalid digits | 13126 | 13175 | 1.00x |
| Shared calling code loose | 31927 | 39155 | 1.23x |
| Shared calling code strict | 13305 | 12365 | 0.93x |
| UK region strict | 40738 | 50252 | 1.23x |
| Vanity | 87249 | 46168 | 0.53x |
| Extension | 64962 | 92787 | 1.43x |
| Invalid length | 15996 | 17451 | 1.09x |
| Malformed | 13155 | 19048 | 1.45x |

Equal-weight corpus ratio: 1.10x. Median cold adapter import: 43.80 ms old, 102.85 ms new (five fresh processes, excluding process startup).

| Artifact | Bytes | Gzip bytes |
| --- | ---: | ---: |
| yup-phone.cjs.js | 3135 | 1290 |
| yup-phone.esm.mjs | 2380 | 998 |
| yup-phone.umd.js | 301340 | 77110 |
| yup-phone.umd.min.js | 191779 | 49735 |
| v1.3.2 UMD minified | 521107 | 111596 |

CJS/ESM sizes exclude the external phone-library dependency; the UMD comparison includes bundled metadata. The v1 UMD fixture contains the original published metadata. Full samples and versions are saved in latest.json.
