const Yup = require("yup");
require("yup-phone");

// validate phone number strictly in the given region
const phoneSchema = Yup.string().phone("IN", true).required();

console.log(phoneSchema.isValidSync("+919876543210")); // → true
