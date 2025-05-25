"use client";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  Trash2,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import { useGetCustomersQuery } from "@/state/api";
import CreateCustomerModal from "./AddCustomer";
import Image from "next/image";
import Profile from "../../../../server/assets/profile-icon.png";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddCustomer from "./AddCustomer";

const Customers = () => {
  const { data: customers, isError, isLoading } = useGetCustomersQuery();

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
  if (isError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customers
      </div>
    );
  }

  return isModalOpen ? (
    <AddCustomer onClose={closeModal} />
  ) : (
    <div className="mx-auto pb-5 w-full m-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Customers</h1>
        <Button onClick={openModal}>Add</Button>
      </div>

      {/* Content */}
      <Table>
        <TableCaption>list of customer information</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Customers;
