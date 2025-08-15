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
  useGetCustomerByIdQuery,
  useGetCustomerOrdersQuery,
  useGetProductByIdQuery,
  useGetProductOrdersByInvoiceNoQuery,
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
import IconMenu from "../../../(components)/ui/IconMenu";
import CreateForm from "../../sales/customerOrders/CreateForm";
import { Card } from "@/components/ui/card";
import EditForm from "./customerOrderForms/EditForm";
import DeleteForm from "./customerOrderForms/DeleteForm";
import Link from "next/link";
import { ProductEnum, ProductTypeIcons } from "@/lib/constants";

const ProductCard = ({ productId }) => {
  console.log("🚀 ~ ProductCard ~ productId:", productId);
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(Number(productId));
  console.log("🚀 ~ ProductCard ~ product:", product);
  if (isLoading) {
    return (
      <Card className="mb-2 flex shadow-md flex-row items-center justify-between relative animate-pulse">
        <div className="p-4 text-sm text-gray-400">
          Loading product details...
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="mb-2 flex shadow-md flex-row items-center justify-between relative">
        <div className="p-4 text-sm text-red-500">
          Failed to load product details
        </div>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="mb-2 flex shadow-md flex-row items-center justify-between relative">
        <div className="p-4 text-sm text-gray-400">No product found</div>
      </Card>
    );
  }

  return (
    <Card className="mb-2 flex shadow-md flex-row items-center justify-between p-4 hover:shadow-xl transition duration-200">
      {/* Product Info */}
      <div className="flex flex-col flex-1 space-y-1">
        <span className="text-sm text-gray-700">{product.type}</span>
      </div>

      {/* Price */}
      <div className="text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap">
        ${product.price}
      </div>
    </Card>
  );
};

