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
import { useCreateFormatMutation } from "@/features/format/hooks";

interface AddFormatModalProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function AddFormatModal({ trigger, onSuccess }: AddFormatModalProps) {
  const [open, setOpen] = useState(false);
  const [formatCode, setFormatCode] = useState("");
  const [formatName, setFormatName] = useState("");
  const createMutation = useCreateFormatMutation();

  const onSubmit = () => {
    if (!formatCode.trim() || !formatName.trim()) return;

    createMutation.mutate(
      {
        formatCode: formatCode.trim(),
        formatName: formatName.trim(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormatCode("");
          setFormatName("");
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm định dạng mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã định dạng</label>
            <Input
              placeholder="Mã (vd: HB, PB, EB)"
              value={formatCode}
              onChange={(e) => setFormatCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên định dạng</label>
            <Input
              placeholder="Tên (vd: Bìa mềm, E-book)"
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
              createMutation.isPending
            }
          >
            {createMutation.isPending ? "Đang thêm..." : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
