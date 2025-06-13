import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductMutation } from "@/state/api";
import { z } from "zod";
import { CustomFormField } from "../Components/FormField";
import { ProductEnum, ProductColorEnum } from "@/lib/constants";

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
    console.log(data);
    await createProduct(formData);
  };

  return (
    <div className="mx-auto pb-5 w-full m-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-700">Add Product</div>
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
            <CustomFormField
              name="name"
              label="type"
              type="select"
              options={Object.keys(ProductEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                name="color"
                label="color"
                type="select"
                options={Object.keys(ProductColorEnum).map((type) => ({
                  value: type,
                  label: type,
                }))}
              />
              <CustomFormField name="price" label="price" />
              <CustomFormField name="quantity" label="quantity" type="number" />
            </div>
          </div>

          {/* Dimensions */}
          <div className="m-5">
            <h2 className="text-lg font-semibold mb-4">Dimensions</h2>
            <div>
              <CustomFormField name="height" label="height" type="number" />
              <CustomFormField name="width" label="width" type="number" />
              <CustomFormField name="length" label="length" type="number" />
            </div>
          </div>


          {/*  Photos */}
          <div className="m-5">
            <h2 className="text-lg font-semibold mb-4">Photos</h2>
            <CustomFormField
              name="photoUrls"
              label="Product Photos"
              type="file"
              accept="image/*"
            />
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

export default AddProducts;
