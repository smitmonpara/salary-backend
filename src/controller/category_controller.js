const { asyncHandler } = require("../utils/async_handler");
const { CategoryModel, selectCategory } = require("../model/category_model");
const { deleteFile } = require("../middleware/upload");
const { SuccessResponse } = require("../utils/response");
const { ApiError } = require("../utils/api_error");

const createCategory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name } = req.body;
    const icon = req.file;

    const foundCategory = await CategoryModel.findOne({
        $and: [
            { name },
            {
                $or: [
                    { createdBy: userId },
                    { createdBy: { $exists: false } }
                ]
            }
        ]
    });

    if (foundCategory) {
        deleteFile(icon);
        throw new ApiError(400, 'Category already exists');
    }

    let category = await CategoryModel.create({
        name,
        icon: icon?.path,
        createdBy: userId,
    });

    if (!category) {
        deleteFile(icon);
        throw new ApiError(500, 'Category creation failed');
    }

    category = await CategoryModel.findById(category._id).select(selectCategory);

    res.status(201).json(new SuccessResponse({
        statusCode: 201,
        message: "Category created successfully",
        data: category
    }));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const categories = await CategoryModel.find({
        $and: [
            { deleted: false },
            {
                $or: [
                    { createdBy: userId },
                    { createdBy: { $exists: false } }
                ]
            }
        ]
    }).select(selectCategory);

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Categories fetched successfully",
        data: categories
    }));
});

const getCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const category = await CategoryModel.findOne({
        deleted: false,
        _id: id,
    }).select(selectCategory);

    if (!category) {
        throw new ApiError(400, 'Category not found');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Category fetched successfully",
        data: category
    }));
});

const updateCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    const { name } = req.body;
    const icon = req.file;

    const foundCategory = await CategoryModel.findOne({
        $and: [
            { _id: { $ne: id } },
            { name },
            { deleted: false },
            {
                $or: [
                    { createdBy: userId },
                    { createdBy: { $exists: false } }
                ]
            }
        ]
    });

    if (foundCategory) {
        deleteFile(icon);
        throw new ApiError(400, 'Category already exists');
    }

    const category = await CategoryModel.findOneAndUpdate({
        deleted: false,
        _id: id,
        createdBy: userId,
    }, {
        name,
        icon: icon?.path,
    }, {
        new: true,
    }).select(selectCategory);

    if (!category) {
        deleteFile(icon);
        throw new ApiError(400, 'You are not allowed to update this category');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Category updated successfully",
        data: category
    }));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    const category = await CategoryModel.findOneAndUpdate({
        deleted: false,
        _id: id,
        createdBy: userId,
    }, {
        deleted: true,
        deletedAt: new Date(),
    }, {
        new: true,
    }).select(selectCategory);

    if (!category) {
        throw new ApiError(400, 'You are not allowed to delete this category');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: "Category deleted successfully",
        data: category
    }));
});



module.exports = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};