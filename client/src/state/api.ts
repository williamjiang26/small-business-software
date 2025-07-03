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

  customerNotes: string;
  customerCopy: string;
  measurement: string;
  additionalFiles: string;
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

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  reducerPath: "api",
  tagTypes: ["CustomerOrders"],
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
      Product,
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
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useCreateCustomerOrdersMutation,
  useUpdateCustomerOrderMutation,
  useDeleteCustomerOrderMutation,
} = api;
