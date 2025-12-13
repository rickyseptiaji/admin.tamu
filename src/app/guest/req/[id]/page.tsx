"use client"

import ReqGuestPage from "@/components/features/guest/req/page";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <ReqGuestPage guestId={params.id as string} />;
}
