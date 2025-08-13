"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../../(components)/FormField";
import { useCreateProductOrderMutation } from "@/state/api";

const formSchema = z.object({
  orderNo: z.coerce.number(),
  dateOrdered: z.string().min(1),
  section: z.coerce.number(),
  row: z.coerce.number(),
  dateStocked: z.string().min(1),
  dateSold: z.string().min(1),
  customerInvoice: z.coerce.number(),
});

export default function CreateForm({
  setIsOpen,
  productId,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  productId: number;
}) {
  const [createProduct] = useCreateProductOrderMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNo: 0,
      dateOrdered: "",
      section: 0,
      row: 0,
      dateStocked: "",
      dateSold: "",
      customerInvoice: 0,
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const ParseDate = (inputedDate: any) => {
    const parts = inputedDate.split("/");
    if (parts.length !== 3) {
      throw new Error("Invalid date format");
    }
    const [month, day, year] = parts.map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    const date = new Date(Date.UTC(fullYear, month - 1, day)).toISOString();
    return date;
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const dateOrdered = ParseDate(values.dateOrdered);
      const dateStocked = ParseDate(values.dateStocked);
      const dateSold = ParseDate(values.dateSold);

      const formData = new FormData();
      formData.append("orderNo", values.orderNo.toString());
      formData.append("dateOrdered", dateOrdered);
      formData.append("section", values.section.toString());
      formData.append("row", values.row.toString());
      formData.append("dateStocked", dateStocked);
      formData.append("dateSold", dateSold);
      formData.append("customerInvoice", values.customerInvoice.toString());

      await createProduct({ productId, formData }).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4 max-h-fit"
      >
        <CustomFormField name="orderNo" label="Order No" type="number" />
        <CustomFormField name="dateOrdered" label="Date Ordered" />
        <CustomFormField name="section" label="section" type="number" />
        <CustomFormField name="row" label="row" type="number" />
        <CustomFormField name="dateStocked" label="Date Stocked" />
        <CustomFormField name="dateSold" label="Date Sold" />
        <CustomFormField name="customerInvoice" label="Customer Invoice" />
        <div className="flex w-full sm:justify-end mt-4">
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
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
