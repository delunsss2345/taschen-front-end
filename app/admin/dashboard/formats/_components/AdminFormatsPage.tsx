"use client";

import { FormatHeader } from "./FormatHeader";
import { FormatTable } from "./FormatTable";
import { useFormatsQuery } from "@/features/format";

export function AdminFormatsPage() {
  const {
    data: formats = [],
    isPending: isLoading,
    refetch,
  } = useFormatsQuery();

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
