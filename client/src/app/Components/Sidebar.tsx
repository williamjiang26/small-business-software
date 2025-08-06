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
import TDCLOGO from "../../assets/TDClogo.png";
import Image from "../../../node_modules/next/image";
import { Button } from "@/components/ui/button";
import Link from "../../../node_modules/next/link";
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

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offcanvas" {...props} >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`/dashboard`}>
                <Image width={40} height={40} src={TDCLOGO} alt="TDC" />
                <span className="text-base text-black font-semibold">
                  TDC Inc.
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>V1 Fulfillment</SidebarGroupLabel>
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
