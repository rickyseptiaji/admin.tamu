"use client";

import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect, useState } from "react";
import { DataUserTable } from "./components/UserTable";

export default function UserPage() {

  return (
    <>
      <MainLayout title="Data User">
        <DataUserTable/>
      </MainLayout>
    </>
  );
}
