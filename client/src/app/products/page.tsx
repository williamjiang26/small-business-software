"use client";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { useState } from "react";
import Product from "./Product";

type ProductFormData = {
 
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState(" ");
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);
  const [createProduct] = useCreateProductMutation();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full m-6">
      {/* Header Bar*/}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
      </div>

      {/* Body Products List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg-grid-cols-4 gap-10 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => <Product product={product} />)
        )}
      </div>
    </div>
  );
};
export default Products;
