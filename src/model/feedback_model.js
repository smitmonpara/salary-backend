const { Schema, model } = require("mongoose");

const feedbackSchema = new Schema(
    {
        subject: {
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
    },
    {
        timestamps: true,
    }
);

const FeedbackModel = model("feedbacks", feedbackSchema);

module.exports = { FeedbackModel }; 
