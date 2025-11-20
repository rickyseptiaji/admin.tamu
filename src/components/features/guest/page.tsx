"use client";
import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect } from "react";
import { GuestTable } from "./components/GuestTable";

export default function GuestPage() {
  return (
    <>
      <MainLayout title="Guest">
        <GuestTable/>
      </MainLayout>
    </>
  );
}
