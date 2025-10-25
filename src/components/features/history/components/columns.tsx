import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "../../shared/TableActions";

export const visitorColumns: ColumnDef<any>[] = [
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
    accessorKey: "employeeId",
    header: "Employee Id",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "userId",
    header: "User Id",
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
