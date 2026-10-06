import { string, object, type InferType } from 'yup';
import '../../dist/index';

const required = string().required().phone('IN');
const optional = string().optional().phone();
const nullable = string().nullable().phone();
const defaults = string().default('9876543210').phone();
const country = String('IN');
const chained = string()
  .phone(country, false, 'invalid phone')
  .trim()
  .required();
const schema = object({ phone: chained });
const valid: InferType<typeof schema> = { phone: '9876543210' };
// @ts-expect-error phone() must retain required string inference
const invalid: InferType<typeof required> = undefined;
// @ts-expect-error phone() must retain string inference
const invalidNumber: InferType<typeof required> = 123;
// @ts-expect-error phone() must retain optional string inference
const invalidOptional: InferType<typeof optional> = 123;
const absent: InferType<typeof optional> = undefined;
const nullValue: InferType<typeof nullable> = null;
const defaultValue: InferType<typeof defaults> = '9876543210';
export const checkedValues = [
  required,
  optional,
  nullable,
  defaults,
  schema,
  valid,
  invalid,
  invalidNumber,
  invalidOptional,
  absent,
  nullValue,
  defaultValue,
];
