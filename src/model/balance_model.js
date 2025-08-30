const { Schema, model } = require('mongoose');

const balanceSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
},
    { timestamps: true },
);

const selectBalance = {
    __v: 0,
    createdBy: 0,
}

const BalanceModel = model('balances', balanceSchema);

module.exports = { BalanceModel, selectBalance };