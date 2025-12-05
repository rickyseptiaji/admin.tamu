"use client";
import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect } from "react";
import { DataGuestTable } from "./components/GuestTable";

export default function GuestPage() {
  return (
    <>
      <MainLayout title="Data Guest">
        <DataGuestTable/>
      </MainLayout>
    </>
  );
}
