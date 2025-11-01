import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
    uniId: {
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
});

export default mongoose.models.University ||
    mongoose.model("University", UniversitySchema);
