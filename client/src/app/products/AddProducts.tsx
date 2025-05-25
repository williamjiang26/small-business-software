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
  updatedAt: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  photoUrls: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required"),
  height: z.coerce.number().positive().min(0).int(),
  width: z.coerce.number().positive().min(0).int(),
  length: z.coerce.number().positive().min(0).int(),
  price: z.coerce.number().positive().min(0).int(),
  color: z.string().min(1, "Color is required"),
  rating: z.coerce.number().positive().min(0).int(),
  quantity: z.coerce.number().positive().min(0).int(),
  managerId: z.coerce.number().positive().min(0).int().optional(),
});

const AddProducts = ({ onClose }) => {
  const [createProduct] = useCreateProductMutation();
  const now = new Date().toISOString();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: 0,
      createdAt: now,
      updatedAt: now,
      name: "",
      photoUrls: [],
      height: 0,
      width: 0,
      length: 0,
      price: 0,
      color: "",
      rating: 0,
      quantity: 0,
      managerId: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "productId") return;
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    console.log(data)
    await createProduct(formData);
  };

  return (
    <div>
      <div className="flex justify-end mt-2">
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
            <h2 className="text-lg font-semibold mb-4">Product Description</h2>
            <CustomFormField name="name" label="description" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField name="color" label="color" />
              <CustomFormField name="price" label="price" />
              <CustomFormField name="quantity" label="quantity" type="number" />
            </div>
          </div>

          {/* Dimensions */}
          <div className="m-5">
            <h2 className="text-lg font-semibold mb-4">Product Dimensions</h2>
            <div>
              <CustomFormField name="height" label="height" type="number" />
              <CustomFormField name="width" label="width" type="number" />
              <CustomFormField name="length" label="length" type="number" />
            </div>
          </div>

          {/*  Rating */}
          <div className="m-5">
            <CustomFormField name="rating" label="rating" />
          </div>

          {/*  Photos */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Photos</h2>
            <CustomFormField
              name="photoUrls"
              label="Product Photos"
              type="file"
              accept="image/*"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="bg-primary-700 text-black w-full mt-8"
          >
            Add Product
          </Button>

        </form>
      </Form>
    </div>
  );
};

export default AddProducts;
