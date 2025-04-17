const { Schema, model } = require("mongoose");
const { hashPassword } = require("../utils/hash");
const { USER_ROLE, USER_LOGIN_TYPE } = require("../config/string");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: () => {
                return this.loginType === USER_LOGIN_TYPE.EMAIL;
            },
        },
        loginType: {
            type: String,
            enum: [USER_LOGIN_TYPE.EMAIL, USER_LOGIN_TYPE.GOOGLE, USER_LOGIN_TYPE.APPLE],
            default: USER_LOGIN_TYPE.EMAIL,
        },
        image: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: [USER_ROLE.USER, USER_ROLE.ADMIN],
            default: USER_ROLE.USER,
        },
        fcmToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    if (this.isModified("password") && this.password) {
        this.password = hashPassword(this.password);
    }
    next();
});

const selectUser = ["-password", "-__v", "-fcmToken", "-role", "-loginType"];

const UserModel = model("users", userSchema);
module.exports = { UserModel , selectUser}; 
