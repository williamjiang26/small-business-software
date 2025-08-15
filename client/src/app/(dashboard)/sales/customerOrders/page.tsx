"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ProductEnum, ProductTypeIcons } from "@/lib/constants";
import ResponsiveDialog from "@/app/(components)/ui/ResponsiveDialog";
import { useState } from "react";
import CreateForm from "../customerOrders/CreateForm";
import { useGetAuthUserQuery, useGetCustomerOrdersQuery } from "@/state/api";

const Item = ({
  invoiceNo,
  createdAt,
  dateOrdered,
  customerId,
  status,
  measurementPdf,
  customerCopyPdf,
}) => {
  return (
    <Card className=" w-full mb-2 p-1 relative hover:shadow-xl duration-200 transition-all">
      {/* Card content */}
      <div className="flex flex-row justify-between space-x-8 relative w-full  p-4 rounded-lg bg-white">
        {/* ID */}
        <div>001</div>
        <div className="font-medium">
          {new Date(dateOrdered).toLocaleDateString()}
        </div>
        {/* Product Detail Section */}
        <div>hth</div>
        <div>{createdAt}</div>
        <div>74in</div>
        <div>96in</div>
        <div>9in</div>

        {/* Invoice order and store */}
        <div className="">{invoiceNo}</div>
        <div className="">Store 1</div>
        {/* 3. Status Section */}
        <div className="flex flex-col items-end text-sm min-w-[120px] text-green-600">
          {status}
        </div>
      </div>
      {/* 4. More Options Button */}
      {/* <div className="absolute right-4 top-4 z-10">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="w-4 h-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] z-50">
        <DropdownMenuItem
          className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
          onClick={() => setIsEditOpen(true)}
        >
          <IconMenu
            text="Edit"
            icon={<SquarePen className="h-4 w-4" />}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
          onClick={() => setIsDeleteOpen(true)}
        >
          <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div> */}
    </Card>
  );
};
const page = () => {
  const {
    data: customerOrders,
    isLoading,
    isError,
  } = useGetCustomerOrdersQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !customerOrders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customers
      </div>
    );
  }
  console.log("🚀 ~ page ~ customerOrdersvvv:", customerOrders);

  return (
    <div>
      <div>
        Header Bar{" "}
        <div className="relative w-full p-1 flex justify-end rounded-lg hover:bg-gray-50 transition">
          <ResponsiveDialog
            isOpen={isCreateOpen}
            setIsOpen={setIsCreateOpen}
            title="Invoice"
            description="create customer order"
          >
            <CreateForm setIsOpen={setIsCreateOpen} />
          </ResponsiveDialog>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md bg-white shadow-md hover:bg-gray-100"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        page content {/* Card */}
        {customerOrders?.map((order) => (
          <Item {...order} />
        ))}
      </div>
    </div>
  );
};

export default page;
