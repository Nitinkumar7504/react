const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "your_secret_key";

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tut", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ✅ Order Schema & Model (using "tuts" collection)
const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    address: String,
    phone: String,
    product: Object,
  },
  { collection: "tuts" } // ✅ Set collection name to "tuts"
);

const Order = mongoose.model("Order", orderSchema);

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// ✅ Login Route (with JWT Token)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "✅ Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ Order API (Handles Buy Now Orders)
app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, address, phone, product } = req.body;

    if (!name || !email || !address || !phone || !product) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newOrder = new Order({ name, email, address, phone, product });
    await newOrder.save();

    res.status(201).json({ message: "✅ Order placed successfully!" });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Error placing order" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
