import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect, useState } from "react";
import { UserTable } from "./components/UserTable";

export default function GuestPage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
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
    fetchData();
  }, []);
  return (
    <>
      <MainLayout title="Create User">
        <UserTable data={tableData} isLoading={isLoading} />
      </MainLayout>
    </>
  );
}
