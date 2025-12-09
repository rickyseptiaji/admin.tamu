import { ColumnDef } from "@tanstack/react-table";


export const guestColumns: ColumnDef<any>[] = [
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
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "phone",
    header: "Phone",
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
