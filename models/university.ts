import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.University ||
    mongoose.model("University", UniversitySchema);
