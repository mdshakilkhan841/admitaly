import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        uniId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true,
        },
        call: {
            type: String | null,
        },
        applicationLink: {
            type: String,
            default: "#",
        },
        admissionFee: {
            type: String,
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
            type: [{ type: String }],
        },
        languageProficiency: {
            type: [{ type: String }],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);
