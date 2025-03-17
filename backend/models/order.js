// ✅ Order Schema & Model (Ensure it uses "tuts" collection)
const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    address: String,
    phone: String,
    product: Object,
  },
  { collection: "tuts" } // ✅ Force MongoDB to use "tuts" collection
);

const Order = mongoose.model("Order", orderSchema);
