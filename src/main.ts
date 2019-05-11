import * as Yup from 'yup';
import * as gPhoneNumber from 'google-libphonenumber';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

declare module 'yup' {
  export interface StringSchema {
    phone(countryCode?: string): StringSchema;
  }
}

const METHOD_NAME = 'phone';

Yup.addMethod(Yup.string, METHOD_NAME, function yupPhone(countryCode?: string) {
  const errMsg = countryCode
    ? `\${path} must be a valid phone number for region ${countryCode}`
    : '${path} must be a valid phone number.';
  return this.test(METHOD_NAME, errMsg, (value: gPhoneNumber.PhoneNumber) =>
    countryCode
      ? phoneUtil.isValidNumberForRegion(value, countryCode)
      : phoneUtil.isValidNumber(value),
  );
});
