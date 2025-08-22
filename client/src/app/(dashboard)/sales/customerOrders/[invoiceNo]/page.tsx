"use client";
import { useGetInvoiceDetailsByInvoiceNoQuery } from "@/state/api";
import React from "react";
import Link from "../../../../../../node_modules/next/link";
import { ArrowLeft, MapPin, Phone, User, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderSummary from "../OrderSummary";

const Page = ({ params }: { params: { invoiceNo: number } }) => {
  const { invoiceNo } = params;

  const {
    data: invoiceDetails,
    isLoading,
    isError,
  } = useGetInvoiceDetailsByInvoiceNoQuery(invoiceNo);

  // now handle UI states
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
  console.log("🚀 ~ page ~ invoiceDetails:", invoiceDetails);

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

        {/* Right column: PDFs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            {invoiceDetails?.measurementPdf ? (
              <iframe
                src={invoiceDetails.measurementPdf}
                width="100%"
                height="400"
                title="Measurement PDF"
              />
            ) : (
              <>render drop and browse component with delete button</>
            )}
          </div>
          <div>
            {invoiceDetails?.customerCopyPdf ? (
              <iframe
                src={invoiceDetails.customerCopyPdf}
                width="100%"
                height="400"
                title="Customer Signature"
              />
            ) : (
              <>render drop and browse component with delete button</>
            )}
          </div>
        </div>

        <div className="grid grid-cols">
          {/* Folder to hold additional files */}
          {/* <AdditionalFiles /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
