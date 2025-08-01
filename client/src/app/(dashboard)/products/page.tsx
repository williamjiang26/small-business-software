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
  useGetProductOrdersByProductIdQuery,
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
import ImageCarousel from "@/app/Components/Carousel";

const Items = ({
  id,
  type,
  name,
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
    data: productPhotoUrls = [],
    isError: isPhotoError,
    isLoading: isPhotoLoading,
  } = useGetProductPhotoByProductIdQuery(Number(id));
  console.log("🚀 ~ Items ~ productPhotoUrls:", productPhotoUrls);

  const {
    data: productOrders,
    isError: isOrdersError,
    isLoading: isOrdersLoading,
  } = useGetProductOrdersByProductIdQuery(Number(id));

  if (isPhotoLoading || isOrdersLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isPhotoError || isOrdersError || !productPhotoUrls || !productOrders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch product data
      </div>
    );
  }

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Product"
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
      <Card className="mb-2 flex shadow-md flex-row items-center justify-between relative hover:shadow-xl duration-200 transition-all">
        <div className="relative w-full  flex justify-between rounded-lg space-x-23 bg-white hover:bg-gray-50 transition">
          <Link href={`/products/${id}`} className="block">
            <div className="flex items-center justify-between w-full overflow-x-auto space-x-4">
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                {id} {name}
              </span>
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                {new Date(dateOrdered).toLocaleDateString()}
              </span>
            </div>
          </Link>
          {/* carousel here */}
          <div className=" w-20 h-20 max-w-screen-lg max-h-screen">
            {productPhotoUrls ? (
              <ImageCarousel images={productPhotoUrls} />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No image</span>
              </div>
            )}
          </div>
          <Link href={`/products/${id}`} className="block">
            <div className="flex items-center justify-between w-full overflow-x-auto space-x-4">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                {type}
              </span>
              <span className="text-sm text-gray-700 whitespace-nowrap">
                {color}
              </span>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {height} x {width} x {length}
              </div>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                ${price}
              </span>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {productOrders?.length ?? 0} pcs
              </span>{" "}
            </div>
          </Link>

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
        {/* Filters Bar */}
        <Card className="mb-2 p-1 flex shadow-md flex-row items-center justify-between space-x-1 relative hover:shadow-xl duration-200 transition-all">
          <div className="relative w-full p-1 flex justify-between rounded-lg  bg-white hover:bg-gray-50 transition">
            <div className="flex items-center justify-between w-full overflow-x-auto space-x-4">
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                ID SKU
              </span>
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                Date Ordered
              </span>
              <span className="min-w-[40px] text-sm font-medium text-gray-800">
                Photos
              </span>
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Type
              </span>
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Color
              </span>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Height x Width x Length
              </div>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                Price
              </span>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                QTY
              </span>

              <Button
                variant="ghost"
                className="flex h-6 w-6 p-0 data-[state=open]:bg-muted"
                onClick={() => {
                  setIsCreateOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* cards */}
        {products?.map((product) => {
          console.log("🚀 ~ product:", product);
          return <Items key={product.id} {...product} />;
        })}
      </div>
    </>
  );
};

export default ProductsPage;
