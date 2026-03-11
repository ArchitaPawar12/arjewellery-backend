const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* =========================
   CREATE ORDER
========================= */
router.post("/", async (req, res) => {
  try {

    console.log("Incoming Order:", req.body);

    const {
      firstname,
      lastname,
      email,
      address,
      city,
      zip,
      items,
      total
    } = req.body;

    // Ensure items array exists
    const orderItems = Array.isArray(items) ? items : [];

    // Convert items to products format
    const products = orderItems.map(item => ({
      productId: item.productId || item.id || "",
      name: item.name || "Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || ""   // ensure image is saved
    }));

    // Create order
    const newOrder = new Order({
      customerName: `${firstname || ""} ${lastname || ""}`.trim(),
      email: email || "",
      address: `${address || ""}, ${city || ""} - ${zip || ""}`,
      products: products,
      totalAmount: Number(total) || 0,
      status: "Processing"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);   // return order directly

  } catch (error) {

    console.error("Order creation error:", error);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message
    });

  }
});


/* =========================
   GET ORDERS
========================= */
router.get("/", async (req, res) => {
  try {

    const { email } = req.query;

    let orders;

    if (email) {
      orders = await Order.find({ email }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.json(orders);   // return array directly

  } catch (error) {

    console.error("Fetch orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });

  }
});

module.exports = router;
