"use client";
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
import { useState } from "react";
import {
  useGetInventoryManagerQuery,
  useGetInventorySalesQuery,
} from "@/state/api";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../../../(components)/ui/ResponsiveDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import CreateForm from "../../sales/customerOrders/CreateForm";

import { ProductEnum, ProductTypeIcons } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "../../../../../node_modules/next/image";

const Items = ({ ...product }) => {
  const { id, photos, type, name, color, width, height, length, status } =
    product;
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      {/* <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Product"
        description=" "
      >
        <EditForm order={order} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog> */}

      <div
        className="rounded grid grid-cols-8
       text-md hover:border-2 hover:shadow-xl duration-200 transition-all gap-1 relative"
      >
        {/* <div>{new Date(dateOrdered).toLocaleDateString()}</div> */}
        <div className="col-span-1">{id}</div>
        <div className="col-span-2">
          <Carousel className="relative w-full">
            <CarouselContent>
              {photos && photos.length > 0 ? (
                photos.map((photo, index) => (
                  <CarouselItem key={index} className="relative h-80">
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem key="placeholder">...</CarouselItem>
              )}
            </CarouselContent>
            {/* <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" /> */}
          </Carousel>
        </div>
        <div>{name}</div>
        <div>{type}</div>
        <div>{color}</div>
        <div>
          {width} x {height} x {length}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="bg-green-400 text-white rounded-full w-fit text-sm px-2 py-1">
            {status}
          </span>
          {/* <DropdownMenu>
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
              {/* <DropdownMenuItem
                className="flex justify-start rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </DropdownMenuItem> 
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </>
  );
};
const Products = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: inventory, isLoading, isError } = useGetInventorySalesQuery();
  console.log("🚀 ~ Products ~ inventory:", inventory);
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !inventory) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch inventory{" "}
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div>
        <div className="relative w-full p-1 flex justify-end rounded-lg hover:bg-gray-50 transition">
          <ResponsiveDialog
            isOpen={isCreateOpen}
            setIsOpen={setIsCreateOpen}
            title="Invoice"
            description=" "
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
      <Tabs defaultValue="all">
        <TabsList className="">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="new">New Orders</TabsTrigger>
        </TabsList>{" "}
        <TabsContent value="all">
          {inventory?.map((product) => (
            <Items {...product} />
          ))}
        </TabsContent>{" "}
        <TabsContent value="tracking"></TabsContent>
        <TabsContent value="new"></TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;
