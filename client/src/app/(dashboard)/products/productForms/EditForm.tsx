"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../../(components)/FormField";
import {
  useGetProductByIdQuery,
  useGetProductPhotoByProductIdQuery,
  useUpdateProductMutation,
} from "@/state/api";
import {
  ProductEnum,
  ProductColorEnum,
  ProductOrderStatusEnum,
} from "@/lib/constants";

const formSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1),
  type: z.string().min(1),
  color: z.string().min(1),
  height: z.coerce.number(),
  width: z.coerce.number(),
  length: z.coerce.number(),
  price: z.coerce.number(),
  status: z.string().min(1),
  photos: z.array(z.instanceof(File)).optional(),
});

export default function EditForm({
  cardId,
  setIsOpen,
}: {
  cardId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(
    Number(cardId)
  );
  const { data: productPhotoUrls } = useGetProductPhotoByProductIdQuery(
    Number(cardId)
  );
  const photoUrls = productPhotoUrls.map((p) => p.url);

  const [updateProduct] = useUpdateProductMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      type: "",
      name: "",
      color: "",
      height: 0,
      width: 0,
      length: 0,
      price: 0,
      status: "",
      photos: [],
    },
  });

  // When product data is loaded, reset the form
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id,
        type: product.type,
        name: product.name,
        color: product.color,
        height: product.height,
        width: product.width,
        length: product.length,
        price: product.price,
        status: product.status,
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:px-0 px-4"
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
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
          <CustomFormField name="name" label="Name" />
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
          <CustomFormField name="length" label="Length" type="number" />
          <CustomFormField name="price" label="Price" type="number" />
        </div>

        <CustomFormField
          name="photos"
          label="Images"
          type="file"
          accept="image/*"
        />
        <CustomFormField
          name="status"
          label="Status"
          type="select"
          placeholder="Select a status"
          options={Object.keys(ProductOrderStatusEnum).map((type) => ({
            value: type,
            label: type,
          }))}
        />

        {/* SUBMIT BUTTON - aligned right on larger screens */}
        <div className="sm:col-span-2 flex sm:justify-end">
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
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
