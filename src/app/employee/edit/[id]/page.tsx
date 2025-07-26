"use client";


import EditEmployeeForm from "@/components/features/employee/form/edit/edit-employee-form";
import { MainLayout } from "@/layout/mainLayout";
import { useParams } from "next/navigation";
export default function EditEmployee() {
const params = useParams();
  return (
    <MainLayout title="Update Employee">
      <div className="px-4">
        <div className="grid w-full max-w-sm items-center gap-3">
        <EditEmployeeForm employeeId={params.id as string}/>
        </div>
      </div>
    </MainLayout>
  );
}
