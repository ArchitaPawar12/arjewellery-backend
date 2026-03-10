const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* =========================
   CREATE ORDER
========================= */
router.post("/", async (req, res) => {
  try {

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

    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];

    const newOrder = new Order({
      customerName: (firstname || "") + " " + (lastname || ""),
      email: email || "",
      address: (address || "") + ", " + (city || "") + " - " + (zip || ""),

      products: safeItems.map(item => ({
        productId: item.id || "",
        name: item.name || "",
        price: item.price || 0,
        quantity: item.quantity || 1
      })),

      totalAmount: total || 0,
      status: "Processing"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  } catch (error) {

    console.error("Order creation error:", error);

    res.status(500).json({
      message: "Failed to create order"
    });

  }
});


/* =========================
   GET ORDERS
========================= */
router.get("/", async (req, res) => {
  try {

    const { email } = req.query;

    let orders = [];

    if (email) {
      orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.status(200).json(orders);

  } catch (error) {

    console.error("Fetch orders error:", error);

    // Always return array so frontend doesn't crash
    res.status(200).json([]);

  }
});

module.exports = router;
