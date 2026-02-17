import UserClient from "@/components/features/user/page";


async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
  cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const users = await getUsers();
  return <UserClient users={users} />;
}
