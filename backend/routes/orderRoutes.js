const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// ✅ CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { name, email, address, phone, product } = req.body;

    if (!name || !email || !address || !phone || !product) {
      return res.status(400).json({ error: "All fields including product are required!" });
    }

    const newOrder = new Order({ name, email, address, phone, product });
    await newOrder.save();

    res.status(201).json({ message: "✅ Order Placed Successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "❌ Server Error", details: error.message });
  }
});

// ✅ GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "❌ Server Error", details: error.message });
  }
});

module.exports = router;
