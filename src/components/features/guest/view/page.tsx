"use client";

import { MainLayout } from "@/layout/mainLayout";
import EditGuestForm from "../edit/form";
import { VisitorGuestTable } from "../history/components/VisitorTable";
import React, { useEffect } from "react";
import { LoadingSpinner } from "../../shared/LoadingSpinner";

export default function ViewGuestPage({ guestId }: { guestId: string }) {
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [formData, setFormData] = React.useState<any[]>([]);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/guest/history/${guestId}`);
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
      const response = await fetch(`/api/guest/${guestId}`);
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
  }, []);
  return (
    <>
      <MainLayout title="Detail Guest">
        <div className="flex items-center justify-center">
          <div className="w-full max-x-md px-4 mx-auto space-y-6">
            {initialLoading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <EditGuestForm data={formData} />
                <VisitorGuestTable data={tableData} />
              </>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
