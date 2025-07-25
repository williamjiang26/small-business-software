"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../Components/FormField";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/state/api";
import { ProductEnum, ProductColorEnum } from "@/lib/constants";

const formSchema = z.object({
  id: z.coerce.number(),
  type: z.string().min(1),
  color: z.string().min(1),
  height: z.coerce.number(),
  width: z.coerce.number(),
  length: z.coerce.number(),
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
  console.log(product);

  const [updateProduct] = useUpdateProductMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      type: "",
      color: "",
      height: 0,
      width: 0,
      length: 0,
      price: 0,
    },
  });

  // When product data is loaded, reset the form
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id,
        type: product.type,
        color: product.color,
        height: product.height,
        width: product.width,
        length: product.length,
        price: product.price,
      });
    }
  }, [product, form]);

  const isLoading = form.formState.isSubmitting;
  if (isProductLoading || !product) return <div>Loading product...</div>;

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField name="id" label="Id" type="number" />
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
        <CustomFormField name="height" label="Height" type="number" />
        <CustomFormField name="width" label="Width" type="number" />
        <CustomFormField name="length" label="Length" type="number" />
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
