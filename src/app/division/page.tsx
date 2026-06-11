import DivisionClient from "@/components/features/division/page";

async function getDivisions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/division`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch divisions");
  }

  return res.json();
}

export default async function Page() {
  const initialDivisions = await getDivisions();

  return (
    <DivisionClient
      initialDivisions={initialDivisions}
    />
  );
}