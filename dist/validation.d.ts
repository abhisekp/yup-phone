export interface PhoneOptions {
    countryCode: string;
    strict: boolean;
}
/**
 * Validate a parsed number against complete metadata and the legacy region rules.
 * @param value The value after Yup's normal string casting.
 * @param options Effective default region and strict region validation flag.
 * @returns Whether the number satisfies the original phone validator's contract.
 */
export declare function validatePhone(value: unknown, options: PhoneOptions): boolean;
