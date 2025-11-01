import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema(
    {
        unId: {
            type: String,
            unique: true,
        },
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
        altImage: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.University ||
    mongoose.model("University", UniversitySchema);
