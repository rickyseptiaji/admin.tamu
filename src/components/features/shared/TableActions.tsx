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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TableActionsProps = {
  id: string | number;
  editPath?: string;
  viewPath?: string;
  requestPath?: string;
  deletePath?: string;
  printPath?: string;
};

export const TableActions = ({
  id,
  editPath,
  viewPath,
  requestPath,
  deletePath,
  printPath,
}: TableActionsProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleView = () => router.push(`${viewPath}/${id}`);
  const handleEdit = () => router.push(`${editPath}/${id}`);
  const handleRequest = () => router.push(`${requestPath}/${id}`);
  const handlePrint = () => router.push(`${printPath}/${id}`);
  const handleDelete = async () => {
    if (!deletePath) return;

    try {
      const res = await fetch(`/api/${deletePath}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          {viewPath && (
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          )}
          {editPath && (
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          )}
          {requestPath && (
            <DropdownMenuItem onClick={handleRequest}>Request</DropdownMenuItem>
          )}
          {printPath && (
            <DropdownMenuItem onClick={handlePrint}>Print</DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-700"
            onClick={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Data yang dihapus tidak dapat dikembalikan.
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

    </>
  );
};
