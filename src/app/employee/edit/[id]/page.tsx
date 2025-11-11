"use client";

import EditPageEmployee from "@/components/features/employee/form/edit/page";
import { useParams } from "next/navigation";
export default function EditEmployee() {
  const params = useParams();
  return <EditPageEmployee employeeId={params.id as string} />;
}
