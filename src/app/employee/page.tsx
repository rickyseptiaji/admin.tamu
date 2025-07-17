import data from "../dashboard/data.json";
import { MainLayout } from "@/layout/mainLayout";
import { EmployeeTable } from "@/components/features/employee/EmployeeTable";

export default function Page() {
  return (
    <MainLayout title="Create Employee">
      <EmployeeTable data={data} />
    </MainLayout>
  );
}