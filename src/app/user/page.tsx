import { DataTable } from "@/components/features/shared/data-table";
import data from "../dashboard/data.json";
import { MainLayout } from "@/layout/mainLayout";

export default function Page() {
  return (
    <MainLayout title="Create Employee">
      <DataTable data={data} />
    </MainLayout>
  );
}