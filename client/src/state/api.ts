import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CustomerOrder {
  invoiceNo: number;
  customerId: number;
  dateOrdered: string;
  status: string;
}

export interface Customer {
  id: number;
  address: string;
  name: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  color: string;
  height: number;
  width: number;
  length: number;
  price: number;
}

export interface ProductPhoto {
  id: number;
  productId: number;
  url: string;
}

export interface ProductOrder {
  orderNo: number;
  productId: number;
  dateOrdered: string;
  section: number;
  row: number;
  dateStocked: string;
  dateSold: string;
  customerInvoice: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  reducerPath: "api",
  tagTypes: [
    "CustomerOrders",
    "Products",
    "ProductPhotos",
    "Customers",
    "ProductOrders",
  ],
  endpoints: (build) => ({
    getCustomerOrders: build.query<CustomerOrder[], string | void>({
      query: (search) => ({
        url: "/customerOrders",
        params: search ? { search } : {},
      }),
      providesTags: ["CustomerOrders"],
    }),
    getCustomerOrderById: build.query<CustomerOrder, string>({
      query: (invoiceNo) => `/customerOrders/${invoiceNo}`,
      invalidatesTags: ["CustomerOrders"],
    }),
    createCustomerOrder: build.mutation<CustomerOrder, CustomerOrder>({
      query: (newCustomerOrder) => ({
        url: "/customerOrders",
        method: "POST",
        body: newCustomerOrder,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
    updateCustomerOrder: build.mutation<
      CustomerOrder,
      { invoiceNo: string; data: Partial<CustomerOrder> }
    >({
      query: ({ invoiceNo, data }) => ({
        url: `/customerOrders/${invoiceNo}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
    deleteCustomerOrder: build.mutation<CustomerOrder, number | void>({
      query: (invoiceNo) => ({
        url: `/customerOrders/${invoiceNo}`,
        method: "DELETE",
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
      invalidatesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
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
        url: `/products/${id}`, 
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
    createCustomer: build.mutation<Customer, Customer>({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: ["Customers"],
    }),
    getCustomerById: build.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: build.mutation<Customer, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: build.mutation<
      Customer,
      { id: number; data: Partial<Customer> }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    getProductPhotoByProductId: build.query<ProductPhoto, string>({
      query: (productId) => `/productPhotos/${productId}`,
      invalidatesTags: ["ProductPhotos"],
    }),
    getProductOrdersByProductId: build.query<ProductOrder, string>({
      query: (productId) => `/productOrders/${productId}`,
      invalidatesTags: ["ProductOrders"],
    }),
    createProductOrder: build.mutation<
      ProductOrder,
      { productId: number; formData: FormData }
    >({
      query: ({ productId, formData }) => ({
        url: `/productOrders/${productId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProductOrders"],
    }),
    deleteProductOrder: build.mutation<ProductOrder, number>({
      query: (orderNo) => ({
        url: `/productOrders/${orderNo}`, 
        method: "DELETE",
      }),
      invalidatesTags: ["ProductOrders"],
    }),
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useGetCustomerOrderByIdQuery,
  useCreateCustomerOrderMutation,
  useUpdateCustomerOrderMutation,
  useDeleteCustomerOrderMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useGetProductPhotoByProductIdQuery,
  useGetProductOrdersByProductIdQuery,
  useCreateProductOrderMutation,
  useDeleteProductOrderMutation,
} = api;
