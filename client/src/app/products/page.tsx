"use client";
import { useGetProductsQuery } from "@/state/api";
import Product from "./Product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddProducts from "./AddProducts";

const Products = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  return isModalOpen ? (
    <AddProducts onClose={closeModal} />
  ) : (
    <div className="mx-auto pb-5 w-full m-6">
      {/* Header Bar*/}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
        {/* Add Product */}
        <Button onClick={openModal}>Add</Button>
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
