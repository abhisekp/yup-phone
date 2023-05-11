import { CountryCode } from "libphonenumber-js";
declare module "yup" {
    interface StringSchema {
        /**
         * Check for phone number validity.
         *
         * @param {CountryCode} [countryCode] The country code to check against.
         * @param {Boolean} [strict=false] How strictly should it check.
         * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
         */
        phone(countryCode?: CountryCode, strict?: boolean, errorMessage?: string): StringSchema;
    }
}
