"use client";
import { useGetCustomerOrderByIdQuery } from "@/state/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CustomerOrderDetails = ({
  params,
}: {
  params: { invoiceNo: number };
}) => {
  const { invoiceNo } = params;
  const {
    data: customerOrder,
    isLoading,
    isError,
  } = useGetCustomerOrderByIdQuery(Number(invoiceNo));
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !customerOrder) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch customer order
      </div>
    );
  }
  console.log(customerOrder);
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
          <div>{customerOrder.invoiceNo}</div>
          <div>{new Date(customerOrder?.dateOrdered).toLocaleDateString()}</div>
          <div>{customerOrder.status}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;
