const Joi = require("joi");
const { CATEGORY_TYPE } = require("../config/string");

const createCategoryValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Category name is required",
        "any.required": "Category name is required",
    }),
    type: Joi.string().valid(CATEGORY_TYPE.INCOME, CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.BOTH).required().messages({
        "any.only": "Category type must be one of 'income', 'expense', or 'both'",
        "any.required": "Category type is required",
    }),
});

module.exports = {
    createCategoryValidation,
};