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
import { Package, SquareUser, ReceiptText, CalendarRange } from "lucide-react";
import TDCLOGO from "../../assets/TDClogo.png";
import Image from "../../../node_modules/next/image";
import { Button } from "@/components/ui/button";
import Link from "../../../node_modules/next/link";

const AppSidebar = ({
  userType,
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  // menu items
  const items =
    userType === "manager"
      ? [
          {
            title: "Orders",
            url: "/customerOrders",
            icon: ReceiptText,
          },
          {
            title: "Order Management",
            url: "/confirmOrderDetails",
            icon: SquareUser,
          },
          {
            title: "Deliveries",
            url: "/schedule",
            icon: CalendarRange,
          },
          {
            title: "Products",
            url: "/products",
            icon: Package,
          },
          {
            title: "Customers",
            url: "/customers",
            icon: SquareUser,
          },
          // {
          //   title: "Leads",
          //   url: "/",
          //   icon: ReceiptText,
          // },

          {
            title: "Revenue & Costs",
            url: "/schedule",
            icon: CalendarRange,
          },
        ]
      : [
          {
            title: "Orders",
            url: "/customerOrders",
            icon: ReceiptText,
          },
          {
            title: "Deliveries",
            url: "/schedule",
            icon: CalendarRange,
          },
          {
            title: "Products",
            url: "/products",
            icon: Package,
          },
        ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
              {items.slice(0, 3).map((item) => (
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
          <SidebarGroupLabel>V2 Storage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.slice(3, 5).map((item) => (
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
          <SidebarGroupLabel>V3 Books</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.slice(5, 6).map((item) => (
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
