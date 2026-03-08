const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // store image path like "/images/rings/ring-1.jpg"
    category: {
      type: String,
      required: true,
      enum: ["Necklaces", "Bracelets", "Rings", "Earrings"],
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
