"use client";
import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect } from "react";
import { GuestTable } from "./components/GuestTable";

export default function GuestPage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
    const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/guest");
      if (!response.ok) {
        throw new Error("Failed to fetch guest data");
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching guest data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  },[])
  return (
    <>
      <MainLayout title="Guest">
        <GuestTable data={tableData} isLoading={isLoading} />
      </MainLayout>
    </>
  );
}
