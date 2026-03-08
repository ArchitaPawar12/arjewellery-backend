const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

/* ===================== GET ALL PRODUCTS ===================== */
router.get("/", async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

/* ===================== GET SINGLE PRODUCT ===================== */
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

/* ===================== ADD PRODUCT ===================== */
router.post("/add", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;

    if (!name || price === undefined || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const created = await Product.create({
      name,
      price,
      image,
      category,
      description: description || "",
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
});

/* ===================== UPDATE PRODUCT ===================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

/* ===================== DELETE PRODUCT ===================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

/* ===================== EXPORT ===================== */
module.exports = router;
