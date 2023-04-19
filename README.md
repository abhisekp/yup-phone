# yup-phone [![MIT License](https://img.shields.io/badge/-MIT-56A902.svg?style=flat-square&maxAge=2592000 "MIT License")](LICENSE) [![npm - yup-phone](https://img.shields.io/npm/v/yup-phone)](https://www.npmjs.com/package/yup-phone "yup-phone npm") [![Tweet yup-phone validator](http://i.imgur.com/1Y9LBHw.png "Tweet yup-phone validator")](https://twitter.com/intent/tweet?text=Are+you+still+validating+phone+numbers+using+regex%3F%0D%0AUse+%40npmjs+module+for+adding+phone+number+validation+%23yup+%23yupphone+%0D%0A%0D%0A%60npm+install+-S+yup+yup-phone%60+%E2%98%8E%EF%B8%8F%0D%0A%0D%0A&hashtags=javascript,Nodejs,validation,regex,npm,phone&via=abhisek&related=abhisek%3ADeveloper,npmjs&url=https://www.npmjs.com/package/yup-phone) <a href="https://www.buymeacoffee.com/abhisekp" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" alt="abhisekp" align="right" ></a>

[![Build Status](https://travis-ci.org/abhisekp/yup-phone.svg?branch=master)](https://travis-ci.org/abhisekp/yup-phone)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_shield)
[![Known Vulnerabilities](https://snyk.io/test/github/abhisekp/yup-phone/badge.svg?targetFile=package.json)](https://snyk.io/test/github/abhisekp/yup-phone?targetFile=package.json)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2bbf03ae96ad4a75ba09ea1418021fe5)](https://app.codacy.com/manual/abhisekp/yup-phone?utm_source=github.com&utm_medium=referral&utm_content=abhisekp/yup-phone&utm_campaign=Badge_Grade_Settings)

<!-- [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) -->
<!-- [![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone) -->
<!--
[![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone)
[![Coverage Status](https://coveralls.io/repos/github/abhisekp/yup-phone/badge.svg?branch=master)](https://coveralls.io/github/abhisekp/yup-phone?branch=master)
-->

> Adds a phone number validation check to yup validator using [**google-libphonenumber**](https://www.npmjs.com/package/google-libphonenumber) which gives accurate validation checks.  
> _Read more about the **core library** here_ [_libphonenumber_](https://github.com/googlei18n/libphonenumber/blob/master/README.md#readme).  
> _Read more about **yup** validator here_ [_yup_](https://www.npmjs.com/package/yup)

## Install

```sh
# npm install --save yup-phone
$ npm add yup-phone
```

## Test

Check validation in [Codesandbox](https://codesandbox.io/s/yup-phone-validation-u4p8n?file=/src/App.js)

## Examples

```js
// See https://repl.it/repls/WiryCleverPatches
import * as yup from "yup";
// const yup = require("yup");
import "yup-phone";
// require("yup-phone");

// validate any phone number (defaults to India for country)
const phoneSchema = yup.string().phone().required();

(async () => {
  console.log(await phoneSchema.isValid("9876543210")); // → true
})();
```

<div align="right">
  <a href="https://repl.it/repls/WiryCleverPatches"><img src="https://repl.it/badge/github/abhisekp/yup-phone" /></a>
</div>

---

```js
// See https://repl.it/repls/SwiftImpossibleCertification
import * as yup from "yup";
// const yup = require("yup");
import "yup-phone";
// require("yup-phone");

// validate phone number loosely in the given region
const phoneSchema = yup.string().phone("IN").required();

(async () => {
  console.log(await phoneSchema.isValid("+919876543210")); // → true
})();
```

<div align="right">
  <a href="https://repl.it/repls/SwiftImpossibleCertification"><img src="https://repl.it/badge/github/abhisekp/yup-phone" /></a>
</div>

---

```js
// See https://repl.it/repls/PartialAlicebluePrediction
import * as yup from "yup";
// const yup = require("yup");
import "yup-phone";
// require("yup-phone");

// validate phone number strictly in the given region
const phoneSchema = yup.string().phone("IN", true).required();

console.log(phoneSchema.isValidSync("+919876543210")); // → true
```

<div align="right">
  <a href="https://repl.it/repls/PartialAlicebluePrediction"><img src="https://repl.it/badge/github/abhisekp/yup-phone" /></a>
</div>

---

```js
// See https://repl.it/repls/UniqueForsakenDownloads
import * as yup from "yup";
// const yup = require("yup");
import "yup-phone";
// require("yup-phone");

// validate phone number strictly in the given region with custom error message
const phoneSchema = yup
  .string()
  .phone("IN", true, "${path} is invalid")
  .required();

try {
  phoneSchema.validateSync("+1 345 9490088");
} catch (error) {
  console.log(error.message); // → this is invalid
}
```

<div align="right">
  <a href="https://repl.it/repls/UniqueForsakenDownloads"><img src="https://repl.it/badge/github/abhisekp/yup-phone" /></a>
</div>

---

For more examples, check [yup-phone.test.ts](test/yup-phone.test.ts) file.

### Module Sizes

```
Destination: dist/yup-phone.umd.js
Bundle Size:  544.08 KB
Minified Size:  537.41 KB
Gzipped Size:  107.04 KB
```

```
Destination: dist/yup-phone.umd.min.js
Bundle Size:  508.65 KB
Minified Size:  506.46 KB
Gzipped Size:  105.73 KB
```

```
Destination: dist/yup-phone.esm.js
Bundle Size:  648 B
Minified Size:  646 B
Gzipped Size:  370 B
```

```
Destination: dist/yup-phone.cjs.js
Bundle Size:  1.35 KB
Minified Size:  1.34 KB
Gzipped Size:  662 B
```

### Contributing

- Uses Rollup for bundling.
- Uses npm for package management.
- Files are minified using closure compiler.
- Uses jest for testing.
- Generates CJS, UMD, and ESM builds.
- Use `npm version [major|minor|patch]` to version.
- Use tslint and prettier for code formatting.
- Uses semantic release for version.
- Use `npx cz` to create a standard commit interactively.

```sh
$ npm run build # Build for production
$ npm test # Run tests
$ npm publish # Publish npm package (prompts for version)
```

## License

[MIT](LICENSE).

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_large)
