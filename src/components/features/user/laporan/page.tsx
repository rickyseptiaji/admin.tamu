"use client";

import { MainLayout } from "@/layout/mainLayout";
import { LaporanUserTable } from "./components/UserTable";


export default function LaporanUserPage() {

  return (
    <>
      <MainLayout title="Laporan User">
        <LaporanUserTable/>
      </MainLayout>
    </>
  );
}
