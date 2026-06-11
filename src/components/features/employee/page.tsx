"use client";
import { MainLayout } from "@/layout/mainLayout";
import { EmployeeTable } from "./components/EmployeeTable";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function EmployeeClient({
  initialEmployee,
}: {
  initialEmployee: any[];
}) {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR("/api/employee", fetcher, {
    fallbackData: initialEmployee,
  });
  return (
    <MainLayout title="Employee">
      <EmployeeTable  data={data} isLoading={isLoading} mutate={mutate} />
    </MainLayout>
  );
}