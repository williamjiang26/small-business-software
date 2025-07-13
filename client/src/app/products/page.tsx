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
import { useGetProductPhotoByProductIdQuery, useGetProductsQuery } from "@/state/api";
import { MoreVertical, SquarePen, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import IconMenu from "../Components/ui/IconMenu";
import ResponsiveDialog from "../Components/ui/ResponsiveDialog";
import EditForm from "./productForms/EditForm";
import DeleteForm from "./productForms/DeleteForm";
import CreateForm from "./productForms/CreateForm";

const Items = ({
  id,
  type,
  dateOrdered,
  color,
  height,
  width,
  length,
  price,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    data: productPhotoUrls,
    isError,
    isLoading,
  } = useGetProductPhotoByProductIdQuery(Number(id)); // this returns a list of s3 urls

  console.log("🚀 ~ productPhotoUrls:", productPhotoUrls);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !productPhotoUrls) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch photoUrl
      </div>
    );
  }

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
      <Card className="mb-2 p-4 flex shadow-md flex-row items-center justify-between space-x-1 relative hover:shadow-xl duration-200 transition-all">
        <Link href={`/products/${id}`}>
          {/* Row Content */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="min-w-[30px] text-sm">{id}</span>
            <div className="flex gap-2 flex-wrap py-4">
              {productPhotoUrls.map((photo) => (
                <div
                  key={photo.id}
                  className="w-12 h-12 bg-black overflow-hidden rounded"
                >
                  <img
                    src={photo.url}
                    alt="item"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="whitespace-nowrap text-sm">
              {new Date(dateOrdered).toLocaleDateString()}
            </span>
            <span className="whitespace-nowrap text-sm">{type}</span>
            <span className="whitespace-nowrap text-sm">{color}</span>
            <span className="whitespace-nowrap text-sm">{height}</span>
            <span className="whitespace-nowrap text-sm">{width}</span>
            <span className="whitespace-nowrap text-sm">{length}</span>
            <span className="whitespace-nowrap text-sm">{price}</span>
          </div>
        </Link>

        {/* Dropdown Actions */}
        <div className="absolute right-2 top-2 z-10">
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
                <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        {/* card */}
        {products?.map((product) => (
          <Items key={product.id} {...product} />
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
