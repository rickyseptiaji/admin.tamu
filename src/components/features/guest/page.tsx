"use client";
import { MainLayout } from "@/layout/mainLayout";
import { GuestTable } from "./components/GuestTable";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};
export default function GuestClient({
  guests: initialGuests,
}: {
  guests: any[];
}) {
  const { data } = useSWR("/api/guest", fetcher, {
    fallbackData: initialGuests,
    refreshInterval: 5000,
  });

  return <GuestPage guests={data} />;
}

function GuestPage({ guests }: { guests: any }) {
  return (
    <>
      <MainLayout title="Guest">
        <GuestTable guests={guests} />
      </MainLayout>
    </>
  );
}
