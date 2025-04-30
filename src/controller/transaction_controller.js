const { asyncHandler } = require("../utils/async_handler");
const { TransactionModel, selectTransaction } = require("../model/transaction_model");
const { SuccessResponse } = require("../utils/response");
const { selectCategory } = require("../model/category_model");
const { ApiError } = require("../utils/api_error");
const { TRANSACTION_TYPE } = require("../config/string");

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
    const month = req.query.month || currentDate.getMonth() + 1;
    const year = req.query.year || currentDate.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await TransactionModel.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate }
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

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Transaction fetched successfully",
        data: result[0],
    }));
});

module.exports = {
    addTransaction,
    getTransaction,
};