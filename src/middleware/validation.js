const { ApiError } = require("../utils/api_error");
const { asyncHandler } = require("../utils/async_handler");

/**
 * Body validation middleware.
 *
 * @param {Joi} data - The Joi object that is used to validate the request body.
 *
 * @returns {function} - The middleware function.
 */
const bodyValidation = (data) => {
    return asyncHandler((req, _res, next) => {
        const regex = new RegExp('\"', 'g');
        const { error } = data.validate(req.body);
        if (error) {
            throw new ApiError(400, error.details[0].message.replace(regex, ''));
        }
        next();
    });
}

module.exports = {
    bodyValidation,
};