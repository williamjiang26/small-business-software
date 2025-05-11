import React from "react";


const Product = ({product}) => {
  return (
    <div
      key={product.productId}
      className="flex"
    >
      <div>{product.productId}</div>
      <div>{product.photoUrls}</div>
      <div>{product.name}</div>
      <div>{product.height}</div>
      <div>{product.width}</div>
      <div>{product.length}</div>
      <div>{product.color}</div>
      <div>{product.price}</div>
      <div>{product.quantity}</div>
      <div>{product.rating}</div>
      
    </div>
  );
};

export default Product;
