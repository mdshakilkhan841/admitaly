import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true,
        },
        call: {
            type: String,
        },
        applicationLink: {
            type: String,
            default: "#",
        },
        admissionFee: {
            type: String,
            default: "No Fee",
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        },
        cgpa: {
            type: String,
            default: "Not specified",
        },
        others: {
            type: [String],
        },
        languageProficiency: {
            type: [String],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);
