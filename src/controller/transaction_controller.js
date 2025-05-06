const { asyncHandler } = require("../utils/async_handler");
const { TransactionModel, selectTransaction } = require("../model/transaction_model");
const { SuccessResponse } = require("../utils/response");
const { selectCategory } = require("../model/category_model");
const { ApiError } = require("../utils/api_error");
const { TRANSACTION_TYPE } = require("../config/string");
const { BalanceModel } = require("../model/balance_model");
const { UserModel } = require("../model/user_model");

const addTransaction = asyncHandler(async (req, res) => {
    const { amount, type, note, category, date } = req.body;
    const userId = req.user._id;

    if (!amount || !type || !category) {
        return res.status(400).json({ message: "Amount, type, and category are required." });
    }

    const transactionData = {
        amount,
        type,
        note,
        category,
        date: date ? new Date(date) : new Date(),
        createdBy: userId,
    };

    let transaction = await TransactionModel.create(transactionData);
    transaction = await TransactionModel.findById(transaction._id).populate({
        path: "category",
        select: selectCategory,
    }).select(selectTransaction);

    if (!transaction) {
        throw new ApiError(400, "Transaction not created");
    }

    return res.status(201).json(new SuccessResponse({
        statusCode: 201,
        message: "Transaction created successfully",
        data: transaction,
    }));
});

const getTransaction = asyncHandler(async (req, res) => {
    const currentDate = new Date()
    const userId = req.user._id;

    const month = req.query.month || currentDate.getMonth() + 1;
    const year = req.query.year || currentDate.getFullYear();

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 0, 0, 0));

    const result = await TransactionModel.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate },
                createdBy: userId,
                deleted: false,
            }
        },
        {
            $facet: {
                data: [
                    { $sort: { date: 1 } },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category",
                            foreignField: "_id",
                            as: "category",
                            pipeline: [
                                {
                                    $project: selectCategory
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: "$category",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            deleted: 0,
                            deletedAt: 0,
                            __v: 0,
                        }
                    }
                ],
                incomeData: [
                    { $match: { type: TRANSACTION_TYPE.INCOME } },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                    { $project: { _id: 0, total: 1 } }
                ],
                expenseData: [
                    { $match: { type: TRANSACTION_TYPE.EXPENSE } },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                    { $project: { _id: 0, total: 1 } }
                ]
            }
        },
        {
            $project: {
                data: 1,
                income: { $ifNull: [{ $arrayElemAt: ["$incomeData.total", 0] }, 0] },
                expense: { $ifNull: [{ $arrayElemAt: ["$expenseData.total", 0] }, 0] }
            }
        }
    ]).exec();

    if (!result || result.length === 0) {
        throw new ApiError(400, "No transactions found for the specified month and year.");
    }

    const balance = await BalanceModel.findOne({
        createdBy: userId,
        month: month,
        year: year,
    });

    const amount = balance ? balance.amount : 0;

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Transaction fetched successfully",
        data: {
            transactions: result[0].data,
            income: result[0].income,
            expense: result[0].expense,
            total: result[0].income - result[0].expense,
            balance: amount,
            avaliableBalance: amount + result[0].income - result[0].expense,
            overExpense: amount + result[0].income - result[0].expense < 0 ? Math.abs(amount + result[0].income - result[0].expense) : 0,
            currency: req.user.currency,
            symbol: req.user.symbol,
        }
    }));
});

const updateTransaction = asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user._id;

    const { amount, type, note, category, date } = req.body;

    const transactionData = {};
    if (amount !== undefined) {
        if (typeof amount !== "number" || isNaN(amount)) {
            throw new ApiError(400, "Amount must be a number.");
        }
        transactionData.amount = amount;
    }
    if (type !== undefined) {
        if (typeof type !== "string" || ![TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.TRANSFER].includes(type)) {
            throw new ApiError(400, "Invalid type. Must be one of 'income', 'expense', or 'transfer'.");
        }
        transactionData.type = type;
    }
    if (note !== undefined) transactionData.note = note;
    if (category !== undefined) transactionData.category = category;
    if (date !== undefined) transactionData.date = date ? new Date(date) : null;

    const transaction = await TransactionModel.findOneAndUpdate(
        { _id: transactionId, createdBy: userId },
        transactionData,
        { new: true }
    ).populate({
        path: "category",
        select: selectCategory,
    }).select(selectTransaction);

    if (!transaction) {
        throw new ApiError(404, "Transaction not found or already deleted.");
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Transaction updated successfully",
        data: transaction,
    }));
});

const deleteTransaction = asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user._id;

    const transaction = await TransactionModel.findOneAndUpdate(
        { _id: transactionId, createdBy: userId },
        { deleted: true, deletedAt: new Date() },
        { new: true }
    ).populate({
        path: "category",
        select: selectCategory,
    }).select(selectTransaction);

    if (!transaction) {
        throw new ApiError(404, "Transaction not found or already deleted.");
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Transaction deleted successfully",
        data: transaction,
    }));
});

const getCurrency = asyncHandler(async (req, res) => {
    const currency = req.user.currency;
    const symbol = req.user.symbol;

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Currency fetched successfully",
        data: {
            currency,
            symbol,
        }
    }));
});

const updateCurrency = asyncHandler(async (req, res) => {
    const { currency, symbol } = req.body;
    const userId = req.user._id;

    if (!currency || !symbol) {
        return res.status(400).json({ message: "Currency and symbol are required." });
    }

    const user = await UserModel.findByIdAndUpdate(userId, { currency, symbol }, { new: true });

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Currency updated successfully",
        data: {
            currency: user.currency,
            symbol: user.symbol,
        }
    }));
});

module.exports = {
    addTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrency,
    updateCurrency,
};