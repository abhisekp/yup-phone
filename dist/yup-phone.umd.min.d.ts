declare module 'yup' {
    interface StringSchema {
        phone(countryCode?: string, strict?: boolean): StringSchema;
    }
}
