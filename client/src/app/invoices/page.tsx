"use client";
import { PlusCircleIcon, MinusCircleIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
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
  const { data: invoices, isError, isLoading } = useGetInvoicesQuery();
  const [createInvoice] = useCreateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !invoices) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch invoices
      </div>
    );
  }

  const handleCreateInvoice = async (invoiceData: InvoiceFormData) => {
    await createInvoice(invoiceData);
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedInvoices.map((id) => deleteInvoice(id)));
    setSelectedInvoices([]);
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((invoiceId) => invoiceId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteInvoice = async (id: string) => {
    await deleteInvoice(id);
    setSelectedInvoices((prev) =>
      prev.filter((invoiceId) => invoiceId !== id)
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center m-3">
        <h1 className="text-2xl font-semibold text-gray-700">Invoices</h1>

        <div className="flex space-x-2">
          {selectedInvoices.length > 0 && (
            <button
              className="flex items-center bg-red-500 hover:bg-red-700 text-gray-200 font-bold py-2 px-4 rounded"
              onClick={handleDeleteSelected}
            >
              <MinusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
              Delete Selected
            </button>
          )}
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
            Add Invoice
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.invoiceNo}
            className="border shadow rounded-md p-4 w-full"
          >
            <div className="flex items-center justify-between">
              <input
                type="checkbox"
                checked={selectedInvoices.includes(invoice.invoiceNo)}
                onChange={() => handleSelectInvoice(invoice.invoiceNo)}
              />
              <button onClick={() => handleDeleteInvoice(invoice.invoiceNo)}>
                <Trash2 className="text-red-600" />
              </button>
            </div>
            <div className="mt-2">
              <p className="text-gray-800">Invoice No: {invoice.invoiceNo}</p>
              <p className="text-lg font-semibold">Order Date: {invoice.orderDate}</p>
              <p className="text-gray-800">Customer ID: {invoice.customerId}</p>
              <p className="text-sm text-gray-600">Products: {invoice.products}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateInvoice}
      />
    </div>
  );
};

export default Invoices;
