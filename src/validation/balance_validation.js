const Joi = require("joi");

const createBalanceValidation = Joi.object({
    amount: Joi.number().required().messages({
        "number.base": "Amount must be a number",
        "any.required": "Amount is required",
    }),
    month: Joi.number().required().messages({
        "string.empty": "Month is required",
        "any.required": "Month is required",
    }),
    year: Joi.number().required().messages({
        "string.empty": "Year is required",
        "any.required": "Year is required",
    }),
});

module.exports = {
    createBalanceValidation,
};