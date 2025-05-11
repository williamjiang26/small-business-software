"use client";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  Trash2,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetInvoiceByIdQuery,
} from "@/state/api";
import CreateCustomerModal from "./CreateCustomerModal";
import Image from "next/image";
import Profile from "../../../../server/assets/profile-icon.png";

type CustomerFormData = {
  customerId: string;
  address: string;
  name: string;
  phone: string;
  email: string;
};

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const {
    data: customers,
    isError: isCustomersError,
    isLoading: isCustomersLoading,
  } = useGetCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(
    null
  );
  const {
    data: invoices,
    isError: isInvoicesError,
    isLoading: isInvoicesLoading,
  } = useGetInvoiceByIdQuery(
    currentCustomerId ? currentCustomerId : undefined,
    { skip: !currentCustomerId }
  );

  if (isCustomersLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isCustomersError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch customers
      </div>
    );
  }

  const handleCreateCustomer = async (customerData: CustomerFormData) => {
    await createCustomer(customerData);
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedCustomers.map((id) => deleteCustomer(id)));
    setSelectedCustomers([]);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((customerId) => customerId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteCustomer = async (id: string) => {
    await deleteCustomer(id);
    setSelectedCustomers((prev) =>
      prev.filter((customerId) => customerId !== id)
    );
  };

  const handleGetInvoices = (id: string) => {
    setCurrentCustomerId(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center m-3">
        <h1 className="text-2xl font-semibold text-gray-700">Customers</h1>

        <div className="flex space-x-2">
          {selectedCustomers.length > 0 && (
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
            Add Customer
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.customerId}
            className="border shadow rounded-md p-6 flex flex-row items-center space-x-12 max-w-full"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedCustomers.includes(customer.customerId)}
              onChange={() => handleSelectCustomer(customer.customerId)}
              className="form-checkbox"
            />

            {/* Customer Image */}
            <Image
              src={Profile}
              alt="Customer Image"
              width={80}
              height={80}
              className="rounded-full object-cover flex-shrink-0"
            />

            {/* Customer Details */}
            <div className="flex flex-row flex-grow space-x-12">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.customerId}</p>
              </div>
              <p className="text-sm text-gray-800">
                {customer.address || "No address provided"}
              </p>
              <p className="text-sm text-gray-600">
                {customer.phone || "No phone number available"}
              </p>
              <p className="text-sm text-gray-600">
                {customer.email || "No email provided"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row items-end space-y-4">
              <button
                onClick={() => handleGetInvoices(customer.customerId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <StickyNote className="w-5 h-5 mr-2" />
                Invoices
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.customerId)}
                className="text-red-600 hover:text-red-800 transition duration-300"
                aria-label={`Delete customer ${customer.name}`}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invoices Modal */}
      {currentCustomerId && invoices && (
        <div className="modal">
          <h2 className="text-lg font-semibold">
            Invoices for Customer ID: {currentCustomerId}
          </h2>
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.invoiceNo}>{invoice.orderDate}</li>
            ))}
          </ul>
          <button onClick={() => setCurrentCustomerId(null)}>Close</button>
        </div>
      )}

      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCustomer}
      />
    </div>
  );
};

export default Customers;
