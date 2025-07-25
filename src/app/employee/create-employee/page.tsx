"use client";

import CreateEmployeeForm from "@/components/features/employee/form/create/create-employee-form";
import { MainLayout } from "@/layout/mainLayout";
export default function CreateEmployee() {

  return (
    <MainLayout title="Create Employee">
      <div className="px-4">
        <div className="grid w-full max-w-sm items-center gap-3">
        <CreateEmployeeForm/>
        </div>
      </div>
    </MainLayout>
  );
}
