import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCustomerMutation } from "@/state/api";
import { z } from "zod";
import { CustomFormField } from "../Components/forms/FormField";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required"),
  // profile: z.array(z.instanceof(File)).min(1, "At least one photo is required"),
});

const AddCustomer = ({ onClose }) => {
  const [createCustomer] = useCreateCustomerMutation();
  const now = new Date().toISOString();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdAt: now,
      updatedAt: now,
      name: "",
      address: "",
      phone: "",
      email: "",
      profile: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // if (key === "productId") return;
      if (key === "profile") {
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
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(data)
    await createCustomer(formData);
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
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <CustomFormField name="name" label="name" />
              <CustomFormField name="address" label="address" />
              <CustomFormField name="email" label="email" />
              <CustomFormField name="phone" label="phone" />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="bg-primary-700 text-black w-full mt-8"
          >
            Add Customer
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCustomer;
