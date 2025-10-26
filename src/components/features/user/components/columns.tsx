import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "../../shared/TableActions";

export const userColumns: ColumnDef<any>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row, table }) =>
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      row.index +
      1,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullName",
    header: "Employee Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
       cell: ({ row }) => {
      const count = row.original.visitCount;

      if (count > 5) return "Sering";
      if (count >= 3) return "Kadang";
      if (count >= 1) return "Jarang";
      return "Tidak Pernah";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        id={row.original.id}
        editPath="/employee/edit"
        deletePath="employee"
      />
    ),
  },
];
