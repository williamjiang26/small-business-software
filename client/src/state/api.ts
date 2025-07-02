import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CustomerOrder {
  invoiceNo: number;
  name: string;
  price: number;
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
}
export interface ProductInstance {
  id: number;
  dateOrdered: string;
  section: string;
  row: string;
  productId: number;
}
export interface NewProductInstance {
  id: number;
  dateOrdered: string;
  section: string;
  row: string;
  productId: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  reducerPath: "api",
  tagTypes: ["Products", "Customers"],
  endpoints: (build) => ({
    getCustomerOrders: build.query<CustomerOrder[], string | void>({
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
    createProductInstance: build.mutation<Product, NewProductInstance>({
      query: (newProductInstance) => ({
        url: "/products/${productId}/",
        method: "POST",
        body: newProductInstance,
      }),
      invalidatesTags: ["Products"],
    }),
    getCustomerOrder: build.mutation<Product, NewProductInstance>({
      query: (newProductInstance) => ({
        url: "/products/${productId}/",
        method: "POST",
        body: newProductInstance,
      }),
      invalidatesTags: ["Products"],
    }),
    createProductInstance: build.mutation<Product, NewProductInstance>({
      query: (newProductInstance) => ({
        url: "/products/${productId}/",
        method: "POST",
        body: newProductInstance,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useCreateProductInstanceMutation,
} = api;