const Items = ({ invoiceNo, customerId, dateOrdered, status }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    data: customer,
    isError,
    isLoading,
  } = useGetCustomerByIdQuery(Number(customerId));
  const {
    data: productOrders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetProductOrdersByInvoiceNoQuery(Number(invoiceNo));
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !customer) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customer
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
      <Card className=" w-full mb-2 p-6 shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* Row content */}
        <Link href={`/customerOrders/${invoiceNo}`}>
          {/* get customer by id, replace customer id with customer details */}
          <div className="relative w-full  p-4 rounded-lg bg-white">
            {/* Card content */}
            <div className="flex justify-between items-start w-full space-x-6">
              <div className="flex flex-row justify-between space-x-8">
                {/* 1. Customer Info Section */}
                <div className="flex flex-col space-y-1 min-w-[200px]">
                  <div className="text-2xl font-bold">{invoiceNo}</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                </div>

                {/* 2. Order Summary Section (placeholder) */}
                <div className="  w-80    bg-white shadow-md rounded-2xl pb-1 flex flex-col">
                  {/* Header */}
                  <h3 className="text-sm font-medium px-7 pt-5 pb-2">
                    Order Summary
                  </h3>
                  <hr />
                  <div className="flex-1 overflow-auto p-4">
                    {isOrdersLoading && (
                      <p className="text-sm text-gray-400">Loading orders...</p>
                    )}
                    {isOrdersError && (
                      <p className="text-sm text-red-500">
                        Failed to load orders.
                      </p>
                    )}
                    {productOrders?.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No products found for this invoice.
                      </p>
                    )}
                    {productOrders?.map((order) => (
                      <ProductCard productId={order.productId} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Status Section */}
              <div className="flex flex-col items-end text-sm min-w-[120px]">
                <div className="font-medium">
                  {new Date(dateOrdered).toLocaleDateString()}
                </div>
                <div className="text-green-600">{status}</div>
              </div>
            </div>
          </div>
        </Link>
        {/* Dropdown Actions */}
        {/* 4. More Options Button */}
        <div className="absolute right-4 top-4 z-10">
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
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsEditOpen(true)}
              >
                <IconMenu
                  text="Edit"
                  icon={<SquarePen className="h-4 w-4" />}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
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

const sampleProductOrder = {
  orderNo: 9876,
  dateOrdered: "8/13/25",
  type: "Double",
  color: "Black",
  height: 76,
  width: 76,
  jamb: 76,
  invoiceNo: 15765,
  image: [],
  status: "new",
  additionalFiles: [],
};
const CustomerOrdersPage = () => {
  const IconComponent =
    ProductTypeIcons[sampleProductOrder.type as ProductEnum];

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
        title="Invoice"
        description="create customer order"
      >
        <CreateForm setIsOpen={setIsCreateOpen} />
      </ResponsiveDialog>

      {/* Filters Bar */}
      {/* <Card className="mb-2 p-1 flex shadow-md flex-row items-center justify-between space-x-1 relative hover:shadow-xl duration-200 transition-all"> */}
      <div className="relative w-full p-1 flex justify-end rounded-lg hover:bg-gray-50 transition">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 flex items-center justify-center rounded-md bg-white shadow-md hover:bg-gray-100"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {/* </Card> */}

      {/* List of Orders */}
      {orders?.map((order) => (
        <Items key={order.invoiceNo} {...order} />
      ))}

      {/* Card */}
      <Card className=" w-full mb-2 p-6 shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* get customer by id, replace customer id with customer details */}
        <div className="relative w-full  p-4 rounded-lg bg-white">
          {/* Card content */}
          <div className="flex justify-between items-start w-full space-x-6">
            <div className="flex flex-row justify-between space-x-8">
              {/* ID */}
              <div>001</div>
              <div className="font-medium">
                {new Date(sampleProductOrder.dateOrdered).toLocaleDateString()}
              </div>
              {/* Product Detail Section */}
              <div>
                {IconComponent && <IconComponent size={18} color="#4B5563" />}{" "}
              </div>
              <div> {sampleProductOrder.type}</div>
              <div>74in</div>
              <div>96in</div>
              <div>9in</div>

              {/* Invoice order and store */}
              <div className="">{sampleProductOrder.invoiceNo}</div>
              <div className="">Store 1</div>
              {/* 3. Status Section */}
              <div className="flex flex-col items-end text-sm min-w-[120px]">
                <div className="text-green-600">
                  {sampleProductOrder.status}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 4. More Options Button */}
        <div className="absolute right-4 top-4 z-10">
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
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsEditOpen(true)}
              >
                <IconMenu
                  text="Edit"
                  icon={<SquarePen className="h-4 w-4" />}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
      {/* Card */}
      <Card className=" w-full mb-2 p-6 shadow-md relative hover:shadow-xl duration-200 transition-all">
        {/* get customer by id, replace customer id with customer details */}
        <div className="relative w-full  p-4 rounded-lg bg-white">
          {/* Card content */}
          <div className="flex justify-between items-start w-full space-x-6">
            <div className="flex flex-row justify-between space-x-8">
              {/* ID */}
              <div>002</div>
              <div className="font-medium">
                {new Date(sampleProductOrder.dateOrdered).toLocaleDateString()}
              </div>
              {/* Product Detail Section */}
              <div>
                {IconComponent && <IconComponent size={18} color="#4B5563" />}{" "}
              </div>
              <div> {sampleProductOrder.type}</div>
              <div>74in</div>
              <div>96in</div>
              <div>9in</div>

              {/* Invoice order and store */}
              <div className="">15766</div>
              <div className="">Store 1</div>
              {/* 3. Status Section */}
              <div className="flex flex-col items-end text-sm min-w-[120px]">
                <div className="text-green-600">
                  {sampleProductOrder.status}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 4. More Options Button */}
        <div className="absolute right-4 top-4 z-10">
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
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsEditOpen(true)}
              >
                <IconMenu
                  text="Edit"
                  icon={<SquarePen className="h-4 w-4" />}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full justify-start flex rounded-md p-2 hover:bg-neutral-100"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  );
};

export default CustomerOrdersPage;
