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

  return (
    <div className="mx-auto pb-5 w-full m-6">
      <Button>Create</Button>
      {customers?.map((customer) => (
        <div>
          {customer.id} | {customer.address} | {customer.name} | {customer.phone} | {customer.email}
        </div>
      ))}
    </div>
  );
};

export default Customers;
