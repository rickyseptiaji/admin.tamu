"use client"
import { MainLayout } from "@/layout/mainLayout";
import CreateReqUserForm from "./form";

export default function ReqUserPage({userId}: {userId: string}) {
  return (
    <MainLayout title="Create Req user">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <CreateReqUserForm userId={userId}/>
        </div>
      </div>
    </MainLayout>
  );
}
