"use client";

import { MainLayout } from "@/layout/mainLayout";
import { UserTable } from "./components/UserTable";


export default function UserPage({ users }: { users: any[] }) {

  return (
    <>
      <MainLayout title="User">
        <UserTable users={users} />
      </MainLayout>
    </>
  );
}
