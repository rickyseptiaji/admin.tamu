"use client";
import EditDivisionPage from "@/components/features/division/form/edit/page";
import { useParams } from "next/navigation";

export default function EditDivision() {
  const params = useParams()
  return (
    <EditDivisionPage divisionId={params.id as string} />
  );
}
