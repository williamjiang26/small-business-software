"use client";
import { CustomFormField } from "@/app/(components)/FormField";
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
const Page = () => {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      type: "",
      color: "",
      height: 0,
      width: 0,
    },
  });
  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    //  add product to order summary
  };
  return (
    <div className="p-5">
      <h3>Customer Order Checkout Page</h3>
      <div className="rounded shadow-md p-5 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row "
          >
            <div className="flex-1 pr-5">image upload and preview</div>
            <div className="w-px bg-gray-300"></div>
            <div className="flex-1 pl-5 flex-col space-y-6">
              <div className="flex flex-row space-x-6">
                <CustomFormField
                  name="invoiceNo"
                  label="Invoice No."
                  type="number"
                />
                <CustomFormField
                  name="invoiceNo"
                  label="Ordered Date"
                  placeholder="8/13/25"
                />
              </div>
              <div className="flex flex-row space-x-6">
                <div className="flex flex-col">
                  <div className="font-semibold text-lg">Product Details</div>
                  <CustomFormField name="type" label="Type" type="number" />
                  <CustomFormField name="invoiceNo" label="Color" />{" "}
                  <CustomFormField
                    name="invoiceNo"
                    label="Finish"
                    type="number"
                  />{" "}
                  <CustomFormField
                    name="invoiceNo"
                    label="Swing"
                    type="number"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-lg">Size</div>
                  <CustomFormField
                    name="invoiceNo"
                    label="Height"
                    type="number"
                  />{" "}
                  <CustomFormField
                    name="invoiceNo"
                    label="Width"
                    type="number"
                  />{" "}
                  <CustomFormField
                    name="invoiceNo"
                    label="Jamb"
                    type="number"
                  />{" "}
                </div>
              </div>
              <div>
                <div className="font-semibold text-lg">Additional Files</div>
                PDF previews
              </div>
              <div className="flex w-full sm:justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto shadow-lg hover:bg-black hover:text-white bg-white text-black"
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
