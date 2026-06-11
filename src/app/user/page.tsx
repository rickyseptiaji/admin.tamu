import UserClient from "@/components/features/user/page";


async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
  cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export default async function Page() {
  const users = await getUsers();
  return <UserClient initialUser={users}  />;
}
