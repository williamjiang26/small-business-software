"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/state/api";
import { z } from "zod";
import { CustomFormField } from "../../../Components/FormField";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required"),
  // profile: z.array(z.instanceof(File)).min(1, "At least one photo is required"),
});

const EditForm = ({
  cardId,
  setIsOpen,
}: {
  cardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: customer, isLoading: isCustomerLoading } =
    useGetCustomerByIdQuery(Number(cardId));

  console.log(customer);

  const [updateCustomer] = useUpdateCustomerMutation();
  // const now = new Date().toISOString();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  // When customer data is loaded, reset the form
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
      });
    }
  }, [customer, form]);

  const isLoading = form.formState.isSubmitting;
  if (isCustomerLoading || !customer) return <div>Loading customer...</div>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateCustomer({
        id: customer.id,
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
        {/* Basic Info */}
        <div className="m-5">
          <h2 className="text-lg font-semibold mb-4"> Customer Information </h2>
          <div className="grid grid-cols-1 gap-4">
            <CustomFormField name="name" label="name" />
            <CustomFormField name="address" label="address" />
            <CustomFormField name="email" label="email" />
            <CustomFormField name="phone" label="phone" />
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="bg-primary-700 text-black w-full mt-8">
          Update
        </Button>
      </form>
    </Form>
  );
};

export default EditForm;
