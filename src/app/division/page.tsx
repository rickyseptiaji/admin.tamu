import { DataTable } from "@/components/features/shared/data-table";
import data from "../dashboard/data.json";
import { MainLayout } from "@/layout/mainLayout";

export default function Page() {
  return (
    <MainLayout title="Division">
      <DataTable data={data} />
    </MainLayout>
  );
}