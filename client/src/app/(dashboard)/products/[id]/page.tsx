"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Plus, SquarePen, Trash2 } from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetProductOrdersByProductIdQuery,
  useGetProductPhotoByProductIdQuery,
} from "@/state/api";
import ImageCarousel from "@/app/Components/Carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/app/Components/ui/ResponsiveDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "@/app/Components/ui/IconMenu";
import CreateForm from "../productOrderForms/CreateForm";
import DeleteForm from "../productOrderForms/DeleteForm";
import EditForm from "../productOrderForms/EditForm";

const ProductDetails = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(Number(id));
  const {
    data: productPhotoUrls,
    isError2,
    isLoading2,
  } = useGetProductPhotoByProductIdQuery(Number(id)); // this returns a list of s3 urls
  const {
    data: productOrders,
    // isError2,
    // isLoading2,
  } = useGetProductOrdersByProductIdQuery(Number(id)); // this returns a list of s3 urls

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading || isLoading2) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || isError2 || !product || !productPhotoUrls) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch product or photoUrl
      </div>
    );
  }
  return (
    <div>
      <Link
        href="/products"
        className="mb-6 flex flex-row items-center space-x-1 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 duration-200 transition-all"
        />
        <span>Back</span>
      </Link>
      {/* Product details header block */}
      <div className="flex justify-between items-start w-full">
        {/* Left side: image + description */}
        <div className="flex items-start space-x-4">
          {/* Image mosaic */}
          <ImageCarousel images={productPhotoUrls} />
          {/* Product description */}
          <div className="flex flex-col justify-between">
            <div className="text-xl font-extrabold">{product.type}</div>
            <div>{product.color}</div>
            <div>
              {product.height}x{product.width}x{product.length}
            </div>
            <div>${product.price}</div>
          </div>
        </div>

        {/* Right side: ID + Date */}
        <div className="text-right">
          <div className="text-xl font-extrabold">{product.id}</div>
          <div>{new Date(product?.dateOrdered).toLocaleDateString()}</div>
        </div>
      </div>
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Create"
        description=""
      >
        <CreateForm setIsOpen={setIsCreateOpen} productId={product.id} />
      </ResponsiveDialog>

      {/* <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit"
        description=""
      >
        <EditForm setIsOpen={setIsEditOpen} cardId={product.id} />
      </ResponsiveDialog> */}

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
      {/* product orders */}
      <Table>
        <TableCaption> List of orders that are in stock.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order No.</TableHead>
            <TableHead>Date Ordered</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Row</TableHead>
            <TableHead>Date Stocked</TableHead>
            <TableHead>Date Sold</TableHead>
            <TableHead>Customer Invoice?</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productOrders?.map((productOrder) => (
            <TableRow>
              <ResponsiveDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                title="Delete"
                description=""
              >
                <DeleteForm
                  setIsOpen={setIsDeleteOpen}
                  cardId={productOrder.orderNo}
                />
              </ResponsiveDialog>
              <TableCell className="font-medium">
                {productOrder.orderNo}
              </TableCell>
              <TableCell>
                {new Date(productOrder?.dateOrdered).toLocaleDateString()}
              </TableCell>
              <TableCell>{productOrder.section}</TableCell>
              <TableCell>{productOrder.row}</TableCell>
              <TableCell>
                {new Date(productOrder?.dateStocked).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(productOrder?.dateSold).toLocaleDateString()}
              </TableCell>
              <TableCell>{productOrder.customerInvoice}</TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductDetails;
