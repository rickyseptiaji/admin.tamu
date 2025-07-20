import { MainLayout } from "@/layout/mainLayout";
import { DivisionTable } from "@/components/features/division/DivisionTable";

export default function Page() {
  return (
    <MainLayout title="Division">
      <DivisionTable />
    </MainLayout>
  );
}