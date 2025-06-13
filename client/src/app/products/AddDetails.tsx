import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductMutation } from "@/state/api";
import { z } from "zod";
import { CustomFormField } from "../Components/FormField";

const formSchema = z.object({
  createdAt: z.string().optional(),
  dateOrdered: z.string().optional(),
  section: z.coerce.number().positive().min(0).int(),
  row: z.coerce.number().positive().min(0).int(),
  productId: z.coerce.number().positive().min(0).int(),
});

const AddDetails = ({ onClose }) => {
  const [createProduct] = useCreateProductMutation();
  const now = new Date().toISOString();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      createdAt: now,
      dateOrdered: "",
      section: 0,
      row: 0,
      productId: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "productId") return;
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    console.log(data);
    await createProduct(formData);
  };

  return (
    <div className="mx-auto pb-5 w-full m-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-700">Add Details</div>
        {/* Add Product */}
        <Button onClick={onClose}>Close</Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Validation failed:", errors);
          })}
        >
          {/* Basic Info */}
          <div className="m-5">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField name="id" label="ID" type="number" />
              <CustomFormField
                name="dateOrdered"
                label="dateOrdered"
                type="text"
              />
              <CustomFormField name="section" label="section" type="number" />
              <CustomFormField name="row" label="row" type="number" />
            </div>
          </div>

          {/* Submit */}
          <div className="m-5">
            <Button
              type="submit"
              className="bg-primary-700 text-black w-full mt-8"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddDetails;
