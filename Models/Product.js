import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },  // ✅ Fix: "require" -> "required"
    description: { type: String, required: true }, // ✅ Fix applied
    price: { type: Number, required: true }, // ✅ Fix applied
    category: { type: String, required: true }, // ✅ Fix applied
    qty: { type: Number, required: true }, // ✅ Fix applied
    imgSrc: { type: String, required: true }, // ✅ Fix applied
    createdAt: { type: Date, default: Date.now }, // ✅ No change needed
});

export const Products = mongoose.model("Products", productSchema);
