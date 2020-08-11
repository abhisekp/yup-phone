// eslint-disable-next-line import/no-unresolved
import * as Yup from 'yup';
// const Yup = require('yup');
import './yup-phone';
// require('..')

describe('yup-phone validation', () => {
  it('validate all types of phone numbers', () => {
    const phoneSchema = Yup.string()
      .phone()
      .required();
    expect(phoneSchema.isValidSync('9876543210')).toBe(true);
    expect(phoneSchema.isValidSync('1-541-754-3010')).toBe(false);
    expect(phoneSchema.isValidSync('19-49-89-636-48018')).toBe(false);
    expect(phoneSchema.isValidSync('754-3010')).toBe(false);
    expect(phoneSchema.isValidSync('+1-541-754-3010')).toBe(true);
    expect(phoneSchema.isValidSync('+49-89-636-48018')).toBe(true);
    expect(phoneSchema.isValidSync('+55 11 99999-5555')).toBe(true);
    expect(phoneSchema.isValidSync('+593 7 282-3889')).toBe(true);
    expect(phoneSchema.isValidSync('+44 871 222 1156')).toBe(true);
    expect(phoneSchema.isValidSync('+447911123456')).toBe(true);
    expect(phoneSchema.isValidSync('+1 345 9490088')).toBe(true);
    expect(phoneSchema.isValidSync('+1 284 852 5500')).toBe(true);
    expect(phoneSchema.isValidSync('+32 2 702-9200')).toBe(true);
    expect(phoneSchema.isValidSync('+86 21 2230 1000')).toBe(true);
    expect(phoneSchema.isValidSync('+821012345678')).toBe(true);
    expect(phoneSchema.isValidSync('+65 6511 9266')).toBe(true);
  });

  it('validate phone number with IN (India) region', () => {
    const phoneSchema = Yup.string()
      .phone('IN')
      .required();
    expect(phoneSchema.isValidSync('+19876543210')).toBe(false);
    expect(phoneSchema.isValidSync('+919876543210')).toBe(true);
    expect(phoneSchema.isValidSync('9876543210')).toBe(true);
    expect(phoneSchema.isValidSync('+9124 4723300')).toBe(false);
    expect(phoneSchema.isValidSync('+1 345 9490088')).toBe(true);
  });

  it('validate phone number strictly with IN (India) region', () => {
    const phoneSchema = Yup.string()
      .phone('IN', true)
      .required();
    expect(phoneSchema.isValidSync('+1 345 9490088')).toBe(false);
  });

  it('validate phone number loosely with IN (India) region', () => {
    const phoneSchema = Yup.string()
      .phone('IN', false)
      .required();
    expect(phoneSchema.isValidSync('+1 345 9490088')).toBe(true);
  });

  it('validate phone number with US (USA) region', () => {
    const phoneSchema = Yup.string()
      .phone('US')
      .required();
    expect(phoneSchema.isValidSync('9876543210')).toBe(false);
    // expect(phoneSchema.isValidSync('754-3010')).toBe(true); // Local
    expect(phoneSchema.isValidSync('(541) 754-3010')).toBe(true); // Domestic
    expect(phoneSchema.isValidSync('(999) 974–2042')).toBe(false);
    expect(phoneSchema.isValidSync('+1-541-754-3010')).toBe(true); // International
    expect(phoneSchema.isValidSync('1-541-754-3010')).toBe(true); // Dialed in the US
    expect(phoneSchema.isValidSync('(212) 345-4567')).toBe(true);
    // expect(phoneSchema.isValidSync('001-541-754-3010')).toBe(true); // Dialed from Germany
    // expect(phoneSchema.isValidSync('191 541 754 3010')).toBe(true); // Dialed from France
  });

  it('validate phone number with AU (Australia) region', () => {
    const phoneSchema = Yup.string()
      .phone('AU')
      .required();
    expect(phoneSchema.isValidSync('0404 999 999')).toBe(true);
    expect(phoneSchema.isValidSync('(02) 9999 9999')).toBe(true);
    expect(phoneSchema.isValidSync('(09) 9999 9999')).toBe(false);
  });

  it('validate phone number with DE (Germany) region', () => {
    const phoneSchema = Yup.string()
      .phone('DE')
      .required();
    expect(phoneSchema.isValidSync('636-48018')).toBe(true); // Local
    expect(phoneSchema.isValidSync('(089) / 636-48018')).toBe(true); // Domestic
    expect(phoneSchema.isValidSync('+49-89-636-48018')).toBe(true); // International
    // expect(phoneSchema.isValidSync('19-49-89-636-48018')).toBe(true); // Dialed from France
  });

  it('validate phone number with BR (Brazil) region', () => {
    const phoneSchema = Yup.string()
      .phone('BR')
      .required();
    expect(phoneSchema.isValidSync('+55 11 99999-5555')).toBe(true);
  });

  it('validate phone number with EC (Ecuador) region', () => {
    const phoneSchema = Yup.string()
      .phone('EC')
      .required();
    expect(phoneSchema.isValidSync('+593 7 282-3889')).toBe(true);
  });

  it('validate phone number with GB (United Kingdom) region', () => {
    const phoneSchema = Yup.string()
      .phone('GB')
      .required();
    expect(phoneSchema.isValidSync('+44 871 222 1156')).toBe(true);
  });

  it('validate phone number with GG (Guernsey) region', () => {
    const phoneSchema = Yup.string()
      .phone('GG')
      .required();
    expect(phoneSchema.isValidSync('+447911123456')).toBe(true);
  });

  it('validate phone number with KY (Cayman Islands) region', () => {
    const phoneSchema = Yup.string()
      .phone('KY')
      .required();
    expect(phoneSchema.isValidSync('+1 345 9490088')).toBe(true);
  });

  it('validate phone number with VG (British Virgin Islands) region', () => {
    const phoneSchema = Yup.string()
      .phone('VG')
      .required();
    expect(phoneSchema.isValidSync('+1 284 852 5500')).toBe(true);
  });

  it('validate phone number with BE (Belgium) region', () => {
    const phoneSchema = Yup.string()
      .phone('BE')
      .required();
    expect(phoneSchema.isValidSync('+32 2 702-9200')).toBe(true);
  });

  it('validate phone number with CH (China) region', () => {
    const phoneSchema = Yup.string()
      .phone('CH')
      .required();
    expect(phoneSchema.isValidSync('+86 21 2230 1000')).toBe(true);
  });

  it('validate phone number with KR (South Korea) region', () => {
    const phoneSchema = Yup.string()
      .phone('KR')
      .required();
    expect(phoneSchema.isValidSync('+821012345678')).toBe(true);
  });

  it('validate phone number with SG (Singapore) region', () => {
    const phoneSchema = Yup.string()
      .phone('SG')
      .required();
    expect(phoneSchema.isValidSync('+65 6511 9266')).toBe(true);
  });


  it('validate phone number strictly with IN (India) region with custom error message', () => {
    const phoneSchema = Yup.string().phone('IN', true, '${path} is invalid').required();
    expect(() => {
      phoneSchema.validateSync('+1 345 9490088');
    }).toThrow('is invalid');
  });
});
