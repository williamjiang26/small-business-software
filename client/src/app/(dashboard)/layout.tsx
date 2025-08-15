"use client";
import Navbar from "../(components)/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { NAVBAR_HEIGHT } from "@/lib/constants";
import AppSidebar from "../(components)/Sidebar";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "../../../node_modules/next/navigation";
import { useEffect, useState } from "react";
import Header from "../(components)/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/sales")) ||
        (userRole === "sales" && pathname.startsWith("/manager"))
      ) {
        router.push(
          userRole === "manager" ? "/manager/dashboard" : "/sales/dashboard",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <>Loading...</>;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <main className="flex">
          <AppSidebar userType={authUser.userRole.toLowerCase()} />
          <div className="flex-grow transition-all duration-300">
            <Header />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
