import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  quantity: number;
}
export interface NewProduct {
  productId: number;
  name: string;
  photoUrls: string[];
  height: number;
  width: number;
  length: number;
  price: number;
  color: string;
  quantity: number;
  rating: number;
}
export interface Customer {
  customerId: number;
  address: string;
  name: string;
  phone: string;
  email: string;
  profile: string;
}
export interface NewCustomer {
  customerId: number;
  address: string;
  name: string;
  phone: string;
  email: string;
  profile: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  reducerPath: "api",
  tagTypes: ["Products", "Customers"],
  endpoints: (build) => ({
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<Product[], string | void>({
      query: (productId) => ({
        url: "/products",
        method: "DELETE",
        params: productId ? { productId } : {},
      }),
      providesTags: ["Products"],
    }),
    getCustomers: build.query<Customer[], string | void>({
      query: () => ({
        url: "/customers",
      }),
      providesTags: ["Customers"],
    }),
    createCustomer: build.mutation<Customer, NewCustomer>({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
} = api;
