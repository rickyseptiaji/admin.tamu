import { DataTable } from "@/components/features/shared/data-table"
import { MainLayout } from "@/layout/mainLayout"
import data from "../dashboard/data.json"


export default function Page() {
  // This is the main dashboard page
  return (
    <MainLayout title="Create Employee">
      <DataTable data={data} />
    </MainLayout>
  )
}
