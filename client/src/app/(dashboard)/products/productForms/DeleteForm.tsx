"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDeleteProductMutation } from "@/state/api";

export default function DeleteForm({
  cardId,
  setIsOpen,
}: {
  cardId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      console.log(cardId)
      await deleteProduct(Number(cardId)).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="w-full flex justify-center sm:space-x-6">
      <Button
        size="lg"
        variant="outline"
        disabled={isLoading}
        className="w-full hidden sm:block"
        type="button"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button
        size="lg"
        onClick={handleDelete}
        disabled={isLoading}
        className="w-full bg-red-500 hover:bg-red-400"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting
          </>
        ) : (
          <span>Delete</span>
        )}
      </Button>
    </div>
  );
}
