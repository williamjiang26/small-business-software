"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateCustomerOrderMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { CustomFormField } from "@/app/(components)/FormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { OrderStatusEnum, ProductColorEnum } from "@/lib/constants";
import ResponsiveDialog from "@/app/(components)/ui/ResponsiveDialog";
import { ProductEnum } from "@/lib/constants";

const productFormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  color: z.string().min(1),
  height: z.number().min(0.01, "Height must be greater than 0"),
  width: z.number().min(0.01, "Width must be greater than 0"),
  length: z.number().min(0.01, "Width must be greater than 0"),
  price: z.number().min(0.01, "Width must be greater than 0"),
  // jamb size- change to enum
});

type Product = {
  type: string;
  color: string;
  height: number;
  width: number;
  length: number;
  price: number;
};

const CreateProductForm = ({
  setIsProductOpen,
  setOrderSummary,
}: {
  setIsProductOpen: Dispatch<SetStateAction<boolean>>;
  setOrderSummary: Dispatch<SetStateAction<Product[]>>;
}) => {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      type: "",
      color: "",
      height: 0,
      width: 0,
      length: 0,
      price: 0,
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setOrderSummary((prev) => [...prev, values]);
    setIsProductOpen(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-row-4 gap-6 sm:px-0 px-4"
      >
        <div className="flex flex-row">
          <CustomFormField
            name="type"
            label="Type"
            type="select"
            options={Object.keys(ProductEnum).map((type) => ({
              value: type,
              label: type,
            }))}
          />
          <CustomFormField name="width" label="Width" type="number" />
          <CustomFormField name="height" label="Height" type="number" />
          <CustomFormField name="length" label="Length" type="number" />
          <CustomFormField
            name="color"
            label="Color"
            type="select"
            options={Object.keys(ProductColorEnum).map((type) => ({
              value: type,
              label: type,
            }))}
          />
          <CustomFormField name="price" label="Unit Price" type="number" />
        </div>

        {/* SUBMIT BUTTON - adds a produt json to the order summary list*/}
        <div className="sm:col-span-2 flex sm:justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  invoiceNo: z.coerce.number(), // converts input to number
  dateOrdered: z.string().min(1, "Date is required"),
  status: z.string().min(1, "Status is required"),
  customerId: z.coerce.number(),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  orderSummary: z
    .array(productFormSchema)
    .min(1, "At least one product is required"),

  // Files
  measurementPdf: z.array(z.instanceof(File)).optional(), // single file
  customerCopyPdf: z.array(z.instanceof(File)).optional(), // single file
  additionalFiles: z.array(z.instanceof(File)).optional(), // multiple files
});

const Item = ({ type, height, width, length, color, price }) => {
  return (
    <div>
      {type} | {width} x {height} x {length} | {color} | {price}
    </div>
  );
};

const CreateForm = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [createCustomerOrder] = useCreateCustomerOrderMutation();
  const [orderSummary, setOrderSummary] = useState<Product[]>([]);
  const [isCreateSecondOpen, setIsCreateSecondOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();
  console.log("🚀 ~ CreateForm ~ authUser:", authUser);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: 0,
      dateOrdered: "",
      status: "CREATEORDER",
      customerId: 0,
      address: "",
      name: "",
      phone: "",
      email: "",
      orderSummary: [],
      additionalFiles: [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);
  useEffect(() => {
    form.setValue("orderSummary", orderSummary);
  }, [orderSummary, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Only send non-file fields
    const payload: any = {};

    Object.entries(values).forEach(([key, value]) => {
      // Skip file fields
      if (
        ["measurementPdf", "customerCopyPdf", "additionalFiles"].includes(key)
      ) {
        return;
      }
      // Serialize arrays/objects
      if (typeof value === "object") {
        payload[key] = JSON.stringify(value);
      } else {
        payload[key] = value;
      }
    });

    if (authUser?.userRole === "sales") {
      const userInfo = authUser.userInfo;
      if ("storeId" in userInfo) { 
        payload["storeId"] = Number(userInfo.storeId);
        payload["salesId"] = Number(userInfo.id);
      }
    }

    try {
      await createCustomerOrder(payload).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create customer order:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:px-0 px-4 w-full "
      >
        <div className="flex flex-col gap-6">
          {/* Invoice */}
          <div className="flex flex-row">
            <div></div>
            <div className="flex flex-col ml-auto">
              <CustomFormField
                name="invoiceNo"
                label="Invoice No."
                type="number"
              />
              <div className="flex flex-row space-x-10 items-center ">
                <div>Date:</div>
                <CustomFormField
                  name="dateOrdered"
                  label=" "
                  placeholder="MM/D/YY"
                />
              </div>
              <div className="flex flex-row space-x-10 items-center ">
                <div>Status:</div>
                <CustomFormField
                  name="status"
                  label=" "
                  type="select"
                  options={Object.keys(OrderStatusEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-2">
            <div className="col-span-2  ">
              <CustomFormField name="customerId" label="ID" />
            </div>
            <div className="col-span-2 ">
              <CustomFormField name="address" label="Address" />{" "}
            </div>
            <div className="col-span-2  ">
              <CustomFormField name="name" label="Name" />
            </div>
            <div className=" ">
              <CustomFormField name="phone" label="Phone" />
            </div>
            <div className=" ">
              <CustomFormField name="email" label="Email" />
            </div>
          </div>
        </div>
        <div className=" bg-white shadow-md rounded-2xl pb-1  ">
          <ResponsiveDialog
            isOpen={isCreateSecondOpen}
            setIsOpen={setIsCreateSecondOpen}
            title="Add Product"
            description=""
          >
            <CreateProductForm
              setIsProductOpen={setIsCreateSecondOpen}
              setOrderSummary={setOrderSummary}
            />
          </ResponsiveDialog>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 ">
              Type | H x W x J | Color | QTY | Price
            </h2>
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0 flex items-center rounded-md bg-white shadow-md hover:bg-gray-100"
              onClick={() => {
                setIsCreateSecondOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>{" "}
          <hr />
          {/* Contents */}
          <div className="min-h-40">
            {orderSummary.length > 0 ? (
              orderSummary.map((order, index) => (
                <Item key={index} {...order} />
              ))
            ) : (
              <div>No items in this order</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className=" bg-white shadow-md rounded-2xl pb-1  ">
            <h2 className="text-lg font-semibold text-gray-800 ">
              Measurement
            </h2>
            <hr />{" "}
            <CustomFormField
              name="measurementPdf"
              label=""
              type="file-single"
              accept="image/*"
            />{" "}
          </div>
          <div className=" bg-white shadow-md rounded-2xl pb-1  ">
            <h2 className="text-lg font-semibold text-gray-800 ">
              Customer Signature
            </h2>
            <hr />{" "}
            <CustomFormField
              name="customerCopyPdf"
              label=""
              type="file-single"
              accept="image/*"
            />
          </div>
        </div>
        <div className=" bg-white shadow-md rounded-2xl pb-1  ">
          <h2 className="text-lg font-semibold text-gray-800 ">
            Additional Files
          </h2>
          <hr />{" "}
          <CustomFormField
            name="additionalFiles"
            label=""
            type="file"
            accept="image/*"
          />
        </div>
        <div className="flex w-full sm:justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto shadow-lg hover:bg-black hover:text-white bg-white text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateForm;
