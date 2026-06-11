import EmployeeClient from "@/components/features/employee/page";
async function getEmployees() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/employee`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch employee");
  }
  return res.json();
}

export default async function Page() {
  const employees = await getEmployees();
  return <EmployeeClient initialEmployee={employees} />;
}
