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

const CustomerOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  // first page
  const { data: orders, isLoading, isError } = useGetCustomerOrdersQuery();
  // const [createInvoice] = useCreateCustomerOrdersMutation();

  // get customer info from customerId

  // second page details
  // const [updateInvoice] = useUpdateCustomerOrderMutation()
  // const [deleteInvoice] = useDeleteCustomerOrderMutation()

  return (
    // Header

    // List of Orders
    <div>
      {orders?.map((order) => (
        <div>
          {order.customerId} | {order.invoiceNo} | {order.dateOrdered} | {order.status}
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
