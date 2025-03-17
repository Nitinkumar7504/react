import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserCard.css";

const UserCard = ({ products, setProducts, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle Sidebar
  const toggleMenu = () => setIsOpen(!isOpen);

  // Delete the First Product (Safeguard for Empty List)
  const deleteProduct = () => {
    if (products.length === 0) {
      alert("No products to delete!");
      return;
    }
    setProducts((prevProducts) => prevProducts.slice(1)); // Remove the first product
  };

  // 🔹 Persist Products in Local Storage (Ensures Data is Retained)
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  return (
    <div className="user-card-container">
      {/* ✅ Sidebar Toggle Button (Top-Left Corner) */}
      {!isOpen && (
        <button className="menu-btn" onClick={toggleMenu}>☰ Menu</button>
      )}
     
      {/* ✅ Logout Button (Top-Right Corner) */}
      <button className="logout-btn" onClick={logout}>Logout</button>

      {/* ✅ Sidebar Navigation */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="back-btn" onClick={toggleMenu}>←</button>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/add-product")}>Add Product</button>
        <button className="delete-btn" onClick={deleteProduct}>❌ Delete Product</button>
      </div>

      {/* ✅ Product List */}
      <div className="content">
        <div className="container">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id || index} 
                className="box"
                onClick={() => navigate(`/product/${product.id || index}`)}
              >
                {/* ✅ Image Handling (Uses Placeholder if Image is Missing) */}
                <img
                  src={product.img || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  className="product-img"
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <p className="description">
                  <strong>{product.name}</strong>
                </p>
                <p>{product.description}</p>
              </div>
            ))
          ) : (
            <p className="no-products">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
