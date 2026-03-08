"use client";

import { FormatHeader } from "./FormatHeader";
import { FormatTable } from "./FormatTable";
import { useQueryFormat, useFormats } from "@/features/format";

export function AdminFormatsPage() {
  const { isPending: isLoading, refetch } = useQueryFormat();
  const storeFormats = useFormats();

  const formats = storeFormats ?? [];

  const handleAddSuccess = () => {
    refetch();
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <FormatHeader onSuccess={handleAddSuccess} />
      <FormatTable
        formats={formats}
        isLoading={isLoading}
        onEditSuccess={handleEditSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
