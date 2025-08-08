"use client";
import { MoreVertical, Trash2, SquarePen, Plus } from "lucide-react";
import { useState } from "react";
import { useGetCustomersQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../../(components)/ui/ResponsiveDialog";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "../../(components)/ui/IconMenu";
import EditForm from "./customerForms/EditForm";
import DeleteForm from "./customerForms/DeleteForm";
import CreateForm from "./customerForms/CreateForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

      {/* product orders */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.id}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption> List of customers</TableCaption>
      </Table>
    </div>
  );
};

export default Customers;
