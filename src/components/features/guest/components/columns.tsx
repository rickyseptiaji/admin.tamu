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
