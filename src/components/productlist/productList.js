import React from "react";
import ProductCard from "../productcard/productCard";
import bigsilinder from "../../assets/gas12kg.png";
import midsilinder from "../../assets/gas5kg.png";
import smallsilinder from "../../assets/gas2kg.png";

const products = [
  {
    name: "12.5kg Gas Cylinder",
    price: 2500,
    stock: 50,
    image: bigsilinder, // Replace with actual image paths
  },
  {
    name: "5kg Gas Cylinder",
    price: 1000,
    stock: 75,
    image: midsilinder,
  },
  {
    name: "2.3kg Gas Cylinder",
    price: 500,
    stock: 100,
    image: smallsilinder,
  },
];

const ProductList = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
