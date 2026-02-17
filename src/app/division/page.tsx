import DivisionClient from "@/components/features/division/page";
async function getDivisions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/division`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const divisions = await getDivisions();
  return <DivisionClient divisions={divisions} />;
}