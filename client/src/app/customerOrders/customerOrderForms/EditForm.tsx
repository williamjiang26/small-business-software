"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateCustomerOrderMutation,
  useGetCustomerOrderByIdQuery,
  useUpdateCustomerOrderMutation,
} from "@/state/api";
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

const EditForm = ({
  cardId,
  setIsOpen,
}: {
  cardId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const { data: customerOrder, isLoading: isCustomerOrderLoading } =
    useGetCustomerOrderByIdQuery(Number(cardId));
  const [updateCustomerOrder] = useUpdateCustomerOrderMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: 0,
      dateOrdered: "",
      customerId: 0,
      status: "CREATEORDER",
    },
  });

  useEffect(() => {
    if (customerOrder) {
      form.reset({
        status: customerOrder.status,
      });
    }
  }, [customerOrder, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        dateOrdered: new Date(values.dateOrdered).toISOString(), // Convert to ISO
      };
      await updateCustomerOrder(payload).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update customer order", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
                Saving...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditForm;
