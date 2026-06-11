"use client";

import { MainLayout } from "@/layout/mainLayout";
import EditGuestForm from "../edit/form";
import { VisitorGuestTable } from "../history/components/VisitorTable";
import React, { useEffect } from "react";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export default function ViewGuestPage({
  guestId,
  initialGuest,
  initialHistory,
}: {
  guestId: string;
  initialGuest: any;
  initialHistory: any[];
}) {
 const { data: guestData, isValidating: userValidating } = useSWR(
    `/api/guest/${guestId}`,
    fetcher,
    {
      fallbackData: initialGuest,
    },
  );

  const {
    data: historyData = [],
    isLoading: historyValidating,
    mutate,
  } = useSWR(`/api/user/history/${guestId}`, fetcher, {
    fallbackData: initialHistory,
  });
  const loading = userValidating || historyValidating;
  return (
    <>
      <MainLayout title="Detail Guest">
        <div className="flex items-center justify-center">
          <div className="w-full max-x-md px-4 mx-auto space-y-6">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <EditGuestForm data={guestData} />
                <VisitorGuestTable data={historyData} mutate={mutate} />
              </>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
