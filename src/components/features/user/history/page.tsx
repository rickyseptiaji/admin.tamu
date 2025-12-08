"use client";
import { MainLayout } from "@/layout/mainLayout";
import { VisitorTable } from "./components/VisitorTable";
import React, { useEffect } from "react";

export default function VisitorPage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/history");
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
        <VisitorTable data={tableData} isLoading={isLoading} />
      </MainLayout>
    </>
  );
}
