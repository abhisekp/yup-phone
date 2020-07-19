const Yup = require("yup");
require("yup-phone");

// validate phone number strictly in the given region
const phoneSchema = Yup.string()
    .phone("IN", true)
    .required();

await phoneSchema.isValid("+919876543210"); // → true
