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
    cell: ({ row }) => row.original.guest?.fullName || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.guest?.email || "-",
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => row.original.guest?.companyName || "-",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.guest?.phone || "-",

  },
  {
    accessorKey: "checkIn",
    header: "Avg Check In",
    cell: ({ row }) => {
      const date = row.original.features.avgCheckInMinute;
      if (date === null || date === undefined) return "-";
      const hours = Math.floor(date / 60);
      const minutes = date % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
  },
  {
    accessorKey: "duration",
    header: "Avg Duration (mnt)",
    cell: ({ row }) =>
      row.original.features.avgDuration !== null &&
      row.original.features.avgDuration !== undefined
        ? row.original.features.avgDuration
        : "-",
  },
  {
    accessorKey: "totalVisits",
    header: "Total Visits",
    cell: ({ row }) =>
      row.original.features.totalVisits !== null &&
      row.original.features.totalVisits !== undefined
        ? row.original.features.totalVisits
        : "-",
  },
  {
    header: "Kategori",
    accessorKey: "category",
    cell: ({ row }) => {
      const totalVisits = row.original.features.totalVisits;
      let kategori = "Tidak ada kunjungan"; 
      if (totalVisits >= 10) kategori = "Sering";
      else if (totalVisits >= 5) kategori = "Sedang";
      else if (totalVisits > 0) kategori = "Jarang";
      return kategori;
    }
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
