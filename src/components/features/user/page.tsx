"use client";

import { MainLayout } from "@/layout/mainLayout";
import { UserTable } from "./components/UserTable";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";


export default function UserClient({ initialUser }: { initialUser: [] }) {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR("/api/user", fetcher, {
    fallbackData: initialUser,
  });
    return (
    <>
      <MainLayout title="User">
        <UserTable data={data} isLoading={isLoading} mutate={mutate}  />
      </MainLayout>
    </>
  );
}

