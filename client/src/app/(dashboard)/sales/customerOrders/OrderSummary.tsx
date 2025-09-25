import ImageCarousel from "@/app/(components)/Carousel";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";

const Items = ({ productId, onPrice, order, details }) => {
 
  //   const {
  //     data: productPhotoUrls,
  //     // isError2,
  //     // isLoading2,
  //   } = useGetProductPhotoByProductIdQuery(Number(productId));

  //   React.useEffect(() => {
  //     if (product?.price && onPrice) {
  //       onPrice(product.price); // now safely called only once
  //     }
  //   });

  return (
    <Card className="mb-2 flex shadow-md flex-row items-center justify-between p-4 hover:shadow-xl transition duration-200">
      {/* Image Carousel */}
      {/* <div className="w-24 h-24 mr-4">
        {productPhotoUrls ? (
          <ImageCarousel images={productPhotoUrls} />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
      </div> */}

      {/* Product Info */}
      <div className="flex flex-row flex-1 space-x-1 items-center">
        <span className="text-sm text-gray-700">{details?.type}</span>
        <span className="text-sm text-gray-700">{details?.color}</span>
      </div>

      {/* Product Size */}
      <div className="flex flex-row flex-1 space-x-1 items-center">
        <span className="text-sm text-gray-700">
          {details?.width} x {details?.height} x {details?.length}
        </span>
      </div>

      {/* Price */}
      <div className="text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap">
        ${details?.price || 0.0}
      </div>
      {/* Price */}
      <div className="text-sm ml-4 rounded bg-green-300 whitespace-nowrap">{order?.status}</div>
    </Card>
  );
};

const OrderSummary = ({ invoiceDetails }) => {

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

        {invoiceDetails?.productOrders?.map((order, index) => (
          <Items
            key={order.orderNo}
            productId={order.productId}
            onPrice={(price) => handleAddPrice(order.productId, price)}
            order={order}
            details={invoiceDetails.productDetails?.[index]}
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
