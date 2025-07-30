"use client";

import { MainLayout } from "@/layout/mainLayout";
import { DivisionTable } from "./components/DivisionTable";
import React, { useEffect } from "react";

export default function DivisionPage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/division");
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  return (
    <MainLayout title="Division">
      <DivisionTable data={tableData} isLoading={isLoading} />
    </MainLayout>
  );
}