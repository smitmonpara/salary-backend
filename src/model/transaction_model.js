const { Schema, model } = require("mongoose");
const { TRANSACTION_TYPE, PAYMENT_TYPE } = require("../config/string");

const transactionSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: [TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.TRANSFER],
            required: true,
        },
        note: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: [PAYMENT_TYPE.CASH, PAYMENT_TYPE.CARD, PAYMENT_TYPE.UPI, PAYMENT_TYPE.NET_BANKING],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const selectTransaction = {
    deletedAt: 0,
    deleted: 0,
    __v: 0,
};

const TransactionModel = model("transactions", transactionSchema);

module.exports = { TransactionModel, selectTransaction }; 
