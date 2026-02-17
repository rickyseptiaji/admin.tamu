"use client";
import { MainLayout } from "@/layout/mainLayout";
import { EmployeeTable } from "./components/EmployeeTable";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};
export default function EmployeeClient({
  employees: initialEmployees,
}: {
  employees: any[];
}) {
  const { data } = useSWR("/api/employee", fetcher, {
    fallbackData: initialEmployees,
    refreshInterval: 5000,
  });

  return <EmployeePage employees={data} />;
}

 function EmployeePage({ employees }: { employees: any }) {

  return (
    <MainLayout title="Employee">
      <EmployeeTable  data={employees} isLoading={false} />
    </MainLayout>
  );
}
