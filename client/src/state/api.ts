import { createNewUserInDatabase } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      console.log("🚀 ~ session:", session)
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      console.log("Prepared headers:", Object.fromEntries(headers.entries()));

      return headers;
    },
  }),

  reducerPath: "api",
  tagTypes: ["Sales", "CustomerOrders"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          console.log("🚀 ~ userRole:", userRole)
          
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
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),
    getCustomerOrders: build.query<CustomerOrder[], string | void>({
      query: (search) => ({
        url: "/sales/customerOrders",
        params: search ? { search } : {},
      }),
      providesTags: ["CustomerOrders"],
    }),
    createCustomerOrder: build.mutation<CustomerOrder, CustomerOrder>({
      query: (newCustomerOrder) => ({
        url: "/customerOrders",
        method: "POST",
        body: newCustomerOrder,
      }),
      invalidatesTags: ["CustomerOrders"],
    }),
  }),
});

export const { useGetAuthUserQuery, useGetCustomerOrdersQuery } = api;
