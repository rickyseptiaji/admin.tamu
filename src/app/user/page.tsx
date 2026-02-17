import UserClient from "@/components/features/user/page";


async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
    next: { revalidate: 10 },
  });

  return res.json();
}

export default async function Page() {
  const users = await getUsers();
  return <UserClient users={users} />;
}
