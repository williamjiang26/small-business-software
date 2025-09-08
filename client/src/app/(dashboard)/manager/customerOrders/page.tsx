"use client";
import {
  Plus,
  SquarePen,
  MoreVertical,
  Trash2,
  MapPin,
  Phone,
  User,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useGetCustomerOrdersManagerQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../../../(components)/ui/ResponsiveDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "../../../(components)/ui/IconMenu";
import CreateForm from "../../sales/customerOrders/CreateForm";
import { Card } from "@/components/ui/card";
import EditForm from "./customerOrderForms/EditForm";
import DeleteForm from "./customerOrderForms/DeleteForm";
import Link from "next/link";
import { ProductEnum, ProductTypeIcons } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Items = ({ ...order }) => {
  const {
    customerInvoice,
    customerName,
    dateOrdered,
    type,
    width,
    height,
    length,
    name,
    status,
    store,
    measurementPdf,
    customerCopyPdf,
    additionalFiles,
  } = order;
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Product"
        description=" "
      >
        <EditForm order={order} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>

      <div className="rounded grid grid-cols-9 text-md hover:border-2 hover:shadow-xl duration-200 transition-all p-1 relative">
        <div>{new Date(dateOrdered).toLocaleDateString()}</div>
        <div>{type}</div>
        <div>{name}</div>
        <div>img</div>
        <div>
          {width} x {height} x {length}
        </div>
        <div>{customerName}</div>
        <div>{customerInvoice}</div>
        <div>Store: {store}</div>
        <div className="flex items-center justify-between gap-2">
          <span className="bg-green-400 text-white rounded-full w-fit text-sm px-2 py-1">
            {status}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-6 w-6 p-0 data-[state=open]:bg-muted"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] z-50">
              <DropdownMenuItem
                className="flex justify-start rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsEditOpen(true)}
              >
                <IconMenu
                  text="Edit"
                  icon={<SquarePen className="h-4 w-4" />}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                className="flex justify-start rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

const CustomerOrdersPage = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetCustomerOrdersManagerQuery();
  console.log("🚀 ~ CustomerOrdersPage ~ orders:", orders);
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !orders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch orders
      </div>
    );
  }
  return (
    <div>
      <Tabs defaultValue="all">
        <TabsList className="">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="new">New Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          {/* List of new Orders */}
          {orders
            ?.filter((order) => order.status === "PROCESSING")
            .map((order) => (
              <Items key={order.invoiceNo} {...order} />
            ))}
        </TabsContent>
        <TabsContent value="all">
          {orders
            ?.filter((order) => order.status === "DELIVERED")
            .map((order) => (
              <Items key={order.invoiceNo} {...order} />
            ))}
        </TabsContent>
        <TabsContent value="tracking">
          {orders
            ?.filter(
              (order) =>
                order.status !== "PROCESSING" && order.status !== "DELIVERED"
            )
            .map((order) => (
              <Items key={order.invoiceNo} {...order} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerOrdersPage;
