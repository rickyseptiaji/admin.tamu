"use client";

import { MainLayout } from "@/layout/mainLayout";
import CreateUserForm from "./form";

export default function CreatePageUser() {
  return (
    <MainLayout title="Create User">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <CreateUserForm />
        </div>
      </div>
    </MainLayout>
  );
}
