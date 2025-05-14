const { Schema, model } = require('mongoose');

const currencySchema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
    },
    currency: {
        type: String,
        required: true,
        unique: true,
    },
},
    { timestamps: true },
);

const CurrencyModel = model('currencies', currencySchema);

module.exports = { CurrencyModel };