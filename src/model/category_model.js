const { Schema, model } = require("mongoose");
const { selectUser } = require("./user_model");
const { deleteFile } = require("../middleware/upload");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
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

categorySchema.pre("findOneAndUpdate", async function (next) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        this._oldIcon = doc.icon;
    }
    next();
});

categorySchema.post("findOneAndUpdate", async function (doc) {
    try {
        const oldIcon = this._oldIcon;
        const newIcon = doc?.icon;

        if (oldIcon && newIcon && oldIcon !== newIcon) {
            deleteFile(oldIcon); 
        }
    } catch (error) {
        console.error("Error deleting old icon:", error);
    }
});

const selectCategory = {
    deletedAt: 0,
    deleted: 0,
    __v: 0,
};


const CategoryModel = model("categories", categorySchema);

module.exports = { CategoryModel, selectCategory }; 
