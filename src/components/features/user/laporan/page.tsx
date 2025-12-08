"use client";

import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect, useState } from "react";
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
