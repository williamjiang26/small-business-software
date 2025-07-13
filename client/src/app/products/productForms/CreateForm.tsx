"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../../Components/FormField";
import { useCreateProductMutation } from "@/state/api";
import { ProductEnum, ProductColorEnum } from "@/lib/constants";

const formSchema = z.object({
  id: z.coerce.number(),
  type: z.string().min(1),
  color: z.string().min(1),
  height: z.coerce.number(),
  width: z.coerce.number(),
  length: z.coerce.number(),
  price: z.coerce.number(),
  photos: z.array(z.instanceof(File)).min(1, "At lease one photo is required"),
});

export default function CreateForm({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [createProduct] = useCreateProductMutation();

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
      photos: [],
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      formData.append("id", values.id);
      formData.append("type", values.type.toString());
      formData.append("color", values.color.toString());
      formData.append("height", values.height);
      formData.append("width", values.width);
      formData.append("length", values.length);
      formData.append("price", values.price);

      for (const file of values.photos) {
        formData.append("photos", file); // name must match `upload.array("photos")`
      }

      await createProduct(formData).unwrap();
    } catch (error) {
      console.error("Failed to create product", error);
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
          name="photos"
          label="Images"
          type="file"
          accept="image/*"
        />
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
