const Joi = require("joi");
const { TRANSACTION_TYPE } = require("../config/string");

const createTransactionValidation = Joi.object({
    note: Joi.string().optional().allow("", null),
    amount: Joi.number().required().messages({
        "number.base": "Amount must be a number",
        "any.required": "Amount is required",
    }),
    type: Joi.string()
        .valid(TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.TRANSFER)
        .required()
        .messages({
            "any.only": "Type must be one of the following: income, expense, transfer",
            "any.required": "Type is required",
        }),
    category: Joi.string().required().messages({
        "string.empty": "Category is required",
        "any.required": "Category is required",
    }),
    date: Joi.date().optional().messages({
        "date.base": "Date must be a valid date",
    }),
});

const currencyValidation = Joi.object({
    currency: Joi.string().required().messages({
        "string.empty": "Currency is required",
        "any.required": "Currency is required",
    }),
    symbol: Joi.string().required().messages({
        "string.empty": "Symbol is required",
        "any.required": "Symbol is required",
    }),
});



module.exports = {
    createTransactionValidation,
    currencyValidation,
};