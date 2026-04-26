"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Format } from "@/types/response/format.response";
import { useEditFormatMutation } from "@/features/format";

interface EditFormatModalProps {
  trigger: React.ReactNode;
  format: Format;
  onSuccess?: () => void;
}

export function EditFormatModal({
  trigger,
  format,
  onSuccess,
}: EditFormatModalProps) {
  const [open, setOpen] = useState(false);
  const [formatCode, setFormatCode] = useState(format.formatCode);
  const [formatName, setFormatName] = useState(format.formatName);
  const editMutation = useEditFormatMutation();

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (val) {
      setFormatCode(format.formatCode);
      setFormatName(format.formatName);
    }
  };

  const onSubmit = () => {
    if (!formatCode.trim() || !formatName.trim()) return;

    editMutation.mutate(
      {
        id: format.id,
        payload: {
          formatCode: formatCode.trim(),
          formatName: formatName.trim(),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa định dạng</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã định dạng</label>
            <Input
              value={formatCode}
              onChange={(e) => setFormatCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên định dạng</label>
            <Input
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={
              !formatCode.trim() ||
              !formatName.trim() ||
              editMutation.isPending ||
              (formatCode === format.formatCode &&
                formatName === format.formatName)
            }
          >
            {editMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
