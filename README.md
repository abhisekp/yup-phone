# yup-phone

Adds a phone number validation check to yup validator using [**google-libphonenumber**](https://www.npmjs.com/package/google-libphonenumber).

### Usage

```js
// validate phone number
const phoneSchema = Yup.string().phone().required();
phoneSchema.isValid('9876543210'); // → true
```

```js
// validate phone number with default region
const phoneSchema = Yup.string().phone('IN').required();
phoneSchema.isValid('+919876543210')
```

### Contributing
- Uses Rollup for bundling
- Uses yarn for package management
- Files are minified using closure compiler
- Uses jest for testing
- Generates CJS, UMD, and ESM builds
- Use `yarn version --major|--minor|--patch` to version
- Use tslint and prettier for code formatting

```sh
$ yarn build # Build for production
$ yarn test # Build for test and run test
```

## License

[MIT](LICENSE).
