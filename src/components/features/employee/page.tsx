"use client";
import { MainLayout } from "@/layout/mainLayout";
import { EmployeeTable } from "./components/EmployeeTable";
import React, { useEffect } from "react";

export default function EmployeePage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/employee");
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
    <MainLayout title="Employee">
      <EmployeeTable  data={tableData} isLoading={isLoading} />
    </MainLayout>
  );
}
