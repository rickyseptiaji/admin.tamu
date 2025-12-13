"use client";
import { MainLayout } from "@/layout/mainLayout";
import { VisitorGuestTable } from "./components/VisitorTable";
import React, { useEffect } from "react";

export default function VisitorGuestPage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/guest/history");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <MainLayout title="History">
        <VisitorGuestTable data={tableData} isLoading={isLoading} />
      </MainLayout>
    </>
  );
}
