"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import { Package, SquareUser, ReceiptText } from "lucide-react";

// menu items
const items = [
  {
    title: "Orders",
    url: "/customerOrders",
    icon: ReceiptText,
  },
  {
    title: "Inventory",
    url: "/products",
    icon: Package,
  },
  // {
  //   title: "Leads",
  //   url: "/",
  //   icon: ReceiptText,
  // },
  {
    title: "Customers",
    url: "/customers",
    icon: SquareUser,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
