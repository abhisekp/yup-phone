"use strict";

// src/yup-phone.ts
var import_yup = require("yup");

// src/validation.ts
var import_max = require("libphonenumber-js/max");
var KEYPAD = Object.fromEntries(
  ["ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"].flatMap(
    (letters, index) => Array.from(letters, (letter) => [letter, String(index + 2)])
  )
);
function normalizeVanity(value) {
  if (!/[a-z]/i.test(value)) return value;
  const start = value.search(/[+\d]/);
  if (start < 0) return value;
  const prefix = value.slice(0, start);
  const candidate = value.slice(start);
  const extension = candidate.search(
    /(?:;ext=|\s*(?:ext\.?|extension|x|#)\s*\d+\s*$)/i
  );
  const number = extension < 0 ? candidate : candidate.slice(0, extension);
  if ((number.match(/[a-z]/gi)?.length ?? 0) < 3) return value;
  return prefix + number.replace(/[a-z]/gi, (letter) => KEYPAD[letter.toUpperCase()]) + (extension < 0 ? "" : candidate.slice(extension));
}
function validatePhone(value, options) {
  if (typeof value !== "string" || value.length > 250) return false;
  if (!/[0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9]/u.test(value))
    return false;
  try {
    const country = (0, import_max.isSupportedCountry)(options.countryCode) ? options.countryCode : void 0;
    const phone = (0, import_max.parsePhoneNumberWithError)(normalizeVanity(value), country);
    if (!phone.isPossible()) return false;
    if (!options.strict) return phone.isValid();
    if (!country || phone.countryCallingCode !== (0, import_max.getCountryCallingCode)(country))
      return false;
    phone.country = country;
    return phone.isValid();
  } catch {
    return false;
  }
}

// src/yup-phone.ts
var addStringMethod = import_yup.addMethod;
addStringMethod(
  import_yup.string,
  "phone",
  /** Attach phone validation without changing the schema's inferred type. */
  function yupPhone(countryCode, strict = false, errorMessage = "") {
    const hasCountry = typeof countryCode === "string" && countryCode.length === 2;
    const options = {
      countryCode: hasCountry ? countryCode : "IN",
      strict: hasCountry && strict
    };
    const message = typeof errorMessage === "string" && errorMessage ? errorMessage : hasCountry ? `\${path} must be a valid phone number for region ${countryCode}` : "${path} must be a valid phone number.";
    return this.test(
      "phone",
      message,
      (value) => validatePhone(value, options)
    );
  }
);
//# sourceMappingURL=yup-phone.cjs.js.map
