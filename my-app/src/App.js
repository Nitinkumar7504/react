import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import UserCard from "./components/UserCard.jsx";
import ProductPage from "./components/ProductPage.jsx";
import BuyNowPage from "./components/buynowpage.jsx";
import AddProduct from "./components/AddProduct.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Sign.jsx"; 
import Navbar from "./components/Navbar.jsx";

// ✅ Private Route Wrapper
const PrivateRoute = () => {
  return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [user, setUser] = useState(!!localStorage.getItem("token")); 
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("products")) || []);

  // ✅ Sync products with localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ✅ Log User State for Debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(false);
  };

  // ✅ Add Product Function
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: Date.now().toString() }, 
    ]);
  };

  return (
    <Router>
      {user && <Navbar logout={logout} />}
      <div className="container">
        <Routes>
          {/* ✅ Redirect Home Based on Auth */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

          {/* ✅ Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<UserCard products={products} setProducts={setProducts} logout={logout} />} />
            <Route path="/add-product" element={<AddProduct addProduct={addProduct} />} />
          </Route>

          {/* ✅ Public Routes */}
          <Route path="/product/:id" element={<ProductPage products={products} />} />
          <Route path="/buy-now" element={<BuyNowPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
