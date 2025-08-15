"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCustomerOrderMutation } from "@/state/api";
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
  // jamb size- change to enum
});

type Product = {
  type: string;
  color: string;
  height: number;
  width: number;
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
    //  add product to order summary
    console.log("Submitting form with values:", values);
    setOrderSummary((prev) => [...prev, values]);
    setIsProductOpen(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:px-0 px-4"
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <CustomFormField
            name="type"
            label="Type"
            type="select"
            options={Object.keys(ProductEnum).map((type) => ({
              value: type,
              label: type,
            }))}
          />
          <CustomFormField
            name="color"
            label="Color"
            type="select"
            options={Object.keys(ProductColorEnum).map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <CustomFormField name="height" label="Height" type="number" />
          <CustomFormField name="width" label="Width" type="number" />
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
  invoiceNo: z.coerce.number(), // Converts input to a number and validates
  dateOrdered: z.string().min(1, "Date is required"), // Validates as a non-empty string
  status: z.string().min(1, "Status is required"), // Non-empty string
  customerId: z.coerce.number(), // Converts input to number and validates
  address: z.string().min(1, "Address is required"), // Non-empty string
  name: z.string().min(1, "Name is required"), // Non-empty string
  phone: z.string().min(1, "Phone number is required"), // Non-empty string
  email: z.string().email("Invalid email address"), // Validates as an email
  orderSummary: z.array(productFormSchema).min(1, "A product is required"), // Optional array of strings
  additionalFiles: z.array(z.string()).optional(), // Optional array of strings
});

const Item = ({ type, height, width }) => {
  return (
    <div>
      {type} | {width} x {height}
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
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [isCreateSecondOpen, setIsCreateSecondOpen] = useState(false);
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

  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     console.log("Current form values:", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form]);
  useEffect(() => {
    form.setValue("orderSummary", orderSummary);
  }, [orderSummary, form]);

  useEffect(() => {
    form.setValue("additionalFiles", additionalFiles);
  }, [additionalFiles, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCustomerOrder(values).unwrap();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Customer</h2>
            <CustomFormField name="customerId" label="ID" />
            <CustomFormField name="address" label="Address" />
            <CustomFormField name="name" label="Name" />
            <CustomFormField name="phone" label="Phone" />
            <CustomFormField name="email" label="Email" />
          </div>

          {/* Invoice */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 ">Invoice</h2>
            <CustomFormField
              name="invoiceNo"
              label="Invoice No."
              type="number"
            />
            <CustomFormField
              name="dateOrdered"
              label="Order Date"
              placeholder="MM/D/YY"
            />
            <CustomFormField
              name="status"
              label="Order Status"
              type="select"
              options={Object.keys(OrderStatusEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </div>
        </div>
        <div className=" bg-white shadow-md rounded-2xl pb-1  ">
          <ResponsiveDialog
            isOpen={isCreateSecondOpen}
            setIsOpen={setIsCreateSecondOpen}
            title="Add Product"
            description="Add product to order"
          >
            <CreateProductForm
              setIsProductOpen={setIsCreateSecondOpen}
              setOrderSummary={setOrderSummary}
            />
          </ResponsiveDialog>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 ">
              Order Summary
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

        <div className=" bg-white shadow-md rounded-2xl pb-1  ">
          <h2 className="text-lg font-semibold text-gray-800 ">
            Additional Files
          </h2>
          <hr />
          <CustomFormField
            name="photos"
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
