# yup-phone [![MIT License](https://img.shields.io/badge/-MIT-56A902.svg?style=flat-square&maxAge=2592000 "MIT License")](LICENSE)

[![Build Status](https://travis-ci.org/abhisekp/yup-phone.svg?branch=master)](https://travis-ci.org/abhisekp/yup-phone)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_shield)
[![Known Vulnerabilities](https://snyk.io/test/github/abhisekp/yup-phone/badge.svg?targetFile=package.json)](https://snyk.io/test/github/abhisekp/yup-phone?targetFile=package.json)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2bbf03ae96ad4a75ba09ea1418021fe5)](https://app.codacy.com/manual/abhisekp/yup-phone?utm_source=github.com&utm_medium=referral&utm_content=abhisekp/yup-phone&utm_campaign=Badge_Grade_Settings)
<!--
[![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone)
[![Coverage Status](https://coveralls.io/repos/github/abhisekp/yup-phone/badge.svg?branch=master)](https://coveralls.io/github/abhisekp/yup-phone?branch=master)
-->

Adds a phone number validation check to yup validator using [**google-libphonenumber**](https://www.npmjs.com/package/google-libphonenumber) which gives accurate validation checks.  
Read more here [*libphonenumber*](https://github.com/googlei18n/libphonenumber/blob/master/README.md#readme).

## Install

```sh
# npm install --save yup-phone
$ yarn add yup-phone
```

## Usage

```js
const phoneSchema = Yup.string().phone().required();
import * as Yup from "yup";
import "yup-phone";

// validate any phone number (defaults to India for country)
const phoneSchema = Yup.string()
  .phone()
  .required();

(async () => {
  console.log(await phoneSchema.isValid("9876543210")); // → true
})();

```

```js
import * as Yup from "yup";
import "yup-phone";

// validate phone number loosely in the given region
const phoneSchema = Yup.string()
  .phone("IN")
  .required();

(async () => {
  console.log(await phoneSchema.isValid('+919876543210')); // → true
})();
```

```js
import * as Yup from "yup";
import "yup-phone";

// validate phone number strictly in the given region
const phoneSchema = Yup.string()
  .phone("IN", true)
  .required();

(async () => {
  console.log(await phoneSchema.isValid("+919876543210")); // → true
})();
```

For more, check [yup-phone.test.ts](src/yup-phone.test.ts) file.

### Contributing
- Uses Rollup for bundling.
- Uses yarn for package management.
- Files are minified using closure compiler.
- Uses jest for testing.
- Generates CJS, UMD, and ESM builds.
- Use `yarn version --major|--minor|--patch` to version.
- Use tslint and prettier for code formatting.
- Uses semantic release for version.
- Use `yarn commit` to create a standard commit interactively.

```sh
$ yarn build # Build for production
$ yarn test # Run tests
$ yarn publish # Publish npm package (prompts for version)
```

## License

[MIT](LICENSE).


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_large)
