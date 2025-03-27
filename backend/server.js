require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nitinkarwasra785:8d8eMwthrkYl8RJ7@cluster0.ithpgu8.mongodb.net/?retryWrites=true&w=majority";

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" })); // Increased request size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ✅ Order Schema & Model
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: Object, required: true },
}, { collection: "orders", timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ User created successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "✅ Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(403).json({ error: "Access denied, token missing" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// ✅ Place Order API
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { name, email, address, phone, product } = req.body;
    if (!name || !email || !address || !phone || !product) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newOrder = new Order({ name, email, address, phone, product });
    await newOrder.save();

    res.status(201).json({ message: "✅ Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("❌ Order Error:", error.message);
    res.status(500).json({ error: "Error placing order" });
  }
});

// ✅ Fetch All Orders API
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error.message);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// ✅ Handle Preflight Requests for CORS
app.options("*", cors());

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
