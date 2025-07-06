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
import { Button } from "@/components/ui/button";

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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="">
          Customer | Invoice No. | Date Ordered | Status
        </div>
        <Button>Create</Button>
      </div>

      {/* List of Orders */}
      {orders?.map((order) => (
        <div>
          {order.customerId} | {order.invoiceNo} |{" "}
          {new Date(order.dateOrdered).toLocaleDateString()} | {order.status}
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
