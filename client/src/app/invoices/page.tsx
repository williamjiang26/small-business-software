"use client";
import { PlusCircleIcon, MinusCircleIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useGetCustomerOrdersQuery,
  useUpdateCustomerOrderMutation,
  useDeleteCustomerOrderMutation,
  useCreateCustomerOrdersMutation,
} from "@/state/api";
import CreateInvoiceModal from "./CreateInvoiceModal";

type InvoiceFormData = {
  invoiceNo: string;
  orderDate: string;
  customerId: string;
  products: string;
};

const Invoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  
  // const [createInvoice] = useCreateCustomerOrdersMutation()
  // const [deleteInvoice] = useDeleteCustomerOrderMutation()
  // const [updateInvoice] = useUpdateCustomerOrderMutation()
  const { data: orders, isLoading, isError } = useGetCustomerOrdersQuery()

  return (
    // Header
    
    // List of Orders
    <div>
      {orders?.map((order) => (order.status))}
    </div>
  );
};

export default Invoices;
