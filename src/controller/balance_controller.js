const { asyncHandler } = require("../utils/async_handler");
const { BalanceModel, selectBalance } = require("../model/balance_model");

const createBalance = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { amount, month, year } = req.body;

    const balance = await BalanceModel.findOneAndUpdate(
        {
            createdBy: userId,
            month: month,
            year: year,
        },
        {
            $set: {
                amount: amount,
                month: month,
                year: year,
            },
        },
        {
            new: true,
            upsert: true,
        }
    ).select(selectBalance);

    return res.status(200).json({
        status: true,
        message: "Balance saved successfully",
        data: balance,
    });
});

const getBalance = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { month, year } = req.query;

    const balance = await BalanceModel.findOne({
        createdBy: userId,
        month: month,
        year: year,
    }).select(selectBalance);

    if (!balance) {
        return res.status(200).json({
            status: true,
            message: "Balance retrieved successfully",
            data: {
                amount: 0,
                month: month,
                year: year,
            }
        });
    }

    return res.status(200).json({
        status: true,
        message: "Balance retrieved successfully",
        data: balance,
    });
});

module.exports = {
    createBalance,
    getBalance,
};