import ViewGuestPage from "@/components/features/guest/view/page";
async function getGuest(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/guest/${id}`,
    {
      cache: "no-store",
    },
  );

  return res.json();
}

async function getHistory(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/guest/history/${id}`,
    {
      cache: "no-store",
    },
  );

  return res.json();
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [initialGuest, initialHistory] = await Promise.all([
    getGuest(id),
    getHistory(id),
  ]);
  return (
    <>
      <ViewGuestPage guestId={id} initialGuest={initialGuest} initialHistory={initialHistory} />
    </>
  );
}
