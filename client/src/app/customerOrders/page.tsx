"use client";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  FilePlus2,
  SquarePen,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useGetCustomerOrdersQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../Components/ui/ResponsiveDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "../Components/ui/IconMenu";
import CreateForm from "./customerOrderForms/CreateForm";
import { Card } from "@/components/ui/card";
import EditForm from "./customerOrderForms/EditForm";
import DeleteForm from "./customerOrderForms/DeleteForm";

const Items = ({ invoiceNo, customerId, dateOrdered, status }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <>
      {/* Edit and Delete Dialogs */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit"
        description="edit order details"
      >
        <EditForm cardId={invoiceNo} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete"
        description=""
      >
        <DeleteForm cardId={invoiceNo} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      {/* Card */}
      <Card className="w-full mb-2 p-6 flex shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* Row content */}
        {customerId} | {invoiceNo} |{" "}
        {new Date(dateOrdered).toLocaleDateString()} | {status}
        {/* Dropdown Actions */}
        <div className="absolute right-4 top-4 z-10">
          <span>
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
                  className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  onClick={() => setIsEditOpen(true)}
                >
                  <IconMenu
                    text="Edit"
                    icon={<SquarePen className="h-4 w-4" />}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <IconMenu
                    text="Delete"
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </div>
      </Card>
    </>
  );
};

const CustomerOrdersPage = () => {
  const { data: orders, isLoading, isError } = useGetCustomerOrdersQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Create"
        description=""
      >
        <CreateForm setIsOpen={setIsCreateOpen} />
      </ResponsiveDialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="">Customer | Invoice No. | Date Ordered | Status</div>
        <Button
          onClick={() => {
            setIsCreateOpen(true);
          }}
        >
          <FilePlus2 className="h-4 w-4" />
        </Button>
      </div>

      {/* List of Orders */}
      {orders?.map((order) => (
        <Items key={order.invoiceNo} {...order} />
      ))}
    </div>
  );
};

export default CustomerOrdersPage;
