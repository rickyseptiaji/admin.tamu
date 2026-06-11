"use client";

import useSWR from "swr";
import { MainLayout } from "@/layout/mainLayout";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { VisitorUserTable } from "../history/components/VisitorTable";
import EditUserForm from "../edit/form";
import { fetcher } from "@/lib/fetcher";

export default function ViewUserPage({
  userId,
  initialUser,
  initialHistory,
}: {
  userId: string;
  initialUser: any;
  initialHistory: any[];
}) {
  const { data: userData, isValidating: userValidating } = useSWR(
    `/api/user/${userId}`,
    fetcher,
    {
      fallbackData: initialUser,
    },
  );

  const {
    data: historyData = [],
    isLoading: historyValidating,
    mutate,
  } = useSWR(`/api/user/history/${userId}`, fetcher, {
    fallbackData: initialHistory,
  });
  const loading = userValidating || historyValidating;

  return (
    <MainLayout title="Detail User">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto space-y-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <EditUserForm data={userData} />

              <VisitorUserTable data={historyData} mutate={mutate} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
