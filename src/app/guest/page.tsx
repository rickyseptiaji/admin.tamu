import GuestClient from "@/components/features/guest/page";

async function getGuests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const guests = await getGuests();
  return <GuestClient guests={guests} />;
}
