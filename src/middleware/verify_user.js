const { UserModel } = require("../model/user_model");
const { ApiError } = require("../utils/api_error");
const { asyncHandler } = require("../utils/async_handler");
const { verifyToken } = require("../utils/generate_token");

const verifyUser = (roles) => {
    return asyncHandler(async (req, res, next) => {
        let token = req.headers.authorization;
        if (!token) {
            throw new ApiError(401, "🚫 Unauthorized Access! Invalid token detected.");
        }
        token = token.split(" ");
        if (token.length !== 2) {
            throw new ApiError(401, "🚫 Unauthorized Access! Invalid token detected.");
        }
        let data = await verifyToken(token[1]);
        if (!data || !data.id) {
            throw new ApiError(401, "🚫 Unauthorized Access! Invalid token detected.");
        }
        req.user = await UserModel.findById(data.id);
        if (!req.user) {
            throw new ApiError(401, "🚫 Unauthorized Access! Invalid token detected.");
        }
        if (roles.length && !roles.includes(req.user.role)) {
            throw new ApiError(403, "🚫 Forbidden! You don't have permission to access this resource.");
        }
        if (req.user.blocked) {
            throw new ApiError(403, "🚫 Forbidden! You don't have permission to access this resource.");
        }
        if (req.user.deleted) {
            throw new ApiError(403, "🚫 Forbidden! You don't have permission to access this resource.");
        }
        next();
    });
}

module.exports = { verifyUser }