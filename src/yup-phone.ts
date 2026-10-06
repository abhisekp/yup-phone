import { addMethod, string } from 'yup';
import { type PhoneOptions, validatePhone } from './validation';

// No generic parameter list: merge with both Yup 0.32 and 1.x schemas.
declare module 'yup' {
  interface StringSchema {
    /** Validate a phone number, defaulting to India and loose region matching. */
    phone(countryCode?: string, strict?: boolean, errorMessage?: string): this;
  }
}

// Yup 1.0's broad AnySchema constraint rejects StringSchema with modern
// TypeScript. Narrow registration to the stable string-factory contract; the
// callback and its return remain checked against the installed Yup version.
const addStringMethod = addMethod as (
  factory: typeof string,
  name: string,
  method: (
    this: ReturnType<typeof string>,
    countryCode?: string,
    strict?: boolean,
    errorMessage?: string,
  ) => ReturnType<typeof string>,
) => void;

addStringMethod(
  string,
  'phone',
  /** Attach phone validation without changing the schema's inferred type. */
  function yupPhone(countryCode?: string, strict = false, errorMessage = '') {
    // Preserve the original shape check and fallback without mutating arguments.
    const hasCountry =
      typeof countryCode === 'string' && countryCode.length === 2;
    const options: PhoneOptions = {
      countryCode: hasCountry ? countryCode : 'IN',
      strict: hasCountry && strict,
    };
    const message =
      typeof errorMessage === 'string' && errorMessage
        ? errorMessage
        : hasCountry
          ? `\${path} must be a valid phone number for region ${countryCode}`
          : '${path} must be a valid phone number.'; // skipcq: JS-0038 -- Yup expands this literal at validation time.

    return this.test('phone', message, (value: unknown) =>
      validatePhone(value, options),
    );
  },
);
