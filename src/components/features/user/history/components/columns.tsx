import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "../../../shared/TableActions";
import { formatDate } from "@/hooks/formatDate";

export const visitorUserColumns: ColumnDef<any>[] = [
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
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ row }) => {
      const checkIn = row.original.checkIn;
      formatDate(checkIn);
      return formatDate(checkIn);
    },
  },
    {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ row }) => {
      const checkOut = row.original.checkOut;
      formatDate(checkOut);
      return formatDate(checkOut);
    },
  },
    {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.duration;
      return duration ? `${duration} minutes` : "-";
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        id={row.original.id}
        editPath="/user/history/"
        deletePath="user/history"
      />
    ),
  },
];
