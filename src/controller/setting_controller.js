const { SettingModel } = require("../model/setting_model");
const { asyncHandler } = require("../utils/async_handler");
const { SuccessResponse } = require("../utils/response");

const getPrivacyPolicy = asyncHandler(async (_, res) => {
    const setting = await SettingModel.findOne().select("privacyPolicy");

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Privacy policy fetched successfully",
        data: setting?.privacyPolicy || null
    }));
});


const getTermsAndConditions = asyncHandler(async (_, res) => {
    const setting = await SettingModel.findOne().select("termsAndConditions");

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Terms and Conditions fetched successfully",
        data: setting?.termsAndConditions || null
    }));
});


module.exports = {
    getPrivacyPolicy,
    getTermsAndConditions
}
