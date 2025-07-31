"use client";
import {
  useGetCustomerByIdQuery,
  useGetCustomerOrderByIdQuery,
} from "@/state/api";
import { ArrowLeft, MapPin, Phone, User, Mail } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

      {/* product orders */}
      <Table>
        <TableCaption> List of items in this order.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order No.</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">8351</TableCell>
            <TableCell>Double</TableCell>
            <TableCell>Black</TableCell>
            <TableCell>74x96</TableCell>
            <TableCell className="text-right">$6300</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerOrderDetails;
