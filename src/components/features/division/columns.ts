import { ColumnDef } from "@tanstack/react-table"

export const divisionColums: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Division Name",
  },
]
