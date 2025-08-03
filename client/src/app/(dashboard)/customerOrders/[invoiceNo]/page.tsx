"use client";
import {
  useGetCustomerByIdQuery,
  useGetCustomerOrderByIdQuery,
} from "@/state/api";
import { ArrowLeft, MapPin, Phone, User, Mail } from "lucide-react";
import Link from "next/link";
import OrderSummary from "../(components)/OrderSummary";
import PdfComponent from "../(components)/PdfComponent";

const CustomerOrderDetails = ({
  params,
}: {
  params: { invoiceNo: number };
}) => {
  const { invoiceNo } = params;

  // Fetch order
  const {
    data: customerOrder,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetCustomerOrderByIdQuery(invoiceNo);

  // Extract customerId if available
  const customerId = customerOrder?.customerId;

  // Fetch customer info (always call hook, but it won't run until customerId is valid)
  const {
    data: customer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
  } = useGetCustomerByIdQuery(customerId!, {
    skip: !customerId,
  });

  // Loading state
  if (isOrderLoading || (customerId && isCustomerLoading)) {
    return <div className="py-4">Loading...</div>;
  }

  // Error state
  if (isOrderError || isCustomerError || !customerOrder || !customer) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch customer or order data
      </div>
    );
  }
  return (
    <div>
      <Link
        href="/customerOrders"
        className="mb-6 flex flex-row items-center space-x-1 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 duration-200 transition-all"
        />
        <span>Back</span>
      </Link>

      <div className="flex justify-between items-start w-full">
        <div>
          <div className="text-xl font-bold">{invoiceNo}</div>
          <div className="flex items-center space-x-5 text-sm">
            <MapPin className="h-4 w-4" /> {customer.address}
          </div>
          <div className="flex items-center space-x-5 text-sm">
            <Phone className="w-4 h-4" />
            {customer.phone}
          </div>
          <div className="flex items-center space-x-5 text-sm">
            <User className="w-4 h-4" />
            {customer.name}
          </div>
          <div className="flex items-center space-x-5 text-sm">
            <Mail className="w-4 h-4" />
            {customer.email}
          </div>
        </div>
        <div>
          <div>{new Date(customerOrder?.dateOrdered).toLocaleDateString()}</div>
          <div className="text-green-500">{customerOrder.status}</div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 sm:px-0">
        {/* Left column: Order summary */}
        <OrderSummary invoiceNo={invoiceNo} />

        {/* Right column: PDFs */}
        <div className="border-2 border-black p-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PdfComponent title={"Measurement"} />
          <PdfComponent title={"Customer Invoice Copy"} />
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;
