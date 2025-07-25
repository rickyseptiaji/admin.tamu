"use client";


import EditEmployeeForm from "@/components/features/employee/form/edit/edit-employee-form";
import { MainLayout } from "@/layout/mainLayout";
export default function EditEmployee() {

  return (
    <MainLayout title="Update Employee">
      <div className="px-4">
        <div className="grid w-full max-w-sm items-center gap-3">
        <EditEmployeeForm/>
        </div>
      </div>
    </MainLayout>
  );
}
