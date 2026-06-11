"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { MainLayout } from "@/layout/mainLayout";
import { DivisionTable } from "./components/DivisionTable";

export default function DivisionClient({
  initialDivisions,
}: {
  initialDivisions: any[];
}) {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR("/api/division", fetcher, {
    fallbackData: initialDivisions,
  });

  return (
    <MainLayout title="Division">
      <DivisionTable
        data={data}
        isLoading={isLoading}
        mutate={mutate}
      />
    </MainLayout>
  );
}