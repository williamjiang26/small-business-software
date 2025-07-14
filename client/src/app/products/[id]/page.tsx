"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetProductPhotoByProductIdQuery,
} from "@/state/api";
import ImageCarousel from "@/app/Components/Carousel";

const ProductDetails = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(Number(id));
  const {
    data: productPhotoUrls,
    isError2,
    isLoading2,
  } = useGetProductPhotoByProductIdQuery(Number(id)); // this returns a list of s3 urls

  console.log("🚀 ~ productPhotoUrls:", productPhotoUrls);

  if (isLoading || isLoading2) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || isError2 || !product || !productPhotoUrls) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch product or photoUrl
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/products"
        className="mb-6 flex flex-row items-center space-x-1 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 duration-200 transition-all"
        />
        <span>Back</span>
      </Link>
      {/* Product details header block */}
      <div className="flex justify-between items-start w-full">
        {/* Left side: image + description */}
        <div className="flex items-start space-x-4">
          {/* Image mosaic */}
          <ImageCarousel images={productPhotoUrls} />
          {/* Product description */}
          <div className="flex flex-col justify-between">
            <div className="text-xl font-extrabold">{product.type}</div>
            <div>{product.color}</div>
            <div>
              {product.height}x{product.width}x{product.length}
            </div>
            <div>${product.price}</div>
          </div>
        </div>

        {/* Right side: ID + Date */}
        <div className="text-right">
          <div className="text-xl font-extrabold">{product.id}</div>
          <div>{new Date(product?.dateOrdered).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
