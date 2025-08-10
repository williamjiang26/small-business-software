"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../(components)/Header";
import AppSidebar from "../(components)/Sidebar";

import StoreProvider, { useAppSelector } from "../../state/redux";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-white">
        <Header />
        {children}
      </SidebarInset>
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
