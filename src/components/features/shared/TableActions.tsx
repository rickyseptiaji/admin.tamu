"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TableActionsProps = {
  id: string | number;
  editPath: string;
  deletePath?: string;
};

export const TableActions = ({
  id,
  editPath,
  deletePath,
}: TableActionsProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleEdit = () => router.push(`${editPath}/${id}`);
  const handleDelete = async () => {
    if (!deletePath) return;

    try {
      const res = await fetch(`/api/${deletePath}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
        setOpen(false);
      } else {
        console.log("failed to delete data");
      }
    } catch (error) {
      console.log("error deleted item", error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Edit
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
