"use client";

import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect, useState } from "react";
import { UserTable } from "./components/UserTable";


export default function UserPage() {

  return (
    <>
      <MainLayout title="User">
        <UserTable/>
      </MainLayout>
    </>
  );
}
