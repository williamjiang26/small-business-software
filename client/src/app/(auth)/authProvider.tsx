import { Amplify } from "aws-amplify";
import {
  Authenticator,
  useAuthenticator,
  View,
  Heading,
  RadioGroupField,
  Radio,
  SelectField,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetStoresQuery } from "@/state/api";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your username",
      label: "Username",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="!text-2xl !font-bold">
          TDC
          <span className="text-secondary-500 font-light hover:!text-primary-300">
            MANAGEMENT
          </span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">Welcome!</span> Please sign in to continue
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
      const { data: stores, isLoading, isError } = useGetStoresQuery();
      const [value, setValue] = useState("");
      // type Store = {
      //   id: string;
      //   address: string;
      // };
      
      if (isLoading) {
        return <div className="py-4">Loading...</div>;
      }
    
      if (isError) {
        return (
          <div className="text-center text-red-500 py-4">
            Failed to Fetch stores
          </div>
        );
      }
      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="sales">Sales</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
          <div className="relative w-full">
            <SelectField
              label="Select your store:"
              name="custom:storeId"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full my-store-select"
              isRequired
              errorMessage={validationErrors?.["custom:storeId"]}
              hasError={!!validationErrors?.["custom:storeId"]}
            >
              {!isLoading && stores ? (
                stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.address}
                  </option>
                ))
              ) : (
                <option disabled>Loading stores...</option>
              )}
            </SelectField>
          </div>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Already have an account?
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/sales");

  useEffect(() => {
    if (user && isAuthPage && !pathname.includes("signup")) {
      router.push(`/`);
    }
  }, [user, isAuthPage, router, pathname]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
