import { addMethod, string } from "yup";
import {
  isValidNumberForRegion,
  CountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

declare module "yup" {
  export interface StringSchema {
    /**
     * Check for phone number validity.
     *
     * @param {CountryCode} [countryCode] The country code to check against.
     * @param {Boolean} [strict=false] How strictly should it check.
     * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
     */
    phone(
      countryCode?: CountryCode,
      strict?: boolean,
      errorMessage?: string
    ): StringSchema;
  }
}

const YUP_PHONE_METHOD = "phone";

addMethod(
  string,
  YUP_PHONE_METHOD,
  function yupPhone(
    countryCode?: CountryCode,
    strict = false,
    errorMessage = ""
  ) {
    const errMsg =
      typeof errorMessage === "string" && errorMessage
        ? errorMessage
        : countryCode
        ? "${path} must be a valid phone number for region " + countryCode
        : "${path} must be a valid phone number.";

    return this.test(YUP_PHONE_METHOD, errMsg, (value = "") => {
      try {
        const phoneNumber = parsePhoneNumberWithError(value, countryCode);

        if (!phoneNumber.isPossible()) {
          return false;
        }

        /* check if the countryCode provided should be used as
          default country code or strictly followed
        */
        if (strict && countryCode) {
          return isValidNumberForRegion(value, countryCode);
        }

        return phoneNumber.isValid();
      } catch {
        return false;
      }
    });
  }
);
