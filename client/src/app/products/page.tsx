"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import IconMenu from "../Components/ui/IconMenu";
import ResponsiveDialog from "../Components/ui/ResponsiveDialog";
import EditForm from "../Components/forms/EditForm";
import DeleteForm from "../Components/forms/DeleteForm";
import CreateForm from "../Components/forms/CreateForm";

const Items = ({ id, type, size, price }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      {/* Edit and Delete Dialogs */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit"
        description="edit product details"
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
      <Card className="w-full p-6 flex shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* Card Content */}
        <Link href={`/products/${id}`} className="h-full">
          <div className="flex flex-col items-start justify-between flex-1 h-full">
            {id} | {type} | {size} | {price}
          </div>
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

const ProductsPage = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <>
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Create"
        description=""
      >
        <CreateForm setIsOpen={setIsCreateOpen} />
      </ResponsiveDialog>
      <div>
        <Button
          onClick={() => {
            setIsCreateOpen(true);
          }}
        >
          Create
        </Button>
        {/* card */}
        {products?.map((product) => (
          <Items key={product.id} {...product} />
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
