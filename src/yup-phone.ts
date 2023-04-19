import * as Yup from "yup";
import gPhoneNumber from "google-libphonenumber";

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

const YUP_PHONE_METHOD = "phone";
const CLDR_REGION_CODE_SIZE = 2;

declare module "yup" {
  export interface StringSchema {
    /**
     * Check for phone number validity.
     *
     * @param {String} [countryCode=IN] The country code to check against.
     * @param {Boolean} [strict=false] How strictly should it check.
     * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
     */
    phone(
      countryCode?: string,
      strict?: boolean,
      errorMessage?: string
    ): StringSchema;
  }
}

const isValidCountryCode = (countryCode: any): boolean =>
  typeof countryCode === "string" &&
  countryCode.length === CLDR_REGION_CODE_SIZE;

Yup.addMethod(
  Yup.string,
  YUP_PHONE_METHOD,
  function yupPhone(
    countryCode?: string,
    strict: boolean = false,
    errorMessage: string = ""
  ) {
    const errMsg =
      typeof errorMessage === "string" && errorMessage
        ? errorMessage
        : isValidCountryCode(countryCode)
        ? `\${path} must be a valid phone number for region ${countryCode}`
        : "${path} must be a valid phone number.";
    // @ts-ignore
    return this.test(YUP_PHONE_METHOD, errMsg, (value: string) => {
      if (!isValidCountryCode(countryCode)) {
        // if not valid countryCode, then set default country to India (IN)
        countryCode = "IN";
        strict = false;
      }

      try {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);

        if (!phoneUtil.isPossibleNumber(phoneNumber)) {
          return false;
        }

        const regionCodeFromPhoneNumber =
          phoneUtil.getRegionCodeForNumber(phoneNumber);

        /* check if the countryCode provided should be used as
       default country code or strictly followed
     */
        return strict
          ? phoneUtil.isValidNumberForRegion(phoneNumber, countryCode)
          : phoneUtil.isValidNumberForRegion(
              phoneNumber,
              regionCodeFromPhoneNumber
            );
      } catch {
        return false;
      }
    });
  }
);
