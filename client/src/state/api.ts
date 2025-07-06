import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CustomerOrder {
  id: number;
  createdAt: string;
  dateOrdered: string;

  address: string;
  name: string;
  phone: string;
  email: string;

  status: string;
}
export interface NewCustomerOrder {
  invoiceNo: number;
  dateOrdered: string;

  name: string;
  email: string;
  phone: string;
  address: string;

  status: string;
  price: number;
}
export interface Product {
  id: number;
  type: string;
  size: string;
  price: string;
}
export interface Customer {
  id: number;
  address: string;
  name: string;
  phone: string;
  email: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  reducerPath: "api",
  tagTypes: ["CustomerOrders", "Products", "Customers"],
  endpoints: (build) => ({
    getCustomerOrders: build.query<CustomerOrder[], string | void>({
      query: (search) => ({
        url: "/customerOrders",
        params: search ? { search } : {},
      }),
      providesTags: ["CustomerOrders"],
    }),
    createCustomerOrder: build.mutation<CustomerOrder[], NewCustomerOrder>({
      query: (newCustomerOrder) => ({
        url: "/customerOrders",
        method: "POST",
        body: newCustomerOrder,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
    updateCustomerOrder: build.mutation<
      CustomerOrder[],
      { invoiceNo: string; data: Partial<Product> }
    >({
      query: ({ invoiceNo, data }) => ({
        url: `/customerOrders/${invoiceNo}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
    deleteCustomerOrder: build.mutation<Product[], string | void>({
      query: (invoiceNo) => ({
        url: "/customerOrders",
        method: "DELETE",
        params: invoiceNo ? { invoiceNo } : {},
      }),
      providesTags: ["CustomerOrders"],
    }),

    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    createProduct: build.mutation<Product[], NewCustomerOrder>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<Product, number>({
      query: (id) => ({
        url: `/products/${id}`, // RESTful path parameter
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    getCustomers: build.query<Customer[], string | void>({
      query: (search) => ({
        url: "/customers",
        params: search ? { search } : {},
      }),
      providesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useCreateCustomerOrdersMutation,
  useUpdateCustomerOrderMutation,
  useDeleteCustomerOrderMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCustomersQuery,
} = api;
