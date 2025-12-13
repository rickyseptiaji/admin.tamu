"use client";

import ReqUserPage from "@/components/features/user/req/page";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <ReqUserPage userId={params.id as string} />;
}
