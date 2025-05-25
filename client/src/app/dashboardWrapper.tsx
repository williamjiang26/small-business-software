"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Components/Header";
import AppSidebar from "./Components/Sidebar";

import StoreProvider, { useAppSelector } from "./redux";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex bg-gray-50 text-gray-900 w-full min-h-screen">
        <AppSidebar />
        <div className="flex flex-col w-full h-full py-7 px-9 bg-gray-50 ">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
