import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";

type InvoiceFormData = {
  invoiceNo: string;
  orderDate: string;
  customerId: string;
  products: string; // Can be adapted for multiple product selection
};

type CreateInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: InvoiceFormData) => void;
};

const CreateInvoiceModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateInvoiceModalProps) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNo: v4(), // Generate a unique ID for the invoice
    orderDate: "",
    customerId: "",
    products: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h1>Create Invoice</h1>
        <form onSubmit={handleSubmit} className="mt-5">
        
          {/* Invoice Number */}
          <label htmlFor="invoiceNo" className={labelCssStyles}>
            Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNo"
            placeholder="Invoice Number"
            onChange={handleChange}
            value={formData.invoiceNo}
            className={inputCssStyles}
            readOnly // Invoice number is generated automatically
          />

          {/* Order Date */}
          <label htmlFor="orderDate" className={labelCssStyles}>
            Order Date
          </label>
          <input
            type="date"
            name="orderDate"
            onChange={handleChange}
            value={formData.orderDate}
            className={inputCssStyles}
            required
          />

          {/* Customer ID */}
          <label htmlFor="customerId" className={labelCssStyles}>
            Customer ID
          </label>
          <input
            type="text"
            name="customerId"
            placeholder="Customer ID"
            onChange={handleChange}
            value={formData.customerId}
            className={inputCssStyles}
            required
          />

          {/* Products */}
          <label htmlFor="products" className={labelCssStyles}>
            Products
          </label>
          <input
            type="text"
            name="products"
            placeholder="Product IDs (comma-separated)"
            onChange={handleChange}
            value={formData.products}
            className={inputCssStyles}
            required
          />

          {/* Create and Cancel Actions */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
