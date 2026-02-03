"use client";

import { MainLayout } from "@/layout/mainLayout";
import React, { useEffect } from "react";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import EditUserHistory from "./form";

export default function EditPageUserHistory({
  historyId,
}: {
  historyId: string;
}) {
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [formData, setFormData] = React.useState(null);
  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/user/history/view/${historyId}`);
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
  }, []);

  return (
    <MainLayout title="Edit Guest History">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          {initialLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <EditUserHistory data={formData} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
