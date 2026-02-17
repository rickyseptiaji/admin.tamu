

import ReqGuestPage from "@/components/features/guest/req/page";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return( <ReqGuestPage guestId={id} /> );
}
