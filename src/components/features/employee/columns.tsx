import { ColumnDef } from "@tanstack/react-table"
import { TableActions } from "../shared/TableActions"


export const employeeColumns: ColumnDef<any>[] = [
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
    accessorKey: "division",
    header: "Division",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        id={row.original.id}
        editPath="/employee/edit"
        deletePath="/employee"
      />
    ),
  },
]
