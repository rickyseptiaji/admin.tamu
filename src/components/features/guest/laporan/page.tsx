"use client";
import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect } from "react";
import { LaporanGuestTable } from "./components/GuestTable";


export default function LapoanGuestPage() {
  return (
    <>
      <MainLayout title="Laporan Guest">
        <LaporanGuestTable/>
      </MainLayout>
    </>
  );
}
