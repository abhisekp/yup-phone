import { string, object, lazy } from 'yup';
import '../dist/yup-phone.cjs.js';

describe('legacy contracts', () => {
  it.each([undefined, '', 'IND', 'INVALID'])(
    'retains the India fallback for %s',
    (country) => {
      const schema = string().phone(country, true);
      expect(schema.isValidSync('9876543210')).toBe(true);
      expect(schema.isValidSync('+1 345 9490088')).toBe(true);
    },
  );
  it.each(['in', 'ZZ'])(
    'keeps unsupported two-character regions distinct from fallback: %s',
    (country) => {
      expect(string().phone(country).isValidSync('9876543210')).toBe(false);
      expect(string().phone(country).isValidSync('+919876543210')).toBe(true);
      expect(string().phone(country, true).isValidSync('+919876543210')).toBe(
        false,
      );
    },
  );
  it('validates digits with full metadata, not only plausible lengths', () => {
    expect(string().phone('SG').isValidSync('+6599555555')).toBe(false);
    expect(string().phone('SG').isValidSync('+6584655555')).toBe(true);
  });
  it('distinguishes regions sharing a calling code in strict mode', () => {
    expect(string().phone('US', true).isValidSync('+1 345 9490088')).toBe(
      false,
    );
    expect(string().phone('KY', true).isValidSync('+1 345 9490088')).toBe(true);
    expect(string().phone('GB', true).isValidSync('+447911123456')).toBe(false);
    expect(string().phone('GG', true).isValidSync('+447911123456')).toBe(true);
  });
  it.each(['', undefined, null, 'hello', '+', '+99912345'])(
    'retains rejection of empty or malformed input: %s',
    (value) => {
      expect(string().nullable().phone().isValidSync(value)).toBe(false);
    },
  );
  it('preserves Yup casting and strict schema behavior', () => {
    expect(string().phone().isValidSync(9876543210)).toBe(true);
    expect(string().strict().phone().isValidSync(9876543210)).toBe(false);
  });
  it('supports formatted numbers, international dial prefixes, vanity numbers and extensions', () => {
    const schema = string().phone('US');
    for (const value of [
      '(541) 754-3010',
      '+1 541 754 3010 ext. 123',
      'tel:+1-541-754-3010;ext=123',
      '1-800-FLOWERS',
    ]) {
      expect(schema.isValidSync(value)).toBe(true);
    }
    expect(string().phone('DE').isValidSync('001-541-754-3010')).toBe(true);
  });
  it('keeps errors stable across repeated sync and async validation', async () => {
    const schema = object({ phone: string().phone('INVALID', true) });
    for (let index = 0; index < 3; index++) {
      expect(() => schema.validateSync({ phone: 'bad' })).toThrow(
        'phone must be a valid phone number.',
      );
      expect(await schema.isValid({ phone: '9876543210' })).toBe(true);
    }
    expect(() =>
      object({ phone: string().phone('IN', true) }).validateSync({
        phone: '+1 345 9490088',
      }),
    ).toThrow('phone must be a valid phone number for region IN');
  });
  it('handles the current US area code and default-region issue examples', () => {
    expect(string().phone('US', true).isValidSync('9435551234')).toBe(true);
    expect(string().phone('US').isValidSync('2819129531')).toBe(true);
    expect(string().phone().isValidSync('2819129531')).toBe(false);
    expect(string().phone('DE').isValidSync('+919876543210')).toBe(true);
    expect(string().phone('DE', true).isValidSync('+919876543210')).toBe(false);
  });
  it('accepts a custom message with the default region', () => {
    expect(() =>
      string().phone(undefined, false, 'Invalid phone').validateSync('bad'),
    ).toThrow('Invalid phone');
  });
  it('supports opting into optional blanks without changing the phone contract', () => {
    const optionalPhone = lazy((value) =>
      value == null || value === ''
        ? string().nullable()
        : string().phone('US'),
    );
    for (const value of ['', null, undefined, '2819129531'])
      expect(optionalPhone.isValidSync(value)).toBe(true);
    expect(optionalPhone.isValidSync('bad')).toBe(false);
    expect(() =>
      string().required('Phone is required').phone('US').validateSync(''),
    ).toThrow('Phone is required');
  });
});
