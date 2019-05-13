# yup-phone

[![Build Status](https://travis-ci.org/abhisekp/yup-phone.svg?branch=master)](https://travis-ci.org/abhisekp/yup-phone)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/abhisekp/yup-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/abhisekp/yup-phone)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_shield)


Adds a phone number validation check to yup validator using [**google-libphonenumber**](https://www.npmjs.com/package/google-libphonenumber) which gives accurate validation checks.  
Read more here [*libphonenumber*](https://github.com/googlei18n/libphonenumber/blob/master/README.md#readme)

## Install

```sh
# npm install --save yup-phone
$ yarn add yup-phone
```

## Usage

```js
const Yup = require('yup');
require('yup-phone');

// validate any phone number (defaults to India for country)
const phoneSchema = Yup.string().phone().required();
phoneSchema.isValid('9876543210'); // → true
```

```js
const Yup = require('yup');
require('yup-phone');

// validate phone number loosely in the given region
const phoneSchema = Yup.string().phone('IN').required();
phoneSchema.isValid('+919876543210'); // → true
```

```js
const Yup = require('yup');
require('yup-phone');

// validate phone number strictly in the given region
const phoneSchema = Yup.string().phone('IN', true).required();
phoneSchema.isValid('+919876543210'); // → true
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
```

## License

[MIT](LICENSE).


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fabhisekp%2Fyup-phone?ref=badge_large)