import { User } from "@/state/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  userRole: string,
  userStoreId: number,
  fetchWithBQ: any
) => {
  console.log("🚀 ~ createNewUserInDatabase ~ idToken:", idToken);
  const endpoint = userRole === "manager" ? `/manager/` : `/sales/`;

  const createUserResponse = await fetchWithBQ(
    userRole?.toLowerCase() === "manager"
      ? {
          url: endpoint,
          method: "POST",
          // headers: { Authorization: `Bearer ${idToken}` },
          body: {
            cognitoId: user.userId,
            name: user.username,
            email: idToken?.payload?.email || "",
            phoneNumber: "",
          },
        }
      : {
          url: endpoint,
          method: "POST",
          // headers: { Authorization: `Bearer ${idToken}` },
          body: {
            cognitoId: user.userId,
            name: user.username,
            email: idToken?.payload?.email || "",
            phoneNumber: "",
            storeId: Number(userStoreId),
          },
        }
  );

  if (createUserResponse.error) {
    throw new Error("Failed to create user record");
  }

  return createUserResponse;
};
