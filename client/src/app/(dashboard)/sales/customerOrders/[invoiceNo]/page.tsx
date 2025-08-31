"use client";
import {
  useCreateCustomerOrderMutation,
  useGetInvoiceDetailsByInvoiceNoQuery,
  useUpdateCustomerOrderMutation,
} from "@/state/api";
import React, { useCallback, useEffect } from "react";
import Link from "../../../../../../node_modules/next/link";
import { ArrowLeft, MapPin, Phone, User, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderSummary from "../OrderSummary";
import { CustomFormField } from "@/app/(components)/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  // Files
  measurementPdf: z.array(z.instanceof(File)).optional(), // single file
  customerCopyPdf: z.array(z.instanceof(File)).optional(), // single file
  additionalFiles: z.array(z.instanceof(File)).optional(), // multiple files
});

const Page = ({ params }: { params: { invoiceNo: number } }) => {
  const { invoiceNo } = params;
  const [updateCustomerOrder, { isLoading: isUpdating }] =
    useUpdateCustomerOrderMutation();
  const {
    data: invoiceDetails,
    isLoading,
    isError,
  } = useGetInvoiceDetailsByInvoiceNoQuery(invoiceNo);
  console.log("🚀 ~ Page ~ invoiceDetails:", invoiceDetails);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      measurementPdf: [],
      customerCopyPdf: [],
      additionalFiles: [],
    },
  });

  const isLoading2 = form.formState.isSubmitting;

  const onSubmit = useCallback(
    async ({
      measurementPdf,
      customerCopyPdf,
      additionalFiles,
    }: z.infer<typeof formSchema>) => {
      try {
        const formData = new FormData();

        if (measurementPdf?.length)
          formData.append("measurementPdf", measurementPdf[0]);
        if (customerCopyPdf?.length)
          formData.append("customerCopyPdf", customerCopyPdf[0]);
        additionalFiles?.forEach((file) =>
          formData.append("additionalFiles", file)
        );

        await updateCustomerOrder({ invoiceNo, data: formData }).unwrap();
        console.log("✅ Uploaded successfully");
      } catch (error) {
        console.error("❌ Failed to update customer order:", error);
      }
    },
    [updateCustomerOrder, invoiceNo]
  );

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (
        ["measurementPdf", "customerCopyPdf", "additionalFiles"].includes(
          name || ""
        )
      ) {
        form.handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  // ✅ UI states must live here, not inside onSubmit
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to Fetch Invoice Details
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="flex justify-between">
        <Link
          href="/sales/customerOrders"
          className="mb-6 flex flex-row items-center space-x-1 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 duration-200 transition-all"
          />
          <span>Back</span>
        </Link>
        <Button className="bg-white text-black hover:text-white">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      <div className="flex justify-between items-start w-full">
        <div>
          <div className="text-xl font-bold">{invoiceNo}</div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4" /> <div>{invoiceDetails?.address}</div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4" />
            <div>{invoiceDetails?.phone}</div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4" />
            <div>{invoiceDetails?.name}</div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4" />
            <div>{invoiceDetails?.email}</div>
          </div>
        </div>
        <div>
          <div>
            {new Date(invoiceDetails?.createdAt ?? "").toLocaleDateString()}
          </div>
          <div className="text-green-500">{invoiceDetails?.status}</div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 sm:px-0">
        {/* Left column: Order summary */}
        <OrderSummary invoiceDetails={invoiceDetails} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6 sm:px-0 px-4 w-full "
          >
            <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-1 flex flex-col">
              {/* Header */}
              <h3 className="text-lg font-medium px-7 pt-5 pb-2">
                Measurement PDF
              </h3>
              <hr />
              {invoiceDetails?.measurementPdf ? (
                <iframe
                  src={invoiceDetails.measurementPdf}
                  width="100%"
                  height="400"
                  title="Measurement PDF"
                />
              ) : (
                <CustomFormField
                  name="measurementPdf"
                  label=""
                  type="file-single"
                  accept="image/*"
                />
              )}
            </div>
            <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-1 flex flex-col">
              {/* Header */}
              <h3 className="text-lg font-medium px-7 pt-5 pb-2">
                Customer Signature
              </h3>
              <hr />
              {invoiceDetails?.customerCopyPdf ? (
                <iframe
                  src={invoiceDetails.customerCopyPdf}
                  width="100%"
                  height="400"
                  title="Customer Copy PDF"
                />
              ) : (
                <CustomFormField
                  name="customerCopyPdf"
                  label=""
                  type="file-single"
                  accept="image/*"
                />
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
