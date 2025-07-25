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
import {
  useGetProductPhotoByProductIdQuery,
  useGetProductsQuery,
} from "@/state/api";
import { MoreVertical, SquarePen, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import IconMenu from "../../Components/ui/IconMenu";
import ResponsiveDialog from "../../Components/ui/ResponsiveDialog";
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
      <Card className="mb-2 p-1 flex shadow-md flex-row items-center justify-between space-x-1 relative hover:shadow-xl duration-200 transition-all">
        <div className="relative w-full p-1 flex justify-between rounded-lg  bg-white hover:bg-gray-50 transition">
          <Link href={`/products/${id}`} className="block">
            <div className="flex items-center justify-between w-full overflow-x-auto space-x-4">
              {/* 1. ID */}
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                {id}
              </span>

              {/* 2. Image */}
              <div
                key={productPhotoUrls[0].id}
                className="w-20 h-20 rounded overflow-hidden bg-gray-200 flex-shrink-0"
              >
                <img
                  src={productPhotoUrls[0].url}
                  alt="item"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 3. Type */}
              <span className="text-sm text-gray-700 whitespace-nowrap">
                {type}
              </span>

              {/* 4. Color */}
              <span className="text-sm text-gray-700 whitespace-nowrap">
                {color}
              </span>

              {/* 5. Size: H x W x L */}
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {height} x {width} x {length}
              </div>

              {/* 6. Price */}
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                ${price}
              </span>
            </div>
          </Link>
          {/* 7. More Dropdown */}
          <div className="absolute  right-1 top-2 z-10">
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
                <DropdownMenuItem
                  className="flex justify-start rounded-md p-2 hover:bg-neutral-100"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <IconMenu
                    text="Delete"
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </>
  );
};

const ProductsPage = () => {
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

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
