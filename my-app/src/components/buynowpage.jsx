import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./buynowpage.css";

const BuyNowPage = () => {
  const location = useLocation();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!product) {
        alert("❌ No product selected!");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Please log in to place an order!");
        setLoading(false);
        return;
      }

      const orderData = { ...formData, product };
      console.log("🔹 Sending Order:", orderData);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Order placed successfully!");
        setFormData({ name: "", email: "", address: "", phone: "" });
      } else {
        alert(`❌ Error: ${data.error || "Failed to place order"}`);
        console.error("Order Error:", data);
      }
    } catch (error) {
      alert("❌ Network error! Check console for details.");
      console.error("❌ Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-now-container">
      <h2>Buy Now</h2>
      {product ? (
        <div className="product-preview">
          <img src={product.img || "/placeholder.jpg"} alt={product.name} className="product-img" />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      ) : <p className="error">❌ No product selected!</p>}

      <form className="buy-now-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Your Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Order"}</button>
      </form>
    </div>
  );
};

export default BuyNowPage;
