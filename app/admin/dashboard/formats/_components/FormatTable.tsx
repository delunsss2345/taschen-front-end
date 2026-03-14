"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableHeaderCell, TableRow } from "@/components/table";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Format } from "@/types/response/format.response";
import {
  useDeleteFormatMutation,
} from "@/features/format";
import { EditFormatModal } from "./EditFormatModal";

interface FormatTableProps {
  formats: Format[];
  isLoading?: boolean;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function FormatTable({
  formats,
  isLoading,
  onEditSuccess,
  onDeleteSuccess,
}: FormatTableProps) {
  const deleteMutation = useDeleteFormatMutation();

  const handleDelete = (fmt: Format) => {
    deleteMutation.mutate(fmt.id, {
      onSuccess: () => {
        onDeleteSuccess?.();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (formats.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Chưa có định dạng nào</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-24">ID</TableHeaderCell>
            <TableHeaderCell>Mã định dạng</TableHeaderCell>
            <TableHeaderCell>Tên định dạng</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">
              Thao tác
            </TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {formats.map((fmt) => (
            <TableRow key={fmt.id}>
              <TableCell>{fmt.id}</TableCell>
              <TableCell>{fmt.formatCode}</TableCell>
              <TableCell>{fmt.formatName}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditFormatModal
                    format={fmt}
                    onSuccess={onEditSuccess}
                    trigger={
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        Sửa
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1 px-3 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p className="text-sm text-gray-600">
                        Bạn có chắc chắn muốn xóa định dạng{" "}
                        <span className="font-medium">{fmt.formatName}</span>?
                        Hành động này không thể hoàn tác.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(fmt);
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
