// eslint-disable-next-line import/no-unresolved
import * as Yup from 'yup';
import '..';


describe('yup-phone validation', () => {
  it('validate phone number', () => {
    const phoneSchema = Yup.string()
      .phone()
      .required();
    expect(phoneSchema.isValid('9876543210')).toBeTruthy();
  });

  it('validate phone number with default region', () => {
    const phoneSchema = Yup.string()
      .phone('IN')
      .required();
    expect(phoneSchema.isValid('+19876543210')).toBeTruthy();
  });
});
