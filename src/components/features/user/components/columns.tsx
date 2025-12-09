import { ColumnDef } from "@tanstack/react-table";


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
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    header: "Full Name",
    cell: ({ row }) => row.original.fullName ?? "-",
  },
  {
    header: "Email",
    cell: ({ row }) => row.original.email ?? "-",
  },
  {
    header: "Company Name",
    cell: ({ row }) => row.original.companyName ?? "-",
  },
  {
    header: "No HP",
    cell: ({ row }) => row.original.phone ?? "-",
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
