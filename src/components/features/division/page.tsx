"use client";

import { MainLayout } from "@/layout/mainLayout";
import { DivisionTable } from "./components/DivisionTable";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function DivisionClient({
  divisions: initialDivisions,
}: {
  divisions: any[];
}) {
  const { data } = useSWR("/api/division", fetcher, {
    fallbackData: initialDivisions,
    refreshInterval: 5000,
  });
  return <DivisionPage divisions={data} />;
}
function DivisionPage({ divisions }: { divisions: any }) {
  return (
    <MainLayout title="Division">
      <DivisionTable data={divisions} isLoading={false} />
    </MainLayout>
  );
}
