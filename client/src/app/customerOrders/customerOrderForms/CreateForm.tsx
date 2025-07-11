"use client";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCustomerOrderMutation } from "@/state/api";
import { CustomFormField } from "@/app/Components/FormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OrderStatusEnum } from "@/lib/constants";

const formSchema = z.object({
  invoiceNo: z.coerce.number(),
  dateOrdered: z.string().min(1),
  customerId: z.coerce.number(),
  status: z.string().min(1),
});
const CreateForm = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [createCustomerOrder] = useCreateCustomerOrderMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: 0,
      dateOrdered: "",
      customerId: 0,
      status: "CREATEORDER",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.dateOrdered) {
        throw new Error("Order date is required");
      }
      const parts = values.dateOrdered.split("/");
      if (parts.length !== 3) {
        throw new Error("Invalid date format");
      }
      const [month, day, year] = parts.map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(Date.UTC(fullYear, month - 1, day)).toISOString();

      const payload = {
        ...values,
        dateOrdered: date,
      };

      console.log(payload);
      await createCustomerOrder(payload).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create customer order", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <CustomFormField name="invoiceNo" label="Invoice No." type="number" />
        <CustomFormField name="dateOrdered" label="Order Date" placeholder="MM/D/YY"/>
        <CustomFormField name="customerId" label="customerID" />
        <CustomFormField
          name="status"
          label="Order Status"
          type="select"
          options={Object.keys(OrderStatusEnum).map((type) => ({
            value: type,
            label: type,
          }))}
        />
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
};

export default CreateForm;
