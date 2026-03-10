const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* =========================
   CREATE ORDER
========================= */
router.post("/", async (req, res) => {
  try {

    console.log("Incoming order:", req.body);

    const order = new Order(req.body);

    await order.save();

    res.status(201).json(order);

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
