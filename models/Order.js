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

    const newOrder = new Order({
      customerName: firstname + " " + lastname,
      email: email,
      address: address + ", " + city + " - " + zip,
      products: items,
      totalAmount: total,
      status: "Processing"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  } catch (err) {

    console.error("Order save error:", err);

    res.status(500).json({
      message: err.message
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

    res.json(orders);

  } catch (err) {

    console.error("Fetch orders error:", err);

    res.status(500).json({
      message: err.message
    });

  }
});

module.exports = router;
