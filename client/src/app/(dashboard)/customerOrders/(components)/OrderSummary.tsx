import ImageCarousel from "@/app/(components)/Carousel";
import { Card } from "@/components/ui/card";
import {
  useGetProductByIdQuery,
  useGetProductOrdersByInvoiceNoQuery,
  useGetProductPhotoByProductIdQuery,
} from "@/state/api";
import React, { useState } from "react";

const Items = ({ productId, onPrice }) => {
  const { data: product } = useGetProductByIdQuery(Number(productId));
  const {
    data: productPhotoUrls,
    // isError2,
    // isLoading2,
  } = useGetProductPhotoByProductIdQuery(Number(productId));
  console.log("🚀 ~ Items ~ productPhotoUrls:", productPhotoUrls);
  React.useEffect(() => {
    if (product?.price && onPrice) {
      onPrice(product.price); // now safely called only once
    }
  }, [product?.price]); // Only fires when price is first available

  if (!product) {
    return (
      <Card className="mb-2 flex shadow-md flex-row items-center justify-between relative animate-pulse">
        <div className="p-4 text-sm text-gray-400">
          Loading product details...
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-2 flex shadow-md flex-row items-center justify-between p-4 hover:shadow-xl transition duration-200">
      {/* Image Carousel */}
      <div className="w-24 h-24 mr-4">
        {productPhotoUrls?.length > 0 ? (
          <ImageCarousel images={productPhotoUrls} />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 space-y-1">
        <span className="text-sm font-medium text-gray-800">
          {product.name}
        </span>
        <span className="text-sm text-gray-700">{product.type}</span>
      </div>

      {/* Price */}
      <div className="text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap">
        ${product.price}
      </div>
    </Card>
  );
};

const OrderSummary = ({ invoiceNo }) => {
  const {
    data: productOrders,
    isLoading,
    isError,
  } = useGetProductOrdersByInvoiceNoQuery(Number(invoiceNo));

  const [total, setTotal] = useState(0);
  const addedProductIds = React.useRef(new Set());

  const handleAddPrice = (productId, price) => {
    if (!addedProductIds.current.has(productId)) {
      setTotal((prev) => prev + price);
      addedProductIds.current.add(productId);
    }
  };

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-1 flex flex-col">
      {/* Header */}
      <h3 className="text-lg font-medium px-7 pt-5 pb-2">Order Summary</h3>
      <hr />

      {/* Product list */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <p className="text-sm text-gray-400">Loading orders...</p>
        )}
        {isError && (
          <p className="text-sm text-red-500">Failed to load orders.</p>
        )}
        {productOrders?.length === 0 && (
          <p className="text-sm text-gray-500">
            No products found for this invoice.
          </p>
        )}
        {productOrders?.map((order) => (
          <Items
            key={order.id}
            productId={order.productId}
            onPrice={(price) => handleAddPrice(order.productId, price)}
          />
        ))}
      </div>

      {/* Totals section */}
      <div className="px-5 text-xs text-gray-800 border-t">
        <div className="flex justify-end">
          <span className="font-light">Tax (8.875%):</span>
          <span className="ml-1">${(total * 0.08875).toFixed(2)}</span>
        </div>
        <div className="flex justify-end font-semibold text-gray-900 ">
          <span>Total:</span>
          <span className="ml-1">${(total * 1.08875).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
