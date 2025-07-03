const { Schema, model } = require("mongoose");

const settingSchema = new Schema(
    {
        privacyPolicy: {
            type: String,
            default: null,
        },
        termsAndConditions: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const SettingModel = model("settings", settingSchema);

module.exports = { SettingModel }; 
