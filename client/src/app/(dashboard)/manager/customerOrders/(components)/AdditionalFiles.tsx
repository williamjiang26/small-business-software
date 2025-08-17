// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { CustomFormField } from "@/app/(components)/FormField";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { useCreateCustomerMutation } from "@/state/api";
// import { Dispatch, SetStateAction } from "react";
// import { Loader2 } from "lucide-react";

// const formSchema = z.object({
//   pdf: z.array(z.instanceof(File)).min(1, "At least two photos are required"),
// });

// const AdditionalFiles = () => {
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//     } catch (error) {
//       console.error("Failed to create customer", error);
//     }
//   };

//   // form
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       pdf: [],
//     },
//   });

//   return (
//     <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-1 flex flex-col">
//       {/* Header */}
//       <h3 className="text-lg font-medium px-7 pt-5 pb-2">Additional Files</h3>
//       <hr />

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col space-y-2 sm:px-0 px-4"
//         >
//           <CustomFormField
//             name="photos"
//             label="Images"
//             type="file"
//             accept="image/*"
//           />
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default AdditionalFiles;
