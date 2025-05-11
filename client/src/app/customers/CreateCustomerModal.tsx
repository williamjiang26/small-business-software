import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";

type CustomerFormData = {
  customerId: string;
  address: string;
  name: string;
  phone: string;
  email: string;
};

type CreateCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CustomerFormData) => void;
};

const CreateCustomerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateCustomerModalProps) => {
  const [formData, setFormData] = useState({
    customerId: "",
    address: "",
    name: "",
    phone: "",
    email: "",
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
        <h1>Add Customer</h1>
        <form onSubmit={handleSubmit} className="mt-5">
       
          {/* Customer ID */}
          <label htmlFor="customerId" className={labelCssStyles}>
            Customer ID
          </label>
          <input
            type="text"
            name="customerId"
            placeholder="ID"
            onChange={handleChange}
            value={formData.customerId}
            className={inputCssStyles}
            required
          />

          {/* Address */}
          <label htmlFor="Address" className={labelCssStyles}>
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
            className={inputCssStyles}
            required
          />

          {/* NAME */}
          <label htmlFor="customerName" className={labelCssStyles}>
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PHONE */}
          <label htmlFor="phone" className={labelCssStyles}>
            Phone
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formData.phone}
            className={inputCssStyles}
            required
          />

          {/* EMAIL */}
          <label htmlFor="email" className={labelCssStyles}>
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
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

export default CreateCustomerModal;
