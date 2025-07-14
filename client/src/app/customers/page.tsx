"use client";
import { MoreVertical, Trash2, SquarePen, Plus } from "lucide-react";
import { useState } from "react";
import { useGetCustomersQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../Components/ui/ResponsiveDialog";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "../Components/ui/IconMenu";
import EditForm from "./customerForms/EditForm";
import DeleteForm from "./customerForms/DeleteForm";
import CreateForm from "./customerForms/CreateForm";

const Items = ({ id, address, name, phone, email }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      {/* Edit and Delete Dialogs */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit"
        description="edit customer details"
      >
        <EditForm cardId={id} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete"
        description=""
      >
        <DeleteForm cardId={id} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      {/* Card */}
      <Card className="w-full mb-2 p-6 flex shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* Row content */}
        <Link href={`/customers/${id}`}>
          {/* get customer by id, replace customer id with customer details */}
          {id} | {address} | {name} | {phone} | {email}
        </Link>
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

const Customers = () => {
  const { data: customers, isError, isLoading } = useGetCustomersQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customers
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full m-6">
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Delete"
        description=""
      >
        <CreateForm setIsOpen={setIsCreateOpen} />
      </ResponsiveDialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex justify-end">
          <Button
            className=""
            onClick={() => {
              setIsCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {customers?.map((customer) => (
        <Items key={customer.id} {...customer}></Items>
      ))}
    </div>
  );
};

export default Customers;
