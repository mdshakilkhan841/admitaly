import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "promo",
        required: true,
    },
    href: {
        type: String,
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    textDesign: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
});

export default mongoose.models.Promotion ||
    mongoose.model("Promotion", PromotionSchema);
