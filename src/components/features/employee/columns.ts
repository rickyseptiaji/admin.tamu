import { ColumnDef } from "@tanstack/react-table"

export const employeeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Employee Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
