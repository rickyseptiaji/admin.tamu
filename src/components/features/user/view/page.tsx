"use client";

import { MainLayout } from "@/layout/mainLayout";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import React, { useEffect } from "react";
import { VisitorUserTable } from "../history/components/VisitorTable";
import EditUserForm from "../edit/form";



export default function ViewUserPage({ userId }: { userId: string }) {
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [formData, setFormData] = React.useState<any[]>([]);
  const [tableData, setTableData] = React.useState<any[]>([]);

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/user/history/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setInitialLoading(false);
    }
  };
  const fetchDataUser = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataUser();
  }, [userId]);

  return (
    <MainLayout title="Detail User">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto space-y-6">
          {initialLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <EditUserForm data={formData} />
              <VisitorUserTable data={tableData} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
