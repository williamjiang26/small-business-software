"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ProductEnum, ProductTypeIcons } from "@/lib/constants";
import ResponsiveDialog from "@/app/(components)/ui/ResponsiveDialog";
import { useState } from "react";
import CreateForm from "../customerOrders/CreateForm";
import {
  useGetAuthUserQuery,
  useGetCustomerByIdQuery,
  useGetCustomerOrdersQuery,
  useGetProductByProductOrderIdQuery,
  useGetProductOrdersByInvoiceNoQuery,
} from "@/state/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMenu from "@/app/(components)/ui/IconMenu";
import { useRouter } from "next/navigation"; // for App Router

const ProductOrder = ({ id }) => {
  console.log("🚀 ~ ProductOrder ~ id:", id);
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByProductOrderIdQuery(id);
  const IconComponent = ProductTypeIcons[product?.type as ProductEnum];
  return (
    <div className="flex flex-row space-x-1 items-center">
      <div>{IconComponent && <IconComponent size={18} color="#4B5563" />}</div>
      <div>
        {product?.height} x {product?.width}
      </div>
      <div> - {product?.color}</div>
    </div>
  );
};

const Item = ({
  invoiceNo,
  createdAt,
  dateOrdered,
  customerId,
  status,
  measurementPdf,
  customerCopyPdf,
}) => {
  // get customer info by customerID
  const {
    data: customer,
    isLoading,
    isError,
  } = useGetCustomerByIdQuery(customerId);

  const {
    data: productOrders,
    isLoading: isProductOrdersLoading,
    isError: isProductOrdersLoadingError,
  } = useGetProductOrdersByInvoiceNoQuery(invoiceNo);
  console.log("🚀 ~ Item ~ productOrders:", productOrders);
  const router = useRouter();

  // now handle UI states
  if (isLoading || isProductOrdersLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !customer || isProductOrdersLoadingError || !productOrders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customers
      </div>
    );
  }

  return (
    <Card className=" w-full mb-2 p-1 relative hover:shadow-xl duration-200 transition-all">
      <div className="flex flex-row justify-between space-x-8 relative w-full  p-4 rounded-lg bg-white">
        <div>
          <div className="font-semibold text-lg">{invoiceNo}</div>
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

        <div className="flex flex-col">
          Order Summary
          <hr />
          {productOrders?.map((order) => (
            <ProductOrder key={order.productId} id={order.productId} />
          ))}
        </div>

        <div>
          <div className=""> {new Date(dateOrdered).toLocaleDateString()}</div>
          <div className="">Sales Rep</div>
        </div>

        <div className="flex flex-row  text-sm min-w-[120px] space-x-2">
          <div className="text-green-600">{status}</div>
        </div>

        <div className="">
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
                onClick={() =>
                  router.push(`/sales/customerOrders/${invoiceNo}`)
                }
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
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};
const Page = () => {
  const {
    data: customerOrders,
    isLoading,
    isError,
  } = useGetCustomerOrdersQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !customerOrders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Customers
      </div>
    );
  }

  return (
    <div>
      <div>
        Header Bar{" "}
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
      <div>
        <Tabs defaultValue="all">
          <TabsList className="">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="new">New Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            {customerOrders
              ?.filter((order) => order.status !== "INSTOCK")
              .map((order) => (
                <Item key={order.id} {...order} />
              ))}
          </TabsContent>
          <TabsContent value="all">
            {customerOrders
              ?.filter((order) => order.status === "INSTOCK")
              .map((order) => (
                <Item key={order.id} {...order} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
