// src/components/navbar/navBar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-purple-700 text-white py-4 px-6">
      <div className="text-2xl font-bold">GasHub</div>
      <ul className="flex space-x-6">
        <Link to="/">
          <li>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-md">
              Products
            </button>
          </li>
        </Link>
        <Link to="/tokens">
          <li>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-md">
              Tokens
            </button>
          </li>
        </Link>
        <Link to="/business-request">
          <li>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-md">
              Buisness Account
            </button>
          </li>
        </Link>
        <li>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-md">
            Contact
          </button>
        </li>
      </ul>
      <div className="flex space-x-4 text-2xl">
        <Link to="/cart">
          <button className="hover:text-gray-300">
            🛒 <span>{cart.length}</span>
          </button>
        </Link>
        <button className="hover:text-gray-300">👤</button>
      </div>
    </nav>
  );
};

export default Navbar;
