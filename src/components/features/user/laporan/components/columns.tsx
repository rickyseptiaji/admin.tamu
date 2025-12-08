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
  {
    accessorKey: "visitCount",
    header: "Visit Count",
  },
  {
    header: "Last Visit",
    cell: ({ row }) => {
      const date = row.original.lastVisit;
      if (!date) return "-";
      const formated = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));
      return formated;
    },
  },
  {
    header: "Kategori",
    cell: ({ row }) => row.original.kategori ?? "-",
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
