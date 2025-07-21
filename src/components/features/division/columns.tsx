import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "../shared/TableActions";

export const divisionColums: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Division Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        id={row.original.id}
        editPath="/division/edit"
        deletePath="/division"
      />
    ),
  },
];
