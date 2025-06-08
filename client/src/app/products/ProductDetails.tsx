import { Button } from "@/components/ui/button";
import React from "react";

const ProductDetails = ({ onClose, product }) => {
  // update product log

  return (
    <div className="mx-auto pb-5 w-full m-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-700">
          {product.productId} {product.name}
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>

      {/* product info overview */}
      <div className="flex mb-6">
        <div className="w-32 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center">
          {/* <img
          src={Door.src}
          alt={product.name}
          className="object-cover w-full h-full"
        /> */}
        </div>
        <div className="flex-col items-center">
          <div className="text-l font-semibold text-gray-700">
            {product.color}
          </div>
          <div> Height: {product.height}</div>
          <div> Width: {product.width}</div>
          <div> Length: {product.length}</div>
          <div> Price: ${product.price}</div>
        </div>
      </div>

      {/* notes, updates */}
      <div>Updates and Notes:</div>
      
    </div>
  );
};

export default ProductDetails;
