"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { CustomFormField } from "@/app/Components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateCustomerMutation } from "@/state/api";
import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";

// form schema
const formSchema = z.object({
  id: z.coerce.number(),
  address: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
});

const CreateForm = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [createCustomer] = useCreateCustomerMutation();

  // form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      address: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  // isloading
  const isLoading = form.formState.isSubmitting;

  // useeffect

  // submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCustomer(values).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create customer", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <CustomFormField name="id" label="id" type="number" />
        <CustomFormField name="address" label="address" />
        <CustomFormField name="name" label="name" />
        <CustomFormField name="phone" label="phone" />
        <CustomFormField name="email" label="email" />
        <div className="flex w-full sm:justify-end mt-4">
          <Button type="submit">
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
};

export default CreateForm;
