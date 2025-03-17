import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductPage = ({ products }) => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Hook for navigation

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <h2>Product not found!</h2>;
  }

  // Handle Buy Now button click
  const handleBuyNow = () => {
    navigate("/buy-now", { state: { product } }); // Pass product details to BuyNowPage
  };

  return (
    <div className="product-page">
      <h2>{product.name}</h2>
      <img src={product.img || "/placeholder.jpg"} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>

      {/* Buy Now Button */}
      <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ProductPage;