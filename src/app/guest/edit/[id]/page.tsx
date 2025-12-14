"use client"

import EditPageGuest from "@/components/features/guest/edit/[id]/page";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <EditPageGuest guestId={params.id as string} />;
}