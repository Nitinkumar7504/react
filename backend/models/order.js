const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: Object, required: true }, // ✅ Ensure product is stored
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
