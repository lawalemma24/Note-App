import React from "react";
import { PRODUCTS } from "../../products";
import { Product } from "./product";
import "./shop.css";
import { Navbar } from "../../components/navbar";

export const Shop = () => {
  return (
    <div className="shop">
      <Navbar/>
      <div className="shopTitle">
        <h1>DIGITAL SHOPPING PLATFORM</h1>
      </div>

      <div className="products">
        {PRODUCTS.map((product) => (
          <Product data={product} />
        ))}
      </div>
    </div>
  );
};
