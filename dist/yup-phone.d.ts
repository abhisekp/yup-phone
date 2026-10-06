declare module 'yup' {
    interface StringSchema {
        /** Validate a phone number, defaulting to India and loose region matching. */
        phone(countryCode?: string, strict?: boolean, errorMessage?: string): this;
    }
}
export {};
