import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = ({ addProduct }) => {
  const [product, setProduct] = useState({ name: "", img: "", description: "", price: "" });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, img: reader.result }); // Save Base64 string
        setPreview(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      alert("Name and Price are required!");
      return;
    }
    addProduct(product);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
      
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      
      {preview && <img src={preview} alt="Preview" className="image-preview" />}
      
      <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
