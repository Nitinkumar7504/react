import React from "react";
import { Link } from "react-router-dom";
const Navbar = ({ user, logout }) => {
  return (
    <nav>
      <h1>My App</h1>
      <div>
        {user && (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;