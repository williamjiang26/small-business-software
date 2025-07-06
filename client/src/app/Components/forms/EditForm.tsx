"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./FormField";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/state/api";

const formSchema = z.object({
  type: z.string().min(1),
  size: z.string().min(1),
  price: z.coerce.number(),
});

export default function EditForm({
  cardId,
  setIsOpen,
}: {
  cardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(
    Number(cardId)
  );
  const [updateProduct] = useUpdateProductMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      size: "",
      price: 0,
    },
  });

  // When product data is loaded, reset the form
  useEffect(() => {
    if (product) {
      form.reset({
        type: product.type,
        size: product.size,
        price: product.price,
      });
    }
  }, [product, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProduct({
        id: product.id,
        data: values,
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isProductLoading || !product) return <div>Loading product...</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField name="type" label="Type" />
        <CustomFormField name="size" label="Size" />
        <CustomFormField name="price" label="Price" type="number" />

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
