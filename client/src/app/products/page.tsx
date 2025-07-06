"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProductsQuery } from "@/state/api";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import IconMenu from "../Components/ui/IconMenu";
import ResponsiveDialog from "../Components/ui/ResponsiveDialog";
import EditForm from "../Components/forms/EditForm";
import DeleteForm from "../Components/forms/DeleteForm";

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
      >
        <DeleteForm cardId={id} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      {/* Card */}
      <Card className="w-full p-6 flex shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* Card Content */}
        {id} | {type} | {size} | {price} |{/* Dropdown Actions */}
        <div className="">
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreVertical classname="w-4 h-4" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem classname="">
                  <button
                    onClick={() => {
                      setIsEditOpen(true);
                    }}
                    className=""
                  >
                    <IconMenu text="Edit" icon={<SquarePen />} />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem classname="">
                  <button
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className=""
                  >
                    <IconMenu text="Delete" icon={<Trash2 />} />
                  </button>
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
    <div>
      {/* card */}
      {products?.map((product) => (
        <Items key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductsPage;
