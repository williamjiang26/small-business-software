"use client";
import { useGetProductsQuery } from "@/state/api";
import Product from "./Product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddProducts from "./AddProducts";
import ProductDetails from "./ProductDetails";

const Products = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [product, setProduct] = useState();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCard = () => {
    setIsCardOpen(true);
  };

  const closeCard = () => {
    setIsCardOpen(false);
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
  ) : isCardOpen ? (
    <ProductDetails onClose={closeCard} product={product} />
  ) : (
    <div className="mx-auto pb-5 w-full m-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-700">Products</div>
        {/* Add Product */}
        <Button onClick={openModal}>Add</Button>
      </div>
      <div className="text-m font-semibold text-gray-700 bg-white width-full shadow-md rounded-lg p-2 mb-3 flex flex-col sm:flex-row items-center sm:items-start justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Header Bar*/}
        <div>Id</div>
        <div>Image</div>
        <div>Type</div>
        <div>Color</div>
            <div>Height</div>
            <div>Width</div>
            <div>Length</div>
        <div>Price</div>
        <div>Qty</div>
      </div>

      {/* Body Products List */}
      <div className="grid grid-cols-1  gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              onClick={() => {
                setProduct(product);
                openCard();
              }}
            >
              <Product key={product.productId} product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Products;
