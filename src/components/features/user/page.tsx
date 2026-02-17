"use client";

import { MainLayout } from "@/layout/mainLayout";
import { UserTable } from "./components/UserTable";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then(res => res.json());

export default  function UserClient({ users: initialUsers }: { users: any[] }) {
  const { data } = useSWR("/api/user", fetcher, {
    fallbackData: initialUsers,
    refreshInterval: 3000,
  });

  return <UserPage users={data} />;
}

  function UserPage({ users }: { users: any[] }) {

  return (
    <>
      <MainLayout title="User">
        <UserTable users={users} />
      </MainLayout>
    </>
  );
}
