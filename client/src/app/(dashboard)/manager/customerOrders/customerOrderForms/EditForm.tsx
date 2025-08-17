"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../../(components)/FormField";
import { useUpdateCustomerOrdersManagerMutation } from "@/state/api";
import {
  ProductColorEnum,
  ProductEnum,
  ProductOrderStatusEnum,
} from "@/lib/constants";

const formSchema = z.object({
  // storeNo:
  status: z.string().min(1),
  type: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1),
  width: z.coerce.number(),
  height: z.coerce.number(),
  length: z.coerce.number(),
  // price: z.coerce.number(),
  orderNo: z.coerce.number(),
  productId: z.coerce.number(),
  productOrderId: z.coerce.number(),
  // measurement pdf
  // customercopy pdf
  // additional files
});

// if status is processing edit all fields

const EditForm = ({ order, setIsOpen }) => {
  const [updateCustomerOrder] = useUpdateCustomerOrdersManagerMutation(
    order?.customerInvoice
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: order?.status ?? "",
      type: order?.type ?? "",
      name: order?.name ?? "",
      color: order?.color ?? "",
      height: order?.height ?? 0,
      width: order?.width ?? 0,
      length: order?.length ?? 0,
      orderNo: order?.orderNo ?? 0,
      productId: order?.productId ?? 0,
      productOrderId: order?.productOrderId ?? 0,
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log("Form values changed:", values);
    });

    return () => subscription.unsubscribe(); // Cleanup
  }, [form]);

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status ?? "",
        type: order.type ?? "",
        name: order.name ?? "",
        color: order.color ?? "",
        height: order.height ?? 0,
        width: order.width ?? 0,
        length: order.length ?? 0,
        orderNo: order.orderNo ?? "",
        productId: order?.productId ?? "",
        productOrderId: order.productOrderId ?? "",
      });
    }
  }, [order, form]);

  const isLoading = form.formState.isSubmitting;
  if (isLoading || !order) return <div>Loading product...</div>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("submitted", values);
      await updateCustomerOrder({
        invoiceNo: order.customerInvoice,
        data: values,
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-y-10 sm:px-0 px-4 w-full "
      >
        {/* Invoice */}
        <div className="flex flex-row">
          <div></div>
          <div className="flex flex-col ml-auto">
            <div className=" flex items-center  flex-col ">
              <div className="">Invoice No:</div>
              <div className="font-semibold text-red-500">
                {order.customerInvoice}
              </div>
            </div>

            <div className="flex flex-row space-x-1 items-center ">
              <div className="">Date: </div>
              <div>{new Date(order.dateOrdered).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        {/* product details */}
        <div className="flex flex-row gap-1">
          <div className="  w-full flex flex-col">Drop image template</div>
          <div className="  w-full flex flex-col ">
            <CustomFormField
              name="type"
              label="Type"
              type="select"
              options={Object.keys(ProductEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
            <CustomFormField name="name" label="Style" />
            <CustomFormField
              name="color"
              label="Color"
              type="select"
              options={Object.keys(ProductColorEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
            <div>Glass</div>
            <div>Swing</div>
            <div>Mosquito Net?</div>
          </div>
          <div className="  w-full flex flex-col">
            <CustomFormField name="width" label="Width" type="number" />
            <CustomFormField name="height" label="Height" type="number" />
            <CustomFormField name="length" label="Length" type="number" />
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="w-full">Measurement PDF</div>
          <div className="w-full">Customer Copy</div>
          <div className="w-full">Additional Files</div>
        </div>
        <div className="flex flex-row space-x-10">
          <div className="flex flex-row space-x-10 items-center ">
            <div>Status:</div>
            <CustomFormField
              name="status"
              label=" "
              type="select"
              options={Object.keys(ProductOrderStatusEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </div>{" "}
          <div className="flex flex-row space-x-10 items-center ">
            <div>Order No:</div>
            <CustomFormField name="orderNo" label="" type="number" />
          </div>
        </div>
        <div className="flex w-full sm:justify-end mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditForm;
// if status is not processing only edit status

// if status is finalizaed no edit
