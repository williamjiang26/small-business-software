"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../(components)/FormField";
import {
  useGetProductOrderByOrderNoQuery,
  useUpdateProductOrderMutation,
} from "@/state/api";
// import { ProductEnum, ProductColorEnum } from "@/lib/constants";

const formSchema = z.object({
  orderNo: z.coerce.number(),
  productId: z.coerce.number(),
  dateOrdered: z.string().min(1),
  dateStocked: z.string().min(1),
  dateSold: z.string().min(1),
  section: z.coerce.number(),
  row: z.coerce.number(),
  customerInvoice: z.coerce.number(),
});

export default function EditForm({
  orderNo,
  setIsOpen,
}: {
  orderNo: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: productOrder, isLoading: isProductLoading } =
    useGetProductOrderByOrderNoQuery(Number(orderNo));
  const [updateProductOrder] = useUpdateProductOrderMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNo: 0,
      productId: 0,
      dateOrdered: "",
      dateStocked: "",
      dateSold: "",
      section: 0,
      row: 0,
      customerInvoice: 0,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (productOrder) {
      form.reset({
        orderNo: productOrder.orderNo,
        productId: productOrder.productId,
        dateOrdered: new Date(productOrder.dateOrdered).toLocaleDateString(),
        dateStocked: new Date(productOrder.dateStocked).toLocaleDateString(),
        dateSold: new Date(productOrder.dateSold).toLocaleDateString(),
        section: productOrder.section,
        row: productOrder.row,
        customerInvoice: productOrder.customerInvoice,
      });
    }
  }, [productOrder, form]);

  const isLoading = form.formState.isSubmitting;
  if (isProductLoading || !productOrder) return <div>Loading product...</div>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProductOrder({
        orderNo: orderNo,
        data: {
          customerInvoice:
            values.customerInvoice === 0 ? null : values.customerInvoice,
          productId: values.productId,
          dateOrdered: new Date(values.dateOrdered),
          dateSold: new Date(values.dateSold),
          dateStocked: new Date(values.dateStocked),
          section: values.section,
          row: values.row,
        },
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
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField name="orderNo" label="Order No." type="number" />
        <input
          type="hidden"
          {...form.register("productId", { valueAsNumber: true })}
        />
        <CustomFormField name="dateOrdered" label="Date Ordered" />
        <CustomFormField name="section" label="Section" type="number" />
        <CustomFormField name="row" label="Row" type="number" />
        <CustomFormField name="dateStocked" label="Date Stocked" />
        <CustomFormField name="dateSold" label="Date Sold" />
        <CustomFormField
          name="customerInvoice"
          label="Customer Invoice"
          type="number"
        />

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
}
