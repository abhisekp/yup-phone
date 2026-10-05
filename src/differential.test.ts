import * as yup from 'yup';
require('../dist/yup-phone.cjs.js');
const google = require('google-libphonenumber');
const util = google.PhoneNumberUtil.getInstance();

function legacy(value: string, region: string, strict: boolean): boolean {
  try {
    const phone = util.parseAndKeepRawInput(value, region);
    return (
      util.isPossibleNumber(phone) &&
      util.isValidNumberForRegion(
        phone,
        strict ? region : util.getRegionCodeForNumber(phone),
      )
    );
  } catch {
    return false;
  }
}

describe('Google reference parity', () => {
  it('matches geographic example numbers across supported regions and number types', () => {
    const mismatches: unknown[] = [];
    let checked = 0;
    for (const region of util.getSupportedRegions()) {
      for (const type of Object.values(google.PhoneNumberType)) {
        const example = util.getExampleNumberForType(region, type);
        if (!example) continue;
        for (const format of [
          google.PhoneNumberFormat.E164,
          google.PhoneNumberFormat.NATIONAL,
          google.PhoneNumberFormat.INTERNATIONAL,
        ]) {
          const value = util.format(example, format);
          for (const strict of [false, true]) {
            const expected = legacy(value, region, strict);
            const actual = yup
              .string()
              .phone(region, strict)
              .isValidSync(value);
            checked++;
            if (actual !== expected)
              mismatches.push({ value, region, strict, expected, actual });
          }
        }
      }
    }
    console.info(
      `Compared ${checked} cases across ${util.getSupportedRegions().length} regions.`,
    );
    expect(checked).toBeGreaterThan(3000);
    expect(mismatches.slice(0, 10)).toEqual([]);
  });
});
