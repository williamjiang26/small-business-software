import { createNewUserInDatabase } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser, AuthUser } from "aws-amplify/auth";

export interface Sales {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
}
export interface Manager {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface User {
  cognitoInfo: AuthUser;
  userInfo: Sales | Manager;
  userRole: string;
}
export interface Customer {
  id: number;
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface ProductOrder {
  productOrderId: number;
  productId?: number;
  orderNo?: number;
  customerInvoice?: number;
  dateOrdered: Date;
  section?: number;
  row?: number;
  dateStocked?: Date;
  dateSold?: Date;
}
export interface ProductDetails {
  id?: number;
  name?: string;
  dateOrdered?: Date;
  type?: string;
  color?: string;
  height?: number;
  width?: number;
  length?: number;
  price?: number;
}

export interface CustomerOrderResponse {
  id: number;
  invoiceNo: number;
  createdAt: Date;
  address: string;
  name: string;
  phone: string;
  email: string;
  dateOrdered: Date;
  customerId: number;
  status: string;
  measurementPdf: string;
  customerCopyPdf: string;
}
export interface CustomerOrderCreate {
  invoiceNo: number;
  dateOrdered: Date;
  address: string;
  name: string;
  phone: string;
  email: string;
  customerId: number;
  status: string;
  measurementPdf?: string;
  customerCopyPdf?: string;
  additionalFiles?: string;
  orderSummary: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      console.log("Prepared headers:", Object.fromEntries(headers.entries()));

      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Sales",
    "CustomerOrders",
    "Customers",
    "ProductOrders",
    "ProductDetails",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          console.log("🚀 ~ userRole:", userRole);

          const endpoint =
            userRole === "manager"
              ? `/manager/${user.userId}`
              : `/sales/${user.userId}`;

          let userDetailsResponse = await fetchWithBQ(endpoint);

          // if user doesn't exist, create new user
          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Sales | Manager,
              userRole,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR", // RTK allows string here
              error:
                error instanceof Error
                  ? error.message
                  : "Could not fetch user data",
            },
          };
        }
      },
    }),
    getCustomerOrders: build.query<CustomerOrderResponse[], string | void>({
      query: (search) => ({
        url: "/sales/customerOrders",
        params: search ? { search } : {},
      }),
      providesTags: ["CustomerOrders"],
    }),
    getCustomerOrdersManager: build.query<
      CustomerOrderResponse[],
      string | void
    >({
      query: (search) =>
        `/manager/customerOrders${search ? `?search=${search}` : ""}`,
      providesTags: ["CustomerOrders"],
    }),

    createCustomerOrder: build.mutation<
      CustomerOrderResponse,
      CustomerOrderCreate
    >({
      query: (formData) => ({
        url: "/sales/customerOrders",
        method: "POST",
        body: formData, // pass FormData directly
      }),
      invalidatesTags: ["CustomerOrders"],
    }),

    updateCustomerOrder: build.mutation<
      CustomerOrderResponse,
      { invoiceNo: number; data: FormData }
    >({
      query: ({ invoiceNo, data }) => ({
        url: `/sales/customerOrders/updateInvoice/${invoiceNo}`,
        method: "PUT",
        body: data, // pass FormData directly
      }),
      invalidatesTags: ["CustomerOrders"],
    }),

    getCustomerById: build.query<Customer, number>({
      query: (id) => `/sales/customer/${id}`,
      providesTags: ["Customers"],
    }),
    getProductOrdersByInvoiceNo: build.query<ProductOrder[], number>({
      query: (invoiceNo) => `/sales/productOrders/invoice/${invoiceNo}`,
      providesTags: ["ProductOrders"],
    }),
    getProductByProductOrderId: build.query<ProductDetails, number>({
      query: (productId) => `/sales/product/${productId}`,
      providesTags: ["ProductDetails"],
    }),
    updateCustomerOrdersManager: build.mutation<
      CustomerOrderResponse,
      { invoiceNo: number; data: Partial<CustomerOrderResponse> }
    >({
      query: ({ invoiceNo, data }) => ({
        url: `/manager/customerOrders/invoice/${invoiceNo}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
    getInvoiceDetailsByInvoiceNo: build.query<CustomerOrderResponse, number>({
      query: (invoiceNo) => `/sales/customerOrders/invoice/${invoiceNo}`,
      providesTags: ["CustomerOrders"],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetCustomerOrdersQuery,
  useGetCustomerOrdersManagerQuery,
  useCreateCustomerOrderMutation,
  useUpdateCustomerOrderMutation,
  useGetCustomerByIdQuery,
  useGetProductOrdersByInvoiceNoQuery,
  useGetProductByProductOrderIdQuery,
  useUpdateCustomerOrdersManagerMutation,
  useGetInvoiceDetailsByInvoiceNoQuery,
} = api;
