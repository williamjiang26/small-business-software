"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./FormField";
import { useCreateProductMutation } from "@/state/api";

const formSchema = z.object({
  id: z.coerce.number(),
  type: z.string().min(1),
  size: z.string().min(1),
  price: z.coerce.number(),
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
      size: "",
      price: 0,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createProduct(values).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField name="id" label="Id" />
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
