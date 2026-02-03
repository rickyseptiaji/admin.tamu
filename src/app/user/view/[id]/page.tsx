import ViewUserPage from "@/components/features/user/view/page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <ViewUserPage userId={id} />
    </>
  );
}
