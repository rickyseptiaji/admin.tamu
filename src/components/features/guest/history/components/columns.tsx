import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "../../../shared/TableActions";

export const visitorGuestColumns: ColumnDef<any>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row, table }) =>
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      row.index +
      1,
  },
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "employee.fullName",
    header: "Employee Name",
    cell: ({ row }) => row.original.employee?.fullName ?? "-",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "user.fullName",
    header: "Visitor Name",
    cell: ({ row }) => row.original.user?.fullName ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => row.original.createdAt ?? "-",
  },

  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => (
  //     <TableActions
  //       id={row.original.id}
  //       editPath="/employee/edit"
  //       deletePath="employee"
  //     />
  //   ),
  // },
];
