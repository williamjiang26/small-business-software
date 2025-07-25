"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../Components/FormField";
import {
  useGetCustomerOrderByIdQuery,
  useUpdateCustomerOrderMutation,
} from "@/state/api";
import { OrderStatusEnum } from "@/lib/constants";

const formSchema = z.object({
  invoiceNo: z.coerce.number(),
  dateOrdered: z.string().min(1),
  customerId: z.coerce.number(),
  status: z.string().min(1),
});

export default function EditForm({
  cardId,
  setIsOpen,
}: {
  cardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: customerOrder, isLoading: isCustomerOrderLoading } =
    useGetCustomerOrderByIdQuery(Number(cardId));
  console.log(customerOrder);
  const [updateCustomerOrder] = useUpdateCustomerOrderMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: 0,
      dateOrdered: "",
      customerId: 0,
      status: "",
    },
  });
  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log("Form values changed:", values);
    });

    return () => subscription.unsubscribe(); // Cleanup
  }, [form]);

  useEffect(() => {
    if (customerOrder) {
      form.reset({
        invoiceNo: customerOrder.invoiceNo,
        dateOrdered: customerOrder.dateOrdered,
        customerId: customerOrder.customerId,
        status: customerOrder.status,
      });
    }
  }, [customerOrder, form]);

  const isLoading = form.formState.isSubmitting;
  if (isCustomerOrderLoading || !customerOrder)
    return <div>Loading product...</div>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("submitted", values);
      await updateCustomerOrder({
        invoiceNo: customerOrder.invoiceNo,
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
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField
          name="status"
          label="Status"
          type="select"
          control={form.control}
          placeholder="Select a status"
          options={Object.keys(OrderStatusEnum).map((type) => ({
            value: type,
            label: type,
          }))}
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
