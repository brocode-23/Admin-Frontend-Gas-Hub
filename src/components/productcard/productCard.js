import React, { useState } from "react";
import { useCart } from "../../context/cartContext";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="flex">
        {/* Left side - Image */}
        <div className="w-1/3 min-w-[200px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Content */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-purple-700 font-semibold text-lg mb-4">
              LKR {product.price}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Quantity:</span>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-md w-20 text-center py-1 px-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <button
              className="w-full bg-purple-600 text-white py-2.5 rounded-md hover:bg-purple-700 transition-colors duration-200 font-medium"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
