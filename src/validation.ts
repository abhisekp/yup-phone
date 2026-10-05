import {
  parsePhoneNumberWithError,
  isSupportedCountry,
  getCountryCallingCode,
} from 'libphonenumber-js/max';

export interface PhoneOptions {
  countryCode: string;
  strict: boolean;
}

const KEYPAD: Record<string, string> = Object.fromEntries(
  ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'].flatMap(
    (letters, index) =>
      Array.from(letters, (letter) => [letter, String(index + 2)]),
  ),
);

function normalizeVanity(value: string): string {
  if (!/[a-z]/i.test(value)) return value;
  // Google converts alphabetic phone numbers with at least three letters.
  // Exclude text before the number and preserve extension markers.
  const start = value.search(/[+\d]/);
  if (start < 0) return value;
  const prefix = value.slice(0, start);
  const candidate = value.slice(start);
  const extension = candidate.search(
    /(?:;ext=|\s*(?:ext\.?|extension|x|#)\s*\d+\s*$)/i,
  );
  const number = extension < 0 ? candidate : candidate.slice(0, extension);
  if ((number.match(/[a-z]/gi)?.length ?? 0) < 3) return value;
  return (
    prefix +
    number.replace(/[a-z]/gi, (letter) => KEYPAD[letter.toUpperCase()]) +
    (extension < 0 ? '' : candidate.slice(extension))
  );
}

export function validatePhone(value: unknown, options: PhoneOptions): boolean {
  if (typeof value !== 'string' || value.length > 250) return false;
  if (!/[0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9]/.test(value)) return false;
  try {
    const country = isSupportedCountry(options.countryCode)
      ? options.countryCode
      : undefined;
    const phone = parsePhoneNumberWithError(normalizeVanity(value), country);
    if (!phone.isPossible()) return false;
    if (!options.strict) return phone.isValid();
    // Shared plans can legitimately validate for more than one region (for
    // example +1 toll-free numbers). Check the requested region's metadata,
    // as Google's isValidNumberForRegion does, rather than country identity.
    if (!country || phone.countryCallingCode !== getCountryCallingCode(country))
      return false;
    phone.country = country;
    return phone.isValid();
  } catch {
    return false;
  }
}
