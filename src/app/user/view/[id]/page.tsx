import ViewUserPage from "@/components/features/user/view/page";

async function getUser(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

async function getHistory(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/history/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [initialUser, initialHistory] = await Promise.all([
    getUser(id),
    getHistory(id),
  ]);

  return (
    <ViewUserPage
      userId={id}
      initialUser={initialUser}
      initialHistory={initialHistory}
    />
  );
}